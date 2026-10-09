'use client';

import Link from 'next/link';

import { useState, useTransition } from 'react';
import { cancelOrder } from '../../actions';
import type { Order, OrderProgress, Service, Payment } from '@/types/database';

interface OrderDetailClientProps {
    order: Order;
    service: Pick<Service, 'name' | 'price' | 'estimated_days' | 'category'> | null;
    progress: OrderProgress[];
    payments: Payment[];
}

export default function OrderDetailClient({
    order,
    service,
    progress,
    payments: initialPayments,
}: OrderDetailClientProps) {
    const payments = initialPayments;
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
    const [isPending, startTransition] = useTransition();
    const [showCancelConfirm, setShowCancelConfirm] = useState(false);
    const [currentOrder, setCurrentOrder] = useState(order);
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

                        {!hasVerifiedPayment && <p className="payment-info-text">Untuk informasi pembayaran pesanan lama, hubungi tim VERALEX melalui kanal resmi.</p>}

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
