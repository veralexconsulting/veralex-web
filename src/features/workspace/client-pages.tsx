'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { changeInitialPassword, claimInvitation, getCurrentWorkspaceActor, inspectInvitation, recordLoginEvent } from '@/app/workspace-actions';
import { workspaceBrowser, workspaceOAuthRedirectTo } from '@/lib/workspace/browser';
import { whatsappHref, whatsappNumberHref } from '@/lib/marketing';
import PortalLegalNotice from '@/components/PortalLegalNotice';
import { useWorkspace, currentStage, nextTask } from './store';
import { Badge, ConfirmDialog, EmptyState, PageHeader, ProgressSummary, ProjectCard, Timeline } from './ui';
import { useClientLocale, useOptionalClientLocale } from './client-locale';
import { clientServiceName, clientStageLabel } from './client-workflow-translations';
import { invitationClaimDestination } from './invitation-claim';

function BrandLogo({ compact = false }: { compact?: boolean }) {
  const locale=useOptionalClientLocale();
  const label=locale?(locale.lang==='zh'?'返回网站':locale.lang==='en'?'Back to Website':'Kembali ke Website'):'beranda';
  return <Link href="/" className={compact ? 'ws-logo-link ws-logo-compact' : 'ws-logo-link'} aria-label={`VERALEX CONSULTING — ${label}`}><Image src="/logo.webp" alt="VERALEX CONSULTING" width={1024} height={724} priority /></Link>;
}
function GoogleMark(){return <svg aria-hidden="true" viewBox="0 0 48 48" width="20" height="20"><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.73 7.18l7.64 5.92c4.46-4.12 7.13-10.2 7.13-17.57Z"/><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.91-5.88l-7.64-5.92c-2.12 1.42-4.84 2.27-8.27 2.27-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48Z"/><path fill="#FBBC05" d="M10.53 28.59A14.5 14.5 0 0 1 9.75 24c0-1.59.27-3.13.76-4.59l-7.98-6.2A23.9 23.9 0 0 0 0 24c0 3.88.93 7.55 2.56 10.78l7.97-6.19Z"/><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5Z"/></svg>;}

async function authStep<T>(operation: PromiseLike<T>): Promise<T> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  try {
    return await Promise.race([
      Promise.resolve(operation),
      new Promise<never>((_, reject) => {
        timer = setTimeout(() => reject(new Error('Koneksi login terlalu lama. Coba lagi beberapa saat.')), 15000);
      }),
    ]);
  } finally {
    if (timer) clearTimeout(timer);
  }
}

