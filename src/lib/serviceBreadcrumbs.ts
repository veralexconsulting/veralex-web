import { getServiceBySlug } from '@/lib/serviceData';
import { translations, type Lang } from '@/lib/translations';

export interface ServiceBreadcrumbItem {
    label: string;
    href?: string;
    current?: boolean;
}

const categoryAnchors: Record<string, string> = {
    'Kekayaan Intelektual': '/#services-ip',
    'Legalitas Perusahaan': '/#services-company',
    'Visa & ITAS': '/#services-itas',
};

export function serviceBreadcrumbs(slug: string, lang: Lang, currentTitle?: string): ServiceBreadcrumbItem[] {
    const service = getServiceBySlug(slug);
    if (!service) return [];

    const category = lang === 'zh' ? service.categoryZh : lang === 'en' ? service.categoryEn : service.category;
    const title = currentTitle || (lang === 'zh' ? service.titleZh : lang === 'en' ? service.titleEn : service.title);
    const path = lang === 'id' ? `/services/${slug}` : `/${lang}/services/${slug}`;

    return [
        { label: translations[lang]['nav.home'], href: '/' },
        { label: translations[lang]['nav.services'], href: '/#services' },
        { label: category, href: categoryAnchors[service.category] },
        { label: title, href: path, current: true },
    ];
}

export function serviceBreadcrumbJsonLd(items: ServiceBreadcrumbItem[]) {
    return {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: items.map((item, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: item.label,
            ...(item.href ? { item: `https://www.veralexconsulting.com${item.href}` } : {}),
        })),
    };
}
