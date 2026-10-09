'use client';

import { useState, useEffect, useRef } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useLang } from '@/lib/useLang';
import { Lang } from '@/lib/translations';

const LANG_FLAGS: Record<Lang, string> = { en: '🇬🇧', id: '🇮🇩', zh: '🇨🇳' };
const LANG_NAMES: Record<Lang, string> = { en: 'English', id: 'Indonesia', zh: '中文' };

export default function LanguageToggle({ className = '' }: { className?: string }) {
    const { lang, setLanguage } = useLang();
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);
    const pathname = usePathname();
    const router = useRouter();

    useEffect(() => {
        const onClickOutside = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
        };
        document.addEventListener('mousedown', onClickOutside);
        return () => document.removeEventListener('mousedown', onClickOutside);
    }, []);

    const handleSelect = (next: Lang) => {
        setLanguage(next);
        setOpen(false);

        const [, seg, ...rest] = pathname.split('/');
        const legalSlug = ['privacy-policy', 'terms-and-conditions'].includes(seg) ? seg : (['en','id','zh'].includes(seg) && ['privacy-policy','terms-and-conditions'].includes(rest[0]) ? rest[0] : null);
        if (legalSlug) { router.push(`${next === 'en' ? '' : `/${next}`}/${legalSlug}`); return; }
        if (seg === 'en' || seg === 'id' || seg === 'zh') {
            router.push(`/${next}/${rest.join('/')}`);
        }
    };

    return (
        <div className="flag-lang-toggle-wrapper" ref={ref}>
            <button
                className={`flag-lang-toggle ${className}`}
                onClick={() => setOpen((v) => !v)}
                type="button"
                aria-label="Change language / Switch language"
                aria-haspopup="listbox"
                aria-expanded={open}
            >
                <span className={`flag-lang-option${lang === 'en' ? ' active' : ''}`} aria-hidden="true">
                    🇬🇧
                </span>
                <span className={`flag-lang-option${lang === 'id' ? ' active' : ''}`} aria-hidden="true">
                    🇮🇩
                </span>
                <span className={`flag-lang-option${lang === 'zh' ? ' active' : ''}`} aria-hidden="true">
                    🇨🇳
                </span>
            </button>
            {open && (
                <div className="flag-lang-dropdown" role="listbox">
                    {(Object.keys(LANG_NAMES) as Lang[]).map((l) => (
                        <button
                            key={l}
                            type="button"
                            role="option"
                            aria-selected={l === lang}
                            className={`flag-lang-dropdown-option${l === lang ? ' active' : ''}`}
                            onClick={() => handleSelect(l)}
                        >
                            <span className="flag-lang-dropdown-flag" aria-hidden="true">
                                {LANG_FLAGS[l]}
                            </span>
                            <span className="flag-lang-dropdown-name">{LANG_NAMES[l]}</span>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
