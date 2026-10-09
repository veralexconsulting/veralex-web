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
    const legalDefault = pathname === '/privacy-policy' || pathname === '/terms-and-conditions' ? 'en' : 'id';

    // Prefixed routes own their locale (/en, /zh) so those pages never render
    // Indonesian copy. Unprefixed routes are the original Indonesian site, so
    // they default to 'id' — an explicit visitor choice still wins there.
    const [lang, setLang] = useState<Lang>(urlLang ?? legalDefault);

    useEffect(() => {
        const handler = (e: Event) => {
            const detail = (e as CustomEvent).detail as Lang;
            setLang(detail);
        };
        window.addEventListener('langchange', handler);

        const resolved = urlLang ?? (legalDefault === 'en' ? 'en' : ((localStorage.getItem('veralex-lang') as Lang | null) || 'id'));
        const updateTimer = window.setTimeout(() => setLang(resolved), 0);
        document.documentElement.lang = resolved;

        return () => {
            window.clearTimeout(updateTimer);
            window.removeEventListener('langchange', handler);
        };
    }, [urlLang, legalDefault]);

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
