'use client';

import { useLang } from '@/lib/useLang';
import { whatsappHref } from '@/lib/marketing';
import { contactEmail, socialAccounts } from '@/lib/social';
import Image from 'next/image';
import Link from 'next/link';
import LanguageToggle from '@/components/LanguageToggle';
import './Footer.css';

/*
 * Brand marks are drawn inline: the site ships no icon font, and pulling a
 * whole icon package in for four glyphs is not worth the bytes.
 */
/* Official brand marks: simple-icons v13 (CC0). */
const SOCIAL_ICONS: Record<string, string> = {
    instagram: 'M7.0301.084c-1.2768.0602-2.1487.264-2.911.5634-.7888.3075-1.4575.72-2.1228 1.3877-.6652.6677-1.075 1.3368-1.3802 2.127-.2954.7638-.4956 1.6365-.552 2.914-.0564 1.2775-.0689 1.6882-.0626 4.947.0062 3.2586.0206 3.6671.0825 4.9473.061 1.2765.264 2.1482.5635 2.9107.308.7889.72 1.4573 1.388 2.1228.6679.6655 1.3365 1.0743 2.1285 1.38.7632.295 1.6361.4961 2.9134.552 1.2773.056 1.6884.069 4.9462.0627 3.2578-.0062 3.668-.0207 4.9478-.0814 1.28-.0607 2.147-.2652 2.9098-.5633.7889-.3086 1.4578-.72 2.1228-1.3881.665-.6682 1.0745-1.3378 1.3795-2.1284.2957-.7632.4966-1.636.552-2.9124.056-1.2809.0692-1.6898.063-4.948-.0063-3.2583-.021-3.6668-.0817-4.9465-.0607-1.2797-.264-2.1487-.5633-2.9117-.3084-.7889-.72-1.4568-1.3876-2.1228C21.2982 1.33 20.628.9208 19.8378.6165 19.074.321 18.2017.1197 16.9244.0645 15.6471.0093 15.236-.005 11.977.0014 8.718.0076 8.31.0215 7.0301.0839m.1402 21.6932c-1.17-.0509-1.8053-.2453-2.2287-.408-.5606-.216-.96-.4771-1.3819-.895-.422-.4178-.6811-.8186-.9-1.378-.1644-.4234-.3624-1.058-.4171-2.228-.0595-1.2645-.072-1.6442-.079-4.848-.007-3.2037.0053-3.583.0607-4.848.05-1.169.2456-1.805.408-2.2282.216-.5613.4762-.96.895-1.3816.4188-.4217.8184-.6814 1.3783-.9003.423-.1651 1.0575-.3614 2.227-.4171 1.2655-.06 1.6447-.072 4.848-.079 3.2033-.007 3.5835.005 4.8495.0608 1.169.0508 1.8053.2445 2.228.408.5608.216.96.4754 1.3816.895.4217.4194.6816.8176.9005 1.3787.1653.4217.3617 1.056.4169 2.2263.0602 1.2655.0739 1.645.0796 4.848.0058 3.203-.0055 3.5834-.061 4.848-.051 1.17-.245 1.8055-.408 2.2294-.216.5604-.4763.96-.8954 1.3814-.419.4215-.8181.6811-1.3783.9-.4224.1649-1.0577.3617-2.2262.4174-1.2656.0595-1.6448.072-4.8493.079-3.2045.007-3.5825-.006-4.848-.0608M16.953 5.5864A1.44 1.44 0 1 0 18.39 4.144a1.44 1.44 0 0 0-1.437 1.4424M5.8385 12.012c.0067 3.4032 2.7706 6.1557 6.173 6.1493 3.4026-.0065 6.157-2.7701 6.1506-6.1733-.0065-3.4032-2.771-6.1565-6.174-6.1498-3.403.0067-6.156 2.771-6.1496 6.1738M8 12.0077a4 4 0 1 1 4.008 3.9921A3.9996 3.9996 0 0 1 8 12.0077',
    threads: 'M12.186 24h-.007c-3.581-.024-6.334-1.205-8.184-3.509C2.35 18.44 1.5 15.586 1.472 12.01v-.017c.03-3.579.879-6.43 2.525-8.482C5.845 1.205 8.6.024 12.18 0h.014c2.746.02 5.043.725 6.826 2.098 1.677 1.29 2.858 3.13 3.509 5.467l-2.04.569c-1.104-3.96-3.898-5.984-8.304-6.015-2.91.022-5.11.936-6.54 2.717C4.307 6.504 3.616 8.914 3.589 12c.027 3.086.718 5.496 2.057 7.164 1.43 1.783 3.631 2.698 6.54 2.717 2.623-.02 4.358-.631 5.8-2.045 1.647-1.613 1.618-3.593 1.09-4.798-.31-.71-.873-1.3-1.634-1.75-.192 1.352-.622 2.446-1.284 3.272-.886 1.102-2.14 1.704-3.73 1.79-1.202.065-2.361-.218-3.259-.801-1.063-.689-1.685-1.74-1.752-2.964-.065-1.19.408-2.285 1.33-3.082.88-.76 2.119-1.207 3.583-1.291a13.853 13.853 0 0 1 3.02.142c-.126-.742-.375-1.332-.75-1.757-.513-.586-1.308-.883-2.359-.89h-.029c-.844 0-1.992.232-2.721 1.32L7.734 7.847c.98-1.454 2.568-2.256 4.478-2.256h.044c3.194.02 5.097 1.975 5.287 5.388.108.046.216.094.321.142 1.49.7 2.58 1.761 3.154 3.07.797 1.82.871 4.79-1.548 7.158-1.85 1.81-4.094 2.628-7.277 2.65Zm1.003-11.69c-.242 0-.487.007-.739.021-1.836.103-2.98.946-2.916 2.143.067 1.256 1.452 1.839 2.784 1.767 1.224-.065 2.818-.543 3.086-3.71a10.5 10.5 0 0 0-2.215-.221z',
    tiktok: 'M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z',
    facebook: 'M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 .955.042 1.468.103a8.68 8.68 0 0 1 1.141.195v3.325a8.623 8.623 0 0 0-.653-.036 26.805 26.805 0 0 0-.733-.009c-.707 0-1.259.096-1.675.309a1.686 1.686 0 0 0-.679.622c-.258.42-.374.995-.374 1.752v1.297h3.919l-.386 2.103-.287 1.564h-3.246v8.245C19.396 23.238 24 18.179 24 12.044c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.628 3.874 10.35 9.101 11.647Z',
};

