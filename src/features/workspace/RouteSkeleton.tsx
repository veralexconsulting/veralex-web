export default function RouteSkeleton({ role, label }: { role: 'admin' | 'client'; label?: string }) {
  return (
    <div className={`workspace ws-${role} ws-skeleton-page`} aria-busy="true" aria-label={label || (role === 'admin' ? 'Memuat halaman' : 'Loading page')}>
      <div className="ws-mobile-top">
        <span className="ws-skeleton-block ws-skeleton-logo" />
        <span className="ws-skeleton-block ws-skeleton-control" />
      </div>
      <aside className="ws-sidebar" aria-hidden="true">
        <span className="ws-skeleton-block ws-skeleton-brand" />
        <div className="ws-skeleton-nav">
          {Array.from({ length: role === 'admin' ? 7 : 3 }, (_, index) => <span key={index} className="ws-skeleton-block" />)}
        </div>
        <span className="ws-skeleton-block ws-skeleton-account" />
      </aside>
      <div className="ws-main-wrap">
        {role === 'client' && <div className="ws-client-topbar"><span className="ws-skeleton-block ws-skeleton-control" /><span className="ws-skeleton-block ws-skeleton-control" /></div>}
        <main className="ws-main">
          <div className="ws-skeleton-heading"><span className="ws-skeleton-block ws-skeleton-eyebrow" /><span className="ws-skeleton-block ws-skeleton-title" /><span className="ws-skeleton-block ws-skeleton-copy" /></div>
          <div className="ws-skeleton-metrics">{Array.from({ length: 4 }, (_, index) => <span key={index} className="ws-skeleton-block ws-skeleton-card" />)}</div>
          <div className="ws-skeleton-content"><span className="ws-skeleton-block ws-skeleton-card ws-skeleton-large" /><span className="ws-skeleton-block ws-skeleton-card ws-skeleton-large" /></div>
        </main>
      </div>
      <span className="ws-sr-only" role="status">{label || (role === 'admin' ? 'Memuat halaman…' : 'Loading page…')}</span>
    </div>
  );
}
