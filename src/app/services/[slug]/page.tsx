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

    const serviceKeywordMap: Record<string, string> = {
        'pendaftaran-merek': 'biaya daftar merek dagang, pendaftaran merek DJKI, jasa merek dagang, daftar merek murah',
        'perpanjangan-merek': 'perpanjangan merek dagang, biaya perpanjangan merek DJKI',
        'pengalihan-merek': 'pengalihan hak merek, transfer merek dagang',
        'pendaftaran-hak-cipta': 'daftar hak cipta, jasa hak cipta DJKI, biaya hak cipta',
        'pendaftaran-desain-industri': 'pendaftaran desain industri, jasa desain industri DJKI',
        'pendirian-pt-pmdn': 'biaya pendirian PT, jasa pendirian PT, buat PT PMDN, syarat pendirian PT, pendirian PT online',
        'pendirian-pt-pma': 'biaya PT PMA, jasa PT PMA, pendirian perusahaan asing Indonesia, foreign company Indonesia',
        'pendirian-pt-perorangan': 'PT perorangan, biaya PT perorangan, syarat PT perorangan',
        'pendirian-cv': 'biaya pendirian CV, jasa pembuatan CV perusahaan, buat CV usaha',
        'itas-investor-1-tahun': 'ITAS investor Indonesia, jasa ITAS, biaya ITAS investor',
        'itas-investor-2-tahun': 'ITAS investor 2 tahun, jasa ITAS Indonesia',
        'kitas-kerja': 'jasa KITAS kerja, biaya KITAS, urus KITAS tenaga kerja asing, RPTKA DPKK',
        'sertifikasi-halal': 'jasa sertifikasi halal MUI, biaya halal certification, daftar halal',
        'izin-bpom': 'jasa izin BPOM, biaya izin edar BPOM, daftar BPOM makanan',
        'sertifikasi-sni': 'jasa sertifikasi SNI, biaya SNI Indonesia',
    };
    const extraKeywords = serviceKeywordMap[slug] || `${service.title}, ${service.category}, jasa legalitas, konsultan hukum`;

    return {
        title: `Jasa ${service.title} | Proses Cepat & Terpercaya - VERALEX CONSULTING`,
        description: `Jasa ${service.title} profesional oleh VERALEX CONSULTING. ${service.description} Harga mulai ${service.price}. Proses cepat, transparan, konsultasi GRATIS via WhatsApp!`,
        keywords: `jasa ${service.title.toLowerCase()}, ${extraKeywords}, veralex consulting, konsultan legalitas Bekasi, ${service.slug.replace(/-/g, ' ')}`,
        alternates: { canonical: `/services/${slug}` },
        openGraph: {
            title: `Jasa ${service.title} | VERALEX CONSULTING - Mulai ${service.price}`,
            description: `${service.description} Harga mulai ${service.price}. Konsultasi GRATIS!`,
            images: [{ url: '/logo.webp', alt: `Jasa ${service.title} - VERALEX CONSULTING` }],
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
