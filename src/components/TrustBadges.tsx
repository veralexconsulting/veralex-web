'use client';

import { useLang } from '@/lib/useLang';

const ICONS = {
    users: 'M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 7a4 4 0 110 8 4 4 0 010-8zm14 14v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75',
    trending: 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6',
    award: 'M12 15l-2 5L7 14l-5 2 4.5-4.5M12 15l2 5 3-6 5 2-4.5-4.5M12 15V3',
    headset: 'M3 18v-6a9 9 0 0118 0v6M21 19a2 2 0 01-2 2h-1a2 2 0 01-2-2v-3a2 2 0 012-2h3zm-18 0a2 2 0 002 2h1a2 2 0 002-2v-3a2 2 0 00-2-2H3z',
};

const SvgIcon = ({ d }: { d: string }) => (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--color-gold)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d={d} />
    </svg>
);

export default function TrustBadges() {
    const { t } = useLang();

    const badges = [
        { icon: ICONS.users, number: '500+', label: 'trust.clients' },
        { icon: ICONS.trending, number: '99%', label: 'trust.success' },
        { icon: ICONS.award, number: '5+', label: 'trust.experience' },
        { icon: ICONS.headset, number: '24/7', label: 'trust.consultation' },
    ];

    return (
        <section style={{ padding: '40px 0', background: 'var(--color-primary-dark)', borderTop: 'var(--border-gold)', borderBottom: 'var(--border-gold)' }}>
            <div className="container">
                <div className="trust-badges-grid">
                    {badges.map((b) => (
                        <div key={b.label} className="fade-in" style={{ padding: '1rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '0.5rem' }}>
                                <SvgIcon d={b.icon} />
                            </div>
                            <div style={{
                                fontSize: 'clamp(1.5rem, 3vw, 2rem)',
                                fontWeight: 700,
                                fontFamily: 'var(--font-heading)',
                                background: 'var(--color-gold-gradient)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                backgroundClip: 'text',
                            }}>
                                {b.number}
                            </div>
                            <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '0.25rem' }}>
                                {t(b.label)}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
