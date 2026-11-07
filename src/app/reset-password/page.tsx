'use client';

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createBrowserClient } from '@supabase/ssr';
import '@/features/workspace/workspace.css';

/*
 * Password recovery landing page.
 *
 * Supabase recovery emails deliver the session in the URL *fragment*
 * (#access_token=...&refresh_token=...&type=recovery), which never reaches the
 * server. The client SDK's detectSessionInUrl picks it up here, then we ask the
 * user for a new password and persist it with updateUser.
 *
 * A dedicated client (not the shared workspace singleton) is intentional: the
 * singleton reuses an existing persisted session, which would mask the recovery
 * session we are trying to establish.
 */
function recoveryClient() {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!url || !key) throw new Error('Supabase Auth belum dikonfigurasi.');
    return createBrowserClient(url, key, {
        isSingleton: false,
        auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true },
    });
}

type Status = 'checking' | 'ready' | 'saving' | 'done' | 'invalid';

const MIN_PASSWORD = 8;

export default function ResetPasswordPage() {
    const router = useRouter();
    const supabase = useMemo(recoveryClient, []);
    const [status, setStatus] = useState<Status>('checking');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirm, setConfirm] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        let cancelled = false;

        /* The fragment is consumed by the SDK asynchronously, so wait for the
           auth state instead of reading window.location.hash ourselves. */
        const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
            if (cancelled) return;
            if (event === 'PASSWORD_RECOVERY' || event === 'SIGNED_IN') {
                if (session?.user) {
                    setEmail(session.user.email ?? '');
                    setStatus(current => (current === 'done' ? current : 'ready'));
                }
            }
        });

        supabase.auth.getSession().then(({ data }) => {
            if (cancelled) return;
            if (data.session?.user) {
                setEmail(data.session.user.email ?? '');
                setStatus(current => (current === 'checking' ? 'ready' : current));
            } else {
                /* Give the SDK a moment to parse the fragment before declaring
                   the link invalid — an instant getSession() often runs first. */
                window.setTimeout(() => {
                    if (cancelled) return;
                    setStatus(current => (current === 'checking' ? 'invalid' : current));
                }, 1500);
            }
        });

        return () => { cancelled = true; sub.subscription.unsubscribe(); };
    }, [supabase]);

    async function submit(event: React.FormEvent) {
        event.preventDefault();
        setError('');
        if (password.length < MIN_PASSWORD) return setError(`Password minimal ${MIN_PASSWORD} karakter.`);
        if (password !== confirm) return setError('Konfirmasi password tidak sama.');
        setStatus('saving');
        const { error: updateError } = await supabase.auth.updateUser({ password });
        if (updateError) {
            setError(updateError.message);
            setStatus('ready');
            return;
        }
        setStatus('done');
        window.setTimeout(() => router.replace('/admin/login'), 1800);
    }

    return <main className="workspace ws-auth-simple ws-reset-page">
        <div className="ws-auth-card ws-reset-card">
            <Image src="/logo.webp" alt="VERALEX CONSULTING" width={1024} height={724} priority className="ws-reset-logo" />

            {status === 'checking' && <p className="ws-muted" role="status">Memeriksa tautan pemulihan…</p>}

            {status === 'invalid' && <>
                <h1>Tautan tidak valid</h1>
                <p className="ws-error" role="alert">
                    Tautan pemulihan sudah dipakai, kedaluwarsa, atau tidak lengkap. Minta tautan baru dari halaman login.
                </p>
                <Link className="ws-button ws-button-primary" href="/admin/login">Kembali ke login</Link>
            </>}

            {(status === 'ready' || status === 'saving') && <>
                <h1>Atur password baru</h1>
                <p className="ws-muted">Masuk sebagai <strong>{email}</strong></p>
                <form onSubmit={submit} className="ws-reset-form">
                    <label className="ws-field">
                        <span>Password baru</span>
                        <input type="password" autoComplete="new-password" required minLength={MIN_PASSWORD}
                            value={password} onChange={e => setPassword(e.target.value)} disabled={status === 'saving'} />
                    </label>
                    <label className="ws-field">
                        <span>Ulangi password baru</span>
                        <input type="password" autoComplete="new-password" required minLength={MIN_PASSWORD}
                            value={confirm} onChange={e => setConfirm(e.target.value)} disabled={status === 'saving'} />
                    </label>
                    {error && <p className="ws-error" role="alert">{error}</p>}
                    <button type="submit" className="ws-button ws-button-primary" disabled={status === 'saving'}>
                        {status === 'saving' ? 'Menyimpan…' : 'Simpan password'}
                    </button>
                </form>
            </>}

            {status === 'done' && <>
                <h1>Password tersimpan</h1>
                <p className="ws-muted" role="status">Password baru sudah aktif. Anda akan diarahkan ke halaman login.</p>
                <Link className="ws-button ws-button-primary" href="/admin/login">Masuk sekarang</Link>
            </>}
        </div>
    </main>;
}
