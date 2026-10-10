'use client';

import { useEffect } from 'react';
import { rememberCampaign, reportLeadEvent, trackLeadAction, withCampaignMessage } from '@/lib/marketing';

export default function MarketingTracking() {
    useEffect(() => {
        rememberCampaign();

        const onClick = (event: MouseEvent) => {
            const anchor = (event.target as Element | null)?.closest?.('a[href]') as HTMLAnchorElement | null;
            if (!anchor) return;
            const href = anchor.href;
            const service = anchor.dataset.service || window.location.pathname.match(/\/services\/([^/]+)/)?.[1] || 'general';
            const placement = anchor.dataset.ctaLocation ||
                (anchor.closest('header,nav') ? 'navigation' : anchor.closest('footer') ? 'footer' :
                    anchor.classList.contains('floating-whatsapp') ? 'floating' : 'content');

            if (href.startsWith('https://wa.me/')) {
                trackLeadAction('whatsapp_click', service, placement);
                reportLeadEvent('whatsapp_click', service, placement);
                anchor.href = withCampaignMessage(href);
            } else if (href.startsWith('tel:')) {
                trackLeadAction('phone_click', service, placement);
                reportLeadEvent('phone_click', service, placement);
            } else if (href.startsWith('mailto:')) {
                trackLeadAction('email_click', service, placement);
                reportLeadEvent('email_click', service, placement);
            }
        };

        document.addEventListener('click', onClick, true);
        return () => document.removeEventListener('click', onClick, true);
    }, []);

    return null;
}
