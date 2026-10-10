'use client';

import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import LanguageToggle from '@/components/LanguageToggle';
import { serviceData } from '@/lib/serviceData';
import { hasServicePage } from '@/lib/servicePageData';
import { useLang } from '@/lib/useLang';
import './PublicNavigation.css';

const groups = [
    { key: 'business', slugs: ['pt-pmdn', 'pt-pma', 'pendirian-cv', 'pt-perorangan'] },
    { key: 'ip', slugs: ['pendaftaran-merek', 'perpanjangan-merek', 'pengalihan-merek', 'hak-cipta', 'desain-industri'] },
    { key: 'immigration', slugs: ['itas-investor-1-tahun', 'itas-investor-2-tahun', 'kitas-kerja', 'visa-c2', 'visa-d2-1-tahun', 'visa-d2-2-tahun'] },
] as const;
const products = ['halal', 'bpom', 'sni', 'k3l', 'postel'] as const;

export default function Navbar() {
    const { t, lang } = useLang();
    const pathname = usePathname();
    const [scrolled, setScrolled] = useState(false);
    const [servicesOpen, setServicesOpen] = useState(false);
    const [aboutOpen, setAboutOpen] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
    const [mobileAboutOpen, setMobileAboutOpen] = useState(false);
    const [hash, setHash] = useState('');
    const rootRef = useRef<HTMLElement>(null);
    const servicesTriggerRef = useRef<HTMLButtonElement>(null);
    const aboutTriggerRef = useRef<HTMLButtonElement>(null);
    const mobileTriggerRef = useRef<HTMLButtonElement>(null);
    const mobilePanelRef = useRef<HTMLDivElement>(null);
    const previousPath = useRef(pathname);

    useEffect(() => {
        const onScroll = () => {
            const next = window.scrollY >= 76;
            setScrolled(current => current === next ? current : next);
        };
        onScroll();
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);
    useEffect(() => {
        const onHash = () => setHash(window.location.hash);
        onHash();
        window.addEventListener('hashchange', onHash);
        return () => window.removeEventListener('hashchange', onHash);
    }, [pathname]);
    useEffect(() => {
        if (previousPath.current !== pathname) {
            previousPath.current = pathname;
            const timer = window.setTimeout(() => {
                setServicesOpen(false);
                setAboutOpen(false);
                setMobileOpen(false);
                setMobileServicesOpen(false);
                setMobileAboutOpen(false);
            }, 0);
            return () => window.clearTimeout(timer);
        }
    }, [pathname]);
    useEffect(() => {
        const outside = (event: PointerEvent) => {
            const target = event.target as Node;
            if (rootRef.current?.contains(target) || mobilePanelRef.current?.contains(target)) return;
            setServicesOpen(false);
            setAboutOpen(false);
        };
        const escape = (event: KeyboardEvent) => {
            if (event.key !== 'Escape') return;
            if (rootRef.current?.querySelector('.flag-lang-toggle[aria-expanded="true"]')) return;
            if (mobileOpen) {
                setMobileOpen(false);
                mobileTriggerRef.current?.focus();
            } else if (servicesOpen) {
                setServicesOpen(false);
                servicesTriggerRef.current?.focus();
            } else if (aboutOpen) {
                setAboutOpen(false);
                aboutTriggerRef.current?.focus();
            }
        };
        document.addEventListener('pointerdown', outside);
        document.addEventListener('keydown', escape);
        return () => { document.removeEventListener('pointerdown', outside); document.removeEventListener('keydown', escape); };
    }, [mobileOpen, servicesOpen, aboutOpen]);
    useEffect(() => {
        if (!mobileOpen) return;
        const previous = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        mobilePanelRef.current?.querySelector<HTMLElement>('a, button')?.focus();
        const trap = (event: KeyboardEvent) => {
            if (event.key !== 'Tab') return;
            const controls = Array.from(rootRef.current?.querySelectorAll<HTMLElement>('.vnav-mobile-header button:not([disabled])') ?? []);
            const items = Array.from(mobilePanelRef.current?.querySelectorAll<HTMLElement>('a[href], button:not([disabled])') ?? []);
            const focusables = [...controls, ...items];
            if (!focusables.length) return;
            const index = focusables.indexOf(document.activeElement as HTMLElement);
            const next = event.shiftKey
                ? (index <= 0 ? focusables.length - 1 : index - 1)
                : (index < 0 || index === focusables.length - 1 ? 0 : index + 1);
            event.preventDefault();
            focusables[next].focus();
        };
        document.addEventListener('keydown', trap);
        return () => { document.body.style.overflow = previous; document.removeEventListener('keydown', trap); };
    }, [mobileOpen]);

    const close = () => {
        setServicesOpen(false);
        setAboutOpen(false);
        setMobileOpen(false);
        setMobileServicesOpen(false);
        setMobileAboutOpen(false);
    };
    const homeHref = (anchor: string) => pathname === '/' ? anchor : `/${anchor}`;
    const aboutHref = lang === 'en' ? '/about-us' : `/${lang}/about-us`;
    const contactHref = homeHref('#contact');
    const serviceHref = (slug: string) => lang !== 'id' && hasServicePage(lang, slug) ? `/${lang}/services/${slug}` : `/services/${slug}`;
    const serviceName = (slug: string) => {
        const service = serviceData.find(item => item.slug === slug);
        return service ? (lang === 'zh' ? service.titleZh : lang === 'en' ? service.titleEn : service.title) : slug;
    };
    const serviceActive = /^\/(?:en\/|zh\/|id\/)?services(?:\/|$)/.test(pathname);
    const aboutActive = /^\/(?:en\/|zh\/|id\/)?about-us\/?$/.test(pathname) || pathname === '/contact' || (pathname === '/' && hash === '#contact');
    const homeActive = pathname === '/' && !aboutActive;
    const galleryActive = pathname === '/gallery';
    const articlesActive = pathname === '/artikel' || pathname.startsWith('/artikel/');
    const menuGroups = <>
        {groups.map(group => <div className="vnav-group" key={group.key}>
            <h3>{t(`nav.group.${group.key}`)}</h3>
            {group.slugs.map(slug => <Link key={slug} href={serviceHref(slug)} onClick={close}>{serviceName(slug)}<span aria-hidden="true">↗</span></Link>)}
        </div>)}
        <div className="vnav-group"><h3>{t('nav.group.products')}</h3>
            {products.map(key => <Link key={key} href={homeHref(`#service-${key}`)} onClick={close}>{t(`services.product.${key}.title`)}<span aria-hidden="true">↗</span></Link>)}
        </div>
    </>;
    const aboutLinks = <>
        <Link href={aboutHref} onClick={close}>{t('nav.aboutVeralex')} <span aria-hidden="true">↗</span></Link>
        <Link href={contactHref} onClick={close}>{t('nav.contactUs')} <span aria-hidden="true">↗</span></Link>
    </>;

    return <>
        <nav id="navbar" ref={rootRef} className={`navbar vnav${scrolled ? ' scrolled' : ''}`} aria-label={t('nav.main')}>
            <div className="container vnav-bar">
                <Link href="/" className="vnav-brand" aria-label={`VERALEX CONSULTING — ${t('nav.home')}`} onClick={close}>
                    <Image src="/logo.webp" alt="VERALEX CONSULTING" width={1024} height={724} sizes="(max-width: 375px) 54px, (max-width: 560px) 58px, (max-width: 1080px) 62px, 78px" priority />
                </Link>
                <div className="vnav-desktop">
                    <Link href={homeHref('#hero')} className={homeActive ? 'is-active' : undefined} aria-current={homeActive ? 'page' : undefined} onClick={close}>{t('nav.home')}</Link>
                    <div className="vnav-services" onPointerEnter={event => { if (event.pointerType === 'mouse') { setServicesOpen(true); setAboutOpen(false); } }} onPointerLeave={event => { if (event.pointerType === 'mouse') setServicesOpen(false); }} onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget)) setServicesOpen(false); }}>
                        <button ref={servicesTriggerRef} type="button" className={serviceActive ? 'is-active' : undefined} aria-current={serviceActive ? 'page' : undefined} aria-expanded={servicesOpen} aria-controls="vnav-mega" aria-haspopup="true" onClick={() => { setServicesOpen(true); setAboutOpen(false); }}>{t('nav.services')} <span aria-hidden="true" className={`vnav-chevron${servicesOpen ? ' open' : ''}`}>⌄</span></button>
                        {servicesOpen && <div id="vnav-mega" className="vnav-mega" aria-label={t('nav.services')}>
                            <div className="vnav-mega-head"><div><span>{t('nav.explore')}</span><strong>{t('nav.megaTitle')}</strong></div><Link href={homeHref('#services')} onClick={close}>{t('nav.allServices')} <span aria-hidden="true">→</span></Link></div>
                            <div className="vnav-mega-grid">{menuGroups}</div>
                        </div>}
                    </div>
                    <div className="vnav-about" onPointerEnter={event => { if (event.pointerType === 'mouse') { setAboutOpen(true); setServicesOpen(false); } }} onPointerLeave={event => { if (event.pointerType === 'mouse') setAboutOpen(false); }} onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget)) setAboutOpen(false); }}>
                        <button ref={aboutTriggerRef} type="button" className={aboutActive ? 'is-active' : undefined} aria-current={aboutActive ? 'page' : undefined} aria-expanded={aboutOpen} aria-controls="vnav-about-menu" aria-haspopup="true" onClick={() => { setAboutOpen(true); setServicesOpen(false); }}>{t('nav.about')} <span aria-hidden="true" className={`vnav-chevron${aboutOpen ? ' open' : ''}`}>⌄</span></button>
                        {aboutOpen && <div id="vnav-about-menu" className="vnav-about-menu">{aboutLinks}</div>}
                    </div>
                    <Link href="/gallery" className={galleryActive ? 'is-active' : undefined} aria-current={galleryActive ? 'page' : undefined} onClick={close}>{t('nav.gallery')}</Link>
                    <Link href="/artikel" className={articlesActive ? 'is-active' : undefined} aria-current={articlesActive ? 'page' : undefined} onClick={close}>{t('nav.articles')}</Link>
                </div>
                <div className="vnav-actions"><Link className="vnav-track" href="/portal/login" onClick={close}>{t('nav.track')} <span aria-hidden="true">↗</span></Link><div className="vnav-language"><LanguageToggle /></div></div>
                <div className="vnav-mobile-header"><LanguageToggle compact /><button ref={mobileTriggerRef} className="vnav-toggle" type="button" aria-label={mobileOpen ? t('nav.close') : t('nav.open')} aria-controls="vnav-mobile" aria-expanded={mobileOpen} onClick={() => { setMobileOpen(value => !value); setServicesOpen(false); setAboutOpen(false); }}><span/><span/><span/></button></div>
            </div>
        </nav>
        {mobileOpen && createPortal(<div className="vnav-mobile-overlay" onPointerDown={event => { if (event.target === event.currentTarget) { close(); mobileTriggerRef.current?.focus(); } }}>
            <div id="vnav-mobile" ref={mobilePanelRef} className={`vnav-mobile${scrolled ? ' is-floating' : ''}`} role="dialog" aria-label={t('nav.main')}>
                <div className="vnav-mobile-inner">
                    <Link href={homeHref('#hero')} className={homeActive ? 'is-active' : undefined} onClick={close}>{t('nav.home')}</Link>
                    <button type="button" className={`vnav-mobile-accordion${serviceActive ? ' is-active' : ''}`} aria-expanded={mobileServicesOpen} aria-controls="vnav-mobile-services" onClick={() => setMobileServicesOpen(value => !value)}>{t('nav.services')} <span aria-hidden="true">{mobileServicesOpen ? '−' : '+'}</span></button>
                    {mobileServicesOpen && <div id="vnav-mobile-services" className="vnav-mobile-groups">{menuGroups}<Link className="vnav-mobile-all" href={homeHref('#services')} onClick={close}>{t('nav.allServices')} →</Link></div>}
                    <button type="button" className={`vnav-mobile-accordion${aboutActive ? ' is-active' : ''}`} aria-expanded={mobileAboutOpen} aria-controls="vnav-mobile-about" onClick={() => setMobileAboutOpen(value => !value)}>{t('nav.about')} <span aria-hidden="true">{mobileAboutOpen ? '−' : '+'}</span></button>
                    {mobileAboutOpen && <div id="vnav-mobile-about" className="vnav-mobile-about">{aboutLinks}</div>}
                    <Link href="/gallery" className={galleryActive ? 'is-active' : undefined} onClick={close}>{t('nav.gallery')}</Link>
                    <Link href="/artikel" className={articlesActive ? 'is-active' : undefined} onClick={close}>{t('nav.articles')}</Link>
                    <Link className="vnav-track vnav-mobile-track" href="/portal/login" onClick={close}>{t('nav.track')} <span aria-hidden="true">↗</span></Link>
                </div>
            </div>
        </div>, document.body)}
    </>;
}
