'use client';

import Link from 'next/link';

import { useState, useTransition } from 'react';
import { createBrowserClient } from '@/lib/supabase/client';
import { updateOrderStatus, addProgressStep, updateProgressStep, uploadDocument, verifyPayment, rejectPayment } from '../../actions';
import type { Order, OrderProgress, Service, Payment } from '@/types/database';

interface OrderDetailClientProps {
    order: Order;
    service: Pick<Service, 'name' | 'price' | 'estimated_days' | 'category'> | null;
    progress: OrderProgress[];
    documents: { id: string; file_name: string; file_url: string; doc_type: string }[];
    payments: Payment[];
    clientName: string;
    clientEmail: string;
}

export default function AdminOrderDetailClient({
    order: initialOrder,
    service,
    progress: initialProgress,
    documents: initialDocuments,
    payments: initialPayments,
    clientName,
    clientEmail,
}: OrderDetailClientProps) {
    const [order, setOrder] = useState(initialOrder);
    const [progress, setProgress] = useState(initialProgress);
    const [documents, setDocuments] = useState(initialDocuments);
    const [payments, setPayments] = useState(initialPayments);
    const [status, setStatus] = useState(order.status);
    const [adminNotes, setAdminNotes] = useState(order.admin_notes || '');
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
    const [isPending, startTransition] = useTransition();

    // New progress step form
    const [newStepName, setNewStepName] = useState('');
    const [newStepNotes, setNewStepNotes] = useState('');

    // Document upload
    const [docType, setDocType] = useState('');
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    // Payment rejection
    const [rejectingPaymentId, setRejectingPaymentId] = useState<string | null>(null);
    const [rejectionReason, setRejectionReason] = useState('');

    function formatPrice(price: number) {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(price);
    }

    function getPaymentStatusLabel(status: string) {
        const labels: Record<string, string> = {
            pending: 'Menunggu',
            uploaded: 'Dikirim',
            verified: 'Diverifikasi',
            rejected: 'Ditolak',
        };
        return labels[status] || status;
    }

    // Handle status update
    function handleUpdateStatus() {
        setMessage(null);
        const formData = new FormData();
        formData.set('orderId', order.id);
        formData.set('status', status);
        formData.set('adminNotes', adminNotes);

        startTransition(async () => {
            const result = await updateOrderStatus(formData);
            if (result.error) {
                setMessage({ type: 'error', text: result.error });
            } else {
                setMessage({ type: 'success', text: 'Status berhasil diperbarui.' });
                setOrder({ ...order, status, admin_notes: adminNotes });
            }
        });
    }

    // Handle add progress
    function handleAddProgress() {
        if (!newStepName.trim()) return;
        setMessage(null);

        const nextStepNumber = progress.length > 0
            ? Math.max(...progress.map(p => p.step_number)) + 1
            : 1;

        const formData = new FormData();
        formData.set('orderId', order.id);
        formData.set('stepNumber', String(nextStepNumber));
        formData.set('stepName', newStepName);
        formData.set('status', 'pending');
        formData.set('notes', newStepNotes);

        startTransition(async () => {
            const result = await addProgressStep(formData);
            if (result.error) {
                setMessage({ type: 'error', text: result.error });
            } else {
                setMessage({ type: 'success', text: 'Langkah progress berhasil ditambahkan.' });
                setNewStepName('');
                setNewStepNotes('');
                // Refresh progress from DB
                const supabase = createBrowserClient();
                const { data } = await supabase
                    .from('order_progress')
                    .select('*')
                    .eq('order_id', order.id)
                    .order('step_number', { ascending: true });
                if (data) setProgress(data);
            }
        });
    }

    // Handle update progress step status
    function handleUpdateProgressStep(stepId: string, newStatus: string) {
        setMessage(null);
        const formData = new FormData();
        formData.set('stepId', stepId);
        formData.set('orderId', order.id);
        formData.set('status', newStatus);
        formData.set('notes', '');

        startTransition(async () => {
            const result = await updateProgressStep(formData);
            if (result.error) {
                setMessage({ type: 'error', text: result.error });
            } else {
                setProgress(prev => prev.map(p =>
                    p.id === stepId ? { ...p, status: newStatus as OrderProgress['status'] } : p
                ));
                setMessage({ type: 'success', text: 'Status langkah diperbarui.' });
            }
        });
    }

    // Handle document upload
    function handleUploadDocument() {
        if (!selectedFile || !docType) return;
        setMessage(null);

        const formData = new FormData();
        formData.set('orderId', order.id);
        formData.set('docType', docType);
        formData.set('file', selectedFile);

        startTransition(async () => {
            const result = await uploadDocument(formData);
            if (result.error) {
                setMessage({ type: 'error', text: result.error });
            } else {
                setMessage({ type: 'success', text: 'Dokumen berhasil diunggah.' });
                setSelectedFile(null);
                setDocType('');
                // Refresh documents
                const supabase = createBrowserClient();
                const { data } = await supabase
                    .from('documents')
                    .select('id, file_name, file_url, doc_type')
                    .eq('order_id', order.id)
                    .order('uploaded_at', { ascending: false });
                if (data) setDocuments(data);
            }
        });
    }

    // Handle verify payment
    function handleVerifyPayment(paymentId: string) {
        setMessage(null);
        const formData = new FormData();
        formData.set('paymentId', paymentId);
        formData.set('orderId', order.id);

        startTransition(async () => {
            const result = await verifyPayment(formData);
            if (result.error) {
                setMessage({ type: 'error', text: result.error });
            } else {
                setPayments(prev => prev.map(p =>
                    p.id === paymentId ? { ...p, status: 'verified' as Payment['status'] } : p
                ));
                setOrder({ ...order, status: 'paid' });
                setStatus('paid');
                setMessage({ type: 'success', text: 'Pembayaran berhasil diverifikasi.' });
            }
        });
    }

    // Handle reject payment
    function handleRejectPayment(paymentId: string) {
        setMessage(null);
        const formData = new FormData();
        formData.set('paymentId', paymentId);
        formData.set('orderId', order.id);
        formData.set('reason', rejectionReason);

        startTransition(async () => {
            const result = await rejectPayment(formData);
            if (result.error) {
                setMessage({ type: 'error', text: result.error });
            } else {
                setPayments(prev => prev.map(p =>
                    p.id === paymentId ? { ...p, status: 'rejected' as Payment['status'], rejection_reason: rejectionReason } : p
                ));
                setRejectingPaymentId(null);
                setRejectionReason('');
                setMessage({ type: 'success', text: 'Pembayaran ditolak.' });
            }
        });
    }

    return (
        <>
            <Link href="/admin" className="back-link">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="15 18 9 12 15 6" />
                </svg>
                Kembali ke Dashboard
            </Link>

            <div className="panel-header">
                <h1 className="panel-page-title">{service?.name || 'Detail Pesanan'}</h1>
                <p className="panel-page-subtitle">
                    Klien: {clientName} ({clientEmail}) · ID: {order.id.slice(0, 8)}...
                </p>
            </div>

            {message && (
                <div className={message.type === 'success' ? 'success-message' : 'auth-error'}>
                    {message.text}
                </div>
            )}

            <div className="order-detail">
                {/* Main Column */}
                <div className="order-detail-main">
                    {/* Update Status */}
                    <div className="detail-section">
                        <div className="detail-section-title">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                                <polyline points="22 4 12 14.01 9 11.01" />
                            </svg>
                            Update Status
                        </div>

                        <div className="admin-actions">
                            <select
                                className="admin-select"
                                value={status}
                                onChange={(e) => setStatus(e.target.value as Order['status'])}
                            >
                                <option value="pending">Pending</option>
                                <option value="paid">Paid</option>
                                <option value="in_progress">In Progress</option>
                                <option value="completed">Completed</option>
                                <option value="cancelled">Cancelled</option>
                            </select>
                            <button
                                className="admin-btn admin-btn-primary"
                                onClick={handleUpdateStatus}
                                disabled={isPending}
                            >
                                {isPending ? 'Menyimpan...' : 'Simpan Status'}
                            </button>
                        </div>

                        <div className="auth-field">
                            <label className="auth-label">Catatan Admin</label>
                            <textarea
                                className="admin-textarea"
                                placeholder="Tambah catatan untuk pesanan ini..."
                                value={adminNotes}
                                onChange={(e) => setAdminNotes(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Payment Verification */}
                    <div className="detail-section">
                        <div className="detail-section-title">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
                                <line x1="1" y1="10" x2="23" y2="10" />
                            </svg>
                            Pembayaran
                        </div>

                        {payments.length > 0 ? (
                            <div className="payment-history">
                                {payments.map((payment) => (
                                    <div key={payment.id} className={`payment-card payment-${payment.status}`}>
                                        <div className="payment-card-header">
                                            <span className="payment-amount">
                                                {formatPrice(payment.amount)}
                                            </span>
                                            <span className={`status-badge status-payment-${payment.status}`}>
                                                {getPaymentStatusLabel(payment.status)}
                                            </span>
                                        </div>
                                        <div className="payment-card-meta">
                                            <span>
                                                {new Date(payment.created_at).toLocaleDateString('id-ID', {
                                                    day: 'numeric', month: 'short', year: 'numeric',
                                                    hour: '2-digit', minute: '2-digit',
                                                })}
                                            </span>
                                            {payment.proof_url && (
                                                <a href={payment.proof_url} target="_blank" rel="noopener noreferrer" className="payment-proof-link">
                                                    Lihat Bukti
                                                </a>
                                            )}
                                        </div>

                                        {payment.rejection_reason && (
                                            <div className="payment-rejection">
                                                <strong>Alasan ditolak:</strong> {payment.rejection_reason}
                                            </div>
                                        )}

                                        {/* Admin verification actions */}
                                        {payment.status === 'uploaded' && (
                                            <div className="payment-actions">
                                                <button
                                                    className="admin-btn admin-btn-success"
                                                    onClick={() => handleVerifyPayment(payment.id)}
                                                    disabled={isPending}
                                                >
                                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: 16, height: 16 }}>
                                                        <polyline points="20 6 9 17 4 12" />
                                                    </svg>
                                                    Verifikasi
                                                </button>
                                                {rejectingPaymentId === payment.id ? (
                                                    <div className="reject-form">
                                                        <input
                                                            type="text"
                                                            className="auth-input"
                                                            placeholder="Alasan penolakan..."
                                                            value={rejectionReason}
                                                            onChange={(e) => setRejectionReason(e.target.value)}
                                                        />
                                                        <div style={{ display: 'flex', gap: '8px' }}>
                                                            <button
                                                                className="admin-btn admin-btn-danger"
                                                                onClick={() => handleRejectPayment(payment.id)}
                                                                disabled={isPending}
                                                            >
                                                                Tolak
                                                            </button>
                                                            <button
                                                                className="admin-btn admin-btn-secondary"
                                                                onClick={() => { setRejectingPaymentId(null); setRejectionReason(''); }}
                                                            >
                                                                Batal
                                                            </button>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <button
                                                        className="admin-btn admin-btn-danger"
                                                        onClick={() => setRejectingPaymentId(payment.id)}
                                                        disabled={isPending}
                                                    >
                                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: 16, height: 16 }}>
                                                            <circle cx="12" cy="12" r="10" />
                                                            <line x1="15" y1="9" x2="9" y2="15" />
                                                            <line x1="9" y1="9" x2="15" y2="15" />
                                                        </svg>
                                                        Tolak
                                                    </button>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                                Klien belum mengirim bukti pembayaran.
                            </p>
                        )}
                    </div>

                    {/* Progress Management */}
                    <div className="detail-section">
                        <div className="detail-section-title">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
                            </svg>
                            Progress
                        </div>

                        {progress.length > 0 ? (
                            <div className="timeline">
                                {progress.map((step) => (
                                    <div key={step.id} className={`timeline-item step-${step.status}`}>
                                        <div className="timeline-dot" />
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                                            <span className="timeline-step-name" style={{ marginBottom: 0 }}>
                                                {step.step_number}. {step.step_name}
                                            </span>
                                            <select
                                                className="admin-select"
                                                style={{ padding: '4px 8px', fontSize: '0.75rem' }}
                                                value={step.status}
                                                onChange={(e) => handleUpdateProgressStep(step.id, e.target.value)}
                                                disabled={isPending}
                                            >
                                                <option value="pending">Pending</option>
                                                <option value="in_progress">In Progress</option>
                                                <option value="completed">Completed</option>
                                                <option value="skipped">Skipped</option>
                                            </select>
                                        </div>
                                        {step.notes && (
                                            <div className="timeline-step-notes">{step.notes}</div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1rem' }}>
                                Belum ada langkah progress.
                            </p>
                        )}

                        {/* Add Progress Step */}
                        <div className="progress-form">
                            <input
                                type="text"
                                className="auth-input"
                                placeholder="Nama langkah (misal: Pengecekan Nama)"
                                value={newStepName}
                                onChange={(e) => setNewStepName(e.target.value)}
                            />
                            <input
                                type="text"
                                className="auth-input"
                                placeholder="Catatan (opsional)"
                                value={newStepNotes}
                                onChange={(e) => setNewStepNotes(e.target.value)}
                            />
                            <button
                                className="admin-btn admin-btn-secondary"
                                onClick={handleAddProgress}
                                disabled={isPending || !newStepName.trim()}
                            >
                                + Tambah
                            </button>
                        </div>
                    </div>

                    {/* Document Upload */}
                    <div className="detail-section">
                        <div className="detail-section-title">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                                <polyline points="14 2 14 8 20 8" />
                            </svg>
                            Dokumen
                        </div>

                        {documents.length > 0 && (
                            <div className="documents-list" style={{ marginBottom: '1.5rem' }}>
                                {documents.map((doc) => (
                                    <a
                                        key={doc.id}
                                        href={doc.file_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="document-item"
                                    >
                                        <div className="document-icon">
                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                                                <polyline points="14 2 14 8 20 8" />
                                            </svg>
                                        </div>
                                        <div className="document-info">
                                            <div className="document-name">{doc.file_name}</div>
                                            <div className="document-type">{doc.doc_type}</div>
                                        </div>
                                    </a>
                                ))}
                            </div>
                        )}

                        {/* Upload form */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            <select
                                className="admin-select"
                                value={docType}
                                onChange={(e) => setDocType(e.target.value)}
                            >
                                <option value="">Pilih tipe dokumen...</option>
                                <option value="akta">Akta</option>
                                <option value="sk">SK</option>
                                <option value="npwp">NPWP</option>
                                <option value="nib">NIB</option>
                                <option value="certificate">Sertifikat</option>
                                <option value="other">Lainnya</option>
                            </select>

                            <label className="file-upload">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                    <polyline points="17 8 12 3 7 8" />
                                    <line x1="12" y1="3" x2="12" y2="15" />
                                </svg>
                                <div className="file-upload-text">
                                    {selectedFile ? (
                                        <strong>{selectedFile.name}</strong>
                                    ) : (
                                        <>
                                            <strong>Klik untuk memilih file</strong>
                                            <br />atau drag &amp; drop
                                        </>
                                    )}
                                </div>
                                <input
                                    type="file"
                                    onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                                />
                            </label>

                            <button
                                className="admin-btn admin-btn-primary"
                                onClick={handleUploadDocument}
                                disabled={isPending || !selectedFile || !docType}
                            >
                                {isPending ? 'Mengupload...' : 'Upload Dokumen'}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="order-detail-sidebar">
                    <div className="detail-section">
                        <div className="detail-section-title">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <circle cx="12" cy="12" r="10" />
                                <line x1="12" y1="16" x2="12" y2="12" />
                                <line x1="12" y1="8" x2="12.01" y2="8" />
                            </svg>
                            Informasi Pesanan
                        </div>

                        <div className="detail-row">
                            <span className="detail-label">Status</span>
                            <span className={`status-badge status-${order.status}`}>
                                {order.status.replace('_', ' ')}
                            </span>
                        </div>
                        <div className="detail-row">
                            <span className="detail-label">Klien</span>
                            <span className="detail-value">{clientName}</span>
                        </div>
                        <div className="detail-row">
                            <span className="detail-label">Layanan</span>
                            <span className="detail-value">{service?.name}</span>
                        </div>
                        {service && (
                            <>
                                <div className="detail-row">
                                    <span className="detail-label">Harga</span>
                                    <span className="detail-value">{formatPrice(service.price)}</span>
                                </div>
                                <div className="detail-row">
                                    <span className="detail-label">Estimasi</span>
                                    <span className="detail-value">~{service.estimated_days} hari</span>
                                </div>
                            </>
                        )}
                        <div className="detail-row">
                            <span className="detail-label">Tanggal Order</span>
                            <span className="detail-value">
                                {new Date(order.created_at).toLocaleDateString('id-ID', {
                                    day: 'numeric', month: 'long', year: 'numeric'
                                })}
                            </span>
                        </div>
                    </div>

                    {/* Company Data */}
                    {order.company_data && Object.keys(order.company_data).length > 0 && (
                        <div className="detail-section">
                            <div className="detail-section-title">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                                </svg>
                                Data Perusahaan
                            </div>
                            {Object.entries(order.company_data).map(([key, value]) => (
                                value ? (
                                    <div key={key} className="detail-row">
                                        <span className="detail-label">{key.replace('_', ' ')}</span>
                                        <span className="detail-value">{String(value)}</span>
                                    </div>
                                ) : null
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
