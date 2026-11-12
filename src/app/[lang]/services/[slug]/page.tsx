import { notFound, permanentRedirect } from 'next/navigation';
import type { Metadata } from 'next';
import {
    getServicePageData,
    getAllServicePageSlugs,
    getRelatedServices,
    isUntranslatedLocalePage,
    isValidLocale,
    serviceHreflangs,
    type SupportedLocale,
} from '@/lib/servicePageData';
import ServicePageTemplate from '@/components/ServicePageTemplate';
import ServiceDetailContent from '@/components/ServiceDetailContent';
import { serviceData, getServiceBySlug } from '@/lib/serviceData';
import { serviceBreadcrumbs, serviceBreadcrumbJsonLd } from '@/lib/serviceBreadcrumbs';
import { pageDescription, pageTitle } from '@/lib/seoText';

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
        // Untranslated slug: the URL still renders (old links, ad landing pages)
        // but is noindexed and kept out of the sitemap. See docs/DECISIONS.md.
        const untranslated = isUntranslatedLocalePage(lang, slug);
        const catalogService = getServiceBySlug(slug);
        if (!catalogService) return {};
        const title = lang === 'zh' ? catalogService.titleZh : catalogService.titleEn;
        const description = lang === 'zh' ? catalogService.descriptionZh : catalogService.descriptionEn;
        const priceCopy = catalogService.priceNote?.[lang] || description;
        const metaTitle = pageTitle(title);
        const metaDescription = pageDescription(`${description} ${priceCopy}`);
        return {
            title: metaTitle,
            description: metaDescription,
            // Untranslated pages: noindex, and canonical pointing at the real
            // Indonesian page so any residual signal consolidates there
            // instead of onto a page we are asking Google to drop.
            ...(untranslated
                ? { robots: { index: false, follow: true }, alternates: { canonical: `/services/${slug}` } }
                : { alternates: { canonical: `/${lang}/services/${slug}`, languages: serviceHreflangs(slug) } }),
            openGraph: { title: metaTitle, description: metaDescription, url: `/${lang}/services/${slug}`, images: [{ url: '/logo.webp', alt: title }], locale: lang === 'zh' ? 'zh_CN' : 'en_US', type: 'website' },
        };
    }

    return {
        // EN/ZH metaTitle already ends in the brand name ("… — VERALEX
        // CONSULTING"), so no suffix is added; the helper only trims.
        title: pageTitle(service.title, { metaTitle: service.metaTitle, suffix: '' }),
        description: pageDescription(service.metaDescription),
        keywords: service.keywords,
        alternates: {
            canonical: `/${lang}/services/${slug}`,
            languages: serviceHreflangs(slug),
        },
        openGraph: {
            // EN/ZH metaTitle already ends in the brand name ("… — VERALEX
        // CONSULTING"), so no suffix is added; the helper only trims.
        title: pageTitle(service.title, { metaTitle: service.metaTitle, suffix: '' }),
            description: pageDescription(service.metaDescription),
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
        // No translated copy exists for this slug, so this URL renders the
        // Indonesian catalogue under a foreign prefix. It is kept (bookmarks,
        // ad landing pages) but must not be indexed: two prefixes showing the
        // same Indonesian text is exactly the duplicate-content pattern that
        // wastes crawl budget and splits ranking signals. See
        // docs/DECISIONS.md 2026-11-12.
        const untranslated = isUntranslatedLocalePage(lang, slug);
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
        // No structured data on a noindexed page: Service + Offer markup asks
        // for eligibility in search results the page is excluded from, and the
        // Service name would name Indonesian content in English.
        return <>
            {!untranslated && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />}
            <ServiceDetailContent service={catalogService} relatedServices={untranslated ? [] : serviceData.filter((item) => item.slug !== slug).slice(0, 4)} lang={lang} />
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
