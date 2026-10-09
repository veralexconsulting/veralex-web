'use client';
import { usePathname } from 'next/navigation';
import ScrollProgress from './ScrollProgress';
import FloatingWhatsApp from './FloatingWhatsApp';
import MarketingTracking from './MarketingTracking';
import GoogleTagManager from './GoogleTagManager';

export default function MarketingChrome() {
  const pathname=usePathname();
  if (/^\/(admin|portal|invite|workspace)(\/|$)/.test(pathname)) return null;
  return <><ScrollProgress/><GoogleTagManager/><MarketingTracking/><FloatingWhatsApp/></>;
}