export function AdminLogin() {
  const [email, setEmail] = useState(''); const [password, setPassword] = useState(''); const [visible, setVisible] = useState(false);
  const [error, setError] = useState(''); const [busy,setBusy]=useState(false); const [sent,setSent]=useState(false); const [passwordChanged,setPasswordChanged]=useState(false);
  useEffect(()=>{setPasswordChanged(new URLSearchParams(window.location.search).get('passwordChanged')==='1');},[]);
  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setError('');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !password) {
      setError('Isi email dan kata sandi yang valid.');
      return;
    }
    setBusy(true);
    let navigating = false;
    try {
      const auth = workspaceBrowser();
      const { data, error: authError } = await authStep(auth.auth.signInWithPassword({ email, password }));
      if (authError || !data.user) throw new Error('Email atau kata sandi tidak sesuai.');
      const { data: profile, error: profileError } = await authStep(
        auth.from('profiles').select('role,active,must_change_password').eq('id', data.user.id).maybeSingle(),
      );
      if (profileError) throw new Error('Profil administrator belum dapat diperiksa. Coba lagi setelah koneksi pulih.');
      if (!profile || profile.role !== 'admin' || !profile.active) {
        await authStep(auth.auth.signOut());
        throw new Error('Akun administrator tidak aktif atau tidak diizinkan.');
      }
      // Analytics is best-effort and must never hold up an otherwise valid
      // authentication. In particular, a transient DATABASE_URL/connection
      // problem must not make the login form report a failed sign-in after
      // Supabase has already established the session.
      void recordLoginEvent().catch(() => undefined);
      // A full request makes middleware validate the newly written SSR cookie
      // after Supabase has completed sign-in. App Router navigation can race
      // its first protected request against cookie propagation.
      navigating = true;
      window.location.replace(profile.must_change_password ? '/admin/aktivasi' : '/admin');
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Gagal masuk.');
    } finally {
      // Keep the form locked while the browser leaves for the authenticated page.
      if (!navigating) setBusy(false);
    }
  }
  async function resetPassword() { setError(''); if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return setError('Isi email terlebih dahulu.'); setBusy(true); try { const {error:authError}=await workspaceBrowser().auth.resetPasswordForEmail(email,{redirectTo:`${window.location.origin}/workspace/auth/callback?next=/admin/aktivasi`}); if(authError) throw authError; setSent(true); } catch {setError('Permintaan pemulihan belum dapat dikirim.');} finally {setBusy(false);} }
  return <div className="workspace ws-auth"><div className="ws-auth-card"><BrandLogo compact /><p className="ws-eyebrow">Workspace administrator</p><h1>Selamat datang kembali.</h1><p className="ws-muted">Kelola proyek dan tindak lanjut klien dalam satu tempat.</p>
    <form onSubmit={submit}><label>Email<input type="email" autoComplete="email" value={email} onChange={event => setEmail(event.target.value)} required /></label><label>Kata sandi<span className="ws-password-wrap"><input type={visible ? 'text' : 'password'} autoComplete="current-password" value={password} onChange={event => setPassword(event.target.value)} required /><button type="button" onClick={() => setVisible(!visible)}>{visible ? 'Sembunyikan' : 'Lihat'}</button></span></label><button type="button" className="ws-subtle-link" onClick={resetPassword} disabled={busy}>Lupa kata sandi?</button>{passwordChanged && <p className="ws-info" role="status">Kata sandi berhasil diubah. Masuk dengan kata sandi baru.</p>}{sent && <p className="ws-info" role="status">Jika akun terdaftar, tautan pemulihan dikirim ke email tersebut.</p>}{error && <p className="ws-error" role="alert">{error}</p>}<button className="ws-button ws-button-primary ws-full" disabled={busy}>{busy?'Memproses…':'Masuk'}</button></form>
  </div><div className="ws-auth-aside"><span>VERALEX / WORKSPACE</span><h2>Setiap langkah jelas.<br />Setiap klien terinformasi.</h2><p>Alur operasional untuk tim VERALEX dan pemantauan proyek bagi klien.</p></div></div>;
}

