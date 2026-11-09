'use client';

import Image from 'next/image';
import { useLang } from '@/lib/useLang';

const clientLogos = [
    { src: '/logoclient/IMG-20261030-WA0011.webp', name: 'PT Maryan Sejahtera Amerika', width: 496, height: 440 },
    { src: '/logoclient/IMG-20261030-WA0012.webp', name: 'PT Putra Sawar Sejeaterah', width: 496, height: 301 },
    { src: '/logoclient/IMG-20261030-WA0013.webp', name: 'PT Equinox Bali Ventures', width: 496, height: 313 },
    { src: '/logoclient/IMG-20261030-WA0014.webp', name: 'PT Multi Variasi Project', width: 496, height: 333 },
    { src: '/logoclient/IMG-20261030-WA0015.webp', name: 'PT Alshab Mens Nusantara', width: 472, height: 494 },
    { src: '/logoclient/IMG-20261030-WA0016.webp', name: 'PT Sakti Apparel Sejahtera', width: 496, height: 539 },
    { src: '/logoclient/IMG-20261030-WA0017.webp', name: 'PT Produksi Sendiri Betul', width: 496, height: 367 },
    { src: '/logoclient/IMG-20261030-WA0018.webp', name: 'HUADA Food & Spices', width: 337, height: 340 },
    { src: '/logoclient/IMG-20261109-WA0025.webp', name: 'Nexus PlayStation', width: 496, height: 176 },
    { src: '/logoclient/IMG-20261109-WA0026.webp', name: 'Nawasena Foundation', width: 496, height: 308 },
];

function LogoGroup({ duplicate = false }: { duplicate?: boolean }) {
    return (
        <ul className="client-logo-group" aria-hidden={duplicate || undefined}>
            {clientLogos.map((logo) => (
                <li className="client-logo-card" key={logo.src}>
                    <Image
                        src={logo.src}
                        alt={duplicate ? '' : logo.name}
                        width={logo.width}
                        height={logo.height}
                        sizes="(max-width: 600px) 104px, (max-width: 1024px) 132px, 156px"
                        loading="lazy"
                    />
                </li>
            ))}
        </ul>
    );
}

export default function ClientLogoMarquee() {
    const { t } = useLang();

    return (
        <section className="client-logo-section" aria-labelledby="client-logo-title">
            <div className="client-logo-heading">
                <span className="client-logo-rule" aria-hidden="true" />
                <h2 id="client-logo-title">{t('clients.logos.title')}</h2>
                <span className="client-logo-rule" aria-hidden="true" />
            </div>
            <div className="client-logo-marquee" aria-label={t('clients.logos.title')}>
                <div className="client-logo-run">
                    <LogoGroup />
                    <LogoGroup duplicate />
                </div>
            </div>
        </section>
    );
}
