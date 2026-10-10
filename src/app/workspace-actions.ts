'use server';
import { randomUUID } from 'node:crypto';
import { adminSnapshot, clientSnapshot } from '@/lib/workspace/queries';
import { runOperation, type Operation } from '@/lib/workspace/operations';
import { inspectProjectInvitation, claimProjectInvitation, finishFirstPasswordChange } from '@/lib/workspace/claims';
import { currentActor } from '@/lib/workspace/auth';
import { recordLoginEvent as logVerifiedLogin } from '@/lib/owner/events';

export async function getWorkspaceSnapshot(role:'admin'|'client') { return role==='admin' ? adminSnapshot() : clientSnapshot(); }
const visibleOperationErrors = new Set([
  'Akses administrator ditolak.',
  'Akses klien sudah diklaim. Atur ulang klaim sebelum menerbitkan tautan baru.',
  'Catatan tidak boleh memuat nomor identitas atau isi berkas.',
  'Data proyek tidak valid.',
  'Klien yang dipilih tidak ditemukan.',
  'Administrator aktif terakhir tidak dapat dihapus.',
  'Akun sendiri tidak dapat dihapus.',
  'Akses akun tidak dapat dicabut.',
  'Anggota tim tidak ditemukan.',
  'Layanan tidak tersedia.',
  'PIC harus administrator aktif.',
  'Proyek tidak ditemukan.',
  'Proyek tidak valid.',
  'SOP layanan belum diterbitkan.',
]);

export async function mutateWorkspace(input:Operation): Promise<
  { ok:true; result:{ id?:string; token?:string } } | { ok:false; error:string }
> {
  try {
    return { ok:true, result:await runOperation(input) };
  } catch (cause) {
    if (cause instanceof Error && visibleOperationErrors.has(cause.message)) {
      return { ok:false, error:cause.message };
    }
    if(cause instanceof Error && (cause.message.startsWith('Klien masih terkait dengan')||cause.message.startsWith('Anggota tim masih ditugaskan pada'))) return {ok:false,error:cause.message};
    const reference = randomUUID().slice(0, 8);
    const databaseError = cause as { code?:unknown; constraint?:unknown };
    console.error('Workspace operation failed', {
      reference,
      operation:input?.type,
      code:typeof databaseError?.code === 'string' ? databaseError.code : 'unknown',
      constraint:typeof databaseError?.constraint === 'string' ? databaseError.constraint : undefined,
    });
    return { ok:false, error:`Aksi belum dapat disimpan. Kode bantuan: ${reference}.` };
  }
}
export async function inspectInvitation(token:string) { return inspectProjectInvitation(token); }
export async function claimInvitation(token:string) { return claimProjectInvitation(token); }
export async function changeInitialPassword(password:string) { return finishFirstPasswordChange(password); }
export async function getCurrentWorkspaceActor() { return currentActor(); }
/** Records one verified sign-in. Called only from a completed login, never from
 *  session restore, so refresh and token rotation are never counted. */
export async function recordLoginEvent() {
  try {
    const actor = await currentActor();
    if (!actor) return;
    await logVerifiedLogin(actor.id, actor.role);
  } catch {
    // Analytics is best-effort. Authenticated navigation must not depend on
    // an auxiliary profile lookup or audit database write succeeding.
  }
}
