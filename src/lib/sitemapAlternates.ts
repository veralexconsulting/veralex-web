/**
 * hreflang sets for the XML sitemap.
 *
 * The page metadata (`alternates.languages`) already declares the same set of
 * alternates in each page's <head>, but the sitemap is a second, independent
 * signal that Search Console reads on its own — and until now it carried none.
 * These helpers build the absolute-URL form the sitemap protocol expects.
 *
 * The rule is the same one the metadata follows: only declare an alternate that
 * really exists. A hreflang pointing at a 404 or at a page in the wrong
 * language is worse than no hreflang at all, because it teaches Google that the
 * whole cluster is unreliable.
 */

const BASE_URL = 'https://www.veralexconsulting.com';

/** Resolves a site-relative path ('/zh/about-us') to an absolute URL. */
export function absoluteUrl(path: string): string {
    return `${BASE_URL}${path}`;
}

/**
 * Builds `alternates.languages` from a map of locale → path.
 *
 * `x-default` is always the Indonesian (unprefixed) URL, which is the default
 * language of the site and the page a visitor from an unknown locale should
 * land on. Pass it explicitly to override.
 */
export function sitemapLanguages(paths: Record<string, string>, xDefault?: string): Record<string, string> {
    const languages: Record<string, string> = {};
    for (const [locale, path] of Object.entries(paths)) {
        languages[locale] = absoluteUrl(path);
    }
    languages['x-default'] = absoluteUrl(xDefault ?? paths.id ?? Object.values(paths)[0]);
    return languages;
}
