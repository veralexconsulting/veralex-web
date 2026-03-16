'use server';

import { requireAdmin } from '@/lib/auth';
import { createActionClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export type ActionResult = {
    error?: string;
    success?: boolean;
};

export async function updateOrderStatus(formData: FormData): Promise<ActionResult> {
    await requireAdmin();
    const supabase = createActionClient();

    const orderId = formData.get('orderId') as string;
    const status = formData.get('status') as string;
    const adminNotes = formData.get('adminNotes') as string;

    if (!orderId || !status) {
        return { error: 'Order ID dan status wajib diisi.' };
    }

    const updateData: Record<string, unknown> = { status };
    if (adminNotes !== null && adminNotes !== undefined) {
        updateData.admin_notes = adminNotes || null;
    }

    const { error } = await supabase
        .from('orders')
        .update(updateData)
        .eq('id', orderId);

    if (error) {
        return { error: 'Gagal memperbarui status: ' + error.message };
    }

    revalidatePath(`/admin/orders/${orderId}`);
    revalidatePath('/admin');
    return { success: true };
}

export async function addProgressStep(formData: FormData): Promise<ActionResult> {
    await requireAdmin();
    const supabase = createActionClient();

    const orderId = formData.get('orderId') as string;
    const stepNumber = parseInt(formData.get('stepNumber') as string);
    const stepName = formData.get('stepName') as string;
    const status = (formData.get('status') as string) || 'pending';
    const notes = formData.get('notes') as string;

    if (!orderId || !stepName || isNaN(stepNumber)) {
        return { error: 'Order ID, nomor langkah, dan nama langkah wajib diisi.' };
    }

    const { data: { user } } = await supabase.auth.getUser();

    const { error } = await supabase
        .from('order_progress')
        .insert({
            order_id: orderId,
            step_number: stepNumber,
            step_name: stepName,
            status: status as 'pending' | 'in_progress' | 'completed' | 'skipped',
            notes: notes || null,
            updated_by: user?.id || null,
        });

    if (error) {
        return { error: 'Gagal menambah progress: ' + error.message };
    }

    revalidatePath(`/admin/orders/${orderId}`);
    return { success: true };
}

export async function updateProgressStep(formData: FormData): Promise<ActionResult> {
    await requireAdmin();
    const supabase = createActionClient();

    const stepId = formData.get('stepId') as string;
    const orderId = formData.get('orderId') as string;
    const status = formData.get('status') as string;
    const notes = formData.get('notes') as string;

    if (!stepId || !status) {
        return { error: 'Step ID dan status wajib diisi.' };
    }

    const { data: { user } } = await supabase.auth.getUser();

    const { error } = await supabase
        .from('order_progress')
        .update({
            status: status as 'pending' | 'in_progress' | 'completed' | 'skipped',
            notes: notes || null,
            updated_by: user?.id || null,
        })
        .eq('id', stepId);

    if (error) {
        return { error: 'Gagal memperbarui progress: ' + error.message };
    }

    revalidatePath(`/admin/orders/${orderId}`);
    return { success: true };
}

export async function uploadDocument(formData: FormData): Promise<ActionResult> {
    await requireAdmin();
    const supabase = createActionClient();

    const orderId = formData.get('orderId') as string;
    const docType = formData.get('docType') as string;
    const file = formData.get('file') as File;

    if (!orderId || !docType || !file) {
        return { error: 'Order ID, tipe dokumen, dan file wajib diisi.' };
    }

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        return { error: 'Tidak terautentikasi.' };
    }

    // Upload to Supabase Storage
    const fileExt = file.name.split('.').pop();
    const fileName = `${orderId}/${Date.now()}.${fileExt}`;

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

    // Insert document record
    const { error: insertError } = await supabase
        .from('documents')
        .insert({
            order_id: orderId,
            doc_type: docType,
            file_name: file.name,
            file_url: urlData.publicUrl,
            uploaded_by: user.id,
        });

    if (insertError) {
        return { error: 'Gagal menyimpan data dokumen: ' + insertError.message };
    }

    revalidatePath(`/admin/orders/${orderId}`);
    return { success: true };
}

export async function verifyPayment(formData: FormData): Promise<ActionResult> {
    await requireAdmin();
    const supabase = createActionClient();

    const paymentId = formData.get('paymentId') as string;
    const orderId = formData.get('orderId') as string;

    if (!paymentId || !orderId) {
        return { error: 'Payment ID dan Order ID wajib diisi.' };
    }

    const { data: { user } } = await supabase.auth.getUser();

    const { error } = await supabase
        .from('payments')
        .update({
            status: 'verified',
            verified_by: user?.id || null,
            verified_at: new Date().toISOString(),
        })
        .eq('id', paymentId);

    if (error) {
        return { error: 'Gagal memverifikasi pembayaran: ' + error.message };
    }

    // Also update order status to paid
    await supabase
        .from('orders')
        .update({ status: 'paid' })
        .eq('id', orderId);

    revalidatePath(`/admin/orders/${orderId}`);
    revalidatePath('/admin');
    return { success: true };
}

export async function rejectPayment(formData: FormData): Promise<ActionResult> {
    await requireAdmin();
    const supabase = createActionClient();

    const paymentId = formData.get('paymentId') as string;
    const orderId = formData.get('orderId') as string;
    const reason = formData.get('reason') as string;

    if (!paymentId || !orderId) {
        return { error: 'Payment ID dan Order ID wajib diisi.' };
    }

    const { error } = await supabase
        .from('payments')
        .update({
            status: 'rejected',
            rejection_reason: reason || 'Bukti pembayaran tidak valid.',
        })
        .eq('id', paymentId);

    if (error) {
        return { error: 'Gagal menolak pembayaran: ' + error.message };
    }

    revalidatePath(`/admin/orders/${orderId}`);
    return { success: true };
}
