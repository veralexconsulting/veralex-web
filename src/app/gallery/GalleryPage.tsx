/* eslint-disable @next/next/no-img-element */
'use client';

import { useState, useCallback } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import FloatingWhatsApp from '@/components/FloatingWhatsApp';
import { useLang } from '@/lib/useLang';

const galleryImages = [
    'IMG-20260121-WA0006.jpg', 'IMG-20260121-WA0007.jpg', 'IMG-20260121-WA0008.jpg',
    'IMG-20260121-WA0009.jpg', 'IMG-20260121-WA0010.jpg', 'IMG-20260121-WA0011.jpg',
    'IMG-20260121-WA0012.jpg', 'IMG-20260121-WA0013.jpg', 'IMG-20260121-WA0014.jpg',
    'IMG-20260121-WA0015.jpg', 'IMG-20260121-WA0016.jpg', 'IMG-20260121-WA0017.jpg',
    'IMG-20260121-WA0018.jpg', 'IMG-20260121-WA0019.jpg', 'IMG-20260121-WA0020.jpg',
    'IMG-20260121-WA0023.jpg', 'IMG-20260121-WA0024.jpg', 'IMG-20260121-WA0025.jpg',
    'IMG-20260121-WA0026.jpg', 'IMG-20260121-WA0027.jpg',
];

export default function GalleryPage() {
    const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);
    const { t } = useLang();

    const openLightbox = useCallback((idx: number) => setLightboxIdx(idx), []);
    const closeLightbox = useCallback(() => setLightboxIdx(null), []);
    const prev = useCallback(() => setLightboxIdx((i) => (i !== null ? (i - 1 + galleryImages.length) % galleryImages.length : null)), []);
    const next = useCallback(() => setLightboxIdx((i) => (i !== null ? (i + 1) % galleryImages.length : null)), []);

    return (
        <>
            <Navbar />

            {/* Gallery Hero */}
            <section className="hero" style={{ minHeight: '50vh', paddingTop: '140px', paddingBottom: '60px' }}>
                <div className="hero-particles">
                    {Array.from({ length: 6 }).map((_, i) => <div key={i} className="particle" />)}
                </div>
                <div className="hero-glow" />
                <div className="hero-content">
                    <h1 className="hero-title" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}>{t('gallery.pageTitle')}</h1>
                    <p className="hero-subtitle">{t('gallery.pageSubtitle')}</p>
                </div>
            </section>

            {/* Gallery Grid */}
            <section style={{ padding: '80px 0', background: 'var(--bg-dark)' }}>
                <div className="container">
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                        gap: '1.5rem',
                    }}>
                        {galleryImages.map((img, idx) => (
                            <div
                                key={img}
                                className="service-card"
                                style={{ padding: 0, cursor: 'pointer', overflow: 'hidden' }}
                                onClick={() => openLightbox(idx)}
                            >
                                <img
                                    src={`/gallery/${img}`}
                                    alt={`Bukti layanan VERALEX ${idx + 1}`}
                                    loading="lazy"
                                    style={{ width: '100%', height: '280px', objectFit: 'cover', borderRadius: 'var(--radius-lg)' }}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="cta-section">
                <div className="container">
                    <div className="cta-content">
                        <h2 className="cta-title">{t('gallery.ctaTitle')}</h2>
                        <p className="cta-subtitle">{t('gallery.ctaSubtitle')}</p>
                        <a
                            href="https://wa.me/6281219476385?text=Halo%20VERALEX,%20saya%20ingin%20konsultasi"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-primary"
                        >
                            {t('gallery.ctaButton')}
                        </a>
                    </div>
                </div>
            </section>

            {/* Lightbox */}
            {lightboxIdx !== null && (
                <div
                    style={{
                        position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.9)', zIndex: 9999,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}
                    onClick={closeLightbox}
                >
                    <button
                        onClick={(e) => { e.stopPropagation(); prev(); }}
                        style={{
                            position: 'absolute', left: 20, top: '50%', transform: 'translateY(-50%)',
                            background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white', fontSize: '2rem',
                            padding: '1rem', borderRadius: '50%', cursor: 'pointer',
                        }}
                    >
                        ◀
                    </button>
                    <img
                        src={`/gallery/${galleryImages[lightboxIdx]}`}
                        alt={`Bukti layanan ${lightboxIdx + 1}`}
                        style={{ maxWidth: '90vw', maxHeight: '85vh', objectFit: 'contain', borderRadius: '12px' }}
                        onClick={(e) => e.stopPropagation()}
                    />
                    <button
                        onClick={(e) => { e.stopPropagation(); next(); }}
                        style={{
                            position: 'absolute', right: 20, top: '50%', transform: 'translateY(-50%)',
                            background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white', fontSize: '2rem',
                            padding: '1rem', borderRadius: '50%', cursor: 'pointer',
                        }}
                    >
                        ▶
                    </button>
                    <button
                        onClick={closeLightbox}
                        style={{
                            position: 'absolute', top: 20, right: 20,
                            background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white', fontSize: '1.5rem',
                            padding: '0.5rem 1rem', borderRadius: '8px', cursor: 'pointer',
                        }}
                    >
                        ✕
                    </button>
                </div>
            )}

            <FloatingWhatsApp />
            <Footer />
        </>
    );
}
