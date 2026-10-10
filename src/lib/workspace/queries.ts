import 'server-only';
import { rows, one } from './db';
import { requireWorkspaceAdmin, requireWorkspaceClient } from './auth';
import type { WorkspaceData, Stage, Task, Project, Service, PriorityOffering, Notification, Activity } from '@/features/workspace/model';

const iso = (value: unknown) => value instanceof Date ? value.toISOString() : String(value || '');
const date = (value: unknown) => value instanceof Date ? value.toISOString().slice(0,10) : String(value || '');
const emptyOffering: PriorityOffering = { enabled: false, serviceIds: [], stageIds: [], title: 'Layanan Prioritas Penanganan VERALEX', description: '', commitment: '', limitations: 'Keputusan instansi di luar kendali VERALEX.', terms: '', price: 0 };
function offering(row: Record<string, unknown> | undefined): PriorityOffering { return row ? { enabled: Boolean(row.enabled), serviceIds: row.service_slugs as string[], stageIds: row.stage_keys as string[], title: String(row.title), description: String(row.description), commitment: String(row.commitment), limitations: String(row.limitations), terms: String(row.terms), price: Number(row.price_idr) } : emptyOffering; }
function nestStages(steps: Record<string, unknown>[], tasks: Record<string, unknown>[], parentKey: string, taskStepKey = 'step_id', client = false): Map<string, Stage[]> {
  const grouped = new Map<string, Stage[]>();
  for (const step of steps) {
    const id = String(step.id); const parent = String(step[parentKey]);
    const matching = tasks.filter(task => task[taskStepKey] === id);
    const stageTasks: Task[] = client ? [{ id, title: String(step.client_label), status: matching.length > 0 && matching.every(task => ['completed','skipped'].includes(String(task.status))) ? 'completed' : 'pending', conditional: false }] : matching.map(task => ({ id: String(task.id), title: String(task.title), status: (task.status as Task['status']) || 'pending', conditional: Boolean(task.conditional), note: String(task.note || ''), dueAt: date(task.due_at) }));
    const stage: Stage = { id, sourceTemplateStepId: step.source_template_step_id ? String(step.source_template_step_id) : undefined, title: client ? String(step.client_label) : String(step.title), description: client ? '' : String(step.description || ''), clientLabel: String(step.client_label), clientVisible: Boolean(step.client_visible), waitingKind: step.waiting_kind as Stage['waitingKind'], completionCriteria: client ? '' : String(step.completion_criteria), tasks: stageTasks };
    grouped.set(parent, [...(grouped.get(parent) || []), stage]);
  }
  return grouped;
}
function projectRow(row: Record<string, unknown>, stages: Stage[], supporting: string[], priority?: Record<string, unknown>): Project {
  return { id: String(row.id), reference: String(row.reference), title: String(row.title), clientId: String(row.client_id), serviceId: String(row.service_slug), status: row.status as Project['status'], creatorId: String(row.created_by), picId: String(row.pic_user_id), updatedById: String(row.updated_by), createdAt: iso(row.created_at), updatedAt: iso(row.updated_at), startAt: date(row.start_at), followUpAt: date(row.follow_up_at), notes: String(row.internal_notes || ''), supportingIds: supporting, stages, workflowVersion: Number(row.workflow_version), priority: (priority?.status as Project['priority']) || 'none', priorityPrice: priority ? Number(priority.quoted_price_idr) : undefined };
}
function notifyRows(items: Record<string, unknown>[], role: 'admin' | 'client'): Notification[] { return items.map(row => ({ id: String(row.id), role, projectId: row.project_id ? String(row.project_id) : undefined, eventType: row.event_type ? String(row.event_type) : undefined, title: String(row.title), message: String(row.message), target: String(row.target_path), read: Boolean(row.read_at), at: iso(row.created_at) })); }

