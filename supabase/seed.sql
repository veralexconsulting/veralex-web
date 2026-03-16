-- ================================================
-- VERALEX Seed Data
-- Run this in Supabase SQL Editor after applying schema.sql
-- ================================================

-- ===== SERVICES (all 15) =====
-- Clear existing services first (if re-seeding)
DELETE FROM services WHERE true;

INSERT INTO services (name, slug, price, estimated_days, description, category) VALUES
-- Kekayaan Intelektual
('Pendaftaran Merek', 'pendaftaran-merek', 2500000, 180, 'Jasa pendaftaran merek dagang di Indonesia melalui DJKI Kemenkumham. Kami membantu dari pengecekan hingga sertifikat merek terbit.', 'Kekayaan Intelektual'),
('Perpanjangan Merek', 'perpanjangan-merek', 6000000, 90, 'Jasa perpanjangan hak merek yang sudah terdaftar agar tetap terlindungi secara hukum.', 'Kekayaan Intelektual'),
('Pengalihan Merek', 'pengalihan-merek', 3000000, 60, 'Jasa pengalihan hak kepemilikan merek dari satu pihak ke pihak lain secara legal.', 'Kekayaan Intelektual'),
('Pendaftaran Hak Cipta', 'hak-cipta', 2500000, 90, 'Perlindungan karya cipta Anda secara hukum melalui pendaftaran di Kemenkumham.', 'Kekayaan Intelektual'),
('Pendaftaran Desain Industri', 'desain-industri', 4500000, 120, 'Lindungi desain produk Anda dari peniruan dengan pendaftaran desain industri.', 'Kekayaan Intelektual'),

-- Legalitas Perusahaan
('Pendirian PT PMDN / PT Umum', 'pt-pmdn', 6500000, 14, 'Pendirian PT PMDN lengkap dengan legalitas dan izin usaha. Sudah termasuk website company profile GRATIS.', 'Legalitas Perusahaan'),
('Pendirian CV', 'pendirian-cv', 3000000, 10, 'Pendirian CV untuk usaha kecil dan menengah dengan proses cepat dan legalitas lengkap.', 'Legalitas Perusahaan'),
('Pendirian PT Perorangan', 'pt-perorangan', 1500000, 7, 'PT dengan pemilik tunggal — solusi legal terjangkau untuk wirausaha.', 'Legalitas Perusahaan'),
('Pendirian PT PMA', 'pt-pma', 9900000, 21, 'Pendirian perusahaan penanaman modal asing (PMA) di Indonesia dengan legalitas lengkap.', 'Legalitas Perusahaan'),

-- Visa & ITAS
('ITAS Investor 1 Tahun', 'itas-investor-1-tahun', 16000000, 30, 'Izin tinggal terbatas untuk investor asing di Indonesia selama 1 tahun.', 'Visa & ITAS'),
('ITAS Investor 2 Tahun', 'itas-investor-2-tahun', 18000000, 45, 'Izin tinggal terbatas untuk investor asing di Indonesia selama 2 tahun.', 'Visa & ITAS'),
('Visa C2', 'visa-c2', 3500000, 14, 'Visa kunjungan sosial budaya untuk tinggal sementara di Indonesia.', 'Visa & ITAS'),
('Visa D2 (1 Tahun)', 'visa-d2-1-tahun', 6000000, 21, 'Visa tinggal terbatas untuk berbagai keperluan selama 1 tahun.', 'Visa & ITAS'),
('Visa D2 (2 Tahun)', 'visa-d2-2-tahun', 9500000, 30, 'Visa tinggal terbatas untuk berbagai keperluan selama 2 tahun.', 'Visa & ITAS'),
('KITAS Kerja (1 Tahun)', 'kitas-kerja', 45000000, 30, 'KITAS untuk pekerja asing, sudah termasuk DPKK ($1200 USD) dan RPTKA.', 'Visa & ITAS');

-- ===== ADMIN ACCOUNT =====
-- NOTE: You must FIRST create this user in Supabase Authentication:
--   1. Go to Supabase Dashboard → Authentication → Users
--   2. Click "Add user" → "Create new user"
--   3. Email: admin@veralex.com
--   4. Password: 12345678910
--   5. Uncheck "Auto confirm email" (or make sure email confirmation is OFF globally)
--   6. Click "Create user"
--   7. Copy the user's UUID from the table
--   8. Replace <ADMIN_USER_UUID> below with that UUID

-- After creating the auth user, run this:
-- INSERT INTO users (id, email, role, full_name, phone) VALUES
-- ('<ADMIN_USER_UUID>', 'admin@veralex.com', 'admin', 'Veralex Admin', NULL);

-- ===== IMPORTANT: DISABLE EMAIL CONFIRMATION =====
-- Go to Supabase Dashboard → Authentication → Providers → Email
-- Turn OFF "Confirm email" toggle
-- This allows users to sign up and immediately be logged in
