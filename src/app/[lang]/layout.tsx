import { notFound } from 'next/navigation';
import type { Viewport } from 'next';

/*
 * The document language has to be set on <html>, which the root layout owns.
 * Next.js cannot vary that attribute per route from a nested layout, so this
 * layout sets it from the client on mount (the document element is already
 * rendered by then). Without it every /en and /zh page is announced as
 * Indonesian by screen readers, and search engines read the wrong language
 * signal for a site that publishes in three languages.
 */
const LOCALES = ['en', 'zh'] as const;
type Locale = (typeof LOCALES)[number];

function isLocale(value: string): value is Locale {
  return (LOCALES as readonly string[]).includes(value);
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default async function LangLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}>) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  return (
    <>
      <LangDocument lang={lang} />
      {children}
    </>
  );
}

/** Tiny client boundary: an inline script runs before paint, so assistive
 *  technology and crawlers read the corrected attribute immediately. */
function LangDocument({ lang }: { lang: Locale }) {
  return <script dangerouslySetInnerHTML={{ __html: `document.documentElement.lang=${JSON.stringify(lang)}` }} />;
}
