'use client';

import { useState, useEffect, useCallback } from 'react';
import { translations, Lang } from '@/lib/translations';

export function useLang(): { t: (key: string) => string; lang: Lang } {
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

    const t = useCallback(
        (key: string) => translations[lang]?.[key] || key,
        [lang]
    );

    return { t, lang };
}
