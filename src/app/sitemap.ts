import { MetadataRoute } from 'next';
import { serviceData } from '@/lib/serviceData';

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
            url: `${baseUrl}/gallery`,
            lastModified: now,
            changeFrequency: 'monthly',
            priority: 0.6,
        },
    ];

    // Dynamic service routes — high priority services get higher scores
    const highPrioritySlugs = ['pt-pmdn', 'pt-pma', 'pendaftaran-merek', 'kitas-kerja'];
    const serviceRoutes: MetadataRoute.Sitemap = serviceData.map((service) => ({
        url: `${baseUrl}/services/${service.slug}`,
        lastModified: now,
        changeFrequency: 'monthly' as const,
        priority: highPrioritySlugs.includes(service.slug) ? 0.9 : 0.7,
    }));

    return [...staticRoutes, ...serviceRoutes];
}
