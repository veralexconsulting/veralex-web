'use client';

import { useLang } from '@/lib/useLang';
import { whatsappHref } from '@/lib/marketing';

export default function ContactSection() {
    const { t } = useLang();

    return (
        <section className="contact" id="contact" style={{ padding: '80px 0', background: 'var(--bg-dark)' }}>
            <div className="container">
                <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                    <h2 className="section-title fade-in">{t('contact.title')}</h2>
                    <p className="section-subtitle fade-in">{t('contact.subtitle')}</p>
                </div>

                <style>{`
                    .corporate-contact-container {
                        display: grid;
                        grid-template-columns: minmax(0, 1fr);
                        gap: 2.5rem;
                        max-width: 1100px;
                        width: 100%;
                        margin: 0 auto;
                    }

                    @media (min-width: 768px) {
                        .corporate-contact-container {
                            grid-template-columns: 1.1fr 0.9fr;
                            align-items: stretch;
                        }
                    }

                    .contact-info-side {
                        display: flex;
                        flex-direction: column;
                        justify-content: flex-start;
                        gap: 1.25rem;
                        min-width: 0;
                    }

                    .corporate-contact-item {
                        display: flex;
                        align-items: flex-start;
                        gap: 1.25rem;
                        padding: 1.5rem;
                        background: var(--bg-glass);
                        border: var(--border-gold);
                        border-radius: var(--radius-lg);
                        text-decoration: none;
                        transition: var(--transition-normal);
                        min-width: 0;
                        width: 100%;
                    }

                    .corporate-contact-item:hover {
                        transform: translateY(-3px);
                        box-shadow: var(--shadow-gold);
                        border-color: var(--color-gold);
                    }

                    .contact-item-icon {
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        width: 48px;
                        height: 48px;
                        background: rgba(74, 14, 14, 0.08);
                        border-radius: 50%;
                        color: var(--color-gold);
                        flex-shrink: 0;
                        transition: var(--transition-normal);
                    }

                    .corporate-contact-item:hover .contact-item-icon {
                        background: var(--color-gold);
                        color: #ffffff;
                    }

                    .contact-item-icon svg {
                        width: 22px;
                        height: 22px;
                    }

                    .contact-item-content {
                        display: flex;
                        flex-direction: column;
                        min-width: 0;
                    }

                    .contact-item-content h5 {
                        font-family: var(--font-heading);
                        font-size: 1.1rem;
                        color: var(--color-gold);
                        margin: 0 0 0.35rem 0;
                        font-weight: 600;
                    }

                    .contact-item-content p {
                        margin: 0;
                        color: var(--text-secondary);
                        font-size: 0.95rem;
                        line-height: 1.5;
                        overflow-wrap: break-word;
                        word-break: break-word;
                    }

                    .contact-map-side {
                        position: relative;
                        border: var(--border-gold);
                        border-radius: var(--radius-lg);
                        overflow: hidden;
                        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.12);
                        min-height: 350px;
                        background: rgba(255, 255, 255, 0.4);
                        min-width: 0;
                        width: 100%;
                    }

                    .contact-map-side iframe {
                        position: absolute;
                        inset: 0;
                        width: 100%;
                        height: 100%;
                        border: 0;
                        display: block;
                    }

                    @media (max-width: 480px) {
                        .contact-map-side {
                            min-height: 320px;
                        }
                    }
                `}</style>

                <div className="corporate-contact-container fade-in">
                    {/* Left Column: Contact Channels */}
                    <div className="contact-info-side">
                        {/* Email Card */}
                        <a href="mailto:admin@veralexconsulting.com" className="corporate-contact-item">
                            <div className="contact-item-icon">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                    <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <div className="contact-item-content">
                                <h5>Email</h5>
                                <p>admin@veralexconsulting.com</p>
                                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>{t('contact.email_sub')}</p>
                            </div>
                        </a>

                        {/* WhatsApp Card */}
                        <a href={whatsappHref(t('wa.message.general'))} target="_blank" rel="noopener noreferrer" className="corporate-contact-item">
                            <div className="contact-item-icon">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                    <path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                </svg>
                            </div>
                            <div className="contact-item-content">
                                <h5>WhatsApp</h5>
                                <p>+62 812 1947 6385</p>
                                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>{t('contact.wa_sub')}</p>
                            </div>
                        </a>

                        <a href="tel:+6281219476385" className="corporate-contact-item" data-cta-location="contact_phone">
                            <div className="contact-item-icon" aria-hidden="true">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                    <path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                </svg>
                            </div>
                            <div className="contact-item-content">
                                <h5>{t('brand.call')}</h5>
                                <p>+62 812 1947 6385</p>
                            </div>
                        </a>

                        {/* Address Card */}
                        <a href="https://share.google/akvQh44V0JlkMeDs3" target="_blank" rel="noopener noreferrer" className="corporate-contact-item">
                            <div className="contact-item-icon">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                    <path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                            </div>
                            <div className="contact-item-content">
                                <h5>{t('contact.address')}</h5>
                                <p style={{ fontSize: '0.9rem', lineHeight: '1.4' }}>{t('contact.address_value')}</p>
                                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>{t('contact.address_sub')}</p>
                            </div>
                        </a>
                    </div>

                    {/* Right Column: Google Maps Embed */}
                    <div className="contact-map-side">
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.1158580649774!2d106.9859546!3d-6.2484439!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e698c17bbf5cbb7%3A0x6b4122d251f28b4d!2sJl.%20Utama%20Raya%20No.348%2C%20RT.003%2BRW.026%2C%20Kayuringin%20Jaya%2C%20Kec.%20Bekasi%20Sel.%2C%20Kota%20Bks%2C%20Jawa%20Barat%2017144!5e0!3m2!1sid!2sid!4v1719416000000!5m2!1sid!2sid"
                            title={`${t('contact.address')} — ${t('contact.address_value')}`}
                            allowFullScreen={true}
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                        ></iframe>
                    </div>
                </div>
            </div>
        </section>
    );
}
