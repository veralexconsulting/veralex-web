import type { Metadata } from 'next';
import './aksesraffi.css';

export const metadata: Metadata = {
    title: 'Akses Pemilik — VERALEX CONSULTING',
    robots: { index: false, follow: false, nocache: true, googleBot: { index: false, follow: false, noimageindex: true } },
    referrer: 'no-referrer',
};

export const dynamic = 'force-dynamic';

export default function OwnerLayout({ children }: { children: React.ReactNode }) {
    return <div className="owner">{children}</div>;
}
