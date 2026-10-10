'use client';
import { usePathname } from 'next/navigation';
import { WorkspaceProvider } from '@/features/workspace/store';
import { WorkspaceShell } from '@/features/workspace/ui';
import { ClientLocaleProvider } from '@/features/workspace/client-locale';
import type { Lang } from '@/lib/translations';
import '@/features/workspace/workspace.css';
export default function PortalShellLayout({children,initialLanguage}:{children:React.ReactNode;initialLanguage:Lang}){const pathname=usePathname();return <ClientLocaleProvider initialLanguage={initialLanguage}>{pathname==='/portal/login'?children:<WorkspaceProvider role="client"><WorkspaceShell role="client">{children}</WorkspaceShell></WorkspaceProvider>}</ClientLocaleProvider>;}
