'use client';

import Link from 'next/link';

import { useState, useTransition, useEffect } from 'react';
import { createBrowserClient } from '@/lib/supabase/client';

interface BankSetting {
    key: string;
    value: string;
}

const SETTING_KEYS = [
    { key: 'payment_bank_name', label: 'Nama Bank', placeholder: 'BCA' },
    { key: 'payment_account_number', label: 'Nomor Rekening', placeholder: '123 4567 890' },
    { key: 'payment_account_holder', label: 'Atas Nama', placeholder: 'Veralex Consulting' },
    { key: 'payment_contact_whatsapp', label: 'Nomor WhatsApp Kontak', placeholder: '6281234567890' },
];

export default function AdminSettingsPage() {
    const [settings, setSettings] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(true);
    const [isPending, startTransition] = useTransition();
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    useEffect(() => {
        async function fetchSettings() {
            const supabase = createBrowserClient();
            const { data } = await supabase
                .from('site_settings')
                .select('key, value')
                .in('key', SETTING_KEYS.map(s => s.key));

            const map: Record<string, string> = {};
            (data || []).forEach((row: BankSetting) => {
                map[row.key] = row.value;
            });
            setSettings(map);
            setLoading(false);
        }
        fetchSettings();
    }, []);

    function handleSave() {
        setMessage(null);

        startTransition(async () => {
            const supabase = createBrowserClient();
            let hasError = false;

            for (const sk of SETTING_KEYS) {
                const val = settings[sk.key] || '';
                const { error } = await supabase
                    .from('site_settings')
                    .upsert({ key: sk.key, value: val }, { onConflict: 'key' });

                if (error) {
                    setMessage({ type: 'error', text: 'Gagal menyimpan: ' + error.message });
                    hasError = true;
                    break;
                }
            }

            if (!hasError) {
                setMessage({ type: 'success', text: 'Pengaturan berhasil disimpan.' });
            }
        });
    }

    if (loading) {
        return (
            <>
                <div className="panel-header">
                    <h1 className="panel-page-title">Pengaturan</h1>
                    <p className="panel-page-subtitle">Memuat pengaturan...</p>
                </div>
                <div className="empty-state">
                    <span className="auth-spinner" style={{ width: 32, height: 32 }} />
                </div>
            </>
        );
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
                <h1 className="panel-page-title">Pengaturan Pembayaran</h1>
                <p className="panel-page-subtitle">Kelola informasi rekening bank untuk pembayaran klien</p>
            </div>

            {message && (
                <div className={message.type === 'success' ? 'success-message' : 'auth-error'}>
                    {message.text}
                </div>
            )}

            <div className="detail-section">
                <div className="detail-section-title">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
                        <line x1="1" y1="10" x2="23" y2="10" />
                    </svg>
                    Informasi Rekening Bank
                </div>

                <div className="settings-form">
                    {SETTING_KEYS.map((sk) => (
                        <div key={sk.key} className="settings-field">
                            <label className="settings-label">{sk.label}</label>
                            <input
                                type="text"
                                className="settings-input"
                                placeholder={sk.placeholder}
                                value={settings[sk.key] || ''}
                                onChange={(e) => setSettings({ ...settings, [sk.key]: e.target.value })}
                            />
                        </div>
                    ))}

                    <button
                        className="admin-btn admin-btn-primary"
                        onClick={handleSave}
                        disabled={isPending}
                        style={{ marginTop: '0.5rem', padding: '12px 24px' }}
                    >
                        {isPending ? 'Menyimpan...' : 'Simpan Pengaturan'}
                    </button>
                </div>
            </div>

            <div className="detail-section" style={{ marginTop: '1.5rem' }}>
                <div className="detail-section-title">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10" />
                        <line x1="12" y1="16" x2="12" y2="12" />
                        <line x1="12" y1="8" x2="12.01" y2="8" />
                    </svg>
                    Setup Database
                </div>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', lineHeight: 1.6 }}>
                    Jika tabel <code>site_settings</code> belum dibuat, jalankan SQL berikut di Supabase SQL Editor:
                </p>
                <pre style={{
                    background: 'rgba(0,0,0,0.3)',
                    padding: '1rem',
                    borderRadius: '8px',
                    fontSize: '0.8rem',
                    color: '#34d399',
                    overflow: 'auto',
                    marginTop: '0.75rem',
                }}>
{`CREATE TABLE IF NOT EXISTS site_settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL DEFAULT ''
);

ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to read
CREATE POLICY "Allow read" ON site_settings
  FOR SELECT USING (true);

-- Allow admins to update/insert
CREATE POLICY "Allow admin write" ON site_settings
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );

-- Seed default values
INSERT INTO site_settings (key, value) VALUES
  ('payment_bank_name', 'BCA'),
  ('payment_account_number', '123 4567 890'),
  ('payment_account_holder', 'Veralex Consulting'),
  ('payment_contact_whatsapp', '6281234567890')
ON CONFLICT (key) DO NOTHING;`}
                </pre>
            </div>
        </>
    );
}
