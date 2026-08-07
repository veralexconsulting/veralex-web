import Link from 'next/link';
import { ServicePageData } from '@/lib/servicePageData';
import FaqAccordion from '@/components/FaqAccordion';
import OrderModal from '@/components/OrderModal';
import WhatsAppCta from '@/components/WhatsAppCta';
import Footer from '@/components/Footer';

const CHECK_ICON = "M5 13l4 4L19 7";
const ARROW_LEFT = "M10 19l-7-7m0 0l7-7m-7 7h18";

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
        trademarkGuide: "Trademark Registration Guide",
        waGreeting: "Hello VERALEX, I am interested in"
    },
    id: {
        back: "Kembali",
        startingFrom: "Mulai dari",
        whatYouGet: "Yang Anda Dapatkan:",
        freeConsult: "Konsultasi Gratis — Tim kami akan merespon dalam beberapa menit",
        requirements: "Persyaratan & Dokumen",
        process: "Proses & Linimasa",
        faq: "Pertanyaan yang Sering Diajukan (FAQ)",
        related: "Layanan Terkait",
        guides: "Panduan Terkait",
        allServices: "Semua Layanan VERALEX",
        ptPmaGuide: "Panduan Pendirian PT PMA",
        investorKitasGuide: "Panduan ITAS Investor",
        trademarkGuide: "Panduan Pendaftaran Merek",
        waGreeting: "Halo VERALEX, saya tertarik dengan layanan"
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
        trademarkGuide: "商标注册申请指南",
        waGreeting: "您好 VERALEX CONSULTING，我对以下服务很感兴趣："
    }
};

interface Props {
    service: ServicePageData;
    relatedServices: ServicePageData[];
    lang: string;
}

