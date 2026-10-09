'use client';
import Link from 'next/link';
import { useLang } from '@/lib/useLang';
const copy={
  en:{start:'For information on using the VERALEX client portal, read our',terms:'Terms & Conditions',and:'and',privacy:'Privacy Policy',end:'.'},
  id:{start:'Untuk informasi penggunaan portal klien VERALEX, baca',terms:'Syarat & Ketentuan',and:'dan',privacy:'Kebijakan Privasi',end:'.'},
  zh:{start:'有关使用 VERALEX 客户门户的信息，请阅读',terms:'条款与条件',and:'及',privacy:'隐私政策',end:'。'},
};
export default function PortalLegalNotice(){const {lang}=useLang();const t=copy[lang];const prefix=lang==='en'?'':`/${lang}`;return <p className="ws-muted ws-legal-notice">{t.start} <Link href={`${prefix}/terms-and-conditions`}>{t.terms}</Link> {t.and} <Link href={`${prefix}/privacy-policy`}>{t.privacy}</Link>{t.end}</p>;}
