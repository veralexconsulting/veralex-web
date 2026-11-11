import { getServiceBySlug } from '@/lib/serviceData';
import { translations, type Lang } from '@/lib/translations';

export interface ServiceBreadcrumbItem {
    label: string;
    href?: string;
    current?: boolean;
}

/*
 * Homepage section anchors, keyed by every localisation of the category name.
 *
 * The lookup used to use the Indonesian category only, so on /en and /zh pages
 * the category crumb silently lost its anchor and fell back to the bare
 * `#services`. Keying on all three localisations keeps the middle crumb
 * pointing at the right section in every language, and avoids any per-locale
 * branching here.
 */
const categoryAnchors: Record<string, string> = {
    'Kekayaan Intelektual': '/#services-ip',
    'Intellectual Property': '/#services-ip',
    '知识产权保护': '/#services-ip',
    'Legalitas Perusahaan': '/#services-company',
    'Company Formation': '/#services-company',
    '公司设立与合规': '/#services-company',
    'Visa & ITAS': '/#services-itas',
    '签证与居留许可': '/#services-itas',
    'Perizinan & Sertifikasi Produk': '/#services-products',
    'Licensing & Product Certification': '/#services-products',
    '许可与产品认证': '/#services-products',
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
        { label: category, href: categoryAnchors[service.category] ?? categoryAnchors[service.categoryEn] },
        { label: title, href: path, current: true },
    ];
}

/**
 * BreadcrumbList structured data.
 *
 * The last crumb — the page you are on — deliberately carries no `item` URL.
 * Google's guidance is that the final entry is the current page and must not
 * point anywhere; emitting a self-referencing URL made every page claim a child
 * in its own trail. `item` is only resolved for the crumbs above it.
 */
export function serviceBreadcrumbJsonLd(items: ServiceBreadcrumbItem[]) {
    return {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: items.map((item, index) => {
            const isLast = index === items.length - 1;
            return {
                '@type': 'ListItem',
                position: index + 1,
                name: item.label,
                ...(!isLast && item.href ? { item: `https://www.veralexconsulting.com${item.href}` } : {}),
            };
        }),
    };
}
