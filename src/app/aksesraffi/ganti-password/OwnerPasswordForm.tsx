'use client';

import Link from 'next/link';
import { useState, useTransition } from 'react';
import { ownerChangePassword, ownerSignOut } from '../actions';

const strength = (value: string) => [
    { label: 'Minimal 12 karakter', ok: value.length >= 12 },
    { label: 'Huruf besar', ok: /[A-Z]/.test(value) },
    { label: 'Huruf kecil', ok: /[a-z]/.test(value) },
    { label: 'Angka', ok: /\d/.test(value) },
];

export default function OwnerPasswordForm() {
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [pending, startTransition] = useTransition();
    const checks = strength(password);

    async function submit(formData: FormData) {
        setError(null);
        startTransition(async () => {
            const result = await ownerChangePassword(formData);
            if (result?.error) setError(result.error);
        });
    }

    return (
        <main className="owner-auth">
            <form className="owner-card" action={submit}>
                <p className="owner-eyebrow">Langkah wajib</p>
                <h1 className="owner-title">Ganti kata sandi awal</h1>
                <p className="owner-muted">Analitik baru terbuka setelah kata sandi awal diganti. Gunakan kombinasi yang tidak dipakai di layanan lain.</p>

                <label className="owner-field" htmlFor="owner-new">Kata sandi baru
                    <input id="owner-new" name="password" type="password" autoComplete="new-password" required disabled={pending} autoFocus onChange={event => setPassword(event.target.value)} />
                </label>
                <ul className="owner-checks" aria-live="polite">
                    {checks.map(check => <li key={check.label} className={check.ok ? 'ok' : ''}>{check.label}</li>)}
                </ul>

                <label className="owner-field" htmlFor="owner-confirm">Ulangi kata sandi baru
                    <input id="owner-confirm" name="confirm" type="password" autoComplete="new-password" required disabled={pending} />
                </label>

                {error && <p className="owner-error" role="alert">{error}</p>}

                <button type="submit" className="owner-button" disabled={pending || !checks.every(check => check.ok)} aria-busy={pending}>
                    {pending ? 'Menyimpan…' : 'Simpan kata sandi'}
                </button>
                <button type="button" className="owner-link" onClick={() => ownerSignOut()} disabled={pending}>Keluar tanpa mengganti</button>
                <Link href="/" className="owner-note">Kembali ke situs VERALEX</Link>
            </form>
        </main>
    );
}
