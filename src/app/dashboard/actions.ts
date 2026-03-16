'use server';

import { requireUser } from '@/lib/auth';
import { createActionClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export type ActionResult = {
    error?: string;
    success?: boolean;
};

export async function uploadPaymentProof(formData: FormData): Promise<ActionResult> {
    const user = await requireUser();
    const supabase = createActionClient();

    const orderId = formData.get('orderId') as string;
    const file = formData.get('file') as File;

    if (!orderId || !file) {
        return { error: 'Order ID dan file bukti pembayaran wajib diisi.' };
    }

    // Verify order belongs to client
    const { data: order } = await supabase
        .from('orders')
        .select('id, service_id')
        .eq('id', orderId)
        .eq('client_id', user.id)
        .single();

    if (!order) {
        return { error: 'Pesanan tidak ditemukan.' };
    }

    // Get service price for the payment amount
    const { data: service } = await supabase
        .from('services')
        .select('price')
        .eq('id', order.service_id)
        .single();

    // Upload to storage
    const fileExt = file.name.split('.').pop();
    const fileName = `payments/${orderId}/${Date.now()}.${fileExt}`;

    const { error: uploadError } = await supabase
        .storage
        .from('order-documents')
        .upload(fileName, file);

    if (uploadError) {
        return { error: 'Gagal mengupload file: ' + uploadError.message };
    }

    // Get public URL
    const { data: urlData } = supabase
        .storage
        .from('order-documents')
        .getPublicUrl(fileName);

    // Insert payment record
    const { error: insertError } = await supabase
        .from('payments')
        .insert({
            order_id: orderId,
            amount: service?.price || 0,
            proof_url: urlData.publicUrl,
            status: 'uploaded',
        });

    if (insertError) {
        return { error: 'Gagal menyimpan data pembayaran: ' + insertError.message };
    }

    revalidatePath(`/dashboard/orders/${orderId}`);
    return { success: true };
}

export async function cancelOrder(formData: FormData): Promise<ActionResult> {
    const user = await requireUser();
    const supabase = createActionClient();

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
