import { NextResponse, type NextRequest } from 'next/server';
import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { WORKSPACE_OAUTH_CALLBACK_PATH, WORKSPACE_OAUTH_INTENT_COOKIE } from '@/lib/workspace/oauth';
import { one } from '@/lib/workspace/db';
import { recordLoginEvent } from '@/lib/owner/events';

export async function GET(request:NextRequest) {
  const code=request.nextUrl.searchParams.get('code');
  const next=request.nextUrl.searchParams.get('next')||'/portal';
  const intent=request.cookies.get(WORKSPACE_OAUTH_INTENT_COOKIE)?.value;
  const destination=next==='/admin/aktivasi' ? next : intent==='invite' ? '/invite' : '/portal';
  const failure=next==='/admin/aktivasi'?'/admin/login?error=callback':'/portal/login?error=callback';
  if (!code) return redirectAndClearIntent(failure,request);
  if(!process.env.NEXT_PUBLIC_SUPABASE_URL||!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) return redirectAndClearIntent(failure,request);
  // Auth cookies must be attached to the redirect response itself. Mutating
  // cookies() through a server helper and then returning a newly-created
  // NextResponse can drop the exchanged session in some Next.js runtimes.
  const authCookies=new Map<string,{name:string;value:string;options?:CookieOptions}>();
  const auth=createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL,process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,{
    cookies:{
      getAll:()=>request.cookies.getAll(),
      setAll:items=>{
        for(const item of items){request.cookies.set(item.name,item.value);authCookies.set(item.name,item);}
      },
    },
  });
  const {data,error}=await auth.auth.exchangeCodeForSession(code);
  if(!error&&data.user){
    // One verified sign-in per completed OAuth callback. Repeated callbacks
    // inside the same minute collapse onto the same dedupe key.
    const profile=await one<{role:'admin'|'client'}>('select role from public.profiles where id=$1',[data.user.id]).catch(()=>undefined);
    await recordLoginEvent(data.user.id,profile?.role==='admin'?'admin':'client').catch(()=>undefined);
  }
  return redirectAndClearIntent(error?failure:destination,request,[...authCookies.values()]);
}

function redirectAndClearIntent(path: string, request: NextRequest, authCookies:{name:string;value:string;options?:CookieOptions}[] = []) {
  const response=NextResponse.redirect(new URL(path,request.url));
  for(const cookie of authCookies)response.cookies.set(cookie.name,cookie.value,cookie.options);
  response.cookies.set(WORKSPACE_OAUTH_INTENT_COOKIE,'',{path:WORKSPACE_OAUTH_CALLBACK_PATH,maxAge:0,sameSite:'lax',secure:request.nextUrl.protocol==='https:'});
  return response;
}