export async function adminSnapshot(): Promise<{ data: WorkspaceData; actorId: string; clientAccountId: string }> {
  const actor = await requireWorkspaceAdmin();
  const [profiles, clientRows, serviceRows, templates, templateSteps, templateTasks, projectRows, projectSteps, projectTasks, supporting, accesses, links, updates, audits, notificationRows, offerRow, priorityRows] = await Promise.all([
    rows<Record<string, unknown>>('select * from public.profiles order by full_name'), rows<Record<string, unknown>>('select * from public.clients order by name'),
    rows<Record<string, unknown>>('select * from public.workspace_services order by name'), rows<Record<string, unknown>>("select * from public.workflow_templates where status in ('published','draft') order by service_slug, version desc"),
    rows<Record<string, unknown>>('select * from public.workflow_template_steps order by template_id,position'), rows<Record<string, unknown>>('select * from public.workflow_template_tasks order by step_id,position'),
    rows<Record<string, unknown>>('select *, start_at::text as start_date, follow_up_at::text as follow_up_date from public.projects where deleted_at is null order by updated_at desc'),
    rows<Record<string, unknown>>('select * from public.project_steps order by project_id,position'), rows<Record<string, unknown>>('select * from public.project_tasks order by step_id,position'),
    rows<Record<string, unknown>>('select * from public.project_supporting_admins'), rows<Record<string, unknown>>('select * from public.client_project_access where revoked_at is null'),
    rows<Record<string, unknown>>('select id,project_id,status,created_at,expires_at,claimed_by from public.project_access_links order by created_at desc'),
    rows<Record<string, unknown>>('select * from public.project_updates order by created_at desc limit 500'), rows<Record<string, unknown>>('select * from public.audit_logs order by created_at desc limit 500'),
    rows<Record<string, unknown>>('select * from public.notifications where recipient_user_id=$1 order by created_at desc limit 200',[actor.id]),
    one<Record<string, unknown>>('select * from public.priority_offerings where singleton=true'), rows<Record<string, unknown>>('select distinct on (project_id) * from public.priority_requests order by project_id,created_at desc'),
  ]);
  const templateByService = new Map<string, Record<string, unknown>>(); const draftByService=new Map<string,Record<string,unknown>>(); for (const item of templates) { const target=item.status==='draft'?draftByService:templateByService; if (!target.has(String(item.service_slug))) target.set(String(item.service_slug), item); }
  const templateStages = nestStages(templateSteps, templateTasks, 'template_id');
  const services: Service[] = serviceRows.map(service => { const template = templateByService.get(String(service.slug)); const draft=draftByService.get(String(service.slug)); return { id: String(service.slug), name: String(service.name), approval: template?.legal_review_required ? 'starter' : 'approved', version: Number(template?.version || 0), legalReviewRequired: Boolean(template?.legal_review_required), stages: template ? templateStages.get(String(template.id)) || [] : [], draftStages:draft?templateStages.get(String(draft.id))||[]:undefined,draftVersion:draft?Number(draft.version):undefined }; });
  const stageMap = nestStages(projectSteps, projectTasks, 'project_id');
  const data: WorkspaceData = {
    admins: profiles.filter(item => item.role === 'admin' && !item.deleted_at).map(item => ({ id: String(item.id), name: String(item.full_name), email: String(item.email), active: Boolean(item.active), mustChangePassword: Boolean(item.must_change_password), createdById: item.created_by ? String(item.created_by) : undefined, createdAt: iso(item.created_at) })),
    clientAccounts: profiles.filter(item => item.role === 'client' && (accesses.some(access => access.client_user_id === item.id) || projectRows.some(project=>project.updated_by===item.id) || audits.some(event=>event.actor_user_id===item.id))).map(item => ({ id: String(item.id), name: String(item.full_name), email: String(item.email) })),
    clients: clientRows.map(item => ({ id: String(item.id), name: String(item.name), email: String(item.email), phone: String(item.phone), deletedAt:item.deleted_at?iso(item.deleted_at):undefined })), services,
    projects: projectRows.map(item => projectRow(item, stageMap.get(String(item.id)) || [], supporting.filter(row => row.project_id === item.id).map(row => String(row.admin_user_id)), priorityRows.find(row => row.project_id === item.id))),
    accesses: accesses.map(item => ({ id: String(item.id), projectId: String(item.project_id), accountId: String(item.client_user_id), grantedAt: iso(item.granted_at) })),
    accessLinks: links.map(item => ({ id: String(item.id), projectId: String(item.project_id), token: '', status: new Date(iso(item.expires_at)).getTime() < Date.now() && item.status === 'active' ? 'expired' : item.status as 'active'|'claimed'|'revoked', createdAt: iso(item.created_at), expiresAt: iso(item.expires_at), claimedById: item.claimed_by ? String(item.claimed_by) : undefined })),
    activities: [...audits.map(item => ({ id: String(item.id), projectId: item.project_id ? String(item.project_id) : undefined, actorId: String(item.actor_user_id || ''), eventType: String(item.event_type || ''), text: String(item.message), at: iso(item.created_at), clientVisible: false })), ...updates.map(item => ({ id: String(item.id), projectId: String(item.project_id), actorId: String(item.actor_user_id), text: String(item.message), at: iso(item.created_at), clientVisible: Boolean(item.client_visible) }))].sort((a,b) => b.at.localeCompare(a.at)) as Activity[],
    notifications: notifyRows(notificationRows, 'admin'), priorityOffering: offering(offerRow),
  };
  return { data, actorId: actor.id, clientAccountId: '' };
}

