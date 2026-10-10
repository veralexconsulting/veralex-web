'use client';
import Link from 'next/link';
import { useClientLocale } from '@/features/workspace/client-locale';
export default function PortalLegalNotice(){const {lang,t}=useClientLocale();const prefix=lang==='en'?'':`/${lang}`;return <p className="ws-muted ws-legal-notice">{t('helpText')} <Link href={`${prefix}/terms-and-conditions`}>{t('legalTerms')}</Link> · <Link href={`${prefix}/privacy-policy`}>{t('legalPrivacy')}</Link></p>;}
