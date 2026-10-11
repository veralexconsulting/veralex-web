/**
 * Google reviews shown in the homepage testimonial section.
 *
 * PROVENANCE — read before editing anything here.
 *
 * Every entry is a verbatim Google review belonging to the VERALEX CONSULTING
 * business profile (Jl. Utama Raya No.348, Kayuringin Jaya, Bekasi Selatan 17144,
 * +62 812 1947 6385 — both match the phone and address used across this site).
 *
 * The text was transcribed from the review screenshots the business supplied in
 * `public/testimoniclient/`, then cross-checked against an independent record of
 * the same profile. Six of the eight captured reviews match character for
 * character across both sources; only those six are published. Nothing here is
 * paraphrased, translated or invented, and no name, rating, date or sentence was
 * invented to fill a slot.
 *
 * Two captured reviews are deliberately NOT published because the two sources
 * disagree on the wording and the screenshot is too blurred to settle it:
 *   - "Minza Qi"        screenshot "bnguet"  vs profile "bnaget"
 *   - "Sarikat Kasri"   screenshot unreadable vs profile "Slalu langganan..."
 * Re-check those against a fresh capture before adding them.
 *
 * Reviewer photos are not reproduced. Google does not license profile images for
 * reuse, so cards show initials instead.
 *
 * Dates: Google displays these relative to when the review was captured. The
 * screenshots were captured 2026-06-26, so "setahun lalu" resolves to 2025-06.
 * The one structured date available (2025-10-15) is used verbatim.
 *
 * PROFILE — 5.0 stars from 8 reviews. No Google Maps place ID was available to
 * this repository, and inventing one would produce a link to somebody else's
 * business, so the CTA uses Google's documented Maps place URL, anchored on the
 * verified name and address. Replace with the real `query_place_id` link if the
 * business supplies it.
 */

export interface GoogleReview {
    id: string;
    author: string;
    rating: number;
    /** Verbatim review text, original language, never rewritten. */
    text: string;
    /** Display month, derived from the relative label Google showed at capture. */
    month: string;
    /** Exact date, when Google supplied a structured one. */
    date?: string;
    /** How many reviews this author has on the profile, as displayed. */
    authorReviewCount: number;
}

export const googleBusinessProfile = {
    name: 'Veralex Consulting',
    rating: 5,
    reviewCount: 8,
    address: 'Jl. Utama Raya No.348, Kayuringin Jaya, Bekasi Selatan, 17144',
    phone: '+6281219476385',
    /** Google's documented Maps place URL format. No placeholder ID. */
    reviewsUrl: 'https://www.google.com/maps/search/?api=1&query=Veralex%20Consulting%20Jl.%20Utama%20Raya%20No.348%20Kayuringin%20Jaya%20Bekasi%20Selatan%2017144',
};

export const googleReviews: GoogleReview[] = [
    {
        id: 'hrd-recruitment157',
        author: 'hrd recruitment157',
        rating: 5,
        text: 'So far udah 7 merek yang dihandle veralex, never disappointed 👍👍',
        month: '2025-10',
        date: '2025-10-15',
        authorReviewCount: 1,
    },
    {
        id: 'julius-marselino',
        author: 'Julius Marselino',
        rating: 5,
        text: 'Makasih banyak pak proses pembuatan merek berjalan lancar dan cepat 👍',
        month: '2025-06',
        authorReviewCount: 3,
    },
    {
        id: 'shabrina-datue',
        author: 'shabrina datue',
        rating: 5,
        text: 'Daftarin merek di veralex terbaik banget',
        month: '2025-06',
        authorReviewCount: 1,
    },
    {
        id: 'tali-fansija',
        author: 'Tali Fansija',
        rating: 5,
        text: 'Fast respon banget dalam segalaelu kesah',
        month: '2025-06',
        authorReviewCount: 2,
    },
    {
        id: 'muhammad-ryan',
        author: 'MUHAMMAD RYAN',
        rating: 5,
        text: 'sangat memuaskan',
        month: '2025-06',
        authorReviewCount: 4,
    },
    {
        id: 'muhammad-faiz',
        author: 'Muhammad Faiz',
        rating: 5,
        text: 'pelayanan yang baik dan sat set',
        month: '2025-06',
        authorReviewCount: 5,
    },
];

/** Section cap. Six cards, all of them verified. */
export const MAX_REVIEWS = 6;