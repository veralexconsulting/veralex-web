import Link from 'next/link';
import { hasServicePage, type RelatedService, type ServicePageData } from '@/lib/servicePageData';
import FaqAccordion from '@/components/FaqAccordion';
import OrderModal from '@/components/OrderModal';
import WhatsAppCta from '@/components/WhatsAppCta';
import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import ServiceBreadcrumb from '@/components/ServiceBreadcrumb';
import { serviceBreadcrumbs } from '@/lib/serviceBreadcrumbs';
import type { Lang } from '@/lib/translations';
import { trademarkLandingCopy } from '@/lib/trademarkLanding';

const CHECK_ICON = "M5 13l4 4L19 7";

const uiText: Record<string, Record<string, string>> = {
    en: {
        back: "Back",
        startingFrom: "Starting from",
        whatYouGet: "What You Get:",
        freeConsult: "Free Consultation — Our team will respond in minutes",
        requirements: "Requirements & Documents",
        process: "Process & Timeline",
        faq: "Frequently Asked Questions (FAQ)",
        related: "Related Services",
        guides: "Related Guides",
        allServices: "All VERALEX Services",
        ptPmaGuide: "PT PMA Registration Guide",
        investorKitasGuide: "Investor KITAS Guide",
        trademarkGuide: "Trademark Registration Guide"
    },
    id: {
        back: "Kembali",
        startingFrom: "Mulai dari",
        whatYouGet: "Yang Anda Dapatkan:",
        freeConsult: "Konsultasi Gratis — Tim kami akan merespon dalam beberapa menit",
        requirements: "Persyaratan & Dokumen",
        process: "Proses & Timeline",
        faq: "Pertanyaan yang Sering Diajukan (FAQ)",
        related: "Layanan Terkait",
        guides: "Panduan Terkait",
        allServices: "Semua Layanan VERALEX",
        ptPmaGuide: "Panduan Pendirian PT PMA",
        investorKitasGuide: "Panduan ITAS Investor",
        trademarkGuide: "Panduan Pendaftaran Merek"
    },
    zh: {
        back: "返回",
        startingFrom: "起价",
        whatYouGet: "您将获得：",
        freeConsult: "免费咨询 — 我们的团队将在数分钟内回复",
        requirements: "申请条件与所需材料",
        process: "办理流程与周期",
        faq: "常见问题解答 (FAQ)",
        related: "相关服务",
        guides: "相关指南",
        allServices: "所有 VERALEX 服务",
        ptPmaGuide: "PT PMA 外资设立指南",
        investorKitasGuide: "投资者 KITAS 签证指南",
        trademarkGuide: "商标注册申请指南"
    }
};

interface Props {
    service: ServicePageData;
    relatedServices: RelatedService[];
    lang: string;
}

export default function ServicePageTemplate({ service, relatedServices, lang }: Props) {
    const activeLang = uiText[lang] ? lang : 'en';
    const dict = uiText[activeLang];
    const isTrademark = service.slug === 'pendaftaran-merek';
    const trademarkCopy = trademarkLandingCopy[activeLang as Lang];

    return (
        <>
            <Navbar />

            <main style={{ paddingTop: '110px', minHeight: '100vh' }}>
                <div className="container svc-page">
                    <ServiceBreadcrumb items={serviceBreadcrumbs(service.slug, activeLang as Lang, service.title)} />

                    <header className="svc-hero">
                        <span className="svc-chip">{service.category}</span>
                        <h1 className="svc-title">{service.title}</h1>
                        <p className="svc-lead">{service.intro}</p>
                        {isTrademark && <p className="svc-trademark-value">{trademarkCopy.value}</p>}
                    </header>

                    <section className="svc-card">
                        <p className="svc-card-label">{dict.startingFrom}</p>
                        {service.originalPrice && (
                            <div className="svc-price-row">
                                <span className="svc-price-old">{service.originalPrice}</span>
                                {service.discountBadge && <span className="svc-price-badge">{service.discountBadge}</span>}
                            </div>
                        )}
                        <p className="svc-price">{service.price}</p>
                        {service.priceNote && <p className="svc-price-note">{service.priceNote}</p>}

                        <h2 className="svc-h3">{dict.whatYouGet}</h2>
                        <ul className="svc-list">
                            {service.features.map((f, i) => (
                                <li key={i}>
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--color-gold)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d={CHECK_ICON} />
                                    </svg>
                                    {f}
                                </li>
                            ))}
                        </ul>

                        <div className="svc-cta">
                            <OrderModal serviceTitle={service.title} servicePrice={service.price} label={isTrademark ? trademarkCopy.cta : undefined} />
                        </div>
                        <p className="svc-cta-note">{dict.freeConsult}</p>
                    </section>

                    {service.requirements.length > 0 && (
                        <section className="svc-section">
                            <h2 className="svc-h2">{dict.requirements}</h2>
                            <ul className="svc-list">
                                {service.requirements.map((req, i) => (
                                    <li key={i}>
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--color-gold)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d={CHECK_ICON} />
                                        </svg>
                                        {req.item}
                                    </li>
                                ))}
                            </ul>
                        </section>
                    )}

                    {service.processSteps.length > 0 && (
                        <section className="svc-section">
                            <h2 className="svc-h2">{dict.process}</h2>
                            <div className="svc-steps">
                                {service.processSteps.map((step) => (
                                    <div key={step.step} className="svc-step">
                                        <span className="svc-step-num">{step.step}</span>
                                        <div>
                                            <h3>{step.title}</h3>
                                            <p>{step.description}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {service.faqs.length > 0 && (
                        <section className="svc-section">
                            <h2 className="svc-h2 svc-h2--center">{dict.faq}</h2>
                            <FaqAccordion faqs={service.faqs} />
                        </section>
                    )}

                    {relatedServices.length > 0 && (
                        <section className="svc-section">
                            <h2 className="svc-h3">{dict.related}</h2>
                            <div className="svc-related-grid">
                                {relatedServices.map((s) => (
                                    <Link key={s.slug} href={hasServicePage(activeLang as Lang, s.slug) ? `/${lang}/services/${s.slug}` : `/services/${s.slug}`} className="service-card" style={{ padding: '1.25rem', textDecoration: 'none' }}>
                                        <h4 className="service-title" style={{ fontSize: '0.95rem' }}>{s.title}</h4>
                                        <p className="service-price" style={{ fontSize: '0.9rem' }}><strong>{dict.startingFrom} {s.price}</strong></p>
                                    </Link>
                                ))}
                            </div>
                        </section>
                    )}

                    <section className="svc-section">
                        <h2 className="svc-h3">{dict.guides}</h2>
                        <div className="svc-links">
                            <Link href="/#services">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-gold)" strokeWidth="2"><path d="M9 5l7 7-7 7" /></svg>
                                {dict.allServices}
                            </Link>
                            <Link href={`/${lang}/services/pt-pma`}>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-gold)" strokeWidth="2"><path d="M9 5l7 7-7 7" /></svg>
                                {dict.ptPmaGuide}
                            </Link>
                            <Link href={`/${lang}/services/itas-investor-1-tahun`}>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-gold)" strokeWidth="2"><path d="M9 5l7 7-7 7" /></svg>
                                {dict.investorKitasGuide}
                            </Link>
                            <Link href={`/${lang}/services/pendaftaran-merek`}>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-gold)" strokeWidth="2"><path d="M9 5l7 7-7 7" /></svg>
                                {dict.trademarkGuide}
                            </Link>
                        </div>
                    </section>
                </div>
            </main>

            <WhatsAppCta />
            <Footer />
        </>
    );
}
