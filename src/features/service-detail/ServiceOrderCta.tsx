/*
 * Client islands for the service detail page.
 *
 * Everything else on that page — headings, price, feature list, the long-form
 * sections and the FAQ text — is rendered on the server so it is present in the
 * HTML on first byte. These two components are the only parts that need
 * state, and they are kept deliberately small for that reason.
 */
'use client';

import OrderModal from '@/components/OrderModal';

interface OrderCtaProps {
    serviceTitle: string;
    servicePrice: string;
    label?: string;
    priceNote: string;
}

export function ServiceOrderCta({ serviceTitle, servicePrice, label, priceNote }: OrderCtaProps) {
    return <OrderModal serviceTitle={serviceTitle} servicePrice={servicePrice} label={label} priceNote={priceNote} />;
}