export async function clientSnapshot(): Promise<{ data: WorkspaceData; actorId: string; clientAccountId: string }> {
  const actor = await requireWorkspaceClient();
  const accessRows = await rows<Record<string, unknown>>('select a.* from public.client_project_access a join public.projects j on j.id=a.project_id where a.client_user_id=$1 and a.revoked_at is null and j.deleted_at is null',[actor.id]);
  const ids = accessRows.map(item => String(item.project_id));
  const [projects, steps, tasks, services, pics, clients, updates, notifications, priorityRows, offerRow] = await Promise.all([
    ids.length ? rows<Record<string, unknown>>('select * from public.projects where id=any($1::uuid[]) and status <> $2 and deleted_at is null',[ids,'archived']) : Promise.resolve([]),
    ids.length ? rows<Record<string, unknown>>('select * from public.project_steps where project_id=any($1::uuid[]) and client_visible=true order by project_id,position',[ids]) : Promise.resolve([]),
    ids.length ? rows<Record<string, unknown>>('select t.id,t.step_id,t.status from public.project_tasks t join public.project_steps s on s.id=t.step_id where s.project_id=any($1::uuid[]) and s.client_visible=true',[ids]) : Promise.resolve([]),
    rows<Record<string, unknown>>('select slug,name from public.workspace_services'),
    ids.length ? rows<Record<string, unknown>>('select distinct p.id,p.full_name,p.email from public.profiles p join public.projects j on j.pic_user_id=p.id where j.id=any($1::uuid[])',[ids]) : Promise.resolve([]),
    ids.length ? rows<Record<string, unknown>>('select distinct c.id,c.name from public.clients c join public.projects p on p.client_id=c.id where p.id=any($1::uuid[])',[ids]) : Promise.resolve([]),
    ids.length ? rows<Record<string, unknown>>('select * from public.project_updates where project_id=any($1::uuid[]) and client_visible=true order by created_at desc limit 200',[ids]) : Promise.resolve([]),
    rows<Record<string, unknown>>('select * from public.notifications where recipient_user_id=$1 order by created_at desc limit 200',[actor.id]),
    ids.length ? rows<Record<string, unknown>>('select distinct on(project_id) * from public.priority_requests where project_id=any($1::uuid[]) order by project_id,created_at desc',[ids]) : Promise.resolve([]),
    one<Record<string, unknown>>('select * from public.priority_offerings where singleton=true'),
  ]);
  const stageMap = nestStages(steps,tasks,'project_id','step_id',true);
  const clientOffering=offering(offerRow);
  if (clientOffering.stageIds.length) clientOffering.stageIds=steps.flatMap(step=>{
    const project=projects.find(item=>item.id===step.project_id);
    return project && clientOffering.stageIds.includes(`${project.service_slug}:${step.source_template_step_id}`) ? [`${project.service_slug}:${step.id}`] : [];
  });
  const data: WorkspaceData = { admins: pics.map(item => ({ id:String(item.id),name:String(item.full_name),email:'',active:true,mustChangePassword:false,createdAt:'' })),
    clients: clients.map(item => ({ id:String(item.id),name:String(item.name),email:'',phone:'' })), clientAccounts: [{ id:actor.id,name:actor.name,email:actor.email }],
    accesses: accessRows.map(item => ({ id:String(item.id),projectId:String(item.project_id),accountId:actor.id,grantedAt:iso(item.granted_at) })),
    services: services.map(item => ({ id:String(item.slug),name:String(item.name),approval:'starter',version:0,legalReviewRequired:true,stages:[] })),
    projects: projects.map(item => ({ ...projectRow(item,stageMap.get(String(item.id)) || [],[],priorityRows.find(row => row.project_id === item.id)), notes:'', supportingIds:[], creatorId:'', updatedById:'' })),
    activities: updates.map(item => ({ id:String(item.id),projectId:String(item.project_id),actorId:'',text:String(item.message),at:iso(item.created_at),clientVisible:true })),
    accessLinks:[],notifications:notifyRows(notifications,'client'),priorityOffering:clientOffering };
  return { data, actorId:'', clientAccountId:actor.id };
}
