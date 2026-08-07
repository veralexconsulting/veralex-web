'use client';

import { useState, useEffect, useCallback } from 'react';
import { translations, Lang } from '@/lib/translations';

export function useLang(): { t: (key: string) => string; lang: Lang; toggleLang: () => void; setLanguage: (newLang: Lang) => void } {
    const [lang, setLang] = useState<Lang>('en');

    useEffect(() => {
        const saved = (localStorage.getItem('veralex-lang') || 'en') as Lang;
        setLang(saved);

        const handler = (e: Event) => {
            const detail = (e as CustomEvent).detail as Lang;
            setLang(detail);
        };
        window.addEventListener('langchange', handler);
        return () => window.removeEventListener('langchange', handler);
    }, []);

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
