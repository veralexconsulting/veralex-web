'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { changeInitialPassword, claimInvitation, getCurrentWorkspaceActor, inspectInvitation } from '@/app/workspace-actions';
import { workspaceBrowser, workspaceOAuthRedirectTo } from '@/lib/workspace/browser';
import { whatsappHref } from '@/lib/marketing';
import { useWorkspace, currentStage, nextTask, formatDateTime } from './store';
import { Badge, ConfirmDialog, EmptyState, PageHeader, ProgressSummary, ProjectCard, Timeline } from './ui';

function BrandLogo({ compact = false }: { compact?: boolean }) {
  return <Link href="/" className={compact ? 'ws-logo-link ws-logo-compact' : 'ws-logo-link'} aria-label="VERALEX CONSULTING — beranda"><Image src="/logo.webp" alt="VERALEX CONSULTING" width={1024} height={724} priority /></Link>;
}

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
  const router = useRouter();
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
      router.replace(profile.must_change_password ? '/admin/aktivasi' : '/admin');
      router.refresh();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Gagal masuk.');
    } finally {
      setBusy(false);
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
  const [token,setToken]=useState('');
  const router = useRouter();
  const [status,setStatus]=useState<Awaited<ReturnType<typeof inspectInvitation>> | null>(null);
  const [notice,setNotice]=useState('');
  const [loading,setLoading]=useState(false);
  useEffect(()=>{const fromHash=window.location.hash.slice(1);const candidate=fromHash||window.sessionStorage.getItem('veralex_claim_token')||'';if(candidate){window.sessionStorage.setItem('veralex_claim_token',candidate);setToken(candidate);}else setStatus({state:'invalid'});},[]);
  useEffect(()=>{if(!token)return;let active=true; inspectInvitation(token).then(result=>{if(active){setStatus(result);if(['claimed_owned','claimed_other','expired','revoked','invalid'].includes(result.state))window.sessionStorage.removeItem('veralex_claim_token');}}).catch(cause=>{if(active){setStatus({state:'invalid'});setNotice(cause instanceof Error?cause.message:'Tautan belum dapat diperiksa.');}});return()=>{active=false;};},[token]);
  async function continueWithGoogle(){setLoading(true);setNotice('');try {const {error}=await workspaceBrowser().auth.signInWithOAuth({provider:'google',options:{redirectTo:workspaceOAuthRedirectTo('invite')}});if(error)throw error;}catch(cause){setNotice(cause instanceof Error?cause.message:'Masuk dengan Google gagal.');setLoading(false);}}
  async function claim(){setLoading(true);setNotice('');try{const result=await claimInvitation(token);if((result.state==='claimed'||result.state==='claimed_owned')&&result.projectId){window.sessionStorage.removeItem('veralex_claim_token');router.replace(`/portal/proyek/${result.projectId}`);router.refresh();return;}setNotice(result.state==='claimed_other'?'Tautan sudah diklaim akun Google lain.':result.state==='expired'?'Tautan kedaluwarsa.':result.state==='revoked'?'Tautan telah dicabut.':'Tautan tidak berlaku.');setStatus({...status!,state:result.state==='claimed'?'claimed_owned':result.state});}catch(cause){setNotice(cause instanceof Error?cause.message:'Akses belum dapat diklaim.');}finally{setLoading(false);}}
  return <div className="workspace ws-invite-page"><div className="ws-invite-card"><BrandLogo compact />
    {!status ? <p role="status">Memeriksa tautan…</p> : status.state==='signin' ? <><p className="ws-eyebrow">Akses proyek</p><h1>Masuk untuk membuka tautan.</h1><p className="ws-muted">Masuk dengan akun Google Anda. Pemilik pertama yang berhasil mengklaim tautan akan memperoleh akses proyek.</p><button className="ws-button ws-button-primary ws-full" disabled={loading} onClick={continueWithGoogle}>{loading?'Menghubungkan…':'Lanjutkan dengan Google'}</button></> : status.state==='unauthorized' ? <><p className="ws-eyebrow">Akses proyek</p><h1>Akun ini tidak dapat mengklaim proyek.</h1><p className="ws-muted">Gunakan akun Google klien yang sesuai untuk membuka tautan. Akun administrator tidak dapat dipakai untuk klaim klien.</p><button className="ws-button ws-button-secondary" onClick={async()=>{await workspaceBrowser().auth.signOut();setStatus({state:'signin'});}}>Keluar dan gunakan akun lain</button></> : status.state==='valid' ? <><p className="ws-eyebrow">Akses proyek</p><h1>Ikuti perkembangan layanan Anda.</h1><p className="ws-muted">Klaim akses hanya jika tautan ini diterima dari tim VERALEX melalui percakapan resmi.</p><div className="ws-invite-project"><strong>{status.projectTitle}</strong><span>{status.serviceName}</span></div><button className="ws-button ws-button-primary ws-full" disabled={loading} onClick={claim}>{loading?'Memproses…':'Klaim akses proyek'}</button></> : <><p className="ws-eyebrow">Status tautan</p><h1>{status.state==='claimed_owned'?'Proyek sudah terhubung':status.state==='claimed_other'?'Tautan sudah digunakan':status.state==='expired'?'Tautan kedaluwarsa':status.state==='revoked'?'Tautan telah dicabut':'Tautan tidak ditemukan'}</h1><p className="ws-muted">Hubungi tim VERALEX melalui percakapan resmi bila Anda memerlukan bantuan akses.</p>{status.state==='claimed_owned'&&status.projectId&&<Link href={`/portal/proyek/${status.projectId}`} className="ws-button ws-button-primary">Buka proyek</Link>}<a href={whatsappHref('Halo Kak Vheilljei, saya membutuhkan bantuan akses proyek VERALEX.')} target="_blank" rel="noopener noreferrer" className="ws-button ws-button-secondary">Hubungi VERALEX</a></>}
    {notice&&<p className="ws-error" role="alert">{notice}</p>}
  </div></div>;
}

