import 'server-only';
import { isTransientAuthError, WorkspaceAuthUnavailableError } from '@/lib/workspace/auth-errors';
import { one, transaction } from '@/lib/workspace/db';
import { serviceConfigured, supabaseConfigured, workspaceServiceClient, workspaceSupabase } from '@/lib/workspace/supabase';

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/** Public handle only. It is never proof of identity. */
export const OWNER_USERNAME = 'raffiganteng';

export type OwnerIdentity = { id: string; mustChangePassword: boolean };

/** Authorization is the immutable Supabase Auth UUID. Missing or malformed config denies. */
export function ownerUserId(): string | null {
    const value = process.env.VERALEX_OWNER_USER_ID?.trim();
    return value && UUID.test(value) ? value.toLowerCase() : null;
}

export function ownerConfigured(): boolean {
    return ownerUserId() !== null && supabaseConfigured();
}

export async function currentOwner(): Promise<OwnerIdentity | null> {
    const expected = ownerUserId();
    if (!expected || !supabaseConfigured()) return null;
    const auth = await workspaceSupabase();
    const { data: { user }, error } = await auth.auth.getUser();
    if (error) {
        if (isTransientAuthError(error)) throw new WorkspaceAuthUnavailableError();
        return null;
    }
    if (!user || user.id.toLowerCase() !== expected) return null;
    const profile = await one<{ must_change_password: boolean }>('select must_change_password from public.profiles where id=$1', [expected]);
    if (!profile) return null;
    return { id: expected, mustChangePassword: profile.must_change_password };
}

/** Server-only lookup of the hidden Auth email. Never returned to a browser. */
export async function ownerAuthEmail(): Promise<string | null> {
    const id = ownerUserId();
    if (!id || !serviceConfigured()) return null;
    const { data, error } = await workspaceServiceClient().auth.admin.getUserById(id);
    const email = data?.user?.email;
    return error || !email ? null : email;
}

export function strongEnough(password: string): boolean {
    return password.length >= 12 && password.length <= 128 && /[a-z]/.test(password) && /[A-Z]/.test(password) && /\d/.test(password);
}

export async function rotateOwnerPassword(password: string): Promise<void> {
    const owner = await currentOwner();
    if (!owner || !owner.mustChangePassword) throw new Error('Perubahan kata sandi tidak tersedia.');
    if (!strongEnough(password)) throw new Error('Gunakan minimal 12 karakter, huruf besar, huruf kecil, dan angka.');
    const { error } = await workspaceServiceClient().auth.admin.updateUserById(owner.id, { password });
    if (error) throw new Error('Kata sandi belum dapat diubah.');
    await transaction(async client => {
        await client.query('update public.profiles set must_change_password=false,updated_at=now() where id=$1', [owner.id]);
        await client.query('insert into public.audit_logs(actor_user_id,event_type,message) values($1,$2,$3)', [owner.id, 'owner_password_rotated', 'Pemilik akun mengganti kata sandi awal.']);
    });
}
