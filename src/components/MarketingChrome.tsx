'use client';
import { usePathname } from 'next/navigation';
import ScrollProgress from './ScrollProgress';
import FloatingWhatsApp from './FloatingWhatsApp';
import CookiePreferences from './CookiePreferences';

export default function MarketingChrome() {
  const pathname=usePathname();
  if (/^\/(admin|portal|invite|workspace|aksesraffi)(\/|$)/.test(pathname)) return null;
  const legalPage = /^\/(?:id\/|zh\/)?(?:privacy-policy|terms-and-conditions)$/.test(pathname);
  // TEMPORARY_HIDE_COOKIE_NOTICE: hide the first-visit cookie prompt for now.
  // Keep this temporary so it can be restored when the consent UX is revisited;
  // optional analytics remain consent-gated and the footer can still open settings.
  return <><ScrollProgress/><CookiePreferences showInitialPrompt={false}/>{!legalPage && <FloatingWhatsApp/>}</>;
}
