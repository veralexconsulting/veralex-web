import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import PortalShellLayout from './PortalShellLayout';
import type { Lang } from '@/lib/translations';

export const metadata:Metadata={title:'Client Portal | VERALEX CONSULTING',robots:{index:false,follow:false,noarchive:true}};
export default async function Layout({children}:{children:React.ReactNode}){const value=(await cookies()).get('veralex-portal-lang')?.value;const lang:Lang=value==='id'||value==='zh'?value:'en';return <PortalShellLayout initialLanguage={lang}>{children}</PortalShellLayout>;}
