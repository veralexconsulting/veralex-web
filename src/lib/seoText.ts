/**
 * Helpers that keep generated <title> and <meta name="description"> inside the
 * lengths Google actually shows: ~60 characters for a title, ~155 for a
 * description. Beyond that the tail is cut mid-sentence in results, which is
 * how the homepage ended up advertising "…VERALEX CONSULT".
 *
 * These never invent copy. They only shorten text the author already wrote,
 * cutting at a word boundary and appending an ellipsis.
 */

export const TITLE_MAX = 60;
export const DESCRIPTION_MAX = 155;

/** Shortens at the last word boundary that fits, appending "…". */
export function truncateWords(text: string, max: number): string {
    if (text.length <= max) return text;
    const cut = text.slice(0, max - 1);
    const boundary = cut.lastIndexOf(' ');
    return `${(boundary > max * 0.6 ? cut.slice(0, boundary) : cut).trimEnd()}…`;
}

/**
 * Builds a document title that never exceeds TITLE_MAX.
 *
 * Prefers `metaTitle` (the author's short version). Without one, the long
 * headline is shortened only as much as needed to leave room for `suffix`.
 * Pass `suffix: ''` when the brand is already inside the headline — appending
 * it would push the title over the limit and duplicate the name.
 */
export function pageTitle(headline: string, options: { metaTitle?: string; suffix?: string } = {}): string {
    const fullSuffix = options.suffix ?? ' | VERALEX CONSULTING';
    if (options.metaTitle) {
        // Append the brand only when it fits; otherwise drop it rather than
        // emit "… | VERALEX CONSUL" cut mid-word.
        const candidate = `${options.metaTitle}${fullSuffix}`;
        return candidate.length <= TITLE_MAX ? candidate : truncateWords(options.metaTitle, TITLE_MAX);
    }
    const suffix = fullSuffix;
    const room = TITLE_MAX - suffix.length;
    if (headline.length <= room) return `${headline}${suffix}`;
    // Drop the suffix rather than truncating the brand to a stump like
    // "| VERALEX CONSULT" — a full headline reads better than half a name.
    return truncateWords(headline, TITLE_MAX);
}

/** Description kept under DESCRIPTION_MAX without inventing words. */
export function pageDescription(description: string): string {
    return truncateWords(description, DESCRIPTION_MAX);
}
