'use client';

import Link from 'next/link';
import { useLang } from '@/lib/useLang';

/* SVG icon paths for service categories and tags */
const ICONS = {
    doc: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
    refresh: 'M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15',
    swap: 'M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4',
    shield: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z',
    layout: 'M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zm0 8a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zm12 0a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z',
    globe: 'M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
    building: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4',
    bank: 'M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z',
    world: 'M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9',
    briefcase: 'M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
    user: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zm-4 7a7 7 0 00-7 7h14a7 7 0 00-7-7z',
    sun: 'M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z',
    check: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
    flask: 'M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z',
    bolt: 'M13 10V3L4 14h7v7l9-11h-7z',
    wifi: 'M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0',
    info: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
};

const SvgIcon = ({ d, size = 24 }: { d: string; size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d={d} />
    </svg>
);

export default function ServicesSection() {
    const { t } = useLang();

    return (
        <section className="services" id="services">
            <div className="container">
                <h2 className="section-title fade-in">{t('services.title')}</h2>
                <p className="section-subtitle fade-in">{t('services.subtitle')}</p>

                {/* Kekayaan Intelektual */}
                <div className="services-category fade-in">
                    <h3 className="category-title-luxury">{t('services.ip.title')}</h3>
                    <div className="services-list-luxury">

                        <Link href="/services/pendaftaran-merek" className="service-row-luxury">
                            <div className="service-row-left">
                                <h4 className="service-row-title">{t('services.ip.trademark.title')}</h4>
                                <p className="service-row-desc">{t('services.ip.trademark.desc')}</p>
                            </div>
                            <div className="service-row-right">
                                <span className="service-row-price">Rp2.500.000</span>
                                <SvgIcon d={ICONS.bolt} size={20} />
                            </div>
                        </Link>

                        <Link href="/services/perpanjangan-merek" className="service-row-luxury">
                            <div className="service-row-left">
                                <h4 className="service-row-title">{t('services.ip.renewal.title')}</h4>
                                <p className="service-row-desc">{t('services.ip.renewal.desc')}</p>
                            </div>
                            <div className="service-row-right">
                                <span className="service-row-price">Rp6.000.000</span>
                                <SvgIcon d={ICONS.bolt} size={20} />
                            </div>
                        </Link>

                        <Link href="/services/pengalihan-merek" className="service-row-luxury">
                            <div className="service-row-left">
                                <h4 className="service-row-title">{t('services.ip.transfer.title')}</h4>
                                <p className="service-row-desc">{t('services.ip.transfer.desc')}</p>
                            </div>
                            <div className="service-row-right">
                                <span className="service-row-price">Rp3.000.000</span>
                                <SvgIcon d={ICONS.bolt} size={20} />
                            </div>
                        </Link>

                        <Link href="/services/hak-cipta" className="service-row-luxury">
                            <div className="service-row-left">
                                <h4 className="service-row-title">{t('services.ip.copyright.title')}</h4>
                                <p className="service-row-desc">{t('services.ip.copyright.desc')}</p>
                            </div>
                            <div className="service-row-right">
                                <span className="service-row-price">Rp2.500.000</span>
                                <SvgIcon d={ICONS.bolt} size={20} />
                            </div>
                        </Link>

                        <Link href="/services/desain-industri" className="service-row-luxury">
                            <div className="service-row-left">
                                <h4 className="service-row-title">{t('services.ip.design.title')}</h4>
                                <p className="service-row-desc">{t('services.ip.design.desc')}</p>
                            </div>
                            <div className="service-row-right">
                                <span className="service-row-price">Rp4.500.000</span>
                                <SvgIcon d={ICONS.bolt} size={20} />
                            </div>
                        </Link>

                    </div>
                </div>

                {/* Legalitas Perusahaan */}
                <div className="services-category fade-in" style={{ marginTop: '80px' }}>
                    <h3 className="category-title-luxury">{t('services.company.title')}</h3>
                    <div className="services-list-luxury">

                        <Link href="/services/pt-pmdn" className="service-row-luxury">
                            <div className="service-row-left">
                                <h4 className="service-row-title">{t('services.company.pt.title')}</h4>
                                <p className="service-row-desc">{t('services.company.pt.desc')}</p>
                            </div>
                            <div className="service-row-right">
                                <span className="service-row-price">Rp6.500.000</span>
                                <SvgIcon d={ICONS.bolt} size={20} />
                            </div>
                        </Link>

                        <Link href="/services/pendirian-cv" className="service-row-luxury">
                            <div className="service-row-left">
                                <h4 className="service-row-title">{t('services.company.cv.title')}</h4>
                                <p className="service-row-desc">{t('services.company.cv.desc')}</p>
                            </div>
                            <div className="service-row-right">
                                <span className="service-row-price">Rp3.000.000</span>
                                <SvgIcon d={ICONS.bolt} size={20} />
                            </div>
                        </Link>

                        <Link href="/services/pt-perorangan" className="service-row-luxury">
                            <div className="service-row-left">
                                <h4 className="service-row-title">{t('services.company.perorangan.title')}</h4>
                                <p className="service-row-desc">{t('services.company.perorangan.desc')}</p>
                            </div>
                            <div className="service-row-right">
                                <span className="service-row-price">Rp1.500.000</span>
                                <SvgIcon d={ICONS.bolt} size={20} />
                            </div>
                        </Link>

                        <Link href="/services/pt-pma" className="service-row-luxury">
                            <div className="service-row-left">
                                <h4 className="service-row-title">{t('services.company.pma.title')}</h4>
                                <p className="service-row-desc">{t('services.company.pma.desc')}</p>
                            </div>
                            <div className="service-row-right">
                                <span className="service-row-price">Rp9.900.000</span>
                                <SvgIcon d={ICONS.bolt} size={20} />
                            </div>
                        </Link>

                    </div>
                </div>

                {/* Benefit Pendirian PT */}
                <div className="services-category fade-in">
                    <h3 className="category-title">{t('services.benefit.title')}</h3>
                    <div className="benefit-grid">
                        {Array.from({ length: 11 }, (_, i) => (
                            <div key={i} className="benefit-card">
                                <div className="benefit-number">{i + 1}</div>
                                <span>{t(`benefit.${i + 1}`)}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Visa & ITAS */}
                <div className="services-category fade-in" style={{ marginTop: '80px' }}>
                    <h3 className="category-title-luxury">{t('services.itas.title')}</h3>
                    <div className="services-list-luxury">
                        {[
                            { title: t('services.itas.investor1.title'), desc: t('services.itas.investor1.desc'), price: 'Rp16.000.000', slug: 'itas-investor-1-tahun' },
                            { title: t('services.itas.investor2.title'), desc: t('services.itas.investor2.desc'), price: 'Rp18.000.000', slug: 'itas-investor-2-tahun' },
                            { title: t('services.itas.visac2.title'), desc: t('services.itas.visac2.desc'), price: 'Rp3.500.000', slug: 'visa-c2' },
                            { title: t('services.itas.visad2.1.title'), desc: t('services.itas.visad2.1.desc'), price: 'Rp6.000.000', slug: 'visa-d2-1-tahun' },
                            { title: t('services.itas.visad2.2.title'), desc: t('services.itas.visad2.2.desc'), price: 'Rp9.500.000', slug: 'visa-d2-2-tahun' },
                            { title: t('services.itas.kitas.title'), desc: t('services.itas.kitas.desc'), price: 'Rp45.000.000', slug: 'kitas-kerja' },
                        ].map((item) => (
                            <Link key={item.slug} href={`/services/${item.slug}`} className="service-row-luxury">
                                <div className="service-row-left">
                                    <h4 className="service-row-title">{item.title}</h4>
                                    <p className="service-row-desc">{item.desc}</p>
                                </div>
                                <div className="service-row-right">
                                    <span className="service-row-price">{item.price}</span>
                                    <SvgIcon d={ICONS.bolt} size={20} />
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Legalitas Produk */}
                <div className="services-category fade-in">
                    <h3 className="category-title">{t('services.product.title')}</h3>
                    <div className="product-grid">
                        {[
                            { key: 'halal', icon: ICONS.sun },
                            { key: 'sni', icon: ICONS.check },
                            { key: 'bpom', icon: ICONS.flask },
                            { key: 'k3l', icon: ICONS.bolt },
                            { key: 'postel', icon: ICONS.wifi },
                        ].map((item) => (
                            <div key={item.key} className="product-card">
                                <div className="product-icon"><SvgIcon d={item.icon} /></div>
                                <h4 className="product-title">{t(`services.product.${item.key}.title`)}</h4>
                                <p className="product-desc">{t(`services.product.${item.key}.desc`)}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
