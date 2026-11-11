/**
 * Single source of truth for PUBLIC pricing.
 *
 * Every price shown to a visitor — homepage package cards, WhatsApp prefilled
 * messages, copy in `translations.ts` — must come from here or from
 * `src/lib/serviceData.ts`. No component, page or translation string may
 * contain a hand-typed "Rp…" amount. `scripts/check-pricing.mjs` enforces that
 * in CI.
 *
 * SERVICE PRICES (per-service, the 21-item catalogue plus what's included) stay
 * in `src/lib/serviceData.ts`; that file is already the authority for the
 * service pages and the long-form copy interpolates from it. This module covers
 * the PACKAGES (Starter / Investor / Premium) that combine services at a bundle
 * price.
 *
 * ── STATUS (decided by Pasha, 2026-11-11) ─────────────────────────────────
 * All struck-through "was" prices were removed: there was no genuine prior
 * price, so months of strikethrough were misleading and are now gone. Only the
 * single current price is shown. `verified: true` means the business has
 * confirmed the price figure; `includes` is still TODO(Pasha) — the package
 * contents are not yet confirmed and must not be presented as final.
 */

export type Currency = 'IDR';

export interface PackagePrice {
    id: 'starter' | 'investor' | 'premium';
    currency: Currency;
    /** Current public price, whole rupiah. The only price shown. */
    price: number;
    /** Unit the price applies to, for display, e.g. "paket" / "package". */
    unit: string;
    /** Service slugs bundled into this package (from `serviceData`). */
    includes: string[];
    lastUpdated: string;
    /** True once the business has confirmed this price figure. */
    verified: false | true;
}

export const packages: PackagePrice[] = [
    {
        id: 'starter',
        currency: 'IDR',
        // Price confirmed by Pasha (2026-11-11). Inclusions still TODO(Pasha).
        price: 13_000_000,
        unit: 'paket',
        includes: ['pt-pmdn', 'pendaftaran-merek'],
        lastUpdated: '2026-11-11',
        verified: true,
    },
    {
        id: 'investor',
        currency: 'IDR',
        // Price confirmed by Pasha (2026-11-11). Inclusions still TODO(Pasha).
        price: 36_000_000,
        unit: 'paket',
        includes: ['pt-pma', 'itas-investor-2-tahun', 'pendaftaran-merek'],
        lastUpdated: '2026-11-11',
        verified: true,
    },
    {
        id: 'premium',
        currency: 'IDR',
        // Price confirmed by Pasha (2026-11-11). Inclusions still TODO(Pasha).
        price: 49_000_000,
        unit: 'paket',
        includes: ['pt-pma', 'itas-investor-2-tahun', 'pendaftaran-merek'],
        lastUpdated: '2026-11-11',
        verified: true,
    },
];

export function getPackage(id: PackagePrice['id']): PackagePrice | undefined {
    return packages.find((item) => item.id === id);
}

/** Whole rupiah -> "Rp13.000.000" using Indonesian thousands separators. */
export function formatRupiah(amount: number): string {
    return `Rp${amount.toLocaleString('id-ID')}`;
}
