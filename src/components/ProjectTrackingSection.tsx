'use client';

import Link from 'next/link';
import { useLang } from '@/lib/useLang';
import { whatsappHref } from '@/lib/marketing';
import './ProjectTracking.css';

export default function ProjectTrackingSection() {
    const { t } = useLang();
    const steps = [1, 2, 3, 4] as const;
    return <section id="project-tracking" className="tracking-feature" aria-labelledby="tracking-title">
        <div className="container tracking-layout">
            <div className="tracking-copy">
                <span className="tracking-eyebrow"><span aria-hidden="true"/> {t('tracking.eyebrow')}</span>
                <h2 id="tracking-title">{t('tracking.title')}</h2>
                <p className="tracking-description">{t('tracking.description')}</p>
                <div className="tracking-benefits">
                    {[1, 2, 3].map(number => <div className="tracking-benefit" key={number}>
                        <span className="tracking-benefit-icon" aria-hidden="true">{number === 1 ? '✓' : number === 2 ? '↗' : '◈'}</span>
                        <div><h3>{t(`tracking.feature${number}.title`)}</h3><p>{t(`tracking.feature${number}.text`)}</p></div>
                    </div>)}
                </div>
                <div className="tracking-actions">
                    <Link href="/portal/login" className="tracking-primary">{t('tracking.primary')} <span aria-hidden="true">→</span></Link>
                    <a href={whatsappHref(t('wa.message.general'))} target="_blank" rel="noopener noreferrer" className="tracking-secondary" data-cta-location="project-tracking">{t('tracking.secondary')} <span aria-hidden="true">→</span></a>
                </div>
            </div>
            <div className="tracking-visual" aria-label={t('tracking.preview.label')}>
                <div className="tracking-preview">
                    <div className="tracking-preview-top"><span className="tracking-preview-mark" aria-hidden="true">V</span><span>VERALEX <small>/ PROJECT TRACKING</small></span><span className="tracking-preview-dots" aria-hidden="true">•••</span></div>
                    <div className="tracking-preview-content">
                        <span className="tracking-preview-overline">{t('tracking.preview.label')}</span>
                        <div className="tracking-preview-heading"><div><small>VERALEX / TRACKING</small><h3>{t('services.ip.trademark.title')}</h3></div><span className="tracking-preview-status"><span aria-hidden="true"/> {t('tracking.preview.status')}</span></div>
                        <div className="tracking-current"><span>{t('tracking.preview.current')}</span><strong>{t('tracking.preview.stage')}</strong><div className="tracking-progress"><span/></div><small>02 / 04</small></div>
                        <ol className="tracking-preview-steps">{steps.map(number => <li key={number} className={number < 3 ? 'done' : number === 3 ? 'current' : ''}>
                            <span className="tracking-step-icon" aria-hidden="true">{number < 3 ? '✓' : number.toString().padStart(2, '0')}</span>
                            <div><strong>{t(`tracking.preview.step${number}`)}</strong><small>{number < 3 ? t('tracking.preview.completed') : number === 3 ? t('tracking.preview.current') : t('tracking.preview.upcoming')}</small></div>
                        </li>)}</ol>
                    </div>
                </div>
                <span className="tracking-visual-caption">{t('tracking.preview.label')}</span>
            </div>
        </div>
    </section>;
}
