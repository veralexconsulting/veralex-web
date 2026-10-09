'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { useWorkspace, nextTask, formatDate, formatDateTime } from './store';
import { statusLabels } from './model';
import { Badge, EmptyState, PageHeader, ProjectCard, ProjectTable, Timeline } from './ui';

export function AdminDashboard() {
  const { data, actorId } = useWorkspace();
  const [pic, setPic] = useState(''); const [status, setStatus] = useState(''); const [search, setSearch] = useState('');
  const active = data.projects.filter(project => !['completed', 'cancelled', 'archived', 'rejected'].includes(project.status));
  const attention = active.filter(project => ['active', 'review', 'waiting_client'].includes(project.status) || (project.followUpAt && project.followUpAt < new Date().toISOString().slice(0, 10)))
    .filter(project => (!pic || project.picId === pic) && (!status || project.status === status) && (!search || `${project.title} ${data.clients.find(item => item.id === project.clientId)?.name}`.toLowerCase().includes(search.toLowerCase())));
  const metrics = [
    ['Proyek aktif', active.length], ['Perlu tindakan', attention.length],
    ['Menunggu klien', active.filter(item => item.status === 'waiting_client').length],
    ['Menunggu instansi', active.filter(item => item.status === 'waiting_external').length],
    ['Follow-up terlambat', active.filter(item => item.followUpAt && item.followUpAt < new Date().toISOString().slice(0, 10)).length],
    ['Permintaan prioritas', active.filter(item => item.priority !== 'none').length],
  ];
  return <>
    <PageHeader eyebrow="Ruang kerja tim" title={`Selamat datang, ${data.admins.find(item => item.id === actorId)?.name.split(' ')[0] || 'Admin'}`}
      description={new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
      action={<Link className="ws-button ws-button-primary" href="/admin/proyek/baru">+ Buat Proyek</Link>} />
    <div className="ws-metrics">{metrics.map(([label, count]) => <div className="ws-metric" key={label}><span>{label}</span><strong>{count}</strong></div>)}</div>
    <section className="ws-section">
      <div className="ws-section-title"><div><p className="ws-eyebrow">Prioritas harian</p><h2>Perlu Ditangani Hari Ini</h2></div><Link href="/admin/proyek">Semua proyek →</Link></div>
      <div className="ws-filter-row"><input aria-label="Cari proyek" placeholder="Cari proyek atau klien" value={search} onChange={event => setSearch(event.target.value)} />
        <select aria-label="Filter PIC" value={pic} onChange={event => setPic(event.target.value)}><option value="">Semua PIC</option>{data.admins.filter(item => item.active).map(item => <option key={item.id} value={item.id}>{item.name}</option>)}</select>
        <select aria-label="Filter status" value={status} onChange={event => setStatus(event.target.value)}><option value="">Semua status</option>{Object.entries(statusLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select>
      </div>
      {attention.length ? <div className="ws-attention-list">{attention.map(project => <Link key={project.id} href={`/admin/proyek/${project.id}`} className="ws-attention-item">
        <div className="ws-attention-icon">{project.priority !== 'none' ? '★' : '↗'}</div><div><strong>{project.title}</strong><span>{data.clients.find(item => item.id === project.clientId)?.name} · {data.services.find(item => item.id === project.serviceId)?.name}</span><small>Berikutnya: {nextTask(project.stages)?.title || 'Tinjau proyek'}</small></div>
        <div className="ws-attention-meta"><Badge status={project.status} /><small>PIC {data.admins.find(item => item.id === project.picId)?.name}</small><small>Follow-up {formatDate(project.followUpAt)}</small></div><b aria-hidden="true">→</b>
      </Link>)}</div> : <EmptyState title="Tidak ada tindakan untuk filter ini" description="Coba pilih PIC atau status lain." />}
    </section>
    <div className="ws-two-col"><section className="ws-section"><div className="ws-section-title"><h2>Baru diperbarui</h2></div><div className="ws-card-grid">{[...data.projects].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)).slice(0, 3).map(project => <ProjectCard key={project.id} project={project} />)}</div></section>
      <section className="ws-section"><div className="ws-section-title"><h2>Aktivitas tim</h2></div><div className="ws-surface ws-compact-events">{data.activities.slice(0, 5).map(event => <div key={event.id}><span className="ws-event-dot" /><p>{event.text}<small>{formatDateTime(event.at)}</small></p></div>)}</div></section></div>
  </>;
}

export function ProjectList() {
  const { data } = useWorkspace();
  const [query, setQuery] = useState(''); const [service, setService] = useState(''); const [status, setStatus] = useState(''); const [pic, setPic] = useState(''); const [priority, setPriority] = useState(''); const [sort, setSort] = useState('recent'); const [page, setPage] = useState(1);
  const filtered = useMemo(() => data.projects.filter(project => {
    const client = data.clients.find(item => item.id === project.clientId);
    return (!query || `${project.title} ${project.reference} ${client?.name}`.toLowerCase().includes(query.toLowerCase())) &&
      (!service || project.serviceId === service) && (!status || project.status === status) && (!pic || project.picId === pic) &&
      (!priority || (priority === 'yes' ? project.priority !== 'none' : project.priority === 'none'));
  }).sort((a, b) => sort === 'oldest' ? a.createdAt.localeCompare(b.createdAt) : sort === 'newest' ? b.createdAt.localeCompare(a.createdAt) : sort === 'followup' ? (a.followUpAt || '9999').localeCompare(b.followUpAt || '9999') : b.updatedAt.localeCompare(a.updatedAt)), [data, query, service, status, pic, priority, sort]);
  const shown = filtered.slice((page - 1) * 8, page * 8);
  return <><PageHeader eyebrow="Operasional" title="Proyek" description={`${filtered.length} proyek sesuai pencarian`} action={<Link href="/admin/proyek/baru" className="ws-button ws-button-primary">+ Buat Proyek</Link>} />
    <div className="ws-surface ws-filters"><input value={query} onChange={event => { setQuery(event.target.value); setPage(1); }} aria-label="Cari proyek" placeholder="Cari judul, klien, atau nomor…" />
      <select aria-label="Filter layanan" value={service} onChange={event => { setService(event.target.value); setPage(1); }}><option value="">Semua layanan</option>{data.services.map(item => <option key={item.id} value={item.id}>{item.name}</option>)}</select>
      <select aria-label="Filter status" value={status} onChange={event => { setStatus(event.target.value); setPage(1); }}><option value="">Semua status</option>{Object.entries(statusLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select>
      <select aria-label="Filter PIC" value={pic} onChange={event => { setPic(event.target.value); setPage(1); }}><option value="">Semua PIC</option>{data.admins.map(item => <option key={item.id} value={item.id}>{item.name}</option>)}</select>
      <select aria-label="Filter prioritas" value={priority} onChange={event => { setPriority(event.target.value); setPage(1); }}><option value="">Semua prioritas</option><option value="yes">Ada permintaan</option><option value="no">Tanpa permintaan</option></select>
      <select aria-label="Urutkan proyek" value={sort} onChange={event => setSort(event.target.value)}><option value="recent">Baru diperbarui</option><option value="newest">Terbaru</option><option value="oldest">Terlama</option><option value="followup">Follow-up terdekat</option></select>
    </div><ProjectTable projects={shown} /><div className="ws-pagination"><span>Halaman {page} dari {Math.max(1, Math.ceil(filtered.length / 8))}</span><button className="ws-button ws-button-secondary" disabled={page === 1} onClick={() => setPage(page - 1)}>Sebelumnya</button><button className="ws-button ws-button-secondary" disabled={page * 8 >= filtered.length} onClick={() => setPage(page + 1)}>Berikutnya</button></div>
  </>;
}

export function CreateProject() {
  const { data, createProject } = useWorkspace(); const router = useRouter();
  const [form, setForm] = useState({ clientId:'', clientName: '', clientEmail: '', clientPhone: '', serviceId: '', title: '', picId: '', startAt: new Date().toISOString().slice(0, 10), followUpAt: '', notes: '', supportingIds: [] as string[] });
  const [error, setError] = useState(''); const [dirty, setDirty] = useState(false); const [saving, setSaving] = useState(false);
  useEffect(() => { const handler = (event: BeforeUnloadEvent) => { if (dirty) event.preventDefault(); }; window.addEventListener('beforeunload', handler); return () => window.removeEventListener('beforeunload', handler); }, [dirty]);
  useEffect(() => { if (!dirty) return; const handler = (event: MouseEvent) => { const link = (event.target as HTMLElement).closest('a[href]'); if (link && !window.confirm('Perubahan belum disimpan. Tinggalkan halaman?')) { event.preventDefault(); event.stopPropagation(); } }; document.addEventListener('click', handler, true); return () => document.removeEventListener('click', handler, true); }, [dirty]);
  const set = (name: keyof typeof form, value: string | string[]) => { setForm(previous => ({ ...previous, [name]: value })); setDirty(true); };
  const service = data.services.find(item => item.id === form.serviceId);
  async function submit(event: React.FormEvent) {
    event.preventDefault(); setError('');
    if (!form.clientName.trim() || !form.title.trim() || !form.picId || !service) return setError('Lengkapi semua kolom wajib.');
    if (form.clientEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.clientEmail)) return setError('Email kontak harus valid atau dikosongkan.');
    setSaving(true);
    try { const id = await createProject(form); setDirty(false); router.push(`/admin/proyek/${id}`); }
    catch (cause) { setError(cause instanceof Error ? cause.message : 'Gagal menyiapkan proyek.'); setSaving(false); }
  }
  return <><PageHeader eyebrow="Proyek / Baru" title="Buat Proyek" description="Buat setelah kesepakatan layanan melalui WhatsApp. Email Google klien tidak diperlukan." />
    <form className="ws-form-layout" onSubmit={submit}><div className="ws-surface ws-form-card"><h2>Informasi proyek</h2><div className="ws-form-grid">
      {data.clients.length>0&&<label className="ws-span-2">Klien yang sudah ada<select value={form.clientId} onChange={event=>{const client=data.clients.find(item=>item.id===event.target.value);setForm(previous=>({...previous,clientId:client?.id||'',clientName:client?.name||'',clientEmail:client?.email||'',clientPhone:client?.phone||''}));setDirty(true);}}><option value="">Buat klien baru</option>{data.clients.map(item=><option key={item.id} value={item.id}>{item.name}</option>)}</select></label>}
      <label>Nama klien / perusahaan <em>*</em><input required readOnly={Boolean(form.clientId)} value={form.clientName} onChange={event => set('clientName', event.target.value)} placeholder="Contoh: PT Maju Bersama" /></label>
      <label>Nomor WhatsApp kontak<input type="tel" readOnly={Boolean(form.clientId)} value={form.clientPhone} onChange={event => set('clientPhone', event.target.value)} placeholder="62812…" /></label>
      <label>Email kontak (opsional)<input type="email" readOnly={Boolean(form.clientId)} value={form.clientEmail} onChange={event => set('clientEmail', event.target.value)} placeholder="kontak@perusahaan.com" /><small>Tidak dipakai untuk menentukan akun Google pengklaim.</small></label>
      <label>Jenis layanan <em>*</em><select required value={form.serviceId} onChange={event => set('serviceId', event.target.value)}><option value="">Pilih layanan</option>{data.services.map(item => <option key={item.id} value={item.id}>{item.name}</option>)}</select></label>
      <label className="ws-span-2">Judul proyek <em>*</em><input required value={form.title} onChange={event => set('title', event.target.value)} placeholder="Contoh: Pendaftaran Merek Kopi Nusantara" /></label>
      <label>PIC utama <em>*</em><select required value={form.picId} onChange={event => set('picId', event.target.value)}><option value="">Pilih PIC</option>{data.admins.filter(item => item.active).map(item => <option key={item.id} value={item.id}>{item.name}</option>)}</select></label>
      <label>Admin pendukung<select multiple value={form.supportingIds} onChange={event => set('supportingIds', Array.from(event.target.selectedOptions).map(item => item.value))}>{data.admins.filter(item => item.active && item.id !== form.picId).map(item => <option key={item.id} value={item.id}>{item.name}</option>)}</select><small>Tahan Ctrl atau Cmd untuk memilih lebih dari satu.</small></label>
      <label>Tanggal mulai<input type="date" value={form.startAt} onChange={event => set('startAt', event.target.value)} /></label>
      <label>Jadwal follow-up<input type="date" value={form.followUpAt} onChange={event => set('followUpAt', event.target.value)} /></label>
      <label className="ws-span-2">Catatan internal singkat<textarea value={form.notes} onChange={event => set('notes', event.target.value)} rows={3} /><small>Jangan memasukkan nomor identitas atau isi dokumen.</small></label>
    </div><p className="ws-info">Setelah proyek dibuat, tautan akses dapat dibagikan lewat percakapan WhatsApp yang sudah diverifikasi. Orang pertama yang mengklaim tautan akan terhubung ke proyek.</p>
      {error && <p className="ws-error" role="alert">{error}</p>}<div className="ws-form-actions"><Link href="/admin/proyek" className="ws-button ws-button-quiet">Batal</Link><button disabled={saving} className="ws-button ws-button-primary">{saving ? 'Menyiapkan…' : 'Buat proyek & tautan'}</button></div></div>
      <aside className="ws-surface ws-preview"><h2>Alur kerja otomatis</h2>{service ? <><p>{service.name} · SOP awal v{service.version}</p><Timeline stages={service.stages} /><small>Template awal perlu ditinjau tim legal. Proyek memakai salinan independen yang dapat disesuaikan.</small></> : <EmptyState title="Pilih layanan" description="Tahapan awal akan muncul di sini." />}</aside>
    </form></>;
}
