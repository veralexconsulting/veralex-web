'use client';

import { useState } from 'react';

/*
 * The Google Maps embed used to load on every homepage visit. `loading="lazy"`
 * does not help here: the contact section sits well inside the initial
 * viewport on mobile, so the browser fetched the whole embed anyway — 4
 * third-party scripts totalling ~330 KB (places.js 98 KB, main.js 85 KB,
 * init_embed.js 74 KB, util.js 71 KB) and the main-thread work that comes with
 * them, all competing with the hero for the first byte budget.
 *
 * It now loads only when the visitor asks for the map. Until then the space is
 * a link to the same place on Google Maps, so nothing is lost by not loading
 * it: the address is already written out next to it.
 */
export default function MapEmbed({ src, title, label }: { src: string; title: string; label: string }) {
    const [loaded, setLoaded] = useState(false);

    if (!loaded) {
        return (
            <button type="button" className="contact-map-placeholder" onClick={() => setLoaded(true)} aria-label={label}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                    <path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>{label}</span>
            </button>
        );
    }

    return (
        <iframe
            src={src}
            title={title}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
        />
    );
}
