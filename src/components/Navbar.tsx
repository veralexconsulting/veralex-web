'use client';

import { useEffect, useRef, useState } from 'react';
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
    const [mobileOpen, setMobileOpen] = useState(false);
    const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
    const rootRef = useRef<HTMLElement>(null);
    const triggerRef = useRef<HTMLButtonElement>(null);
    const mobileTriggerRef = useRef<HTMLButtonElement>(null);
    const mobilePanelRef = useRef<HTMLDivElement>(null);
    const previousPath = useRef(pathname);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 28);
        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll();
        return () => window.removeEventListener('scroll', onScroll);
    }, []);
    useEffect(() => {
        if (previousPath.current !== pathname) {
            previousPath.current = pathname;
            const timer = window.setTimeout(() => {
                setServicesOpen(false);
                setMobileOpen(false);
                setMobileServicesOpen(false);
            }, 0);
            return () => window.clearTimeout(timer);
        }
    }, [pathname]);
    useEffect(() => {
        const outside = (event: PointerEvent) => {
            if (!rootRef.current?.contains(event.target as Node)) { setServicesOpen(false); setMobileOpen(false); }
        };
        const escape = (event: KeyboardEvent) => {
            if (event.key !== 'Escape') return;
            if (mobileOpen) { setMobileOpen(false); mobileTriggerRef.current?.focus(); }
            else if (servicesOpen) { setServicesOpen(false); triggerRef.current?.focus(); }
        };
        document.addEventListener('pointerdown', outside);
        document.addEventListener('keydown', escape);
        return () => { document.removeEventListener('pointerdown', outside); document.removeEventListener('keydown', escape); };
    }, [mobileOpen, servicesOpen]);
    useEffect(() => {
        if (!mobileOpen) return;
        const previous = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        mobilePanelRef.current?.querySelector<HTMLElement>('a, button')?.focus();
        const trap = (event: KeyboardEvent) => {
            if (event.key !== 'Tab') return;
            const focusables = mobilePanelRef.current?.querySelectorAll<HTMLElement>('a[href], button:not([disabled])');
            if (!focusables?.length) return;
            const first = focusables[0];
            const last = focusables[focusables.length - 1];
            if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
            else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
        };
        document.addEventListener('keydown', trap);
        return () => { document.body.style.overflow = previous; document.removeEventListener('keydown', trap); };
    }, [mobileOpen]);

    const close = () => { setServicesOpen(false); setMobileOpen(false); setMobileServicesOpen(false); };
    const homeHref = (hash: string) => pathname === '/' ? hash : `/${hash}`;
    const serviceHref = (slug: string) => lang !== 'id' && hasServicePage(lang, slug) ? `/${lang}/services/${slug}` : `/services/${slug}`;
    const serviceName = (slug: string) => {
        const service = serviceData.find(item => item.slug === slug);
        return service ? (lang === 'zh' ? service.titleZh : lang === 'en' ? service.titleEn : service.title) : slug;
    };
    const navigation = [
        { label: t('nav.home'), href: homeHref('#hero') },
        { label: t('nav.pricing'), href: homeHref('#pricing') },
        { label: t('nav.gallery'), href: '/gallery' },
        { label: t('nav.articles'), href: '/artikel' },
        { label: t('nav.contact'), href: homeHref('#contact') },
    ];
    const menuGroups = <>
        {groups.map(group => <div className="vnav-group" key={group.key}>
            <h3>{t(`nav.group.${group.key}`)}</h3>
            {group.slugs.map(slug => <Link key={slug} href={serviceHref(slug)} onClick={close}>{serviceName(slug)}<span aria-hidden="true">↗</span></Link>)}
        </div>)}
        <div className="vnav-group"><h3>{t('nav.group.products')}</h3>
            {products.map(key => <Link key={key} href={homeHref(`#service-${key}`)} onClick={close}>{t(`services.product.${key}.title`)}<span aria-hidden="true">↗</span></Link>)}
        </div>
    </>;

    return <nav id="navbar" ref={rootRef} className={`navbar vnav${scrolled || pathname !== '/' ? ' scrolled' : ''}`} aria-label={t('nav.main')} onPointerLeave={() => setServicesOpen(false)}>
        <div className="container vnav-bar">
            <Link href="/" className="vnav-brand" aria-label="VERALEX CONSULTING — Beranda" onClick={close}>
                <Image src="/logo.webp" alt="VERALEX CONSULTING" width={1024} height={724} sizes="(max-width: 375px) 62px, (max-width: 992px) 74px, (max-width: 1100px) 96px, 128px" priority />
            </Link>
            <div className="vnav-desktop">
                <Link href={navigation[0].href} onClick={close}>{navigation[0].label}</Link>
                <div className="vnav-services" onPointerEnter={event => { if (event.pointerType === 'mouse') setServicesOpen(true); }} onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget)) setServicesOpen(false); }}>
                    <button ref={triggerRef} type="button" aria-expanded={servicesOpen} aria-controls="vnav-mega" aria-haspopup="true" onClick={() => setServicesOpen(value => !value)}>{t('nav.services')} <span aria-hidden="true" className={servicesOpen ? 'vnav-chevron open' : 'vnav-chevron'}>⌄</span></button>
                    {servicesOpen && <div id="vnav-mega" className="vnav-mega" aria-label={t('nav.services')}>
                        <div className="vnav-mega-head"><div><span>{t('nav.explore')}</span><strong>{t('nav.megaTitle')}</strong></div><Link href={homeHref('#services')} onClick={close}>{t('nav.allServices')} <span aria-hidden="true">→</span></Link></div>
                        <div className="vnav-mega-grid">{menuGroups}</div>
                    </div>}
                </div>
                {navigation.slice(1).map(item => <Link key={item.href} href={item.href} onClick={close}>{item.label}</Link>)}
            </div>
            <div className="vnav-actions"><Link className="vnav-track" href="/portal/login" onClick={close}>{t('nav.track')} <span aria-hidden="true">↗</span></Link><div className="vnav-language"><LanguageToggle /></div></div>
            <button ref={mobileTriggerRef} className="vnav-toggle" type="button" aria-label={mobileOpen ? t('nav.close') : t('nav.open')} aria-controls="vnav-mobile" aria-expanded={mobileOpen} onClick={() => { setMobileOpen(value => !value); setServicesOpen(false); }}><span/><span/><span/></button>
        </div>
        {mobileOpen && <div id="vnav-mobile" ref={mobilePanelRef} className="vnav-mobile"><div className="vnav-mobile-inner">
            <Link href={navigation[0].href} onClick={close}>{navigation[0].label}</Link>
            <button type="button" className="vnav-mobile-accordion" aria-controls="vnav-mobile-services" aria-expanded={mobileServicesOpen} onClick={() => setMobileServicesOpen(value => !value)}>{t('nav.services')} <span aria-hidden="true">{mobileServicesOpen ? '−' : '+'}</span></button>
            {mobileServicesOpen && <div id="vnav-mobile-services" className="vnav-mobile-groups">{menuGroups}<Link className="vnav-mobile-all" href={homeHref('#services')} onClick={close}>{t('nav.allServices')} →</Link></div>}
            {navigation.slice(1).map(item => <Link key={item.href} href={item.href} onClick={close}>{item.label}</Link>)}
            <Link className="vnav-track vnav-mobile-track" href="/portal/login" onClick={close}>{t('nav.track')} <span aria-hidden="true">↗</span></Link>
            <div className="vnav-mobile-language"><span>{t('nav.language')}</span><LanguageToggle /></div>
        </div></div>}
    </nav>;
}
