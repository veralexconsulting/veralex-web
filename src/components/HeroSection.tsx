'use client';

import Image from 'next/image';
import { useLang } from '@/lib/useLang';
import { whatsappHref } from '@/lib/marketing';
import { businessFacts } from '@/lib/businessFacts';

export default function HeroSection() {
    const { t } = useLang();

    return (
        <section className="hero" id="hero">
            <div className="hero-overlay" />

            <div className="hero-inner">
                {/* Left: Text Content */}
                <div className="hero-content">
                    <h1 className="hero-title">
                        {(() => {
                            const title = t('hero.title');
                            const delimiter = title.includes('，') ? '，' : (title.includes(',') ? ',' : null);
                            if (delimiter) {
                                const idx = title.indexOf(delimiter);
                                const firstPart = title.slice(0, idx);
                                const secondPart = title.slice(idx + 1).trim();
                                return (
                                    <>
                                        {firstPart}{delimiter}
                                        <br />
                                        <span className="hero-title-accent">{secondPart}</span>
                                    </>
                                );
                            }
                            return title;
                        })()}
                    </h1>
                    <p className="hero-subtitle">
                        {t('hero.subtitle')}
                    </p>

                    <div className="hero-cta">
                        <a
                            href={whatsappHref(t('wa.message.hero'))}
                            className="btn-editorial-solid"
                            target="_blank"
                            rel="noopener noreferrer"
                            data-cta-location="hero"
                        >
                            <span className="hero-cta-full">{t('hero.cta')}</span><span className="hero-cta-mobile">{t('hero.cta.mobile')}</span>
                        </a>
                        <a href="#services" className="btn-editorial">
                            {t('hero.viewServices')}
                        </a>
                    </div>

                    {/* Stats strip */}
                    <div className="hero-stats">
                        <div className="hero-stat">
                            <span className="hero-stat-number">{businessFacts.happyClients}</span>
                            <span className="hero-stat-label">{t('trust.clients')}</span>
                        </div>
                        <div className="hero-stat-divider" />
                        <div className="hero-stat">
                            <span className="hero-stat-number">{businessFacts.successRate}</span>
                            <span className="hero-stat-label">{t('trust.success')}</span>
                        </div>
                        <div className="hero-stat-divider" />
                        <div className="hero-stat">
                            <span className="hero-stat-number">{businessFacts.yearsExperience}</span>
                            <span className="hero-stat-label">{t('trust.experience')}</span>
                        </div>
                        <div className="hero-stat-divider" />
                        <div className="hero-stat">
                            <span className="hero-stat-number">{businessFacts.consultationAvailability}</span>
                            <span className="hero-stat-label">{t('trust.consultation')}</span>
                        </div>
                    </div>
                </div>

                {/* Right: the team, cut out so it sits directly on the maroon */}
                <div className="hero-team">
                    <Image
                        src="/team-veralex.webp"
                        alt={t('hero.teamAlt')}
                        width={1200}
                        height={1380}
                        priority
                        quality={90}
                        sizes="(max-width: 1024px) 90vw, 480px"
                        className="hero-team-img"
                    />
                </div>
            </div>
        </section>
    );
}
