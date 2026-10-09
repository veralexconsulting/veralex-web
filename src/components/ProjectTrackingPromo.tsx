'use client';

import Link from 'next/link';
import { useLang } from '@/lib/useLang';
import './ProjectTracking.css';

export default function ProjectTrackingPromo() {
    const { t } = useLang();
    return <aside className="tracking-promo" aria-labelledby="tracking-promo-title">
        <span className="tracking-promo-icon" aria-hidden="true">↗</span>
        <div><span className="tracking-promo-eyebrow">VERALEX PROJECT TRACKING</span><h2 id="tracking-promo-title">{t('tracking.promo.title')}</h2><p>{t('tracking.promo.text')}</p></div>
        <Link href="/#project-tracking">{t('tracking.promo.cta')} <span aria-hidden="true">→</span></Link>
    </aside>;
}
