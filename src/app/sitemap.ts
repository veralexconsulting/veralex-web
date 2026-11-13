import { MetadataRoute } from 'next';
import { serviceData } from '@/lib/serviceData';
import { getAllServicePageSlugs, hasTranslatedServicePage, serviceHreflangs } from '@/lib/servicePageData';
import { articles } from '@/lib/articles';
import { sitemapLanguages } from '@/lib/sitemapAlternates';

// Last commit date (YYYY-MM-DD) of each file whose content a URL renders.
// These are real revision dates: a build must never invent a lastModified, so
// when a page's source changes, the date here is updated in the same commit.
const pageUpdatedAt = {
    home: '2026-11-13', // src/app/page.tsx
    gallery: '2026-11-13', // src/app/gallery/page.tsx
    artikel: '2026-11-13', // src/app/artikel/page.tsx
    aboutUsId: '2026-10-10', // src/app/about-us/page.tsx
    aboutUsZh: '2026-11-13', // src/app/[lang]/about-us/page.tsx (renders /zh/about-us)
    privacyPolicy: '2026-10-09', // src/app/privacy-policy/page.tsx
    termsAndConditions: '2026-10-09', // src/app/terms-and-conditions/page.tsx
    privacyPolicyZh: '2026-11-10', // src/app/[lang]/privacy-policy/page.tsx (renders /zh/privacy-policy)
    termsAndConditionsZh: '2026-11-10', // src/app/[lang]/terms-and-conditions/page.tsx (renders /zh/terms-and-conditions)
} as const;

// Localized service landing pages whose own JSON copy differs from the
// Indonesian catalogue. Their route file changed on 2026-11-13, but the copy a
// crawler reads changed with the translation file.
const servicePageCopyUpdatedAt: Partial<Record<string, string>> = {
    'en/pt-pma': '2026-10-06',
    'zh/pt-pma': '2026-10-06',
    'en/pendaftaran-merek': '2026-11-11',
    'zh/pendaftaran-merek': '2026-11-11',
    'en/itas-investor-1-tahun': '2026-11-09',
    'zh/itas-investor-1-tahun': '2026-11-09',
};

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = 'https://www.veralexconsulting.com';

    // Static routes.
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
            lastModified: pageUpdatedAt.home,
            alternates: { languages: sitemapLanguages({ id: '/', en: '/', zh: '/' }) },
        },
        {
            url: `${baseUrl}/gallery`,
            lastModified: pageUpdatedAt.gallery,
        },
        {
            url: `${baseUrl}/artikel`,
            lastModified: pageUpdatedAt.artikel,
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
            lastModified: pageUpdatedAt.aboutUsId,
            alternates: { languages: sitemapLanguages({ id: '/about-us', zh: '/zh/about-us' }, '/about-us') },
        },
        {
            url: `${baseUrl}/zh/about-us`,
            lastModified: pageUpdatedAt.aboutUsZh,
            alternates: { languages: sitemapLanguages({ id: '/about-us', zh: '/zh/about-us' }, '/about-us') },
        },
        ...(['privacy-policy', 'terms-and-conditions'] as const).flatMap((page) =>
            (['', '/zh'] as const).map((prefix) => ({
                url: `${baseUrl}${prefix}/${page}`,
                lastModified: prefix === '/zh'
                    ? (page === 'privacy-policy' ? pageUpdatedAt.privacyPolicyZh : pageUpdatedAt.termsAndConditionsZh)
                    : (page === 'privacy-policy' ? pageUpdatedAt.privacyPolicy : pageUpdatedAt.termsAndConditions),
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
    const serviceRoutes: MetadataRoute.Sitemap = serviceData.map((service) => ({
        url: `${baseUrl}/services/${service.slug}`,
        lastModified: service.updatedAt,
        alternates: { languages: sitemapLanguages(serviceHreflangs(service.slug)) },
    }));

    // Helper to generate locale-prefixed service routes (English + Chinese
    // landing pages only — /id/services/* is a redirect to /services/*).
    const generateLocaleRoutes = (locale: 'en' | 'zh'): MetadataRoute.Sitemap => {
        const slugs = getAllServicePageSlugs(locale);
        return slugs
            // Only pages with real translated copy belong in the sitemap. Every
            // other /en and /zh service URL renders the Indonesian catalogue and
            // is served with noindex (see docs/DECISIONS.md 2026-11-12), so
            // listing it here would contradict its own robots tag.
            .filter((slug) => hasTranslatedServicePage(locale, slug))
            .map((slug) => ({
                url: `${baseUrl}/${locale}/services/${slug}`,
                lastModified: servicePageCopyUpdatedAt[`${locale}/${slug}`]
                    ?? serviceData.find((service) => service.slug === slug)?.updatedAt,
                alternates: { languages: sitemapLanguages(serviceHreflangs(slug)) },
            }));
    };

    const enServiceRoutes = generateLocaleRoutes('en');
    const zhServiceRoutes = generateLocaleRoutes('zh');
    const articleRoutes: MetadataRoute.Sitemap = articles.map(({ slug, updatedAt }) => ({
        url: `${baseUrl}/artikel/${slug}`,
        lastModified: updatedAt,
    }));

    return [...staticRoutes, ...articleRoutes, ...serviceRoutes, ...enServiceRoutes, ...zhServiceRoutes];
}
