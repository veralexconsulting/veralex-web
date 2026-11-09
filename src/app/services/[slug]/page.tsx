import { notFound } from 'next/navigation';
import { serviceData, getServiceBySlug, getAllSlugs } from '@/lib/serviceData';
import { serviceHreflangs } from '@/lib/servicePageData';
import type { Metadata } from 'next';
import ServiceDetailContent from '@/components/ServiceDetailContent';
import { serviceBreadcrumbs, serviceBreadcrumbJsonLd } from '@/lib/serviceBreadcrumbs';
import { detailedServiceContent, defaultFaqs, type FAQItem } from '@/lib/serviceContent';

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
        'hak-cipta': 'daftar hak cipta, jasa hak cipta DJKI, biaya hak cipta',
        'desain-industri': 'pendaftaran desain industri, jasa desain industri DJKI',
        'pt-pmdn': 'biaya pendirian PT, jasa pendirian PT, buat PT PMDN, syarat pendirian PT, pendirian PT online',
        'pt-pma': 'biaya PT PMA, jasa PT PMA, pendirian perusahaan asing Indonesia, foreign company Indonesia',
        'pt-perorangan': 'PT perorangan, biaya PT perorangan, syarat PT perorangan',
        'pendirian-cv': 'biaya pendirian CV, jasa pembuatan CV perusahaan, buat CV usaha',
        'itas-investor-1-tahun': 'ITAS investor Indonesia, jasa ITAS, biaya ITAS investor',
        'itas-investor-2-tahun': 'ITAS investor 2 tahun, jasa ITAS Indonesia',
        'kitas-kerja': 'jasa KITAS kerja, biaya KITAS, urus KITAS tenaga kerja asing, RPTKA DPKK',
        'sertifikasi-halal': 'jasa sertifikasi halal MUI, biaya halal certification, daftar halal',
        'izin-bpom': 'jasa izin BPOM, biaya izin edar BPOM, daftar BPOM makanan',
        'pirt': 'jasa pengurusan PIRT, biaya jasa PIRT per produk',
        'sertifikasi-k3l': 'jasa sertifikasi K3L, biaya jasa K3L',
        'sertifikasi-postel': 'jasa sertifikasi POSTEL, biaya jasa POSTEL',
        'sertifikasi-sni': 'jasa sertifikasi SNI, biaya SNI Indonesia',
    };
    const extraKeywords = serviceKeywordMap[slug] || `${service.title}, ${service.category}, jasa legalitas, konsultan hukum`;

    const priceCopy = service.priceNote ? service.priceNote.id : `Biaya jasa ${service.price}.`;
    const priceTitle = service.priceLabel === 'from' ? `Mulai ${service.price}` : service.price;
    return {
        title: `Jasa ${service.title} | VERALEX CONSULTING`,
        description: `${service.description} ${priceCopy}`,
        keywords: `jasa ${service.title.toLowerCase()}, ${extraKeywords}, veralex consulting, konsultan legalitas Bekasi, ${service.slug.replace(/-/g, ' ')}`,
        alternates: {
            canonical: `/services/${slug}`,
            languages: serviceHreflangs(slug),
        },
        openGraph: {
            title: `Jasa ${service.title} | VERALEX CONSULTING - ${priceTitle}`,
            description: `${service.description} ${priceCopy}`,
            url: `/services/${slug}`,
            type: 'website',
            // Generated per slug by scripts/build-og-images.mjs. Falls back to the
            // site card if a new service is added before the script is re-run.
            images: [
                {
                    url: `/og/${slug}.png`,
                    width: 1200,
                    height: 630,
                    alt: `Jasa ${service.title} — VERALEX CONSULTING`,
                },
            ],
            locale: 'id_ID',
        },
        twitter: {
            card: 'summary_large_image',
            title: `Jasa ${service.title} | VERALEX CONSULTING`,
            description: `${service.description} ${priceCopy}`,
            images: [`/og/${slug}.png`],
        },
    };
}

export default async function ServiceDetailPage({ params }: Props) {
    const { slug } = await params;
    const service = getServiceBySlug(slug);
    if (!service) notFound();

    const relatedServices = serviceData
        .filter((s) => s.slug !== slug && s.category === service.category)
        .slice(0, 4);

    /*
     * FAQPage markup. Until now the FAQ text rendered but carried no structured
     * data, so none of it was eligible for a rich result. The questions come
     * from the same object the page renders, so the markup can never drift from
     * what a visitor reads — which is exactly what Google penalises.
     */
    const detail = detailedServiceContent[slug];
    const faqSource: FAQItem[] = detail?.faqs?.length ? detail.faqs : defaultFaqs;
    const faqJsonLd = {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: faqSource.map((item) => ({
            '@type': 'Question',
            name: item.question,
            acceptedAnswer: { '@type': 'Answer', text: item.answer },
        })),
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(serviceBreadcrumbJsonLd(serviceBreadcrumbs(slug, 'id')))
                }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(faqJsonLd),
                }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "Service",
                        "@id": `https://www.veralexconsulting.com/services/${slug}#service`,
                        "name": service.title,
                        "alternateName": service.titleEn,
                        "description": service.description,
                        "serviceType": service.category,
                        "provider": {
                            "@type": "LegalService",
                            "@id": "https://www.veralexconsulting.com/#organization",
                            "name": "PT. Veralex Consulting Indonesia",
                            "url": "https://www.veralexconsulting.com",
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
                            ...(service.priceNote ? { "description": service.priceNote.id } : {}),
                            ...(service.priceUnit ? { "eligibleQuantity": { "@type": "QuantitativeValue", "value": 1, "unitText": service.priceUnit.id } } : {}),
                            "url": `https://www.veralexconsulting.com/services/${slug}`,
                            "availability": "https://schema.org/InStock",
                        },
                        "url": `https://www.veralexconsulting.com/services/${slug}`,
                    })
                }}
            />
            <ServiceDetailContent service={service} relatedServices={relatedServices} lang="id" />
        </>
    );
}
