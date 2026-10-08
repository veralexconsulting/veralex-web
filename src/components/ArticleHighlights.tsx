import Link from 'next/link';
import { articles, type Article } from '@/lib/articles';
import styles from '@/app/artikel/articles.module.css';

export function ArticleCard({ article, index }: { article: Article; index: number }) {
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
                <span>Baca artikel <span aria-hidden="true">↗</span></span>
            </div>
        </Link>
    );
}

export default function ArticleHighlights() {
    return (
        <section className={styles.highlights} aria-labelledby="articles-heading">
            <div className="container">
                <div className={styles.sectionHead}>
                    <div>
                        <p className={styles.eyebrow}>Wawasan terbaru</p>
                        <h2 id="articles-heading">Aturan berubah. Langkah bisnis harus tetap jelas.</h2>
                    </div>
                    <Link href="/artikel" className={styles.allLink}>Semua artikel <span aria-hidden="true">↗</span></Link>
                </div>
                <div className={styles.grid}>
                    {articles.slice(0, 3).map((article, index) => <ArticleCard key={article.slug} article={article} index={index} />)}
                </div>
            </div>
        </section>
    );
}
