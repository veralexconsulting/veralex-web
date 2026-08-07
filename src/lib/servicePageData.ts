import ptPmaEn from '@/data/services/en/pt-pma.json';
import itasInvestor1En from '@/data/services/en/itas-investor-1-tahun.json';
import itasInvestor2En from '@/data/services/en/itas-investor-2-tahun.json';
import pendaftaranMerekEn from '@/data/services/en/pendaftaran-merek.json';

import ptPmaZh from '@/data/services/zh/pt-pma.json';
import itasInvestor1Zh from '@/data/services/zh/itas-investor-1-tahun.json';
import itasInvestor2Zh from '@/data/services/zh/itas-investor-2-tahun.json';
import pendaftaranMerekZh from '@/data/services/zh/pendaftaran-merek.json';

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
    priceNote: string;
    features: string[];
    faqs: ServicePageFaq[];
    relatedSlugs: string[];
    ogImage: string;
}

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

export function isValidLocale(locale: string): locale is SupportedLocale {
    return SUPPORTED_LOCALES.includes(locale as SupportedLocale);
}

export function getServicePageData(locale: SupportedLocale, slug: string): ServicePageData | undefined {
    if (locale === 'zh') {
        return zhServicePages[slug];
    }
    return enServicePages[slug];
}

export function getAllServicePageSlugs(locale: SupportedLocale): string[] {
    if (locale === 'zh') {
        return Object.keys(zhServicePages);
    }
    return Object.keys(enServicePages);
}

export function getRelatedServices(data: ServicePageData, locale: SupportedLocale = 'en'): ServicePageData[] {
    const pages = locale === 'zh' ? zhServicePages : enServicePages;
    return data.relatedSlugs
        .map((slug) => pages[slug])
        .filter(Boolean);
}
