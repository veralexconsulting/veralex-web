'use client';

import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { logout } from '../auth/actions';

import { useLang } from '@/lib/useLang';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const { t, lang, toggleLang } = useLang();

    const navLinks = [
        {
            href: '/dashboard',
            label: t('nav.dash.home') || 'Dashboard',
            icon: (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" />
                </svg>
            ),
            exact: true,
        },
        {
            href: '/dashboard/orders',
            label: t('nav.dash.orders') || 'Pesanan Saya',
            icon: (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" />
                </svg>
            ),
        },
        {
            href: '/dashboard/orders/new',
            label: t('nav.dash.new_order') || 'Order Baru',
            icon: (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="16" /><line x1="8" y1="12" x2="16" y2="12" />
                </svg>
            ),
        },
    ];

    function isActive(href: string, exact?: boolean) {
        if (exact) return pathname === href;
        return pathname.startsWith(href);
    }

    return (
        <div className="panel-layout">
            {/* Mobile toggle */}
            <button
                className="panel-sidebar-toggle"
                onClick={() => setSidebarOpen(!sidebarOpen)}
                aria-label="Toggle menu"
            >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="3" y1="6" x2="21" y2="6" />
                    <line x1="3" y1="12" x2="21" y2="12" />
                    <line x1="3" y1="18" x2="21" y2="18" />
                </svg>
            </button>

            {/* Mobile overlay */}
            <div
                className={`panel-sidebar-overlay ${sidebarOpen ? 'visible' : ''}`}
                onClick={() => setSidebarOpen(false)}
            />

            {/* Sidebar */}
            <aside className={`panel-sidebar ${sidebarOpen ? 'open' : ''}`}>
                <a href="/" className="panel-sidebar-brand">
                    <img src="/logo.jpg" alt="VERALEX" className="panel-sidebar-logo" />
                    <span className="panel-sidebar-name">VERALEX</span>
                </a>

                <div className="panel-sidebar-role">Client Portal</div>

                <nav className="panel-nav">
                    {navLinks.map((link) => (
                        <a
                            key={link.href}
                            href={link.href}
                            className={`panel-nav-link ${isActive(link.href, link.exact) ? 'active' : ''}`}
                            onClick={() => setSidebarOpen(false)}
                        >
                            {link.icon}
                            {link.label}
                        </a>
                    ))}

                    <div className="panel-nav-spacer" />

                    <button
                        className="panel-nav-link"
                        onClick={toggleLang}
                        style={{ width: '100%', marginBottom: '8px', cursor: 'pointer', background: 'rgba(212, 175, 55, 0.1)' }}
                    >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
                        </svg>
                        {lang === 'id' ? 'Switch to English' : 'Ubah ke Indonesia'}
                    </button>

                    <form action={logout}>
                        <button type="submit" className="panel-nav-link danger" style={{ width: '100%' }}>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" />
                            </svg>
                            {t('nav.dash.logout') || 'Keluar'}
                        </button>
                    </form>
                </nav>
            </aside>

            {/* Main Content */}
            <main className="panel-main">
                {children}
            </main>
        </div>
    );
}
