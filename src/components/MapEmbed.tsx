'use client';

/*
 * The Google Maps embed is rendered straight away so visitors coming from a
 * search or an ad can see the office location without an extra tap. The
 * section sits below the fold in most viewports, so `loading="lazy"` keeps the
 * third-party scripts from competing with the hero for the first bytes.
 */
export default function MapEmbed({ src, title }: { src: string; title: string }) {
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
