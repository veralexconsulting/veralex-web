'use client';

import { useLang } from '@/lib/useLang';
import { ServiceItem } from '@/lib/serviceData';
import Link from 'next/link';

const WA_ICON = "M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z";
const MAIL_ICON = "M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z";
const ARROW_LEFT = "M10 19l-7-7m0 0l7-7m-7 7h18";
const CHECK_ICON = "M5 13l4 4L19 7";

interface Props {
    service: ServiceItem;
    relatedServices: ServiceItem[];
}

export default function ServiceDetailContent({ service, relatedServices }: Props) {
    const { t, lang } = useLang();

    const isEn = lang === 'en';

    const displayTitle = isEn ? service.titleEn : service.title;
    const displayDesc = isEn ? service.descriptionEn : service.description;
    const displayFeatures = isEn ? service.featuresEn : service.features;

    const waText = encodeURIComponent(`Halo VERALEX, saya tertarik dengan layanan ${displayTitle} (${service.price}). Bisa info lebih lanjut?`);

    return (
        <>
            <nav className="navbar scrolled" style={{ position: 'fixed' }}>
                <div className="container">
                    <Link href="/" className="navbar-brand">
                        <span className="navbar-name">VERALEX</span>
                    </Link>
                    <Link href="/#services" style={{ color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d={ARROW_LEFT} /></svg>
                        {t('detail.back')}
                    </Link>
                </div>
            </nav>

            <main style={{ paddingTop: '120px', minHeight: '100vh' }}>
                <div className="container" style={{ maxWidth: '800px' }}>
                    <span style={{
                        display: 'inline-block',
                        background: 'rgba(212, 175, 55, 0.15)',
                        border: '1px solid rgba(212, 175, 55, 0.3)',
                        borderRadius: 'var(--radius-xl)',
                        padding: '6px 18px',
                        fontSize: '0.85rem',
                        color: 'var(--color-gold)',
                        fontWeight: 600,
                        marginBottom: '1rem',
                    }}>
                        {service.category}
                    </span>

                    <h1 style={{
                        fontFamily: 'var(--font-heading)',
                        fontSize: 'clamp(2rem, 4vw, 3rem)',
                        background: 'var(--color-gold-gradient)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                        marginBottom: '1rem',
                    }}>
                        {displayTitle}
                    </h1>

                    <p style={{ color: 'var(--text-secondary)', fontSize: '1.15rem', lineHeight: 1.7, marginBottom: '2rem' }}>
                        {displayDesc}
                    </p>

                    <div style={{
                        background: 'var(--bg-card)',
                        border: 'var(--border-gold-strong)',
                        borderRadius: 'var(--radius-lg)',
                        padding: '2rem',
                        marginBottom: '2rem',
                    }}>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>{t('detail.priceStart')}</p>
                        <p style={{
                            fontSize: '2.5rem',
                            fontWeight: 700,
                            fontFamily: 'var(--font-heading)',
                            background: 'var(--color-gold-gradient)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text',
                            marginBottom: '1.5rem',
                        }}>
                            {service.price}
                        </p>

                        <h3 style={{ color: 'var(--text-gold)', marginBottom: '1rem', fontSize: '1.1rem' }}>{t('detail.whatYouGet')}</h3>
                        <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            {displayFeatures.map((f, i) => (
                                <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-secondary)' }}>
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--color-gold)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                                        <path d={CHECK_ICON} />
                                    </svg>
                                    {f}
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
                        <a
                            href={`https://wa.me/6281219476385?text=${waText}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-primary btn-lg"
                            style={{ flex: 1, minWidth: '200px' }}
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d={WA_ICON} /></svg>
                            {t('wa.cta')}
                        </a>
                        <a
                            href="mailto:veralexconsulting@gmail.com"
                            className="btn btn-outline btn-lg"
                            style={{ flex: 1, minWidth: '200px' }}
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d={MAIL_ICON} /></svg>
                            {t('detail.email')}
                        </a>
                    </div>

                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', textAlign: 'center', marginBottom: '3rem' }}>
                        {t('detail.consultFree')}
                    </p>

                    <div style={{
                        borderTop: 'var(--border-gold)',
                        paddingTop: '2rem',
                        marginBottom: '3rem',
                    }}>
                        <h3 style={{ color: 'var(--text-gold)', marginBottom: '1rem' }}>{t('detail.other')}</h3>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1rem' }}>
                            {relatedServices.map((s) => (
                                <Link
                                    key={s.slug}
                                    href={`/services/${s.slug}`}
                                    className="service-card"
                                    style={{ padding: '1.25rem', textDecoration: 'none' }}
                                >
                                    <h4 className="service-title" style={{ fontSize: '0.95rem' }}>{isEn ? s.titleEn : s.title}</h4>
                                    <p className="service-price" style={{ fontSize: '0.9rem' }}><strong>{s.price}</strong></p>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </main>
        </>
    );
}
