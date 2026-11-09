/**
 * Single source of truth for VERALEX contact points and social accounts.
 *
 * The footer, the contact section, and the Organization JSON-LD all read from
 * here, so an account can never be updated in one place and left stale — or
 * worse, published as schema.org `sameAs` while pointing somewhere else.
 */

export const contactEmail = 'veralexconsulting@gmail.com';

export interface SocialAccount {
    key: 'instagram' | 'threads' | 'tiktok' | 'facebook';
    label: string;
    handle: string;
    href: string;
}

export const socialAccounts: SocialAccount[] = [
    {
        key: 'instagram',
        label: 'Instagram',
        handle: '@veralex.consulting',
        href: 'https://www.instagram.com/veralex.consulting/',
    },
    {
        key: 'threads',
        label: 'Threads',
        handle: '@veralex.consulting',
        href: 'https://www.threads.com/@veralex.consulting',
    },
    {
        key: 'tiktok',
        label: 'TikTok',
        handle: '@veralexconsulting',
        href: 'https://www.tiktok.com/@veralexconsulting',
    },
    {
        key: 'facebook',
        label: 'Facebook',
        handle: 'Veralex.consulting',
        href: 'https://www.facebook.com/people/Veralexconsulting/61576702202285/',
    },
];