export function AdminActivation() {
  const [password, setPassword] = useState(''); const [confirm, setConfirm] = useState(''); const [message, setMessage] = useState(''); const [saved, setSaved] = useState(false); const [busy,setBusy]=useState(false);
  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (password !== confirm) return setMessage('Konfirmasi kata sandi tidak cocok.');
    if (password.length < 12 || !/[A-Z]/.test(password) || !/[a-z]/.test(password) || !/\d/.test(password)) return setMessage('Gunakan minimal 12 karakter, huruf besar, huruf kecil, dan angka.');
    setBusy(true); setMessage('');
    let passwordUpdated=false;
    try {
      const actor=await getCurrentWorkspaceActor();
      if(!actor || actor.role!=='admin') throw new Error('Silakan masuk sebagai administrator.');
      const auth=workspaceBrowser();
      if(actor.mustChangePassword) await changeInitialPassword(password);
      else { const {error}=await auth.auth.updateUser({password}); if(error) throw error; }
      passwordUpdated=true;
      setPassword(''); setConfirm(''); setSaved(true);
      const {error:sessionError}=await authStep(auth.auth.signInWithPassword({email:actor.email,password}));
      if(sessionError){setMessage('Kata sandi berhasil diubah. Silakan masuk dengan kata sandi baru.');window.location.replace('/admin/login?passwordChanged=1');return;}
      setMessage('Kata sandi berhasil diubah. Membuka Dashboard…');
      window.location.replace('/admin');
    } catch(cause) {
      setMessage(passwordUpdated?'Kata sandi berhasil diubah, tetapi sesi belum dapat diperbarui. Masuk ulang dengan kata sandi baru.':cause instanceof Error?cause.message:'Kata sandi gagal diubah.');
      setBusy(false);
      if(passwordUpdated)window.location.replace('/admin/login?passwordChanged=1');
    }
  }
  return <div className="workspace ws-auth-simple"><div className="ws-auth-card"><BrandLogo compact /><Link href="/admin/login" className="ws-back">← Kembali ke Login</Link><p className="ws-eyebrow">Akun tim</p><h1>Ganti kata sandi</h1><p className="ws-muted">Gunakan kata sandi baru yang kuat. Anggota tim baru wajib mengganti kata sandi awal sebelum memakai workspace.</p><form onSubmit={submit}><label>Kata sandi baru<input type="password" autoComplete="new-password" value={password} onChange={event => setPassword(event.target.value)} required /></label><label>Konfirmasi kata sandi<input type="password" autoComplete="new-password" value={confirm} onChange={event => setConfirm(event.target.value)} required /></label><button className="ws-button ws-button-primary" disabled={busy}>{busy?'Menyimpan…':'Simpan kata sandi'}</button></form>{message && <p className={saved?'ws-info':'ws-error'} role={saved?'status':'alert'}>{message}</p>}</div></div>;
}

