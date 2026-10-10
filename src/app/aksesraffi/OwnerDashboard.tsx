'use client';

import { useCallback, useEffect, useState, useTransition } from 'react';
import type { Overview } from '@/lib/owner/analytics';
import type { RangePreset } from '@/lib/owner/range';
import { ownerSignOut } from './actions';
import { BarChart, LineChart, SkeletonChart } from './OwnerChart';

const PRESETS: { id: RangePreset; label: string }[] = [
    { id: 'today', label: 'Hari ini' },
    { id: '7d', label: '7 hari' },
    { id: '30d', label: '30 hari' },
    { id: '90d', label: '90 hari' },
];

const number = new Intl.NumberFormat('id-ID');
const dayLabel = new Intl.DateTimeFormat('id-ID', { day: '2-digit', month: 'short', timeZone: 'UTC' });
const longDay = new Intl.DateTimeFormat('id-ID', { dateStyle: 'full', timeZone: 'UTC' });

const label = (day: string) => dayLabel.format(new Date(`${day}T12:00:00Z`));
const human = (day: string) => longDay.format(new Date(`${day}T12:00:00Z`));
const serviceName = (slug: string) => (slug ? slug.replace(/-/g, ' ') : 'Umum');
const placementName = (placement: string) => (placement ? placement.replace(/-/g, ' ') : 'konten');

function Card({ label, value, hint }: { label: string; value: string; hint?: string }) {
    return (
        <article className="owner-card-tile">
            <span>{label}</span>
            <strong>{value}</strong>
            {hint && <small>{hint}</small>}
        </article>
    );
}

function Panel({ title, note, children, loading }: { title: string; note?: string; children: React.ReactNode; loading: boolean }) {
    return (
        <section className="owner-panel">
            <header><h2>{title}</h2>{note && <p>{note}</p>}</header>
            {loading ? <SkeletonChart /> : children}
        </section>
    );
}

