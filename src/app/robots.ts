import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
    return {
        rules: [
            {
                userAgent: '*',
                // Do not block /_next/ — that hides JS/CSS from renderers and
                // hurts mobile-first indexing. Private app areas use noindex
                // meta instead of Disallow so crawlers can still read it.
                allow: '/',
                disallow: ['/api/'],
            },
        ],
        sitemap: 'https://www.veralexconsulting.com/sitemap.xml',
    };
}
