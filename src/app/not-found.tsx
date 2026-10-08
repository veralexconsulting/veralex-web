'use client';

import Link from 'next/link';
import { useLang } from '@/lib/useLang';

export default function NotFound() {
    const { t } = useLang();

    return (
        <main
            style={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                padding: '120px 0 80px',
            }}
        >
            <div className="container" style={{ textAlign: 'center' }}>
                <p
                    style={{
                        fontFamily: 'var(--font-heading)',
                        fontSize: 'clamp(4rem, 14vw, 8rem)',
                        lineHeight: 1,
                        color: 'var(--color-primary)',
                        fontWeight: 600,
                        margin: 0,
                    }}
                >
                    404
                </p>
                <h1 className="section-title" style={{ marginTop: '1rem' }}>
                    {t('nf.title')}
                </h1>
                <p className="section-subtitle" style={{ marginBottom: '2.5rem' }}>
                    {t('nf.text')}
                </p>
                <div
                    style={{
                        display: 'flex',
                        gap: '1rem',
                        justifyContent: 'center',
                        flexWrap: 'wrap',
                    }}
                >
                    <Link href="/" className="btn btn-primary">
                        {t('nav.home')}
                    </Link>
                    <Link href="/#services" className="btn btn-outline">
                        {t('nav.services')}
                    </Link>
                </div>
            </div>
        </main>
    );
}
