'use client';

import { useLang } from '@/lib/useLang';

export default function TestimonialsSection() {
    const { t } = useLang();

    const testimonialImages = [
        '/testimoniclient/Screenshot_2026-06-26_22-50-01.jpg',
        '/testimoniclient/Screenshot_2026-06-26_22-50-40.jpg',
        '/testimoniclient/Screenshot_2026-06-26_22-50-59.jpg',
        '/testimoniclient/Screenshot_2026-06-26_22-51-25.jpg',
        '/testimoniclient/Screenshot_2026-06-26_22-51-44.jpg',
        '/testimoniclient/Screenshot_2026-06-26_22-52-03.jpg',
        '/testimoniclient/Screenshot_2026-06-26_22-52-17.jpg',
        '/testimoniclient/Screenshot_2026-06-26_22-52-32.jpg',
    ];

    // Duplicate images for a seamless infinite marquee loop
    const marqueeImages = [...testimonialImages, ...testimonialImages];

    return (
        <section className="testimonials" id="testimonials" style={{ overflow: 'hidden', padding: '80px 0' }}>
            <div className="container" style={{ paddingBottom: '40px' }}>
                <h2 className="section-title fade-in">{t('testimonials.title')}</h2>
                <p className="section-subtitle fade-in">{t('testimonials.subtitle')}</p>
            </div>

            <style>{`
                .marquee-container {
                    width: 100%;
                    overflow: hidden;
                    position: relative;
                    -webkit-mask-image: linear-gradient(90deg, transparent, #000 5%, #000 95%, transparent);
                    mask-image: linear-gradient(90deg, transparent, #000 5%, #000 95%, transparent);
                }
                .marquee-wrapper {
                    display: flex;
                    width: max-content;
                    animation: marquee 35s linear infinite;
                }
                .marquee-wrapper:hover {
                    animation-play-state: paused;
                }
                .marquee-item {
                    flex: 0 0 auto;
                    width: 450px;
                    margin: 0 15px;
                }
                @keyframes marquee {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }
            `}</style>

            <div className="marquee-container fade-in">
                <div className="marquee-wrapper">
                    {marqueeImages.map((src, idx) => (
                        <div key={idx} className="marquee-item testimonial-card" style={{
                            padding: '0',
                            height: '110px',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            overflow: 'hidden',
                            borderRadius: '8px',
                            background: '#fff'
                        }}>
                            <img 
                                src={src} 
                                alt={`Testimoni Klien ${idx + 1}`}
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'contain'
                                }}
                            />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
