import type { Metadata, Viewport } from 'next';
import { Inter, Playfair_Display, Plus_Jakarta_Sans } from 'next/font/google';
import ScrollProgress from '@/components/ScrollProgress';
import '../globals.css';

const inter = Inter({
    subsets: ['latin'],
    variable: '--font-inter',
    display: 'swap',
});

const playfair = Playfair_Display({
    subsets: ['latin'],
    variable: '--font-playfair',
    display: 'swap',
});

const jakarta = Plus_Jakarta_Sans({
    subsets: ['latin'],
    variable: '--font-jakarta',
    display: 'swap',
    weight: ['400', '500', '600', '700', '800'],
});

export const viewport: Viewport = {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
};

export const metadata: Metadata = {
    title: {
        default: 'VERALEX CONSULTING — Legal & Business Consulting Indonesia',
        template: '%s | VERALEX CONSULTING',
    },
    description: 'Professional legal consulting for company registration, trademark, KITAS, and business licensing in Indonesia.',
    metadataBase: new URL('https://veralexconsulting.com'),
    robots: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
    openGraph: {
        type: 'website',
        url: 'https://veralexconsulting.com',
        siteName: 'VERALEX CONSULTING',
        images: [{ url: '/logo.jpg', width: 1200, height: 630, alt: 'VERALEX CONSULTING' }],
    },
    other: {
        'theme-color': '#4A0E0E',
    },
    icons: {
        icon: '/logo.jpg',
        shortcut: '/logo.jpg',
        apple: '/logo.jpg',
    },
};

export default async function LangLayout({
    children,
    params,
}: Readonly<{
    children: React.ReactNode;
    params: Promise<{ lang: string }>;
}>) {
    const { lang } = await params;
    return (
        <html lang={lang || "en"}>
            <body className={`${inter.variable} ${playfair.variable} ${jakarta.variable}`}>
                <ScrollProgress />
                {children}
            </body>
        </html>
    );
}
