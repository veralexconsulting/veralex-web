import 'server-only';
import { workspaceSupabase } from './supabase';
import { one } from './db';
import { isTransientAuthError, WorkspaceAuthUnavailableError } from './auth-errors';

export interface Actor { id: string; email: string; name: string; role: 'admin' | 'client'; active: boolean; mustChangePassword: boolean; google: boolean }
export async function currentActor(): Promise<Actor | null> {
  const auth = await workspaceSupabase();
  const { data: { user }, error } = await auth.auth.getUser();
  if (error) {
    if (isTransientAuthError(error)) throw new WorkspaceAuthUnavailableError();
    return null;
  }
  if (!user) return null;
  const profile = await one<{ role: 'admin' | 'client'; active: boolean; must_change_password: boolean; full_name: string; email: string }>('select role,active,must_change_password,full_name,email from public.profiles where id=$1', [user.id]);
  if (!profile) return null;
  const providers = user.app_metadata?.providers as string[] | undefined;
  return { id: user.id, email: profile.email, name: profile.full_name, role: profile.role, active: profile.active, mustChangePassword: profile.must_change_password, google: user.app_metadata?.provider === 'google' || Boolean(providers?.includes('google')) };
}
export async function requireWorkspaceAdmin(allowPasswordChange = false): Promise<Actor> {
  const actor = await currentActor();
  if (!actor || actor.role !== 'admin' || !actor.active || (!allowPasswordChange && actor.mustChangePassword)) throw new Error('Akses administrator ditolak.');
  return actor;
}
export async function requireWorkspaceClient(): Promise<Actor> {
  const actor = await currentActor();
  if (!actor || actor.role !== 'client' || !actor.active || !actor.google) throw new Error('Masuk dengan akun Google untuk membuka portal.');
  return actor;
}
