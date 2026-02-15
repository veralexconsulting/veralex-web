'use client';

import { useEffect } from 'react';

export default function ScrollAnimator() {
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                    }
                });
            },
            { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
        );

        const elements = document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right');
        elements.forEach((el) => observer.observe(el));

        // Stagger effect for cards within visible sections
        const cardObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const cards = entry.target.querySelectorAll('.service-card, .pricing-card, .product-card, .benefit-card');
                        cards.forEach((card, i) => {
                            setTimeout(() => {
                                (card as HTMLElement).style.opacity = '1';
                                (card as HTMLElement).style.transform = 'translateY(0)';
                            }, i * 100);
                        });
                    }
                });
            },
            { threshold: 0.1 }
        );

        const grids = document.querySelectorAll('.services-grid, .pricing-grid, .product-grid, .benefit-grid');
        grids.forEach((g) => {
            // Set initial state
            const cards = g.querySelectorAll('.service-card, .pricing-card, .product-card, .benefit-card');
            cards.forEach((card) => {
                (card as HTMLElement).style.opacity = '0';
                (card as HTMLElement).style.transform = 'translateY(30px)';
                (card as HTMLElement).style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            });
            cardObserver.observe(g);
        });

        return () => {
            observer.disconnect();
            cardObserver.disconnect();
        };
    }, []);

    return null;
}
