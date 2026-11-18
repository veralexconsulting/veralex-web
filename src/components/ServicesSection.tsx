'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { useLang } from '@/lib/useLang';
import { getServiceBySlug } from '@/lib/serviceData';

const servicePrice = (slug: string) => getServiceBySlug(slug)!.price;
const trademark = getServiceBySlug('pendaftaran-merek')!;

const ICONS = {
    arrowRight: 'M9 5l7 7-7 7',
};

const SvgIcon = ({ d, size = 24, strokeWidth = 1.5 }: { d: string; size?: number; strokeWidth?: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
        <path d={d} />
    </svg>
);

/* One definition per row, shared by the desktop list and the phone accordion. */
type Row = {
    key: string;
    slug?: string;
    href?: string;
    title: string;
    desc?: string;
    note?: string;
    price?: string;
    priceLabel?: string;
    originalPrice?: string;
    badge?: string;
};

/*
 * Row → element.
 *
 * `compact` is the phone accordion: the one-line row renders *without* the
 * description (that is what made each of the 24 rows four lines tall). The
 * description stays in the desktop markup, which keeps the words on the page
 * for search engines and for the wide layout.
 */
function ServiceRow({ row, compact = false }: { row: Row; compact?: boolean }) {
    const inner = (
        <>
            <div className="service-row-left">
                <div className="service-row-head">
                    <h4 className="service-row-title">{row.title}</h4>
                    {row.badge && <span className="service-row-badge">{row.badge}</span>}
                </div>
                {row.desc && !compact && <p className="service-row-desc">{row.desc}</p>}
            </div>
            <div className="service-row-right">
                {row.price ? (
                    <span className="service-row-price">
                        {row.priceLabel && <span className="price-start-from">{row.priceLabel} </span>}
                        {row.originalPrice && <s className="service-row-was">{row.originalPrice}</s>}
                        {row.price}
                    </span>
                ) : (
                    <span className="service-row-price service-row-consult">{row.note}</span>
                )}
                <SvgIcon d={ICONS.arrowRight} size={18} strokeWidth={2} />
            </div>
        </>
    );

    if (!row.href) {
        return <div className="service-row-luxury" id={row.slug ? `service-${row.slug}` : undefined} style={{ cursor: 'default' }}>{inner}</div>;
    }
    return (
        <Link href={row.href} className="service-row-luxury" id={row.slug ? `service-${row.slug}` : undefined}>
            {inner}
        </Link>
    );
}

export default function ServicesSection() {
    const { t, lang } = useLang();
    const priceFrom = t('price.startFrom');

    /*
     * Phones only: which category is expanded.
     *
     * Before this, the five categories were one continuous list of 24 rows
     * (5,294px — 36% of the homepage on a 390px screen) with nothing to mark
     * where one ended and the next began. The first category starts open so the
     * section is never an empty wall of headings; opening another closes it, so
     * the section cannot grow back to its old height.
     *
     * From 768px up the CSS ignores this state entirely — every category is
     * open, and the toggle is not clickable.
     */
    const [openCategory, setOpenCategory] = useState<string | null>('ip');
    const panelRefs = useRef<Record<string, HTMLDivElement | null>>({});

    /*
     * A breadcrumb on a service page links to /#services-itas and friends. With
     * categories collapsed on a phone, that link would land on a closed header,
     * so the matching category is opened first. The browser has already done
     * its own jump by the time this effect runs, and opening a category changes
     * the heights above the target — so the scroll is corrected once the new
     * layout is painted, immediately (not smoothly: this is the landing, not a
     * navigation the visitor initiated).
     */
    useEffect(() => {
        const applyHash = () => {
            const match = /^#services-(.+)$/.exec(window.location.hash);
            if (!match) return false;
            const el = document.getElementById(`services-${match[1]}`);
            if (!el) return false;
            setOpenCategory(match[1]);
            window.requestAnimationFrame(() => {
                window.requestAnimationFrame(() => {
                    el.scrollIntoView({ block: 'start', behavior: 'auto' });
                });
            });
            return true;
        };
        applyHash();
        window.addEventListener('hashchange', applyHash);
        return () => window.removeEventListener('hashchange', applyHash);
    }, []);

    /* Keeps the heading the visitor just tapped/closed on screen instead of
     * dropping them into the content above it. */
    const toggleCategory = (key: string, currentlyOpen: boolean) => {
        setOpenCategory(currentlyOpen ? null : key);
        if (currentlyOpen) {
            const panel = panelRefs.current[key];
            window.requestAnimationFrame(() => panel?.scrollIntoView({ block: 'start', behavior: 'smooth' }));
        }
    };

    /* ── Category data ──
       Prices live in serviceData; copy lives in translations. Nothing here is
       typed money. */

    const ipRows: Row[] = [
        {
            key: 'trademark',
            slug: 'pendaftaran-merek',
            href: '/services/pendaftaran-merek',
            title: t('services.ip.trademark.title'),
            desc: t('services.ip.trademark.desc'),
            price: trademark.price,
            originalPrice: trademark.originalPrice ?? undefined,
            badge: trademark.discountBadge ?? undefined,
        },
        { key: 'renewal', slug: 'perpanjangan-merek', href: '/services/perpanjangan-merek', title: t('services.ip.renewal.title'), desc: t('services.ip.renewal.desc'), price: servicePrice('perpanjangan-merek') },
        { key: 'transfer', slug: 'pengalihan-merek', href: '/services/pengalihan-merek', title: t('services.ip.transfer.title'), desc: t('services.ip.transfer.desc'), price: servicePrice('pengalihan-merek') },
        { key: 'copyright', slug: 'hak-cipta', href: '/services/hak-cipta', title: t('services.ip.copyright.title'), desc: t('services.ip.copyright.desc'), price: servicePrice('hak-cipta') },
        { key: 'design', slug: 'desain-industri', href: '/services/desain-industri', title: t('services.ip.design.title'), desc: t('services.ip.design.desc'), price: servicePrice('desain-industri') },
    ];

    const companyRows: Row[] = [
        { key: 'pt', slug: 'pt-pmdn', href: '/services/pt-pmdn', title: t('services.company.pt.title'), desc: t('services.company.pt.desc'), price: servicePrice('pt-pmdn') },
        { key: 'pma', slug: 'pt-pma', href: '/services/pt-pma', title: t('services.company.pma.title'), desc: t('services.company.pma.desc'), price: servicePrice('pt-pma') },
        { key: 'perorangan', slug: 'pt-perorangan', href: '/services/pt-perorangan', title: t('services.company.perorangan.title'), desc: t('services.company.perorangan.desc'), price: servicePrice('pt-perorangan') },
        { key: 'cv', slug: 'pendirian-cv', href: '/services/pendirian-cv', title: t('services.company.cv.title'), desc: t('services.company.cv.desc'), price: servicePrice('pendirian-cv') },
    ];

    const itasRows: Row[] = [
        { key: 'investor1', title: t('services.itas.investor1.title'), desc: t('services.itas.investor1.desc'), href: '/services/itas-investor-1-tahun', price: servicePrice('itas-investor-1-tahun'), priceLabel: priceFrom },
        { key: 'investor2', title: t('services.itas.investor2.title'), desc: t('services.itas.investor2.desc'), href: '/services/itas-investor-2-tahun', price: servicePrice('itas-investor-2-tahun'), priceLabel: priceFrom },
        { key: 'family', title: t('services.itas.family.title'), desc: t('services.itas.family.desc'), href: '/services/itas-family', price: servicePrice('itas-family'), priceLabel: priceFrom },
        { key: 'visac2', title: t('services.itas.visac2.title'), desc: t('services.itas.visac2.desc'), href: '/services/visa-c2', price: servicePrice('visa-c2'), priceLabel: priceFrom },
        { key: 'visad21', title: t('services.itas.visad2.1.title'), desc: t('services.itas.visad2.1.desc'), href: '/services/visa-d2-1-tahun', price: servicePrice('visa-d2-1-tahun'), priceLabel: priceFrom },
        { key: 'visad22', title: t('services.itas.visad2.2.title'), desc: t('services.itas.visad2.2.desc'), href: '/services/visa-d2-2-tahun', price: servicePrice('visa-d2-2-tahun'), priceLabel: priceFrom },
        { key: 'kitas', title: t('services.itas.kitas.title'), desc: t('services.itas.kitas.desc'), href: '/services/kitas-kerja', price: servicePrice('kitas-kerja'), priceLabel: priceFrom },
    ];

    const productRows: Row[] = (['halal', 'sni', 'bpom', 'pirt', 'k3l', 'postel'] as const).map((key) => {
        const slugMap: Record<string, string | undefined> = {
            halal: undefined, sni: undefined, bpom: 'izin-bpom', pirt: 'pirt', k3l: 'sertifikasi-k3l', postel: 'sertifikasi-postel',
        };
        const slug = slugMap[key];
        const itemService = slug ? getServiceBySlug(slug) : undefined;
        const note = itemService?.priceNote?.[lang] || itemService?.priceNote?.en
            || itemService?.promotionNote?.[lang];
        return {
            key,
            slug,
            href: slug ? `/services/${slug}` : undefined,
            title: t(`services.product.${key}.title`),
            desc: t(`services.product.${key}.desc`),
            note: itemService ? note : undefined,
            price: itemService
                ? `${itemService.priceLabel === 'from' ? `${priceFrom} ` : `${t('price.serviceFee')}: `}${itemService.price}${itemService.priceUnit ? ` / ${itemService.priceUnit[lang]}` : ''}`
                : t('price.consult'),
        };
    });

    const pseRows: Row[] = (['lokal', 'asing'] as const).map((key) => {
        const slug = key === 'lokal' ? 'pse-lokal' : 'pse-asing';
        const itemService = getServiceBySlug(slug);
        return {
            key,
            slug: `pse-${key}`,
            href: `/services/${slug}`,
            title: t(`services.pse.${key}.title`),
            desc: t(`services.pse.${key}.desc`),
            note: itemService?.priceNote?.[lang] || itemService?.priceNote?.en,
            price: itemService?.price,
            priceLabel: t('price.serviceFee') + ':',
        };
    });

    /*
     * `anchor` keeps the ids that are already linked from service-page
     * breadcrumbs (src/lib/serviceBreadcrumbs.ts) and indexed by Google:
     * #services-ip, #services-company, #services-itas, #services-products,
     * #services-pse.
     */
    const categories = [
        { key: 'ip', anchor: 'ip', title: t('services.ip.title'), rows: ipRows },
        { key: 'company', anchor: 'company', title: t('services.company.title'), rows: companyRows },
        { key: 'itas', anchor: 'itas', title: t('services.itas.title'), rows: itasRows },
        { key: 'products', anchor: 'products', title: t('services.product.title'), rows: productRows },
        { key: 'pse', anchor: 'pse', title: t('services.pse.title'), rows: pseRows },
    ];

    return (
        <section className="services" id="services">
            <div className="container">
                <h2 className="section-title fade-in">{t('services.title')}</h2>
                <p className="section-subtitle fade-in">{t('services.subtitle')}</p>

                {categories.map((cat) => {
                    const open = openCategory === cat.key;
                    return (
                        <div
                            key={cat.key}
                            id={`services-${cat.anchor}`}
                            className={`services-category fade-in${open ? ' is-open' : ''}`}
                            ref={(node) => { panelRefs.current[cat.key] = node; }}
                        >
                            <h3 className="category-title-luxury">
                                <button
                                    type="button"
                                    className="category-toggle"
                                    aria-expanded={open}
                                    aria-controls={`services-${cat.anchor}-list`}
                                    onClick={() => toggleCategory(cat.key, open)}
                                >
                                    <span className="category-toggle-label">{cat.title}</span>
                                    <span className="category-toggle-count" aria-hidden="true">{cat.rows.length}</span>
                                    <span className="category-toggle-chevron" aria-hidden="true">
                                        <SvgIcon d="M6 9l6 6 6-6" size={18} strokeWidth={2} />
                                    </span>
                                </button>
                            </h3>

                            {/* Desktop: every category, every row, with descriptions. */}
                            <div className="services-list-luxury services-list-desktop" id={`services-${cat.anchor}-list`}>
                                {cat.rows.map((row) => <ServiceRow key={row.key} row={row} />)}
                            </div>

                            {/* Phone: only the open category, as compact rows. The
                                compact list is hidden by default (desktop) and shown
                                by the mobile media query when the category is open,
                                while the desktop list is hidden on phones — so exactly
                                one of the two lists is visible at any viewport. */}
                            {open && (
                                <div className="services-list-luxury services-list-compact">
                                    {cat.rows.map((row) => <ServiceRow key={row.key} row={row} compact />)}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </section>
    );
}