export function InvitationPage() {
  const {t,lang}=useClientLocale();
  const [token,setToken]=useState('');
  const router = useRouter();
  const [status,setStatus]=useState<Awaited<ReturnType<typeof inspectInvitation>> | null>(null);
  const [notice,setNotice]=useState('');
  const [loading,setLoading]=useState(false);
  const [checkFailed,setCheckFailed]=useState(false);
  const [checkAttempt,setCheckAttempt]=useState(0);
  const claiming=useRef(false);
  useEffect(()=>{const fromHash=window.location.hash.slice(1);const candidate=fromHash||window.sessionStorage.getItem('veralex_claim_token')||'';if(candidate){window.sessionStorage.setItem('veralex_claim_token',candidate);setToken(candidate);if(fromHash)window.history.replaceState(window.history.state,'',`${window.location.pathname}${window.location.search}`);}else setStatus({state:'invalid'});},[]);
  useEffect(()=>{if(!token)return;let active=true;setCheckFailed(false);let timer:ReturnType<typeof setTimeout>;Promise.race([inspectInvitation(token),new Promise<never>((_,reject)=>{timer=setTimeout(()=>reject(new Error('timeout')),15000);})]).then(result=>{if(active){setStatus(result);if(['claimed_owned','claimed_other','expired','revoked','invalid'].includes(result.state))window.sessionStorage.removeItem('veralex_claim_token');}}).catch(()=>{if(active){setCheckFailed(true);setNotice(t('inviteCheckError'));}}).finally(()=>clearTimeout(timer));return()=>{active=false;clearTimeout(timer);};},[token,t,checkAttempt]);
  useEffect(()=>{if(status?.state!=='claimed_owned'||!status.projectId)return;const destination=invitationClaimDestination({state:'claimed_owned',projectId:status.projectId});if(destination)router.replace(destination.path);},[router,status]);
  async function continueWithGoogle(){setLoading(true);setNotice('');try {const {error}=await workspaceBrowser().auth.signInWithOAuth({provider:'google',options:{redirectTo:workspaceOAuthRedirectTo('invite')}});if(error)throw error;}catch{setNotice(t('inviteAuthError'));setLoading(false);}}
  async function claim(){if(claiming.current||!token)return;claiming.current=true;setLoading(true);setNotice('');let redirecting=false;try{const result=await claimInvitation(token);const destination=invitationClaimDestination(result);if(destination){window.sessionStorage.removeItem('veralex_claim_token');setNotice(t('claimSuccess'));redirecting=true;window.setTimeout(()=>{if(window.location.pathname==='/invite')window.location.replace('/portal?invitation=claimed');},2500);window.setTimeout(()=>{router.replace(destination.path);router.refresh();},450);return;}const key=result.state==='claimed_other'?'claimOther':result.state==='expired'?'claimExpired':result.state==='revoked'?'claimRevoked':'claimInvalid';setNotice(t(key));setStatus({...status!,state:result.state==='claimed'?'claimed_owned':result.state});}catch{setNotice(t('claimFailure'));}finally{if(!redirecting){claiming.current=false;setLoading(false);}}}
  return <div className="workspace ws-invite-page"><div className="ws-invite-card"><BrandLogo compact/>
    {!status ? checkFailed ? <><p className="ws-error" role="alert">{notice||t('inviteCheckError')}</p><button className="ws-button ws-button-secondary" onClick={()=>setCheckAttempt(value=>value+1)}>{t('retry')}</button></> : <p role="status" aria-live="polite">{t('inviteChecking')}</p> : status.state==='signin' ? <><p className="ws-eyebrow">{t('inviteEyebrow')}</p><h1>{t('inviteSignIn')}</h1><p className="ws-muted">{t('inviteSignInCopy')}</p><button className="ws-google-button" disabled={loading} onClick={continueWithGoogle}><GoogleMark/><span>{loading?t('connecting'):t('google')}</span></button></> : status.state==='unauthorized' ? <><p className="ws-eyebrow">{t('inviteEyebrow')}</p><h1>{t('inviteUnauthorized')}</h1><p className="ws-muted">{t(status.reason==='admin'?'inviteUnauthorizedAdmin':status.reason==='inactive'?'inviteUnauthorizedInactive':'inviteUnauthorizedGoogle')}</p>{status.reason!=='inactive'&&<button className="ws-button ws-button-secondary" onClick={async()=>{await workspaceBrowser().auth.signOut();setStatus({state:'signin'});}}>{t('otherAccount')}</button>}</> : status.state==='valid' ? <><p className="ws-eyebrow">{t('inviteEyebrow')}</p><h1>{t('inviteValid')}</h1><p className="ws-muted">{t('inviteValidCopy')}</p><div className="ws-invite-project"><strong>{status.projectTitle}</strong><span>{status.serviceId&&status.serviceName?clientServiceName(status.serviceId,status.serviceName,lang):status.serviceName}</span></div><button className="ws-button ws-button-primary ws-full" disabled={loading} onClick={claim}>{loading?t('claiming'):t('claim')}</button></> : <><p className="ws-eyebrow">{t('inviteStatus')}</p><h1>{t(status.state==='claimed_owned'?'claimedOwned':status.state==='claimed_other'?'claimedOther':status.state==='expired'?'expired':status.state==='revoked'?'revoked':'invalid')}</h1><p className="ws-muted">{t('inviteHelp')}</p>{status.state==='claimed_owned'&&status.projectId&&<Link href={`/portal/proyek/${status.projectId}`} className="ws-button ws-button-primary">{t('openProject')}</Link>}<a href={whatsappHref('Halo Kak Vheilljei, saya membutuhkan bantuan akses proyek VERALEX.')} target="_blank" rel="noopener noreferrer" className="ws-button ws-button-secondary">{t('contactTeam')}</a></>}
    {notice&&<p className="ws-error" role="alert">{notice}</p>}
    <PortalLegalNotice />
  </div></div>;
}

