'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { useWorkspace, formatDate, currentStage, completedStages } from './store';
import { priorityLabels, statusLabels, type Project, type ProjectStatus, type Stage } from './model';
import { workspaceBrowser } from '@/lib/workspace/browser';
import { ClientPortalFrame, useOptionalClientLocale } from './client-locale';
import { WorkspaceIcon, type WorkspaceIconName } from './icons';
import type { Lang } from '@/lib/translations';
import { clientServiceName, clientStageLabel } from './client-workflow-translations';
import RouteSkeleton from './RouteSkeleton';

export function WorkspaceShell({ role, children }: { role: 'admin' | 'client'; children: React.ReactNode }) {
  const locale = useOptionalClientLocale();
  const pathname = usePathname();
  const router = useRouter();
  const { data, actorId, clientAccountId, toast, toastError, clearToast, ready, error, refresh, pendingCount } = useWorkspace();
  const [menuOpen, setMenuOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const [signOutError, setSignOutError] = useState('');
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!menuOpen) return;
    const close = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMenuOpen(false);
        menuButtonRef.current?.focus();
      }
    };
    document.addEventListener('keydown', close);
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', close);
      document.body.style.overflow = previous;
    };
  }, [menuOpen]);

  const admin = data.admins.find(item => item.id === actorId);
  const client = data.clientAccounts.find(item => item.id === clientAccountId);
  const isClient = role === 'client';
  const homeHref = isClient ? '/portal' : '/admin';
  const nav: Array<[string, string, WorkspaceIconName]> = isClient
    ? [
        ['/portal', locale?.t('navProjects') || 'Proyek Saya', 'projects'],
        ['/portal/notifikasi', locale?.t('navNotices') || 'Notifikasi', 'notifications'],
        ['/portal/pengaturan', locale?.t('navSettings') || 'Pengaturan', 'settings'],
      ]
    : [
        ['/admin', 'Dashboard', 'dashboard'],
        ['/admin/proyek', 'Proyek', 'projects'],
        ['/admin/klien', 'Klien', 'clients'],
        ['/admin/tim', 'Tim', 'team'],
        ['/admin/riwayat', 'Riwayat', 'history'],
        ['/admin/pengaturan', 'Pengaturan', 'settings'],
      ];
  const owned = new Set(data.accesses.filter(access => access.accountId === clientAccountId && !access.revokedAt).map(access => access.projectId));
  const notifications = data.notifications.filter(item => item.role === role && !item.read && (role === 'admin' || (item.projectId && owned.has(item.projectId)))).length;

  function isActive(href: string) {
    if (href === homeHref) return pathname === href || (isClient && pathname.startsWith('/portal/proyek/'));
    return pathname === href || pathname.startsWith(href + '/');
  }

  async function signOut() {
    if (signingOut) return;
    setSigningOut(true);
    setSignOutError('');
    try {
      const { error } = await workspaceBrowser().auth.signOut();
      if (error) throw error;
      router.replace(isClient ? '/portal/login' : '/admin/login');
      router.refresh();
    } catch {
      setSignOutError(isClient ? locale?.t('operationFailed') || 'Keluar belum dapat dilakukan.' : 'Keluar belum dapat dilakukan. Coba lagi setelah koneksi pulih.');
      setSigningOut(false);
    }
  }

  if (!ready) return <RouteSkeleton role={role} label={isClient ? locale?.t('loading') : undefined} />;
  if (error) {
    return isClient
      ? <ClientPortalFrame><div className="workspace ws-auth-simple" style={{ minHeight: 420 }}><div className="ws-auth-card"><h1>{locale?.t('loadError')}</h1><p className="ws-error" role="alert">{locale?.t('loadError')}</p><button className="ws-button ws-button-primary" onClick={() => refresh().catch(() => {})}>{locale?.t('retry')}</button></div></div></ClientPortalFrame>
      : <div className="workspace ws-auth-simple"><div className="ws-auth-card"><h1>Workspace belum dapat dimuat</h1><p className="ws-error" role="alert">{error}</p><button className="ws-button ws-button-primary" onClick={() => refresh().catch(() => {})}>Coba lagi</button></div></div>;
  }

  const displayName = (isClient ? client?.name : admin?.name) || '';
  const displayRole = isClient ? locale?.t('client') : 'Administrator';
  const menuLabel = menuOpen ? locale?.t('menuClose') || 'Tutup menu' : locale?.t('menuOpen') || 'Buka menu';
  const closeMenu = () => setMenuOpen(false);

  return (
    <div className={`workspace ws-${role}${collapsed ? ' ws-shell-collapsed' : ''}`}>
      <a className="ws-skip" href="#workspace-content">{isClient && locale ? locale.t('skip') : 'Lewati navigasi'}</a>

      {/* Mobile-only bar: the sidebar is a drawer below 950px, so it needs a trigger. */}
      <div className="ws-mobile-top">
        <Link href={homeHref} className="ws-brand ws-logo-link" aria-label="VERALEX Consulting">
          <Image src="/logo.webp" alt="VERALEX Consulting" width={1024} height={724} priority />
        </Link>
        <button
          ref={menuButtonRef}
          className="ws-icon-button"
          aria-label={menuLabel}
          aria-expanded={menuOpen}
          aria-controls={`ws-${role}-navigation`}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <span className="ws-menu-bars" aria-hidden="true"><i /><i /><i /></span>
        </button>
      </div>

      {menuOpen && <button className="ws-scrim" aria-label={locale?.t('menuClose') || 'Tutup menu'} onClick={() => { closeMenu(); menuButtonRef.current?.focus(); }} />}

      <aside className={`ws-sidebar ${menuOpen ? 'is-open' : ''}`}>
        <div className="ws-sidebar-head">
          <Link href={homeHref} className="ws-brand ws-logo-link" aria-label="VERALEX Consulting" onClick={closeMenu}>
            <Image src="/logo.webp" alt="VERALEX Consulting" width={1024} height={724} priority />
          </Link>
          <button
            className="ws-collapse-toggle"
            type="button"
            onClick={() => setCollapsed(!collapsed)}
            aria-label={isClient ? (collapsed ? locale?.t('sidebarExpand') : locale?.t('sidebarCollapse')) : (collapsed ? 'Perluas navigasi' : 'Ciutkan navigasi')}
            aria-pressed={collapsed}
          >
            <WorkspaceIcon name="chevron" className={collapsed ? 'ws-chevron-in' : 'ws-chevron-out'} />
          </button>
        </div>

        <nav id={`ws-${role}-navigation`} aria-label={isClient ? locale?.t('portal') : 'Navigasi utama'} className="ws-nav">
          {nav.map(([href, label, icon]) => (
            <Link
              key={href}
              href={href}
              onClick={closeMenu}
              aria-current={isActive(href) ? 'page' : undefined}
              className={`ws-nav-link ${isActive(href) ? 'is-current' : ''}`}
              title={collapsed ? label : undefined}
            >
              <WorkspaceIcon name={icon} />
              <span className="ws-nav-label">{label}</span>
            </Link>
          ))}
        </nav>

        <div className="ws-sidebar-bottom">
          {!isClient && notifications > 0 && (
            <Link href="/admin/notifikasi" className="ws-nav-link" onClick={closeMenu} title={collapsed ? 'Notifikasi' : undefined}>
              <WorkspaceIcon name="notifications" />
              <span className="ws-nav-label">Notifikasi</span>
              <b className="ws-count">{notifications}</b>
            </Link>
          )}
          {!isClient && (
            <Link href="/admin/aktivasi" className="ws-nav-link" onClick={closeMenu} title={collapsed ? 'Akun' : undefined}>
              <WorkspaceIcon name="account" />
              <span className="ws-nav-label">Akun</span>
            </Link>
          )}

          <div className="ws-identity">
            <span className="ws-avatar">{displayName.charAt(0) || 'V'}</span>
            <span className="ws-identity-text">
              <strong>{displayName}</strong>
              <small>{displayRole}</small>
            </span>
          </div>

          {isClient && (
            <label className="ws-locale-control ws-locale-sidebar">
              <WorkspaceIcon name="globe" />
              <span className="ws-sr-only">Language</span>
              <select aria-label="Language" value={locale?.lang || 'en'} onChange={event => locale?.setLanguage(event.target.value as Lang)}>
                <option value="en">English</option>
                <option value="id">Bahasa Indonesia</option>
                <option value="zh">中文</option>
              </select>
            </label>
          )}

          {signOutError && <p className="ws-error" role="alert">{signOutError}</p>}
          <button className="ws-nav-link ws-signout" disabled={signingOut} aria-live="polite" onClick={signOut} title={collapsed ? (isClient ? locale?.t('signOut') : 'Keluar') : undefined}>
            <WorkspaceIcon name="logout" />
            <span className="ws-nav-label">{signingOut ? (isClient ? locale?.t('processingShort') : 'Keluar…') : isClient ? locale?.t('signOut') : 'Keluar'}</span>
          </button>
        </div>
      </aside>

      <div className="ws-main-wrap">
        {pendingCount > 0 && (
          <div className="ws-operation-progress" role="status" aria-live="polite">
            <span className="ws-spinner" aria-hidden="true" />
            {isClient ? locale?.t('processing') : 'Menyimpan perubahan…'}
          </div>
        )}
        <main id="workspace-content" className="ws-main">{children}</main>
      </div>

      {toast && (
        <div className="ws-toast" role={toastError ? 'alert' : 'status'}>
          {isClient ? locale?.t(toastError ? 'operationFailed' : 'operationDone') : toast}
          <button onClick={clearToast} aria-label={locale?.t('menuClose') || 'Tutup pemberitahuan'}>×</button>
        </div>
      )}
    </div>
  );
}

