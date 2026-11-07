'use client';
import { usePathname } from 'next/navigation';
import { WorkspaceProvider } from '@/features/workspace/store';
import { WorkspaceShell } from '@/features/workspace/ui';
import '@/features/workspace/workspace.css';

/*
 * Single admin chrome. Every /admin page except the unauthenticated entry points
 * renders inside the same workspace sidebar; the previous exception for
 * /admin/orders and /admin/settings produced a second, duplicated sidebar.
 */
const BARE_ROUTES = ['/admin/login', '/admin/aktivasi'];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  if (BARE_ROUTES.includes(pathname)) return <>{children}</>;
  return (
    <WorkspaceProvider role="admin">
      <WorkspaceShell role="admin">{children}</WorkspaceShell>
    </WorkspaceProvider>
  );
}
