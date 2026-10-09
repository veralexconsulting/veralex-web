'use client';

import { useEffect, useState } from 'react';
import { useWorkspace } from './store';
import { taskLabels, type Project, type Stage, type Task, type TaskStatus } from './model';
import { ConfirmDialog } from './ui';

const newId = () => crypto.randomUUID();
const blankStage = { title: '', clientLabel: '', description: '', completionCriteria: '', waitingKind: 'internal' as Stage['waitingKind'], clientVisible: true };

export function ProjectWorkflowEditor({ project }: { project: Project }) {
  const { updateWorkflow } = useWorkspace();
  const [editId, setEditId] = useState(''); const [stageDraft, setStageDraft] = useState(blankStage);
  const [showNewStage, setShowNewStage] = useState(false); const [newStage, setNewStage] = useState(blankStage);
  const [confirm, setConfirm] = useState<{ title: string; description: string; action: () => void } | null>(null);
  const [error, setError] = useState('');

  function commit(stages: Stage[], reason: string) { updateWorkflow(project.id, stages, reason); setError(''); }
  function moveStage(index: number, direction: -1 | 1) {
    const target = index + direction; if (target < 0 || target >= project.stages.length) return;
    const stages = structuredClone(project.stages); [stages[index], stages[target]] = [stages[target], stages[index]];
    commit(stages, `memindahkan tahap ${project.stages[index].title}`);
  }
  function saveStage(event: React.FormEvent) {
    event.preventDefault(); if (!stageDraft.title.trim() || !stageDraft.clientLabel.trim() || !stageDraft.completionCriteria.trim()) return setError('Nama, label klien, dan kriteria penyelesaian wajib diisi.');
    commit(project.stages.map(stage => stage.id === editId ? { ...stage, ...stageDraft, title: stageDraft.title.trim(), clientLabel: stageDraft.clientLabel.trim(), description: stageDraft.description.trim(), completionCriteria: stageDraft.completionCriteria.trim() } : stage), `mengedit tahap ${stageDraft.title}`);
    setEditId('');
  }
  function addStage(event: React.FormEvent) {
    event.preventDefault(); if (!newStage.title.trim() || !newStage.clientLabel.trim() || !newStage.completionCriteria.trim()) return setError('Nama, label klien, dan kriteria penyelesaian wajib diisi.');
    const stage: Stage = { ...newStage, id: newId(), title: newStage.title.trim(), clientLabel: newStage.clientLabel.trim(), description: newStage.description.trim(), completionCriteria: newStage.completionCriteria.trim(), tasks: [] };
    commit([...project.stages, stage], `menambahkan tahap ${stage.title}`); setNewStage(blankStage); setShowNewStage(false);
  }
  function removeStage(stage: Stage) {
    if (stage.tasks.some(task => !['pending', 'skipped'].includes(task.status))) return setError('Tahap yang sedang atau sudah dikerjakan tidak dapat dihapus.');
    setConfirm({ title: `Hapus tahap ${stage.title}?`, description: 'Tugas yang belum dimulai pada tahap ini akan terhapus dari proyek ini saja.', action: () => commit(project.stages.filter(item => item.id !== stage.id), `menghapus tahap ${stage.title}`) });
  }
  function updateTask(stageId: string, taskId: string, changes: Partial<Task>, reason: string) {
    commit(project.stages.map(stage => stage.id === stageId ? { ...stage, tasks: stage.tasks.map(task => task.id === taskId ? { ...task, ...changes } : task) } : stage), reason);
  }
  function moveTask(stage: Stage, index: number, direction: -1 | 1) {
    const target = index + direction; if (target < 0 || target >= stage.tasks.length) return;
    const tasks = structuredClone(stage.tasks); [tasks[index], tasks[target]] = [tasks[target], tasks[index]];
    commit(project.stages.map(item => item.id === stage.id ? { ...item, tasks } : item), `mengurutkan tugas pada ${stage.title}`);
  }
  function removeTask(stage: Stage, task: Task) {
    if (!['pending', 'skipped'].includes(task.status)) return setError('Tugas yang sedang atau sudah dikerjakan tidak dapat dihapus.');
    setConfirm({ title: `Hapus tugas ${task.title}?`, description: 'Tugas ini dihapus dari workflow proyek ini saja.', action: () => commit(project.stages.map(item => item.id === stage.id ? { ...item, tasks: item.tasks.filter(entry => entry.id !== task.id) } : item), `menghapus tugas ${task.title}`) });
  }
  return <div className="ws-workflow-layout">
    <div className="ws-section-title"><div><h2>Workflow proyek</h2><p className="ws-muted">Salinan SOP v{project.workflowVersion}. Perubahan di sini tidak mengubah proyek lain atau template master.</p></div><button className="ws-button ws-button-primary" onClick={() => setShowNewStage(true)}>+ Tambah tahap</button></div>
    <p className="ws-info">Tahap instansi mengikuti keputusan lembaga terkait. Persyaratan ditangani di luar portal; hanya status operasional yang dicatat di sini.</p>
    {error && <p className="ws-error" role="alert">{error}</p>}
    {project.stages.map((stage, stageIndex) => <section className="ws-surface ws-pad ws-workflow-stage" key={stage.id}>
      <div className="ws-workflow-heading"><span className="ws-stage-number">{String(stageIndex + 1).padStart(2, '0')}</span><div><h2>{stage.title}</h2><p>{stage.description}</p><small>{stage.clientVisible ? `Terlihat oleh klien: ${stage.clientLabel}` : 'Internal'} · {stage.waitingKind === 'institution' ? 'Tahap instansi' : stage.waitingKind === 'client' ? 'Dapat menunggu klien' : 'Proses internal'}</small></div></div>
      <div className="ws-inline-actions ws-stage-actions"><button className="ws-button ws-button-quiet" disabled={stageIndex === 0} onClick={() => moveStage(stageIndex, -1)}>↑ Naik</button><button className="ws-button ws-button-quiet" disabled={stageIndex === project.stages.length - 1} onClick={() => moveStage(stageIndex, 1)}>↓ Turun</button><button className="ws-button ws-button-secondary" onClick={() => { setEditId(stage.id); setStageDraft({ title: stage.title, clientLabel: stage.clientLabel, description: stage.description, completionCriteria: stage.completionCriteria, waitingKind: stage.waitingKind, clientVisible: stage.clientVisible }); }}>Edit tahap</button><button className="ws-button ws-button-quiet" onClick={() => removeStage(stage)}>Hapus tahap</button></div>
      {editId === stage.id && <form className="ws-workflow-edit ws-form-grid" onSubmit={saveStage}>
        <label>Nama tahap<input value={stageDraft.title} onChange={event => setStageDraft({ ...stageDraft, title: event.target.value })} required /></label>
        <label>Label untuk klien<input value={stageDraft.clientLabel} onChange={event => setStageDraft({ ...stageDraft, clientLabel: event.target.value })} required /></label>
        <label className="ws-span-2">Deskripsi<textarea value={stageDraft.description} onChange={event => setStageDraft({ ...stageDraft, description: event.target.value })} rows={2} /></label>
        <label>Kondisi menunggu<select value={stageDraft.waitingKind} onChange={event => setStageDraft({ ...stageDraft, waitingKind: event.target.value as Stage['waitingKind'] })}><option value="internal">Internal</option><option value="client">Klien</option><option value="institution">Instansi</option></select></label>
        <label>Kriteria selesai<input value={stageDraft.completionCriteria} onChange={event => setStageDraft({ ...stageDraft, completionCriteria: event.target.value })} required /></label>
        <label className="ws-check ws-span-2"><input type="checkbox" checked={stageDraft.clientVisible} onChange={event => setStageDraft({ ...stageDraft, clientVisible: event.target.checked })} />Tampilkan tahap kepada klien</label>
        <div className="ws-inline-actions ws-span-2"><button className="ws-button ws-button-primary">Simpan tahap</button><button type="button" className="ws-button ws-button-quiet" onClick={() => setEditId('')}>Batal</button></div>
      </form>}
      <div className="ws-task-list">{stage.tasks.map((task, index) => <TaskEditor key={task.id} projectId={project.id} stage={stage} task={task} index={index} count={stage.tasks.length} onEdit={(changes, reason) => updateTask(stage.id, task.id, changes, reason)} onMove={direction => moveTask(stage, index, direction)} onRemove={() => removeTask(stage, task)} />)}</div>
      <AddTask stage={stage} onAdd={(title, conditional) => commit(project.stages.map(item => item.id === stage.id ? { ...item, tasks: [...item.tasks, { id: newId(), title, conditional, status: 'pending' }] } : item), `menambahkan tugas ${title}`)} />
      <p className="ws-stage-criteria"><strong>Kriteria selesai:</strong> {stage.completionCriteria}</p>
    </section>)}
    {showNewStage && <form className="ws-surface ws-pad ws-form-grid" onSubmit={addStage}>
      <h2 className="ws-span-2">Tahap baru</h2><label>Nama tahap<input required value={newStage.title} onChange={event => setNewStage({ ...newStage, title: event.target.value, clientLabel: newStage.clientLabel || event.target.value })} /></label>
      <label>Label klien<input required value={newStage.clientLabel} onChange={event => setNewStage({ ...newStage, clientLabel: event.target.value })} /></label>
      <label className="ws-span-2">Deskripsi<textarea rows={2} value={newStage.description} onChange={event => setNewStage({ ...newStage, description: event.target.value })} /></label>
      <label>Kondisi menunggu<select value={newStage.waitingKind} onChange={event => setNewStage({ ...newStage, waitingKind: event.target.value as Stage['waitingKind'] })}><option value="internal">Internal</option><option value="client">Klien</option><option value="institution">Instansi</option></select></label>
      <label>Kriteria selesai<input required value={newStage.completionCriteria} onChange={event => setNewStage({ ...newStage, completionCriteria: event.target.value })} /></label>
      <label className="ws-check ws-span-2"><input type="checkbox" checked={newStage.clientVisible} onChange={event => setNewStage({ ...newStage, clientVisible: event.target.checked })} />Tampilkan kepada klien</label>
      <div className="ws-inline-actions ws-span-2"><button className="ws-button ws-button-primary">Simpan tahap</button><button type="button" className="ws-button ws-button-quiet" onClick={() => setShowNewStage(false)}>Batal</button></div>
    </form>}
    {confirm && <ConfirmDialog title={confirm.title} description={confirm.description} danger onConfirm={confirm.action} onClose={() => setConfirm(null)} />}
  </div>;
}

