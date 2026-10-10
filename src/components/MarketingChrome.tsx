'use client';
import { usePathname } from 'next/navigation';
import ScrollProgress from './ScrollProgress';
import FloatingWhatsApp from './FloatingWhatsApp';
import CookiePreferences from './CookiePreferences';

export default function MarketingChrome() {
  const pathname=usePathname();
  if (/^\/(admin|portal|invite|workspace|aksesraffi)(\/|$)/.test(pathname)) return null;
  const legalPage = /^\/(?:id\/|zh\/)?(?:privacy-policy|terms-and-conditions)$/.test(pathname);
  return <><ScrollProgress/><CookiePreferences/>{!legalPage && <FloatingWhatsApp/>}</>;
}
