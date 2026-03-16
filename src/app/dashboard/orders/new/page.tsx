'use client';

import { useState, useTransition, Suspense } from 'react';
import { createBrowserClient } from '@/lib/supabase/client';
import type { Service } from '@/types/database';
import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

function NewOrderForm() {
    const [services, setServices] = useState<Service[]>([]);
    const [selectedService, setSelectedService] = useState<string | null>(null);
    const [companyName, setCompanyName] = useState('');
    const [notes, setNotes] = useState('');
    const [contactPhone, setContactPhone] = useState('');
    const [contactEmail, setContactEmail] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [isPending, startTransition] = useTransition();
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const searchParams = useSearchParams();

    useEffect(() => {
        async function fetchServices() {
            const supabase = createBrowserClient();
            const { data } = await supabase
                .from('services')
                .select('*')
                .eq('is_active', true)
                .order('category', { ascending: true });

            const serviceList = data || [];
            setServices(serviceList);

            // Auto-select if service slug is in URL
            const serviceSlug = searchParams.get('service');
            if (serviceSlug && serviceList.length > 0) {
                const match = serviceList.find(s => s.slug === serviceSlug);
                if (match) {
                    setSelectedService(match.id);
                }
            }

            setLoading(false);
        }
        fetchServices();
    }, [searchParams]);

    function formatPrice(price: number) {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(price);
    }

    async function handleSubmit() {
        setError(null);

        if (!selectedService) {
            setError('Silakan pilih layanan terlebih dahulu.');
            return;
        }

        startTransition(async () => {
            const supabase = createBrowserClient();
            const { data: { user } } = await supabase.auth.getUser();

            if (!user) {
                setError('Sesi Anda telah berakhir. Silakan login kembali.');
                return;
            }

            const { error: insertError } = await supabase
                .from('orders')
                .insert({
                    client_id: user.id,
                    service_id: selectedService,
                    company_data: {
                        company_name: companyName || undefined,
                        contact_phone: contactPhone || undefined,
                        contact_email: contactEmail || undefined,
                        notes: notes || undefined,
                    },
                    status: 'pending',
                });

            if (insertError) {
                setError('Gagal membuat pesanan: ' + insertError.message);
                return;
            }

            router.push('/dashboard/orders');
            router.refresh();
        });
    }

    if (loading) {
        return (
            <>
                <div className="panel-header">
                    <h1 className="panel-page-title">Buat Pesanan Baru</h1>
                    <p className="panel-page-subtitle">Memuat layanan...</p>
                </div>
                <div className="empty-state">
                    <span className="auth-spinner" style={{ width: 32, height: 32 }} />
                </div>
            </>
        );
    }

    return (
        <>
            <a href="/dashboard/orders" className="back-link">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="15 18 9 12 15 6" />
                </svg>
                Kembali ke Pesanan
            </a>

            <div className="panel-header">
                <h1 className="panel-page-title">Buat Pesanan Baru</h1>
                <p className="panel-page-subtitle">Pilih layanan yang Anda butuhkan</p>
            </div>

            {error && (
                <div className="auth-error">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10" />
                        <line x1="15" y1="9" x2="9" y2="15" />
                        <line x1="9" y1="9" x2="15" y2="15" />
                    </svg>
                    {error}
                </div>
            )}

            {/* Service Selection */}
            <div className="detail-section" style={{ marginBottom: '1.5rem' }}>
                <div className="detail-section-title">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10" />
                        <line x1="12" y1="8" x2="12" y2="16" />
                        <line x1="8" y1="12" x2="16" y2="12" />
                    </svg>
                    Pilih Layanan
                </div>

                <div className="service-select-grid">
                    {services.map((service) => (
                        <div
                            key={service.id}
                            className={`service-select-card ${selectedService === service.id ? 'selected' : ''}`}
                            onClick={() => setSelectedService(service.id)}
                        >
                            <div className="service-select-name">{service.name}</div>
                            {service.description && (
                                <div className="service-select-desc">{service.description}</div>
                            )}
                            <div className="service-select-footer">
                                <span className="service-select-price">{formatPrice(service.price)}</span>
                                <span className="service-select-days">~{service.estimated_days} hari</span>
                            </div>
                        </div>
                    ))}
                </div>

                {services.length === 0 && (
                    <div className="empty-state">
                        <p>Belum ada layanan tersedia.</p>
                    </div>
                )}
            </div>

            {/* Additional Info */}
            <div className="detail-section" style={{ marginBottom: '1.5rem' }}>
                <div className="detail-section-title">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                        <polyline points="14 2 14 8 20 8" />
                    </svg>
                    Informasi Tambahan
                </div>

                <div className="auth-field" style={{ marginBottom: '1rem' }}>
                    <label htmlFor="companyName" className="auth-label">Nama Perusahaan</label>
                    <input
                        id="companyName"
                        type="text"
                        className="auth-input"
                        placeholder="Nama perusahaan yang akan didirikan"
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                    />
                </div>

                <div className="auth-field" style={{ marginBottom: '1rem' }}>
                    <label htmlFor="contactPhone" className="auth-label">Nomor Telepon / WhatsApp</label>
                    <input
                        id="contactPhone"
                        type="tel"
                        className="auth-input"
                        placeholder="+62 812 xxxx xxxx"
                        value={contactPhone}
                        onChange={(e) => setContactPhone(e.target.value)}
                    />
                </div>

                <div className="auth-field" style={{ marginBottom: '1rem' }}>
                    <label htmlFor="contactEmail" className="auth-label">Email Kontak</label>
                    <input
                        id="contactEmail"
                        type="email"
                        className="auth-input"
                        placeholder="nama@perusahaan.com"
                        value={contactEmail}
                        onChange={(e) => setContactEmail(e.target.value)}
                    />
                </div>

                <div className="auth-field">
                    <label htmlFor="notes" className="auth-label">Catatan</label>
                    <textarea
                        id="notes"
                        className="admin-textarea"
                        placeholder="Catatan tambahan untuk pesanan Anda..."
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                    />
                </div>
            </div>

            <button
                className="btn-editorial-solid"
                onClick={handleSubmit}
                disabled={isPending || !selectedService}
                style={{ width: '100%', padding: '14px', fontSize: '1rem' }}
            >
                {isPending ? (
                    <>
                        <span className="auth-spinner" />
                        Memproses...
                    </>
                ) : (
                    'Kirim Pesanan'
                )}
            </button>
        </>
    );
}

export default function NewOrderPage() {
    return (
        <Suspense fallback={
            <>
                <div className="panel-header">
                    <h1 className="panel-page-title">Buat Pesanan Baru</h1>
                    <p className="panel-page-subtitle">Memuat layanan...</p>
                </div>
                <div className="empty-state">
                    <span className="auth-spinner" style={{ width: 32, height: 32 }} />
                </div>
            </>
        }>
            <NewOrderForm />
        </Suspense>
    );
}
