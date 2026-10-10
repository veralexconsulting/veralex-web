import { requireAdmin } from '@/lib/auth';
import { createServerClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import AdminOrderDetailClient from './AdminOrderDetailClient';

export const dynamic = 'force-dynamic';

interface AdminOrderDetailProps {
    params: Promise<{ id: string }>;
}

export default async function AdminOrderDetailPage({ params }: AdminOrderDetailProps) {
    const { id } = await params;
    await requireAdmin();
    const supabase = await createServerClient();

    // Fetch order
    const { data: order, error } = await supabase
        .from('orders')
        .select('*')
        .eq('id', id)
        .single();

    if (error || !order) {
        notFound();
    }

    // Fetch service
    const { data: service } = await supabase
        .from('services')
        .select('name, price, estimated_days, category')
        .eq('id', order.service_id)
        .single();

    // Fetch client info
    const { data: client } = await supabase
        .from('users')
        .select('full_name, email')
        .eq('id', order.client_id)
        .single();

    // Fetch progress
    const { data: progress } = await supabase
        .from('order_progress')
        .select('*')
        .eq('order_id', id)
        .order('step_number', { ascending: true });

    // Fetch payments
    const { data: payments } = await supabase
        .from('payments')
        .select('*')
        .eq('order_id', id)
        .order('created_at', { ascending: false });

    return (
        <AdminOrderDetailClient
            order={order}
            service={service}
            progress={progress || []}
            payments={payments || []}
            clientName={client?.full_name || 'Unknown'}
            clientEmail={client?.email || ''}
        />
    );
}
