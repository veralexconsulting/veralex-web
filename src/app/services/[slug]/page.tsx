import { notFound } from 'next/navigation';
import { serviceData, getServiceBySlug, getAllSlugs } from '@/lib/serviceData';
import type { Metadata } from 'next';
import ServiceDetailContent from '@/components/ServiceDetailContent';

interface Props {
    params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
    return getAllSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const service = getServiceBySlug(slug);
    if (!service) return {};
    return {
        title: `${service.title} | VERALEX CONSULTING`,
        description: `${service.description} Kami melayani pengurusan ${service.title} dengan proses cepat, legal, dan transparan. Harga: ${service.price}. Konsultasi GRATIS!`,
        keywords: `${service.title}, ${service.category}, jasa legalitas, veralex consulting, pendirian usaha, izin usaha, ${service.slug.replace(/-/g, ' ')}`,
        alternates: { canonical: `/services/${slug}` },
        openGraph: {
            title: `${service.title} | VERALEX CONSULTING`,
            description: service.description,
            images: [{ url: '/logo.jpg' }],
        },
    };
}

export default async function ServiceDetailPage({ params }: Props) {
    const { slug } = await params;
    const service = getServiceBySlug(slug);
    if (!service) notFound();

    const relatedServices = serviceData
        .filter((s) => s.slug !== slug)
        .slice(0, 4);

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "BreadcrumbList",
                        "itemListElement": [
                            {
                                "@type": "ListItem",
                                "position": 1,
                                "name": "Home",
                                "item": "https://veralexconsulting.com"
                            },
                            {
                                "@type": "ListItem",
                                "position": 2,
                                "name": "Services",
                                "item": "https://veralexconsulting.com/#services"
                            },
                            {
                                "@type": "ListItem",
                                "position": 3,
                                "name": service.title,
                                "item": `https://veralexconsulting.com/services/${slug}`
                            }
                        ]
                    })
                }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "Service",
                        "name": service.title,
                        "alternateName": service.titleEn,
                        "description": service.description,
                        "provider": {
                            "@type": "LegalService",
                            "name": "VERALEX CONSULTING",
                            "url": "https://veralexconsulting.com",
                            "telephone": "+6281219476385",
                        },
                        "areaServed": {
                            "@type": "Country",
                            "name": "Indonesia",
                        },
                        "category": service.category,
                        "offers": {
                            "@type": "Offer",
                            "price": service.price.replace(/[^\d]/g, ''),
                            "priceCurrency": "IDR",
                            "url": `https://veralexconsulting.com/services/${slug}`,
                        },
                        "url": `https://veralexconsulting.com/services/${slug}`,
                    })
                }}
            />
            <ServiceDetailContent service={service} relatedServices={relatedServices} />
        </>
    );
}
