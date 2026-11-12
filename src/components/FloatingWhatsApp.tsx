'use client';

import { usePathname } from 'next/navigation';
import { useLang } from '@/lib/useLang';
import { whatsappHref } from '@/lib/marketing';

/**
 * Reads a service name for the prefilled WhatsApp message.
 *
 * The button is rendered in the root layout, which does not know which service
 * page it is above — so the name comes from the page itself: the H1 inside the
 * service hero. Reading it on the client keeps this out of the layout's server
 * data path and needs no prop threading through the chrome.
 *
 * Returns null on any other page, so the message stays the generic one there.
 */
function useServiceName(): string | null {
    const pathname = usePathname();

    /*
     * Derived on every render instead of held in state: the heading text is
     * readable synchronously after hydration, and a setState in an effect here
     * would render twice for something that never needs to be stored.
     */
    if (typeof document === 'undefined') return null;
    if (!/^\/(?:en\/|zh\/)?services\/[^/]+\/?$/.test(pathname)) return null;

    const heading =
        document.querySelector('.svc-title') ||
        document.querySelector('main h1') ||
        document.querySelector('h1');
    const text = heading?.textContent?.replace(/\s+/g, ' ').trim();
    return text ? text.slice(0, 90) : null;
}

export default function FloatingWhatsApp() {
    const { t } = useLang();
    const service = useServiceName();
    /*
     * The short form on the button itself: the first clause of the service
     * name, cut at a bracket or dash. "KITAS Kerja (1 Tahun)" reads as "KITAS
     * Kerja"; the full title still goes to WhatsApp.
     */
    const shortService = service ? service.split(/[(:，—–,]/)[0].trim().slice(0, 22) : '';

    /*
     * On a service page the message names the service and the page it came
     * from, so the reply can start from the right place instead of "which
     * service did you mean?".
     *
     * The URL is appended at click time. Building it during render would make
     * the server-rendered href (no window) differ from the client's (with
     * window), which React reports as a hydration mismatch.
     */
    const onNavigate = (event: React.MouseEvent<HTMLAnchorElement>) => {
        if (!service) return;
        const message = `${t('wa.message.service_lead')} ${service}\n${window.location.href}`;
        event.currentTarget.href = whatsappHref(message);
    };

    return (
        <a
            href={service ? whatsappHref(`${t('wa.message.service_lead')} ${service}`) : whatsappHref(t('wa.message.general'))}
            onClick={onNavigate}
            target="_blank"
            rel="noopener noreferrer"
            className="floating-whatsapp"
            aria-label={service ? `${t('floating.chat')} — ${service}` : t('floating.chat')}
            data-cta-location="floating"
        >
            <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            <span className="floating-wa-text">{shortService ? `${t('floating.chat')} · ${shortService}` : t('floating.chat')}</span>
        </a>
    );
}
