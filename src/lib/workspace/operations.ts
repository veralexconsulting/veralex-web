import 'server-only';
import type { PoolClient } from 'pg';
import { transaction, rows } from './db';
import { requireWorkspaceAdmin, requireWorkspaceClient, currentActor, type Actor } from './auth';
import { workspaceServiceClient } from './supabase';
import { newProjectToken, tokenHash } from './token';
import { workspaceRateLimit } from './rate-limit';
import type { DraftProject } from '@/features/workspace/store';
import { statusLabels, priorityLabels, type Stage, type TaskStatus, type ProjectStatus, type PriorityStatus, type PriorityOffering } from '@/features/workspace/model';

export type Operation =
 | { type:'create_project'; draft:DraftProject }
 | { type:'update_project'; id:string; patch:Record<string,unknown> }
 | { type:'update_workflow'; projectId:string; stages:Stage[]; reason:string }
 | { type:'set_task_status'; projectId:string; taskId:string; status:TaskStatus; reason?:string }
 | { type:'add_project_update'; projectId:string; message:string; clientVisible:boolean }
 | { type:'update_client'; id:string; patch:{name:string;email:string;phone:string} }
 | { type:'delete_client'; id:string }
 | { type:'create_team'; name:string; email:string; password:string }
 | { type:'delete_team'; id:string }
 | { type:'set_admin_active'; id:string; active:boolean }
 | { type:'delete_project'; id:string }
 | { type:'update_service'; id:string; stages:Stage[] }
 | { type:'publish_service'; id:string }
 | { type:'update_offering'; value:PriorityOffering }
 | { type:'set_priority'; projectId:string; status:PriorityStatus }
 | { type:'create_link'; projectId:string }
 | { type:'revoke_link'; projectId:string }
 | { type:'revoke_access'; projectId:string }
 | { type:'reset_access'; projectId:string }
 | { type:'mark_read'; id:string }
 | { type:'mark_all_read' };
