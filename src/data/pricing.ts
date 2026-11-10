/**
 * Single source of truth for PUBLIC pricing.
 *
 * Every price shown to a visitor — homepage package cards, promo banners,
 * WhatsApp prefilled messages, copy in `translations.ts` — must come from here
 * or from `src/lib/serviceData.ts`. No component, page or translation string
 * may contain a hand-typed "Rp…" amount. `scripts/check-pricing.mjs` enforces
 * that in CI.
 *
 * SERVICE PRICES (per-service, the 21-item catalogue plus what's included) stay
 * in `src/lib/serviceData.ts`; that file is already the authority for the
 * service pages and the long-form copy interpolates from it. This module covers
 * the PACKAGES (Starter / Investor / Premium) that combine services at a bundle
 * price — the one place prices were still hardcoded before.
 *
 * ── STATUS: awaiting Pasha ────────────────────────────────────────────────
 * The numbers below are the CURRENTLY DISPLAYED values, carried over verbatim
 * from `src/components/PricingSection.tsx` so behaviour is unchanged. They are
 * NOT confirmed as correct. Each is marked TODO(Pasha) until the business
 * states, for each package: the exact inclusions, whether the "was" price is a
 * genuine prior price (required for the strikethrough to be lawful), and the
 * promo window. Until then `promo.verified` is false.
 */

export type Currency = 'IDR';

export interface PromoTerms {
    /** Price before the promotion. Shown struck-through. Must be a real prior price. */
    originalPrice?: number;
    /** ISO date the promotion starts. */
    startsAt?: string;
    /** ISO date the promotion ends; the price reverts after this. */
    endsAt?: string;
    /** Human-readable terms shown next to the price. */
    terms?: string;
    /** True only once the business has confirmed the promo is real and current. */
    verified: false | true;
}

export interface PackagePrice {
    id: 'starter' | 'investor' | 'premium';
    currency: Currency;
    /** Current (promo) price in whole rupiah. */
    price: number;
    /** Unit the price applies to, for display, e.g. "paket" / "package". */
    unit: string;
    /** Service slugs bundled into this package (from `serviceData`). */
    includes: string[];
    promo?: PromoTerms;
    lastUpdated: string;
    /** False until the business has confirmed price + inclusions. */
    verified: false | true;
}

export const packages: PackagePrice[] = [
    {
        id: 'starter',
        currency: 'IDR',
        // TODO(Pasha): confirm Starter price and inclusions. Carried over from
        // PricingSection so nothing changes visually.
        price: 13_000_000,
        unit: 'paket',
        includes: ['pt-pmdn', 'pendaftaran-merek'],
        promo: {
            originalPrice: 16_000_000,
            // TODO(Pasha): is Rp16jt a genuine prior price? If not, the
            // strikethrough is misleading and fromPrice must drop originalPrice.
            terms: 'TODO(Pasha): masa promo dan syarat. Harga "sebelumnya" harus harga yang benar-benar pernah berlaku.',
            verified: false,
        },
        lastUpdated: '2026-11-10',
        verified: false,
    },
    {
        id: 'investor',
        currency: 'IDR',
        // TODO(Pasha): confirm Investor price and inclusions (currently PMA +
        // 1x ITAS 2 tahun + trademark + website).
        price: 36_000_000,
        unit: 'paket',
        includes: ['pt-pma', 'itas-investor-2-tahun', 'pendaftaran-merek'],
        promo: {
            originalPrice: 41_000_000,
            terms: 'TODO(Pasha): masa promo dan syarat.',
            verified: false,
        },
        lastUpdated: '2026-11-10',
        verified: false,
    },
    {
        id: 'premium',
        currency: 'IDR',
        // TODO(Pasha): confirm Premium price and inclusions (currently PMA +
        // 2x ITAS 2 tahun + trademark + website + priority handling).
        price: 49_000_000,
        unit: 'paket',
        includes: ['pt-pma', 'itas-investor-2-tahun', 'pendaftaran-merek'],
        promo: {
            originalPrice: 59_000_000,
            terms: 'TODO(Pasha): masa promo dan syarat.',
            verified: false,
        },
        lastUpdated: '2026-11-10',
        verified: false,
    },
];

export function getPackage(id: PackagePrice['id']): PackagePrice | undefined {
    return packages.find((item) => item.id === id);
}

/** Round rupiah -> "Rp13.000.000" using Indonesian thousands separators. */
export function formatRupiah(amount: number): string {
    return `Rp${amount.toLocaleString('id-ID')}`;
}
