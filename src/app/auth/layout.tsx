import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'VERALEX CONSULTING | Autentikasi',
    description: 'Login atau daftar untuk mengakses layanan legal VERALEX CONSULTING.',
    robots: 'noindex, nofollow',
};

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <main className="auth-split-wrapper">
            {children}
        </main>
    );
}
