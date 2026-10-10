import { requireUser } from '@/lib/auth';
import { createServerClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import OrderDetailClient from './OrderDetailClient';

export const dynamic = 'force-dynamic';

interface OrderDetailProps {
    params: Promise<{ id: string }>;
}

export default async function OrderDetailPage({ params }: OrderDetailProps) {
    const { id } = await params;
    const user = await requireUser();
    const supabase = await createServerClient();

    // Fetch order (RLS ensures client can only see own orders)
    const { data: order, error } = await supabase
        .from('orders')
        .select('*')
        .eq('id', id)
        .eq('client_id', user.id)
        .single();

    if (error || !order) {
        notFound();
    }

    // Fetch service info
    const { data: service } = await supabase
        .from('services')
        .select('name, price, estimated_days, category')
        .eq('id', order.service_id)
        .single();

    // Fetch progress timeline
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
        <OrderDetailClient
            order={order}
            service={service}
            progress={progress || []}
            payments={payments || []}
        />
    );
}
