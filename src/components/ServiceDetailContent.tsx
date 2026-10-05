'use client';

import { useLang } from '@/lib/useLang';
import { ServiceItem } from '@/lib/serviceData';
import { detailedServiceContent, defaultFaqs, defaultFaqsEn, defaultFaqsZh } from '@/lib/serviceContent';
import Link from 'next/link';
import Footer from '@/components/Footer';
import LanguageToggle from '@/components/LanguageToggle';
import OrderModal from '@/components/OrderModal';
import FaqAccordion from '@/components/FaqAccordion';

const ARROW_LEFT = "M10 19l-7-7m0 0l7-7m-7 7h18";
const CHECK_ICON = "M5 13l4 4L19 7";

interface Props {
    service: ServiceItem;
    relatedServices: ServiceItem[];
}

export default function ServiceDetailContent({ service, relatedServices }: Props) {
    const { t, lang } = useLang();

    const isEn = lang === 'en';
    const isZh = lang === 'zh';
    const displayTitle = isZh ? (service.titleZh || service.titleEn) : (isEn ? service.titleEn : service.title);
    const displayDesc = isZh ? (service.descriptionZh || service.descriptionEn) : (isEn ? service.descriptionEn : service.description);
    const displayCategory = isZh ? (service.categoryZh || service.categoryEn) : (isEn ? service.categoryEn : service.category);
    const displayFeatures = isZh ? (service.featuresZh || service.featuresEn) : (isEn ? service.featuresEn : service.features);
    const displayBadge = isZh ? (service.discountBadgeZh || service.discountBadge) : (isEn ? service.discountBadgeEn || service.discountBadge : service.discountBadge);

    const detailContent = detailedServiceContent[service.slug];
    const introText = detailContent
        ? (isZh ? (detailContent.introZh || detailContent.introEn) : (isEn ? detailContent.introEn : detailContent.intro))
        : '';
    const sectionsText = detailContent ? detailContent.sections : [];
    const faqsList = detailContent
        ? (isZh ? (detailContent.faqsZh || detailContent.faqsEn) : (isEn ? detailContent.faqsEn : detailContent.faqs))
        : (isZh ? defaultFaqsZh : (isEn ? defaultFaqsEn : defaultFaqs));

    return (
        <>
            <nav className="navbar scrolled" style={{ position: 'fixed' }}>
                <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Link href="/" className="navbar-brand">
                        <span className="navbar-name">VERALEX</span>
                    </Link>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                        <LanguageToggle />
                        <Link href="/#services" className="svc-back-link">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d={ARROW_LEFT} /></svg>
                            {t('detail.back')}
                        </Link>
                    </div>
                </div>
            </nav>

            <main style={{ paddingTop: '110px', minHeight: '100vh' }}>
                <div className="container svc-page">

                    <header className="svc-hero">
                        <span className="svc-chip">{displayCategory}</span>
                        <h1 className="svc-title">{displayTitle}</h1>
                        <p className="svc-lead">{displayDesc}</p>
                    </header>

                    <section className="svc-card">
                        <p className="svc-card-label">{t('detail.priceStart')}</p>
                        {service.originalPrice && (
                            <div className="svc-price-row">
                                <span className="svc-price-old">{service.originalPrice}</span>
                                {displayBadge && <span className="svc-price-badge">{displayBadge}</span>}
                            </div>
                        )}
                        <p className="svc-price">{service.price}</p>

                        <h2 className="svc-h3">{t('detail.whatYouGet')}</h2>
                        <ul className="svc-list">
                            {displayFeatures.map((f, i) => (
                                <li key={i}>
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--color-gold)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d={CHECK_ICON} />
                                    </svg>
                                    {f}
                                </li>
                            ))}
                        </ul>

                        <div className="svc-cta">
                            <OrderModal serviceTitle={displayTitle} servicePrice={service.price} />
                        </div>
                        <p className="svc-cta-note">{t('detail.consultFree')}</p>
                    </section>

                    {introText && (
                        <>
                            <p className="svc-quote">{introText}</p>

                            <div className="svc-prose">
                                {sectionsText.map((section, idx) => (
                                    <section key={idx} className="svc-section">
                                        <h2 className="svc-h2">
                                            {isZh ? (section.titleZh || section.titleEn) : (isEn ? section.titleEn : section.title)}
                                        </h2>
                                        <p>
                                            {isZh ? (section.contentZh || section.contentEn) : (isEn ? section.contentEn : section.content)}
                                        </p>
                                    </section>
                                ))}
                            </div>
                        </>
                    )}

                    <section className="svc-section">
                        <h2 className="svc-h2 svc-h2--center">{t('detail.faq')}</h2>
                        <FaqAccordion faqs={faqsList} />
                    </section>

                    {relatedServices.length > 0 && (
                        <section className="svc-section">
                            <h2 className="svc-h3">{t('detail.other')}</h2>
                            <div className="svc-related-grid">
                                {relatedServices.map((s) => (
                                    <Link key={s.slug} href={`/services/${s.slug}`} className="service-card" style={{ padding: '1.25rem', textDecoration: 'none' }}>
                                        <h4 className="service-title" style={{ fontSize: '0.95rem' }}>{isZh ? (s.titleZh || s.titleEn) : (isEn ? s.titleEn : s.title)}</h4>
                                        <p className="service-price" style={{ fontSize: '0.9rem' }}><strong>{t('price.startFrom')} {s.price}</strong></p>
                                    </Link>
                                ))}
                            </div>
                        </section>
                    )}
                </div>
            </main>

            <div className="svc-sticky">
                <span className="svc-sticky-price">
                    <small>{t('price.startFrom')}</small>
                    <strong>{service.price}</strong>
                </span>
                <OrderModal serviceTitle={displayTitle} servicePrice={service.price} />
            </div>

            <Footer />
        </>
    );
}

