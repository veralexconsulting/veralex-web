'use client';
import { useEffect, useState } from 'react';
import { useLang } from '@/lib/useLang';
import { readConsent, writeConsent, type ConsentChoice } from '@/lib/consent';
import GoogleTagManager from './GoogleTagManager';
import MarketingTracking from './MarketingTracking';
import './cookie-preferences.css';

// Google Tag Manager is optional. First-party click measurement is not: without
// it the owner dashboard stays empty, so it must not depend on a GTM container.
const gtm = Boolean(process.env.NEXT_PUBLIC_GTM_ID && /^GTM-[A-Z0-9]+$/.test(process.env.NEXT_PUBLIC_GTM_ID));

export default function CookiePreferences() {
    const { t, lang } = useLang();
    const [choice, setChoice] = useState<ConsentChoice>(null);
    const [ready, setReady] = useState(false);
    const [open, setOpen] = useState(false);
    const policy = lang === 'en' ? '/privacy-policy' : `/${lang}/privacy-policy`;
    const visible = ready && (open || choice === null);

    useEffect(() => {
        const timer = window.setTimeout(() => { setChoice(readConsent(localStorage)); setReady(true); }, 0);
        const show = () => setOpen(true);
        window.addEventListener('veralex-cookie-settings', show);
        return () => { window.clearTimeout(timer); window.removeEventListener('veralex-cookie-settings', show); };
    }, []);

    // The floating WhatsApp widget shares the bottom of the screen on mobile.
    // Hiding only that widget keeps ordinary WhatsApp links working everywhere.
    useEffect(() => {
        document.documentElement.toggleAttribute('data-consent-open', visible);
        return () => document.documentElement.removeAttribute('data-consent-open');
    }, [visible]);

    function choose(next: Exclude<ConsentChoice, null>) {
        // Unmounting the tags is the only way to guarantee they stop sending, so
        // a withdrawal reloads the page. Accepting needs no reload.
        const withdrawing = choice === 'accepted' && next === 'rejected';
        setChoice(writeConsent(localStorage, next));
        setOpen(false);
        if (withdrawing) window.location.reload();
    }

    return <>
        {ready && choice === 'accepted' && <>{gtm && <GoogleTagManager />}<MarketingTracking /></>}
        {visible && (
            <div className="cookie-panel" role="dialog" aria-modal="false" aria-labelledby="cookie-title" aria-describedby="cookie-body">
                <strong id="cookie-title">{t('consent.title')}</strong>
                <p id="cookie-body">{t('consent.body')}</p>
                {open && choice && <small className="cookie-current">{t('consent.current')} {choice === 'accepted' ? t('consent.allow') : t('consent.reject')}</small>}
                <div className="cookie-actions">
                    <button type="button" className="cookie-reject" onClick={() => choose('rejected')}>{t('consent.reject')}</button>
                    <button type="button" className="cookie-allow" onClick={() => choose('accepted')}>{t('consent.allow')}</button>
                </div>
                <div className="cookie-meta">
                    <a href={policy}>{t('consent.policy')}</a>
                    {open && <button type="button" onClick={() => setOpen(false)}>{t('consent.close')}</button>}
                </div>
            </div>
        )}
    </>;
}