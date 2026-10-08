import type { Metadata, Viewport } from 'next';
import '../globals.css';

export const viewport: Viewport = {
    width: 'device-width',
    initialScale: 1,
};

export const metadata: Metadata = {
    title: 'VERALEX CONSULTING — Legal & Business Consulting Indonesia',
    description: 'Professional legal consulting for company registration, trademark, KITAS, and business licensing in Indonesia.',
    metadataBase: new URL('https://www.veralexconsulting.com'),
    robots: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
    openGraph: {
        type: 'website',
        url: 'https://www.veralexconsulting.com',
        siteName: 'VERALEX CONSULTING',
        images: [{ url: '/logo.webp', width: 1200, height: 630, alt: 'VERALEX CONSULTING' }],
    },
    other: {
        'theme-color': '#FAFAFA',
    },
    icons: {
        icon: '/logo.webp',
        shortcut: '/logo.webp',
        apple: '/logo.webp',
    },
};

export default function LangLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return <>{children}</>;
}
