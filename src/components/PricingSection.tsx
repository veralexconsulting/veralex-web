'use client';

import { useLang } from '@/lib/useLang';
import { whatsappHref } from '@/lib/marketing';
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

/* "Rp13.000.000" -> "13" unit, "000.000" remainder. Keeps the headline digit-group calm. */
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

    const packages = [
        {
            key: 'starter',
            name: t('pricing.starter'),
            price: 'Rp13.000.000',
            originalPrice: 'Rp16.000.000',
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
            price: 'Rp36.000.000',
            originalPrice: 'Rp41.000.000',
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
            price: 'Rp49.000.000',
            originalPrice: 'Rp59.000.000',
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
                        const orig = parseInt(pkg.originalPrice.replace(/\D/g, ''), 10);
                        const curr = parseInt(pkg.price.replace(/\D/g, ''), 10);
                        const juta = ((orig - curr) / 1000000).toFixed(1).replace(/\.0$/, '');
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
                                    <p className="pricing-original">
                                        <span className="pricing-original-label">{t('pricing.regularPrice')}</span>
                                        <s>{pkg.originalPrice}</s>
                                    </p>
                                    <p className="pricing-price">
                                        <span className="pricing-price-currency">Rp</span>
                                        <span className="pricing-price-head">{head}</span>
                                        <span className="pricing-price-tail">{tail}</span>
                                    </p>
                                    <p className="pricing-save">
                                        <Icon d={CHECK} size={13} strokeWidth={2.4} />
                                        {t('pricing.save')} Rp{juta}jt
                                        <span className="pricing-save-sep" aria-hidden="true">·</span>
                                        {t('pricing.vsSeparate')}
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
