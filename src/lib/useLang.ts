'use client';

import { useState, useEffect, useCallback } from 'react';
import { translations, Lang } from '@/lib/translations';

export function useLang(): { t: (key: string) => string; lang: Lang; toggleLang: () => void } {
    const [lang, setLang] = useState<Lang>('id');

    useEffect(() => {
        const saved = (localStorage.getItem('veralex-lang') || 'id') as Lang;
        setLang(saved);

        const handler = (e: Event) => {
            const detail = (e as CustomEvent).detail as Lang;
            setLang(detail);
        };
        window.addEventListener('langchange', handler);
        return () => window.removeEventListener('langchange', handler);
    }, []);

    const toggleLang = useCallback(() => {
        const next = lang === 'id' ? 'en' : 'id';
        setLang(next);
        localStorage.setItem('veralex-lang', next);
        document.documentElement.lang = next;
        window.dispatchEvent(new CustomEvent('langchange', { detail: next }));
    }, [lang]);

    const t = useCallback(
        (key: string) => translations[lang]?.[key] || key,
        [lang]
    );

    return { t, lang, toggleLang };
}