export default function ServicePageTemplate({ service, relatedServices, lang }: Props) {
    const activeLang = uiText[lang] ? lang : 'en';
    const dict = uiText[activeLang];

    const waLink = `https://wa.me/6281219476385?text=${encodeURIComponent(
        `${dict.waGreeting} ${service.title} (${service.price}).`
    )}`;

    return (
        <>
            {/* Navbar */}
            <nav className="navbar scrolled" style={{ position: 'fixed' }}>
                <div className="container">
                    <Link href={`/${lang}`} className="navbar-brand">
                        <span className="navbar-name">VERALEX</span>
                    </Link>
                    <Link href={`/${lang}`} style={{ color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d={ARROW_LEFT} /></svg>
                        {dict.back}
                    </Link>
                </div>
            </nav>

            <main style={{ paddingTop: '120px', minHeight: '100vh' }}>
                <div className="container" style={{ maxWidth: '800px' }}>

                    {/* Category Badge */}
                    <span style={{
                        display: 'inline-block',
                        background: 'rgba(74, 14, 14, 0.08)',
                        border: '1px solid rgba(74, 14, 14, 0.2)',
                        borderRadius: 'var(--radius-xl)',
                        padding: '6px 18px',
                        fontSize: '0.85rem',
                        color: 'var(--color-gold)',
                        fontWeight: 600,
                        marginBottom: '1rem',
                    }}>
                        {service.category}
                    </span>

                    {/* H1 — primary keyword */}
                    <h1 style={{
                        fontFamily: 'var(--font-heading)',
                        fontSize: 'clamp(2rem, 4vw, 3rem)',
                        background: 'var(--color-gold-gradient)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                        marginBottom: '1rem',
                    }}>
                        {service.title}
                    </h1>

                    {/* Intro */}
                    <p style={{ color: 'var(--text-secondary)', fontSize: '1.15rem', lineHeight: 1.7, marginBottom: '2rem' }}>
                        {service.intro}
                    </p>

                    {/* Price Card */}
                    <div style={{
                        background: 'var(--bg-card)',
                        border: 'var(--border-gold-strong)',
                        borderRadius: 'var(--radius-lg)',
                        padding: '2rem',
                        marginBottom: '2rem',
                    }}>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>{dict.startingFrom}</p>
                        <p style={{
                            fontSize: '2.5rem',
                            fontWeight: 700,
                            fontFamily: 'var(--font-heading)',
                            background: 'var(--color-gold-gradient)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text',
                            marginBottom: '0.5rem',
                        }}>
                            {service.price}
                        </p>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
                            {service.priceNote}
                        </p>

                        <h3 style={{ color: 'var(--text-gold)', marginBottom: '1rem', fontSize: '1.1rem' }}>{dict.whatYouGet}</h3>
                        <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
                            {service.features.map((f, i) => (
                                <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-secondary)' }}>
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--color-gold)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                                        <path d={CHECK_ICON} />
                                    </svg>
                                    {f}
                                </li>
                            ))}
                        </ul>

                        {/* CTA */}
                        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                            <OrderModal serviceTitle={service.title} servicePrice={service.price} startingFrom={dict.startingFrom} />
                        </div>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', textAlign: 'center', marginTop: '1rem' }}>
                            {dict.freeConsult}
                        </p>
                    </div>

                    {/* Requirements Section */}
                    {service.requirements.length > 0 && (
                        <div style={{ margin: '4rem 0 3rem 0', borderTop: 'var(--border-gold)', paddingTop: '3rem' }}>
                            <h2 style={{
                                fontFamily: 'var(--font-heading)',
                                fontSize: '1.75rem',
                                color: 'var(--color-gold)',
                                marginBottom: '1.5rem',
                                lineHeight: 1.4,
                            }}>
                                {dict.requirements}
                            </h2>
                            <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                                {service.requirements.map((req, i) => (
                                    <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', color: 'var(--text-secondary)', fontSize: '1.05rem', lineHeight: 1.6 }}>
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--color-gold)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: '4px' }}>
                                            <path d={CHECK_ICON} />
                                        </svg>
                                        {req.item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Process & Timeline Section */}
                    {service.processSteps.length > 0 && (
                        <div style={{ margin: '3rem 0', borderTop: 'var(--border-gold)', paddingTop: '3rem' }}>
                            <h2 style={{
                                fontFamily: 'var(--font-heading)',
                                fontSize: '1.75rem',
                                color: 'var(--color-gold)',
                                marginBottom: '1.5rem',
                                lineHeight: 1.4,
                            }}>
                                {dict.process}
                            </h2>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                {service.processSteps.map((step) => (
                                    <div key={step.step} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                                        <div style={{
                                            width: '36px', height: '36px', flexShrink: 0,
                                            background: 'rgba(74, 14, 14, 0.08)',
                                            border: '1px solid rgba(74, 14, 14, 0.2)',
                                            borderRadius: '50%',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            color: 'var(--color-gold)',
                                            fontWeight: 700,
                                            fontSize: '0.85rem',
                                        }}>
                                            {step.step}
                                        </div>
                                        <div>
                                            <h3 style={{ color: 'var(--text-primary)', fontSize: '1.1rem', fontWeight: 600, marginBottom: '0.35rem' }}>
                                                {step.title}
                                            </h3>
                                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.6 }}>
                                                {step.description}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* FAQ Section */}
                    {service.faqs.length > 0 && (
                        <div style={{ margin: '4rem 0', borderTop: 'var(--border-gold)', paddingTop: '3rem' }}>
                            <h2 style={{
                                fontFamily: 'var(--font-heading)',
                                fontSize: '2rem',
                                textAlign: 'center',
                                background: 'var(--color-gold-gradient)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                backgroundClip: 'text',
                                marginBottom: '2rem',
                            }}>
                                {dict.faq}
                            </h2>
                            <FaqAccordion faqs={service.faqs} />
                        </div>
                    )}

                    {/* Related Services */}
                    {relatedServices.length > 0 && (
                        <div style={{
                            borderTop: 'var(--border-gold)',
                            paddingTop: '2rem',
                            marginBottom: '3rem',
                        }}>
                            <h3 style={{ color: 'var(--text-gold)', marginBottom: '1rem' }}>{dict.related}</h3>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1rem' }}>
                                {relatedServices.map((s) => (
                                    <Link
                                        key={s.slug}
                                        href={`/${lang}/services/${s.slug}`}
                                        className="service-card"
                                        style={{ padding: '1.25rem', textDecoration: 'none' }}
                                    >
                                        <h4 className="service-title" style={{ fontSize: '0.95rem' }}>{s.title}</h4>
                                        <p className="service-price" style={{ fontSize: '0.9rem' }}><strong>{dict.startingFrom} {s.price}</strong></p>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Internal Links for SEO — additional related content */}
                    <div style={{ borderTop: 'var(--border-gold)', paddingTop: '2rem', marginBottom: '3rem' }}>
                        <h3 style={{ color: 'var(--text-gold)', marginBottom: '1rem' }}>{dict.guides}</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            <Link href={`/${lang}`} style={{ color: 'var(--text-secondary)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.95rem' }}>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-gold)" strokeWidth="2"><path d="M9 5l7 7-7 7" /></svg>
                                {dict.allServices}
                            </Link>
                            <Link href={`/${lang}/services/pt-pma`} style={{ color: 'var(--text-secondary)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.95rem' }}>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-gold)" strokeWidth="2"><path d="M9 5l7 7-7 7" /></svg>
                                {dict.ptPmaGuide}
                            </Link>
                            <Link href={`/${lang}/services/itas-investor-1-tahun`} style={{ color: 'var(--text-secondary)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.95rem' }}>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-gold)" strokeWidth="2"><path d="M9 5l7 7-7 7" /></svg>
                                {dict.investorKitasGuide}
                            </Link>
                            <Link href={`/${lang}/services/pendaftaran-merek`} style={{ color: 'var(--text-secondary)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.95rem' }}>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-gold)" strokeWidth="2"><path d="M9 5l7 7-7 7" /></svg>
                                {dict.trademarkGuide}
                            </Link>
                        </div>
                    </div>
                </div>
            </main>

            <WhatsAppCta />
            <Footer />
        </>
    );
}