function TaskEditor({ projectId, stage, task, index, count, onEdit, onMove, onRemove }: { projectId: string; stage: Stage; task: Task; index: number; count: number; onEdit: (changes: Partial<Task>, reason: string) => void; onMove: (direction: -1 | 1) => void; onRemove: () => void }) {
  const { setTaskStatus } = useWorkspace();
  const [editing, setEditing] = useState(false); const [title, setTitle] = useState(task.title); const [conditional, setConditional] = useState(task.conditional); const [dueAt,setDueAt]=useState(task.dueAt||'');
  const [status, setStatus] = useState<TaskStatus>(task.status); const [reason, setReason] = useState(task.note || ''); const [error, setError] = useState(''); const [saving, setSaving] = useState(false);
  useEffect(()=>{setStatus(task.status);setReason(task.note||'');setError('');},[task.status,task.note]);
  useEffect(()=>{setTitle(task.title);setConditional(task.conditional);setDueAt(task.dueAt||'');},[task.title,task.conditional,task.dueAt]);
  async function saveStatus() {
    setSaving(true);setError('');
    try { await setTaskStatus(projectId, task.id, status, reason); }
    catch (cause) { setError(cause instanceof Error ? cause.message : 'Status belum tersimpan.'); }
    finally { setSaving(false); }
  }
  return <div className="ws-task-editor"><div className="ws-task-editor-main"><span className={`ws-task-mark ${task.status}`}>{task.status === 'completed' ? '✓' : '○'}</span><div><strong>{task.title}</strong><small>{taskLabels[task.status]}{task.conditional ? ' · Kondisional' : ''}{task.note ? ` · ${task.note}` : ''}</small></div></div>
    <div className="ws-task-editor-controls"><select aria-label={`Status ${task.title}`} value={status} disabled={saving} onChange={event => setStatus(event.target.value as TaskStatus)}>{Object.entries(taskLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select><button className="ws-button ws-button-secondary" disabled={saving || (status === task.status && reason === (task.note || ''))} onClick={saveStatus}>{saving?'Menyimpan…':'Simpan status'}</button><button className="ws-button ws-button-quiet" onClick={() => setEditing(!editing)}>{editing ? 'Tutup' : 'Edit'}</button></div>
    {(status === 'blocked' || status === 'skipped' || reason) && <label className="ws-task-reason">Alasan operasional<input value={reason} onChange={event => setReason(event.target.value)} placeholder="Jangan tulis data identitas atau isi berkas" /></label>}
    {error && <p className="ws-error" role="alert">{error}</p>}
    {editing && <div className="ws-task-edit-panel"><label>Nama tugas<input value={title} onChange={event => setTitle(event.target.value)} /></label><label>Jadwal tugas<input type="date" value={dueAt} onChange={event=>setDueAt(event.target.value)} /></label><label className="ws-check"><input type="checkbox" checked={conditional} onChange={event => setConditional(event.target.checked)} />Tugas kondisional</label><div className="ws-inline-actions"><button className="ws-button ws-button-secondary" disabled={!title.trim()} onClick={() => { onEdit({ title: title.trim(), conditional, dueAt }, `mengedit tugas ${task.title} pada ${stage.title}`); setEditing(false); }}>Simpan tugas</button><button className="ws-button ws-button-quiet" disabled={index === 0} onClick={() => onMove(-1)}>↑ Naik</button><button className="ws-button ws-button-quiet" disabled={index === count - 1} onClick={() => onMove(1)}>↓ Turun</button><button className="ws-button ws-button-quiet" onClick={onRemove}>Hapus</button></div></div>}
  </div>;
}

function AddTask({ stage, onAdd }: { stage: Stage; onAdd: (title: string, conditional: boolean) => void }) {
  const [open, setOpen] = useState(false); const [title, setTitle] = useState(''); const [conditional, setConditional] = useState(false);
  if (!open) return <button className="ws-subtle-button" onClick={() => setOpen(true)}>+ Tambah tugas</button>;
  return <form className="ws-add-task" onSubmit={event => { event.preventDefault(); if (!title.trim()) return; onAdd(title.trim(), conditional); setTitle(''); setConditional(false); setOpen(false); }}>
    <label>Tugas baru di {stage.title}<input autoFocus value={title} onChange={event => setTitle(event.target.value)} required /></label><label className="ws-check"><input type="checkbox" checked={conditional} onChange={event => setConditional(event.target.checked)} />Hanya jika diperlukan</label>
    <div className="ws-inline-actions"><button className="ws-button ws-button-primary">Tambah</button><button type="button" className="ws-button ws-button-quiet" onClick={() => setOpen(false)}>Batal</button></div>
  </form>;
}
