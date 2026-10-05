'use client';

import { useLang } from '@/lib/useLang';
import Image from 'next/image';
import Link from 'next/link';
import LanguageToggle from '@/components/LanguageToggle';

export default function Footer() {
    const { t } = useLang();

    return (
        <footer className="footer">
            <div className="container">
                <div className="footer-content">
                    {/* Col 1: Brand */}
                    <div className="footer-brand">
                        <div className="footer-logo">
                            <Image src="/logo.webp" alt="PT. Veralex Consulting Indonesia" width={44} height={44} />
                            <span className="footer-logo-text">VERALEX CONSULTING</span>
                        </div>
                        <p style={{
                            fontSize: '0.78rem',
                            letterSpacing: '0.08em',
                            textTransform: 'uppercase',
                            color: 'var(--color-gold)',
                            fontWeight: 600,
                            margin: '0 0 0.9rem'
                        }}>
                            PT. Veralex Consulting Indonesia
                        </p>
                        <p className="footer-desc">{t('footer.desc')}</p>
                    </div>

                    {/* Col 2: Layanan Populer */}
                    <div className="footer-links">
                        <h4>{t('footer.services')}</h4>
                        <Link href="/services/pt-pma" className="footer-link">{t('footer.svcPma')}</Link>
                        <Link href="/services/pendaftaran-merek" className="footer-link">{t('footer.svcMerek')}</Link>
                        <Link href="/services/pt-pmdn" className="footer-link">{t('footer.svcPmdn')}</Link>
                        <Link href="/services/pt-perorangan" className="footer-link">{t('footer.svcPerorangan')}</Link>
                        <Link href="/services/pendirian-cv" className="footer-link">{t('footer.svcCv')}</Link>
                        <Link href="/services/itas-investor-1-tahun" className="footer-link">{t('footer.svcItas')}</Link>
                        <Link href="/services/kitas-kerja" className="footer-link">{t('footer.svcKitas')}</Link>
                        <Link href="/#services" className="footer-link" style={{ color: 'var(--color-gold)', fontWeight: 600 }}>{t('footer.allServices')} →</Link>
                    </div>

                    {/* Col 3: Navigasi & Wilayah Layanan */}
                    <div className="footer-links">
                        <h4>{t('footer.nav')}</h4>
                        <Link href="/" className="footer-link">{t('nav.home')}</Link>
                        <Link href="/#services" className="footer-link">{t('nav.services')}</Link>
                        <Link href="/#pricing" className="footer-link">{t('nav.pricing')}</Link>
                        <Link href="/gallery" className="footer-link">{t('nav.gallery')}</Link>
                        <Link href="/#contact" className="footer-link">{t('nav.contact')}</Link>
                        
                        <div style={{ marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
                            <h5 style={{ color: 'var(--color-gold)', fontSize: '0.9rem', marginBottom: '0.35rem' }}>{t('footer.coverage')}</h5>
                            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                                {t('footer.coverageText')}
                            </p>
                        </div>
                    </div>

                    {/* Col 4: Kontak & Kantor */}
                    <div className="footer-links">
                        <h4>{t('footer.contact')}</h4>
                        <a href="https://wa.me/6281219476385?text=Halo%20VERALEX,%20saya%20ingin%20konsultasi%20legalitas" target="_blank" rel="noopener noreferrer" className="footer-contact-item" style={{ color: 'inherit', textDecoration: 'none' }}>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                <path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                            </svg>
                            <div>
                                <span style={{ display: 'block', fontWeight: 600, color: 'var(--text-primary)' }}>+62 812 1947 6385</span>
                                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{t('footer.waLabel')}</span>
                            </div>
                        </a>
                        <a href="mailto:admin@veralexconsulting.com" className="footer-contact-item" style={{ color: 'inherit', textDecoration: 'none' }}>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                            <div>
                                <span style={{ display: 'block', fontWeight: 600, color: 'var(--text-primary)' }}>admin@veralexconsulting.com</span>
                                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{t('footer.emailLabel')}</span>
                            </div>
                        </a>
                        <a href="https://share.google/akvQh44V0JlkMeDs3" target="_blank" rel="noopener noreferrer" className="footer-contact-item" style={{ color: 'inherit', textDecoration: 'none', alignItems: 'flex-start' }}>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ flexShrink: 0, marginTop: '3px' }}>
                                <path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            <div>
                                <span style={{ display: 'block', lineHeight: 1.5, fontSize: '0.85rem' }}>{t('footer.address')}</span>
                                <span style={{ fontSize: '0.78rem', color: 'var(--color-gold)', fontWeight: 500, display: 'inline-block', marginTop: '4px' }}>{t('footer.mapsLabel')} →</span>
                            </div>
                        </a>
                    </div>
                </div>

                {/* Disclaimer */}
                <div style={{
                    padding: '1.25rem 0',
                    borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                    fontSize: '0.8rem',
                    color: 'var(--text-muted)',
                    textAlign: 'center',
                    lineHeight: 1.6
                }}>
                    <p>{t('footer.disclaimer')}</p>
                </div>

                <div className="footer-bottom" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                    <p style={{ margin: 0 }}>{t('footer.copyright')}</p>
                    <LanguageToggle />
                </div>
            </div>
        </footer>
    );
}