const uuid = (value: string) => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value);
const required = (value: unknown, max = 250) => typeof value === 'string' && value.trim().length >= 2 && value.trim().length <= max;
const validDate=(value:unknown)=>value===''||value==null||(typeof value==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(value));
function operationalText(value:string){if(/(?:\d[ -]?){12,}|data:|-----BEGIN |[A-Za-z0-9+/]{300,}/i.test(value))throw new Error('Catatan tidak boleh memuat nomor identitas atau isi berkas.');return value.trim();}
const statuses: ProjectStatus[] = ['draft','active','waiting_client','waiting_external','review','completed','rejected','cancelled','archived'];
const taskStatuses: TaskStatus[] = ['pending','in_progress','blocked','completed','skipped'];
const query = (c: PoolClient, sql: string, params: unknown[] = []) => c.query(sql,params);
async function audit(c: PoolClient, actorId: string, type: string, message: string, projectId?: string) { await query(c,'insert into public.audit_logs(actor_user_id,project_id,event_type,message) values($1,$2,$3,$4)',[actorId,projectId||null,type,message]); }
async function touchProject(c:PoolClient,projectId:string,actorId:string){await query(c,'update public.projects set updated_by=$2,updated_at=now() where id=$1',[projectId,actorId]);}
async function update(c: PoolClient, projectId: string, actorId: string, message: string, visible = false) { await query(c,'insert into public.project_updates(project_id,actor_user_id,message,client_visible) values($1,$2,$3,$4)',[projectId,actorId,message,visible]); if (visible) await notifyProjectClient(c,projectId,'project_update','Proyek diperbarui',message); }
async function notify(c: PoolClient, userId: string, projectId: string | null, type: string, title: string, message: string, target: string) { const row = (await query(c,'insert into public.notifications(recipient_user_id,project_id,event_type,title,message,target_path) values($1,$2,$3,$4,$5,$6) returning id',[userId,projectId,type,title,message,target])).rows[0]; await query(c,"insert into public.notification_outbox(notification_id,channel,status) values($1,'in_app','sent')",[row.id]); }
async function notifyProjectClient(c: PoolClient, projectId: string, type: string, title: string, message: string) { const found = (await query(c,'select client_user_id from public.client_project_access where project_id=$1 and revoked_at is null',[projectId])).rows[0]; if (found) await notify(c,found.client_user_id,projectId,type,title,message,`/portal/proyek/${projectId}`); }
async function notifyAdmins(c: PoolClient, projectId: string, type: string, title: string, message: string) { const users = (await query(c,"select id from public.profiles where role='admin' and active=true and must_change_password=false")).rows; for (const user of users) await notify(c,user.id,projectId,type,title,message,`/admin/proyek/${projectId}`); }
async function ensureProject(c: PoolClient, id: string) { if (!uuid(id)) throw new Error('Proyek tidak valid.'); const row=(await query(c,'select * from public.projects where id=$1 and deleted_at is null for update',[id])).rows[0]; if (!row) throw new Error('Proyek tidak ditemukan.'); return row; }
function validateStages(stages: Stage[]) { if (!Array.isArray(stages) || stages.length < 1 || stages.length > 60) throw new Error('Workflow memerlukan 1–60 tahap.'); const ids=new Set<string>(); for (const stage of stages) { if (!required(stage.title,200) || !required(stage.clientLabel,200) || !required(stage.completionCriteria,500) || !['internal','client','institution'].includes(stage.waitingKind) || typeof stage.description !== 'string' || stage.description.length > 1000 || !uuid(stage.id) || ids.has(stage.id)) throw new Error('Tahap workflow tidak valid.'); ids.add(stage.id); operationalText(stage.title); operationalText(stage.description); operationalText(stage.clientLabel); if (!Array.isArray(stage.tasks) || stage.tasks.length > 100) throw new Error('Tugas terlalu banyak.'); for (const task of stage.tasks) { if (!uuid(task.id) || ids.has(task.id) || !required(task.title,250) || !taskStatuses.includes(task.status) || (task.dueAt && !/^\d{4}-\d{2}-\d{2}$/.test(task.dueAt)) || (task.note && task.note.length > 500)) throw new Error('Tugas workflow tidak valid.'); ids.add(task.id); operationalText(task.title); if(task.note)operationalText(task.note); } } }
async function insertStages(c: PoolClient, projectId: string, stages: Stage[]) { for (let i=0;i<stages.length;i++) { const stage=stages[i]; await query(c,'insert into public.project_steps(id,project_id,source_template_step_id,position,title,description,client_label,client_visible,waiting_kind,completion_criteria) values($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)',[stage.id,projectId,stage.sourceTemplateStepId||null,i+1,stage.title,stage.description,stage.clientLabel,stage.clientVisible,stage.waitingKind,stage.completionCriteria]); for (let j=0;j<stage.tasks.length;j++) { const task=stage.tasks[j]; await query(c,'insert into public.project_tasks(id,step_id,position,title,conditional,status,note,due_at) values($1,$2,$3,$4,$5,$6,$7,$8)',[task.id,stage.id,j+1,task.title,task.conditional,task.status,task.note||'',task.dueAt||null]); } } }
async function newLink(c: PoolClient, projectId:string, actorId:string) { const owned=(await query(c,'select 1 from public.client_project_access where project_id=$1 and revoked_at is null',[projectId])).rowCount; if(owned)throw new Error('Akses klien sudah diklaim. Atur ulang klaim sebelum menerbitkan tautan baru.'); const token=newProjectToken(); await query(c,"update public.project_access_links set status='revoked',revoked_at=now() where project_id=$1 and status='active'",[projectId]); await query(c,"insert into public.project_access_links(project_id,token_hash,expires_at,created_by) values($1,$2,now()+interval '72 hours',$3)",[projectId,tokenHash(token),actorId]); await touchProject(c,projectId,actorId); await audit(c,actorId,'access_link_created','Tautan akses proyek diterbitkan.',projectId); return token; }

export async function runOperation(input: Operation): Promise<{ id?:string; token?:string }> {
  if (input.type === 'create_team') return createTeam(input);
  if (input.type === 'delete_team') return deleteTeam(input);
  if (input.type === 'set_admin_active') return setAdminActive(input);
  if (input.type === 'mark_read' || input.type === 'mark_all_read') return markRead(input);
  if (input.type === 'set_priority' && ['requested','cancelled'].includes(input.status)) return setClientPriority(input);
  const actor = await requireWorkspaceAdmin();
  switch(input.type) {
    case 'create_project': return createProject(actor,input.draft);
    case 'update_project': return updateProject(actor,input.id,input.patch);
    case 'update_workflow': return updateWorkflow(actor,input.projectId,input.stages,input.reason);
    case 'set_task_status': return setTaskStatus(actor,input.projectId,input.taskId,input.status,input.reason);
    case 'add_project_update': return addProjectUpdate(actor,input.projectId,input.message,input.clientVisible);
    case 'update_client': return updateClient(actor,input.id,input.patch);
    case 'delete_client': return deleteClient(actor,input.id);
    case 'delete_project': return deleteProject(actor,input.id);
    case 'update_service': return updateService(actor,input.id,input.stages);
    case 'publish_service': return publishService(actor,input.id);
    case 'update_offering': return updateOffering(actor,input.value);
    case 'set_priority': return setAdminPriority(actor,input.projectId,input.status);
    case 'create_link': return transaction(async c => { await ensureProject(c,input.projectId); const token=await newLink(c,input.projectId,actor.id); return {token}; });
    case 'revoke_link': return transaction(async c => { await ensureProject(c,input.projectId); await query(c,"update public.project_access_links set status='revoked',revoked_at=now() where project_id=$1 and status='active'",[input.projectId]); await touchProject(c,input.projectId,actor.id); await audit(c,actor.id,'access_link_revoked','Tautan akses proyek dicabut.',input.projectId); return {}; });
    case 'revoke_access': return transaction(async c => { await ensureProject(c,input.projectId); await query(c,'update public.client_project_access set revoked_at=now(),revoked_by=$2 where project_id=$1 and revoked_at is null',[input.projectId,actor.id]); await query(c,"update public.project_access_links set status='revoked',revoked_at=now() where project_id=$1 and status='active'",[input.projectId]); await touchProject(c,input.projectId,actor.id); await audit(c,actor.id,'client_access_revoked','Akses klien dicabut.',input.projectId); return {}; });
    case 'reset_access': return transaction(async c => { await ensureProject(c,input.projectId); await query(c,'update public.client_project_access set revoked_at=now(),revoked_by=$2 where project_id=$1 and revoked_at is null',[input.projectId,actor.id]); const token=await newLink(c,input.projectId,actor.id); await audit(c,actor.id,'client_access_reset','Klaim klien diatur ulang.',input.projectId); return {token}; });
  }
}

