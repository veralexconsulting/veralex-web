export const PUBLIC_EVENT_NAMES = ['whatsapp_click', 'phone_click', 'email_click'] as const;
export type PublicEventName = typeof PUBLIC_EVENT_NAMES[number];

export type PublicEvent = {
    event: PublicEventName;
    pagePath: string;
    service: string;
    placement: string;
    locale: string;
    visitorToken: string | null;
    campaign: { utm_source?: string; utm_medium?: string; utm_campaign?: string } | null;
};

// Private app areas never publish click events, so a crafted payload cannot
// inflate or pollute owner analytics.
const PRIVATE_PREFIXES = ['/aksesraffi', '/admin', '/portal', '/dashboard', '/auth', '/invite', '/api', '/workspace'];

const token = (value: unknown, pattern: RegExp, limit: number): string => {
    const text = typeof value === 'string' ? value.trim() : '';
    return pattern.test(text) && text.length <= limit ? text : '';
};

export function sanitizeEvent(value: unknown): PublicEventName | null {
    return PUBLIC_EVENT_NAMES.includes(value as PublicEventName) ? (value as PublicEventName) : null;
}

export function sanitizePagePath(value: unknown): string | null {
    const text = token(value, /^\/[A-Za-z0-9/_.~-]*$/, 300);
    if (!text || text.includes('//') || text.includes('..')) return null;
    return PRIVATE_PREFIXES.some(prefix => text === prefix || text.startsWith(`${prefix}/`)) ? null : text;
}

export function sanitizeLocale(value: unknown): string {
    return value === 'en' || value === 'zh' ? value : 'id';
}

export function sanitizeCampaign(value: unknown): PublicEvent['campaign'] {
    if (typeof value !== 'object' || value === null) return null;
    const source = value as Record<string, unknown>;
    const campaign = {
        utm_source: token(source.utm_source, /^[A-Za-z0-9_-]{1,80}$/, 80),
        utm_medium: token(source.utm_medium, /^[A-Za-z0-9_-]{1,80}$/, 80),
        utm_campaign: token(source.utm_campaign, /^[A-Za-z0-9_-]{1,80}$/, 80),
    };
    return Object.values(campaign).some(Boolean) ? campaign : null;
}

/** Whitelist only. Optional fields that arrive malformed are dropped, but a
 *  field that is present and wrong rejects the event instead of silently
 *  becoming an empty string, so junk cannot inflate the click counts. */
export function sanitizePublicEvent(body: unknown): PublicEvent | null {
    if (typeof body !== 'object' || body === null) return null;
    const input = body as Record<string, unknown>;
    const event = sanitizeEvent(input.event);
    const pagePath = sanitizePagePath(input.page_path);
    if (!event || !pagePath) return null;
    const service = token(input.service, /^[a-z0-9-]{1,120}$/, 120);
    const placement = token(input.placement, /^[a-z0-9_-]{1,60}$/, 60);
    if ((input.service && !service) || (input.placement && !placement)) return null;
    return {
        event,
        pagePath,
        service,
        placement,
        locale: sanitizeLocale(input.locale),
        visitorToken: token(input.visitor_token, /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/, 36) || null,
        campaign: sanitizeCampaign(input.campaign),
    };
}
