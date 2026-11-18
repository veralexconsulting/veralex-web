'use client';

import { useEffect } from 'react';

/*
 * Reveal-on-scroll.
 *
 * Three problems this version fixes, all of which could leave content
 * invisible on a phone:
 *
 *   1. The observer was created once on mount and only ever watched elements
 *      that already existed. Content rendered after that — e.g. anything
 *      re-created when the language resolves from localStorage on the first
 *      client pass — stayed at `opacity: 0` forever.
 *
 *   2. The per-card stagger wrote inline `opacity: 0` + `translateY(30px)`
 *      and cleared it with setTimeout. When the section was already on screen
 *      at load, or the observer fired before the nodes were measured, cards
 *      could keep that inline style for the whole visit.
 *
 *   3. Revealed elements are marked by adding the `visible` class directly to
 *      the DOM, but React components don't include `visible` in their JSX
 *      className. When a component re-renders (e.g. toggling an accordion),
 *      React overwrites the class attribute and strips `visible`, snapping the
 *      element back to `opacity: 0`. We remember revealed elements and re-apply
 *      `visible` if React removes it.
 *
 * Elements are observed when they mount (MutationObserver), the reveal is a
 * class rather than inline styles, and a safety net un-hides anything still
 * hidden after the page settles, so content can never be permanently invisible.
 * Everything degrades to "visible" when IntersectionObserver is unavailable or
 * motion is reduced.
 */
export default function ScrollAnimator() {
    useEffect(() => {
        const REVEAL = '.fade-in, .slide-in-left, .slide-in-right';
        const revealed = new WeakSet<Element>();

        const revealNow = () => {
            document.querySelectorAll(REVEAL).forEach((el) => {
                revealed.add(el);
                el.classList.add('visible');
            });
        };

        if (typeof IntersectionObserver === 'undefined') {
            revealNow();
            return;
        }

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        revealed.add(entry.target);
                        entry.target.classList.add('visible');
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
        );

        const register = (el: Element) => {
            if (!el.matches(REVEAL)) return;
            if (revealed.has(el) || el.classList.contains('visible')) {
                // Preserve reveal across React re-renders that clobber className.
                revealed.add(el);
                el.classList.add('visible');
                return;
            }
            observer.observe(el);
        };
        const observe = (root: ParentNode) => {
            if (root instanceof Element) register(root);
            root.querySelectorAll(REVEAL).forEach(register);
        };

        observe(document);

        // Catch elements that appear later (language resolution, client-only
        // sections, portals) and restore `visible` if React re-renders strip it.
        const mutations = new MutationObserver((records) => {
            records.forEach((record) => {
                if (record.type === 'childList') {
                    record.addedNodes.forEach((node) => {
                        if (node instanceof Element) observe(node);
                    });
                } else if (record.type === 'attributes') {
                    const el = record.target;
                    if (el instanceof Element && revealed.has(el) && !el.classList.contains('visible')) {
                        el.classList.add('visible');
                    }
                }
            });
        });
        mutations.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['class'],
        });

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
