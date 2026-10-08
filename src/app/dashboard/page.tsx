import Link from 'next/link';
import { requireUser } from '@/lib/auth';
import { createServerClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
    const user = await requireUser();
    const supabase = createServerClient();

    // Fetch user profile
    const { data: profile } = await supabase
        .from('users')
        .select('full_name')
        .eq('id', user.id)
        .single();

    // Fetch order stats
    const { data: orders } = await supabase
        .from('orders')
        .select('id, status, created_at, service_id')
        .eq('client_id', user.id)
        .order('created_at', { ascending: false });

    const allOrders = orders || [];
    const pendingCount = allOrders.filter(o => o.status === 'pending').length;
    const inProgressCount = allOrders.filter(o => o.status === 'in_progress').length;
    const completedCount = allOrders.filter(o => o.status === 'completed').length;
    const recentOrders = allOrders.slice(0, 5);

    // Fetch service names for recent orders
    const serviceIds = [...new Set(recentOrders.map(o => o.service_id))];
    const { data: services } = serviceIds.length > 0
        ? await supabase.from('services').select('id, name').in('id', serviceIds)
        : { data: [] };

    const serviceMap = new Map((services || []).map(s => [s.id, s.name]));

    return (
        <>
            <div className="panel-header">
                <h1 className="panel-page-title">
                    Selamat datang, {profile?.full_name || 'User'}
                </h1>
                <p className="panel-page-subtitle">Kelola pesanan layanan legal Anda</p>
            </div>

            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-icon">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" />
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

            {/* Recent Orders */}
            <div className="detail-section">
                <div className="detail-section-title">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
                    </svg>
                    Pesanan Terbaru
                </div>

                {recentOrders.length === 0 ? (
                    <div className="empty-state">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" />
                        </svg>
                        <h3>Belum ada pesanan</h3>
                        <p>Mulai dengan membuat pesanan layanan legal pertama Anda.</p>
                        <Link href="/dashboard/orders/new" className="admin-btn admin-btn-primary">
                            Buat Pesanan
                        </Link>
                    </div>
                ) : (
                    <div className="order-cards">
                        {recentOrders.map((order) => (
                            <a key={order.id} href={`/dashboard/orders/${order.id}`} className="order-card">
                                <div className="order-card-header">
                                    <span className="order-card-service">
                                        {serviceMap.get(order.service_id) || 'Layanan'}
                                    </span>
                                    <span className={`status-badge status-${order.status}`}>
                                        {order.status.replace('_', ' ')}
                                    </span>
                                </div>
                                <div className="order-card-meta">
                                    <span>
                                        {new Date(order.created_at).toLocaleDateString('id-ID', {
                                            day: 'numeric', month: 'short', year: 'numeric'
                                        })}
                                    </span>
                                </div>
                            </a>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
}