export function PortalDashboard() {
  const {t,lang}=useClientLocale();
  const searchParams=useSearchParams();
  const { data, clientAccountId } = useWorkspace(); const account = data.clientAccounts.find(item => item.id === clientAccountId);
  const projectIds = new Set(data.accesses.filter(item => item.accountId === clientAccountId && !item.revokedAt).map(item => item.projectId));
  const projects = data.projects.filter(item => projectIds.has(item.id) && item.status !== 'archived');
  const updates = data.activities.filter(item => item.clientVisible && projectIds.has(item.projectId || '')).sort((a, b) => b.at.localeCompare(a.at));
  const unread = data.notifications.filter(item => item.role === 'client' && !item.read && item.projectId && projectIds.has(item.projectId)).length;
  const dateLocale=lang==='zh'?'zh-CN':lang==='en'?'en-US':'id-ID';const date=(value:string)=>new Date(value).toLocaleString(dateLocale,{dateStyle:'medium',timeStyle:'short'});
  return <>{searchParams.get('invitation')==='claimed'&&<p className="ws-info" role="status">{t('claimSuccess')}</p>}<PageHeader eyebrow={t('portal')} title={`${t('hello')}, ${account?.name || t('client')}`} description={t('dashboardDesc')} action={<Link href="/portal/notifikasi" className="ws-button ws-button-secondary">{t('navNotices')} {unread ? `(${unread})` : ''}</Link>} />
    <section className="ws-section"><div className="ws-section-title"><h2>{t('projects')}</h2><span>{projects.length} {t('services')}</span></div>{projects.length ? <div className="ws-card-grid">{projects.map(project => <ProjectCard key={project.id} project={project} role="client" />)}</div> : <EmptyState title={t('noProjects')} description={t('noProjectsCopy')} />}</section>
    <div className="ws-detail-grid"><section className="ws-surface ws-pad"><h2>{t('actions')}</h2>{projects.some(item => item.status === 'waiting_client') ? projects.filter(item => item.status === 'waiting_client').map(project => <Link className="ws-client-action" href={`/portal/proyek/${project.id}`} key={project.id}><strong>{project.title}</strong><span>{nextTask(project.stages)?.title || t('actionContact')} →</span></Link>) : <EmptyState title={t('noAction')} description={t('noActionCopy')} />}</section><section className="ws-surface ws-pad"><h2>{t('recent')}</h2>{updates.length ? updates.slice(0, 4).map(item => <div className="ws-client-update" key={item.id}><p>{item.text}</p><small>{date(item.at)}</small></div>) : <EmptyState title={t('noUpdates')} />}</section></div>
  </>;
}

