'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useWorkspace, currentStage, nextTask, formatDate, formatDateTime } from './store';
import { statusLabels, priorityLabels, type Project, type ProjectStatus, type ProjectAccessLink } from './model';
import { Badge, ConfirmDialog, EmptyState, PageHeader, ProgressSummary, Timeline } from './ui';
import { ProjectWorkflowEditor } from './project-workflow';

export function ProjectDetail() {
  const { id } = useParams<{ id: string }>();
  const { data, updateProject, addProjectUpdate, setPriority, createAccessLink, revokeAccessLink, revokeAccess, resetAccess, deleteProject } = useWorkspace();
  const project = data.projects.find(item => item.id === id);
  const [tab, setTab] = useState('ringkasan');
  const [checkedAt] = useState(() => Date.now());
  const [confirm, setConfirm] = useState<{ title: string; description: string; action: () => void | Promise<unknown>; danger?: boolean; confirmLabel?:string } | null>(null);
  const [copied, setCopied] = useState(false);
  const [updateMessage,setUpdateMessage]=useState(''); const [updateVisible,setUpdateVisible]=useState(true); const [updateError,setUpdateError]=useState(''); const [updating,setUpdating]=useState(false);
  if (!project) return <EmptyState title="Proyek tidak ditemukan" description="Periksa kembali tautan proyek." action={<Link href="/admin/proyek" className="ws-button ws-button-secondary">Kembali ke proyek</Link>} />;

  const client = data.clients.find(item => item.id === project.clientId);
  const service = data.services.find(item => item.id === project.serviceId);
  const pic = data.admins.find(item => item.id === project.picId);
  const creator = data.admins.find(item => item.id === project.creatorId);
  const updater = data.admins.find(item => item.id === project.updatedById) || data.clientAccounts.find(item => item.id === project.updatedById);
  const activities = data.activities.filter(item => item.projectId === project.id).sort((a, b) => b.at.localeCompare(a.at));
  const projectLinks=data.accessLinks.filter(item=>item.projectId===project.id).sort((a,b)=>b.createdAt.localeCompare(a.createdAt));
  const latestLink=projectLinks[0];
  const link = projectLinks.find(item => item.status === 'active' && new Date(item.expiresAt).getTime() > checkedAt);
  const access = data.accesses.find(item => item.projectId === project.id && !item.revokedAt);
  const account = data.clientAccounts.find(item => item.id === access?.accountId);
  const url = link?.token && typeof window !== 'undefined' ? `${window.location.origin}/invite#${link.token}` : '';
  const tabs = [['ringkasan', 'Ringkasan'], ['workflow', 'Workflow & checklist'], ['aktivitas', 'Aktivitas'], ['pengaturan', 'Pengaturan Proyek']];
  async function copyLink() { if (!url) return; try { await navigator.clipboard.writeText(new URL(url, window.location.origin).toString()); setCopied(true); } catch { setCopied(false); } }
  return <>
    <Link href="/admin/proyek" className="ws-back">← Semua proyek</Link>
    <PageHeader eyebrow={project.reference} title={project.title} description={`${client?.name || 'Klien'} · ${service?.name || 'Layanan'}`}
      action={<div className="ws-inline-actions"><Badge status={project.status} /><button className="ws-button ws-button-secondary" onClick={() => setTab('pengaturan')}>Edit proyek</button></div>} />
    <div className="ws-detail-top"><div><span>Dibuat oleh</span><strong>{creator?.name || '—'}</strong></div><div><span>Penanggung jawab (PIC)</span><strong>{pic?.name || '—'}</strong></div><div><span>Terakhir diperbarui oleh</span><strong>{updater?.name || '—'}</strong></div><div><span>Terakhir diperbarui</span><strong>{formatDateTime(project.updatedAt)}</strong></div></div>
    <div className="ws-tabs" role="tablist" aria-label="Detail proyek">{tabs.map(([key, label]) => <button key={key} role="tab" aria-selected={tab === key} className={tab === key ? 'is-active' : ''} onClick={() => setTab(key)}>{label}</button>)}</div>
    {tab === 'ringkasan' && <div className="ws-detail-grid">
      <section className="ws-surface ws-pad"><h2>Langkah berikutnya</h2><p className="ws-large-line">{nextTask(project.stages)?.title || 'Semua tugas selesai'}</p><p className="ws-muted">Tahap: {currentStage(project.stages)?.title || '—'}</p><div className="ws-inline-actions"><button className="ws-button ws-button-primary" onClick={() => setTab('workflow')}>Buka checklist</button><button className="ws-button ws-button-secondary" onClick={() => setTab('pengaturan')}>Perbarui status</button></div>{project.status.startsWith('waiting') && <p className="ws-info">{statusLabels[project.status]}. {project.notes || 'Periksa alasan dan tindak lanjut proyek.'}</p>}</section>
      <section className="ws-surface ws-pad"><h2>Progres untuk klien</h2><ProgressSummary project={project} /><Timeline stages={project.stages} client /></section>
      <section className="ws-surface ws-pad"><h2>Hubungan klien</h2><dl className="ws-facts"><div><dt>Klien</dt><dd><Link href={`/admin/klien/${client?.id}`}>{client?.name || '—'}</Link></dd></div><div><dt>Kontak WhatsApp</dt><dd>{client?.phone || '—'}</dd></div><div><dt>Follow-up</dt><dd>{formatDate(project.followUpAt)}</dd></div><div><dt>Admin pendukung</dt><dd>{project.supportingIds.map(adminId => data.admins.find(item => item.id === adminId)?.name).join(', ') || '—'}</dd></div></dl><p className="ws-muted">Persyaratan dan berkas ditangani di luar portal melalui proses VERALEX.</p></section>
      <InvitationManagementCard account={account} access={access} activeLink={link} latestLink={latestLink} url={url} copied={copied} onCopy={copyLink} onCreate={() => createAccessLink(project.id)} onConfirm={setConfirm} onRevokeLink={() => revokeAccessLink(project.id)} onRevokeAccess={() => revokeAccess(project.id)} onReset={() => resetAccess(project.id)} />
      <section className="ws-surface ws-pad"><h2>Penanganan prioritas</h2><p>{priorityLabels[project.priority]}</p><p className="ws-muted">{project.priorityPrice ? `Harga saat diajukan: Rp${project.priorityPrice.toLocaleString('id-ID')}` : 'Harga menunggu penetapan atau peninjauan.'}</p>
        {project.priority === 'requested' && <div className="ws-inline-actions"><button className="ws-button ws-button-primary" onClick={() => setPriority(project.id, 'approved')}>Setujui permintaan</button><button className="ws-button ws-button-secondary" onClick={() => setConfirm({ title: 'Tolak permintaan?', description: 'Status penolakan akan terlihat oleh klien.', action: () => setPriority(project.id, 'rejected'), danger: true })}>Tolak</button></div>}
        {project.priority === 'approved' && <button className="ws-button ws-button-secondary ws-spaced" onClick={() => setPriority(project.id, 'payment_unavailable')}>Tandai pembayaran belum tersedia</button>}
        {['approved', 'payment_unavailable'].includes(project.priority) && <p className="ws-info">Pembayaran belum terhubung ke penyedia resmi. Status aktif memerlukan konfirmasi dari penyedia pembayaran resmi.</p>}
      </section>
    </div>}
    {tab === 'workflow' && <ProjectWorkflowEditor project={project} />}
    {tab === 'aktivitas' && <section className="ws-surface ws-pad"><h2>Riwayat aktivitas</h2><form className="ws-form-grid" onSubmit={async event=>{event.preventDefault();setUpdateError('');setUpdating(true);try{await addProjectUpdate(project.id,updateMessage.trim(),updateVisible);setUpdateMessage('');}catch(cause){setUpdateError(cause instanceof Error?cause.message:'Pembaruan belum tersimpan.');}finally{setUpdating(false);}}}><label className="ws-span-2">Pembaruan proyek<textarea rows={3} required maxLength={1000} value={updateMessage} onChange={event=>setUpdateMessage(event.target.value)} placeholder="Tulis perkembangan tanpa nomor identitas atau isi berkas" /></label><label className="ws-check ws-span-2"><input type="checkbox" checked={updateVisible} onChange={event=>setUpdateVisible(event.target.checked)} />Tampilkan kepada klien</label>{updateError&&<p className="ws-error ws-span-2" role="alert">{updateError}</p>}<button className="ws-button ws-button-primary" disabled={updating||!updateMessage.trim()}>{updating?'Menyimpan…':'Tambahkan pembaruan'}</button></form><div className="ws-activity-list">{activities.map(activity => <div key={activity.id}><span className="ws-event-dot" /><p><strong>{activity.text}</strong><small>{formatDateTime(activity.at)} · {activity.clientVisible ? 'Pembaruan klien' : 'Internal'}</small></p></div>)}</div></section>}
    {tab === 'pengaturan' && <ProjectSettings project={project} onArchive={() => setConfirm({ title: project.status === 'archived' ? 'Pulihkan proyek?' : 'Arsipkan proyek?', description: 'Perubahan status akan tercatat dalam aktivitas.', action: async () => { await updateProject(project.id, { status: project.status === 'archived' ? 'active' : 'archived' }, project.status === 'archived' ? 'memulihkan proyek.' : 'mengarsipkan proyek.'); }, danger: project.status !== 'archived' })} onDelete={() => setConfirm({title:'Hapus proyek dari tampilan aktif?',description:`Proyek “${project.title}” dan akses undangannya akan dicabut. Riwayat alur kerja serta audit tetap disimpan untuk pencatatan.`,confirmLabel:'Hapus proyek',action:async()=>{await deleteProject(project.id);window.location.assign('/admin/proyek');},danger:true})} />}
    {confirm && <ConfirmDialog title={confirm.title} description={confirm.description} danger={confirm.danger} onConfirm={confirm.action} onClose={() => setConfirm(null)} />}
  </>;
}

