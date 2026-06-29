'use client';

import Image from 'next/image';
import { useLang } from '@/lib/useLang';

export default function HeroSection() {
    const { t } = useLang();

    return (
        <section className="hero" id="hero">
            <div className="hero-bg-image">
                <Image
                    src="/bg-indo-premium.png"
                    alt="VERALEX Consulting background"
                    fill
                    priority
                    quality={90}
                    style={{ objectFit: 'cover', objectPosition: 'center' }}
                />
            </div>
            <div className="hero-overlay" />

            <div className="hero-inner">
                {/* Left: Text Content */}
                <div className="hero-content">
                    <div className="hero-badge">
                        {t('hero.badge')}
                    </div>

                    <h1 className="hero-title">
                        {t('hero.title')}
                    </h1>
                    <p className="hero-subtitle">
                        {t('hero.subtitle')}
                    </p>

                    <div className="hero-cta">
                        <a
                            href="https://wa.me/6281219476385?text=Halo%20VERALEX,%20saya%20ingin%20konsultasi%20gratis%20tentang%20layanan%20legalitas"
                            className="btn-editorial-solid"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            {t('hero.cta')}
                        </a>
                        <a href="#services" className="btn-editorial">
                            {t('hero.viewServices')}
                        </a>
                    </div>

                    {/* Stats strip */}
                    <div className="hero-stats">
                        <div className="hero-stat">
                            <span className="hero-stat-number">150+</span>
                            <span className="hero-stat-label">{t('trust.clients')}</span>
                        </div>
                        <div className="hero-stat-divider" />
                        <div className="hero-stat">
                            <span className="hero-stat-number">99%</span>
                            <span className="hero-stat-label">{t('trust.success')}</span>
                        </div>
                        <div className="hero-stat-divider" />
                        <div className="hero-stat">
                            <span className="hero-stat-number">5+</span>
                            <span className="hero-stat-label">{t('trust.experience')}</span>
                        </div>
                        <div className="hero-stat-divider" />
                        <div className="hero-stat">
                            <span className="hero-stat-number">24/7</span>
                            <span className="hero-stat-label">{t('trust.consultation')}</span>
                        </div>
                    </div>
                </div>

                {/* Right: Visual */}
                <div className="hero-visual">
                    <div className="hero-visual-frame">
                        <Image
                            src="/hero-legal-visual.png"
                            alt="Layanan Legalitas Bisnis"
                            fill
                            priority
                            quality={90}
                            style={{ objectFit: 'cover', objectPosition: 'center' }}
                        />
                        <div className="hero-visual-glow" />
                    </div>
                    {/* Floating badge */}
                    <div className="hero-visual-badge">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"/></svg>
                        <span>{t('hero.visual_badge')}</span>
                    </div>
                </div>
            </div>
        </section>
    );
}
