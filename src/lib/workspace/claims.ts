import 'server-only';
import { headers } from 'next/headers';
import { one, transaction } from './db';
import { currentActor, requireWorkspaceClient } from './auth';
import { tokenHash, validTokenShape } from './token';
import { workspaceServiceClient } from './supabase';
import { workspaceRateLimit } from './rate-limit';

export type InvitationStatus = { state:'signin'|'unauthorized'|'valid'|'claimed_owned'|'claimed_other'|'expired'|'revoked'|'invalid'; projectTitle?:string; serviceName?:string; serviceId?:string; projectId?:string };
export async function inspectProjectInvitation(token:string):Promise<InvitationStatus> {
  if (!validTokenShape(token)) return {state:'invalid'};
  const requestHeaders=await headers(); const ip=requestHeaders.get('x-vercel-forwarded-for')||requestHeaders.get('x-real-ip')||'unknown';
  await workspaceRateLimit(ip,'invite_open',200);
  const actor=await currentActor(); if (!actor) return {state:'signin'}; if(actor.role!=='client'||!actor.active||!actor.google)return {state:'unauthorized'};
  await workspaceRateLimit(actor.id,'invite_inspect',100);
  const link=await one<{status:string;expires_at:Date;project_id:string;title:string;name:string;slug:string}>("select l.status,l.expires_at,l.project_id,p.title,s.name,s.slug from public.project_access_links l join public.projects p on p.id=l.project_id join public.workspace_services s on s.slug=p.service_slug where l.token_hash=$1",[tokenHash(token)]);
  if (!link) return {state:'invalid'};
  if (link.status==='revoked') return {state:'revoked'};
  if (link.status==='claimed') { const access=await one<{client_user_id:string}>('select client_user_id from public.client_project_access where project_id=$1 and revoked_at is null',[link.project_id]); return {state:access?.client_user_id===actor.id?'claimed_owned':'claimed_other',projectId:access?.client_user_id===actor.id?link.project_id:undefined}; }
  if (new Date(link.expires_at).getTime()<=Date.now()) return {state:'expired'};
  return {state:'valid',projectTitle:link.title,serviceName:link.name,serviceId:link.slug,projectId:link.project_id};
}
export async function claimProjectInvitation(token:string):Promise<{state:'claimed'|'claimed_owned'|'claimed_other'|'expired'|'revoked'|'invalid';projectId?:string}> {
  const actor=await requireWorkspaceClient(); if (!validTokenShape(token)) return {state:'invalid'};
  await workspaceRateLimit(actor.id,'invite_claim',20);
  return transaction(async c => {
    const candidate=(await c.query('select project_id from public.project_access_links where token_hash=$1',[tokenHash(token)])).rows[0];
    if(!candidate)return {state:'invalid' as const};
    const project=(await c.query('select id,status from public.projects where id=$1 for update',[candidate.project_id])).rows[0];
    if(!project||project.status==='archived')return {state:'revoked' as const};
    const link=(await c.query('select * from public.project_access_links where token_hash=$1 for update',[tokenHash(token)])).rows[0];
    if (!link) return {state:'invalid' as const}; if (link.status==='revoked') return {state:'revoked' as const};
    const owned=(await c.query('select client_user_id from public.client_project_access where project_id=$1 and revoked_at is null for update',[link.project_id])).rows[0];
    if (link.status==='claimed' || owned) return owned?.client_user_id===actor.id ? {state:'claimed_owned' as const,projectId:link.project_id as string} : {state:'claimed_other' as const};
    if (new Date(link.expires_at).getTime()<=Date.now()) return {state:'expired' as const};
    await c.query("update public.project_access_links set status='claimed',claimed_by=$2,claimed_at=now() where id=$1",[link.id,actor.id]);
    await c.query('insert into public.client_project_access(project_id,client_user_id) values($1,$2)',[link.project_id,actor.id]);
    await c.query('update public.projects set updated_by=$2,updated_at=now() where id=$1',[link.project_id,actor.id]);
    await c.query('insert into public.audit_logs(actor_user_id,project_id,event_type,message) values($1,$2,$3,$4)',[actor.id,link.project_id,'client_access_claimed','Klien mengklaim akses proyek.']);
    await c.query('insert into public.project_updates(project_id,actor_user_id,message,client_visible) values($1,$2,$3,true)',[link.project_id,actor.id,'Akses proyek terhubung.']);
    return {state:'claimed' as const,projectId:link.project_id as string};
  });
}
export async function finishFirstPasswordChange(password:string):Promise<void> {
  const actor=await currentActor(); if (!actor || actor.role!=='admin' || !actor.active || !actor.mustChangePassword) throw new Error('Perubahan kata sandi awal tidak tersedia.');
  if (password.length<12 || password.length>128 || !/[A-Z]/.test(password) || !/[a-z]/.test(password) || !/\d/.test(password)) throw new Error('Gunakan minimal 12 karakter, huruf besar, huruf kecil, dan angka.');
  const service=workspaceServiceClient(); const {error}=await service.auth.admin.updateUserById(actor.id,{password,app_metadata:{workspace_role:'admin',must_change_password:false}});
  if (error) throw new Error('Kata sandi belum dapat diubah.');
  await transaction(async c => { await c.query('update public.profiles set must_change_password=false,updated_at=now() where id=$1',[actor.id]); await c.query('insert into public.audit_logs(actor_user_id,event_type,message) values($1,$2,$3)',[actor.id,'initial_password_changed','Administrator mengganti kata sandi awal.']); });
}