export function PortalDashboard() {
  const { data, clientAccountId } = useWorkspace(); const account = data.clientAccounts.find(item => item.id === clientAccountId);
  const projectIds = new Set(data.accesses.filter(item => item.accountId === clientAccountId && !item.revokedAt).map(item => item.projectId));
  const projects = data.projects.filter(item => projectIds.has(item.id) && item.status !== 'archived');
  const updates = data.activities.filter(item => item.clientVisible && projectIds.has(item.projectId || '')).sort((a, b) => b.at.localeCompare(a.at));
  const unread = data.notifications.filter(item => item.role === 'client' && !item.read && item.projectId && projectIds.has(item.projectId)).length;
  return <><PageHeader eyebrow="Portal Klien" title={`Halo, ${account?.name || 'Klien'}`} description="Lihat status layanan dan langkah berikutnya di satu tempat." action={<Link href="/portal/notifikasi" className="ws-button ws-button-secondary">Notifikasi {unread ? `(${unread})` : ''}</Link>} />
    <section className="ws-section"><div className="ws-section-title"><h2>Proyek Anda</h2><span>{projects.length} layanan</span></div>{projects.length ? <div className="ws-card-grid">{projects.map(project => <ProjectCard key={project.id} project={project} role="client" />)}</div> : <EmptyState title="Belum ada proyek yang terhubung" description="Setelah tautan proyek diklaim dengan akun Google, proyek akan muncul di sini." />}</section>
    <div className="ws-detail-grid"><section className="ws-surface ws-pad"><h2>Perlu tindakan Anda</h2>{projects.some(item => item.status === 'waiting_client') ? projects.filter(item => item.status === 'waiting_client').map(project => <Link className="ws-client-action" href={`/portal/proyek/${project.id}`} key={project.id}><strong>{project.title}</strong><span>{nextTask(project.stages)?.title || 'Hubungi PIC untuk informasi lanjut'} →</span></Link>) : <EmptyState title="Tidak ada tindakan saat ini" description="Tim VERALEX akan memberi kabar bila ada informasi yang diperlukan." />}</section><section className="ws-surface ws-pad"><h2>Pembaruan terbaru</h2>{updates.length ? updates.slice(0, 4).map(item => <div className="ws-client-update" key={item.id}><p>{item.text}</p><small>{formatDateTime(item.at)}</small></div>) : <EmptyState title="Belum ada pembaruan" />}</section></div>
  </>;
}

