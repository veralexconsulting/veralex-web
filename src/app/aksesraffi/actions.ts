'use server';

import { redirect } from 'next/navigation';
import { currentOwner, ownerAuthEmail, ownerConfigured, ownerUserId, rotateOwnerPassword, strongEnough } from '@/lib/owner/auth';
import { recordLoginEvent, requestIp } from '@/lib/owner/events';
import { workspaceRateLimit } from '@/lib/workspace/rate-limit';
import { workspaceSupabase } from '@/lib/workspace/supabase';

// One message for every failure so the form cannot be used to discover accounts.
const GENERIC = 'Nama pengguna atau kata sandi tidak sesuai.';

export type OwnerFormResult = { error?: string };

export async function ownerSignIn(formData: FormData): Promise<OwnerFormResult> {
    const username = String(formData.get('username') ?? '').trim();
    const password = String(formData.get('password') ?? '');
    if (!username || !password) return { error: 'Isi nama pengguna dan kata sandi.' };

    try {
        await workspaceRateLimit(await requestIp(), 'owner_login', 10);
        await workspaceRateLimit(username.toLowerCase(), 'owner_login_name', 20);
    } catch {
        return { error: 'Terlalu banyak percobaan. Coba lagi beberapa menit lagi.' };
    }
    if (!ownerConfigured()) return { error: 'Layanan masuk pemilik belum dikonfigurasi.' };

    // The username is only a public handle. Proof is the Supabase Auth session
    // of the one immutable UUID named in VERALEX_OWNER_USER_ID.
    const email = await ownerAuthEmail();
    if (!email) return { error: GENERIC };

    const auth = await workspaceSupabase();
    const { data, error } = await auth.auth.signInWithPassword({ email, password });
    const expected = ownerUserId();
    if (error || !data.user || !expected || data.user.id.toLowerCase() !== expected) {
        await auth.auth.signOut();
        return { error: GENERIC };
    }

    await recordLoginEvent(expected, 'owner');
    const owner = await currentOwner();
    redirect(owner?.mustChangePassword ? '/aksesraffi/ganti-password' : '/aksesraffi');
}

export async function ownerChangePassword(formData: FormData): Promise<OwnerFormResult> {
    const password = String(formData.get('password') ?? '');
    const confirm = String(formData.get('confirm') ?? '');
    if (password !== confirm) return { error: 'Konfirmasi kata sandi tidak cocok.' };
    if (!strongEnough(password)) return { error: 'Gunakan minimal 12 karakter, huruf besar, huruf kecil, dan angka.' };
    try {
        await rotateOwnerPassword(password);
    } catch (cause) {
        return { error: cause instanceof Error ? cause.message : 'Kata sandi belum dapat diubah.' };
    }
    redirect('/aksesraffi');
}

export async function ownerSignOut(): Promise<void> {
    await (await workspaceSupabase()).auth.signOut();
    redirect('/aksesraffi/login');
}
