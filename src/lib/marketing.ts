export const WHATSAPP_NUMBER = '6281219476385';

export function whatsappHref(message: string): string {
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

export type LeadEvent = 'whatsapp_click' | 'phone_click' | 'email_click';

type CampaignContext = Partial<Record<'utm_source' | 'utm_medium' | 'utm_campaign' | 'utm_term' | 'utm_content' | 'gclid' | 'landing_path', string>>;

const STORAGE_KEY = 'veralex_campaign';
const CAMPAIGN_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'gclid'] as const;

declare global {
    interface Window {
        dataLayer?: Record<string, unknown>[];
    }
}

function safeValue(value: string | null): string | undefined {
    return value?.replace(/[\r\n<>]/g, '').slice(0, 120) || undefined;
}

export function rememberCampaign(): void {
    try {
        const url = new URL(window.location.href);
        const previous = JSON.parse(sessionStorage.getItem(STORAGE_KEY) || '{}') as CampaignContext;
        const next: CampaignContext = { ...previous };
        let changed = false;
        for (const key of CAMPAIGN_KEYS) {
            const value = safeValue(url.searchParams.get(key));
            if (value && ['utm_source', 'utm_medium', 'utm_campaign'].includes(key) && !/^[A-Za-z0-9_-]{1,80}$/.test(value)) continue;
            if (value) { next[key] = value; changed = true; }
        }
        if (changed) {
            next.landing_path = previous.landing_path || url.pathname;
            sessionStorage.setItem(STORAGE_KEY, JSON.stringify(next));
        }
    } catch { /* storage may be disabled */ }
}

function campaign(): CampaignContext {
    try { return JSON.parse(sessionStorage.getItem(STORAGE_KEY) || '{}') as CampaignContext; }
    catch { return {}; }
}

export function trackLeadAction(event: LeadEvent, service: string, ctaLocation: string): void {
    const { utm_source, utm_medium, utm_campaign, landing_path } = campaign();
    // Google tags handle auto-tagging. Search terms, click IDs and message text
    // never enter our custom conversion events.
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
        event,
        service,
        page_path: window.location.pathname,
        cta_location: ctaLocation,
        ...(landing_path ? { landing_path } : {}),
        ...(utm_source ? { utm_source } : {}),
        ...(utm_medium ? { utm_medium } : {}),
        ...(utm_campaign ? { utm_campaign } : {}),
    });
}

export function withCampaignMessage(href: string): string {
    const { utm_source, utm_medium, utm_campaign } = campaign();
    if (!utm_source && !utm_medium && !utm_campaign) return href;
    const url = new URL(href);
    if (url.hostname !== 'wa.me') return href;
    const current = url.searchParams.get('text') || '';
    const labels = ['Referensi kampanye:', 'Campaign reference:', '活动来源：'];
    if (labels.some((label) => current.includes(label))) return href;
    const lang = document.documentElement.lang;
    const label = lang.startsWith('zh') ? labels[2] : lang.startsWith('en') ? labels[1] : labels[0];
    const detail = [utm_source, utm_medium, utm_campaign].filter(Boolean).join(' / ');
    url.searchParams.set('text', `${current}\n\n${label} ${detail}`);
    return url.toString();
}
