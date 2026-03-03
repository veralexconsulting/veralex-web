-- ================================================
-- VERALEX Legal Services Management System
-- PostgreSQL (Supabase) Schema
-- ================================================

-- ===== ENUMS =====
CREATE TYPE user_role AS ENUM ('client', 'admin');
CREATE TYPE order_status AS ENUM ('pending', 'paid', 'in_progress', 'completed', 'cancelled');
CREATE TYPE step_status AS ENUM ('pending', 'in_progress', 'completed', 'skipped');
CREATE TYPE payment_status AS ENUM ('pending', 'uploaded', 'verified', 'rejected');

-- ===== 1. USERS =====
CREATE TABLE users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE,
    role user_role NOT NULL DEFAULT 'client',
    full_name TEXT NOT NULL,
    phone TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_email ON users(email);

-- ===== 2. SERVICES =====
CREATE TABLE services (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    price BIGINT NOT NULL CHECK (price >= 0),          -- stored in IDR (no decimals)
    estimated_days INT NOT NULL CHECK (estimated_days > 0),
    description TEXT,
    category TEXT NOT NULL,                             -- e.g. 'ip', 'company', 'visa', 'product'
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_services_slug ON services(slug);
CREATE INDEX idx_services_category ON services(category);
CREATE INDEX idx_services_active ON services(is_active) WHERE is_active = true;

-- ===== 3. ORDERS =====
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    service_id UUID NOT NULL REFERENCES services(id) ON DELETE RESTRICT,
    company_data JSONB NOT NULL DEFAULT '{}',           -- flexible per-service data
    status order_status NOT NULL DEFAULT 'pending',
    admin_notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_orders_client ON orders(client_id);
CREATE INDEX idx_orders_service ON orders(service_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created ON orders(created_at DESC);

-- ===== 4. ORDER_PROGRESS =====
CREATE TABLE order_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    step_number INT NOT NULL CHECK (step_number > 0),
    step_name TEXT NOT NULL,
    status step_status NOT NULL DEFAULT 'pending',
    notes TEXT,
    updated_by UUID REFERENCES users(id),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE(order_id, step_number)
);

CREATE INDEX idx_progress_order ON order_progress(order_id);
CREATE INDEX idx_progress_status ON order_progress(status);

-- ===== 5. PAYMENTS =====
CREATE TABLE payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    amount BIGINT NOT NULL CHECK (amount > 0),          -- IDR
    proof_url TEXT,                                      -- storage path to uploaded proof
    status payment_status NOT NULL DEFAULT 'pending',
    rejection_reason TEXT,
    verified_by UUID REFERENCES users(id),
    verified_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_payments_order ON payments(order_id);
CREATE INDEX idx_payments_status ON payments(status);

-- ===== 6. DOCUMENTS =====
CREATE TABLE documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    doc_type TEXT NOT NULL,                              -- e.g. 'akta', 'sk', 'npwp', 'nib', 'certificate'
    file_name TEXT NOT NULL,
    file_url TEXT NOT NULL,                              -- storage path
    uploaded_by UUID NOT NULL REFERENCES users(id),
    uploaded_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_documents_order ON documents(order_id);
CREATE INDEX idx_documents_type ON documents(doc_type);

-- ===== AUTO-UPDATE updated_at TRIGGER =====
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_users_updated_at
    BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_orders_updated_at
    BEFORE UPDATE ON orders FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_progress_updated_at
    BEFORE UPDATE ON order_progress FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ================================================
-- ROW-LEVEL SECURITY (RLS) POLICIES
-- ================================================

-- Helper: check if current user is admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
    SELECT EXISTS (
        SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
    );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- ----- USERS -----
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own profile"
    ON users FOR SELECT
    USING (id = auth.uid() OR is_admin());

CREATE POLICY "Users can update own profile"
    ON users FOR UPDATE
    USING (id = auth.uid())
    WITH CHECK (id = auth.uid() AND role = 'client');   -- clients can't self-promote to admin

CREATE POLICY "Admin can manage all users"
    ON users FOR ALL
    USING (is_admin());

-- ----- SERVICES -----
ALTER TABLE services ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read active services"
    ON services FOR SELECT
    USING (is_active = true OR is_admin());

CREATE POLICY "Admin can manage services"
    ON services FOR ALL
    USING (is_admin());

-- ----- ORDERS -----
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Clients see own orders"
    ON orders FOR SELECT
    USING (client_id = auth.uid() OR is_admin());

CREATE POLICY "Clients can create orders"
    ON orders FOR INSERT
    WITH CHECK (client_id = auth.uid());

CREATE POLICY "Admin can manage all orders"
    ON orders FOR ALL
    USING (is_admin());

-- ----- ORDER_PROGRESS -----
ALTER TABLE order_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Clients see own order progress"
    ON order_progress FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM orders WHERE orders.id = order_progress.order_id
            AND (orders.client_id = auth.uid() OR is_admin())
        )
    );

CREATE POLICY "Admin can manage progress"
    ON order_progress FOR ALL
    USING (is_admin());

-- ----- PAYMENTS -----
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Clients see own payments"
    ON payments FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM orders WHERE orders.id = payments.order_id
            AND (orders.client_id = auth.uid() OR is_admin())
        )
    );

CREATE POLICY "Clients can create payment proof"
    ON payments FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM orders WHERE orders.id = payments.order_id
            AND orders.client_id = auth.uid()
        )
    );

CREATE POLICY "Clients can update own pending payments"
    ON payments FOR UPDATE
    USING (
        status = 'pending' AND
        EXISTS (
            SELECT 1 FROM orders WHERE orders.id = payments.order_id
            AND orders.client_id = auth.uid()
        )
    );

CREATE POLICY "Admin can manage all payments"
    ON payments FOR ALL
    USING (is_admin());

-- ----- DOCUMENTS -----
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Clients see own documents"
    ON documents FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM orders WHERE orders.id = documents.order_id
            AND (orders.client_id = auth.uid() OR is_admin())
        )
    );

CREATE POLICY "Admin can manage documents"
    ON documents FOR ALL
    USING (is_admin());

-- ================================================
-- SAMPLE DATA
-- ================================================

-- Services
INSERT INTO services (name, slug, price, estimated_days, description, category) VALUES
('Pendirian PT PMDN', 'pt-pmdn', 6500000, 14, 'Pendirian PT PMDN lengkap dengan legalitas dan izin usaha', 'company'),
('Pendaftaran Merek', 'pendaftaran-merek', 2500000, 180, 'Pendaftaran merek dagang melalui DJKI Kemenkumham', 'ip'),
('KITAS Kerja (1 Tahun)', 'kitas-kerja', 45000000, 30, 'KITAS untuk pekerja asing, termasuk DPKK dan RPTKA', 'visa');

-- Progress templates (example for PT PMDN)
-- In production, you'd insert these when an order is created:
-- Step 1: Pengecekan Nama
-- Step 2: Pembuatan Akta Notaris
-- Step 3: Pengesahan Kemenkumham
-- Step 4: NPWP Perusahaan
-- Step 5: NIB / OSS
-- Step 6: Izin Usaha
-- Step 7: Serah Terima Dokumen
