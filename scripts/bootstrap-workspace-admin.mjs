import { createClient } from '@supabase/supabase-js';
import pg from 'pg';

const { NEXT_PUBLIC_SUPABASE_URL:url, SUPABASE_SERVICE_ROLE_KEY:key, DATABASE_URL:databaseUrl, WORKSPACE_BOOTSTRAP_EMAIL:email, WORKSPACE_BOOTSTRAP_NAME:name, WORKSPACE_BOOTSTRAP_PASSWORD:password }=process.env;
if (!url || !key || !databaseUrl || !email || !name || !password) throw new Error('Setel NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, DATABASE_URL, WORKSPACE_BOOTSTRAP_EMAIL, WORKSPACE_BOOTSTRAP_NAME, dan WORKSPACE_BOOTSTRAP_PASSWORD.');
if (password.length<12 || !/[A-Z]/.test(password) || !/[a-z]/.test(password) || !/\d/.test(password)) throw new Error('Kata sandi awal wajib minimal 12 karakter dengan huruf besar, kecil, dan angka.');
const pool=new pg.Pool({connectionString:databaseUrl,ssl:process.env.DATABASE_SSL==='disable'?false:{rejectUnauthorized:true}});
const service=createClient(url,key,{auth:{persistSession:false,autoRefreshToken:false}});
try {
  const existing=await pool.query("select count(*)::int as count from public.profiles where role='admin' and active=true");
  if (existing.rows[0].count>0) throw new Error('Admin aktif sudah ada. Bootstrap hanya untuk admin pertama.');
  const created=await service.auth.admin.createUser({email:email.toLowerCase(),password,email_confirm:true,user_metadata:{full_name:name},app_metadata:{workspace_role:'admin',must_change_password:true}});
  if (created.error || !created.data.user) throw new Error('Akun admin pertama tidak dapat dibuat. Periksa email dan konfigurasi Auth.');
  try {
    await pool.query("insert into public.profiles(id,email,full_name,role,active,must_change_password) values($1,$2,$3,'admin',true,true) on conflict(id) do update set role='admin',active=true,must_change_password=true,full_name=$3",[created.data.user.id,email.toLowerCase(),name]);
    const legacy=await pool.query("select to_regclass('public.users') as table_name");
    if(legacy.rows[0].table_name)await pool.query("update public.users set role='admin',full_name=$2 where id=$1",[created.data.user.id,name]);
    console.log('Admin pertama dibuat. Masuk dan ganti kata sandi awal.');
  } catch (error) { await service.auth.admin.deleteUser(created.data.user.id); throw error; }
} finally { await pool.end(); }
