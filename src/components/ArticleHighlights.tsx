'use client';

import Link from 'next/link';
import { articles, type Article } from '@/lib/articles';
import { useLang } from '@/lib/useLang';
import styles from '@/app/artikel/articles.module.css';

/* Article bodies are Indonesian-only, so only the chrome gets translated. */
const copy = {
    id: { eyebrow: 'Wawasan terbaru', title: 'Aturan berubah. Langkah bisnis harus tetap jelas.', all: 'Semua artikel', read: 'Baca artikel' },
    en: { eyebrow: 'Latest insights', title: 'The rules change. Your next step should stay clear.', all: 'All articles', read: 'Read article' },
    zh: { eyebrow: '最新洞察', title: '规则在变，商业决策仍需清晰。', all: '全部文章', read: '阅读文章' },
} as const;

export function ArticleCard({ article, index }: { article: Article; index: number }) {
    const { lang } = useLang();
    const c = copy[lang] ?? copy.id;

    return (
        <Link href={`/artikel/${article.slug}`} className={styles.card}>
            <div className={styles.cardTop}>
                <span>{article.category}</span>
                <span>{String(index + 1).padStart(2, '0')}</span>
            </div>
            <h3>{article.title}</h3>
            <p>{article.description}</p>
            <div className={styles.cardBottom}>
                <time dateTime={article.publishedAt}>
                    {new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Asia/Jakarta' }).format(new Date(`${article.publishedAt}T00:00:00+07:00`))}
                </time>
                <span>{c.read} <span aria-hidden="true">↗</span></span>
            </div>
        </Link>
    );
}

export default function ArticleHighlights() {
    const { lang } = useLang();
    const c = copy[lang] ?? copy.id;

    return (
        <section className={styles.highlights} aria-labelledby="articles-heading">
            <div className="container">
                <div className={styles.sectionHead}>
                    <div>
                        <p className={styles.eyebrow}>{c.eyebrow}</p>
                        <h2 id="articles-heading">{c.title}</h2>
                    </div>
                    <Link href="/artikel" className={styles.allLink}>{c.all} <span aria-hidden="true">↗</span></Link>
                </div>
                <div className={styles.grid}>
                    {articles.slice(0, 3).map((article, index) => <ArticleCard key={article.slug} article={article} index={index} />)}
                </div>
            </div>
        </section>
    );
}
