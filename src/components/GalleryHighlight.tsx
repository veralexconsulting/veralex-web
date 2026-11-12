'use client';

import Image from 'next/image';
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
    // The second pass exists only to make the loop seamless; it is decoration
    // for assistive tech and must not be announced or counted twice.
    const slides = [...images, ...images];

    return (
        <section className="client-gallery" id="gallery-highlight">
            <div className="container">
                <h2 className="section-title fade-in">{t('gallery.title')}</h2>
                <p className="section-subtitle fade-in">{t('gallery.subtitle')}</p>

                <div className="gallery-carousel">
                    <div className="gallery-track">
                        {slides.map((img, i) => (
                            <div key={i} className="gallery-slide" aria-hidden={i >= images.length}>
                                <Image
                                    src={`/gallery/${img}`}
                                    alt={t('gallery.imgAlt')}
                                    /*
                                     * 320px covers the largest rendered slide (300px) at 1x.
                                     * The sources are 900-1600px phone photos, so serving
                                     * them raw was pulling ~2.4MB into a 220px-tall strip.
                                     */
                                    width={320}
                                    height={240}
                                    sizes="(max-width: 480px) 220px, (max-width: 768px) 250px, 300px"
                                    quality={72}
                                    /*
                                     * Lazy for every slide. Three of them were
                                     * `eager`, which made the browser preload
                                     * them at High priority — the gallery strip
                                     * sits well below the fold, so those three
                                     * requests competed with the hero for
                                     * bandwidth before the visitor had scrolled.
                                     */
                                    loading="lazy"
                                />
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
