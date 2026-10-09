'use client';
import { createBrowserClient } from '@supabase/ssr';
import { WORKSPACE_OAUTH_CALLBACK_PATH, WORKSPACE_OAUTH_INTENT_COOKIE } from './oauth';

export function workspaceBrowser() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) throw new Error('Supabase Auth belum dikonfigurasi.');
  return createBrowserClient(url, key);
}

export function workspaceOAuthRedirectTo(intent: 'portal' | 'invite') {
  const secure = window.location.protocol === 'https:' ? '; Secure' : '';
  document.cookie = `${WORKSPACE_OAUTH_INTENT_COOKIE}=${intent}; Path=${WORKSPACE_OAUTH_CALLBACK_PATH}; Max-Age=600; SameSite=Lax${secure}`;
  return `${window.location.origin}${WORKSPACE_OAUTH_CALLBACK_PATH}`;
}
