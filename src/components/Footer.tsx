'use client';

import { useLang } from '@/lib/useLang';
import { whatsappHref } from '@/lib/marketing';
import { contactEmail, socialAccounts } from '@/lib/social';
import Image from 'next/image';
import Link from 'next/link';
import LanguageToggle from '@/components/LanguageToggle';

/*
 * Brand marks are drawn inline: the site ships no icon font, and pulling a
 * whole icon package in for four glyphs is not worth the bytes.
 */
const SOCIAL_ICONS: Record<string, string> = {
    instagram:
        'M12 2.16c3.2 0 3.58.01 4.85.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.36 1.06.41 2.23.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.25 1.8-.41 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.42.16-1.06.36-2.23.41-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.8-.25-2.23-.41a3.7 3.7 0 01-1.38-.9 3.7 3.7 0 01-.9-1.38c-.16-.42-.36-1.06-.41-2.23C2.17 15.58 2.16 15.2 2.16 12s.01-3.58.07-4.85c.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.16 1.06-.36 2.23-.41C8.42 2.17 8.8 2.16 12 2.16zm0 1.8c-3.15 0-3.49.01-4.72.07-.94.04-1.45.2-1.79.33-.45.17-.77.38-1.11.72-.34.34-.55.66-.72 1.11-.13.34-.29.85-.33 1.79-.06 1.23-.07 1.57-.07 4.72s.01 3.49.07 4.72c.04.94.2 1.45.33 1.79.17.45.38.77.72 1.11.34.34.66.55 1.11.72.34.13.85.29 1.79.33 1.23.06 1.57.07 4.72.07s3.49-.01 4.72-.07c.94-.04 1.45-.2 1.79-.33.45-.17.77-.38 1.11-.72.34-.34.55-.66.72-1.11.13-.34.29-.85.33-1.79.06-1.23.07-1.57.07-4.72s-.01-3.49-.07-4.72c-.04-.94-.2-1.45-.33-1.79a2.98 2.98 0 00-.72-1.11 2.98 2.98 0 00-1.11-.72c-.34-.13-.85-.29-1.79-.33-1.23-.06-1.57-.07-4.72-.07zm0 3.06a4.98 4.98 0 110 9.96 4.98 4.98 0 010-9.96zm0 8.21a3.23 3.23 0 100-6.46 3.23 3.23 0 000 6.46zm6.34-8.41a1.16 1.16 0 11-2.33 0 1.16 1.16 0 012.33 0z',
    tiktok:
        'M16.6 5.82a4.28 4.28 0 01-1.06-2.82h-3.1v12.3a2.6 2.6 0 01-2.6 2.5 2.6 2.6 0 110-5.2c.27 0 .53.04.78.12v-3.2a5.8 5.8 0 00-.78-.05 5.8 5.8 0 105.8 5.8V9.66a7.35 7.35 0 004.3 1.38V7.94a4.27 4.27 0 01-3.34-2.12z',
    facebook:
        'M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 5.02 3.66 9.18 8.44 9.94v-7.03H7.9v-2.9h2.54V9.85c0-2.52 1.5-3.92 3.77-3.92 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.78-1.63 1.57v1.9h2.78l-.45 2.9h-2.33V22c4.78-.76 8.44-4.92 8.44-9.94z',
    threads:
        'M12.19 21.75h-.04c-2.79-.02-4.93-.94-6.37-2.74-1.28-1.6-1.95-3.86-2-6.71v-.06c.05-2.85.72-5.11 2-6.71 1.44-1.8 3.58-2.72 6.37-2.74h.04c2.13.02 3.93.56 5.34 1.6 1.29.95 2.15 2.28 2.55 3.94l-1.62.45c-.68-2.78-2.76-4.2-6.28-4.22-2.2.02-3.85.7-4.93 2.04-1 1.25-1.52 3.09-1.56 5.47v.36c.04 2.38.56 4.22 1.56 5.47 1.08 1.34 2.73 2.02 4.93 2.04 2.06-.02 3.36-.48 4.42-1.55.84-.85 1.06-1.94 1.06-2.66 0-1.1-.56-2-1.58-2.53-.4 1.85-1.51 3.06-3.24 3.36-2.06.36-3.86-.63-4.06-2.63-.24-2.32 1.6-4.26 4.5-4.66.9-.12 1.75-.08 2.53.06-.1-.9-.5-1.66-1.15-2.16-.63-.48-1.5-.73-2.53-.73h-.02c-.94 0-2.14.36-2.82 1.75l-1.5-.68c.94-1.94 2.63-2.85 4.32-2.85h.03c2.86.02 4.68 1.85 4.86 4.86.06.08.13.16.19.24 1.02.83 1.85 2.09 1.85 3.97 0 1.15-.35 2.79-1.7 4.02-1.46 1.43-3.16 2.05-5.68 2.07zm1.15-8.2c-.3 0-.6.02-.92.06-1.72.24-2.53 1.03-2.44 1.87.1.9 1.13 1.16 2.13 1 1.02-.18 1.72-.9 1.86-2.3.02-.2.03-.4.02-.58a7.3 7.3 0 00-.65-.05z',
};

export default function Footer() {
    const { t, lang } = useLang();
    const legalPrefix = lang === 'en' ? '' : `/${lang}`;

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

                        {/*
                         * Social accounts live under the brand, not in the contact
                         * column: they are the company's public presence, not
                         * another way to reach a phone line.
                         */}
                        <div className="footer-social">
                            <h4>{t('footer.follow')}</h4>
                            <ul className="footer-social-list">
                                {socialAccounts.map((account) => (
                                    <li key={account.key}>
                                        <a
                                            href={account.href}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="footer-social-link"
                                            aria-label={`${account.label} ${account.handle}`}
                                        >
                                            <svg viewBox="0 0 24 24" width="17" height="17" aria-hidden="true" focusable="false">
                                                <path d={SOCIAL_ICONS[account.key]} fill="currentColor" />
                                            </svg>
                                            <span>{account.handle}</span>
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
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
                        <Link href="/artikel" className="footer-link">{t('nav.articles')}</Link>
                        <Link href="/#contact" className="footer-link">{t('nav.contact')}</Link>
                        <Link href={`${legalPrefix}/privacy-policy`} className="footer-link">{t('legal.privacy')}</Link>
                        <Link href={`${legalPrefix}/terms-and-conditions`} className="footer-link">{t('legal.terms')}</Link>
                        <button type="button" className="footer-link legal-cookie-trigger" onClick={() => window.dispatchEvent(new Event('veralex-cookie-settings'))}>{t('legal.cookies')}</button>
                        
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
                        <a href={whatsappHref(t('wa.message.legal'))} target="_blank" rel="noopener noreferrer" className="footer-contact-item" style={{ color: 'inherit', textDecoration: 'none' }}>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                <path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                            </svg>
                            <div>
                                <span style={{ display: 'block', fontWeight: 600, color: 'var(--text-primary)' }}>+62 812 1947 6385</span>
                                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{t('footer.waLabel')}</span>
                            </div>
                        </a>
                        <a href={`mailto:${contactEmail}`} className="footer-contact-item" style={{ color: 'inherit', textDecoration: 'none' }}>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                            <div>
                                <span style={{ display: 'block', fontWeight: 600, color: 'var(--text-primary)' }}>{contactEmail}</span>
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
