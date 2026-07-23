import Link from "next/link";

import { getDatabaseReadiness, getReviewDataset } from "@/lib/content/review-data";
import { hasLocale } from "@/lib/i18n";

export default async function AdminDashboard({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: value } = await params;
  const locale = hasLocale(value) ? value : "id";
  const data = getReviewDataset();
  const databaseReady = getDatabaseReadiness();
  const base = `/${locale}/admin`;

  return (
    <>
      <header className="admin-page-heading">
        <div>
          <p className="eyebrow">20 Juli 2026 · Ruang kerja</p>
          <h1>Ringkasan konten</h1>
          <p>Periksa sumber, lengkapi metadata, lalu terbitkan hanya setelah konten disetujui.</p>
        </div>
        <span className={`readiness-badge ${databaseReady ? "is-ready" : ""}`}>
          {databaseReady ? "Database siap" : "Database terkunci"}
        </span>
      </header>

      <section className="admin-metrics" aria-label="Ringkasan koleksi">
        <Link href={`${base}/materi`}>
          <span>Materi kuliah</span><strong>0</strong><small>Disengaja kosong</small>
        </Link>
        <Link href={`${base}/agenda`}>
          <span>Agenda</span><strong>0</strong><small>Belum ada data nyata</small>
        </Link>
        <Link href={`${base}/publikasi`}>
          <span>Kandidat publikasi</span><strong>{data.candidates.length}</strong><small>Menunggu review</small>
        </Link>
      </section>

      {!databaseReady ? (
        <section className="admin-notice" aria-labelledby="database-lock-title">
          <span aria-hidden="true">!</span>
          <div>
            <h2 id="database-lock-title">Penulisan ke database belum dibuka</h2>
            <p>Kredensial lama tidak disentuh. Setelah password dirotasi, set <code>DATABASE_READY=true</code> di secret store untuk mengaktifkan simpan dan unggah.</p>
          </div>
        </section>
      ) : null}

      <section className="seed-ledger" aria-labelledby="seed-ledger-title">
        <div className="seed-ledger-heading">
          <div>
            <p className="eyebrow">Buku sumber</p>
            <h2 id="seed-ledger-title">Antrean impor publikasi</h2>
          </div>
          <Link className="text-link" href={`${base}/publikasi`}>Buka antrean lengkap →</Link>
        </div>
        <dl>
          <div><dt>CV Maret 2026</dt><dd>{data.sourceCounts.cv}</dd></div>
          <div><dt>ResearchGate</dt><dd>{data.sourceCounts.researchGate}</dd></div>
          <div><dt>Academia Books</dt><dd>{data.sourceCounts.academia}</dd></div>
          <div><dt>Pidato pengukuhan</dt><dd>{data.sourceCounts.professorialAddress}</dd></div>
        </dl>
        <p>Semua record masih berstatus <strong>Needs review</strong>. Record platform tidak dihitung sebagai publikasi kanonis sebelum rekonsiliasi.</p>
      </section>
    </>
  );
}
