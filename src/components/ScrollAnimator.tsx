'use client';

import { useEffect } from 'react';

/*
 * Reveal-on-scroll.
 *
 * Two problems this version fixes, both of which showed up as "the page is
 * blank for a second, then everything pops in" on a phone:
 *
 *   1. The observer was created once on mount and only ever watched elements
 *      that already existed. Content rendered after that — e.g. anything
 *      re-created when the language resolves from localStorage on the first
 *      client pass — stayed at `opacity: 0` forever. Sections such as
 *      "Mengapa Legalitas Penting?" were measurable (350px + 452px of layout)
 *      but completely invisible.
 *
 *   2. The per-card stagger wrote inline `opacity: 0` + `translateY(30px)`
 *      and cleared it with setTimeout. When the section was already on screen
 *      at load, or the observer fired before the nodes were measured, cards
 *      could keep that inline style for the whole visit.
 *
 * Now: elements are observed when they mount (MutationObserver), the reveal is
 * a class rather than inline styles, and a safety net un-hides anything still
 * hidden after the page settles, so content can never be permanently invisible.
 * Everything degrades to "visible" when IntersectionObserver is unavailable or
 * motion is reduced.
 */
export default function ScrollAnimator() {
    useEffect(() => {
        const revealNow = () => {
            document
                .querySelectorAll('.fade-in:not(.visible), .slide-in-left:not(.visible), .slide-in-right:not(.visible)')
                .forEach((el) => el.classList.add('visible'));
        };

        if (typeof IntersectionObserver === 'undefined') {
            revealNow();
            return;
        }

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
        );

        const REVEAL = '.fade-in, .slide-in-left, .slide-in-right';
        const register = (el: Element) => {
            if (el.matches(REVEAL) && !el.classList.contains('visible')) observer.observe(el);
        };
        const observe = (root: ParentNode) => {
            if (root instanceof Element) register(root);
            root.querySelectorAll(REVEAL).forEach(register);
        };

        observe(document);

        // Catch elements that appear later (language resolution, client-only
        // sections, portals) instead of only the ones present at mount.
        const mutations = new MutationObserver((records) => {
            records.forEach((record) => {
                record.addedNodes.forEach((node) => {
                    if (node instanceof Element) observe(node);
                });
            });
        });
        mutations.observe(document.body, { childList: true, subtree: true });

        // Safety net: nothing on this page may stay invisible. If something
        // never intersected — a zero-height wrapper, a font swap that shifted
        // layout, a browser that fired no entries — reveal it once the page
        // has settled rather than leaving a blank screen.
        const settle = window.setTimeout(revealNow, 2500);

        return () => {
            observer.disconnect();
            mutations.disconnect();
            window.clearTimeout(settle);
        };
    }, []);

    return null;
}
