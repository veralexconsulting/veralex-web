import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { ArticleCard } from '@/components/ArticleHighlights';
import { articles, getArticle } from '@/lib/articles';
import { whatsappHref } from '@/lib/marketing';
import styles from '../articles.module.css';

interface Props {
    params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
    return articles.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const article = getArticle(slug);
    if (!article) return {};

    return {
        title: `${article.title} | VERALEX CONSULTING`,
        description: article.description,
        alternates: { canonical: `/artikel/${slug}` },
        openGraph: {
            title: article.title,
            description: article.description,
            url: `/artikel/${slug}`,
            type: 'article',
            publishedTime: article.publishedAt,
            authors: ['VERALEX CONSULTING'],
        },
    };
}

export default async function ArticlePage({ params }: Props) {
    const { slug } = await params;
    const article = getArticle(slug);
    if (!article) notFound();

    const related = articles.filter((item) => item.slug !== slug);
    const date = new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Asia/Jakarta' }).format(new Date(`${article.publishedAt}T00:00:00+07:00`));
    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: article.title,
        description: article.description,
        datePublished: article.publishedAt,
        dateModified: article.publishedAt,
        inLanguage: 'id-ID',
        author: { '@type': 'Organization', name: 'VERALEX CONSULTING' },
        publisher: { '@type': 'Organization', name: 'VERALEX CONSULTING', logo: { '@type': 'ImageObject', url: 'https://www.veralexconsulting.com/logo.webp' } },
        mainEntityOfPage: `https://www.veralexconsulting.com/artikel/${slug}`,
        citation: article.sources.map(({ url }) => url),
    };

    return (
        <>
            <Navbar />
            <main className={styles.articlePage} lang="id">
                <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }} />
                <div className="container">
                    <Link href="/artikel" className={styles.backLink}>← Semua artikel</Link>
                    <article className={styles.article}>
                        <header className={styles.articleHero}>
                            <div className={styles.meta}><span>{article.category}</span><span aria-hidden="true">·</span><time dateTime={article.publishedAt}>{date}</time><span aria-hidden="true">·</span><span>{article.readingMinutes} menit baca</span></div>
                            <h1>{article.title}</h1>
                            <p className={styles.lead}>{article.lead}</p>
                        </header>

                        <div className={styles.articleBody}>
                            <aside className={styles.takeaways} aria-label="Ringkasan artikel">
                                <h2>Intinya</h2>
                                <ul>{article.takeaways.map((item) => <li key={item}>{item}</li>)}</ul>
                            </aside>
                            {article.sections.map((section) => (
                                <section key={section.heading} className={styles.articleSection}>
                                    <h2>{section.heading}</h2>
                                    {section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
                                    {section.bullets && <ul>{section.bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}</ul>}
                                </section>
                            ))}

                            <section className={styles.sources} aria-labelledby="source-heading">
                                <h2 id="source-heading">Sumber resmi</h2>
                                <ol>{article.sources.map(({ label, url }) => <li key={url}><a href={url} target="_blank" rel="noopener noreferrer">{label} <span aria-hidden="true">↗</span></a></li>)}</ol>
                                <p>Informasi ditinjau pada 8 Oktober 2026. Persyaratan untuk setiap kegiatan usaha dapat berbeda; periksa dokumen dan status terkini pada instansi terkait.</p>
                            </section>
                        </div>
                    </article>

                    <section className={styles.articleCta}>
                        <div>
                            <p className={styles.eyebrow}>Perlu melihat kasus Anda?</p>
                            <h2>Bahas langkah yang tepat untuk usaha Anda.</h2>
                            <p>Ceritakan jenis usaha dan dokumen yang sudah dimiliki. Kami bantu petakan hal yang perlu diperiksa.</p>
                        </div>
                        <div className={styles.ctaActions}>
                            <a href={whatsappHref(article.service.message)} target="_blank" rel="noopener noreferrer" data-cta-location="article" data-service={article.slug} className="btn btn-primary">Chat Kak Vheilljei ↗</a>
                            <Link href={article.service.href} className={styles.serviceLink}>{article.service.label}</Link>
                        </div>
                    </section>

                    <section className={styles.related} aria-labelledby="related-heading">
                        <div className={styles.sectionHead}><h2 id="related-heading">Baca juga</h2><Link href="/artikel" className={styles.allLink}>Lihat semua <span aria-hidden="true">↗</span></Link></div>
                        <div className={styles.grid}>{related.map((item, index) => <ArticleCard key={item.slug} article={item} index={index} />)}</div>
                    </section>
                </div>
            </main>
            <Footer />
        </>
    );
}
