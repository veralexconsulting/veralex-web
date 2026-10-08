'use client';

import { useLang } from '@/lib/useLang';
import { whatsappHref } from '@/lib/marketing';

const CHECK = 'M5 13l4 4L19 7';
const GIFT = 'M20 12v10H4V12M2 7h20v5H2zM12 22V7m0 0H7.5a2.5 2.5 0 110-5C11 2 12 7 12 7zm0 0h4.5a2.5 2.5 0 100-5C13 2 12 7 12 7z';
const ARROW_RIGHT = 'M13 7l5 5m0 0l-5 5m5-5H6';

export default function PromoBanner() {
    const { t } = useLang();

    return (
        <section style={{
            padding: '60px 0',
            background: 'var(--bg-card)',
            borderTop: 'var(--border-gold-strong)',
            borderBottom: 'var(--border-gold-strong)',
            position: 'relative',
            overflow: 'hidden',
        }}>
            <div style={{
                position: 'absolute', top: '-50%', left: '-10%', width: '120%', height: '200%',
                background: 'radial-gradient(ellipse at center, rgba(74, 14, 14, 0.05) 0%, transparent 70%)',
                pointerEvents: 'none',
            }} />

            <div className="container" style={{ position: 'relative', zIndex: 1 }}>
                <div className="fade-in" style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto' }}>
                    <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        background: 'var(--color-gold-gradient)',
                        color: '#ffffff',
                        padding: '6px 20px',
                        borderRadius: 'var(--radius-xl)',
                        fontWeight: 700,
                        fontSize: '0.85rem',
                        letterSpacing: '0.05em',
                        marginBottom: '1.5rem',
                    }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d={GIFT} /></svg>
                        {t('promo.tag')}
                    </span>

                    <h2 style={{
                        fontFamily: 'var(--font-heading)',
                        fontSize: 'clamp(1.5rem, 3.5vw, 2.5rem)',
                        marginBottom: '1rem',
                        color: 'var(--text-primary)',
                    }}>
                        {t('promo.title')}
                    </h2>

                    <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', marginBottom: '1rem', lineHeight: 1.7 }}>
                        {t('promo.subtitle')}
                    </p>

                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                        gap: '0.75rem',
                        margin: '1.5rem 0',
                        textAlign: 'left',
                    }}>
                        {[
                            t('promo.b1'),
                            t('promo.b2'),
                            t('promo.b3'),
                            t('promo.b4'),
                            t('promo.b5'),
                            t('promo.b6'),
                        ].map((item) => (
                            <div key={item} style={{
                                padding: '0.6rem 1rem',
                                background: 'rgba(74, 14, 14, 0.05)',
                                borderRadius: 'var(--radius-sm)',
                                border: '1px solid rgba(74, 14, 14, 0.12)',
                                color: 'var(--text-primary)',
                                fontSize: '0.9rem',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                            }}>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-gold)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                                    <path d={CHECK} />
                                </svg>
                                {item}
                            </div>
                        ))}
                    </div>

                    <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', fontSize: '0.9rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-gold)" strokeWidth="2"><path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        <strong style={{ color: 'var(--color-gold)' }}>{t('promo.save')}</strong>
                    </p>

                    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                        <a
                            href={whatsappHref(t('wa.message.promo'))}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-primary btn-lg"
                        >
                            {t('promo.cta')}
                        </a>
                        <a href="#pricing" className="btn btn-outline" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                            {t('promo.allPackages')}
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d={ARROW_RIGHT} /></svg>
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
}
