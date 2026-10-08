'use client';

import Link from 'next/link';

import { useState, useTransition, useEffect } from 'react';
import { createBrowserClient } from '@/lib/supabase/client';
import { uploadPaymentProof, cancelOrder } from '../../actions';
import type { Order, OrderProgress, Service, Payment, Document } from '@/types/database';

interface OrderDetailClientProps {
    order: Order;
    service: Pick<Service, 'name' | 'price' | 'estimated_days' | 'category'> | null;
    progress: OrderProgress[];
    documents: Document[];
    payments: Payment[];
}

export default function OrderDetailClient({
    order,
    service,
    progress,
    documents: initialDocuments,
    payments: initialPayments,
}: OrderDetailClientProps) {
    const [documents] = useState(initialDocuments);
    const [payments, setPayments] = useState(initialPayments);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
    const [isPending, startTransition] = useTransition();
    const [showCancelConfirm, setShowCancelConfirm] = useState(false);
    const [currentOrder, setCurrentOrder] = useState(order);
    const [bankSettings, setBankSettings] = useState({
        payment_bank_name: 'BCA',
        payment_account_number: '123 4567 890',
        payment_account_holder: 'Veralex Consulting',
        payment_contact_whatsapp: '',
    });

    useEffect(() => {
        async function fetchBankSettings() {
            const supabase = createBrowserClient();
            const { data } = await supabase
                .from('site_settings')
                .select('key, value')
                .in('key', ['payment_bank_name', 'payment_account_number', 'payment_account_holder', 'payment_contact_whatsapp']);
            if (data && data.length > 0) {
                const map: Record<string, string> = {};
                data.forEach((row: { key: string; value: string }) => { map[row.key] = row.value; });
                setBankSettings(prev => ({ ...prev, ...map }));
            }
        }
        fetchBankSettings();
    }, []);

    function formatPrice(price: number) {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(price);
    }

    function getStatusLabel(status: string) {
        const labels: Record<string, string> = {
            pending: 'Menunggu',
            paid: 'Dibayar',
            in_progress: 'Diproses',
            completed: 'Selesai',
            cancelled: 'Dibatalkan',
        };
        return labels[status] || status;
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

    function getStepStatusLabel(status: string) {
        const labels: Record<string, string> = {
            pending: 'Menunggu',
            in_progress: 'Diproses',
            completed: 'Selesai',
            skipped: 'Dilewati',
        };
        return labels[status] || status;
    }

    function handleUploadPayment() {
        if (!selectedFile) return;
        setMessage(null);

        const formData = new FormData();
        formData.set('orderId', order.id);
        formData.set('file', selectedFile);

        startTransition(async () => {
            const result = await uploadPaymentProof(formData);
            if (result.error) {
                setMessage({ type: 'error', text: result.error });
            } else {
                setMessage({ type: 'success', text: 'Bukti pembayaran berhasil diunggah.' });
                setSelectedFile(null);
                // Refresh payments from DB
                const supabase = createBrowserClient();
                const { data } = await supabase
                    .from('payments')
                    .select('*')
                    .eq('order_id', order.id)
                    .order('created_at', { ascending: false });
                if (data) setPayments(data);
            }
        });
    }

    function handleCancelOrder() {
        setMessage(null);
        const formData = new FormData();
        formData.set('orderId', currentOrder.id);

        startTransition(async () => {
            const result = await cancelOrder(formData);
            if (result.error) {
                setMessage({ type: 'error', text: result.error });
            } else {
                setMessage({ type: 'success', text: 'Pesanan berhasil dibatalkan.' });
                setCurrentOrder({ ...currentOrder, status: 'cancelled' });
            }
            setShowCancelConfirm(false);
        });
    }

    const hasVerifiedPayment = payments.some(p => p.status === 'verified');
    const hasUploadedPayment = payments.some(p => p.status === 'uploaded');
    const completedSteps = progress.filter(s => s.status === 'completed').length;
    const totalSteps = progress.length;

    return (
        <>
            <Link href="/dashboard/orders" className="back-link">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="15 18 9 12 15 6" />
                </svg>
                Kembali ke Pesanan
            </Link>

            <div className="panel-header">
                <h1 className="panel-page-title">{service?.name || 'Detail Pesanan'}</h1>
                <p className="panel-page-subtitle">ID: {order.id.slice(0, 8)}...</p>
            </div>

            {message && (
                <div className={message.type === 'success' ? 'success-message' : 'auth-error'}>
                    {message.text}
                </div>
            )}

            <div className="order-detail">
                {/* Main Content */}
                <div className="order-detail-main">
                    {/* Progress Timeline */}
                    <div className="detail-section">
                        <div className="detail-section-title">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <circle cx="12" cy="12" r="10" />
                                <polyline points="12 6 12 12 16 14" />
                            </svg>
                            Progress Pesanan
                            {totalSteps > 0 && (
                                <span className="progress-counter">
                                    {completedSteps}/{totalSteps}
                                </span>
                            )}
                        </div>

                        {/* Progress bar */}
                        {totalSteps > 0 && (
                            <div className="progress-bar-container">
                                <div
                                    className="progress-bar-fill"
                                    style={{ width: `${(completedSteps / totalSteps) * 100}%` }}
                                />
                            </div>
                        )}

                        {progress && progress.length > 0 ? (
                            <div className="timeline">
                                {progress.map((step) => (
                                    <div key={step.id} className={`timeline-item step-${step.status}`}>
                                        <div className="timeline-dot" />
                                        <div className="timeline-content">
                                            <div className="timeline-step-name">
                                                Langkah {step.step_number}: {step.step_name}
                                            </div>
                                            {step.notes && (
                                                <div className="timeline-step-notes">{step.notes}</div>
                                            )}
                                            <div className="timeline-step-status">
                                                <span className={`step-status-badge step-${step.status}`}>
                                                    {getStepStatusLabel(step.status)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="empty-state-inline">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
                                </svg>
                                <p>Progress belum tersedia. Tim kami akan segera memproses pesanan Anda.</p>
                            </div>
                        )}
                    </div>

                    {/* Payment Section */}
                    <div className="detail-section">
                        <div className="detail-section-title">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
                                <line x1="1" y1="10" x2="23" y2="10" />
                            </svg>
                            Pembayaran
                        </div>

                        {/* Payment History */}
                        {payments.length > 0 && (
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
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Payment Instructions & Upload */}
                        {!hasVerifiedPayment && (
                            <div className="payment-upload-wrapper">
                                <div className="payment-instructions-card">
                                    <div className="payment-instructions-header">
                                        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
                                            <rect x="2" y="5" width="20" height="14" rx="2" ry="2" />
                                            <line x1="2" y1="10" x2="22" y2="10" />
                                        </svg>
                                        <h3>Instruksi Pembayaran</h3>
                                    </div>
                                    <p className="payment-instructions-desc">Silakan transfer sesuai tagihan di atas ke rekening berikut:</p>
                                    <div className="payment-bank-details">
                                        <div className="bank-logo">{bankSettings.payment_bank_name}</div>
                                        <div className="bank-info">
                                            <span className="bank-account">{bankSettings.payment_account_number}</span>
                                            <span className="bank-name">A.N. {bankSettings.payment_account_holder}</span>
                                        </div>
                                    </div>
                                    <p className="payment-instructions-footer">Proses verifikasi memakan waktu 1x24 jam kerja setelah bukti diunggah.</p>
                                </div>

                                <div className="payment-upload-section">
                                    {hasUploadedPayment && (
                                        <p className="payment-info-text">
                                            Bukti pembayaran Anda sedang diverifikasi. Anda dapat mengunggah ulang jika terdapat kesalahan.
                                        </p>
                                    )}
                                    <label className="file-upload-premium">
                                        <div className="file-upload-icon-wrapper">
                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                                <polyline points="17 8 12 3 7 8" />
                                                <line x1="12" y1="3" x2="12" y2="15" />
                                            </svg>
                                        </div>
                                        <div className="file-upload-text">
                                            {selectedFile ? (
                                                <span className="file-selected-name">{selectedFile.name}</span>
                                            ) : (
                                                <>
                                                    <span className="upload-cta">Pilih File Bukti Pembayaran</span>
                                                    <span className="upload-hint">JPG, PNG, atau PDF (Maks. 5MB)</span>
                                                </>
                                            )}
                                        </div>
                                        <input
                                            type="file"
                                            accept="image/*,.pdf"
                                            onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                                            style={{ display: 'none' }}
                                        />
                                    </label>

                                    <button
                                        className="btn-editorial-solid payment-submit-btn"
                                        onClick={handleUploadPayment}
                                        disabled={isPending || !selectedFile}
                                    >
                                        {isPending ? (
                                            <>
                                                <span className="auth-spinner" style={{ width: '16px', height: '16px', borderWidth: '2px' }} />
                                                Mengunggah...
                                            </>
                                        ) : (
                                            'Kirim Bukti Pembayaran'
                                        )}
                                    </button>
                                </div>
                            </div>
                        )}

                        {hasVerifiedPayment && (
                            <div className="payment-verified-banner">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                                    <polyline points="22 4 12 14.01 9 11.01" />
                                </svg>
                                Pembayaran telah diverifikasi
                            </div>
                        )}
                    </div>

                    {/* Documents */}
                    <div className="detail-section">
                        <div className="detail-section-title">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                                <polyline points="14 2 14 8 20 8" />
                            </svg>
                            Dokumen
                        </div>

                        {documents && documents.length > 0 ? (
                            <div className="documents-list">
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
                                        <div className="document-download">
                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                                <polyline points="7 10 12 15 17 10" />
                                                <line x1="12" y1="15" x2="12" y2="3" />
                                            </svg>
                                        </div>
                                    </a>
                                ))}
                            </div>
                        ) : (
                            <div className="empty-state-inline">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" />
                                </svg>
                                <p>Belum ada dokumen. Dokumen akan tersedia setelah pesanan diproses.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Sidebar */}
                <div className="order-detail-sidebar">
                    {/* Order Info */}
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
                            <span className={`status-badge status-${currentOrder.status}`}>
                                {getStatusLabel(currentOrder.status)}
                            </span>
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

                    {/* Admin Notes */}
                    {currentOrder.admin_notes && (
                        <div className="detail-section">
                            <div className="detail-section-title">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                                </svg>
                                Catatan Admin
                            </div>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6 }}>
                                {currentOrder.admin_notes}
                            </p>
                        </div>
                    )}

                    {/* Cancel Order */}
                    {currentOrder.status === 'pending' && (
                        <div className="detail-section">
                            {!showCancelConfirm ? (
                                <button
                                    className="btn-cancel-order"
                                    onClick={() => setShowCancelConfirm(true)}
                                    disabled={isPending}
                                >
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: 18, height: 18 }}>
                                        <circle cx="12" cy="12" r="10" />
                                        <line x1="15" y1="9" x2="9" y2="15" />
                                        <line x1="9" y1="9" x2="15" y2="15" />
                                    </svg>
                                    Batalkan Pesanan
                                </button>
                            ) : (
                                <div className="cancel-confirm-box">
                                    <p>Apakah Anda yakin ingin membatalkan pesanan ini? Tindakan ini tidak dapat dibatalkan.</p>
                                    <div style={{ display: 'flex', gap: '8px' }}>
                                        <button
                                            className="btn-cancel-order-confirm"
                                            onClick={handleCancelOrder}
                                            disabled={isPending}
                                        >
                                            {isPending ? 'Membatalkan...' : 'Ya, Batalkan'}
                                        </button>
                                        <button
                                            className="btn-cancel-order-back"
                                            onClick={() => setShowCancelConfirm(false)}
                                            disabled={isPending}
                                        >
                                            Kembali
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
