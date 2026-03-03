'use client';

import { useLang } from '@/lib/useLang';

export default function WhyLegalSection() {
    const { t } = useLang();

    return (
        <section className="why-legal" id="why-legal">
            <div className="container">
                <div className="why-legal-content">
                    <div className="why-legal-text slide-in-left">
                        <h2>{t('whyLegal.title')}</h2>
                        <p>{t('whyLegal.p1')}</p>
                        <p>{t('whyLegal.p2')}</p>
                        <p>{t('whyLegal.p3')}</p>
                    </div>
                    <div className="why-legal-list slide-in-right">
                        {['l1', 'l2', 'l3', 'l4', 'l5'].map((key) => (
                            <div key={key} className="why-legal-item">{t(`whyLegal.${key}`)}</div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
