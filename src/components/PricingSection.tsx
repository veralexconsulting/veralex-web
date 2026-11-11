'use client';

import { useLang } from '@/lib/useLang';
import { whatsappHref } from '@/lib/marketing';
import { packages as pricePackages, formatRupiah } from '@/data/pricing';
import './PricingSection.css';

const CHECK = 'M4.5 12.5l4.5 4.5L19.5 6.5';
const SPARK = 'M12 3v3m0 12v3M3 12h3m12 0h3M5.6 5.6l2.1 2.1m8.6 8.6l2.1 2.1M18.4 5.6l-2.1 2.1M7.7 16.3l-2.1 2.1';
const PLUS = 'M12 5v14M5 12h14';

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

export default function PricingSection() {
    const { t } = useLang();

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

                <div className="pricing-grid">
                    {packages.map((pkg) => {
                        const { head, tail } = splitPrice(pkg.price);

                        return (
                            <article
                                key={pkg.key}
                                className={`pricing-card fade-in${pkg.featured ? ' featured' : ''}`}
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
