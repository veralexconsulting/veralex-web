'use client';

import Image from 'next/image';
import { useLang } from '@/lib/useLang';

const ARROW_RIGHT = 'M13 7l5 5m0 0l-5 5m5-5H6';

export default function HeroSection() {
    const { t } = useLang();

    return (
        <section className="hero" id="hero">
            <div className="hero-particles">
                {/* Fewer particles on small screens for performance */}
                {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="particle" />
                ))}
            </div>
            <div className="hero-glow" />
            <div className="hero-decoration" />
            <div className="hero-decoration" />

            <div className="hero-content">
                <Image
                    src="/logo.jpg"
                    alt="VERALEX CONSULTING - Konsultan Hukum Profesional"
                    width={150}
                    height={150}
                    className="hero-logo"
                    priority
                />
                <h1 className="hero-title">
                    {t('hero.title')}
                </h1>
                <p className="hero-subtitle">
                    {t('hero.subtitle')}
                </p>

                {/* Promo tag */}
                <div style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    background: 'rgba(212, 175, 55, 0.15)',
                    border: '1px solid rgba(212, 175, 55, 0.4)',
                    borderRadius: 'var(--radius-xl)',
                    padding: '8px 24px',
                    marginBottom: '1.5rem',
                    color: 'var(--color-gold-light)',
                    fontSize: '0.95rem',
                    fontWeight: 600,
                }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
                    </svg>
                    {t('hero.promo')}
                </div>

                <div className="hero-cta" style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
                    <a
                        href="https://wa.me/6281219476385?text=Halo%20VERALEX,%20saya%20ingin%20konsultasi%20gratis%20tentang%20layanan%20legalitas"
                        className="btn btn-primary btn-lg"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        {t('hero.cta')}
                    </a>
                    <a href="#services" className="btn btn-outline btn-lg" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                        {t('hero.viewServices')}
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d={ARROW_RIGHT} /></svg>
                    </a>
                </div>
                <p style={{ marginTop: '1rem', color: 'var(--text-muted)', fontSize: '0.9rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                        {t('hero.response')}
                    </span>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                        {t('hero.privacy')}
                    </span>
                </p>
            </div>
        </section>
    );
}
