'use client';

import { useState, useTransition } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { register } from '../actions';
import { createBrowserClient } from '@/lib/supabase/client';
import { useLang } from '@/lib/useLang';

export default function RegisterPage() {
    const [error, setError] = useState<string | null>(null);
    const [isPending, startTransition] = useTransition();
    const { t } = useLang();

    async function handleSubmit(formData: FormData) {
        setError(null);

        // Client-side validation
        const password = formData.get('password') as string;
        const confirmPassword = formData.get('confirmPassword') as string;

        if (password.length < 6) {
            setError('Password minimal 6 karakter.');
            return;
        }

        if (password !== confirmPassword) {
            setError('Konfirmasi password tidak cocok.');
            return;
        }

        startTransition(async () => {
            const result = await register(formData);
            if (result?.error) {
                setError(result.error);
            }
        });
    }

    async function handleGoogleLogin() {
        setError(null);
        const supabase = createBrowserClient();
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: `${window.location.origin}/auth/callback`,
            },
        });

        if (error) {
            setError(error.message);
        }
    }

    return (
        <div className="split-screen-container">
            {/* Left Box: Imagery */}
            <div className="split-left">
                <Image
                    src="/bg-indo-premium.png"
                    alt="Veralex Legal Luxury"
                    fill
                    priority
                    className="split-bg-image"
                />
                <div className="split-overlay" />
                <div className="split-left-content">
                    <div className="hero-badge" style={{ marginBottom: '1.5rem' }}>
                        <span className="badge-dot"></span>
                        {t('auth.split.badge')}
                    </div>
                    <h1 className="split-title">{t('auth.split.title')}</h1>
                    <p className="split-subtitle">
                        {t('auth.split.sub2')}
                    </p>
                </div>
            </div>

            {/* Right Box: Form */}
            <div className="split-right">
                <div className="auth-form-wrapper">
                    <Link href="/" className="auth-brand-link mb-8" style={{ display: 'inline-flex', marginBottom: '2rem' }}>
                        <Image src="/logo.jpg" alt="Veralex" width={50} height={50} className="auth-logo" style={{ borderRadius: '50%' }} />
                    </Link>

                    <h2 className="auth-heading">{t('auth.register.title')}</h2>
                    <p className="auth-desc">{t('auth.register.subtitle')}</p>

                    {error && (
                        <div className="auth-error-box">
                            {error}
                        </div>
                    )}

                    <form action={handleSubmit} className="premium-form">
                        <div className="form-group">
                            <label htmlFor="fullName">{t('auth.register.name')}</label>
                            <input
                                id="fullName"
                                name="fullName"
                                type="text"
                                placeholder="..."
                                required
                                autoComplete="name"
                                minLength={2}
                                disabled={isPending}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="email">{t('auth.login.email')}</label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                placeholder="nama@perusahaan.com"
                                required
                                autoComplete="email"
                                disabled={isPending}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="phone">{t('auth.register.phone')}</label>
                            <input
                                id="phone"
                                name="phone"
                                type="tel"
                                placeholder="+62 ..."
                                required
                                autoComplete="tel"
                                disabled={isPending}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="password">{t('auth.login.password')}</label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                placeholder="••••••••"
                                required
                                autoComplete="new-password"
                                minLength={6}
                                disabled={isPending}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="confirmPassword">{t('auth.register.confirmPassword')}</label>
                            <input
                                id="confirmPassword"
                                name="confirmPassword"
                                type="password"
                                placeholder="••••••••"
                                required
                                autoComplete="new-password"
                                minLength={6}
                                disabled={isPending}
                            />
                        </div>

                        <button
                            type="submit"
                            className="btn-editorial-solid"
                            style={{ width: '100%', marginTop: '1rem' }}
                            disabled={isPending}
                        >
                            {isPending ? t('auth.register.loading') : t('auth.register.submit')}
                        </button>
                    </form>

                    <div className="auth-separator">
                        <span className="separator-line"></span>
                        <span className="separator-text">ATAU</span>
                        <span className="separator-line"></span>
                    </div>

                    <button
                        type="button"
                        onClick={handleGoogleLogin}
                        className="btn-google-auth"
                        disabled={isPending}
                    >
                        <svg viewBox="0 0 24 24" width="24" height="24" xmlns="http://www.w3.org/2000/svg">
                            <g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)">
                                <path fill="#4285F4" d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z" />
                                <path fill="#34A853" d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.379 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.444 63.239 -14.754 63.239 Z" />
                                <path fill="#FBBC05" d="M -21.484 53.529 C -21.734 52.809 -21.864 52.039 -21.864 51.239 C -21.864 50.439 -21.724 49.669 -21.484 48.949 L -21.484 45.859 L -25.464 45.859 C -26.284 47.479 -26.754 49.299 -26.754 51.239 C -26.754 53.179 -26.284 54.999 -25.464 56.619 L -21.484 53.529 Z" />
                                <path fill="#EA4335" d="M -14.754 43.989 C -12.984 43.989 -11.404 44.599 -10.154 45.789 L -6.734 42.369 C -8.804 40.429 -11.514 39.239 -14.754 39.239 C -19.444 39.239 -23.494 41.939 -25.464 45.859 L -21.484 48.949 C -20.534 46.099 -17.884 43.989 -14.754 43.989 Z" />
                            </g>
                        </svg>
                        {t('auth.google')}
                    </button>

                    <p className="auth-footer-text">
                        {t('auth.register.footer')}{' '}
                        <Link href="/auth/login" className="auth-inline-link">
                            {t('auth.register.link')}
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
