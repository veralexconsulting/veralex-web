'use client';

import { useId, useState } from 'react';
import { useLang } from '@/lib/useLang';
import { whatsappHref } from '@/lib/marketing';
import { packages as pricePackages, formatRupiah } from '@/data/pricing';
import './PricingSection.css';

const CHECK = 'M4.5 12.5l4.5 4.5L19.5 6.5';
const SPARK = 'M12 3v3m0 12v3M3 12h3m12 0h3M5.6 5.6l2.1 2.1m8.6 8.6l2.1 2.1M18.4 5.6l-2.1 2.1M7.7 16.3l-2.1 2.1';
const PLUS = 'M12 5v14M5 12h14';
const CHEVRON = 'M6 9l6 6 6-6';

const Icon = ({ d, size = 16, strokeWidth = 2 }: { d: string; size?: number; strokeWidth?: number }) => (
    <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        focusable="false"
    >
        <path d={d} />
    </svg>
);

/* Splits a formatted price into its leading millions and the ".000.000"
 * remainder, so the headline digit-group stays calm. */
const splitPrice = (price: string) => {
    const digits = price.replace(/\D/g, '');
    if (digits.length < 7) return { head: price, tail: '' };
    // Split after the millions so "13.000.000" reads as 13 + .000.000
    const millions = digits.slice(0, digits.length - 6);
    const rest = digits.slice(digits.length - 6).replace(/(\d{3})(\d{3})/, '.$1.$2');
    return { head: millions, tail: rest };
};

/*
 * Folds the inclusion list on phones only.
 *
 * It is a real `hidden` container rather than a CSS height trick: a collapsed
 * region that is still in the tab order or in the accessibility tree is worse
 * than no collapse at all. The state lives in React, so the transition is
 * skipped (see the CSS) — an animated `hidden` cannot be done without a
 * measuring library, and the scroll cost of animating here is not worth it.
 * From 768px up the CSS shows the contents and hides the toggle, so desktop
 * never loses information.
 */
function MobileFold({
    count,
    label,
    openLabel,
    children,
}: {
    count: number;
    label: string;
    openLabel: string;
    children: React.ReactNode;
}) {
    const [open, setOpen] = useState(false);
    const regionId = useId();

    return (
        <div className={`pricing-fold${open ? ' is-open' : ''}`}>
            <button
                type="button"
                className="pricing-fold-toggle"
                aria-expanded={open}
                aria-controls={regionId}
                onClick={() => setOpen((value) => !value)}
            >
                <span>{open ? openLabel : `${label} (${count})`}</span>
                <svg
                    width={16}
                    height={16}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                    focusable="false"
                >
                    <path d={CHEVRON} />
                </svg>
            </button>
            <div className="pricing-fold-region" id={regionId} hidden={!open}>
                {children}
            </div>
        </div>
    );
}

