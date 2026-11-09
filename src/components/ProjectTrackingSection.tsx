'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useLang } from '@/lib/useLang';
import { whatsappHref } from '@/lib/marketing';
import './ProjectTracking.css';

/*
 * Icons are drawn as SVG rather than glyphs.
 *
 * The previous version used "✓", "↗" and "◈" straight from the font, which
 * render at different weights in every browser and fall back to tofu on some
 * Android devices. These inherit currentColor and share one 24px grid.
 */
const ICONS = {
    steps: 'M4 6h10M4 12h16M4 18h10',
    update: 'M4 12a8 8 0 0114-5.3M20 12a8 8 0 01-14 5.3M18 3v4h-4M6 21v-4h4',
    lock: 'M12 15v2m-6 3h12a1 1 0 001-1v-7a1 1 0 00-1-1H6a1 1 0 00-1 1v7a1 1 0 001 1zM8.5 7.5a3.5 3.5 0 117 0v3h-7v-3z',
    check: 'M5 12.5l4.2 4.2L19 7',
    arrowRight: 'M5 12h13m0 0l-6-6m6 6l-6 6',
} as const;

const Icon = ({ d, size = 20 }: { d: string; size?: number }) => (
    <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.6}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        focusable="false"
    >
        <path d={d} />
    </svg>
);

/* One icon per feature line, in the same order as the translated keys. */
const FEATURE_ICONS = [ICONS.steps, ICONS.update, ICONS.lock];

/* Step 3 of 4 is the current milestone: 2 done, one in flight, one upcoming. */
const CURRENT_STEP = 3;
const TOTAL_STEPS = 4;
const STEPS = [1, 2, 3, 4] as const;

export default function ProjectTrackingSection() {
    const { t } = useLang();
    const progress = `${Math.round(((CURRENT_STEP - 1) / TOTAL_STEPS) * 100)}%`;

    return (
        <section id="project-tracking" className="tracking-feature" aria-labelledby="tracking-title">
            <div className="container tracking-layout">
                <div className="tracking-copy">
                    <p className="tracking-eyebrow">{t('tracking.eyebrow')}</p>
                    <h2 id="tracking-title" className="tracking-title">{t('tracking.title')}</h2>
                    <p className="tracking-description">{t('tracking.description')}</p>

                    <ul className="tracking-benefits">
                        {[1, 2, 3].map((number, index) => (
                            <li className="tracking-benefit" key={number}>
                                <span className="tracking-benefit-icon" aria-hidden="true">
                                    <Icon d={FEATURE_ICONS[index]} size={18} />
                                </span>
                                <div>
                                    <h3>{t(`tracking.feature${number}.title`)}</h3>
                                    <p>{t(`tracking.feature${number}.text`)}</p>
                                </div>
                            </li>
                        ))}
                    </ul>

                    <div className="tracking-actions">
                        <Link href="/portal/login" className="tracking-primary">
                            {t('tracking.primary')}
                            <Icon d={ICONS.arrowRight} size={17} />
                        </Link>
                        <a
                            href={whatsappHref(t('wa.message.general'))}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="tracking-secondary"
                            data-cta-location="project-tracking"
                        >
                            {t('tracking.secondary')}
                            <Icon d={ICONS.arrowRight} size={17} />
                        </a>
                    </div>
                </div>

                <div className="tracking-visual" aria-label={t('tracking.preview.label')} role="img">
                    <div className="tracking-preview">
                        <div className="tracking-preview-top">
                            <Image
                                src="/logo.webp"
                                alt=""
                                width={1024}
                                height={724}
                                className="tracking-preview-logo"
                                aria-hidden="true"
                            />
                            <span className="tracking-preview-divider" aria-hidden="true" />
                            <span className="tracking-preview-top-label">{t('tracking.preview.label')}</span>
                            <span className="tracking-preview-dots" aria-hidden="true">•••</span>
                        </div>

                        <div className="tracking-preview-content">
                            <div className="tracking-preview-heading">
                                <div>
                                    <span className="tracking-preview-overline">VERALEX / TRACKING</span>
                                    <h3>{t('services.ip.trademark.title')}</h3>
                                </div>
                                <span className="tracking-preview-status">
                                    <span aria-hidden="true" /> {t('tracking.preview.status')}
                                </span>
                            </div>

                            <div className="tracking-current">
                                <span>{t('tracking.preview.current')}</span>
                                <strong>{t('tracking.preview.stage')}</strong>
                                <div
                                    className="tracking-progress"
                                    role="progressbar"
                                    aria-valuemin={0}
                                    aria-valuemax={TOTAL_STEPS}
                                    aria-valuenow={CURRENT_STEP - 1}
                                    aria-valuetext={`${CURRENT_STEP - 1} / ${TOTAL_STEPS}`}
                                >
                                    <span style={{ width: progress }} />
                                </div>
                                <small>{`0${CURRENT_STEP - 1} / 0${TOTAL_STEPS}`}</small>
                            </div>

                            <ol className="tracking-preview-steps">
                                {STEPS.map((number) => {
                                    const state = number < CURRENT_STEP ? 'done' : number === CURRENT_STEP ? 'current' : 'upcoming';
                                    return (
                                        <li key={number} className={state}>
                                            <span className="tracking-step-icon" aria-hidden="true">
                                                {state === 'done' ? <Icon d={ICONS.check} size={15} /> : `0${number}`}
                                            </span>
                                            <div>
                                                <strong>{t(`tracking.preview.step${number}`)}</strong>
                                                <small>
                                                    {state === 'done'
                                                        ? t('tracking.preview.completed')
                                                        : state === 'current'
                                                            ? t('tracking.preview.current')
                                                            : t('tracking.preview.upcoming')}
                                                </small>
                                            </div>
                                        </li>
                                    );
                                })}
                            </ol>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
