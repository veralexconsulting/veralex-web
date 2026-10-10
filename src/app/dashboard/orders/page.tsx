import Link from 'next/link';
import { requireUser } from '@/lib/auth';
import { createServerClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

export default async function OrdersPage() {
    const user = await requireUser();
    const supabase = await createServerClient();

    // Fetch orders with service info
    const { data: orders } = await supabase
        .from('orders')
        .select('id, status, created_at, updated_at, service_id')
        .eq('client_id', user.id)
        .order('created_at', { ascending: false });

    const allOrders = orders || [];

    // Fetch service names
    const serviceIds = [...new Set(allOrders.map(o => o.service_id))];
    const { data: services } = serviceIds.length > 0
        ? await supabase.from('services').select('id, name').in('id', serviceIds)
        : { data: [] };

    const serviceMap = new Map((services || []).map(s => [s.id, s.name]));

    return (
        <>
            <div className="panel-header">
                <h1 className="panel-page-title">Pesanan Saya</h1>
                <p className="panel-page-subtitle">Daftar semua pesanan layanan legal Anda</p>
            </div>

            {allOrders.length === 0 ? (
                <div className="empty-state">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                        <polyline points="14 2 14 8 20 8" />
                    </svg>
                    <h3>Belum ada pesanan</h3>
                    <p>Anda belum memiliki pesanan. Mulai dengan memilih layanan yang Anda butuhkan.</p>
                    <Link href="/dashboard/orders/new" className="admin-btn admin-btn-primary">
                        Buat Pesanan Baru
                    </Link>
                </div>
            ) : (
                <>
                    <div className="orders-table-wrapper">
                        <table className="orders-table">
                            <thead>
                                <tr>
                                    <th>Layanan</th>
                                    <th>Status</th>
                                    <th>Tanggal</th>
                                    <th>Terakhir Diperbarui</th>
                                    <th>Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {allOrders.map((order) => (
                                    <tr key={order.id}>
                                        <td>
                                            <a href={`/dashboard/orders/${order.id}`} className="order-service-name" style={{ textDecoration: 'none' }}>
                                                {serviceMap.get(order.service_id) || 'Layanan'}
                                            </a>
                                        </td>
                                        <td>
                                            <span className={`status-badge status-${order.status}`}>
                                                {order.status.replace('_', ' ')}
                                            </span>
                                        </td>
                                        <td className="order-date">
                                            {new Date(order.created_at).toLocaleDateString('id-ID', {
                                                day: 'numeric', month: 'short', year: 'numeric'
                                            })}
                                        </td>
                                        <td className="order-date">
                                            {new Date(order.updated_at).toLocaleDateString('id-ID', {
                                                day: 'numeric', month: 'short', year: 'numeric'
                                            })}
                                        </td>
                                        <td>
                                            <a
                                                href={`/dashboard/orders/${order.id}`}
                                                className="admin-btn admin-btn-secondary"
                                                style={{ padding: '6px 14px', fontSize: '0.8rem' }}
                                            >
                                                Detail
                                            </a>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
                        <Link href="/dashboard/orders/new" className="admin-btn admin-btn-secondary">
                            + Buat Pesanan Baru
                        </Link>
                    </div>
                </>
            )}
        </>
    );
}
