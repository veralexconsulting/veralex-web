'use client';
import { createBrowserClient } from '@supabase/ssr';
import { WORKSPACE_OAUTH_CALLBACK_PATH, WORKSPACE_OAUTH_INTENT_COOKIE } from './oauth';

export function workspaceBrowser() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) throw new Error('Supabase Auth belum dikonfigurasi.');
  return createBrowserClient(url, key, {
    // Keep the same browser client and persist auth in the SSR cookie format
    // consumed by middleware and server components on both portal surfaces.
    isSingleton: true,
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  });
}

export function workspaceOAuthRedirectTo(intent: 'portal' | 'invite') {
  const secure = window.location.protocol === 'https:' ? '; Secure' : '';
  document.cookie = `${WORKSPACE_OAUTH_INTENT_COOKIE}=${intent}; Path=${WORKSPACE_OAUTH_CALLBACK_PATH}; Max-Age=600; SameSite=Lax${secure}`;
  return `${window.location.origin}${WORKSPACE_OAUTH_CALLBACK_PATH}`;
}
