import { notFound, redirect } from 'next/navigation';
import type { Metadata } from 'next';
import {
    getServicePageData,
    getAllServicePageSlugs,
    getRelatedServices,
    isValidLocale,
    type SupportedLocale,
} from '@/lib/servicePageData';
import ServicePageTemplate from '@/components/ServicePageTemplate';

interface Props {
    params: Promise<{ lang: string; slug: string }>;
}

export async function generateStaticParams() {
    const locales: SupportedLocale[] = ['en', 'zh'];
    const params: { lang: string; slug: string }[] = [];

    locales.forEach((locale) => {
        const slugs = getAllServicePageSlugs(locale);
        slugs.forEach((slug) => {
            params.push({ lang: locale, slug });
        });
    });

    return params;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { lang, slug } = await params;

    if (!isValidLocale(lang)) return {};

    // Indonesian content lives on the unprefixed route — point crawlers there.
    if (lang === 'id') {
        return {
            alternates: { canonical: `/services/${slug}` },
        };
    }

    const service = getServicePageData(lang, slug);
    if (!service) return {};

    return {
        title: service.metaTitle,
        description: service.metaDescription,
        keywords: service.keywords,
        alternates: {
            canonical: lang === 'en' ? `/services/${slug}` : `/${lang}/services/${slug}`,
            languages: {
                'en': `/services/${slug}`,
                'id': `/services/${slug}`,
                'zh': `/zh/services/${slug}`,
            },
        },
        openGraph: {
            title: service.metaTitle,
            description: service.metaDescription,
            url: `/${lang}/services/${slug}`,
            images: [{ url: service.ogImage || '/logo.jpg', alt: service.title }],
            locale: lang === 'zh' ? 'zh_CN' : (lang === 'en' ? 'en_US' : 'id_ID'),
            type: 'website',
        },
    };
}

export default async function ServicePage({ params }: Props) {
    const { lang, slug } = await params;

    if (!isValidLocale(lang)) notFound();

    // The Indonesian version of this page is /services/[slug] — no id locale
    // copy exists, so send visitors to the real Indonesian page instead of
    // silently rendering the English one.
    if (lang === 'id') redirect(`/services/${slug}`);

    const service = getServicePageData(lang, slug);
    if (!service) notFound();

    const relatedServices = getRelatedServices(service);

    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'Service',
        name: service.title,
        description: service.intro,
        provider: {
            '@type': 'LegalService',
            name: 'VERALEX CONSULTING',
            url: 'https://veralexconsulting.com',
            telephone: '+6281219476385',
        },
        areaServed: {
            '@type': 'Country',
            name: 'Indonesia',
        },
        category: service.category,
        offers: {
            '@type': 'Offer',
            price: service.price.replace(/[^\d]/g, ''),
            priceCurrency: 'IDR',
            url: `https://veralexconsulting.com/${lang}/services/${slug}`,
        },
        url: `https://veralexconsulting.com/${lang}/services/${slug}`,
    };

    const breadcrumbLd = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
            {
                '@type': 'ListItem',
                position: 1,
                name: 'Home',
                item: `https://veralexconsulting.com/${lang}`,
            },
            {
                '@type': 'ListItem',
                position: 2,
                name: 'Services',
                item: `https://veralexconsulting.com/${lang}#services`,
            },
            {
                '@type': 'ListItem',
                position: 3,
                name: service.title,
                item: `https://veralexconsulting.com/${lang}/services/${slug}`,
            },
        ],
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
            />
            <ServicePageTemplate
                service={service}
                relatedServices={relatedServices}
                lang={lang}
            />
        </>
    );
}
