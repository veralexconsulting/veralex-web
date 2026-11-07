'use client';

/*
 * Last-resort boundary. This replaces the root layout when the layout itself
 * throws, so it must render <html> and <body> and cannot rely on app CSS
 * variables or next/font. Styles are inline for that reason.
 */
export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html lang="id">
      <body style={{ margin: 0, background: '#f7f6f4', color: '#24211f', fontFamily: 'system-ui, -apple-system, Segoe UI, sans-serif' }}>
        <main style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', padding: 24 }}>
          <div style={{ width: 'min(100%, 520px)', background: '#fff', border: '1px solid #e8e4e0', borderRadius: 14, padding: 'clamp(24px, 5vw, 40px)', textAlign: 'center' }}>
            <p style={{ margin: '0 0 18px', letterSpacing: '0.14em', fontSize: 11, fontWeight: 800, color: '#9b7760' }}>TERJADI GANGGUAN</p>
            <h1 style={{ margin: '0 0 12px', fontSize: 'clamp(22px, 4vw, 28px)', lineHeight: 1.25 }}>Halaman ini belum dapat ditampilkan</h1>
            <p style={{ margin: '0 0 24px', fontSize: 14, lineHeight: 1.65, color: '#686565' }}>
              Kami tidak dapat menyelesaikan permintaan Anda karena gangguan teknis. Tidak ada data yang hilang. Coba muat ulang halaman.
            </p>
            <button
              type="button"
              onClick={() => reset()}
              style={{ minHeight: 44, padding: '10px 20px', border: 0, borderRadius: 8, background: '#4a0e0e', color: '#fff', fontSize: 14, fontWeight: 700, cursor: 'pointer' }}
            >
              Muat ulang
            </button>
            {error.digest && <p style={{ margin: '18px 0 0', fontSize: 11, color: '#9a8b83' }}>Kode referensi: <code>{error.digest}</code></p>}
          </div>
        </main>
      </body>
    </html>
  );
}
