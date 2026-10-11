export const CONSENT_KEY = 'veralex-optional-tags';
export type ConsentChoice = 'accepted' | 'rejected' | null;

export function readConsent(store: Pick<Storage, 'getItem'>): ConsentChoice {
    const stored = store.getItem(CONSENT_KEY);
    return stored === 'accepted' || stored === 'rejected' ? stored : null;
}

export function writeConsent(store: Pick<Storage, 'setItem'>, next: Exclude<ConsentChoice, null>): ConsentChoice {
    store.setItem(CONSENT_KEY, next);
    return next;
}

/** Optional measurement never reads anything else. Rejecting means it stays off. */
export function optionalTagsAllowed(store: Pick<Storage, 'getItem'>): boolean {
    return readConsent(store) === 'accepted';
}