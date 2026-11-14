import { notFound } from 'next/navigation';
import type { Viewport } from 'next';

/*
 * The document language has to be set on <html>, which the root layout owns.
 * Next.js cannot vary that attribute per route from a nested layout, so this
 * layout corrects it in the browser (see LangDocument below) and useLang
 * re-applies it from the URL on client-side navigations. Without either,
 * every /en and /zh page is announced as Indonesian by screen readers, and
 * search engines read the wrong language signal for a site that publishes in
 * three languages.
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

/** Small server-rendered helper that corrects the document language before
 *  the first paint.
 *
 *  The <html lang> attribute is owned by the root layout, which is shared by
 *  every route and therefore has to declare one static value ('id'). Server
 *  components cannot change it from a nested layout, so the correction has to
 *  happen in the browser.
 *
 *  The script runs synchronously while the browser parses the HTML, before
 *  React hydrates. On client-side navigations the script does not re-execute;
 *  there useLang (mounted with the navbar and footer on every public page)
 *  sets document.documentElement.lang from the URL instead.
 *
 *  React warns in development whenever a component renders a <script> tag.
 *  Per the Next.js guide on preventing flash before hydration, the warning is
 *  avoided by typing the script 'text/javascript' on the server and
 *  'text/plain' on the client — suppressHydrationWarning accepts the mismatch.
 *
 *  This is still a genuine limitation, not a fix: a crawler that reads the
 *  static HTML sees lang="id" on the English and Chinese pages too. What
 *  limits the damage is that <html lang> is not the signal Google weighs most
 *  here — the hreflang alternates and the self-referencing canonical on each
 *  locale URL are explicit and machine-readable, and those live in the
 *  metadata export where they belong. */
function LangDocument({ lang }: { lang: Locale }) {
  return (
    <script
      type={typeof window === 'undefined' ? 'text/javascript' : 'text/plain'}
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: `document.documentElement.lang=${JSON.stringify(lang)}` }}
    />
  );
}