function picWhatsAppHref(phone: string, message: string) { return whatsappNumberHref(phone, message); }
export function PortalProject() {
  const {t,lang}=useClientLocale();
  const { id } = useParams<{ id: string }>(); const { data, clientAccountId, setPriority } = useWorkspace(); const [confirm, setConfirm] = useState<'request' | 'cancel' | null>(null);
  const access = data.accesses.find(item => item.projectId === id && item.accountId === clientAccountId && !item.revokedAt);
  const project = access ? data.projects.find(item => item.id === id && item.status !== 'archived') : undefined;
  if (!project) return <EmptyState title={t('missingProject')} description={t('missingProjectCopy')} action={<Link href="/portal" className="ws-button ws-button-secondary">{t('backPortal')}</Link>} />;
  const service = data.services.find(item => item.id === project.serviceId); const pic = data.admins.find(item => item.id === project.picId);
  const activities = data.activities.filter(item => item.projectId === project.id && item.clientVisible).sort((a, b) => b.at.localeCompare(a.at));
  const offering = data.priorityOffering;
  const stage=currentStage(project.stages);const stageLabel=stage?clientStageLabel(stage.clientLabel,stage.sourceTemplateStepId,lang):undefined;
  const eligible = offering.enabled && offering.serviceIds.includes(project.serviceId) && !['completed', 'cancelled', 'archived', 'rejected'].includes(project.status) && (offering.stageIds.length === 0 || offering.stageIds.includes(`${project.serviceId}:${currentStage(project.stages)?.id || ''}`));
  const localeCode=lang==='zh'?'zh-CN':lang==='en'?'en-US':'id-ID';const date=(value:string)=>new Date(value).toLocaleString(localeCode,{dateStyle:'medium',timeStyle:'short'});const statusDescription=project.status==='waiting_external'?t('externalWait'):project.status==='waiting_client'?t('clientWait'):project.status==='completed'?t('completed'):project.status==='cancelled'?t('cancelled'):t('handling');const amount=(value:number)=>new Intl.NumberFormat(localeCode,{style:'currency',currency:'IDR',maximumFractionDigits:0}).format(value);
  return <><Link className="ws-back" href="/portal">← {t('allProjects')}</Link><PageHeader eyebrow={project.reference} title={project.title} description={service?clientServiceName(service.id,service.name,lang):undefined} action={<Badge status={project.status} role="client" />} />
    <div className="ws-portal-hero"><div><span className="ws-eyebrow">{t('currentStatus')}</span><h2>{stageLabel}</h2><p>{statusDescription}</p></div><div><span>{t('nextStep')}</span><strong>{project.status === 'waiting_client' ? t('contactPic') : stageLabel || t('teamUpdate')}</strong><small>{t('lastUpdated')} {date(project.updatedAt)}</small></div></div>
    <div className="ws-detail-grid"><section className="ws-surface ws-pad"><h2>{t('journey')}</h2><ProgressSummary project={project} /><Timeline stages={project.stages} client /></section><section className="ws-surface ws-pad"><h2>{t('person')}</h2><div className="ws-pic"><span className="ws-avatar">{pic?.name[0] || 'V'}</span><div><strong>{pic?.name || 'VERALEX'}</strong><small>{t('pic')}</small></div></div><p className="ws-muted">{t('question')}</p>{pic?.phone && <a className="ws-button ws-button-primary" href={picWhatsAppHref(pic.phone, `Halo Kak ${pic.name}, saya ingin menanyakan proyek ${project.reference}.`)} target="_blank" rel="noopener noreferrer" data-cta-location="pic_contact">{t('chatPic')}</a>}<a className={pic?.phone ? 'ws-button ws-button-secondary' : 'ws-button ws-button-primary'} href={whatsappHref(`Halo Kak Vheilljei, saya ingin menanyakan proyek ${project.reference}.`)} target="_blank" rel="noopener noreferrer">{t('contact')}</a></section><section className="ws-surface ws-pad"><h2>{t('projectUpdates')}</h2>{activities.length ? activities.map(item => <div className="ws-client-update" key={item.id}><p>{item.text}</p><small>{date(item.at)}</small></div>) : <EmptyState title={t('noUpdatesProject')} />}</section></div>
    <section className="ws-surface ws-pad ws-spaced"><h2>{t('priority')}</h2>{eligible || project.priority !== 'none' ? <><p className="ws-muted">{offering.description}</p><div className="ws-priority-grid"><div><strong>{t('prioritized')}</strong><p>{offering.commitment}</p></div><div><strong>{t('limitations')}</strong><p>{offering.limitations}</p></div><div><strong>{t('price')}</strong><p>{project.priorityPrice !== undefined ? project.priorityPrice ? amount(project.priorityPrice) : t('reviewPrice') : offering.price ? amount(offering.price) : t('reviewPrice')}</p></div></div><p className="ws-info">{offering.terms} {t('paymentUnavailable')}</p>{['none', 'rejected', 'cancelled'].includes(project.priority) && eligible ? <button className="ws-button ws-button-primary" onClick={() => setConfirm('request')}>{t('requestPriority')}</button> : <div className="ws-inline-actions"><Badge status={project.priority} role="client" />{project.priority === 'requested' && <button className="ws-button ws-button-quiet" onClick={() => setConfirm('cancel')}>{t('cancelRequest')}</button>}</div>}</> : <p className="ws-muted">{t('unavailablePriority')}</p>}</section>
    {confirm && <ConfirmDialog title={confirm === 'request' ? t('requestTitle') : t('cancelTitle')} description={confirm === 'request' ? `${t('requestDesc')} ${offering.limitations} ${offering.terms}` : t('cancelDesc')} confirmLabel={confirm === 'request' ? t('yesRequest') : t('yesCancel')} danger={confirm === 'cancel'} onConfirm={() => setPriority(project.id, confirm === 'request' ? 'requested' : 'cancelled')} onClose={() => setConfirm(null)} />}
  </>;
}