async function deleteProject(actor:Actor,id:string) {
  if (!uuid(id)) throw new Error('Proyek tidak valid.');
  return transaction(async c => {
    const project=await ensureProject(c,id);
    const accesses=await query(c,'update public.client_project_access set revoked_at=coalesce(revoked_at,now()),revoked_by=coalesce(revoked_by,$2) where project_id=$1 and revoked_at is null',[id,actor.id]);
    await query(c,"update public.project_access_links set status='revoked',revoked_at=coalesce(revoked_at,now()) where project_id=$1 and status <> 'revoked'",[id]);
    await query(c,"update public.notifications set target_path='/portal' where project_id=$1 and target_path like '/portal/proyek/%'",[id]);
    await query(c,"update public.projects set status='archived',deleted_at=now(),deleted_by=$2,internal_notes='',updated_by=$2,updated_at=now() where id=$1 and deleted_at is null",[id,actor.id]);
    await audit(c,actor.id,'project_deleted',`Proyek “${String(project.title)}” dihapus dari tampilan aktif; riwayat dipertahankan dan ${accesses.rowCount||0} akses klien dicabut.`,id);
    return {};
  });
}

async function deleteClient(actor:Actor,id:string) {
  if (!uuid(id)) throw new Error('Klien tidak valid.');
  return transaction(async c => {
    const target=(await query(c,'select id,name from public.clients where id=$1 for update',[id])).rows[0];
    if (!target) throw new Error('Klien tidak ditemukan.');
    const dependencies=(await query(c,'select count(*)::int as count from public.projects where client_id=$1 and deleted_at is null',[id])).rows[0];
    if (Number(dependencies.count)>0) throw new Error(`Klien masih terkait dengan ${dependencies.count} proyek aktif. Hapus proyek terkait terlebih dahulu; riwayat proyek akan tetap tersimpan.`);
    await query(c,'update public.clients set deleted_at=coalesce(deleted_at,now()),updated_by=$2,updated_at=now() where id=$1',[id,actor.id]);
    await audit(c,actor.id,'client_deleted',`Data kontak klien “${String(target.name)}” dikeluarkan dari daftar aktif. Akun dan riwayat proyek tidak dihapus.`);
    return {};
  });
}

async function deleteTeam(input:Extract<Operation,{type:'delete_team'}>) {
  const actor=await requireWorkspaceAdmin();
  if (!uuid(input.id) || input.id===actor.id) throw new Error('Akun sendiri tidak dapat dihapus.');
  const service=workspaceServiceClient();
  return transaction(async c => {
    await query(c,'select pg_advisory_xact_lock(94613580)');
    const target=(await query(c,"select id,active,full_name from public.profiles where id=$1 and role='admin' and deleted_at is null for update",[input.id])).rows[0];
    if (!target) throw new Error('Anggota tim tidak ditemukan.');
    const count=Number((await query(c,"select count(*)::int as count from public.profiles where role='admin' and active=true and deleted_at is null")).rows[0].count);
    if (target.active && count<=1) throw new Error('Administrator aktif terakhir tidak dapat dihapus.');
    const assignments=Number((await query(c,'select count(*)::int as count from public.projects p where p.deleted_at is null and (p.pic_user_id=$1 or exists(select 1 from public.project_supporting_admins s where s.project_id=p.id and s.admin_user_id=$1))',[input.id])).rows[0].count);
    if (assignments>0) throw new Error(`Anggota tim masih ditugaskan pada ${assignments} proyek. Alihkan seluruh PIC dan penugasan pendukung terlebih dahulu.`);
    const {error}=await service.auth.admin.updateUserById(input.id,{ban_duration:'876000h'});
    if(error) throw new Error('Akses akun tidak dapat dicabut.');
    try {
      await query(c,'update public.profiles set active=false,deleted_at=now(),updated_at=now() where id=$1',[input.id]);
      await audit(c,actor.id,'admin_deleted',`Anggota tim ${String(target.full_name)} dinonaktifkan dan dikeluarkan dari daftar tim. Akun Auth serta riwayat dipertahankan.`);
    } catch(cause) {
      if(target.active) await service.auth.admin.updateUserById(input.id,{ban_duration:'none'});
      throw cause;
    }
    return {};
  });
}

