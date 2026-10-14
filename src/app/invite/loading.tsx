import { cookies } from 'next/headers';
import type { Lang } from '@/lib/translations';
import '@/features/workspace/workspace.css';

const loadingLabels: Record<Lang, string> = {
  en: 'Loading project invitation…',
  id: 'Memuat undangan proyek…',
  zh: '正在加载项目邀请…',
};

export default async function InvitationLoading() {
  const value = (await cookies()).get('veralex-portal-lang')?.value;
  const lang: Lang = value === 'id' || value === 'zh' ? value : 'en';

  return (
    <main className="workspace ws-invite-page" aria-busy="true" aria-label={loadingLabels[lang]}>
      <section className="ws-invite-card ws-invite-skeleton" aria-hidden="true">
        <span className="ws-skeleton-block ws-invite-skeleton-kicker" />
        <span className="ws-skeleton-block ws-invite-skeleton-title" />
        <span className="ws-skeleton-block ws-invite-skeleton-copy" />
        <span className="ws-skeleton-block ws-invite-skeleton-copy short" />
        <span className="ws-skeleton-block ws-invite-skeleton-action" />
      </section>
      <span className="ws-sr-only" role="status" aria-live="polite">{loadingLabels[lang]}</span>
    </main>
  );
}
