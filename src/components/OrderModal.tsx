'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useLang } from '@/lib/useLang';

const WA_ICON = "M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z";
const CLOSE_ICON = "M6 18L18 6M6 6l12 12";

interface Props {
    serviceTitle: string;
    servicePrice: string;
    startingFrom?: string;
}

export default function OrderModal({ serviceTitle, servicePrice }: Props) {
    const { t } = useLang();
    const [showModal, setShowModal] = useState(false);
    const [name, setName] = useState('');
    const [company, setCompany] = useState('');
    const [nameError, setNameError] = useState(false);
    const nameInputRef = useRef<HTMLInputElement>(null);

    const close = useCallback(() => {
        setShowModal(false);
        setName('');
        setCompany('');
        setNameError(false);
    }, []);

    useEffect(() => {
        if (showModal) {
            const focusTimer = setTimeout(() => nameInputRef.current?.focus(), 100);
            return () => clearTimeout(focusTimer);
        }
    }, [showModal]);

    useEffect(() => {
        if (!showModal) return;
        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') close();
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [showModal, close]);

    const submit = () => {
        if (!name.trim()) {
            setNameError(true);
            nameInputRef.current?.focus();
            return;
        }

        const message = [
            t('order.msgIntro'),
            '',
            `📋 *${t('order.msgService')}:* ${serviceTitle}`,
            `💰 *${t('order.msgPrice')}:* ${servicePrice}`,
            `👤 *${t('order.msgName')}:* ${name.trim()}`,
            ...(company.trim() ? [`🏢 *${t('order.msgCompany')}:* ${company.trim()}`] : []),
            '',
            t('order.msgOutro'),
        ].join('\n');

        window.open(`https://wa.me/6281219476385?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer');
        close();
    };

    return (
        <>
            <button type="button" onClick={() => setShowModal(true)} className="btn btn-primary btn-lg order-modal-trigger">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d={WA_ICON} />
                </svg>
                {t('order.cta')}
            </button>

            {showModal && (
                <div className="order-modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) close(); }}>
                    <div className="order-modal" role="dialog" aria-modal="true" aria-label={t('order.title')}>
                        <button type="button" onClick={close} className="order-modal-close" aria-label={t('detail.close')}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d={CLOSE_ICON} />
                            </svg>
                        </button>

                        <div className="order-modal-head">
                            <span className="order-modal-icon" aria-hidden="true">
                                <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor">
                                    <path d={WA_ICON} />
                                </svg>
                            </span>
                            <h3 className="order-modal-title">{t('order.title')}</h3>
                            <p className="order-modal-sub">{t('order.subtitle')}</p>
                        </div>

                        <div className="order-modal-summary">
                            <span className="order-modal-service">{serviceTitle}</span>
                            <span className="order-modal-price">
                                <small>{t('price.startFrom')}</small> {servicePrice}
                            </span>
                        </div>

                        <div className="order-modal-fields">
                            <div className="order-modal-field">
                                <label htmlFor="order-name">
                                    {t('order.name')} <span className="req">*</span>
                                </label>
                                <input
                                    id="order-name"
                                    ref={nameInputRef}
                                    type="text"
                                    value={name}
                                    onChange={(e) => { setName(e.target.value); setNameError(false); }}
                                    onKeyDown={(e) => { if (e.key === 'Enter') submit(); }}
                                    placeholder={t('order.namePlaceholder')}
                                    autoComplete="name"
                                    aria-invalid={nameError}
                                />
                                {nameError && <p className="order-modal-error">{t('order.nameRequired')}</p>}
                            </div>

                            <div className="order-modal-field">
                                <label htmlFor="order-company">
                                    {t('order.company')} <em>({t('order.optional')})</em>
                                </label>
                                <input
                                    id="order-company"
                                    type="text"
                                    value={company}
                                    onChange={(e) => setCompany(e.target.value)}
                                    onKeyDown={(e) => { if (e.key === 'Enter') submit(); }}
                                    placeholder={t('order.companyPlaceholder')}
                                    autoComplete="organization"
                                />
                            </div>
                        </div>

                        <button type="button" onClick={submit} className="btn btn-primary btn-lg order-modal-submit">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                                <path d={WA_ICON} />
                            </svg>
                            {t('order.send')}
                        </button>

                        <p className="order-modal-note">{t('order.note')}</p>
                    </div>
                </div>
            )}
        </>
    );
}
