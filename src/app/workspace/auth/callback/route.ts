import { NextResponse, type NextRequest } from 'next/server';
import { workspaceSupabase } from '@/lib/workspace/supabase';

export async function GET(request:NextRequest) {
  const code=request.nextUrl.searchParams.get('code');
  const next=request.nextUrl.searchParams.get('next')||'/portal';
  const destination=next==='/invite' || next==='/admin/aktivasi' || next==='/portal' ? next : '/portal';
  const failure=next==='/invite'||next==='/portal'?'/portal/login?error=callback':'/admin/login?error=callback';
  if (!code) return NextResponse.redirect(new URL(failure,request.url));
  const auth=await workspaceSupabase();
  const {error}=await auth.auth.exchangeCodeForSession(code);
  return NextResponse.redirect(new URL(error?failure:destination,request.url));
}
