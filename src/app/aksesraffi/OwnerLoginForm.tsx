'use client';

import Image from 'next/image';
import { useState, useTransition } from 'react';
import { ownerSignIn } from './actions';

export default function OwnerLoginForm() {
    const [error, setError] = useState<string | null>(null);
    const [visible, setVisible] = useState(false);
    const [pending, startTransition] = useTransition();

    async function submit(formData: FormData) {
        setError(null);
        startTransition(async () => {
            const result = await ownerSignIn(formData);
            if (result?.error) setError(result.error);
        });
    }

    return (
        <main className="owner-auth">
            <form className="owner-card" action={submit}>
                <Image src="/logo.webp" alt="VERALEX CONSULTING" width={72} height={72} priority className="owner-logo" />
                <p className="owner-eyebrow">Akses Proprietaris</p>
                <h1 className="owner-title">Masuk sebagai pemilik</h1>
                <p className="owner-muted">Halaman ini khusus pemilik VERALEX. Akun administrator dan klien tidak dapat membukanya.</p>

                <label className="owner-field" htmlFor="owner-username">Nama pengguna
                    <input id="owner-username" name="username" type="text" autoComplete="username" autoCapitalize="none" spellCheck={false} required disabled={pending} autoFocus />
                </label>

                <label className="owner-field" htmlFor="owner-password">Kata sandi
                    <span className="owner-password">
                        <input id="owner-password" name="password" type={visible ? 'text' : 'password'} autoComplete="current-password" required disabled={pending} />
                        <button type="button" className="owner-reveal" onClick={() => setVisible(!visible)} disabled={pending} aria-pressed={visible}>
                            {visible ? 'Sembunyikan' : 'Lihat'}
                        </button>
                    </span>
                </label>

                {error && <p className="owner-error" role="alert">{error}</p>}

                <button type="submit" className="owner-button" disabled={pending} aria-busy={pending}>
                    {pending ? 'Memverifikasi…' : 'Masuk'}
                </button>
                <p className="owner-note">Sesi berakhir otomatis setelah keluar dari peramban ini.</p>
            </form>
        </main>
    );
}
