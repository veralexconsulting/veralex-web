'use client';

import { useLang } from '@/lib/useLang';

export default function TestimonialsSection() {
    const { t } = useLang();

    const testimonials = [
        { initials: 'AP', name: 'Andi Pratama', role: 'CEO, Tech Startup', contentKey: 'testimonials.t1.content' },
        { initials: 'MT', name: 'Maria Tan', role: 'COO, Consumer Goods', contentKey: 'testimonials.t2.content' },
        { initials: 'JL', name: 'James Lee', roleKey: 'testimonials.t3.role', contentKey: 'testimonials.t3.content' },
    ];

    return (
        <section className="testimonials" id="testimonials">
            <div className="container">
                <h2 className="section-title fade-in">{t('testimonials.title')}</h2>
                <p className="section-subtitle fade-in">{t('testimonials.subtitle')}</p>

                <div className="testimonials-grid">
                    {testimonials.map((item) => (
                        <div key={item.initials} className="testimonial-card fade-in">
                            <p className="testimonial-content">{t(item.contentKey)}</p>
                            <div className="testimonial-author">
                                <div className="testimonial-avatar">{item.initials}</div>
                                <div className="testimonial-info">
                                    <h4>{item.name}</h4>
                                    <p>{item.roleKey ? t(item.roleKey) : item.role}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
