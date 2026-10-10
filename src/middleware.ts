import { createServerClient as createWorkspaceServerClient, type CookieOptions } from '@supabase/ssr';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { isTransientAuthError } from '@/lib/workspace/auth-errors';

const SUPPORTED_LOCALES = ['en', 'zh', 'id'];
const WORKSPACE_ADMIN = ['/admin/proyek','/admin/klien','/admin/tim','/admin/pengaturan','/admin/notifikasi'];
const OWNER_UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const OWNER_AREA = ['/aksesraffi','/aksesraffi/login','/aksesraffi/ganti-password'];

export async function middleware(req: NextRequest) {
  let res=NextResponse.next({request:req}); const pathname=req.nextUrl.pathname;
  const configured=Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL&&process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
  if(OWNER_AREA.some(route=>pathname===route)){
    // Refreshes the owner session here because a Server Component cannot write cookies.
    // Authorization itself is enforced again on the page, its actions and its API.
    const expected=process.env.VERALEX_OWNER_USER_ID?.trim();
    if(!configured||!expected||!OWNER_UUID.test(expected))return NextResponse.redirect(new URL('/aksesraffi/login',req.url));
    const ownerClient=createWorkspaceServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!,process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,{cookies:{getAll:()=>req.cookies.getAll(),setAll:items=>{items.forEach(({name,value})=>req.cookies.set(name,value));res=NextResponse.next({request:req});items.forEach(({name,value,options})=>res.cookies.set(name,value,options));}}});
    let ownerUser; let ownerError;
    try{ const result=await ownerClient.auth.getUser(); ownerError=result.error; ownerUser=result.data.user; }catch{ return res; }
    if(ownerError&&isTransientAuthError(ownerError))return res;
    if(pathname==='/aksesraffi/login'){
      if(ownerUser&&ownerUser.id.toLowerCase()===expected.toLowerCase())return NextResponse.redirect(new URL('/aksesraffi',req.url));
      return res;
    }
    if(!ownerUser||ownerUser.id.toLowerCase()!==expected.toLowerCase())return NextResponse.redirect(new URL('/aksesraffi/login',req.url));
    if(pathname!=='/aksesraffi/ganti-password'){
      const rotation=await ownerClient.from('profiles').select('must_change_password').eq('id',ownerUser.id).maybeSingle();
      if(rotation.data?.must_change_password)return NextResponse.redirect(new URL('/aksesraffi/ganti-password',req.url));
    }
    return res;
  }
  const refreshedCookies = new Map<string, {name:string;value:string;options?:CookieOptions}>();
  const redirectWithCookies = (path:string) => {
    const response=NextResponse.redirect(new URL(path,req.url));
    refreshedCookies.forEach(cookie=>response.cookies.set(cookie.name,cookie.value,cookie.options));
    return response;
  };
  const workspaceAdmin=pathname==='/admin'||WORKSPACE_ADMIN.some(route=>pathname===route||pathname.startsWith(`${route}/`));
  const portal=pathname==='/portal'||pathname.startsWith('/portal/');
  const adminAuth=pathname==='/admin/login'||pathname==='/admin/aktivasi';
  if(pathname==='/invite'||pathname.startsWith('/invite/')||pathname.startsWith('/workspace/auth/callback')) return res;
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
    if(workspaceAdmin){if(!user||profile?.role!=='admin'||!profile.active)return redirectWithCookies('/admin/login');if(profile.must_change_password)return redirectWithCookies('/admin/aktivasi');}
    if(pathname==='/admin/aktivasi'&&(!user||profile?.role!=='admin'||!profile.active))return redirectWithCookies('/admin/login');
    if(portal&&pathname!=='/portal/login'&&(!user||profile?.role!=='client'||!profile.active))return redirectWithCookies('/portal/login');
    if(pathname==='/portal/login'&&user&&profile?.role==='client'&&profile.active)return redirectWithCookies('/portal');
    return res;
  }
  const pathnameHasLocale=SUPPORTED_LOCALES.some(locale=>pathname.startsWith(`/${locale}/`)||pathname===`/${locale}`);
  const unlocalized=pathnameHasLocale?pathname.replace(/^\/(en|zh|id)/,''):pathname;
  const isAuthPage=unlocalized.startsWith('/auth');
  const isDashboard=unlocalized.startsWith('/dashboard');
  const isLegacyAdmin=unlocalized.startsWith('/admin');
  if(!configured){if(isDashboard||isLegacyAdmin)return NextResponse.redirect(new URL('/auth/login',req.url));return res;}
  const supabase=createWorkspaceServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!,process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,{cookies:{getAll:()=>req.cookies.getAll(),setAll:items=>{items.forEach(({name,value,options})=>{req.cookies.set(name,value);refreshedCookies.set(name,{name,value,options});});res=NextResponse.next({request:req});refreshedCookies.forEach(cookie=>res.cookies.set(cookie.name,cookie.value,cookie.options));}}});
  let user;
  try {
    const result=await supabase.auth.getUser();
    if(result.error&&isTransientAuthError(result.error))return res;
    user=result.data.user;
  } catch { return res; }
  let profile;
  if(user){
    const result=await supabase.from('profiles').select('active,must_change_password,role').eq('id',user.id).maybeSingle();
    if(result.error&&isTransientAuthError(result.error))return res;
    profile=result.data;
  }
  if((isDashboard||isLegacyAdmin)&&(!user||!profile?.active))return redirectWithCookies('/auth/login');
  if(isLegacyAdmin&&profile?.role!=='admin')return redirectWithCookies('/auth/login');
  if(isLegacyAdmin&&profile?.must_change_password)return redirectWithCookies('/admin/aktivasi');
  if(isDashboard&&profile?.role==='admin')return redirectWithCookies('/admin');
  if(isDashboard&&profile?.role!=='client')return redirectWithCookies('/auth/login');
  if(user&&isAuthPage&&profile?.active)return redirectWithCookies(profile.role==='admin'?'/admin':'/dashboard');
  return res;
}
export const config={matcher:['/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)']};
