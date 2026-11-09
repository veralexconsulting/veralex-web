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
  return { title: lang === 'zh' ? '关于我们 | VERALEX CONSULTING' : 'About Us | VERALEX CONSULTING', alternates: { canonical: lang === 'en' ? '/about-us' : `/${lang}/about-us` } };
}

export default async function Page({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (lang !== 'en' && lang !== 'zh' && lang !== 'id') notFound();
  return <AboutPage />;
}
