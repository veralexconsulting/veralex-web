import { MetadataRoute } from 'next';
import { serviceData } from '@/lib/serviceData';

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = 'https://veralexconsulting.com';

    // Static routes
    const routes = [
        '',
        '/gallery',
    ].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date().toISOString().split('T')[0],
        changeFrequency: 'weekly' as const,
        priority: route === '' ? 1 : 0.8,
    }));

    // Dynamic service routes
    const serviceRoutes = serviceData.map((service) => ({
        url: `${baseUrl}/services/${service.slug}`,
        lastModified: new Date().toISOString().split('T')[0],
        changeFrequency: 'monthly' as const,
        priority: 0.7,
    }));

    return [...routes, ...serviceRoutes];
}
