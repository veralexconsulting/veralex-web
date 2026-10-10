export default function Loading() {
  return (
    <main className="global-loading" aria-busy="true" aria-label="Memuat halaman">
      <header className="global-loading-header"><span className="global-skeleton global-skeleton-logo"/><span className="global-skeleton global-skeleton-nav"/><span className="global-skeleton global-skeleton-nav short"/></header>
      <section className="global-loading-hero"><div><span className="global-skeleton global-skeleton-kicker"/><span className="global-skeleton global-skeleton-title"/><span className="global-skeleton global-skeleton-title medium"/><span className="global-skeleton global-skeleton-copy"/><span className="global-skeleton global-skeleton-button"/></div><span className="global-skeleton global-skeleton-visual"/></section>
      <span className="global-sr-only" role="status">Loading page…</span>
    </main>
  );
}
