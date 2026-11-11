import { notFound, permanentRedirect } from 'next/navigation';
import type { Metadata } from 'next';
import {
    getServicePageData,
    getAllServicePageSlugs,
    getRelatedServices,
    isValidLocale,
    serviceHreflangs,
    type SupportedLocale,
} from '@/lib/servicePageData';
import ServicePageTemplate from '@/components/ServicePageTemplate';
import ServiceDetailContent from '@/components/ServiceDetailContent';
import { serviceData, getServiceBySlug } from '@/lib/serviceData';
import { serviceBreadcrumbs, serviceBreadcrumbJsonLd } from '@/lib/serviceBreadcrumbs';

interface Props {
    params: Promise<{ lang: string; slug: string }>;
}

export async function generateStaticParams() {
    const locales: SupportedLocale[] = ['en', 'zh'];
    const params: { lang: string; slug: string }[] = [];

    locales.forEach((locale) => {
        const slugs = [...new Set([...getAllServicePageSlugs(locale), ...serviceData.map((service) => service.slug)])];
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
    if (!service) {
        const catalogService = getServiceBySlug(slug);
        if (!catalogService) return {};
        const title = lang === 'zh' ? catalogService.titleZh : catalogService.titleEn;
        const description = lang === 'zh' ? catalogService.descriptionZh : catalogService.descriptionEn;
        const priceCopy = catalogService.priceNote?.[lang] || description;
        const metaTitle = `${title} | VERALEX CONSULTING`;
        return {
            title: metaTitle,
            description: `${description} ${priceCopy}`,
            alternates: { canonical: `/${lang}/services/${slug}`, languages: serviceHreflangs(slug) },
            openGraph: { title: metaTitle, description: `${description} ${priceCopy}`, url: `/${lang}/services/${slug}`, images: [{ url: '/logo.webp', alt: title }], locale: lang === 'zh' ? 'zh_CN' : 'en_US', type: 'website' },
        };
    }

    return {
        title: service.metaTitle,
        description: service.metaDescription,
        keywords: service.keywords,
        alternates: {
            canonical: `/${lang}/services/${slug}`,
            languages: serviceHreflangs(slug),
        },
        openGraph: {
            title: service.metaTitle,
            description: service.metaDescription,
            url: `/${lang}/services/${slug}`,
            images: [{ url: service.ogImage || '/logo.webp', alt: service.title }],
            locale: lang === 'zh' ? 'zh_CN' : 'en_US',
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
    if (lang === 'id') permanentRedirect(`/services/${slug}`);

    const service = getServicePageData(lang, slug);
    if (!service) {
        const catalogService = getServiceBySlug(slug);
        if (!catalogService) notFound();
        const title = lang === 'zh' ? catalogService.titleZh : catalogService.titleEn;
        const description = lang === 'zh' ? catalogService.descriptionZh : catalogService.descriptionEn;
        const priceNote = catalogService.priceNote?.[lang] || description;
        const jsonLd = {
            '@context': 'https://schema.org', '@type': 'Service', name: title,
            description: `${description} ${priceNote}`,
            provider: { '@type': 'LegalService', name: 'VERALEX CONSULTING', url: 'https://www.veralexconsulting.com', telephone: '+6281219476385' },
            areaServed: { '@type': 'Country', name: 'Indonesia' },
            category: lang === 'zh' ? catalogService.categoryZh : catalogService.categoryEn,
            offers: {
                '@type': 'Offer', price: catalogService.price.replace(/[^\d]/g, ''), priceCurrency: 'IDR',
                description: priceNote,
                ...(catalogService.priceUnit ? { eligibleQuantity: { '@type': 'QuantitativeValue', value: 1, unitText: catalogService.priceUnit[lang] } } : {}),
                url: `https://www.veralexconsulting.com/${lang}/services/${slug}`,
            },
            url: `https://www.veralexconsulting.com/${lang}/services/${slug}`,
        };
        return <>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceBreadcrumbJsonLd(serviceBreadcrumbs(slug, lang))) }} />
            <ServiceDetailContent service={catalogService} relatedServices={serviceData.filter((item) => item.slug !== slug).slice(0, 4)} lang={lang} />
        </>;
    }

    const relatedServices = getRelatedServices(service, lang);

    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'Service',
        name: service.title,
        description: service.intro,
        provider: {
            '@type': 'LegalService',
            name: 'VERALEX CONSULTING',
            url: 'https://www.veralexconsulting.com',
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
            url: `https://www.veralexconsulting.com/${lang}/services/${slug}`,
        },
        url: `https://www.veralexconsulting.com/${lang}/services/${slug}`,
    };

    const breadcrumbLd = serviceBreadcrumbJsonLd(serviceBreadcrumbs(slug, lang, service.title));

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
