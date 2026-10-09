import { timingSafeEqual } from 'node:crypto';
import { NextResponse, type NextRequest } from 'next/server';
import { transaction } from '@/lib/workspace/db';

export async function GET(request:NextRequest) {
  const secret=process.env.CRON_SECRET; const supplied=request.headers.get('authorization')?.replace(/^Bearer /,'')||'';
  const expected=Buffer.from(secret||''); const actual=Buffer.from(supplied);
  if (!secret || !supplied || actual.length!==expected.length || !timingSafeEqual(actual,expected)) return new NextResponse(null,{status:401});
  const count=await transaction(async c=>{
    await c.query("delete from public.workspace_rate_limits where window_start < now() - interval '7 days'");
    const due=await c.query("select p.id,p.title,p.pic_user_id,p.follow_up_at::text as day from public.projects p where p.follow_up_at<=(now() at time zone 'Asia/Jakarta')::date and p.status not in ('completed','cancelled','archived')");
    const tasks=await c.query("select p.id,p.title,p.pic_user_id,t.id as task_id,t.title as task_title,t.due_at::text as day from public.project_tasks t join public.project_steps s on s.id=t.step_id join public.projects p on p.id=s.project_id where t.due_at<(now() at time zone 'Asia/Jakarta')::date and t.status not in ('completed','skipped') and p.status not in ('completed','cancelled','archived')");
    let created=0;
    for(const item of due.rows){const key=`followup:${item.id}:${item.day}`;const result=await c.query("insert into public.notifications(recipient_user_id,project_id,event_type,title,message,target_path,dedupe_key) values($1,$2,'follow_up','Tindak lanjut proyek',$3,$4,$5) on conflict(dedupe_key) do nothing returning id",[item.pic_user_id,item.id,`Jadwal tindak lanjut ${item.title} sudah tiba.`,`/admin/proyek/${item.id}`,key]);if(result.rows[0]){created++;await c.query("insert into public.notification_outbox(notification_id,channel,status) values($1,'in_app','sent')",[result.rows[0].id]);}}
    for(const item of tasks.rows){const key=`overdue:${item.task_id}:${new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Jakarta',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date())}`;const result=await c.query("insert into public.notifications(recipient_user_id,project_id,event_type,title,message,target_path,dedupe_key) values($1,$2,'task_overdue','Tugas melewati jadwal',$3,$4,$5) on conflict(dedupe_key) do nothing returning id",[item.pic_user_id,item.id,`${item.task_title} pada ${item.title} perlu ditindaklanjuti.`,`/admin/proyek/${item.id}`,key]);if(result.rows[0]){created++;await c.query("insert into public.notification_outbox(notification_id,channel,status) values($1,'in_app','sent')",[result.rows[0].id]);}}
    return created;
  });
  return NextResponse.json({created:count});
}