export default function PricingSection() {
    const { t } = useLang();
    const baseId = useId();
    /*
     * Which package is open. The first render always starts on the featured
     * package, which is also the one the desktop grid emphasises — so the
     * mobile panel and the desktop grid agree on the recommended choice.
     * It is only ever used below 768px (the tab bar and the panel are hidden
     * above that, and the tabs are not focusable there), so a phone visitor
     * opening the page on desktop width is never affected.
     */
    const [activeKey, setActiveKey] = useState<string>('investor');

    /*
     * Prices come from src/data/pricing.ts, never typed here. The package copy
     * (names, summaries, feature labels) is translation keys and stays local;
     * only the money is centralised so the homepage and WhatsApp message can
     * never disagree. Struck-through "was" prices were removed on Pasha's
     * decision — there was no genuine prior price — so only the single current
     * price renders. Package inclusions are still TODO(Pasha).
     */
    const priceById = Object.fromEntries(pricePackages.map((p) => [p.id, p]));
    const packages = [
        {
            key: 'starter',
            name: t('pricing.starter'),
            price: formatRupiah(priceById.starter.price),
            summary: t('pricing.starter.summary'),
            features: [
                t('services.company.pt.title'),
                t('services.ip.trademark.title'),
                t('pricing.feature.website'),
                t('pricing.feature.nib'),
                t('pricing.feature.consult'),
            ],
            featured: false,
        },
        {
            key: 'investor',
            name: t('pricing.investor'),
            price: formatRupiah(priceById.investor.price),
            summary: t('pricing.investor.summary'),
            badge: t('pricing.bestValue'),
            features: [
                t('services.company.pma.title'),
                '1x ' + t('services.itas.investor2.title'),
                t('services.ip.trademark.title'),
                t('pricing.feature.website'),
                t('pricing.feature.nib'),
                t('pricing.feature.consult'),
            ],
            featured: true,
        },
        {
            key: 'premium',
            name: t('pricing.premium'),
            price: formatRupiah(priceById.premium.price),
            summary: t('pricing.premium.summary'),
            features: [
                t('services.company.pma.title'),
                '2x ' + t('services.itas.investor2.title'),
                t('services.ip.trademark.title'),
                t('pricing.feature.website'),
                t('pricing.feature.nib'),
                t('pricing.feature.consult'),
                t('pricing.feature.priority'),
            ],
            featured: false,
        },
    ];

    return (
        <section className="pricing" id="pricing">
            <div className="container">
                <header className="pricing-head">
                    <p className="pricing-eyebrow">{t('pricing.eyebrow')}</p>
                    <h2 className="section-title fade-in">{t('pricing.title')}</h2>
                    <p className="section-subtitle fade-in">{t('pricing.subtitle')}</p>
                </header>

                {/*
                 * Mobile package switcher.
                 *
                 * Three full cards stacked on a phone meant ~2,100px of scroll
                 * and three competing CTAs; the price the visitor actually
                 * wanted to compare was always one screen away. On phones the
                 * cards become one panel with a tab row (WAI-ARIA tabs: arrows
                 * move, Home/End jump, only the selected tab is in the tab
                 * order) so the three prices sit side by side and the body
                 * below stays in one place while you compare.
                 *
                 * Hidden at >=768px, where the three-column grid takes over and
                 * all three cards are visible at once.
                 */}
                <div className="pricing-switcher fade-in" role="tablist" aria-label={t('pricing.title')}>
                    {packages.map((pkg) => {
                        const selected = pkg.key === activeKey;
                        return (
                            <button
                                key={pkg.key}
                                type="button"
                                role="tab"
                                id={`${baseId}-tab-${pkg.key}`}
                                aria-selected={selected}
                                aria-controls={`${baseId}-panel`}
                                tabIndex={selected ? 0 : -1}
                                className={`pricing-tab${selected ? ' is-active' : ''}`}
                                onClick={() => setActiveKey(pkg.key)}
                                onKeyDown={(event) => {
                                    const keys = packages.map((p) => p.key);
                                    const index = keys.indexOf(pkg.key);
                                    let next = -1;
                                    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') next = (index + 1) % keys.length;
                                    else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') next = (index - 1 + keys.length) % keys.length;
                                    else if (event.key === 'Home') next = 0;
                                    else if (event.key === 'End') next = keys.length - 1;
                                    if (next < 0) return;
                                    event.preventDefault();
                                    setActiveKey(keys[next]);
                                    document.getElementById(`${baseId}-tab-${keys[next]}`)?.focus();
                                }}
                            >
                                <span className="pricing-tab-name">
                                    {pkg.name}
                                    {pkg.badge && <span className="pricing-tab-badge">{pkg.badge}</span>}
                                </span>
                                <span className="pricing-tab-price">{pkg.price}</span>
                            </button>
                        );
                    })}
                </div>

                <div className="pricing-grid" id={`${baseId}-panel`} role="tabpanel">
                    {packages.map((pkg) => {
                        const { head, tail } = splitPrice(pkg.price);

                        return (
                            <article
                                key={pkg.key}
                                data-package={pkg.key}
                                className={`pricing-card fade-in${pkg.featured ? ' featured' : ''}${pkg.key === activeKey ? ' is-active' : ''}`}
                            >
                                {pkg.badge && (
                                    <span className="pricing-badge">
                                        <Icon d={SPARK} size={13} strokeWidth={1.8} />
                                        {pkg.badge}
                                    </span>
                                )}

                                <div className="pricing-card-head">
                                    <h3 className="pricing-name">{pkg.name}</h3>
                                    <p className="pricing-summary">{pkg.summary}</p>
                                </div>

                                <div className="pricing-figure">
                                    <p className="pricing-price">
                                        <span className="pricing-price-currency">Rp</span>
                                        <span className="pricing-price-head">{head}</span>
                                        <span className="pricing-price-tail">{tail}</span>
                                    </p>
                                </div>

                                <div className="pricing-divider" aria-hidden="true" />

                                {/*
                                 * On phones the inclusion list folds behind a
                                 * button so the price and the CTA fit in one
                                 * thumb-reachable screen. `hidden` (not CSS
                                 * display) keeps it out of the a11y tree while
                                 * closed and is removed at >=768px where every
                                 * card is expanded.
                                 */}
                                <MobileFold
                                    count={pkg.features.length}
                                    label={t('pricing.mobile.fold')}
                                    openLabel={t('pricing.mobile.unfold')}
                                >
                                    <ul className="pricing-features">
                                        {pkg.features.map((f) => (
                                            <li className="pricing-feature" key={f}>
                                                <span className="pricing-feature-mark" aria-hidden="true">
                                                    <Icon d={CHECK} size={12} strokeWidth={2.6} />
                                                </span>
                                                <span>{f}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </MobileFold>

                                <div className="pricing-card-foot">
                                    <a
                                        href={whatsappHref(`${t('wa.message.package')} ${pkg.name} (${pkg.price}).`)}
                                        data-cta-location="package_card"
                                        data-service="package"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={`pricing-cta${pkg.featured ? ' is-primary' : ''}`}
                                    >
                                        {t('pricing.cta')}
                                    </a>
                                    <p className="pricing-note">
                                        <Icon d={CHECK} size={12} strokeWidth={2.2} />
                                        {t('pricing.noHiddenFees')}
                                    </p>
                                </div>
                            </article>
                        );
                    })}
                </div>

                <div className="pricing-custom fade-in">
                    <div className="pricing-custom-text">
                        <p className="pricing-custom-title">{t('pricing.custom.question')}</p>
                        <p className="pricing-custom-desc">{t('pricing.custom.desc')}</p>
                    </div>
                    <a
                        href={whatsappHref(t('wa.message.custom'))}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="pricing-custom-cta"
                    >
                        <Icon d={PLUS} size={16} strokeWidth={2} />
                        {t('pricing.custom.cta')}
                    </a>
                </div>
            </div>
        </section>
    );
}
