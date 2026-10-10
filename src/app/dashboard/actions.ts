'use server';

import { requireUser } from '@/lib/auth';
import { createActionClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export type ActionResult = {
    error?: string;
    success?: boolean;
};

export async function cancelOrder(formData: FormData): Promise<ActionResult> {
    const user = await requireUser();
    const supabase = await createActionClient();

    const orderId = formData.get('orderId') as string;

    if (!orderId) {
        return { error: 'Order ID wajib diisi.' };
    }

    // Verify order belongs to client and is still pending
    const { data: order } = await supabase
        .from('orders')
        .select('id, status')
        .eq('id', orderId)
        .eq('client_id', user.id)
        .single();

    if (!order) {
        return { error: 'Pesanan tidak ditemukan.' };
    }

    if (order.status !== 'pending') {
        return { error: 'Hanya pesanan dengan status "Menunggu" yang dapat dibatalkan.' };
    }

    const { error: updateError } = await supabase
        .from('orders')
        .update({ status: 'cancelled' })
        .eq('id', orderId);

    if (updateError) {
        return { error: 'Gagal membatalkan pesanan: ' + updateError.message };
    }

    revalidatePath(`/dashboard/orders/${orderId}`);
    revalidatePath('/dashboard/orders');
    return { success: true };
}
