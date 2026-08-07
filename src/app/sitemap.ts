import { MetadataRoute } from 'next';
import { serviceData } from '@/lib/serviceData';
import { getAllServicePageSlugs } from '@/lib/servicePageData';

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = 'https://veralexconsulting.com';
    const now = new Date().toISOString().split('T')[0];

    // Static routes with appropriate priorities
    const staticRoutes: MetadataRoute.Sitemap = [
        {
            url: baseUrl,
            lastModified: now,
            changeFrequency: 'weekly',
            priority: 1.0,
        },
        {
            url: `${baseUrl}/id`,
            lastModified: now,
            changeFrequency: 'weekly',
            priority: 0.9,
        },
        {
            url: `${baseUrl}/zh`,
            lastModified: now,
            changeFrequency: 'weekly',
            priority: 0.8,
        },
        {
            url: `${baseUrl}/gallery`,
            lastModified: now,
            changeFrequency: 'monthly',
            priority: 0.6,
        },
    ];

    // Dynamic service routes (ID — default, at /services/[slug])
    const highPrioritySlugs = ['pt-pmdn', 'pt-pma', 'pendaftaran-merek', 'kitas-kerja'];
    const serviceRoutes: MetadataRoute.Sitemap = serviceData.map((service) => ({
        url: `${baseUrl}/services/${service.slug}`,
        lastModified: now,
        changeFrequency: 'monthly' as const,
        priority: highPrioritySlugs.includes(service.slug) ? 0.9 : 0.7,
    }));

    // Helper to generate locale-prefixed service routes
    const generateLocaleRoutes = (locale: string): MetadataRoute.Sitemap => {
        const slugs = getAllServicePageSlugs(locale as 'en' | 'zh' | 'id');
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
    const idServiceRoutes = generateLocaleRoutes('id');

    return [...staticRoutes, ...serviceRoutes, ...enServiceRoutes, ...zhServiceRoutes, ...idServiceRoutes];
}
