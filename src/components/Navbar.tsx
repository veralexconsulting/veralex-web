'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { translations, Lang } from '@/lib/translations';

const LANG_FLAGS: Record<Lang, string> = { en: '🇬🇧', id: '🇮🇩', zh: '🇨🇳' };
const LANG_NAMES: Record<Lang, string> = { en: 'English', id: 'Indonesia', zh: '中文' };

function LanguageToggle({ lang, onSelect, className = '' }: { lang: Lang; onSelect: (l: Lang) => void; className?: string }) {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const onClickOutside = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
        };
        document.addEventListener('mousedown', onClickOutside);
        return () => document.removeEventListener('mousedown', onClickOutside);
    }, []);

    return (
        <div className="flag-lang-toggle-wrapper" ref={ref}>
            <button
                className={`flag-lang-toggle ${className}`}
                onClick={() => setOpen((v) => !v)}
                type="button"
                aria-label="Change language / Switch language"
                aria-haspopup="listbox"
                aria-expanded={open}
            >
                <span className={`flag-lang-option${lang === 'en' ? ' active' : ''}`} aria-hidden="true">
                    🇬🇧
                </span>
                <span className={`flag-lang-option${lang === 'id' ? ' active' : ''}`} aria-hidden="true">
                    🇮🇩
                </span>
                <span className={`flag-lang-option${lang === 'zh' ? ' active' : ''}`} aria-hidden="true">
                    🇨🇳
                </span>
            </button>
            {open && (
                <div className="flag-lang-dropdown" role="listbox">
                    {(Object.keys(LANG_NAMES) as Lang[]).map((l) => (
                        <button
                            key={l}
                            type="button"
                            role="option"
                            aria-selected={l === lang}
                            className={`flag-lang-dropdown-option${l === lang ? ' active' : ''}`}
                            onClick={() => {
                                onSelect(l);
                                setOpen(false);
                            }}
                        >
                            <span className="flag-lang-dropdown-flag" aria-hidden="true">
                                {LANG_FLAGS[l]}
                            </span>
                            <span className="flag-lang-dropdown-name">{LANG_NAMES[l]}</span>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const [lang, setLang] = useState<Lang>('en');
    const pathname = usePathname();

    useEffect(() => {
        const saved = (localStorage.getItem('veralex-lang') || 'en') as Lang;
        setLang(saved);
    }, []);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll();
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    useEffect(() => {
        const handler = (e: Event) => {
            const detail = (e as CustomEvent).detail as Lang;
            setLang(detail);
        };
        window.addEventListener('langchange', handler);
        return () => window.removeEventListener('langchange', handler);
    }, []);

    const setLanguage = useCallback((next: Lang) => {
        setLang(next);
        localStorage.setItem('veralex-lang', next);
        document.documentElement.lang = next;
        window.dispatchEvent(new CustomEvent('langchange', { detail: next }));
    }, []);

    const t = (key: string) => translations[lang]?.[key] || key;

    const navLinks = [
        { key: 'nav.home', href: '#hero' },
        { key: 'nav.services', href: '#services' },
        { key: 'nav.pricing', href: '#pricing' },
        { key: 'nav.gallery', href: '/gallery' },
        { key: 'nav.contact', href: '#contact' },
    ];

    const getFullHref = (href: string) => {
        // For hash links, always prepend "/" if not on homepage
        if (href.startsWith('#')) {
            return pathname === '/' ? href : `/${href}`;
        }
        return href;
    };

    const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
        if (href.startsWith('#') && pathname === '/') {
            // Only do smooth scroll if we're already on the homepage
            e.preventDefault();
            const el = document.querySelector(href);
            if (el) {
                const navH = document.getElementById('navbar')?.offsetHeight || 80;
                const top = el.getBoundingClientRect().top + window.pageYOffset - navH;
                window.scrollTo({ top, behavior: 'smooth' });
            }
        }
        // If not on homepage, let the browser navigate to /#section
        setMenuOpen(false);
    };

    return (
        <nav id="navbar" className={`navbar${scrolled ? ' scrolled' : ''}`}>
            <div className="container">
                {/* Left Links (Desktop) */}
                <div className={`navbar-menu navbar-left desktop-only`}>
                    {navLinks.slice(0, 3).map((link) =>
                        link.href.startsWith('/') ? (
                            <Link key={link.key} href={link.href} className="navbar-link" onClick={() => setMenuOpen(false)}>
                                {t(link.key)}
                            </Link>
                        ) : (
                            <a key={link.key} href={getFullHref(link.href)} className="navbar-link" onClick={(e) => handleNavClick(e, link.href)}>
                                {t(link.key)}
                            </a>
                        )
                    )}
                </div>

                {/* Centered Brand Motif */}
                <Link href="/" className={`navbar-brand-centered ${scrolled ? 'scrolled-brand' : ''}`} aria-label="VERALEX Home" onClick={() => setMenuOpen(false)}>
                    <div className="navbar-logo-wrapper">
                        <Image src="/logo.jpg" alt="VERALEX CONSULTING" fill sizes="(max-width: 768px) 45px, 60px" className="navbar-logo-image" priority />
                    </div>
                </Link>

                {/* Right Links & Desktop Actions (Desktop) */}
                <div className={`navbar-menu navbar-right desktop-only`}>
                    {navLinks.slice(3).map((link) =>
                        link.href.startsWith('/') ? (
                            <Link key={link.key} href={link.href} className="navbar-link" onClick={() => setMenuOpen(false)}>
                                {t(link.key)}
                            </Link>
                        ) : (
                            <a key={link.key} href={getFullHref(link.href)} className="navbar-link" onClick={(e) => handleNavClick(e, link.href)}>
                                {t(link.key)}
                            </a>
                        )
                    )}

                    <div className="navbar-desktop-actions">
                        <LanguageToggle lang={lang} onSelect={setLanguage} />
                    </div>
                </div>

                {/* Mobile Hamburger Toggle Only */}
                <div className="navbar-mobile-controls">
                    <LanguageToggle lang={lang} onSelect={setLanguage} className="flag-lang-toggle-mobile" />
                    <button
                        className={`menu-toggle${menuOpen ? ' active' : ''}`}
                        onClick={() => setMenuOpen(!menuOpen)}
                        aria-label="Toggle menu"
                    >
                        <span></span>
                        <span></span>
                        <span></span>
                    </button>
                </div>
            </div>

            {/* Mobile Menu Full Overlay */}
            <div className={`navbar-mobile-menu ${menuOpen ? 'active' : ''}`}>
                <div className="navbar-mobile-menu-inner">
                    <div className="mobile-nav-links">
                        {navLinks.map((link) =>
                            link.href.startsWith('/') ? (
                                <Link key={link.key} href={link.href} className="mobile-nav-link" onClick={() => setMenuOpen(false)}>
                                    {t(link.key)}
                                </Link>
                            ) : (
                                <a key={link.key} href={getFullHref(link.href)} className="mobile-nav-link" onClick={(e) => handleNavClick(e, link.href)}>
                                    {t(link.key)}
                                </a>
                            )
                        )}
                    </div>

                    <div className="navbar-mobile-actions">
                        <a href="https://wa.me/6281219476385?text=Halo%20VERALEX,%20saya%20ingin%20konsultasi%20tentang%20layanan%20legalitas%20bisnis." className="btn-editorial-solid" target="_blank" rel="noopener noreferrer" onClick={() => setMenuOpen(false)}>
                            {t('nav.cta')}
                        </a>
                    </div>
                </div>
            </div>
        </nav>
    );
}
