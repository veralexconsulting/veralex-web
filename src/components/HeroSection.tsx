'use client';

import Image from 'next/image';
import { useLang } from '@/lib/useLang';

const ARROW_RIGHT = 'M13 7l5 5m0 0l-5 5m5-5H6';

export default function HeroSection() {
    const { t } = useLang();

    return (
        <section className="hero" id="hero">
            {/* Premium Batik/Bali Background */}
            <div className="hero-bg-image">
                <Image
                    src="/bg-indo-premium.png"
                    alt="Premium Indonesian Legal Background"
                    fill
                    priority
                    quality={100}
                    style={{ objectFit: 'cover', objectPosition: 'center' }}
                />
            </div>
            {/* Dark gradient overlay for text readability */}
            <div className="hero-overlay" />

            <div className="hero-particles">
                {/* Fewer particles on small screens for performance */}
                {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="particle" />
                ))}
            </div>

            <div className="hero-content">
                {/* Refined Integrated Logo */}
                <div className="hero-logo-wrapper fade-in">
                    <Image
                        src="/logo.jpg"
                        alt="VERALEX CONSULTING Logo"
                        fill
                        className="hero-logo-integrated"
                        priority
                    />
                </div>

                {/* Minimalist Glass Badge */}
                <div className="hero-badge">
                    <span className="badge-dot"></span>
                    Konsultan Hukum & Legalitas Bisnis Terpercaya
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
            </div>
        </section>
    );
}
