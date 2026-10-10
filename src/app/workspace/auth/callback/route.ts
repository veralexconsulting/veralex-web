import { NextResponse, type NextRequest } from 'next/server';
import { workspaceSupabase } from '@/lib/workspace/supabase';
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
  const auth=await workspaceSupabase();
  const {data,error}=await auth.auth.exchangeCodeForSession(code);
  if(!error&&data.user){
    // One verified sign-in per completed OAuth callback. Repeated callbacks
    // inside the same minute collapse onto the same dedupe key.
    const profile=await one<{role:'admin'|'client'}>('select role from public.profiles where id=$1',[data.user.id]).catch(()=>undefined);
    await recordLoginEvent(data.user.id,profile?.role==='admin'?'admin':'client').catch(()=>undefined);
  }
  return redirectAndClearIntent(error?failure:destination,request);
}

function redirectAndClearIntent(path: string, request: NextRequest) {
  const response=NextResponse.redirect(new URL(path,request.url));
  response.cookies.set(WORKSPACE_OAUTH_INTENT_COOKIE,'',{path:WORKSPACE_OAUTH_CALLBACK_PATH,maxAge:0,sameSite:'lax',secure:request.nextUrl.protocol==='https:'});
  return response;
}
