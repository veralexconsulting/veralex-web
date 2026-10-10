import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import type { Lang } from '@/lib/translations';
import { ClientLocaleProvider,ClientPortalFrame } from '@/features/workspace/client-locale';
export const metadata:Metadata={title:'Project Invitation | VERALEX CONSULTING',robots:{index:false,follow:false,noarchive:true}};
export default async function Layout({children}:{children:React.ReactNode}){const value=(await cookies()).get('veralex-portal-lang')?.value;const lang:Lang=value==='id'||value==='zh'?value:'en';return <ClientLocaleProvider initialLanguage={lang}><ClientPortalFrame>{children}</ClientPortalFrame></ClientLocaleProvider>;}
