import Link from 'next/link';
import { PageHeader } from '@/features/workspace/ui';

/*
 * The legacy `orders` model (supabase/lama/schema.sql) is retired: the live
 * database is built from supabase/migrations, which has no `orders`,
 * `order_progress` or `payments` table. Orders are now projects, and every
 * action of the old detail page exists in /admin/proyek/[id].
 *
 * This route is kept only so the existing sidebar entry and any bookmark still
 * lands somewhere useful instead of a 404 or an empty table.
 */
export default function AdminOrdersPage() {
  return (
    <>
      <PageHeader
        eyebrow="Operasional"
        title="Pesanan"
        description="Alur pesanan lama sudah digantikan oleh proyek."
      />
      <section className="ws-surface ws-pad ws-empty">
        <h2>Gunakan halaman Proyek</h2>
        <p className="ws-muted">
          Setiap pesanan kini dikelola sebagai proyek dengan checklist tahap, riwayat aktivitas,
          penanganan prioritas, dan akses klien per proyek.
        </p>
        <div className="ws-inline-actions">
          <Link href="/admin/proyek" className="ws-button ws-button-primary">Buka daftar proyek</Link>
          <Link href="/admin" className="ws-button ws-button-secondary">Kembali ke dashboard</Link>
        </div>
      </section>
    </>
  );
}
