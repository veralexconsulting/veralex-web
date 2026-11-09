'use client';

import { useState, useEffect, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import { translations, Lang } from '@/lib/translations';

const URL_LANGS: readonly Lang[] = ['en', 'zh', 'id'];

function langFromPath(pathname: string): Lang | null {
    const seg = pathname.split('/')[1] as Lang;
    return URL_LANGS.includes(seg) ? seg : null;
}

export function useLang(): { t: (key: string) => string; lang: Lang; toggleLang: () => void; setLanguage: (newLang: Lang) => void } {
    const pathname = usePathname();
    const urlLang = langFromPath(pathname);
    // Public pages used to default to English, with a route-specific exception
    // for the trademark landing page. That made the homepage — the page with
    // the best chance of ranking — serve "Business Legality Done Right Zero
    // Hassle" to an audience typing "jasa pendirian PT".
    //
    // Indonesian is now the default on every public page. URL locales still
    // win (they are resolved first), and a manual language choice is still
    // honoured, so a visitor who picks English keeps English.
    const defaultLang: Lang = 'id';
    const [lang, setLang] = useState<Lang>(urlLang ?? defaultLang);

    useEffect(() => {
        const handler = (e: Event) => {
            const detail = (e as CustomEvent).detail as Lang;
            setLang(detail);
        };
        window.addEventListener('langchange', handler);

        const resolved = urlLang ?? ((localStorage.getItem('veralex-lang') as Lang | null) || defaultLang);
        const updateTimer = window.setTimeout(() => setLang(resolved), 0);
        document.documentElement.lang = resolved;

        return () => {
            window.clearTimeout(updateTimer);
            window.removeEventListener('langchange', handler);
        };
    }, [urlLang, defaultLang]);

    const setLanguage = useCallback((newLang: Lang) => {
        setLang(newLang);
        localStorage.setItem('veralex-lang', newLang);
        document.documentElement.lang = newLang;
        window.dispatchEvent(new CustomEvent('langchange', { detail: newLang }));
    }, []);

    const toggleLang = useCallback(() => {
        const nextMap: Record<Lang, Lang> = {
            id: 'en',
            en: 'zh',
            zh: 'id',
        };
        setLanguage(nextMap[lang] || 'en');
    }, [lang, setLanguage]);

    const t = useCallback(
        (key: string) => translations[lang]?.[key] || translations['en']?.[key] || key,
        [lang]
    );

    return { t, lang, toggleLang, setLanguage };
}
