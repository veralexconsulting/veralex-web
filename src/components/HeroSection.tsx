'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useLang } from '@/lib/useLang';
import { whatsappHref } from '@/lib/marketing';
import { businessFacts } from '@/lib/businessFacts';

const ROTATE_MS = 5200;

/* A headline is split into its given claim and its promise on the second line. */
const splitHeadline = (title: string) => {
    const delimiter = title.includes('，') ? '，' : title.includes(',') ? ',' : null;
    if (!delimiter) return { first: title, second: '' };
    const idx = title.indexOf(delimiter);
    return { first: title.slice(0, idx), second: title.slice(idx + 1).trim() };
};

const prefersReducedMotion = () =>
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export default function HeroSection() {
    const { t } = useLang();
    const rotation = [1, 2, 3];

    const [active, setActive] = useState(0);
    // Read synchronously so the first paint already knows whether to rotate;
    // a setState-in-effect would flash the headline in for no reason.
    const [rotating] = useState(() => !prefersReducedMotion());

    useEffect(() => {
        if (!rotating) return;
        const timer = window.setInterval(() => {
            setActive((current) => (current + 1) % rotation.length);
        }, ROTATE_MS);
        return () => window.clearInterval(timer);
    }, [rotating, rotation.length]);

    const title = t(`hero.title.${active + 1}`);

    return (
        <section className="hero" id="hero">
            <div className="hero-overlay" />

            <div className="hero-inner">
                {/* Left: Text Content */}
                <div className="hero-content">
                    {/*
                     * One h1, three lines of copy. Nothing is hidden from search
                     * engines or screen readers — only the visible line changes.
                     */}
                    <h1 className="hero-title" aria-label={title}>
                        <span className={`hero-title-slide${rotating ? ' is-rotating' : ''}`} key={active} aria-hidden="true">
                            {(() => {
                                const { first, second } = splitHeadline(title);
                                return (
                                    <>
                                        {first}
                                        {second && (
                                            <>
                                                <br />
                                                <span className="hero-title-accent">{second}</span>
                                            </>
                                        )}
                                    </>
                                );
                            })()}
                        </span>
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