export function PortalProject() {
  const { id } = useParams<{ id: string }>(); const { data, clientAccountId, setPriority } = useWorkspace(); const [confirm, setConfirm] = useState<'request' | 'cancel' | null>(null);
  const access = data.accesses.find(item => item.projectId === id && item.accountId === clientAccountId && !item.revokedAt);
  const project = access ? data.projects.find(item => item.id === id && item.status !== 'archived') : undefined;
  if (!project) return <EmptyState title="Proyek tidak ditemukan atau tidak diizinkan" description="Hanya proyek yang diklaim profil ini dapat dilihat." action={<Link href="/portal" className="ws-button ws-button-secondary">Kembali ke portal</Link>} />;
  const service = data.services.find(item => item.id === project.serviceId); const pic = data.admins.find(item => item.id === project.picId);
  const activities = data.activities.filter(item => item.projectId === project.id && item.clientVisible).sort((a, b) => b.at.localeCompare(a.at));
  const offering = data.priorityOffering;
  const eligible = offering.enabled && offering.serviceIds.includes(project.serviceId) && !['completed', 'cancelled', 'archived', 'rejected'].includes(project.status) && (offering.stageIds.length === 0 || offering.stageIds.includes(`${project.serviceId}:${currentStage(project.stages)?.id || ''}`));
  return <><Link className="ws-back" href="/portal">← Semua proyek</Link><PageHeader eyebrow={project.reference} title={project.title} description={service?.name} action={<Badge status={project.status} />} />
    <div className="ws-portal-hero"><div><span className="ws-eyebrow">Status saat ini</span><h2>{currentStage(project.stages)?.clientLabel}</h2><p>{project.status === 'waiting_external' ? 'Proses berada pada instansi terkait. Waktu dan keputusan ditentukan oleh instansi.' : project.status === 'waiting_client' ? 'Tim VERALEX sedang menunggu informasi atau kelengkapan dari Anda melalui kanal komunikasi resmi.' : project.status === 'completed' ? 'Layanan ini telah selesai.' : project.status === 'cancelled' ? 'Proyek ini telah dibatalkan.' : 'Tim VERALEX sedang menangani tahap ini.'}</p></div><div><span>Langkah berikutnya</span><strong>{project.status === 'waiting_client' ? 'Silakan hubungi PIC untuk tindak lanjut.' : nextTask(project.stages)?.title || 'Tim akan memberi kabar berikutnya.'}</strong><small>Terakhir diperbarui {formatDateTime(project.updatedAt)}</small></div></div>
    <div className="ws-detail-grid"><section className="ws-surface ws-pad"><h2>Perjalanan proyek</h2><ProgressSummary project={project} /><Timeline stages={project.stages} client /></section><section className="ws-surface ws-pad"><h2>Penanggung jawab Anda</h2><div className="ws-pic"><span className="ws-avatar">{pic?.name[0] || 'V'}</span><div><strong>{pic?.name || 'Tim VERALEX'}</strong><small>PIC proyek</small></div></div><p className="ws-muted">Ada pertanyaan tentang tahapan? Hubungi kanal resmi VERALEX.</p><a className="ws-button ws-button-primary" href={whatsappHref(`Halo Kak Vheilljei, saya ingin menanyakan proyek ${project.reference}.`)} target="_blank" rel="noopener noreferrer">Hubungi VERALEX</a></section><section className="ws-surface ws-pad"><h2>Pembaruan proyek</h2>{activities.length ? activities.map(item => <div className="ws-client-update" key={item.id}><p>{item.text}</p><small>{formatDateTime(item.at)}</small></div>) : <EmptyState title="Belum ada pembaruan" />}</section></div>
    <section className="ws-surface ws-pad ws-spaced"><h2>Layanan Prioritas Penanganan VERALEX</h2>{eligible || project.priority !== 'none' ? <><p className="ws-muted">{offering.description}</p><div className="ws-priority-grid"><div><strong>Yang diprioritaskan</strong><p>{offering.commitment}</p></div><div><strong>Batasan</strong><p>{offering.limitations}</p></div><div><strong>Harga</strong><p>{project.priorityPrice !== undefined ? project.priorityPrice ? `Rp${project.priorityPrice.toLocaleString('id-ID')}` : 'Ditentukan setelah tinjauan' : offering.price ? `Rp${offering.price.toLocaleString('id-ID')}` : 'Ditentukan setelah tinjauan'}</p></div></div><p className="ws-info">{offering.terms} Pembayaran belum tersedia di portal ini.</p>{['none', 'rejected', 'cancelled'].includes(project.priority) && eligible ? <button className="ws-button ws-button-primary" onClick={() => setConfirm('request')}>Ajukan Layanan Prioritas</button> : <div className="ws-inline-actions"><Badge status={project.priority} />{project.priority === 'requested' && <button className="ws-button ws-button-quiet" onClick={() => setConfirm('cancel')}>Batalkan permintaan</button>}</div>}</> : <p className="ws-muted">Layanan prioritas belum tersedia untuk tahap proyek ini.</p>}</section>
    {confirm && <ConfirmDialog title={confirm === 'request' ? 'Ajukan layanan prioritas?' : 'Batalkan permintaan prioritas?'} description={confirm === 'request' ? `Permintaan akan ditinjau tim. ${offering.limitations} ${offering.terms}` : 'Permintaan yang sedang menunggu tinjauan akan dibatalkan dan tim VERALEX akan menerima pembaruan status.'} confirmLabel={confirm === 'request' ? 'Ya, ajukan' : 'Ya, batalkan'} danger={confirm === 'cancel'} onConfirm={() => setPriority(project.id, confirm === 'request' ? 'requested' : 'cancelled')} onClose={() => setConfirm(null)} />}
  </>;
}