function InvitationManagementCard({account,access,activeLink,latestLink,url,copied,onCopy,onCreate,onConfirm,onRevokeLink,onRevokeAccess,onReset}:{account?:{name:string;email:string};access?:{grantedAt:string};activeLink?:ProjectAccessLink;latestLink?:ProjectAccessLink;url:string;copied:boolean;onCopy:()=>Promise<void>;onCreate:()=>Promise<void>;onConfirm:(value:{title:string;description:string;action:()=>void|Promise<unknown>;danger?:boolean;confirmLabel?:string})=>void;onRevokeLink:()=>Promise<void>;onRevokeAccess:()=>Promise<void>;onReset:()=>Promise<void>}){
  const [busy,setBusy]=useState(false);
  async function create(){if(busy)return;setBusy(true);try{await onCreate();}catch{}finally{setBusy(false);}}
  const state=account?'claimed':activeLink?(activeLink.token?'active':'active-secret-hidden'):latestLink?.status==='claimed'?'revoked-access':latestLink?.status||'none';
  const label=state==='claimed'?'Diklaim':state==='active'?'Undangan aktif':state==='active-secret-hidden'?'Aktif · URL tidak dapat dipulihkan':state==='expired'?'Kedaluwarsa':state==='revoked'?'Dicabut':state==='revoked-access'?'Akses sebelumnya dicabut':'Belum dibuat';
  return <section className="ws-surface ws-pad"><h2>Berbagi akses proyek</h2><p className="ws-info">Tautan aktif hanya dapat diklaim sekali oleh akun Google klien. Verifikasi penerima melalui percakapan WhatsApp sebelum membagikannya.</p>
    <div className="ws-invitation-state"><span className={`ws-badge ws-badge-${state==='claimed'?'completed':state==='active'?'active':state==='expired'?'waiting_client':state==='revoked'?'cancelled':'draft'}`}>{label}</span>{latestLink&&<div><small>Dibuat {formatDateTime(latestLink.createdAt)} · kedaluwarsa {formatDateTime(latestLink.expiresAt)}</small></div>}</div>
    {account?<><p>Akun terhubung: <strong>{account.name}</strong><br/><small>{account.email} · diklaim {formatDateTime(access?.grantedAt)}</small></p><button className="ws-button ws-button-danger ws-spaced" onClick={()=>onConfirm({title:'Atur ulang akses klien?',description:'Akses akun saat ini akan dicabut dan tautan baru dibuat. Pastikan identitas penerima melalui WhatsApp sebelum membagikannya.',action:onReset,danger:true})}>Atur ulang klaim & buat tautan baru</button><button className="ws-button ws-button-quiet" onClick={()=>onConfirm({title:'Cabut akses klien?',description:'Akun yang terhubung tidak lagi dapat melihat proyek. Tindakan ini tercatat di aktivitas.',action:onRevokeAccess,danger:true})}>Cabut akses</button></>:<p className="ws-muted">{activeLink?'Menunggu klien mengklaim tautan ini.':'Belum ada akun klien yang mengklaim proyek ini.'}</p>}
    {activeLink&&url?<><div className="ws-share-link"><input readOnly aria-label="Tautan akses proyek" value={url}/><button className="ws-button ws-button-secondary" onClick={onCopy}>Salin tautan</button></div>{copied&&<small role="status">Tautan tersalin.</small>}<Link href={`/invite#${activeLink.token}`} className="ws-button ws-button-quiet">Pratinjau halaman akses</Link></>:activeLink?<><p className="ws-muted">Status undangan tersimpan. URL asli tidak disimpan di server setelah diterbitkan, sehingga tidak dapat dipulihkan setelah halaman dimuat ulang.</p><button className="ws-button ws-button-secondary" disabled={busy} onClick={()=>onConfirm({title:'Terbitkan tautan pengganti?',description:'Tautan pengganti akan mencabut tautan aktif sebelumnya. Tautan lama tidak dapat dipakai lagi.',confirmLabel:'Terbitkan tautan',action:onCreate,danger:true})}>Terbitkan tautan pengganti</button></>:!account&&<button className="ws-button ws-button-secondary" disabled={busy} onClick={create}>{busy?'Memproses…':latestLink?'Terbitkan tautan baru':'Buat tautan akses'}</button>}
    {activeLink&&<button className="ws-button ws-button-quiet" onClick={()=>onConfirm({title:'Cabut tautan?',description:'Tautan ini tidak bisa dipakai lagi. Anda dapat membuat tautan baru.',action:onRevokeLink,danger:true})}>Cabut tautan</button>}
  </section>;
}

