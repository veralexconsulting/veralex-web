import { cookies } from 'next/headers';
import RouteSkeleton from '@/features/workspace/RouteSkeleton';

export default async function PortalLoading() {
  const language = (await cookies()).get('veralex-portal-lang')?.value;
  const label = language === 'id' ? 'Memuat portal klien…' : language === 'zh' ? '正在加载客户门户…' : 'Loading your client portal…';
  return <RouteSkeleton role="client" label={label} />;
}