async function createProject(actor:Actor,draft:DraftProject) { if (!required(draft.clientName,200) || !required(draft.title,250) || !uuid(draft.picId) || (draft.clientId && !uuid(draft.clientId)) || !Array.isArray(draft.supportingIds) || draft.supportingIds.length>20 || !validDate(draft.startAt) || !validDate(draft.followUpAt) || typeof draft.notes!=='string' || draft.notes.length > 2000 || typeof draft.clientPhone!=='string' || draft.clientPhone.length>40 || (draft.clientEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(draft.clientEmail))) throw new Error('Data proyek tidak valid.'); operationalText(draft.notes); return transaction(async c => {
  const service=(await query(c,'select slug from public.workspace_services where slug=$1 and active=true',[draft.serviceId])).rows[0]; if (!service) throw new Error('Layanan tidak tersedia.');
  const template=(await query(c,"select id,version from public.workflow_templates where service_slug=$1 and status='published' order by version desc limit 1",[draft.serviceId])).rows[0]; if (!template) throw new Error('SOP layanan belum diterbitkan.');
  const pic=(await query(c,"select id from public.profiles where id=$1 and role='admin' and active=true and must_change_password=false and deleted_at is null for update",[draft.picId])).rows[0]; if (!pic) throw new Error('PIC harus administrator aktif.');
  const client=draft.clientId ? (await query(c,'select id from public.clients where id=$1 and deleted_at is null for update',[draft.clientId])).rows[0] : (await query(c,'insert into public.clients(name,email,phone,created_by,updated_by) values($1,$2,$3,$4,$4) returning id',[draft.clientName.trim(),draft.clientEmail.trim(),draft.clientPhone.trim(),actor.id])).rows[0];
  if(!client)throw new Error('Klien yang dipilih tidak ditemukan.');
  const project=(await query(c,'insert into public.projects(client_id,service_slug,workflow_template_id,workflow_version,title,pic_user_id,created_by,updated_by,start_at,follow_up_at,internal_notes) values($1,$2,$3,$4,$5,$6,$7,$7,$8,$9,$10) returning id',[client.id,draft.serviceId,template.id,template.version,draft.title.trim(),draft.picId,actor.id,draft.startAt||null,draft.followUpAt||null,draft.notes.trim()])).rows[0];
  await query(c,'insert into public.project_steps(project_id,source_template_step_id,position,title,description,client_label,client_visible,waiting_kind,completion_criteria) select $1,id,position,title,description,client_label,client_visible,waiting_kind,completion_criteria from public.workflow_template_steps where template_id=$2 order by position',[project.id,template.id]);
  await query(c,"insert into public.project_tasks(step_id,position,title,conditional,status) select p.id,t.position,t.title,t.conditional,'pending' from public.workflow_template_tasks t join public.workflow_template_steps s on s.id=t.step_id join public.project_steps p on p.project_id=$1 and p.position=s.position where s.template_id=$2",[project.id,template.id]);
  for (const id of new Set(draft.supportingIds)) if (uuid(id) && id!==draft.picId) { const supporting=(await query(c,"select id from public.profiles where id=$1 and role='admin' and active=true and deleted_at is null for update",[id])).rows[0]; if(supporting)await query(c,'insert into public.project_supporting_admins(project_id,admin_user_id) values($1,$2)',[project.id,id]); }
  await audit(c,actor.id,'project_created','Proyek dibuat.',project.id); await update(c,project.id,actor.id,'Proyek dibuat dan alur kerja disiapkan.',true);
  if (draft.picId !== actor.id) await notify(c,draft.picId,project.id,'pic_assigned','Penugasan PIC',draft.title.trim(),`/admin/proyek/${project.id}`);
  const token=await newLink(c,project.id,actor.id); return {id:project.id as string,token};
}); }

