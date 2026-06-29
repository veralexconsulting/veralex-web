'use client';

import { useLang } from '@/lib/useLang';
import { ServiceItem } from '@/lib/serviceData';
import { detailedServiceContent, defaultFaqs, defaultFaqsEn } from '@/lib/serviceContent';
import Link from 'next/link';
import { useState, useRef, useEffect, useCallback } from 'react';

const WA_ICON = "M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z";
const ARROW_LEFT = "M10 19l-7-7m0 0l7-7m-7 7h18";
const CHECK_ICON = "M5 13l4 4L19 7";
const CART_ICON = "M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z M3 6h18 M16 10a4 4 0 01-8 0";
const CLOSE_ICON = "M6 18L18 6M6 6l12 12";

interface Props {
    service: ServiceItem;
    relatedServices: ServiceItem[];
}

export default function ServiceDetailContent({ service, relatedServices }: Props) {
    const { t, lang } = useLang();
    const [showModal, setShowModal] = useState(false);
    const [name, setName] = useState('');
    const [ptName, setPtName] = useState('');
    const [nameError, setNameError] = useState(false);
    const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
    const nameInputRef = useRef<HTMLInputElement>(null);

    const isEn = lang === 'en';
    const displayTitle = isEn ? service.titleEn : service.title;
    const displayDesc = isEn ? service.descriptionEn : service.description;
    const displayFeatures = isEn ? service.featuresEn : service.features;

    const detailContent = detailedServiceContent[service.slug];
    const introText = detailContent ? (isEn ? detailContent.introEn : detailContent.intro) : '';
    const sectionsText = detailContent ? detailContent.sections : [];
    const faqsList = detailContent ? (isEn ? detailContent.faqsEn : detailContent.faqs) : (isEn ? defaultFaqsEn : defaultFaqs);

    // General WA link for the "Chat via WhatsApp" button
    const waTextGeneral = encodeURIComponent(
        `Halo VERALEX, saya tertarik dengan layanan ${displayTitle} (${service.price}). Bisa info lebih lanjut?`
    );

    // Focus name input when modal opens
    useEffect(() => {
        if (showModal) {
            setTimeout(() => nameInputRef.current?.focus(), 100);
        }
    }, [showModal]);

    // Close modal on Escape key
    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if (e.key === 'Escape') handleCloseModal();
        };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, []);

    const handleCloseModal = () => {
        setShowModal(false);
        setName('');
        setPtName('');
        setNameError(false);
    };

    const handleOrderSubmit = () => {
        if (!name.trim()) {
            setNameError(true);
            nameInputRef.current?.focus();
            return;
        }

        let message = `Halo VERALEX! 👋\n\nSaya ingin memesan layanan berikut:\n\n`;
        message += `📋 *Layanan:* ${displayTitle}\n`;
        message += `💰 *Harga:* ${service.price}\n`;
        message += `👤 *Nama:* ${name.trim()}\n`;
        if (ptName.trim()) {
            message += `🏢 *Nama PT/Perusahaan:* ${ptName.trim()}\n`;
        }
        message += `\nMohon informasi lebih lanjut mengenai proses dan dokumen yang diperlukan. Terima kasih!`;

        const waUrl = `https://wa.me/6281219476385?text=${encodeURIComponent(message)}`;
        window.open(waUrl, '_blank', 'noopener,noreferrer');
        handleCloseModal();
    };

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

                    {/* CTA Buttons */}
                    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
                        <button
                            onClick={() => setShowModal(true)}
                            className="btn btn-primary btn-lg"
                            style={{ flex: 1, minWidth: '200px', cursor: 'pointer', border: 'none' }}
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d={CART_ICON} />
                            </svg>
                            Order Sekarang
                        </button>
                    </div>

                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', textAlign: 'center', marginBottom: '3rem' }}>
                        {t('detail.consultFree')}
                    </p>

                    {/* DYNAMIC COMPREHENSIVE TEXT FOR SEO */}
                    {introText && (
                        <div style={{ margin: '4rem 0 3rem 0', borderTop: 'var(--border-gold)', paddingTop: '3rem' }}>
                            <p style={{ fontSize: '1.25rem', lineHeight: 1.8, color: 'var(--text-primary)', fontStyle: 'italic', marginBottom: '3rem', opacity: 0.95 }}>
                                "{introText}"
                            </p>

                            {sectionsText.map((section, idx) => (
                                <div key={idx} style={{ marginBottom: '3rem' }}>
                                    <h2 style={{
                                        fontFamily: 'var(--font-heading)',
                                        fontSize: '1.75rem',
                                        color: 'var(--color-gold)',
                                        marginBottom: '1rem',
                                        lineHeight: 1.4
                                    }}>
                                        {isEn ? section.titleEn : section.title}
                                    </h2>
                                    <p style={{
                                        fontSize: '1.05rem',
                                        lineHeight: 1.75,
                                        color: 'var(--text-secondary)',
                                        whiteSpace: 'pre-line'
                                    }}>
                                        {isEn ? section.contentEn : section.content}
                                    </p>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* DYNAMIC FAQ ACCORDION SECTION */}
                    <div style={{ margin: '4rem 0', borderTop: 'var(--border-gold)', paddingTop: '3rem' }}>
                        <h2 style={{
                            fontFamily: 'var(--font-heading)',
                            fontSize: '2rem',
                            textAlign: 'center',
                            background: 'var(--color-gold-gradient)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text',
                            marginBottom: '2rem'
                        }}>
                            Frequently Asked Questions (FAQ)
                        </h2>
                        
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {faqsList.map((faq, idx) => {
                                const isOpen = openFaqIndex === idx;
                                return (
                                    <div 
                                        key={idx} 
                                        style={{
                                            background: 'var(--bg-glass)',
                                            border: 'var(--border-gold)',
                                            borderRadius: 'var(--radius-md)',
                                            overflow: 'hidden',
                                            transition: 'all 0.3s ease'
                                        }}
                                    >
                                        <button
                                            onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                                            style={{
                                                width: '100%',
                                                padding: '1.25rem 1.5rem',
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'center',
                                                textAlign: 'left',
                                                color: isOpen ? 'var(--color-gold)' : 'var(--text-primary)',
                                                fontWeight: 600,
                                                fontSize: '1.05rem',
                                                background: 'none',
                                                border: 'none',
                                                cursor: 'pointer',
                                                transition: 'color 0.2s ease'
                                            }}
                                        >
                                            <span>{faq.question}</span>
                                            <span style={{ 
                                                fontSize: '1.5rem', 
                                                lineHeight: 1, 
                                                transform: isOpen ? 'rotate(45deg)' : 'rotate(0deg)',
                                                transition: 'transform 0.2s ease',
                                                color: 'var(--color-gold)'
                                            }}>
                                                +
                                            </span>
                                        </button>
                                        
                                        <div style={{
                                            maxHeight: isOpen ? '500px' : '0px',
                                            opacity: isOpen ? 1 : 0,
                                            overflow: 'hidden',
                                            transition: 'all 0.3s cubic-bezier(0, 1, 0, 1)',
                                            padding: isOpen ? '0 1.5rem 1.5rem 1.5rem' : '0 1.5rem'
                                        }}>
                                            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6, fontSize: '0.95rem' }}>
                                                {faq.answer}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

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

            {/* ===== ORDER MODAL ===== */}
            {showModal && (
                <div
                    onClick={(e) => { if (e.target === e.currentTarget) handleCloseModal(); }}
                    style={{
                        position: 'fixed', inset: 0, zIndex: 9999,
                        background: 'rgba(0,0,0,0.7)',
                        backdropFilter: 'blur(6px)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        padding: '1rem',
                        animation: 'fadeIn 0.2s ease',
                    }}
                >
                    <div style={{
                        background: 'var(--bg-card)',
                        border: 'var(--border-gold-strong)',
                        borderRadius: 'var(--radius-xl)',
                        padding: '2.5rem',
                        width: '100%',
                        maxWidth: '480px',
                        boxShadow: '0 25px 60px rgba(0,0,0,0.5)',
                        animation: 'slideUp 0.25s ease',
                        position: 'relative',
                    }}>
                        {/* Close Button */}
                        <button
                            onClick={handleCloseModal}
                            style={{
                                position: 'absolute', top: '1.25rem', right: '1.25rem',
                                background: 'transparent', border: 'none', cursor: 'pointer',
                                color: 'var(--text-muted)', padding: '4px',
                                borderRadius: '50%', transition: 'color 0.2s',
                            }}
                            aria-label="Tutup modal"
                        >
                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d={CLOSE_ICON} />
                            </svg>
                        </button>

                        {/* Modal Header */}
                        <div style={{ marginBottom: '1.75rem' }}>
                            <div style={{
                                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                                width: '52px', height: '52px',
                                background: 'rgba(212,175,55,0.12)',
                                borderRadius: '50%', marginBottom: '1rem',
                            }}>
                                <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor" style={{ color: 'var(--color-gold)' }}>
                                    <path d={WA_ICON} />
                                </svg>
                            </div>
                            <h3 style={{
                                fontFamily: 'var(--font-heading)',
                                fontSize: '1.4rem',
                                background: 'var(--color-gold-gradient)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                backgroundClip: 'text',
                                marginBottom: '0.4rem',
                            }}>
                                Order via WhatsApp
                            </h3>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.5 }}>
                                Lengkapi data di bawah. Tim kami akan langsung menghubungi Anda.
                            </p>
                        </div>

                        {/* Service Summary */}
                        <div style={{
                            background: 'rgba(212,175,55,0.06)',
                            border: '1px solid rgba(212,175,55,0.2)',
                            borderRadius: 'var(--radius-md)',
                            padding: '0.85rem 1rem',
                            marginBottom: '1.5rem',
                            display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.5rem',
                        }}>
                            <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{displayTitle}</span>
                            <span style={{ color: 'var(--color-gold)', fontWeight: 700, fontSize: '0.95rem', flexShrink: 0 }}>{service.price}</span>
                        </div>

                        {/* Form */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                            {/* Name Field */}
                            <div>
                                <label style={{
                                    display: 'block',
                                    color: 'var(--text-primary)',
                                    fontSize: '0.9rem',
                                    fontWeight: 600,
                                    marginBottom: '0.5rem',
                                }}>
                                    Nama Anda <span style={{ color: '#e74c3c' }}>*</span>
                                </label>
                                <input
                                    ref={nameInputRef}
                                    type="text"
                                    value={name}
                                    onChange={(e) => { setName(e.target.value); setNameError(false); }}
                                    onKeyDown={(e) => { if (e.key === 'Enter') handleOrderSubmit(); }}
                                    placeholder="Contoh: Budi Santoso"
                                    style={{
                                        width: '100%',
                                        padding: '0.75rem 1rem',
                                        background: 'var(--bg-glass)',
                                        border: nameError ? '1px solid #e74c3c' : 'var(--border-gold)',
                                        borderRadius: 'var(--radius-md)',
                                        color: 'var(--text-primary)',
                                        fontSize: '0.95rem',
                                        outline: 'none',
                                        transition: 'border-color 0.2s',
                                        boxSizing: 'border-box',
                                    }}
                                    autoComplete="name"
                                />
                                {nameError && (
                                    <p style={{ color: '#e74c3c', fontSize: '0.8rem', marginTop: '0.3rem' }}>
                                        Nama wajib diisi.
                                    </p>
                                )}
                            </div>

                            {/* PT Name Field (optional) */}
                            <div>
                                <label style={{
                                    display: 'block',
                                    color: 'var(--text-primary)',
                                    fontSize: '0.9rem',
                                    fontWeight: 600,
                                    marginBottom: '0.5rem',
                                }}>
                                    Nama PT / Perusahaan{' '}
                                    <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>(opsional)</span>
                                </label>
                                <input
                                    type="text"
                                    value={ptName}
                                    onChange={(e) => setPtName(e.target.value)}
                                    onKeyDown={(e) => { if (e.key === 'Enter') handleOrderSubmit(); }}
                                    placeholder="Contoh: PT Maju Bersama"
                                    style={{
                                        width: '100%',
                                        padding: '0.75rem 1rem',
                                        background: 'var(--bg-glass)',
                                        border: 'var(--border-gold)',
                                        borderRadius: 'var(--radius-md)',
                                        color: 'var(--text-primary)',
                                        fontSize: '0.95rem',
                                        outline: 'none',
                                        boxSizing: 'border-box',
                                    }}
                                />
                            </div>
                        </div>

                        {/* Submit */}
                        <button
                            onClick={handleOrderSubmit}
                            className="btn btn-primary btn-lg"
                            style={{
                                width: '100%',
                                marginTop: '1.75rem',
                                cursor: 'pointer',
                                border: 'none',
                                justifyContent: 'center',
                                gap: '0.6rem',
                            }}
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                <path d={WA_ICON} />
                            </svg>
                            Chat ke WhatsApp
                        </button>

                        <p style={{ color: 'var(--text-muted)', fontSize: '0.78rem', textAlign: 'center', marginTop: '1rem' }}>
                            Pesan akan dikirim otomatis ke WhatsApp VERALEX CONSULTING
                        </p>
                    </div>
                </div>
            )}

            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes slideUp {
                    from { opacity: 0; transform: translateY(24px) scale(0.97); }
                    to { opacity: 1; transform: translateY(0) scale(1); }
                }
                input::placeholder { color: var(--text-muted); }
                input:focus { border-color: var(--color-gold) !important; box-shadow: 0 0 0 3px rgba(212,175,55,0.15); }
            `}</style>
        </>
    );
}
