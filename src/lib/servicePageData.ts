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
const idServiceSlugs = new Set(serviceData.map((s) => s.slug));

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

export function hasServicePage(locale: SupportedLocale, slug: string): boolean {
    if (locale === 'zh') {
        return Boolean(zhServicePages[slug]);
    }
    if (locale === 'id') {
        return idServiceSlugs.has(slug);
    }
    return Boolean(enServicePages[slug]);
}

// hreflang set for a service slug. Only locales that really have a page are
// declared — advertising a missing URL is worse than omitting the alternate.
export function serviceHreflangs(slug: string): Record<string, string> {
    const languages: Record<string, string> = {
        'id': `/services/${slug}`,
        'x-default': `/services/${slug}`,
    };
    if (hasServicePage('en', slug)) languages['en'] = `/en/services/${slug}`;
    if (hasServicePage('zh', slug)) languages['zh'] = `/zh/services/${slug}`;
    return languages;
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
