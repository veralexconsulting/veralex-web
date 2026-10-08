import type { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { ArticleCard } from '@/components/ArticleHighlights';
import { articles } from '@/lib/articles';
import styles from './articles.module.css';

export const metadata: Metadata = {
    title: 'Artikel Legalitas Bisnis Terbaru | VERALEX CONSULTING',
    description: 'Baca pembaruan praktis tentang OSS, KBLI 2025, dan pendaftaran merek UMK 2026 berdasarkan sumber resmi.',
    alternates: { canonical: '/artikel' },
    openGraph: {
        title: 'Artikel Legalitas Bisnis | VERALEX CONSULTING',
        description: 'Panduan ringkas untuk memahami perubahan izin usaha, KBLI, dan merek.',
        url: '/artikel',
        type: 'website',
    },
};

export default function ArticlesPage() {
    return (
        <>
            <Navbar />
            <main className={styles.page} lang="id">
                <div className="container">
                    <header className={styles.listHero}>
                        <p className={styles.eyebrow}>Jurnal Veralex</p>
                        <h1>Pahami perubahan aturan sebelum mengambil langkah berikutnya.</h1>
                        <p>Perubahan aturan, dijelaskan dengan bahasa yang mudah dipahami dan tautan ke sumber resminya.</p>
                    </header>
                    <div className={styles.grid}>
                        {articles.map((article, index) => <ArticleCard key={article.slug} article={article} index={index} />)}
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
}
