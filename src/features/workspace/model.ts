export type ProjectStatus = 'draft' | 'active' | 'waiting_client' | 'waiting_external' | 'review' | 'completed' | 'rejected' | 'cancelled' | 'archived';
export type TaskStatus = 'pending' | 'in_progress' | 'blocked' | 'completed' | 'skipped';
export type PriorityStatus = 'none' | 'requested' | 'approved' | 'payment_unavailable' | 'active' | 'rejected' | 'cancelled';
export type LinkStatus = 'active' | 'claimed' | 'expired' | 'revoked';
export type Role = 'admin' | 'client';

export interface Task { id: string; title: string; status: TaskStatus; conditional: boolean; note?: string; dueAt?: string }
export interface Stage { id: string; sourceTemplateStepId?: string; title: string; description: string; clientLabel: string; clientVisible: boolean; waitingKind: 'internal' | 'client' | 'institution'; completionCriteria: string; tasks: Task[] }
export interface Service { id: string; name: string; approval: 'starter' | 'approved'; version: number; legalReviewRequired: boolean; stages: Stage[]; draftStages?: Stage[]; draftVersion?: number }
export interface Admin { id: string; name: string; email: string; active: boolean; mustChangePassword: boolean; createdById?: string; createdAt: string }
export interface Client { id: string; name: string; email: string; phone: string; deletedAt?:string }
export interface ClientAccount { id: string; name: string; email: string }
export interface ClientAccess { id: string; projectId: string; accountId: string; grantedAt: string; revokedAt?: string }
export interface Activity { id: string; projectId?: string; actorId: string; text: string; at: string; clientVisible: boolean }
export interface ProjectAccessLink { id: string; projectId: string; token: string; status: LinkStatus; createdAt: string; expiresAt: string; claimedById?: string }
export interface Notification { id: string; role: Role; projectId?: string; eventType?: string; title: string; message: string; target: string; read: boolean; at: string }
export interface PriorityOffering { enabled: boolean; serviceIds: string[]; stageIds: string[]; title: string; description: string; commitment: string; limitations: string; terms: string; price: number }
export interface Project {
  id: string; reference: string; title: string; clientId: string; serviceId: string; status: ProjectStatus;
  creatorId: string; picId: string; updatedById: string; createdAt: string; updatedAt: string;
  startAt: string; followUpAt: string; notes: string; supportingIds: string[]; stages: Stage[];
  workflowVersion: number; priority: PriorityStatus; priorityPrice?: number;
}
export interface WorkspaceData {
  admins: Admin[]; clients: Client[]; clientAccounts: ClientAccount[]; accesses: ClientAccess[];
  services: Service[]; projects: Project[]; activities: Activity[]; accessLinks: ProjectAccessLink[];
  notifications: Notification[]; priorityOffering: PriorityOffering;
}

export const statusLabels: Record<ProjectStatus, string> = {
  draft: 'Draf', active: 'Aktif', waiting_client: 'Menunggu klien', waiting_external: 'Menunggu instansi',
  review: 'Perlu tinjauan', completed: 'Selesai', rejected: 'Tidak berhasil', cancelled: 'Dibatalkan', archived: 'Diarsipkan',
};
export const taskLabels: Record<TaskStatus, string> = { pending: 'Belum dimulai', in_progress: 'Dikerjakan', blocked: 'Tertunda', completed: 'Selesai', skipped: 'Tidak berlaku' };
export const priorityLabels: Record<PriorityStatus, string> = {
  none: 'Belum diajukan', requested: 'Menunggu tinjauan', approved: 'Disetujui', payment_unavailable: 'Pembayaran belum tersedia',
  active: 'Prioritas aktif', rejected: 'Ditolak', cancelled: 'Dibatalkan',
};
