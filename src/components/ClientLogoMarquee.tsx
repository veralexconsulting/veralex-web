'use client';

import Image from 'next/image';
import { useLang } from '@/lib/useLang';

const clientLogos = [
    { src: '/logoclient/IMG-20260831-WA0013.jpg', name: 'Kantor Hukum Bimantara & Rekan', width: 1284, height: 1280 },
    { src: '/logoclient/IMG-20260831-WA0014.jpg', name: 'Vishala', width: 402, height: 402 },
    { src: '/logoclient/IMG-20260831-WA0015.jpg', name: 'THRST', width: 615, height: 277 },
    { src: '/logoclient/IMG-20260831-WA0016.jpg', name: 'Helmo', width: 944, height: 731 },
    { src: '/logoclient/IMG-20260831-WA0017.jpg', name: 'Chromatic', width: 787, height: 411 },
    { src: '/logoclient/IMG-20260831-WA0018.jpg', name: 'MotoMist', width: 785, height: 586 },
    { src: '/logoclient/IMG-20260831-WA0019.jpg', name: 'Everyday', width: 694, height: 274 },
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
                        sizes="(max-width: 600px) 116px, 148px"
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
