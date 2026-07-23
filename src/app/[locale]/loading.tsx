export default function Loading() {
  return (
    <main id="konten-utama" className="page-content" aria-busy="true" aria-live="polite">
      <div className="shell">
        <div className="empty-state">
          <div>
            <p className="eyebrow">Memuat · Loading</p>
            <h2>Menyiapkan koleksi… · Preparing the collection…</h2>
          </div>
        </div>
      </div>
    </main>
  );
}
