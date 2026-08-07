'use client';

import { useState, useRef, useEffect } from 'react';

const WA_ICON = "M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z";
const CLOSE_ICON = "M6 18L18 6M6 6l12 12";

interface Props {
    serviceTitle: string;
    servicePrice: string;
    startingFrom?: string;
}

export default function OrderModal({ serviceTitle, servicePrice, startingFrom = 'Starting from' }: Props) {
    const [showModal, setShowModal] = useState(false);
    const [name, setName] = useState('');
    const [ptName, setPtName] = useState('');
    const [nameError, setNameError] = useState(false);
    const nameInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (showModal) {
            setTimeout(() => nameInputRef.current?.focus(), 100);
        }
    }, [showModal]);

    useEffect(() => {
        if (!showModal) return;
        const handler = (e: KeyboardEvent) => {
            if (e.key === 'Escape') handleCloseModal();
        };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, [showModal]);

    const handleCloseModal = () => {
        setShowModal(false);
        setName('');
        setPtName('');
        setNameError(false);
    };

    const handleOrderSubmit = () => {
        if (!name.trim()) {
            setNameError(true);
            nameInputRef.current?.focus();
            return;
        }

        let message = `Halo VERALEX! 👋\n\nSaya ingin memesan layanan berikut:\n\n`;
        message += `📋 *Layanan:* ${serviceTitle}\n`;
        message += `💰 *Harga:* ${servicePrice}\n`;
        message += `👤 *Nama:* ${name.trim()}\n`;
        if (ptName.trim()) {
            message += `🏢 *Nama PT/Perusahaan:* ${ptName.trim()}\n`;
        }
        message += `\nMohon informasi lebih lanjut mengenai proses dan dokumen yang diperlukan. Terima kasih!`;

        const waUrl = `https://wa.me/6281219476385?text=${encodeURIComponent(message)}`;
        window.open(waUrl, '_blank', 'noopener,noreferrer');
        handleCloseModal();
    };

    return (
        <>
            <button
                onClick={() => setShowModal(true)}
                className="btn btn-primary btn-lg"
                style={{ flex: 1, minWidth: '200px', cursor: 'pointer', border: 'none' }}
            >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d={WA_ICON} />
                </svg>
                Order via WhatsApp
            </button>

            {showModal && (
                <div
                    onClick={(e) => { if (e.target === e.currentTarget) handleCloseModal(); }}
                    style={{
                        position: 'fixed', inset: 0, zIndex: 9999,
                        background: 'rgba(0,0,0,0.7)',
                        backdropFilter: 'blur(6px)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        padding: '1rem',
                        animation: 'fadeIn 0.2s ease',
                    }}
                >
                    <div style={{
                        background: 'var(--bg-card)',
                        border: 'var(--border-gold-strong)',
                        borderRadius: 'var(--radius-xl)',
                        padding: '2.5rem',
                        width: '100%',
                        maxWidth: '480px',
                        boxShadow: '0 25px 60px rgba(0,0,0,0.5)',
                        animation: 'slideUp 0.25s ease',
                        position: 'relative',
                    }}>
                        <button
                            onClick={handleCloseModal}
                            style={{
                                position: 'absolute', top: '1.25rem', right: '1.25rem',
                                background: 'transparent', border: 'none', cursor: 'pointer',
                                color: 'var(--text-muted)', padding: '4px',
                                borderRadius: '50%', transition: 'color 0.2s',
                            }}
                            aria-label="Close modal"
                        >
                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d={CLOSE_ICON} />
                            </svg>
                        </button>

                        <div style={{ marginBottom: '1.75rem' }}>
                            <div style={{
                                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                                width: '52px', height: '52px',
                                background: 'rgba(74,14,14,0.08)',
                                borderRadius: '50%', marginBottom: '1rem',
                            }}>
                                <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor" style={{ color: 'var(--color-gold)' }}>
                                    <path d={WA_ICON} />
                                </svg>
                            </div>
                            <h3 style={{
                                fontFamily: 'var(--font-heading)',
                                fontSize: '1.4rem',
                                background: 'var(--color-gold-gradient)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                backgroundClip: 'text',
                                marginBottom: '0.4rem',
                            }}>
                                Order via WhatsApp
                            </h3>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.5 }}>
                                Complete the form below. Our team will contact you immediately.
                            </p>
                        </div>

                        <div style={{
                            background: 'rgba(74,14,14,0.04)',
                            border: '1px solid rgba(74,14,14,0.12)',
                            borderRadius: 'var(--radius-md)',
                            padding: '0.85rem 1rem',
                            marginBottom: '1.5rem',
                            display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.5rem',
                        }}>
                            <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{serviceTitle}</span>
                            <span style={{ color: 'var(--color-gold)', fontWeight: 700, fontSize: '0.95rem', flexShrink: 0 }}>{startingFrom} {servicePrice}</span>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                            <div>
                                <label style={{
                                    display: 'block',
                                    color: 'var(--text-primary)',
                                    fontSize: '0.9rem',
                                    fontWeight: 600,
                                    marginBottom: '0.5rem',
                                }}>
                                    Your Name <span style={{ color: '#e74c3c' }}>*</span>
                                </label>
                                <input
                                    ref={nameInputRef}
                                    type="text"
                                    value={name}
                                    onChange={(e) => { setName(e.target.value); setNameError(false); }}
                                    onKeyDown={(e) => { if (e.key === 'Enter') handleOrderSubmit(); }}
                                    placeholder="e.g. John Smith"
                                    style={{
                                        width: '100%',
                                        padding: '0.75rem 1rem',
                                        background: 'var(--bg-glass)',
                                        border: nameError ? '1px solid #e74c3c' : 'var(--border-gold)',
                                        borderRadius: 'var(--radius-md)',
                                        color: 'var(--text-primary)',
                                        fontSize: '0.95rem',
                                        outline: 'none',
                                        transition: 'border-color 0.2s',
                                        boxSizing: 'border-box',
                                    }}
                                    autoComplete="name"
                                />
                                {nameError && (
                                    <p style={{ color: '#e74c3c', fontSize: '0.8rem', marginTop: '0.3rem' }}>
                                        Name is required.
                                    </p>
                                )}
                            </div>

                            <div>
                                <label style={{
                                    display: 'block',
                                    color: 'var(--text-primary)',
                                    fontSize: '0.9rem',
                                    fontWeight: 600,
                                    marginBottom: '0.5rem',
                                }}>
                                    Company Name{' '}
                                    <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>(optional)</span>
                                </label>
                                <input
                                    type="text"
                                    value={ptName}
                                    onChange={(e) => setPtName(e.target.value)}
                                    onKeyDown={(e) => { if (e.key === 'Enter') handleOrderSubmit(); }}
                                    placeholder="e.g. PT Maju Bersama"
                                    style={{
                                        width: '100%',
                                        padding: '0.75rem 1rem',
                                        background: 'var(--bg-glass)',
                                        border: 'var(--border-gold)',
                                        borderRadius: 'var(--radius-md)',
                                        color: 'var(--text-primary)',
                                        fontSize: '0.95rem',
                                        outline: 'none',
                                        boxSizing: 'border-box',
                                    }}
                                />
                            </div>
                        </div>

                        <button
                            onClick={handleOrderSubmit}
                            className="btn btn-primary btn-lg"
                            style={{
                                width: '100%',
                                marginTop: '1.75rem',
                                cursor: 'pointer',
                                border: 'none',
                                justifyContent: 'center',
                                gap: '0.6rem',
                            }}
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                <path d={WA_ICON} />
                            </svg>
                            Chat via WhatsApp
                        </button>

                        <p style={{ color: 'var(--text-muted)', fontSize: '0.78rem', textAlign: 'center', marginTop: '1rem' }}>
                            Message will be sent automatically to VERALEX CONSULTING WhatsApp
                        </p>
                    </div>
                </div>
            )}

            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes slideUp {
                    from { opacity: 0; transform: translateY(24px) scale(0.97); }
                    to { opacity: 1; transform: translateY(0) scale(1); }
                }
                input::placeholder { color: var(--text-muted); }
                input:focus { border-color: var(--color-gold) !important; box-shadow: 0 0 0 3px rgba(74,14,14,0.15); }
            `}</style>
        </>
    );
}
