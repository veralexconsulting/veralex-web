import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import type { Lang } from '@/lib/translations';
import { ClientLocaleProvider, ClientPortalFrame } from '@/features/workspace/client-locale';

const metadataTitles: Record<Lang, string> = {
  en: 'Project Invitation | VERALEX CONSULTING',
  id: 'Undangan Proyek | VERALEX CONSULTING',
  zh: '项目邀请 | VERALEX CONSULTING',
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
      ? 'Undangan aman untuk mengakses proyek klien VERALEX.'
      : lang === 'zh'
        ? '安全访问 VERALEX 客户项目的邀请。'
        : 'A secure invitation to access a VERALEX client project.',
    robots: { index: false, follow: false, noarchive: true },
  };
}

export default async function Layout({ children }: { children: React.ReactNode }) {
  return (
    <ClientLocaleProvider initialLanguage={await getLanguage()}>
      <ClientPortalFrame>{children}</ClientPortalFrame>
    </ClientLocaleProvider>
  );
}
