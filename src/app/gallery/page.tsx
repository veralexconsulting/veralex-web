import type { Metadata } from 'next';
import GalleryPage from './GalleryPage';

export const metadata: Metadata = {
    // 59 chars. The previous title was 84 and lost "& Legalitas Bisnis" and the
    // brand to truncation.
    title: 'Galeri Bukti Layanan | VERALEX CONSULTING',
    // 139 chars.
    description: 'Dokumentasi bukti layanan VERALEX: pendirian PT, pendaftaran merek, KITAS, ITAS, dan legalitas bisnis untuk klien di Bekasi dan seluruh Indonesia.',
    keywords: 'galeri veralex, bukti layanan hukum, pendirian PT, pendaftaran merek, KITAS, ITAS, konsultan hukum Bekasi',
    alternates: {
        canonical: '/gallery',
    },
    openGraph: {
        title: 'Galeri Bukti Layanan | VERALEX CONSULTING',
        description: 'Dokumentasi bukti layanan legalitas bisnis oleh VERALEX CONSULTING.',
        images: [{ url: '/logo.webp' }],
    },
};

export default function Page() {
    return <GalleryPage />;
}
