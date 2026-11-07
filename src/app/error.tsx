'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import './globals.css';

/*
 * Runtime error boundary for every route.
 *
 * Without this file a failed server action, a dropped Supabase connection or a
 * client exception shows Next.js' bare "Application error" screen — English, no
 * branding, no way back. For a client whose legal documents live in this portal,
 * that is the worst possible first impression of a failure.
 */
const copy = {
  id: {
    eyebrow: 'TERJADI GANGGUAN',
    title: 'Halaman ini belum dapat ditampilkan',
    text: 'Kami tidak dapat menyelesaikan permintaan Anda karena gangguan teknis. Tidak ada data yang hilang. Coba muat ulang halaman, atau kembali ke halaman utama.',
    retry: 'Muat ulang',
    home: 'Kembali ke beranda',
    portal: 'Buka portal klien',
    reference: 'Kode referensi',
  },
  en: {
    eyebrow: 'SOMETHING WENT WRONG',
    title: 'This page could not be displayed',
    text: 'We could not complete your request because of a technical problem. No data was lost. Reload the page, or return to the homepage.',
    retry: 'Reload',
    home: 'Back to homepage',
    portal: 'Open client portal',
    reference: 'Reference code',
  },
  zh: {
    eyebrow: '出现问题',
    title: '当前页面暂时无法显示',
    text: '由于技术故障，我们无法完成您的请求。数据没有丢失。请刷新页面，或返回首页。',
    retry: '刷新',
    home: '返回首页',
    portal: '打开客户门户',
    reference: '参考编号',
  },
} as const;

type Lang = keyof typeof copy;

function langFrom(pathname: string): Lang {
  const first = pathname.split('/')[1];
  if (first === 'en' || first === 'zh' || first === 'id') return first;
  // Workspace and auth routes are Indonesian; everything else defaults to Indonesian too.
  return 'id';
}

export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const pathname = usePathname() ?? '/';
  const lang = langFrom(pathname);
  const t = copy[lang];
  const isWorkspace = /^\/(admin|portal)/.test(pathname);

  useEffect(() => {
    // Digest only: the message may hold customer data and is not safe to surface.
    console.error('Route error', { digest: error.digest, path: pathname });
  }, [error, pathname]);

  return (
    <main className="ws-fallback">
      <div className="ws-fallback-card">
        <Link href="/" className="ws-fallback-brand" aria-label="VERALEX CONSULTING">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.webp" alt="VERALEX CONSULTING" width={140} height={99} />
        </Link>
        <p className="ws-fallback-eyebrow">{t.eyebrow}</p>
        <h1>{t.title}</h1>
        <p className="ws-fallback-text">{t.text}</p>
        <div className="ws-fallback-actions">
          <button type="button" className="ws-fallback-button" onClick={() => reset()}>{t.retry}</button>
          {isWorkspace
            ? <Link href={pathname.startsWith('/admin') ? '/admin' : '/portal'} className="ws-fallback-link">{t.portal}</Link>
            : <Link href="/" className="ws-fallback-link">{t.home}</Link>}
        </div>
        {error.digest && <p className="ws-fallback-ref">{t.reference}: <code>{error.digest}</code></p>}
      </div>
    </main>
  );
}
