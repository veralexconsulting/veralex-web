'use client';

/* eslint-disable @next/next/no-img-element */
import Link from 'next/link';
import { useLang } from '@/lib/useLang';

const images = [
    'IMG-20261005-WA0012.jpg',
    'IMG-20261005-WA0013.jpg',
    'IMG-20261005-WA0015.jpg',
    'IMG-20260121-WA0030.jpg',
    'IMG-20260121-WA0031.jpg',
    'IMG-20260121-WA0032.jpg',
    'IMG-20260121-WA0033.jpg',
    'IMG-20260121-WA0006.jpg',
    'IMG-20260121-WA0008.jpg',
    'IMG-20260121-WA0013.jpg',
];

export default function GalleryHighlight() {
    const { t } = useLang();
    const slides = [...images, ...images.slice(0, 4)]; // duplicate for infinite scroll

    return (
        <section className="client-gallery" id="gallery-highlight">
            <div className="container">
                <h2 className="section-title fade-in">{t('gallery.title')}</h2>
                <p className="section-subtitle fade-in">{t('gallery.subtitle')}</p>

                <div className="gallery-carousel">
                    <div className="gallery-track">
                        {slides.map((img, i) => (
                            <div key={i} className="gallery-slide">
                                <img src={`/gallery/${img}`} alt={t('gallery.imgAlt')} loading="lazy" />
                            </div>
                        ))}
                    </div>
                </div>

                <div className="gallery-cta-wrapper">
                    <Link href="/gallery" className="btn btn-outline">{t('gallery.cta')}</Link>
                </div>
            </div>
        </section>
    );
}