async function updateProject(actor:Actor,id:string,patch:Record<string,unknown>) { if (!uuid(id)) throw new Error('Proyek tidak valid.'); return transaction(async c => { const old=await ensureProject(c,id); const title=patch.title === undefined ? old.title : patch.title; const status=patch.status === undefined ? old.status : patch.status; const pic=patch.picId === undefined ? old.pic_user_id : patch.picId; const follow=patch.followUpAt === undefined ? old.follow_up_at : patch.followUpAt; const notes=patch.notes === undefined ? old.internal_notes : patch.notes;
  if (!required(title,250) || !statuses.includes(status as ProjectStatus) || !uuid(pic as string) || (!validDate(follow) && !(follow instanceof Date)) || typeof notes !== 'string' || notes.length > 2000) throw new Error('Perubahan proyek tidak valid.'); operationalText(notes);
  if (!(await query(c,"select 1 from public.profiles where id=$1 and role='admin' and active=true and must_change_password=false and deleted_at is null for update",[pic])).rowCount) throw new Error('PIC harus administrator aktif.');
  await query(c,'update public.projects set title=$2,status=$3,pic_user_id=$4,follow_up_at=$5,internal_notes=$6,updated_by=$7,updated_at=now() where id=$1',[id,String(title).trim(),status,pic,follow||null,notes,actor.id]);
  if (Array.isArray(patch.supportingIds)) { await query(c,'delete from public.project_supporting_admins where project_id=$1',[id]); for (const admin of new Set(patch.supportingIds)) if (typeof admin === 'string' && uuid(admin) && admin!==pic) { const supporting=(await query(c,"select id from public.profiles where id=$1 and role='admin' and active=true and deleted_at is null for update",[admin])).rows[0]; if(supporting)await query(c,'insert into public.project_supporting_admins(project_id,admin_user_id) values($1,$2)',[id,admin]); } }
  const changes=[old.title!==title?'judul':'',old.status!==status?'status':'',old.pic_user_id!==pic?'PIC':'',old.internal_notes!==notes?'catatan internal':''].filter(Boolean).join(', ') || 'rincian';
  await audit(c,actor.id,'project_updated',`Memperbarui ${changes} proyek.`,id); if (old.status!==status) await update(c,id,actor.id,`Status proyek menjadi ${statusLabels[status as ProjectStatus]}.`,true);
  if (old.pic_user_id!==pic) await notify(c,pic as string,id,'pic_assigned','Penugasan PIC',String(title),`/admin/proyek/${id}`); return {};
}); }

