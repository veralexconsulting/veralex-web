import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import PortalShellLayout from './PortalShellLayout';
import type { Lang } from '@/lib/translations';

const metadataTitles: Record<Lang, string> = {
  en: 'Client Portal | VERALEX CONSULTING',
  id: 'Portal Klien | VERALEX CONSULTING',
  zh: '客户门户 | VERALEX CONSULTING',
};

async function getLanguage(): Promise<Lang> {
  const value = (await cookies()).get('veralex-portal-lang')?.value;
  return value === 'id' || value === 'zh' ? value : 'en';
}

export async function generateMetadata(): Promise<Metadata> {
  const lang = await getLanguage();
  return {
    title: metadataTitles[lang],
    description: lang === 'id'
      ? 'Akses aman ke proyek klien VERALEX.'
      : lang === 'zh'
        ? '安全访问 VERALEX 客户项目。'
        : 'Secure access to your VERALEX client projects.',
    robots: { index: false, follow: false, noarchive: true },
  };
}

export default async function Layout({ children }: { children: React.ReactNode }) {
  return <PortalShellLayout initialLanguage={await getLanguage()}>{children}</PortalShellLayout>;
}
