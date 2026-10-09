import type { Metadata } from 'next';
import type { Lang } from '@/lib/translations';
import { privacyDocuments } from './privacy';
import { termsDocuments } from './terms';

export type LegalKind = 'privacy-policy' | 'terms-and-conditions';
export const legalDocuments = { 'privacy-policy': privacyDocuments, 'terms-and-conditions': termsDocuments };
export function legalHref(kind: LegalKind, lang: Lang) { return `${lang === 'en' ? '' : `/${lang}`}/${kind}`; }
export function legalMetadata(kind: LegalKind, lang: Lang): Metadata {
  const doc = legalDocuments[kind][lang];
  const path = legalHref(kind, lang);
  return {
    title: `${doc.title} | VERALEX CONSULTING`, description: doc.description,
    alternates: { canonical: path, languages: { en: legalHref(kind,'en'), id: legalHref(kind,'id'), 'zh-CN': legalHref(kind,'zh'), 'x-default': legalHref(kind,'en') } },
    openGraph: { title: `${doc.title} | VERALEX CONSULTING`, description: doc.description, url: path, type: 'article', locale: lang === 'zh' ? 'zh_CN' : lang === 'id' ? 'id_ID' : 'en_US', siteName: 'VERALEX CONSULTING' },
  };
}
