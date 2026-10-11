'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useLang } from '@/lib/useLang';
import { MAX_REVIEWS, googleBusinessProfile, googleReviews } from '@/lib/googleReviews';

const reviews = googleReviews.slice(0, MAX_REVIEWS);

/** Cards visible per breakpoint. Kept in one place so arrows, dots and the
 *  scroll step can never disagree about where a page begins. */
function visibleFor(width: number) {
    if (width <= 600) return 1;
    if (width <= 900) return 2;
    return 3;
}

function StarRow({ rating }: { rating: number }) {
    return (
        <p className="review-stars" role="img" aria-label={`${rating} out of 5 stars`}>
            {[1, 2, 3, 4, 5].map(step => (
                <svg key={step} viewBox="0 0 24 24" aria-hidden="true" width="15" height="15" className={step <= rating ? 'is-on' : 'is-off'}>
                    <path fill="currentColor" d="M12 2.6l2.9 5.9 6.5.95-4.7 4.6 1.1 6.45L12 17.45 6.2 20.5l1.1-6.45-4.7-4.6 6.5-.95z" />
                </svg>
            ))}
        </p>
    );
}

export default function TestimonialsSection() {
    const { t, lang } = useLang();
    const trackRef = useRef<HTMLDivElement>(null);
    const [page, setPage] = useState(0);
    const [visible, setVisible] = useState(3);
    const [expanded, setExpanded] = useState<string[]>([]);
    const pages = Math.max(1, Math.ceil(reviews.length / visible));

    const measure = useCallback(() => {
        const track = trackRef.current;
        if (!track) return;
        const next = visibleFor(window.innerWidth);
        setVisible(next);
        const cards = Array.from(track.children) as HTMLElement[];
        if (!cards.length) return;
        // Measure the real first card rather than assuming a CSS width, so the
        // snap point stays correct at every breakpoint.
        const offset = cards[0].offsetLeft - track.offsetLeft;
        const step = cards.length > 1 ? cards[1].offsetLeft - cards[0].offsetLeft : offset;
        setPage(Math.max(0, Math.min(pages - 1, Math.round((track.scrollLeft - offset) / (step * next)))));
    }, [pages]);

    // Deferred to the next frame: measuring touches layout, and the effect must
    // not call setState synchronously on mount.
    useEffect(() => {
        const relayout = () => requestAnimationFrame(measure);
        const frame = relayout();
        window.addEventListener('resize', relayout);
        return () => { cancelAnimationFrame(frame); window.removeEventListener('resize', relayout); };
    }, [measure]);

    const goTo = useCallback((next: number) => {
        const track = trackRef.current;
        if (!track) return;
        const cards = Array.from(track.children) as HTMLElement[];
        const target = cards[Math.min(cards.length - 1, next * visible)];
        if (target) track.scrollTo({ left: target.offsetLeft - track.offsetLeft, behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
    }, [visible]);

    const toggle = (id: string) => setExpanded(current => current.includes(id) ? current.filter(item => item !== id) : [...current, id]);
    const locale = lang === 'zh' ? 'zh-CN' : lang === 'id' ? 'id-ID' : 'en-US';
    const monthLabel = (month: string) => new Date(`${month}-01T12:00:00Z`).toLocaleDateString(locale, { month: 'short', year: 'numeric', timeZone: 'UTC' });

    return (
        <section className="testimonials" id="testimonials" aria-labelledby="testimonials-title">
            <div className="container">
                <p className="testimonials-eyebrow fade-in">{googleBusinessProfile.rating}.0 / 5 · {googleBusinessProfile.reviewCount} {t('testimonials.reviewsOnGoogle')}</p>
                <h2 className="section-title fade-in" id="testimonials-title">{t('testimonials.title')}</h2>
                <p className="section-subtitle fade-in">{t('testimonials.subtitle')}</p>

                <div className="reviews-frame fade-in">
                    <button type="button" className="reviews-arrow is-prev" onClick={() => goTo(page - 1)} disabled={page === 0}
                        aria-label={t('testimonials.prev')} aria-controls="reviews-track">
                        <svg viewBox="0 0 24 24" aria-hidden="true" width="20" height="20"><path fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M15 5l-7 7 7 7" /></svg>
                    </button>

                    <div className="reviews-track" id="reviews-track" ref={trackRef} onScroll={measure} tabIndex={0}
                        role="group" aria-roledescription="carousel" aria-label={t('testimonials.title')}>
                        {reviews.map((review, index) => {
                            const open = expanded.includes(review.id);
                            return (
                                <figure className="review-card" key={review.id}
                                    aria-roledescription="slide"
                                    aria-label={`${index + 1} / ${reviews.length}`}>
                                    <div className="review-head">
                                        <span className="review-avatar" aria-hidden="true">{review.author.replace(/[^A-Za-z0-9]/g, '').charAt(0).toUpperCase() || 'G'}</span>
                                        <div className="review-who">
                                            <strong>{review.author}</strong>
                                            <small>{t('testimonials.reviewsCount').replace('{n}', String(review.authorReviewCount))}</small>
                                        </div>
                                    </div>
                                    <StarRow rating={review.rating} />
                                    <blockquote className={open ? 'review-text is-open' : 'review-text'}>
                                        <p>{review.text}</p>
                                    </blockquote>
                                    {review.text.length > 120 && (
                                        <button type="button" className="review-more" onClick={() => toggle(review.id)} aria-expanded={open}>
                                            {open ? t('testimonials.less') : t('testimonials.more')}
                                        </button>
                                    )}
                                    <figcaption className="review-foot">
                                        <span className="review-source">
                                            <svg viewBox="0 0 24 24" aria-hidden="true" width="13" height="13">
                                                <path fill="#4285F4" d="M21.35 11.1H12v2.9h5.35c-.23 1.4-1.66 4.1-5.35 4.1a5.9 5.9 0 110-11.8c1.68 0 2.8.72 3.45 1.34l2.35-2.26A8.6 8.6 0 0012 3a9 9 0 100 18c5.2 0 8.63-3.65 8.63-8.8 0-.59-.07-1.04-.15-1.5z" />
                                            </svg>
                                            {t('testimonials.onGoogle')}
                                        </span>
                                        <time dateTime={review.date ?? `${review.month}-01`}>{review.date ?? monthLabel(review.month)}</time>
                                    </figcaption>
                                </figure>
                            );
                        })}
                    </div>

                    <button type="button" className="reviews-arrow is-next" onClick={() => goTo(page + 1)} disabled={page >= pages - 1}
                        aria-label={t('testimonials.next')} aria-controls="reviews-track">
                        <svg viewBox="0 0 24 24" aria-hidden="true" width="20" height="20"><path fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
                    </button>
                </div>

                {pages > 1 && (
                    <div className="reviews-dots" role="tablist" aria-label={t('testimonials.pagination')}>
                        {Array.from({ length: pages }, (_, index) => (
                            <button key={index} type="button" role="tab" aria-selected={page === index} aria-label={`${index + 1} / ${pages}`}
                                className={page === index ? 'is-active' : ''} onClick={() => goTo(index)} />
                        ))}
                    </div>
                )}

                <div className="reviews-cta fade-in">
                    <a className="btn-reviews-cta" href={googleBusinessProfile.reviewsUrl} target="_blank" rel="noopener noreferrer nofollow">
                        <svg viewBox="0 0 24 24" aria-hidden="true" width="16" height="16"><path fill="#4285F4" d="M21.35 11.1H12v2.9h5.35c-.23 1.4-1.66 4.1-5.35 4.1a5.9 5.9 0 110-11.8c1.68 0 2.8.72 3.45 1.34l2.35-2.26A8.6 8.6 0 0012 3a9 9 0 100 18c5.2 0 8.63-3.65 8.63-8.8 0-.59-.07-1.04-.15-1.5z" /></svg>
                        {t('testimonials.viewAll')}
                        <svg viewBox="0 0 24 24" aria-hidden="true" width="15" height="15"><path fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M7 17L17 7M9 7h8v8" /></svg>
                    </a>
                </div>
            </div>
        </section>
    );
}

function prefersReducedMotion() {
    return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}