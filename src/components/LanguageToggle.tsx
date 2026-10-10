'use client';

import { useState, useEffect, useRef } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useLang } from '@/lib/useLang';
import { Lang } from '@/lib/translations';
import { hasServicePage } from '@/lib/servicePageData';

const LANG_FLAGS: Record<Lang, string> = { en: '🇬🇧', id: '🇮🇩', zh: '🇨🇳' };
const LANG_NAMES: Record<Lang, string> = { en: 'English', id: 'Bahasa Indonesia', zh: '简体中文' };

export default function LanguageToggle({ className = '', compact = false }: { className?: string; compact?: boolean }) {
    const { lang, setLanguage } = useLang();
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);
    const pathname = usePathname();
    const router = useRouter();

    useEffect(() => {
        const onClickOutside = (e: PointerEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
        };
        const onEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setOpen(false);
        };
        document.addEventListener('pointerdown', onClickOutside);
        document.addEventListener('keydown', onEscape);
        return () => { document.removeEventListener('pointerdown', onClickOutside); document.removeEventListener('keydown', onEscape); };
    }, []);

    const handleSelect = (next: Lang) => {
        setLanguage(next);
        setOpen(false);

        const [, seg, ...rest] = pathname.split('/');
        const aboutSlug = seg === 'about-us' || (['en', 'id', 'zh'].includes(seg) && rest[0] === 'about-us');
        if (aboutSlug) { router.push(`${next === 'en' ? '' : `/${next}`}/about-us`); return; }
        const legalSlug = ['privacy-policy', 'terms-and-conditions'].includes(seg) ? seg : (['en','id','zh'].includes(seg) && ['privacy-policy','terms-and-conditions'].includes(rest[0]) ? rest[0] : null);
        if (legalSlug) { router.push(`${next === 'en' ? '' : `/${next}`}/${legalSlug}`); return; }
        const serviceSlug = seg === 'services' ? rest[0] : (['en', 'id', 'zh'].includes(seg) && rest[0] === 'services' ? rest[1] : null);
        if (serviceSlug) {
            router.push(hasServicePage(next, serviceSlug) ? (next === 'id' ? `/services/${serviceSlug}` : `/${next}/services/${serviceSlug}`) : '/#services');
            return;
        }
        if (seg === 'en' || seg === 'id' || seg === 'zh') {
            router.push(next === 'id' ? `/${rest.join('/')}` : `/${next}/${rest.join('/')}`);
        }
    };

    return (
        <div className={`flag-lang-toggle-wrapper${compact ? ' is-compact' : ''}`} ref={ref}>
            <button
                className={`flag-lang-toggle ${className}`}
                onClick={() => setOpen((v) => !v)}
                type="button"
                aria-label={`Language: ${LANG_NAMES[lang]}`}
                aria-haspopup="true"
                aria-expanded={open}
            >
                {compact ? <><svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c-3 3-3 15 0 18M12 3c3 3 3 15 0 18"/></svg><span>{lang.toUpperCase()}</span><span aria-hidden="true" className="flag-lang-caret">⌄</span></> : <><span className={`flag-lang-option${lang === 'en' ? ' active' : ''}`} aria-hidden="true">
                    🇬🇧
                </span>
                <span className={`flag-lang-option${lang === 'id' ? ' active' : ''}`} aria-hidden="true">
                    🇮🇩
                </span>
                <span className={`flag-lang-option${lang === 'zh' ? ' active' : ''}`} aria-hidden="true">
                    🇨🇳
                </span></>}
            </button>
            {open && (
                <div className="flag-lang-dropdown" role="group" aria-label="Languages">
                    {(Object.keys(LANG_NAMES) as Lang[]).map((l) => (
                        <button
                            key={l}
                            type="button"
                            aria-current={l === lang ? 'true' : undefined}
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
