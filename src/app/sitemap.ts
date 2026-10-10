import { MetadataRoute } from 'next';
import { serviceData } from '@/lib/serviceData';
import { getAllServicePageSlugs } from '@/lib/servicePageData';
import { articles } from '@/lib/articles';

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = 'https://www.veralexconsulting.com';
    const now = new Date().toISOString().split('T')[0];

    // Static routes with appropriate priorities.
    // No /id or /zh home routes exist — language lives on the unprefixed home
    // (toggle) and on /{locale}/services/{slug}, so only real URLs go here.
    const staticRoutes: MetadataRoute.Sitemap = [
        {
            url: baseUrl,
            lastModified: now,
            changeFrequency: 'weekly',
            priority: 1.0,
        },
        {
            url: `${baseUrl}/gallery`,
            lastModified: now,
            changeFrequency: 'monthly',
            priority: 0.6,
        },
        {
            url: `${baseUrl}/artikel`,
            lastModified: now,
            changeFrequency: 'weekly',
            priority: 0.7,
        },
        ...(['', '/id', '/zh'] as const).map((prefix) => ({
            url: `${baseUrl}${prefix}/about-us`,
            lastModified: now,
            changeFrequency: 'monthly' as const,
            priority: 0.6,
        })),
        ...(['privacy-policy', 'terms-and-conditions'] as const).flatMap((page) =>
            (['', '/id', '/zh'] as const).map((prefix) => ({
                url: `${baseUrl}${prefix}/${page}`,
                lastModified: now,
                changeFrequency: 'yearly' as const,
                priority: 0.3,
            }))
        ),
    ];

    // Dynamic service routes (ID — default, at /services/[slug])
    const highPrioritySlugs = ['pt-pmdn', 'pt-pma', 'pendaftaran-merek', 'kitas-kerja'];
    const serviceRoutes: MetadataRoute.Sitemap = serviceData.map((service) => ({
        url: `${baseUrl}/services/${service.slug}`,
        lastModified: now,
        changeFrequency: 'monthly' as const,
        priority: highPrioritySlugs.includes(service.slug) ? 0.9 : 0.7,
    }));

    // Helper to generate locale-prefixed service routes (English + Chinese
    // landing pages only — /id/services/* is a redirect to /services/*).
    const generateLocaleRoutes = (locale: 'en' | 'zh'): MetadataRoute.Sitemap => {
        const slugs = getAllServicePageSlugs(locale);
        const localePrioritySlugs = ['pt-pma', 'itas-investor-1-tahun', 'itas-investor-2-tahun', 'pendaftaran-merek', 'kitas-kerja'];
        return slugs.map((slug) => ({
            url: `${baseUrl}/${locale}/services/${slug}`,
            lastModified: now,
            changeFrequency: 'monthly' as const,
            priority: localePrioritySlugs.includes(slug) ? 0.9 : 0.7,
        }));
    };

    const enServiceRoutes = generateLocaleRoutes('en');
    const zhServiceRoutes = generateLocaleRoutes('zh');
    const articleRoutes: MetadataRoute.Sitemap = articles.map(({ slug, publishedAt }) => ({
        url: `${baseUrl}/artikel/${slug}`,
        lastModified: publishedAt,
        changeFrequency: 'monthly',
        priority: 0.7,
    }));

    return [...staticRoutes, ...articleRoutes, ...serviceRoutes, ...enServiceRoutes, ...zhServiceRoutes];
}
