'use client';

import { useLang } from '@/lib/useLang';

export const UrgencyCTA = () => {
    const { t } = useLang();
    return (
        <section className="cta-section">
            <div className="container">
                <div className="cta-content fade-in">
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--color-gold)" strokeWidth="2"><path d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                        <span style={{ color: 'var(--color-gold)', fontWeight: 700, fontSize: '0.9rem', letterSpacing: '0.05em' }}>{t('urgency.tag')}</span>
                    </div>
                    <h2 className="cta-title">{t('urgency.title')}</h2>
                    <p className="cta-subtitle">{t('urgency.subtitle')}</p>
                    <a href="https://wa.me/6281219476385?text=Halo%20VERALEX,%20saya%20ingin%20tahu%20promo%20bulan%20ini" target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-lg">
                        {t('urgency.cta')}
                    </a>
                    <p style={{ marginTop: '1rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                        {t('urgency.note')}
                    </p>
                </div>
            </div>
        </section>
    );
};

export default UrgencyCTA;
