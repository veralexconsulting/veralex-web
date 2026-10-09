'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { workspaceBrowser, workspaceOAuthRedirectTo } from '@/lib/workspace/browser';
import '@/features/workspace/workspace.css';

export default function PortalLogin() {
  const [error,setError]=useState(''); const [busy,setBusy]=useState(false);
  useEffect(()=>{if(new URLSearchParams(window.location.search).get('error')==='callback')setError('Login Google belum berhasil. Silakan coba lagi.');},[]);
  async function login() { setBusy(true);setError('');try { const {error:authError}=await workspaceBrowser().auth.signInWithOAuth({provider:'google',options:{redirectTo:workspaceOAuthRedirectTo('portal')}});if(authError)throw authError; }catch(cause){setError(cause instanceof Error?cause.message:'Login Google gagal.');setBusy(false);} }
  return <div className="workspace ws-auth-simple"><div className="ws-auth-card"><Link className="ws-logo-link" href="/"><Image src="/logo.webp" alt="VERALEX CONSULTING" width={1024} height={724} priority /></Link><p className="ws-eyebrow">Portal Klien</p><h1>Masuk ke proyek Anda</h1><p className="ws-muted">Gunakan akun Google yang pernah mengklaim tautan proyek VERALEX.</p><button className="ws-button ws-button-primary ws-full" onClick={login} disabled={busy}>{busy?'Menghubungkan…':'Lanjutkan dengan Google'}</button>{error&&<p className="ws-error" role="alert">{error}</p>}</div></div>;
}
