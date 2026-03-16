import { requireAdmin } from '@/lib/auth';
import { createServerClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

export default async function AdminDashboardPage() {
    await requireAdmin();
    const supabase = createServerClient();

    // Fetch all orders
    const { data: orders } = await supabase
        .from('orders')
        .select('id, status, created_at, updated_at, service_id, client_id')
        .order('created_at', { ascending: false });

    const allOrders = orders || [];

    // Fetch service names
    const serviceIds = [...new Set(allOrders.map(o => o.service_id))];
    const { data: services } = serviceIds.length > 0
        ? await supabase.from('services').select('id, name').in('id', serviceIds)
        : { data: [] };
    const serviceMap = new Map((services || []).map(s => [s.id, s.name]));

    // Fetch client names
    const clientIds = [...new Set(allOrders.map(o => o.client_id))];
    const { data: clients } = clientIds.length > 0
        ? await supabase.from('users').select('id, full_name, email').in('id', clientIds)
        : { data: [] };
    const clientMap = new Map((clients || []).map(c => [c.id, c]));

    // Stats
    const pendingCount = allOrders.filter(o => o.status === 'pending').length;
    const inProgressCount = allOrders.filter(o => o.status === 'in_progress').length;
    const completedCount = allOrders.filter(o => o.status === 'completed').length;

    return (
        <>
            <div className="panel-header">
                <h1 className="panel-page-title">Admin Dashboard</h1>
                <p className="panel-page-subtitle">Kelola semua pesanan layanan legal</p>
            </div>

            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-icon">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                            <polyline points="14 2 14 8 20 8" />
                        </svg>
                    </div>
                    <div className="stat-label">Total Pesanan</div>
                    <div className="stat-value">{allOrders.length}</div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
                        </svg>
                    </div>
                    <div className="stat-label">Menunggu</div>
                    <div className="stat-value">{pendingCount}</div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
                        </svg>
                    </div>
                    <div className="stat-label">Dalam Proses</div>
                    <div className="stat-value">{inProgressCount}</div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="20 6 9 17 4 12" />
                        </svg>
                    </div>
                    <div className="stat-label">Selesai</div>
                    <div className="stat-value">{completedCount}</div>
                </div>
            </div>

            {/* All Orders Table */}
            <div className="detail-section">
                <div className="detail-section-title">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                        <polyline points="14 2 14 8 20 8" />
                    </svg>
                    Semua Pesanan
                </div>

                {allOrders.length === 0 ? (
                    <div className="empty-state">
                        <h3>Belum ada pesanan</h3>
                        <p>Pesanan dari klien akan muncul di sini.</p>
                    </div>
                ) : (
                    <div className="orders-table-wrapper">
                        <table className="orders-table">
                            <thead>
                                <tr>
                                    <th>Klien</th>
                                    <th>Layanan</th>
                                    <th>Status</th>
                                    <th>Tanggal</th>
                                    <th>Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {allOrders.map((order) => {
                                    const client = clientMap.get(order.client_id);
                                    return (
                                        <tr key={order.id}>
                                            <td>
                                                <div className="order-service-name">
                                                    {client?.full_name || 'Unknown'}
                                                </div>
                                                <div className="order-date">{client?.email}</div>
                                            </td>
                                            <td className="order-service-name">
                                                {serviceMap.get(order.service_id) || 'Layanan'}
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
                                            <td>
                                                <a
                                                    href={`/admin/orders/${order.id}`}
                                                    className="admin-btn admin-btn-secondary"
                                                    style={{ padding: '6px 14px', fontSize: '0.8rem' }}
                                                >
                                                    Detail
                                                </a>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </>
    );
}