export default function OwnerDashboard({ unavailable = false }: { unavailable?: boolean }) {
    const [preset, setPreset] = useState<RangePreset>('30d');
    const [custom, setCustom] = useState<{ from: string; to: string } | null>(null);
    const [data, setData] = useState<Overview | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [attempt, setAttempt] = useState(0);
    const [refreshing, setRefreshing] = useState(false);
    const [signingOut, startSignOut] = useTransition();

    const load = useCallback(async (signal: AbortSignal) => {
        const query = new URLSearchParams({ range: preset });
        if (preset === 'custom' && custom) { query.set('from', custom.from); query.set('to', custom.to); }
        const response = await fetch(`/api/analytics/overview?${query}`, { cache: 'no-store', signal });
        if (!response.ok) {
            const body = await response.json().catch(() => ({ error: 'Data analitik belum dapat dimuat.' }));
            throw new Error(body.error || 'Data analitik belum dapat dimuat.');
        }
        setData(await response.json());
    }, [preset, custom]);

    useEffect(() => {
        const controller = new AbortController();
        if (data) setRefreshing(true); else setLoading(true);
        setError(null);
        load(controller.signal)
            .catch((cause: unknown) => { if (!controller.signal.aborted) setError(cause instanceof Error ? cause.message : 'Data analitik belum dapat dimuat.'); })
            .finally(() => { if (!controller.signal.aborted) { setLoading(false); setRefreshing(false); } });
        return () => controller.abort();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [load, attempt]);

    function choose(next: RangePreset) {
        setPreset(next);
        setCustom(null);
    }

    function applyCustom(from: string, to: string) {
        if (!from || !to) return;
        setCustom({ from: from <= to ? from : to, to: from <= to ? to : from });
        setPreset('custom');
    }

    const firstLoad = loading && !data;
    const totals = data ? [
        { label: 'Total akun terdaftar', value: number.format(data.accounts.total), hint: 'Seluruh waktu' },
        { label: 'Akun klien', value: number.format(data.accounts.clients), hint: `${number.format(data.accounts.active)} akun aktif` },
        { label: 'Akun administrator', value: number.format(data.accounts.administrators), hint: 'Termasuk akun proprietaris' },
        { label: 'Klien dengan proyek aktif', value: number.format(data.accounts.projectLinked), hint: `${number.format(data.accounts.clientRecords)} catatan klien` },
        { label: 'Pendaftaran baru', value: number.format(data.accounts.newInRange), hint: data ? human(data.range.from) + ' – ' + human(data.range.to) : undefined },
    ] : [];

    return (
        <>
            <header className="owner-header">
                <div>
                    <p className="owner-eyebrow">VERALEX / Proprietaris</p>
                    <h1>Ringkasan Aktivitas</h1>
                </div>
                <button type="button" className="owner-button owner-button-ghost" onClick={() => startSignOut(() => ownerSignOut())} disabled={signingOut}>
                    {signingOut ? 'Keluar…' : 'Keluar'}
                </button>
            </header>

            <div className="owner-controls">
                <div className="owner-presets" role="group" aria-label="Rentang tanggal">
                    {PRESETS.map(item => (
                        <button key={item.id} type="button" className={preset === item.id ? 'active' : ''} aria-pressed={preset === item.id} onClick={() => choose(item.id)} disabled={loading && !data}>
                            {item.label}
                        </button>
                    ))}
                    <button type="button" className={preset === 'custom' ? 'active' : ''} aria-pressed={preset === 'custom'} onClick={() => choose('custom')} disabled={loading && !data}>Kustom</button>
                </div>
                {preset === 'custom' && (
                    <div className="owner-custom">
                        <label htmlFor="owner-from">Dari<input id="owner-from" type="date" value={custom?.from ?? ''} onChange={event => applyCustom(event.target.value, custom?.to ?? event.target.value)} /></label>
                        <label htmlFor="owner-to">Sampai<input id="owner-to" type="date" value={custom?.to ?? ''} onChange={event => applyCustom(custom?.from ?? event.target.value, event.target.value)} /></label>
                    </div>
                )}
                <button type="button" className="owner-button owner-button-ghost" onClick={() => setAttempt(value => value + 1)} disabled={loading || refreshing} aria-busy={refreshing}>
                    {refreshing ? 'Memuat…' : 'Segarkan'}
                </button>
            </div>

            {unavailable && (
                <div className="owner-alert" role="alert">
                    <span>Verifikasi sesi sedang tertunda. Sambungan ke layanan autentikasi akan dicoba lagi.</span>
                    <button type="button" onClick={() => setAttempt(value => value + 1)}>Coba lagi</button>
                </div>
            )}

            {error && (
                <div className="owner-alert" role="alert">
                    <span>{error}</span>
                    <button type="button" onClick={() => setAttempt(value => value + 1)}>Coba lagi</button>
                </div>
            )}

            <div className="owner-tiles">
                {loading && !data
                    ? Array.from({ length: 5 }, (_, index) => <div key={index} className="owner-skeleton owner-skeleton-tile" aria-hidden="true" />)
                    : totals.map(item => <Card key={item.label} {...item} />)}
            </div>

            {firstLoad
                ? <div className="owner-grid"><div className="owner-skeleton owner-skeleton-chart" /><div className="owner-skeleton owner-skeleton-chart" /></div>
                : data && (
                    <>
                        <div className="owner-grid">
                            <Panel title="Pendaftaran akun" note="Harian, zona waktu Asia/Jakarta" loading={firstLoad}>
                                <LineChart label="Pendaftaran akun" data={data.registrations.map(day => ({ label: label(day.day), value: day.count }))} />
                            </Panel>
                            <Panel title="Aktivitas login" note="Login berhasil saja, penyegaran sesi tidak dihitung" loading={firstLoad}>
                                <LineChart label="Aktivitas login" data={data.logins.daily.map(day => ({ label: label(day.day), value: day.count }))} />
                            </Panel>
                        </div>

                        <div className="owner-tiles">
                            <Card label="Total login berhasil" value={number.format(data.logins.total)} hint={`${human(data.range.from)} – ${human(data.range.to)}`} />
                            <Card label="Pengguna unik yang login" value={number.format(data.logins.uniqueUsers)} hint="Identitas berbeda dalam periode ini" />
                            <Card label="Klik WhatsApp" value={number.format(data.whatsapp.total)} hint="Klik, bukan percakapan" />
                            <Card label="Perkiraan pengklik unik" value={number.format(data.whatsapp.uniqueClickers)} hint="Estimasi dari token sesi anonim" />
                        </div>

                        <div className="owner-grid">
                            <Panel title="Klik WhatsApp" note="Harian" loading={firstLoad}>
                                <LineChart label="Klik WhatsApp" data={data.whatsapp.daily.map(day => ({ label: label(day.day), value: day.count }))} />
                            </Panel>
                            <Panel title="Klik WhatsApp per layanan" loading={firstLoad}>
                                {data.whatsapp.byService.length
                                    ? <BarChart label="Klik WhatsApp per layanan" data={data.whatsapp.byService.map(item => ({ label: serviceName(item.service), value: item.count }))} />
                                    : <p className="owner-empty">Belum ada klik WhatsApp pada periode ini.</p>}
                            </Panel>
                        </div>

                        <div className="owner-grid">
                            <Panel title="Rincian login" loading={firstLoad}>
                                <ul className="owner-breakdown">
                                    {[['Proprietaris', data.logins.byRole.owner], ['Administrator', data.logins.byRole.admin], ['Klien', data.logins.byRole.client], ['Tidak terklasifikasi', data.logins.byRole.unknown]].map(([name, value]) => (
                                        <li key={String(name)}><span>{name}</span><strong>{number.format(Number(value))}</strong></li>
                                    ))}
                                </ul>
                                <p className="owner-footnote">Role diambil dari profil akun saat login berhasil, bukan dari kiriman peramban.</p>
                            </Panel>
                            <Panel title="Konteks kontak" loading={firstLoad}>
                                <ul className="owner-breakdown">
                                    <li><span>WhatsApp</span><strong>{number.format(data.conversion.whatsapp)}</strong></li>
                                    <li><span>Telepon</span><strong>{number.format(data.conversion.phone)}</strong></li>
                                    <li><span>Email</span><strong>{number.format(data.conversion.email)}</strong></li>
                                </ul>
                                <p className="owner-footnote">Klik WhatsApp ≠ percakapan terkonfirmasi. Percakapan yang terkonfirmasi ≠ calon klien yang layak. Calon klien yang layak ≠ penjualan selesai.</p>
                            </Panel>
                        </div>

                        <Panel title="Klik WhatsApp per halaman" loading={firstLoad}>
                            {data.whatsapp.byPage.length
                                ? <div className="owner-table-wrap"><table className="owner-table">
                                    <caption className="owner-sr-only">Klik WhatsApp per halaman</caption>
                                    <thead><tr><th scope="col">Halaman</th><th scope="col">Klik</th><th scope="col">Perkiraan unik</th></tr></thead>
                                    <tbody>{data.whatsapp.byPage.map(row => <tr key={row.page}><th scope="row">{row.page}</th><td>{number.format(row.count)}</td><td>{number.format(row.unique)}</td></tr>)}</tbody>
                                </table></div>
                                : <p className="owner-empty">Belum ada klik WhatsApp pada periode ini.</p>}
                        </Panel>

                        <Panel title="Klik WhatsApp per posisi tombol" loading={firstLoad}>
                            {data.whatsapp.byPlacement.length
                                ? <ul className="owner-breakdown">{data.whatsapp.byPlacement.map(item => <li key={item.placement}><span>{placementName(item.placement)}</span><strong>{number.format(item.count)}</strong></li>)}</ul>
                                : <p className="owner-empty">Belum ada klik WhatsApp pada periode ini.</p>}
                        </Panel>

                        <p className="owner-footnote owner-stamp">
                            Data diambil {data.generatedAt ? new Date(data.generatedAt).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short', timeZone: 'Asia/Jakarta' }) + ' WIB' : '—'}. Tanggal tersimpan dalam UTC dan dilaporkan dalam zona waktu Asia/Jakarta.
                        </p>
                    </>
                )}
        </>
    );
}
