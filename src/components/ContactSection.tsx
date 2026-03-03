'use client';

import { useLang } from '@/lib/useLang';

export default function ContactSection() {
    const { t } = useLang();

    return (
        <section className="contact" id="contact">
            <div className="container">
                <h2 className="section-title fade-in">{t('contact.title')}</h2>
                <p className="section-subtitle fade-in">{t('contact.subtitle')}</p>

                <div className="contact-grid">
                    <a href="mailto:veralexconsulting@gmail.com" className="contact-card fade-in">
                        <div className="contact-icon">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <h4 className="contact-label">Email</h4>
                        <p className="contact-value">veralexconsulting@gmail.com</p>
                    </a>

                    <a href="https://wa.me/6281219476385" target="_blank" rel="noopener noreferrer" className="contact-card fade-in">
                        <div className="contact-icon">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                <path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                            </svg>
                        </div>
                        <h4 className="contact-label">WhatsApp</h4>
                        <p className="contact-value">+62 812 1947 6385</p>
                    </a>

                    <div className="contact-card fade-in">
                        <div className="contact-icon">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                <path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                        </div>
                        <h4 className="contact-label">{t('contact.address')}</h4>
                        <p className="contact-value">Bekasi, Indonesia</p>
                    </div>
                </div>
            </div>
        </section>
    );
}
