import ptPmaEn from '@/data/services/en/pt-pma.json';
import itasInvestor1En from '@/data/services/en/itas-investor-1-tahun.json';
import itasInvestor2En from '@/data/services/en/itas-investor-2-tahun.json';
import pendaftaranMerekEn from '@/data/services/en/pendaftaran-merek.json';

import ptPmaZh from '@/data/services/zh/pt-pma.json';
import itasInvestor1Zh from '@/data/services/zh/itas-investor-1-tahun.json';
import itasInvestor2Zh from '@/data/services/zh/itas-investor-2-tahun.json';
import pendaftaranMerekZh from '@/data/services/zh/pendaftaran-merek.json';

import { serviceData, getServiceBySlug } from '@/lib/serviceData';

export interface ServicePageRequirement {
    item: string;
}

export interface ServicePageProcessStep {
    step: number;
    title: string;
    description: string;
}

export interface ServicePageFaq {
    question: string;
    answer: string;
}

export interface ServicePageData {
    slug: string;
    title: string;
    metaTitle: string;
    metaDescription: string;
    keywords: string;
    category: string;
    categorySlug: string;
    intro: string;
    requirements: ServicePageRequirement[];
    processSteps: ServicePageProcessStep[];
    price: string;
    originalPrice?: string;
    discountBadge?: string;
    priceNote: string;
    features: string[];
    faqs: ServicePageFaq[];
    relatedSlugs: string[];
    ogImage: string;
}

export type RelatedService = Pick<ServicePageData, 'slug' | 'title' | 'price'>;

const enServicePages: Record<string, ServicePageData> = {
    'pt-pma': ptPmaEn as ServicePageData,
    'itas-investor-1-tahun': itasInvestor1En as ServicePageData,
    'itas-investor-2-tahun': itasInvestor2En as ServicePageData,
    'pendaftaran-merek': pendaftaranMerekEn as ServicePageData,
};

const zhServicePages: Record<string, ServicePageData> = {
    'pt-pma': ptPmaZh as ServicePageData,
    'itas-investor-1-tahun': itasInvestor1Zh as ServicePageData,
    'itas-investor-2-tahun': itasInvestor2Zh as ServicePageData,
    'pendaftaran-merek': pendaftaranMerekZh as ServicePageData,
};

export const SUPPORTED_LOCALES = ['en', 'zh', 'id'] as const;
export type SupportedLocale = (typeof SUPPORTED_LOCALES)[number];

// Indonesian service pages live on the unprefixed /services/[slug] route.
// Read lazily: the modules that import serviceData are evaluated later, so a
// module-level snapshot of `serviceData` would capture an empty array.
function idServiceSlugs(): Set<string> {
    return new Set(serviceData.map((s) => s.slug));
}

export function isValidLocale(locale: string): locale is SupportedLocale {
    return SUPPORTED_LOCALES.includes(locale as SupportedLocale);
}

function updatePriceCopy(text: string, previous: string | undefined, current: string | undefined): string {
    if (!previous || !current || previous === current) return text;
    const oldNumber = previous.replace(/\D/g, '');
    const newNumber = current.replace(/\D/g, '');
    const withSeparator = (value: string, separator: string) => value.replace(/\B(?=(\d{3})+(?!\d))/g, separator);
    return text
        .replaceAll(withSeparator(oldNumber, '.'), withSeparator(newNumber, '.'))
        .replaceAll(withSeparator(oldNumber, ','), withSeparator(newNumber, ','));
}

function refreshCopy(text: string, page: ServicePageData, price: string, originalPrice?: string): string {
    return updatePriceCopy(updatePriceCopy(text, page.price, price), page.originalPrice, originalPrice);
}

export function getServicePageData(locale: SupportedLocale, slug: string): ServicePageData | undefined {
    const page = locale === 'zh' ? zhServicePages[slug] : enServicePages[slug];
    if (!page) return undefined;
    const pricing = getServiceBySlug(slug);
    const price = pricing?.price ?? page.price;
    const originalPrice = pricing?.originalPrice;
    return {
        ...page,
        price,
        originalPrice,
        metaDescription: refreshCopy(page.metaDescription, page, price, originalPrice),
        priceNote: refreshCopy(page.priceNote, page, price, originalPrice),
        faqs: page.faqs.map(({ question, answer }) => ({ question, answer: refreshCopy(answer, page, price, originalPrice) })),
    };
}

export function getAllServicePageSlugs(locale: SupportedLocale): string[] {
    if (locale === 'zh') {
        return Object.keys(zhServicePages);
    }
    return Object.keys(enServicePages);
}

/**
 * True when the locale has *translated* copy for this service.
 *
 * Only four slugs are translated (pt-pma, itas-investor-1-tahun,
 * itas-investor-2-tahun, pendaftaran-merek). Everything else renders the
 * Indonesian catalogue text under an /en or /zh URL.
 *
 * This replaced a `hasServicePage` that returned true for *any* locale and any
 * known slug — i.e. "does a URL exist", not "is there a translation". Four
 * call sites read it as the latter, so a Chinese visitor clicking the language
 * toggle was sent to a Chinese URL filled with Indonesian text.
 */
export function hasTranslatedServicePage(locale: SupportedLocale, slug: string): boolean {
    if (locale === 'id') return idServiceSlugs().has(slug);
    if (locale === 'zh') return Boolean(zhServicePages[slug]);
    return Boolean(enServicePages[slug]);
}

// hreflang set for a service slug. Only languages that really have translated
// copy are declared: pointing hreflang at a page that is actually Indonesian
// is worse than omitting the alternate, because it labels the same content as
// two languages and teaches Google the cluster is unreliable.
export function serviceHreflangs(slug: string): Record<string, string> {
    const languages: Record<string, string> = {
        'id': `/services/${slug}`,
        'x-default': `/services/${slug}`,
    };
    if (hasTranslatedServicePage('en', slug)) languages['en'] = `/en/services/${slug}`;
    if (hasTranslatedServicePage('zh', slug)) languages['zh'] = `/zh/services/${slug}`;
    return languages;
}

/**
 * True when an /en or /zh service URL would render untranslated Indonesian
 * content. Those pages are served with `noindex` so they cannot compete with
 * the real Indonesian page. See docs/DECISIONS.md (2026-11-12).
 */
export function isUntranslatedLocalePage(locale: SupportedLocale, slug: string): boolean {
    if (locale === 'id') return false;
    return idServiceSlugs().has(slug) && !hasTranslatedServicePage(locale, slug);
}

export function getRelatedServices(data: ServicePageData, locale: SupportedLocale = 'en'): RelatedService[] {
    return data.relatedSlugs
        .map((slug) => {
            const localized = getServicePageData(locale, slug);
            if (localized) return localized;
            const base = getServiceBySlug(slug);
            if (!base) return undefined;
            return { slug, title: locale === 'zh' ? base.titleZh : base.titleEn, price: base.price };
        })
        .filter((page): page is RelatedService => Boolean(page));
}
