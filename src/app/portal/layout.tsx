'use client';
import { WorkspaceProvider } from '@/features/workspace/store';
import { WorkspaceShell } from '@/features/workspace/ui';
import { usePathname } from 'next/navigation';
import '@/features/workspace/workspace.css';
export default function Layout({ children }: { children: React.ReactNode }) { const pathname=usePathname(); if(pathname==='/portal/login') return children; return <WorkspaceProvider role="client"><WorkspaceShell role="client">{children}</WorkspaceShell></WorkspaceProvider>; }
