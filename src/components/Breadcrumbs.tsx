import Link from 'next/link';

export interface Crumb {
    label: string;
    /** Omitted on the last crumb: the current page does not link to itself. */
    href?: string;
}

/**
 * Visible breadcrumb + BreadcrumbList structured data, in one component.
 *
 * The markup used to exist only on service pages, so `/artikel/*`, `/gallery`
 * and `/about-us` had no breadcrumb trail at all — nothing to click back up
 * with, and no BreadcrumbList for Google to show in place of the URL. Every
 * inner page now renders this.
 *
 * The JSON-LD is emitted here rather than by each page so the visible trail and
 * the structured data cannot drift: they are built from the same array.
 */
export default function Breadcrumbs({ items, label = 'Breadcrumb' }: { items: Crumb[]; label?: string }) {
    if (items.length === 0) return null;

    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: items.map((item, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: item.label,
            ...(item.href ? { item: `https://www.veralexconsulting.com${item.href}` } : {}),
        })),
    };

    return (
        <nav className="svc-breadcrumb" aria-label={label}>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }} />
            <ol>
                {items.map((item, index) => {
                    const current = index === items.length - 1;
                    return (
                        <li key={`${item.label}-${index}`}>
                            {current || !item.href
                                ? <span aria-current={current ? 'page' : undefined}>{item.label}</span>
                                : <Link href={item.href}>{item.label}</Link>}
                        </li>
                    );
                })}
            </ol>
        </nav>
    );
}
