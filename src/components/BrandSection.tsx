'use client';

import { useLang } from '@/lib/useLang';

export const BrandSection = () => {
    const t = useLang();
    return (
        <section className="big-brand-section">
            <div className="container">
                <div className="big-brand-text">VERALEX</div>
                <p className="big-brand-tagline">{t('brand.tagline')}</p>
                <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                    <a href="https://wa.me/6281219476385?text=Halo%20VERALEX,%20saya%20ingin%20konsultasi%20gratis" target="_blank" rel="noopener noreferrer" className="btn btn-primary">
                        {t('brand.consult')}
                    </a>
                    <a href="tel:+6281219476385" className="btn btn-outline">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                        {t('brand.call')}
                    </a>
                </div>
            </div>
        </section>
    );
};

export default BrandSection;
