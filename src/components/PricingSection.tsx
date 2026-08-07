'use client';

import { useLang } from '@/lib/useLang';

const CHECK = 'M5 13l4 4L19 7';
const FIRE = 'M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z';

export default function PricingSection() {
    const { t } = useLang();

    const packages = [
        {
            name: t('pricing.starter'),
            price: 'Rp9.900.000',
            originalPrice: 'Rp12.500.000',
            features: [t('services.company.pt.title'), t('services.ip.trademark.title'), t('services.bonus'), t('pricing.feature.nib'), t('pricing.feature.consult')],
            featured: false,
            wa: 'Halo%20VERALEX,%20saya%20tertarik%20Paket%20Starter%20Business',
        },
        {
            name: t('pricing.investor'),
            price: 'Rp26.000.000',
            originalPrice: 'Rp33.000.000',
            badge: true,
            features: [t('services.company.pma.title'), '1x ' + t('services.itas.investor1.title'), t('services.ip.trademark.title'), t('services.bonus'), t('pricing.feature.nib'), t('pricing.feature.consult')],
            featured: true,
            wa: 'Halo%20VERALEX,%20saya%20tertarik%20Paket%20Investor%20Package',
        },
        {
            name: t('pricing.premium'),
            price: 'Rp42.500.000',
            originalPrice: 'Rp55.000.000',
            features: [t('services.company.pma.title'), '2x ' + t('services.itas.investor1.title'), t('services.ip.trademark.title'), t('services.bonus'), t('pricing.feature.nib'), t('pricing.feature.priority')],
            featured: false,
            wa: 'Halo%20VERALEX,%20saya%20tertarik%20Paket%20Premium%20Investor',
        },
    ];

    return (
        <section className="pricing" id="pricing">
            <div className="container">
                <h2 className="section-title fade-in">{t('pricing.title')}</h2>
                <p className="section-subtitle fade-in">{t('pricing.subtitle')}</p>

                <div className="pricing-grid">
                    {packages.map((pkg) => (
                        <div key={pkg.name} className={`pricing-card fade-in${pkg.featured ? ' featured' : ''}`}>
                            {pkg.badge && (
                                <span className="pricing-badge" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d={FIRE} /></svg>
                                    {t('pricing.bestValue')}
                                </span>
                            )}
                            <h3 className="pricing-name">{pkg.name}</h3>
                            {pkg.originalPrice && (
                                <p style={{ color: 'var(--text-muted)', textDecoration: 'line-through', fontSize: '1rem', marginBottom: '0.25rem' }}>
                                    {pkg.originalPrice}
                                </p>
                            )}
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '0.15rem' }}>{t('price.startFrom')}</p>
                            <p className="pricing-price">{pkg.price}</p>
                            {pkg.originalPrice && (
                                <span style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '0.35rem',
                                    background: 'rgba(74, 14, 14, 0.08)',
                                    border: '1px solid rgba(74, 14, 14, 0.2)',
                                    borderRadius: 'var(--radius-xl)',
                                    padding: '4px 14px',
                                    fontSize: '0.8rem',
                                    color: 'var(--color-gold-light)',
                                    fontWeight: 600,
                                    marginBottom: '1rem',
                                }}>
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                    {t('pricing.save')} {(() => {
                                        const orig = parseInt(pkg.originalPrice.replace(/\D/g, ''));
                                        const curr = parseInt(pkg.price.replace(/\D/g, ''));
                                        return `Rp${((orig - curr) / 1000000).toFixed(1)}jt`;
                                    })()}
                                </span>
                            )}
                            <div className="pricing-features">
                                {pkg.features.map((f) => (
                                    <div key={f} className="pricing-feature" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-gold)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}><path d={CHECK} /></svg>
                                        {f}
                                    </div>
                                ))}
                            </div>
                            <a
                                href={`https://wa.me/6281219476385?text=${pkg.wa}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`btn ${pkg.featured ? 'btn-primary' : 'btn-outline'} pricing-cta`}
                            >
                                {t('pricing.cta')}
                            </a>
                            <p style={{ marginTop: '0.75rem', fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem' }}>
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--color-gold)" strokeWidth="2"><path d={CHECK} /></svg>
                                {t('pricing.noHiddenFees')}
                            </p>
                        </div>
                    ))}
                </div>

                {/* Custom quote CTA */}
                <div className="fade-in" style={{
                    textAlign: 'center',
                    marginTop: '3rem',
                    padding: '2rem',
                    background: 'var(--bg-card)',
                    borderRadius: 'var(--radius-lg)',
                    border: 'var(--border-gold)',
                }}>
                    <p style={{ fontSize: '1.05rem', marginBottom: '1rem', color: 'var(--text-secondary)' }}>
                        {t('pricing.custom.question')}
                    </p>
                    <a
                        href="https://wa.me/6281219476385?text=Halo%20VERALEX,%20saya%20butuh%20paket%20custom%20sesuai%20kebutuhan%20saya"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-primary"
                    >
                        {t('pricing.custom.cta')}
                    </a>
                </div>
            </div>
        </section>
    );
}
