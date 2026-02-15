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
        description: `${service.description} Harga: ${service.price}. Konsultasi GRATIS!`,
        alternates: { canonical: `/services/${slug}` },
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
        <ServiceDetailContent service={service} relatedServices={relatedServices} />
    );
}
