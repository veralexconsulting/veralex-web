import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import AboutPage from '@/app/about-us/AboutPage';

export async function generateStaticParams() {
  // /zh/about-us could not be prerendered before, because without this the
  // dynamic [lang] segment was never asked to produce it — the sitemap listed
  // a URL that did not exist and would have 404'd. Only /zh is generated:
  // /en/about-us intentionally canonicalises to /about-us.
  return [{ lang: 'zh' }];
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  // /zh/about-us inherited the homepage description, so two indexable pages
  // shipped identical copy. It now has its own, in Chinese to match the page.
  const zh = lang === 'zh';
  return {
    title: zh ? '关于我们 | VERALEX CONSULTING' : 'About Us | VERALEX CONSULTING',
    description: zh
      ? 'VERALEX CONSULTING 是位于印尼勿加泗的企业法律服务顾问，专注公司设立、商标注册、签证居留与产品认证。'
      : undefined,
    alternates: { canonical: lang === 'en' ? '/about-us' : `/${lang}/about-us` },
  };
}

export default async function Page({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (lang !== 'en' && lang !== 'zh' && lang !== 'id') notFound();
  return <AboutPage />;
}
