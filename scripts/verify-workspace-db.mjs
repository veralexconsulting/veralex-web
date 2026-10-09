import pg from 'pg';
import { workspacePgSsl } from '../src/lib/workspace/pg-ssl.mjs';

if(!process.env.DATABASE_URL)throw new Error('DATABASE_URL belum tersedia; verifikasi database nyata tidak dijalankan.');
const pool=new pg.Pool({connectionString:process.env.DATABASE_URL,ssl:workspacePgSsl()});
try{
  const tables=['profiles','clients','workspace_services','workflow_templates','workflow_template_steps','workflow_template_tasks','projects','project_steps','project_tasks','project_access_links','client_project_access','project_updates','audit_logs','priority_offerings','priority_requests','workspace_payments','payment_webhook_events','notifications','notification_outbox'];
  const rls=await pool.query('select relname,relrowsecurity from pg_class where relnamespace=$1::regnamespace and relname=any($2::text[])',['public',tables]);
  if(rls.rows.length!==tables.length||rls.rows.some(row=>!row.relrowsecurity))throw new Error('RLS belum aktif pada semua tabel workspace.');
  const catalog=await pool.query("select s.slug,count(distinct st.id)::int as steps,count(tt.id)::int as tasks from public.workspace_services s left join public.workflow_templates t on t.service_slug=s.slug and t.status='published' left join public.workflow_template_steps st on st.template_id=t.id left join public.workflow_template_tasks tt on tt.step_id=st.id group by s.slug");
  if(catalog.rows.length<20||catalog.rows.some(row=>row.steps<8||row.tasks<16))throw new Error('SOP terbit belum lengkap untuk semua layanan.');
  const procedures=await pool.query("select proname from pg_proc where pronamespace='private'::regnamespace and proname in ('workspace_is_admin','workspace_has_access')");
  if(procedures.rows.length!==2)throw new Error('Fungsi kebijakan akses belum lengkap.');
  console.log(`Database verified: ${rls.rows.length} RLS tables, ${catalog.rows.length} populated services.`);
}finally{await pool.end();}
