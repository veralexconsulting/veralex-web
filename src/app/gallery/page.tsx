import type { Metadata } from 'next';
import GalleryPage from './GalleryPage';

export const metadata: Metadata = {
    title: 'Galeri Bukti Layanan | VERALEX CONSULTING - Jasa Pendirian PT & Legalitas Bisnis',
    description: 'Galeri dokumentasi bukti layanan VERALEX CONSULTING: pendirian PT, pendaftaran merek, KITAS, ITAS, dan legalitas bisnis. Lihat hasil kerja profesional kami untuk klien di Bekasi, Jakarta, dan seluruh Indonesia.',
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
