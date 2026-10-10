import { createServerClient as createLegacyServerClient } from '@supabase/auth-helpers-nextjs';
import { createServerClient as createWorkspaceServerClient } from '@supabase/ssr';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { isTransientAuthError } from '@/lib/workspace/auth-errors';

const SUPPORTED_LOCALES = ['en', 'zh', 'id'];
const WORKSPACE_ADMIN = ['/admin/proyek','/admin/klien','/admin/tim','/admin/pengaturan','/admin/notifikasi'];

export async function middleware(req: NextRequest) {
  let res=NextResponse.next({request:req}); const pathname=req.nextUrl.pathname;
  const refreshedCookies = new Map<string, {name:string;value:string;options?:Record<string,unknown>}>();
  const workspaceAdmin=pathname==='/admin'||WORKSPACE_ADMIN.some(route=>pathname===route||pathname.startsWith(`${route}/`));
  const portal=pathname==='/portal'||pathname.startsWith('/portal/');
  const adminAuth=pathname==='/admin/login'||pathname==='/admin/aktivasi';
  if(pathname==='/invite'||pathname.startsWith('/invite/')||pathname.startsWith('/workspace/auth/callback')) return res;
  const configured=Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL&&process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
  if(workspaceAdmin||portal||adminAuth){
    if(!configured){ if(workspaceAdmin)return NextResponse.redirect(new URL('/admin/login',req.url)); if(portal&&pathname!=='/portal/login')return NextResponse.redirect(new URL('/portal/login',req.url));return res; }
    const supabase=createWorkspaceServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!,process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,{cookies:{getAll:()=>req.cookies.getAll(),setAll:items=>{items.forEach(({name,value,options})=>{req.cookies.set(name,value);refreshedCookies.set(name,{name,value,options});});res=NextResponse.next({request:req});refreshedCookies.forEach(cookie=>res.cookies.set(cookie.name,cookie.value,cookie.options));}}});
    let user; let profile; let profileError;
    try {
      const authResult=await supabase.auth.getUser();
      if(authResult.error&&isTransientAuthError(authResult.error)) return res;
      user=authResult.data.user;
      if(user){const result=await supabase.from('profiles').select('role,active,must_change_password').eq('id',user.id).maybeSingle();profile=result.data;profileError=result.error;}
    } catch { return res; }
    if(profileError&&isTransientAuthError(profileError))return res;
    if(workspaceAdmin){if(!user||profile?.role!=='admin'||!profile.active)return NextResponse.redirect(new URL('/admin/login',req.url));if(profile.must_change_password)return NextResponse.redirect(new URL('/admin/aktivasi',req.url));}
    if(pathname==='/admin/aktivasi'&&(!user||profile?.role!=='admin'||!profile.active))return NextResponse.redirect(new URL('/admin/login',req.url));
    if(portal&&pathname!=='/portal/login'&&(!user||profile?.role!=='client'||!profile.active))return NextResponse.redirect(new URL('/portal/login',req.url));
    if(pathname==='/portal/login'&&user&&profile?.role==='client'&&profile.active)return NextResponse.redirect(new URL('/portal',req.url));
    return res;
  }
  const pathnameHasLocale=SUPPORTED_LOCALES.some(locale=>pathname.startsWith(`/${locale}/`)||pathname===`/${locale}`);
  const unlocalized=pathnameHasLocale?pathname.replace(/^\/(en|zh|id)/,''):pathname;
  const isAuthPage=unlocalized.startsWith('/auth');
  const isDashboard=unlocalized.startsWith('/dashboard');
  const isLegacyAdmin=unlocalized.startsWith('/admin');
  if(!configured){if(isDashboard||isLegacyAdmin)return NextResponse.redirect(new URL('/auth/login',req.url));return res;}
  const supabase=createLegacyServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!,process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,{cookies:{getAll:()=>req.cookies.getAll(),setAll:items=>items.forEach(({name,value,options})=>{req.cookies.set(name,value);res.cookies.set(name,value,options);})}});
  const {data:{session}}=await supabase.auth.getSession();
  if(session&&(isDashboard||isLegacyAdmin)){
    const {data:workspaceProfile}=await supabase.from('profiles').select('active,must_change_password,role').eq('id',session.user.id).maybeSingle();
    if(workspaceProfile&&!workspaceProfile.active)return NextResponse.redirect(new URL('/auth/login',req.url));
    if(isLegacyAdmin&&workspaceProfile?.role==='admin'&&workspaceProfile.must_change_password)return NextResponse.redirect(new URL('/admin/aktivasi',req.url));
  }
  if(!session&&(isDashboard||isLegacyAdmin))return NextResponse.redirect(new URL('/auth/login',req.url));
  if(session&&isAuthPage){const {data:profile}=await supabase.from('users').select('role').eq('id',session.user.id).single();return NextResponse.redirect(new URL(profile?.role==='admin'?'/admin':'/dashboard',req.url));}
  return res;
}
export const config={matcher:['/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)']};
