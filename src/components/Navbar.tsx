'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { translations, Lang } from '@/lib/translations';

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const [lang, setLang] = useState<Lang>('id');
    const pathname = usePathname();

    useEffect(() => {
        const saved = (localStorage.getItem('veralex-lang') || 'id') as Lang;
        setLang(saved);
    }, []);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll();
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    const toggleLang = useCallback(() => {
        const next = lang === 'id' ? 'en' : 'id';
        setLang(next);
        localStorage.setItem('veralex-lang', next);
        document.documentElement.lang = next;
        window.dispatchEvent(new CustomEvent('langchange', { detail: next }));
    }, [lang]);

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
                <Link href="/" className="navbar-brand">
                    <Image src="/logo.jpg" alt="VERALEX CONSULTING" width={50} height={50} className="navbar-logo" priority />
                    <span className="navbar-name">VERALEX</span>
                </Link>

                <div className={`navbar-menu${menuOpen ? ' active' : ''}`} id="navMenu">
                    {navLinks.map((link) =>
                        link.href.startsWith('/') ? (
                            <Link
                                key={link.key}
                                href={link.href}
                                className="navbar-link"
                                onClick={() => setMenuOpen(false)}
                            >
                                {t(link.key)}
                            </Link>
                        ) : (
                            <a
                                key={link.key}
                                href={getFullHref(link.href)}
                                className="navbar-link"
                                onClick={(e) => handleNavClick(e, link.href)}
                            >
                                {t(link.key)}
                            </a>
                        )
                    )}
                </div>

                <div className="navbar-actions">
                    <button className="lang-toggle" id="langToggle" onClick={toggleLang}>
                        {lang === 'id' ? 'EN' : 'ID'}
                    </button>
                    <a
                        href="https://wa.me/6281219476385?text=Halo%20VERALEX,%20saya%20ingin%20konsultasi%20tentang%20layanan%20legalitas%20bisnis."
                        className="btn btn-primary btn-nav"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        {t('nav.cta')}
                    </a>
                    <button
                        className={`menu-toggle${menuOpen ? ' active' : ''}`}
                        id="menuToggle"
                        onClick={() => setMenuOpen(!menuOpen)}
                        aria-label="Toggle menu"
                    >
                        <span></span>
                        <span></span>
                        <span></span>
                    </button>
                </div>
            </div>
        </nav>
    );
}