async function updateWorkflow(actor:Actor,projectId:string,stages:Stage[],reason:string) { validateStages(stages); if (typeof reason !== 'string' || reason.length > 300) throw new Error('Alasan perubahan tidak valid.'); return transaction(async c => { await ensureProject(c,projectId);
  const existing=(await query(c,'select t.id,t.status from public.project_tasks t join public.project_steps s on s.id=t.step_id where s.project_id=$1',[projectId])).rows;
  const incoming=new Map(stages.flatMap(stage => stage.tasks.map(task => [task.id,task.status] as const)));
  for (const task of existing) { if (!['pending','skipped'].includes(task.status) && !incoming.has(task.id)) throw new Error('Tugas yang sudah dikerjakan tidak boleh dihapus.'); if (incoming.has(task.id) && incoming.get(task.id)!==task.status) throw new Error('Ubah status melalui checklist, bukan editor workflow.'); }
  await query(c,'delete from public.project_steps where project_id=$1',[projectId]); await insertStages(c,projectId,stages);
  await query(c,'update public.projects set updated_by=$2,updated_at=now() where id=$1',[projectId,actor.id]); await audit(c,actor.id,'workflow_updated','Tahap atau tugas workflow proyek disesuaikan.',projectId); return {};
}); }
async function setTaskStatus(actor:Actor,projectId:string,taskId:string,status:TaskStatus,reason?:string) { if (!uuid(taskId) || !taskStatuses.includes(status) || (['blocked','skipped'].includes(status) && !reason?.trim()) || (reason && reason.length>500)) throw new Error('Status atau alasan tugas tidak valid.'); if(reason)operationalText(reason); return transaction(async c => { await ensureProject(c,projectId);
  const found=(await query(c,'select t.*,s.client_visible,s.client_label,s.id as project_step_id from public.project_tasks t join public.project_steps s on s.id=t.step_id where t.id=$1 and s.project_id=$2 for update of t',[taskId,projectId])).rows[0]; if (!found) throw new Error('Tugas tidak ditemukan.');
  await query(c,'update public.project_tasks set status=$2,note=$3,updated_by=$4,updated_at=now() where id=$1',[taskId,status,reason?.trim()||'',actor.id]); await query(c,'update public.projects set updated_by=$2,updated_at=now() where id=$1',[projectId,actor.id]);
  await audit(c,actor.id,'task_status_changed',`Tugas “${found.title}” menjadi ${status}${reason?.trim() ? '; alasan dicatat pada tugas' : ''}.`,projectId);
  if (found.client_visible && status==='completed' && found.status!=='completed') { const incomplete=(await query(c,"select count(*)::int as count from public.project_tasks where step_id=$1 and status not in ('completed','skipped')",[found.project_step_id])).rows[0].count; if (incomplete===0) await update(c,projectId,actor.id,`Tahap ${found.client_label} selesai.`,true); }
  if(found.client_visible && found.status==='completed' && !['completed','skipped'].includes(status))await update(c,projectId,actor.id,`Tahap ${found.client_label} dibuka kembali untuk tindak lanjut.`,true);
  return {};
}); }
async function addProjectUpdate(actor:Actor,projectId:string,message:string,clientVisible:boolean){if(!uuid(projectId)||!required(message,1000)||typeof clientVisible!=='boolean')throw new Error('Pembaruan proyek tidak valid.');const clean=operationalText(message);return transaction(async c=>{await ensureProject(c,projectId);await update(c,projectId,actor.id,clean,clientVisible);await touchProject(c,projectId,actor.id);await audit(c,actor.id,'project_update_added',clientVisible?'Pembaruan untuk klien diterbitkan.':'Catatan aktivitas internal ditambahkan.',projectId);return {};});}
async function updateClient(actor:Actor,id:string,patch:{name:string;email:string;phone:string}) { if (!uuid(id) || !required(patch.name,200) || typeof patch.email!=='string' || typeof patch.phone!=='string' || (patch.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(patch.email)) || patch.phone.length>40) throw new Error('Kontak klien tidak valid.'); return transaction(async c => { const result=await query(c,'update public.clients set name=$2,email=$3,phone=$4,updated_by=$5,updated_at=now() where id=$1 and deleted_at is null returning id',[id,patch.name.trim(),patch.email.trim(),patch.phone.trim(),actor.id]); if (!result.rowCount) throw new Error('Klien tidak ditemukan.'); const projects=(await query(c,'select id from public.projects where client_id=$1 and deleted_at is null',[id])).rows; for (const project of projects) await audit(c,actor.id,'client_updated','Kontak bisnis klien diperbarui.',project.id); return {}; }); }
async function createTeam(input:Extract<Operation,{type:'create_team'}>) { const actor=await requireWorkspaceAdmin(); const {name,email,password}=input; if (!required(name,120) || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || password.length<12 || password.length>128 || !/[A-Z]/.test(password) || !/[a-z]/.test(password) || !/\d/.test(password)) throw new Error('Nama, email, atau kekuatan kata sandi tidak memenuhi syarat.');
  await workspaceRateLimit(actor.id,'create_team',10);
  const service=workspaceServiceClient(); const {data,error}=await service.auth.admin.createUser({email:email.trim().toLowerCase(),password,email_confirm:true,user_metadata:{full_name:name.trim()},app_metadata:{workspace_role:'admin',must_change_password:true}});
  if (error || !data.user) throw new Error(error?.message?.toLowerCase().includes('already') ? 'Email sudah terdaftar.' : 'Akun belum dapat dibuat. Periksa alamat email dan konfigurasi Auth.');
  try { await transaction(async c => { await query(c,"insert into public.profiles(id,email,full_name,role,active,must_change_password,created_by) values($1,$2,$3,'admin',true,true,$4) on conflict(id) do update set role='admin',active=true,must_change_password=true,created_by=$4,full_name=$3",[data.user.id,email.trim().toLowerCase(),name.trim(),actor.id]); const legacy=(await query(c,"select to_regclass('public.users') as table_name")).rows[0]; if(legacy.table_name)await query(c,"update public.users set role='admin',full_name=$2 where id=$1",[data.user.id,name.trim()]); await audit(c,actor.id,'admin_created',`Akun administrator ${name.trim()} dibuat.`); }); }
  catch (cause) { await service.auth.admin.deleteUser(data.user.id); throw cause; }
  return {id:data.user.id};
}
async function setAdminActive(input:Extract<Operation,{type:'set_admin_active'}>) { const actor=await requireWorkspaceAdmin(); if (!uuid(input.id) || input.id===actor.id) throw new Error('Akun sendiri tidak dapat dinonaktifkan.'); const service=workspaceServiceClient(); return transaction(async c => { await query(c,'select pg_advisory_xact_lock(94613580)'); const target=(await query(c,"select id,role,active from public.profiles where id=$1 and role='admin' and deleted_at is null for update",[input.id])).rows[0]; if (!target) throw new Error('Administrator tidak ditemukan.'); if (!input.active) { const count=(await query(c,"select count(*)::int as count from public.profiles where role='admin' and active=true and deleted_at is null")).rows[0].count; if (count<=1) throw new Error('Administrator aktif terakhir tidak dapat dinonaktifkan.'); const assigned=(await query(c,"select 1 from public.projects p where p.deleted_at is null and p.status not in ('completed','cancelled','archived') and (p.pic_user_id=$1 or exists(select 1 from public.project_supporting_admins s where s.project_id=p.id and s.admin_user_id=$1)) limit 1",[input.id])).rowCount; if (assigned) throw new Error('Pindahkan PIC proyek aktif terlebih dahulu.'); }
  const {error}=await service.auth.admin.updateUserById(input.id,{ban_duration:input.active?'none':'876000h'}); if (error) throw new Error('Status Auth tidak dapat diubah.');
  try { await query(c,'update public.profiles set active=$2,updated_at=now() where id=$1',[input.id,input.active]); await audit(c,actor.id,input.active?'admin_reactivated':'admin_deactivated',`Status administrator ${input.id} diubah.`); }
  catch (cause) { await service.auth.admin.updateUserById(input.id,{ban_duration:target.active?'none':'876000h'}); throw cause; }
  return {};
}); }
async function updateService(actor:Actor,id:string,stages:Stage[]) { if (!id || !Array.isArray(stages) || stages.length<1 || stages.length>60) throw new Error('SOP tidak valid.'); return transaction(async c => { const svc=(await query(c,'select slug from public.workspace_services where slug=$1 for update',[id])).rows[0]; if (!svc) throw new Error('Layanan tidak ditemukan.');
  const draft=(await query(c,"select id,version from public.workflow_templates where service_slug=$1 and status='draft' for update",[id])).rows[0];
  let templateId:string;
  if(draft){templateId=draft.id;await query(c,'delete from public.workflow_template_steps where template_id=$1',[templateId]);}
  else { const version=(await query(c,'select coalesce(max(version),0)::int+1 as next from public.workflow_templates where service_slug=$1',[id])).rows[0].next;const made=(await query(c,"insert into public.workflow_templates(service_slug,version,status,legal_review_required,created_by) values($1,$2,'draft',true,$3) returning id",[id,version,actor.id])).rows[0];templateId=made.id; }
  for(let i=0;i<stages.length;i++){ const stage=stages[i]; if (!required(stage.title,200)||!required(stage.clientLabel,200)||!required(stage.completionCriteria,500)||!['internal','client','institution'].includes(stage.waitingKind)||!Array.isArray(stage.tasks)||stage.tasks.length>100) throw new Error('Tahap SOP tidak valid.'); const step=(await query(c,'insert into public.workflow_template_steps(template_id,position,title,description,client_label,client_visible,waiting_kind,completion_criteria) values($1,$2,$3,$4,$5,$6,$7,$8) returning id',[templateId,i+1,stage.title,stage.description,stage.clientLabel,stage.clientVisible,stage.waitingKind,stage.completionCriteria])).rows[0];for(let j=0;j<stage.tasks.length;j++){const task=stage.tasks[j];if(!required(task.title,250))throw new Error('Tugas SOP tidak valid.');await query(c,'insert into public.workflow_template_tasks(step_id,position,title,conditional) values($1,$2,$3,$4)',[step.id,j+1,task.title,task.conditional]);}}
  await audit(c,actor.id,'template_draft_saved',`Draf SOP ${id} diperbarui.`);return {};
}); }
async function publishService(actor:Actor,id:string){return transaction(async c=>{await query(c,'select slug from public.workspace_services where slug=$1 for update',[id]);const draft=(await query(c,"select id,version from public.workflow_templates where service_slug=$1 and status='draft' for update",[id])).rows[0];if(!draft)throw new Error('Tidak ada draf SOP untuk diterbitkan.');const steps=(await query(c,'select count(*)::int as count from public.workflow_template_steps where template_id=$1',[draft.id])).rows[0].count;if(!steps)throw new Error('Draf SOP belum memiliki tahap.');await query(c,"update public.workflow_templates set status='archived' where service_slug=$1 and status='published'",[id]);await query(c,"update public.workflow_templates set status='published',published_at=now() where id=$1",[draft.id]);await audit(c,actor.id,'template_published',`SOP ${id} versi ${draft.version} diterbitkan untuk proyek baru.`);return {};});}
async function updateOffering(actor:Actor,value:PriorityOffering) { if (!value || !Array.isArray(value.serviceIds) || !Array.isArray(value.stageIds) || value.price<0 || !Number.isSafeInteger(value.price) || !required(value.title,150) || value.description.length>2000 || value.terms.length>4000) throw new Error('Penawaran prioritas tidak valid.'); return transaction(async c => { await query(c,'update public.priority_offerings set enabled=$1,service_slugs=$2,stage_keys=$3,title=$4,description=$5,commitment=$6,limitations=$7,terms=$8,price_idr=$9,updated_by=$10,updated_at=now() where singleton=true',[value.enabled,value.serviceIds,value.stageIds,value.title,value.description,value.commitment,value.limitations,value.terms,value.price,actor.id]); await audit(c,actor.id,'priority_offering_updated','Penawaran layanan prioritas diperbarui.'); return {}; }); }
async function setClientPriority(input:Extract<Operation,{type:'set_priority'}>) { const actor=await requireWorkspaceClient(); if (!uuid(input.projectId)) throw new Error('Proyek tidak valid.'); return transaction(async c => { const access=(await query(c,'select 1 from public.client_project_access where project_id=$1 and client_user_id=$2 and revoked_at is null',[input.projectId,actor.id])).rowCount; if (!access) throw new Error('Akses proyek ditolak.'); const project=await ensureProject(c,input.projectId); const latest=(await query(c,'select * from public.priority_requests where project_id=$1 order by created_at desc limit 1 for update',[input.projectId])).rows[0];
  if (input.status==='cancelled') { if (!latest || latest.status!=='requested' || latest.client_user_id!==actor.id) throw new Error('Permintaan tidak dapat dibatalkan.'); await query(c,"update public.priority_requests set status='cancelled',updated_at=now() where id=$1",[latest.id]); await touchProject(c,input.projectId,actor.id); await audit(c,actor.id,'priority_cancelled','Permintaan prioritas dibatalkan.',input.projectId); await notifyAdmins(c,input.projectId,'priority_cancelled','Permintaan prioritas dibatalkan',project.title); return {}; }
  if (input.status!=='requested' || !['none','rejected','cancelled'].includes(latest?.status||'none') || ['completed','cancelled','archived','rejected'].includes(project.status)) throw new Error('Proyek belum memenuhi syarat prioritas.');
  const offer=(await query(c,'select * from public.priority_offerings where singleton=true')).rows[0]; if (!offer?.enabled || !offer.service_slugs.includes(project.service_slug)) throw new Error('Layanan prioritas tidak tersedia.');
  const stage=(await query(c,"select source_template_step_id from public.project_steps where project_id=$1 and exists(select 1 from public.project_tasks where step_id=project_steps.id and status not in ('completed','skipped')) order by position limit 1",[input.projectId])).rows[0];
  if (offer.stage_keys.length && !offer.stage_keys.includes(`${project.service_slug}:${stage?.source_template_step_id||''}`)) throw new Error('Tahap belum memenuhi syarat prioritas.');
  await query(c,"insert into public.priority_requests(project_id,client_user_id,status,quoted_price_idr) values($1,$2,'requested',$3)",[input.projectId,actor.id,offer.price_idr]); await touchProject(c,input.projectId,actor.id); await audit(c,actor.id,'priority_requested','Klien mengajukan layanan prioritas.',input.projectId); await notifyAdmins(c,input.projectId,'priority_requested','Permintaan prioritas baru',project.title); return {};
}); }
async function setAdminPriority(actor:Actor,projectId:string,status:PriorityStatus) { if (!['approved','rejected','payment_unavailable'].includes(status)) throw new Error('Transisi prioritas tidak diizinkan.'); return transaction(async c => { await ensureProject(c,projectId); const req=(await query(c,'select * from public.priority_requests where project_id=$1 order by created_at desc limit 1 for update',[projectId])).rows[0]; if (!req || !((req.status==='requested' && ['approved','rejected'].includes(status)) || (req.status==='approved' && status==='payment_unavailable'))) throw new Error('Status permintaan sudah berubah.'); await query(c,'update public.priority_requests set status=$2,reviewed_by=$3,reviewed_at=now(),updated_at=now() where id=$1',[req.id,status,actor.id]); await touchProject(c,projectId,actor.id); await audit(c,actor.id,'priority_reviewed',`Permintaan prioritas menjadi ${priorityLabels[status]}.`,projectId); await notifyProjectClient(c,projectId,'priority_reviewed','Status prioritas diperbarui',`Permintaan prioritas menjadi ${priorityLabels[status]}.`); return {}; }); }
async function markRead(input:Extract<Operation,{type:'mark_read'|'mark_all_read'}>) { const actor=await currentActor(); if (!actor || !actor.active) throw new Error('Masuk untuk membaca notifikasi.'); if (input.type==='mark_read') { if (!uuid(input.id)) throw new Error('Notifikasi tidak valid.'); await rows('update public.notifications set read_at=coalesce(read_at,now()) where id=$1 and recipient_user_id=$2',[input.id,actor.id]); } else await rows('update public.notifications set read_at=coalesce(read_at,now()) where recipient_user_id=$1 and read_at is null',[actor.id]); return {}; }