const ICONS = {
    whatsapp: (
        <>
            <path d="M20.5 11.6a8.4 8.4 0 01-12.4 7.4L3.5 20.5l1.5-4.5a8.4 8.4 0 1115.5-4.4z" />
            <path d="M8.6 8.4c.2-.4.5-.4.8-.4h.5c.2 0 .4.1.5.4l.7 1.6c.1.2 0 .4-.1.6l-.5.6c-.1.2-.2.3 0 .6.5.8 1.2 1.5 2.1 1.9.3.1.4.1.6-.1l.6-.7c.2-.2.3-.2.6-.1l1.6.8c.3.1.4.2.4.4 0 .9-.3 1.6-.9 2-.6.4-1.4.5-2.3.2-2.4-.8-4.4-2.8-5.2-5.2-.2-.9-.1-1.6.3-2.1z" />
        </>
    ),
    mail: <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />,
    pin: (
        <>
            <path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </>
    ),
};

export default function Footer() {
    const { t, lang } = useLang();
    const legalPrefix = lang === 'en' ? '' : `/${lang}`;

    return (
        <footer className="footer">
            <div className="container">
                {/*
                 * Row 1 — the brand block spans the full width so the logo has
                 * room to breathe at its native ratio, and the link columns sit
                 * below it in their own band. A 4-column grid forced the logo
                 * into a 44px square and squashed it.
                 */}
                <div className="footer-masthead">
                    <div className="footer-brand">
                        <Image
                            src="/logo.webp"
                            alt="PT. Veralex Consulting Indonesia"
                            width={1024}
                            height={724}
                            sizes="180px"
                            className="footer-logo-img"
                        />
                        <div className="footer-brand-text">
                            <p className="footer-legal-name">PT. Veralex Consulting Indonesia</p>
                            <p className="footer-desc">{t('footer.desc')}</p>
                        </div>
                    </div>

                    <div className="footer-social">
                        <h2 className="footer-col-title">{t('footer.follow')}</h2>
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

                {/* Row 2 — navigation and contact */}
                <div className="footer-columns">
                    <nav className="footer-col" aria-labelledby="footer-services">
                        <h2 className="footer-col-title" id="footer-services">{t('footer.services')}</h2>
                        <ul>
                            <li><Link href="/services/pt-pma" className="footer-link">{t('footer.svcPma')}</Link></li>
                            <li><Link href="/services/pendaftaran-merek" className="footer-link">{t('footer.svcMerek')}</Link></li>
                            <li><Link href="/services/pt-pmdn" className="footer-link">{t('footer.svcPmdn')}</Link></li>
                            <li><Link href="/services/pt-perorangan" className="footer-link">{t('footer.svcPerorangan')}</Link></li>
                            <li><Link href="/services/pendirian-cv" className="footer-link">{t('footer.svcCv')}</Link></li>
                            <li><Link href="/services/itas-investor-1-tahun" className="footer-link">{t('footer.svcItas')}</Link></li>
                            <li><Link href="/services/kitas-kerja" className="footer-link">{t('footer.svcKitas')}</Link></li>
                            <li><Link href="/#services" className="footer-link footer-link-all">{t('footer.allServices')} →</Link></li>
                        </ul>
                    </nav>

                    <nav className="footer-col" aria-labelledby="footer-nav">
                        <h2 className="footer-col-title" id="footer-nav">{t('footer.nav')}</h2>
                        <ul>
                            <li><Link href="/" className="footer-link">{t('nav.home')}</Link></li>
                            <li><Link href="/#services" className="footer-link">{t('nav.services')}</Link></li>
                            <li><Link href="/#pricing" className="footer-link">{t('nav.pricing')}</Link></li>
                            <li><Link href="/gallery" className="footer-link">{t('nav.gallery')}</Link></li>
                            <li><Link href="/artikel" className="footer-link">{t('nav.articles')}</Link></li>
                            <li><Link href="/#contact" className="footer-link">{t('nav.contact')}</Link></li>
                        </ul>
                    </nav>

                    <nav className="footer-col" aria-labelledby="footer-legal">
                        <h2 className="footer-col-title" id="footer-legal">{t('footer.legal')}</h2>
                        <ul>
                            <li><Link href={`${legalPrefix}/privacy-policy`} className="footer-link">{t('legal.privacy')}</Link></li>
                            <li><Link href={`${legalPrefix}/terms-and-conditions`} className="footer-link">{t('legal.terms')}</Link></li>
                            <li>
                                <button type="button" className="footer-link legal-cookie-trigger" onClick={() => window.dispatchEvent(new Event('veralex-cookie-settings'))}>
                                    {t('legal.cookies')}
                                </button>
                            </li>
                        </ul>
                    </nav>

                    <div className="footer-col footer-col-contact">
                        <h2 className="footer-col-title">{t('footer.contact')}</h2>
                        <ul className="footer-contact-list">
                            <li>
                                <a href={whatsappHref(t('wa.message.legal'))} target="_blank" rel="noopener noreferrer" className="footer-contact-item">
                                    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{ICONS.whatsapp}</svg>
                                    <span>
                                        <strong>+62 812 1947 6385</strong>
                                        <small>{t('footer.waLabel')}</small>
                                    </span>
                                </a>
                            </li>
                            <li>
                                <a href={`mailto:${contactEmail}`} className="footer-contact-item">
                                    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{ICONS.mail}</svg>
                                    <span>
                                        <strong className="footer-contact-email">{contactEmail}</strong>
                                        <small>{t('footer.emailLabel')}</small>
                                    </span>
                                </a>
                            </li>
                            <li>
                                <a href="https://share.google/akvQh44V0JlkMeDs3" target="_blank" rel="noopener noreferrer" className="footer-contact-item is-address">
                                    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{ICONS.pin}</svg>
                                    <span>
                                        <strong className="footer-address">{t('footer.address')}</strong>
                                        <small className="footer-maps">{t('footer.mapsLabel')} →</small>
                                    </span>
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Row 3 — service coverage, quiet */}
                <div className="footer-coverage">
                    <h2 className="footer-col-title">{t('footer.coverage')}</h2>
                    <p>{t('footer.coverageText')}</p>
                </div>
            </div>

            {/* Row 4 — legal strip, full-bleed so it reads as the closing rule */}
            <div className="footer-base">
                <div className="container">
                    <p className="footer-disclaimer">{t('footer.disclaimer')}</p>
                    <div className="footer-base-row">
                        <p className="footer-copyright">{t('footer.copyright')}</p>
                        <LanguageToggle />
                    </div>
                </div>
            </div>
        </footer>
    );
}
