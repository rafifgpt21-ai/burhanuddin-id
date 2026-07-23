export default function Loading() {
  return (
    <main id="konten-utama" className="page-content" aria-busy="true" aria-live="polite">
      <div className="shell">
        <div className="empty-state">
          <div>
            <p className="eyebrow">Arsip · Archive</p>
            <h2>Memuat koleksi… · Loading the collection…</h2>
          </div>
        </div>
      </div>
    </main>
  );
}
