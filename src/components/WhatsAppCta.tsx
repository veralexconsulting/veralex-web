'use client';

import { useLang } from '@/lib/useLang';

const WA_ICON = "M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.885m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z";

export default function WhatsAppCta() {
    const { t } = useLang();

    return (
        <section style={{
            padding: '80px 0',
            background: 'var(--bg-card)',
            borderTop: 'var(--border-gold)',
            borderBottom: 'var(--border-gold)',
            position: 'relative',
            overflow: 'hidden',
        }}>
            {/* Subtle maroon glow */}
            <div style={{
                position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
                width: '400px', height: '400px', borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(74, 14, 14, 0.05) 0%, transparent 70%)',
                pointerEvents: 'none',
            }} />

            <div className="container" style={{ position: 'relative', zIndex: 1 }}>
                <div className="fade-in" style={{ textAlign: 'center' }}>
                    <div style={{
                        width: '80px', height: '80px', borderRadius: '50%',
                        background: 'rgba(74, 14, 14, 0.08)',
                        border: '2px solid rgba(74, 14, 14, 0.2)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        margin: '0 auto 1.5rem',
                    }}>
                        <svg width="40" height="40" viewBox="0 0 24 24" fill="var(--color-gold)">
                            <path d={WA_ICON} />
                        </svg>
                    </div>
                    <h2 style={{
                        fontFamily: 'var(--font-heading)',
                        fontSize: 'clamp(1.8rem, 3.5vw, 2.5rem)',
                        background: 'var(--color-gold-gradient)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                        marginBottom: '1rem',
                    }}>
                        {t('wa.title')}
                    </h2>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', fontSize: '1.05rem' }}>
                        {t('wa.subtitle')}
                    </p>
                    <a
                        href="https://wa.me/6281219476385?text=Halo%20VERALEX,%20saya%20tertarik%20dengan%20layanan%20legalitas"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-primary btn-lg"
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '0.75rem' }}
                    >
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                            <path d={WA_ICON} />
                        </svg>
                        {t('wa.cta')}
                    </a>
                </div>
            </div>
        </section>
    );
}
