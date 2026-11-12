import { MetadataRoute } from 'next';
import { serviceData } from '@/lib/serviceData';
import { getAllServicePageSlugs, hasTranslatedServicePage, serviceHreflangs } from '@/lib/servicePageData';
import { articles } from '@/lib/articles';
import { sitemapLanguages } from '@/lib/sitemapAlternates';

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = 'https://www.veralexconsulting.com';
    const now = new Date().toISOString().split('T')[0];

    // Static routes with appropriate priorities.
    // No /id or /zh home routes exist — language lives on the unprefixed home
    // (toggle) and on /{locale}/services/{slug}, so only real URLs go here.
    //
    // alternates.languages: the same hreflang set the pages declare in <head>.
    // The home page has no per-language URL (the toggle is client-side), so it
    // declares itself as every language rather than pointing at a URL that does
    // not exist. That matches what the page's own metadata says.
    const staticRoutes: MetadataRoute.Sitemap = [
        {
            url: baseUrl,
            lastModified: now,
            changeFrequency: 'weekly',
            priority: 1.0,
            alternates: { languages: sitemapLanguages({ id: '/', en: '/', zh: '/' }) },
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
        // Only /about-us and /zh/about-us are listed. /en/about-us was a dead
        // URL (no EN copy exists; the page canonicalises to /about-us), and a
        // sitemap full of dead or duplicate URLs is a quality signal against the
        // whole site, so each real, self-canonical page is listed once.
        //
        // The /zh page declares /about-us as its x-default: a visitor in an
        // unknown locale belongs on the Indonesian page, not the Chinese one.
        {
            url: `${baseUrl}/about-us`,
            lastModified: now,
            changeFrequency: 'monthly',
            priority: 0.6,
            alternates: { languages: sitemapLanguages({ id: '/about-us', zh: '/zh/about-us' }, '/about-us') },
        },
        {
            url: `${baseUrl}/zh/about-us`,
            lastModified: now,
            changeFrequency: 'monthly',
            priority: 0.6,
            alternates: { languages: sitemapLanguages({ id: '/about-us', zh: '/zh/about-us' }, '/about-us') },
        },
        ...(['privacy-policy', 'terms-and-conditions'] as const).flatMap((page) =>
            (['', '/zh'] as const).map((prefix) => ({
                url: `${baseUrl}${prefix}/${page}`,
                lastModified: now,
                changeFrequency: 'yearly' as const,
                priority: 0.3,
                alternates: {
                    languages: sitemapLanguages({ id: `/${page}`, zh: `/zh/${page}` }, `/${page}`),
                },
            }))
        ),
    ];

    // Dynamic service routes (ID — default, at /services/[slug]).
    // serviceHreflangs() only emits a locale when that locale has a real page,
    // so an English-only or untranslated service declares just the languages it
    // actually exists in — same set the page metadata uses.
    const highPrioritySlugs = ['pt-pmdn', 'pt-pma', 'pendaftaran-merek', 'kitas-kerja'];
    const serviceRoutes: MetadataRoute.Sitemap = serviceData.map((service) => ({
        url: `${baseUrl}/services/${service.slug}`,
        lastModified: now,
        changeFrequency: 'monthly' as const,
        priority: highPrioritySlugs.includes(service.slug) ? 0.9 : 0.7,
        alternates: { languages: sitemapLanguages(serviceHreflangs(service.slug)) },
    }));

    // Helper to generate locale-prefixed service routes (English + Chinese
    // landing pages only — /id/services/* is a redirect to /services/*).
    const generateLocaleRoutes = (locale: 'en' | 'zh'): MetadataRoute.Sitemap => {
        const slugs = getAllServicePageSlugs(locale);
        const localePrioritySlugs = ['pt-pma', 'itas-investor-1-tahun', 'itas-investor-2-tahun', 'pendaftaran-merek', 'kitas-kerja'];
        return slugs
            // Only pages with real translated copy belong in the sitemap. Every
            // other /en and /zh service URL renders the Indonesian catalogue and
            // is served with noindex (see docs/DECISIONS.md 2026-11-12), so
            // listing it here would contradict its own robots tag.
            .filter((slug) => hasTranslatedServicePage(locale, slug))
            .map((slug) => ({
                url: `${baseUrl}/${locale}/services/${slug}`,
                lastModified: now,
                changeFrequency: 'monthly' as const,
                priority: localePrioritySlugs.includes(slug) ? 0.9 : 0.7,
                alternates: { languages: sitemapLanguages(serviceHreflangs(slug)) },
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
