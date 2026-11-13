import { serviceData } from '@/lib/serviceData';
import type { Lang } from '@/lib/translations';

/**
 * Service categories as the footer lists them.
 *
 * Slugs come from each service's own category in serviceData, so a service can
 * only appear under a heading the catalogue already has — this file chooses
 * labels and order, never membership. The only carve-out is product licensing:
 * BPOM / PIRT / K3L / POSTEL share a category with the two PSE registrations,
 * and eight entries in one column would be twice the height of its neighbours,
 * so PSE is listed under its own existing heading.
 */
interface FooterGroup {
    key: string;
    label: string;
    slugs: string[];
}

function slugsInCategory(category: string): string[] {
    return serviceData.filter((service) => service.category === category).map((service) => service.slug);
}

const LICENSING = slugsInCategory('Perizinan & Sertifikasi Produk');
const ELECTRONIC_SYSTEM = slugsInCategory('Perizinan Sistem Elektronik');

// Anything in the licensing category that is not an electronic-system
// registration stays under "Sertifikasi & Perizinan".
const productAndPermits = LICENSING.filter((slug) => !ELECTRONIC_SYSTEM.includes(slug));

const DEFINITION: FooterGroup[] = [
    { key: 'business', label: 'footer.groupBusiness', slugs: slugsInCategory('Legalitas Perusahaan') },
    { key: 'ip', label: 'footer.groupIp', slugs: slugsInCategory('Kekayaan Intelektual') },
    { key: 'immigration', label: 'footer.groupImmigration', slugs: slugsInCategory('Visa & ITAS') },
    { key: 'products', label: 'footer.groupProducts', slugs: productAndPermits },
    { key: 'pse', label: 'services.pse.title', slugs: ELECTRONIC_SYSTEM },
];

export const SERVICE_FOOTER_GROUPS: FooterGroup[] = DEFINITION.filter((group) => group.slugs.length > 0);

export function serviceFooterLabel(slug: string, lang: Lang): string {
    const service = serviceData.find((entry) => entry.slug === slug);
    if (!service) return slug;
    return lang === 'zh' ? service.titleZh : lang === 'en' ? service.titleEn : service.title;
}