export function PageHeader({ eyebrow, title, description, action }: { eyebrow?: string; title: string; description?: string; action?: React.ReactNode }) { return <header className="ws-page-header"><div>{eyebrow && <p className="ws-eyebrow">{eyebrow}</p>}<h1>{title}</h1>{description && <p className="ws-muted">{description}</p>}</div>{action && <div className="ws-header-action">{action}</div>}</header>; }
export function Badge({ status, role='admin' }: { status: ProjectStatus | string; role?:'admin'|'client' }) { const locale=useOptionalClientLocale(); return <span className={`ws-badge ws-badge-${status}`}>{role==='client'&&locale?locale.status(status):statusLabels[status as ProjectStatus] || priorityLabels[status as keyof typeof priorityLabels] || status}</span>; }
export function EmptyState({ title, description, action }: { title: string; description?: string; action?: React.ReactNode }) { return <div className="ws-empty"><span className="ws-empty-icon" aria-hidden="true">◌</span><h3>{title}</h3>{description && <p>{description}</p>}{action}</div>; }
export function ProjectCard({ project, role = 'admin' }: { project: Project; role?: 'admin' | 'client' }) { const { data } = useWorkspace(); const locale=useOptionalClientLocale(); const client = data.clients.find(item => item.id === project.clientId); const service = data.services.find(item => item.id === project.serviceId); const pic = data.admins.find(item => item.id === project.picId); const stage=currentStage(project.stages);const stageName=stage&&locale?clientStageLabel(stage.clientLabel,stage.sourceTemplateStepId,locale.lang):stage?.clientLabel;const serviceName=service&&locale?clientServiceName(service.id,service.name,locale.lang):service?.name; return <Link href={role === 'admin' ? `/admin/proyek/${project.id}` : `/portal/proyek/${project.id}`} className="ws-project-card"><div className="ws-card-top"><span className="ws-ref">{project.reference}</span><Badge status={project.status} role={role} /></div><h3>{project.title}</h3><p>{role==='client'?serviceName:service?.name} · {client?.name}</p><div className="ws-project-card-foot"><span>{role === 'admin' ? `PIC ${pic?.name || '—'}` : stageName}</span><span>{role==='client'?locale?.t('viewDetails'):'Detail'} →</span></div></Link>; }
export function ProjectTable({ projects }: { projects: Project[] }) { const { data } = useWorkspace(); if (!projects.length) return <EmptyState title="Tidak ada proyek yang cocok" description="Ubah kata kunci atau filter untuk melihat proyek lain." />; return <><div className="ws-table-wrap"><table className="ws-table"><thead><tr><th>Proyek</th><th>Klien / layanan</th><th>Status</th><th>PIC</th><th>Diperbarui</th><th><span className="sr-only">Buka</span></th></tr></thead><tbody>{projects.map(project => <tr key={project.id}><td><Link className="ws-table-title" href={`/admin/proyek/${project.id}`}>{project.title}</Link><small>{project.reference}{project.priority !== 'none' ? ' · Prioritas' : ''}</small></td><td>{data.clients.find(item => item.id === project.clientId)?.name}<small>{data.services.find(item => item.id === project.serviceId)?.name}</small></td><td><Badge status={project.status} /></td><td>{data.admins.find(item => item.id === project.picId)?.name}</td><td>{formatDate(project.updatedAt)}</td><td><Link href={`/admin/proyek/${project.id}`} aria-label={`Buka ${project.title}`}>→</Link></td></tr>)}</tbody></table></div><div className="ws-mobile-cards">{projects.map(project => <ProjectCard key={project.id} project={project} />)}</div></>; }
export function Timeline({ stages, client = false }: { stages: Stage[]; client?: boolean }) { const locale=useOptionalClientLocale(); const active = currentStage(stages)?.id; return <ol className="ws-timeline">{stages.filter(stage => !client || stage.clientVisible).map((stage, index) => { const complete = stage.tasks.length > 0 && stage.tasks.every(task => task.status === 'completed' || task.status === 'skipped'); return <li key={stage.id} className={complete ? 'is-complete' : active === stage.id ? 'is-active' : ''}><span className="ws-timeline-dot">{complete ? '✓' : index + 1}</span><div><strong>{client&&locale?clientStageLabel(stage.clientLabel,stage.sourceTemplateStepId,locale.lang):client?stage.clientLabel:stage.title}</strong><small>{client&&locale?(complete?locale.t('stageDone'):active===stage.id?locale.t('stageActive'):locale.t('stageNext')):(complete ? 'Selesai' : active === stage.id ? 'Sedang berjalan' : 'Tahap berikutnya')}</small></div></li>; })}</ol>; }
export function ProgressSummary({ project }: { project: Project }) { const locale=useOptionalClientLocale(); const count = completedStages(project.stages); const stage=currentStage(project.stages);const stageName=stage&&locale?clientStageLabel(stage.clientLabel,stage.sourceTemplateStepId,locale.lang):stage?.clientLabel; const format=locale?.lang==='zh'?`${count}/${project.stages.length} 个阶段已完成`:locale?.lang==='en'?`${count} of ${project.stages.length} stages`:locale?.t('stagesComplete').replace('{done}',String(count)).replace('{total}',String(project.stages.length)); return <div className="ws-progress"><div><strong>{format}</strong><span>{stageName}</span></div><div className="ws-progress-track" role="progressbar" aria-valuenow={count} aria-valuemin={0} aria-valuemax={project.stages.length} aria-label={locale?.t('progressLabel')||'Tahap selesai'}><span style={{ width: `${project.stages.length ? count / project.stages.length * 100 : 0}%` }} /></div><small>{locale?.t('progressNote')||'Progres mengikuti tugas yang selesai, bukan perkiraan waktu proses instansi.'}</small></div>; }
export function handleDialogKey(event: React.KeyboardEvent<HTMLDivElement>, onClose: () => void) { if (event.key === 'Escape') { onClose(); return; } if (event.key !== 'Tab') return; const focusable = Array.from(event.currentTarget.querySelectorAll<HTMLElement>('button:not(:disabled), input:not(:disabled), select:not(:disabled), textarea:not(:disabled), a[href]')); if (!focusable.length) return; const first = focusable[0]; const last = focusable[focusable.length - 1]; if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); } else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); } }
export function ConfirmDialog({ title, description, confirmLabel = 'Ya, lanjutkan', danger = false, onConfirm, onClose }: { title: string; description: string; confirmLabel?: string; danger?: boolean; onConfirm: () => void | Promise<unknown>; onClose: () => void }) {
  const locale=useOptionalClientLocale(); const [busy,setBusy]=useState(false); const [error,setError]=useState('');
  async function confirm(){if(busy)return;setBusy(true);setError('');try{await onConfirm();onClose();}catch{setError(locale?.lang==='en'?'The action could not be completed. Please try again.':locale?.lang==='zh'?'操作未能完成，请重试。':'Tindakan belum dapat dilakukan. Silakan coba lagi.');}finally{setBusy(false);}}
  return <div className="ws-dialog-backdrop" onMouseDown={event => { if (event.target === event.currentTarget&&!busy) onClose(); }}><div className="ws-dialog" role="dialog" aria-modal="true" aria-labelledby="ws-dialog-title" aria-busy={busy} onKeyDown={event => {if(busy&&event.key==='Escape'){event.preventDefault();return;}handleDialogKey(event, onClose);}}><button autoFocus className="ws-dialog-close" aria-label={locale?.t('cancel')||'Tutup dialog'} disabled={busy} onClick={onClose}>×</button><h2 id="ws-dialog-title">{title}</h2><p>{description}</p>{error&&<p className="ws-error" role="alert">{error}</p>}<div className="ws-dialog-actions"><button className="ws-button ws-button-quiet" disabled={busy} onClick={onClose}>{locale?.t('cancel')||'Batal'}</button><button className={`ws-button ${danger ? 'ws-button-danger' : 'ws-button-primary'}`} disabled={busy} aria-live="polite" onClick={confirm}>{busy?(locale?.t('processingShort')||'Memproses…'):confirmLabel}</button></div></div></div>;
}
export function NoticeList({ role }: { role: 'admin' | 'client' }) {
  const locale=useOptionalClientLocale();
  const { data, clientAccountId, markRead, markAllRead } = useWorkspace();
  const router = useRouter();
  const owned = new Set(data.accesses.filter(access => access.accountId === clientAccountId && !access.revokedAt).map(access => access.projectId));
  const notices = data.notifications.filter(item => item.role === role && (role === 'admin' || (item.projectId && owned.has(item.projectId)))).sort((a, b) => b.at.localeCompare(a.at));
  const dateLocale=locale?.lang==='zh'?'zh-CN':locale?.lang==='en'?'en-US':'id-ID';
  return <>
    <PageHeader eyebrow={role==='client'?locale?.t('noticeEyebrow'):'Pembaruan'} title={role==='client'?locale?.t('noticeTitle')||'Notifikasi':'Notifikasi'} description={role==='client'?locale?.t('noticeDesc'):'Informasi penting dari proyek Anda.'} action={<button className="ws-button ws-button-secondary" onClick={() => markAllRead(role)} disabled={!notices.some(item => !item.read)}>{role==='client'?locale?.t('markAll'):'Tandai semua dibaca'}</button>} />
    {notices.length ? <div className="ws-surface ws-notice-list">{notices.map(notice => <button key={notice.id} className={`ws-notice ${!notice.read ? 'is-unread' : ''}`} onClick={() => { markRead(notice.id); router.push(notice.target); }}><span className="ws-notice-mark" /><span><strong>{role==='client'&&locale?locale.notificationTitle(notice.eventType,notice.title):notice.title}</strong><span>{role==='client'&&locale?locale.notificationMessage(notice.eventType,notice.message):notice.message}</span><small>{new Date(notice.at).toLocaleString(dateLocale,{dateStyle:'medium',timeStyle:'short'})}</small></span><span aria-hidden="true">↗</span></button>)}</div> : <EmptyState title={role==='client'?locale?.t('noNotices')||'Belum ada notifikasi':'Belum ada notifikasi'} description={role==='client'?locale?.t('noticeEmpty'):'Pembaruan proyek akan muncul di sini.'} />}
  </>;
}
