'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useLang } from '@/lib/useLang';
import type { Lang } from '@/lib/translations';
import styles from './about.module.css';

type JourneyPoint = { id: string; year: number; lon: number; lat: number; names: Record<Lang, string> };
// WGS84 coordinates. Lampung uses an illustrative point within Lampung province.
// Jakarta and Bekasi share one milestone; the point lies between the two cities.
const points: JourneyPoint[] = [
  { id: 'bali', year: 2019, lon: 115.1889, lat: -8.4095, names: { en: 'Bali', id: 'Bali', zh: '巴厘岛' } },
  { id: 'jakarta-bekasi', year: 2022, lon: 106.9176, lat: -6.2219, names: { en: 'Jakarta & Bekasi', id: 'Jakarta & Bekasi', zh: '雅加达与勿加泗' } },
  { id: 'palembang', year: 2023, lon: 104.7754, lat: -2.9761, names: { en: 'Palembang', id: 'Palembang', zh: '巨港' } },
  { id: 'lampung', year: 2024, lon: 105.15, lat: -5.1, names: { en: 'Lampung', id: 'Lampung', zh: '楠榜' } },
  { id: 'purwokerto', year: 2025, lon: 109.239, lat: -7.424, names: { en: 'Purwokerto', id: 'Purwokerto', zh: '普禾加多' } },
  { id: 'medan', year: 2026, lon: 98.6722, lat: 3.5952, names: { en: 'Medan', id: 'Medan', zh: '棉兰' } },
];

const indonesiaPoint = (point: JourneyPoint) => ({ left: `${(point.lon - 92) / 30 * 100}%`, top: `${(7 - point.lat) / 18 * 100}%` });

export default function AboutPage() {
  const { t, lang } = useLang();
  const [active, setActive] = useState<string>('bali');
  const current = points.find(point => point.id === active);
  const detail = active === 'germany' ? t('about.germanyNote') : current ? `${current.names[lang]} — ${current.year}` : t('about.worldIndonesia');
  const activate = (id: string) => setActive(id);

  return <>
    <Navbar />
    <main className={styles.page}>
      <header className={styles.hero}>
        <div className={styles.wrap}>
          <p className={styles.eyebrow}>{t('about.eyebrow')}</p>
          <h1>{t('about.title')}</h1>
          <p>{t('about.intro')}</p>
        </div>
      </header>

      <section className={`${styles.journey} ${styles.wrap}`} aria-labelledby="journey-title">
        <div className={styles.sectionHeading}>
          <div><p className={styles.eyebrow}>2019 — 2026</p><h2 id="journey-title">{t('about.journey')}</h2></div>
          <p>{t('about.journeyText')}</p>
        </div>
        <div className={styles.mapCard}>
          <div className={styles.mapHeader}><span>{t('about.world')}</span><span>01 / 02</span></div>
          <div className={styles.worldMap}>
            <Image src="/maps/world-presence.svg" alt="" fill sizes="(max-width: 900px) 100vw, 1100px" priority />
            <button type="button" className={`${styles.worldMarker} ${styles.germanyMarker} ${active === 'germany' ? styles.active : ''}`} onMouseEnter={() => activate('germany')} onFocus={() => activate('germany')} onClick={() => activate('germany')} aria-label={t('about.worldGermany')} aria-pressed={active === 'germany'}><span aria-hidden="true" /></button>
            <button type="button" className={`${styles.worldMarker} ${styles.indonesiaMarker} ${active !== 'germany' ? styles.active : ''}`} onMouseEnter={() => activate('indonesia')} onFocus={() => activate('indonesia')} onClick={() => activate('indonesia')} aria-label={t('about.worldIndonesia')} aria-pressed={active === 'indonesia'}><span aria-hidden="true" /></button>
            <span className={`${styles.worldLabel} ${styles.germanyLabel}`}>{t('about.germany')}</span>
            <span className={`${styles.worldLabel} ${styles.indonesiaLabel}`}>Indonesia</span>
          </div>
          <div className={styles.mapBottom}>
            <div className={styles.inset}>
              <div className={styles.insetHeader}><span>{t('about.indonesia')}</span><span>02 / 02</span></div>
              <div className={styles.indonesiaMap}>
                <Image src="/maps/indonesia-journey.svg" alt="" fill sizes="(max-width: 900px) 100vw, 700px" />
                {points.map(point => <button key={point.id} type="button" style={indonesiaPoint(point)} className={`${styles.cityMarker} ${active === point.id ? styles.active : ''}`} onMouseEnter={() => activate(point.id)} onFocus={() => activate(point.id)} onClick={() => activate(point.id)} aria-label={`${point.names[lang]} — ${point.year}`} aria-pressed={active === point.id}><span aria-hidden="true" /></button>)}
              </div>
            </div>
            <div className={styles.mapDetail} aria-live="polite">
              <p className={styles.eyebrow}>VERALEX / {t('about.world')}</p>
              <strong>{detail}</strong>
              <p>{t('about.select')}</p>
              <div className={styles.legend}><i /> Indonesia <i /> {t('about.germany')}</div>
            </div>
          </div>
        </div>
        <div className={styles.timeline} aria-label={t('about.timeline')}>
          <h3>{t('about.timeline')}</h3>
          <ol>{points.map(point => <li key={point.id}><button type="button" onClick={() => activate(point.id)} onFocus={() => activate(point.id)} className={active === point.id ? styles.selected : ''} aria-pressed={active === point.id}><span>{point.year}</span><strong>{point.names[lang]}</strong></button></li>)}</ol>
        </div>
      </section>

      <section className={`${styles.supporting} ${styles.wrap}`} aria-label={t('about.vision')}>
        <div><span>01</span><h2>{t('about.vision')}</h2><p>{t('about.visionText')}</p></div>
        <div><span>02</span><h2>{t('about.services')}</h2><p>{t('about.servicesText')}</p><Link href="/#services">{t('about.servicesCta')} ↗</Link></div>
        <div><span>03</span><h2>{t('about.approach')}</h2><p>{t('about.approachText')}</p></div>
        <div><span>04</span><h2>{t('about.tracking')}</h2><p>{t('about.trackingText')}</p><Link href="/portal/login">{t('about.trackingCta')} ↗</Link></div>
      </section>
      <section className={styles.contact}><div className={styles.wrap}><p className={styles.eyebrow}>VERALEX CONSULTING</p><h2>{t('about.contact')}</h2><p>{t('about.contactText')}</p><Link href="/#contact">{t('about.contactCta')} ↗</Link></div></section>
    </main>
    <Footer />
  </>;
}
