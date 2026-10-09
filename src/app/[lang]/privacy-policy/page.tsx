import { notFound, permanentRedirect } from 'next/navigation';
import type { Metadata } from 'next';
import LegalDocumentPage from '@/components/LegalDocumentPage';
import { legalMetadata } from '@/lib/legal/routes';
import type { Lang } from '@/lib/translations';
export function generateStaticParams(){return [{lang:'id'},{lang:'zh'}];}
export async function generateMetadata({params}:{params:Promise<{lang:string}>}):Promise<Metadata>{const {lang}=await params;return lang==='id'||lang==='zh'?legalMetadata('privacy-policy',lang as Lang):{};}
export default async function Page({params}:{params:Promise<{lang:string}>}){const {lang}=await params;if(lang==='en')permanentRedirect('/privacy-policy');if(lang!=='id'&&lang!=='zh')notFound();return <LegalDocumentPage kind="privacy-policy" lang={lang}/>;}
