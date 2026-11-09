/*
 * Service detail page body.
 *
 * This is a SERVER component on purpose. It used to be 'use client', which
 * meant the price, the feature list, every long-form section and the whole FAQ
 * were shipped as JavaScript and only reached the page after hydration. Google
 * can execute JavaScript, but rendering is deferred, not guaranteed, and the
 * first crawl of a new URL often sees an empty shell. For a service page whose
 * entire job is to rank, that is the difference between indexable and not.
 *
 * Language arrives as a prop from the route segment rather than from useLang(),
 * so nothing here depends on the client. The two genuinely interactive pieces
 * (the order modal) live in ServiceOrderCta, and the FAQ accordion is a client
 * component whose answers are already in the DOM.
 */
import Link from 'next/link';
import type { ServiceItem } from '@/lib/serviceData';
import { detailedServiceContent, defaultFaqs, defaultFaqsEn, defaultFaqsZh, type FAQItem } from '@/lib/serviceContent';
import { translations, type Lang } from '@/lib/translations';
import ServiceBreadcrumb from '@/components/ServiceBreadcrumb';
import { serviceBreadcrumbs } from '@/lib/serviceBreadcrumbs';
import FaqAccordion from '@/components/FaqAccordion';
import TrustBadges from '@/components/TrustBadges';
import WhatsAppCta from '@/components/WhatsAppCta';
import { trademarkLandingCopy } from '@/lib/trademarkLanding';
import { ServiceOrderCta } from '@/features/service-detail/ServiceOrderCta';

const CHECK_ICON = 'M5 13l4 4L19 7';

interface Props {
    service: ServiceItem;
    relatedServices: ServiceItem[];
    lang: Lang;
}

/** Server-side translation lookup. Mirrors useLang().t without the hooks. */
function translator(lang: Lang) {
    return (key: string): string => {
        const entry = translations[lang]?.[key] ?? translations.id?.[key];
        return entry ?? key;
    };
}

export default function ServiceDetailContent({ service, relatedServices, lang }: Props) {
    const t = translator(lang);

    const isEn = lang === 'en';
    const isZh = lang === 'zh';
    const displayTitle = isZh ? service.titleZh || service.titleEn : isEn ? service.titleEn : service.title;
    const displayDesc = isZh ? service.descriptionZh || service.descriptionEn : isEn ? service.descriptionEn : service.description;
    const displayCategory = isZh ? service.categoryZh || service.categoryEn : isEn ? service.categoryEn : service.category;
    const displayFeatures = isZh ? service.featuresZh || service.featuresEn : isEn ? service.featuresEn : service.features;
    const priceNote = service.priceNote?.[lang] || service.priceNote?.en;
    const promotionNote = service.promotionNote?.[lang] || service.promotionNote?.en;
    const priceUnit = service.priceUnit?.[lang] || service.priceUnit?.en;
    const priceLabel = service.priceLabel === 'from' ? `${t('price.serviceFee')} — ${t('price.startFrom')}` : t('price.serviceFee');
    const displayBadge = isZh ? service.discountBadgeZh || service.discountBadge : isEn ? service.discountBadgeEn || service.discountBadge : service.discountBadge;
    const isTrademark = service.slug === 'pendaftaran-merek';
    const trademarkCopy = trademarkLandingCopy[lang];

    const detailContent = detailedServiceContent[service.slug];
    const introText = detailContent
        ? isZh
            ? detailContent.introZh || detailContent.introEn
            : isEn
              ? detailContent.introEn
              : detailContent.intro
        : '';
    const sectionsText = detailContent ? detailContent.sections : [];
    const faqsList: FAQItem[] = detailContent
        ? isZh
            ? detailContent.faqsZh || detailContent.faqsEn
            : isEn
              ? detailContent.faqsEn
              : detailContent.faqs
        : isZh
          ? defaultFaqsZh
          : isEn
            ? defaultFaqsEn
            : defaultFaqs;

    return (
        <>
            <main lang={lang} style={{ paddingTop: '110px', minHeight: '100vh' }}>
                <div className="container svc-page">
                    <ServiceBreadcrumb items={serviceBreadcrumbs(service.slug, lang, displayTitle)} />

                    <header className="svc-hero">
                        <span className="svc-chip">{displayCategory}</span>
                        <h1 className="svc-title">{displayTitle}</h1>
                        <p className="svc-lead">{displayDesc}</p>
                        {isTrademark && <p className="svc-trademark-value">{trademarkCopy.value}</p>}
                        {!isTrademark && introText && <p className="svc-service-value">{introText}</p>}
                    </header>

                    <section className="svc-card">
                        <p className="svc-card-label">{service.priceNote ? priceLabel : t('detail.priceStart')}</p>
                        {service.originalPrice && (
                            <div className="svc-price-row">
                                <span className="svc-price-old">{service.originalPrice}</span>
                                {displayBadge && <span className="svc-price-badge">{displayBadge}</span>}
                            </div>
                        )}
                        <p className={`svc-price${priceUnit ? ' svc-price--unit' : ''}`}>
                            {service.price}
                            {priceUnit ? ` / ${priceUnit}` : ''}
                        </p>
                        {isTrademark && <p className="svc-price-note">{trademarkCopy.priceNote}</p>}
                        {priceNote && <p className="svc-price-note">{priceNote}</p>}
                        {promotionNote && <p className="svc-price-note">{promotionNote}</p>}

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
                            <ServiceOrderCta
                                serviceTitle={displayTitle}
                                servicePrice={`${service.price}${priceUnit ? ` / ${priceUnit}` : ''}`}
                                label={isTrademark ? trademarkCopy.cta : undefined}
                                priceNote={[priceNote, promotionNote].filter(Boolean).join(' ')}
                            />
                        </div>
                        <p className="svc-cta-note">{t('detail.consultFree')}</p>
                    </section>

                    {introText && (
                        <>
                            {isTrademark && <p className="svc-quote">{introText}</p>}

                            <div className="svc-prose">
                                {sectionsText.map((section, idx) => (
                                    <section key={idx} className="svc-section">
                                        <h2 className="svc-h2">
                                            {isZh ? section.titleZh || section.titleEn : isEn ? section.titleEn : section.title}
                                        </h2>
                                        <p>{isZh ? section.contentZh || section.contentEn : isEn ? section.contentEn : section.content}</p>
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
                                        <h4 className="service-title" style={{ fontSize: '0.95rem' }}>
                                            {isZh ? s.titleZh || s.titleEn : isEn ? s.titleEn : s.title}
                                        </h4>
                                        <p className="service-price" style={{ fontSize: '0.9rem' }}>
                                            <strong>
                                                {s.priceLabel === 'from' ? `${t('price.startFrom')} ` : s.priceNote ? `${t('price.serviceFee')}: ` : ''}
                                                {s.price}
                                                {s.priceUnit ? ` / ${s.priceUnit[lang]}` : ''}
                                            </strong>
                                        </p>
                                        {s.priceNote && (
                                            <p className="product-desc" style={{ marginTop: '0.4rem' }}>
                                                {s.priceNote[lang] || s.priceNote.en}
                                            </p>
                                        )}
                                    </Link>
                                ))}
                            </div>
                        </section>
                    )}
                </div>
            </main>

            <TrustBadges />

            <WhatsAppCta />
        </>
    );
}
