// ===== Enums =====

export type UserRole = 'client' | 'admin';
export type OrderStatus = 'pending' | 'paid' | 'in_progress' | 'completed' | 'cancelled';
export type StepStatus = 'pending' | 'in_progress' | 'completed' | 'skipped';
export type PaymentStatus = 'pending' | 'uploaded' | 'verified' | 'rejected';

// ===== Row types =====

export interface User {
    id: string;
    email: string;
    role: UserRole;
    full_name: string;
    phone: string | null;
    created_at: string;
    updated_at: string;
}

export interface Service {
    id: string;
    name: string;
    slug: string;
    price: number;
    estimated_days: number;
    description: string | null;
    category: string;
    is_active: boolean;
    created_at: string;
}

export interface Order {
    id: string;
    client_id: string;
    service_id: string;
    company_data: Record<string, unknown>;
    status: OrderStatus;
    admin_notes: string | null;
    created_at: string;
    updated_at: string;
}

export interface OrderProgress {
    id: string;
    order_id: string;
    step_number: number;
    step_name: string;
    status: StepStatus;
    notes: string | null;
    updated_by: string | null;
    updated_at: string;
}

export interface Payment {
    id: string;
    order_id: string;
    amount: number;
    proof_url: string | null;
    status: PaymentStatus;
    rejection_reason: string | null;
    verified_by: string | null;
    verified_at: string | null;
    created_at: string;
}

export interface Document {
    id: string;
    order_id: string;
    doc_type: string;
    file_name: string;
    file_url: string;
    uploaded_by: string;
    uploaded_at: string;
}

// ===== Database schema map (for Supabase generic type) =====

export interface Database {
    public: {
        Tables: {
            users: { Row: User; Insert: Omit<User, 'created_at' | 'updated_at'>; Update: Partial<Omit<User, 'id'>> };
            services: { Row: Service; Insert: Omit<Service, 'id' | 'created_at'>; Update: Partial<Omit<Service, 'id'>> };
            orders: { Row: Order; Insert: Omit<Order, 'id' | 'created_at' | 'updated_at'>; Update: Partial<Omit<Order, 'id'>> };
            order_progress: { Row: OrderProgress; Insert: Omit<OrderProgress, 'id' | 'updated_at'>; Update: Partial<Omit<OrderProgress, 'id'>> };
            payments: { Row: Payment; Insert: Omit<Payment, 'id' | 'created_at'>; Update: Partial<Omit<Payment, 'id'>> };
            documents: { Row: Document; Insert: Omit<Document, 'id' | 'uploaded_at'>; Update: Partial<Omit<Document, 'id'>> };
        };
    };
}
