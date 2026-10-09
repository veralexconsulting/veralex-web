'use client';
import { usePathname } from 'next/navigation';
import { WorkspaceProvider } from '@/features/workspace/store';
import { WorkspaceShell } from '@/features/workspace/ui';
import LegacyAdminLayout from '@/features/workspace/LegacyAdminLayout';
import '@/features/workspace/workspace.css';
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  if (pathname.startsWith('/admin/orders') || pathname.startsWith('/admin/settings')) return <LegacyAdminLayout>{children}</LegacyAdminLayout>;
  if (pathname === '/admin/login' || pathname === '/admin/aktivasi') return children;
  return <WorkspaceProvider role="admin"><WorkspaceShell role="admin">{children}</WorkspaceShell></WorkspaceProvider>;
}