function ProjectSettings({ project, onArchive, onDelete }: { project: Project; onArchive: () => void; onDelete:()=>void }) {
  const { data, updateProject } = useWorkspace();
  const [title, setTitle] = useState(project.title); const [status, setStatus] = useState<ProjectStatus>(project.status);
  const [pic, setPic] = useState(project.picId); const [followUp, setFollowUp] = useState(project.followUpAt);
  const [notes, setNotes] = useState(project.notes); const [supporting, setSupporting] = useState(project.supportingIds); const [error, setError] = useState(''); const [dirty,setDirty]=useState(false); const [saving,setSaving]=useState(false);
  useEffect(()=>{
    if(dirty)return;
    setTitle(project.title);setStatus(project.status);setPic(project.picId);setFollowUp(project.followUpAt);setNotes(project.notes);setSupporting(project.supportingIds);
  },[project,dirty]);
  async function save(event: React.FormEvent) {
    event.preventDefault(); setError(''); if (!title.trim()) return setError('Judul proyek wajib diisi.');
    const changes = [];
    if (pic !== project.picId) changes.push(`mengubah PIC menjadi ${data.admins.find(item => item.id === pic)?.name}`);
    if (status !== project.status) changes.push(`mengubah status menjadi ${statusLabels[status]}`);
    if (title !== project.title || followUp !== project.followUpAt || notes !== project.notes || supporting.join() !== project.supportingIds.join()) changes.push('memperbarui rincian proyek');
    if(!changes.length){setDirty(false);return;}
    setSaving(true);
    try {await updateProject(project.id, { title: title.trim(), status, picId: pic, followUpAt: followUp, notes: notes.trim(), supportingIds: supporting }, `${changes.join(', ')}.`, status !== project.status);setDirty(false);}
    catch(cause){setError(cause instanceof Error?cause.message:'Proyek belum dapat diperbarui.');}
    finally{setSaving(false);}
  }
  return <div className="ws-detail-grid"><form className="ws-surface ws-pad" onSubmit={save}><h2>Pengaturan proyek</h2><div className="ws-form-grid">
    <label className="ws-span-2">Judul proyek<input required value={title} onChange={event => {setTitle(event.target.value);setDirty(true);}} /></label>
    <label>Status<select value={status} onChange={event => {setStatus(event.target.value as ProjectStatus);setDirty(true);}}>{Object.entries(statusLabels).filter(([value]) => value !== 'archived').map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label>
    <label>PIC utama<select value={pic} onChange={event => {setPic(event.target.value);setDirty(true);}}>{data.admins.filter(item => item.active).map(item => <option key={item.id} value={item.id}>{item.name}</option>)}</select></label>
    <label>Follow-up berikutnya<input type="date" value={followUp} onChange={event => {setFollowUp(event.target.value);setDirty(true);}} /></label>
    <label>Admin pendukung<select multiple value={supporting} onChange={event => {setSupporting(Array.from(event.target.selectedOptions).map(item => item.value));setDirty(true);}}>{data.admins.filter(item => item.active && item.id !== pic).map(item => <option key={item.id} value={item.id}>{item.name}</option>)}</select></label>
    <label className="ws-span-2">Catatan operasional<textarea rows={3} value={notes} onChange={event => {setNotes(event.target.value);setDirty(true);}} /><small>Jangan menulis nomor identitas atau isi berkas.</small></label>
  </div>{error && <p className="ws-error" role="alert">{error}</p>}<button className="ws-button ws-button-primary" disabled={saving}>{saving?'Menyimpan…':'Simpan perubahan'}</button></form>
    <section className="ws-surface ws-pad"><h2>Arsip proyek</h2><p className="ws-muted">Proyek yang diarsipkan tetap berada dalam riwayat tim.</p><button className="ws-button ws-button-secondary ws-spaced" type="button" onClick={onArchive}>{project.status === 'archived' ? 'Pulihkan proyek' : 'Arsipkan proyek'}</button><hr/><h2>Hapus proyek</h2><p className="ws-muted">Menghapus proyek akan mencabut tautan dan akses klien. Riwayat aktivitas disimpan dan proyek dikeluarkan dari daftar aktif.</p><button className="ws-button ws-button-danger ws-spaced" type="button" onClick={onDelete}>Hapus proyek</button></section>
  </div>;
}
