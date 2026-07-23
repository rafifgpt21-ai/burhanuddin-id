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
        <Link href={`${base}/tulisan#editor`}>
          <span>Tulisan</span><strong>0</strong><small>Buat draft baru</small>
        </Link>
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

      <section className="admin-create-hub" aria-labelledby="create-content-title">
        <div>
          <p className="eyebrow">Mulai dari sini</p>
          <h2 id="create-content-title">Apa yang ingin diterbitkan?</h2>
          <p>Pilih jenis konten. Setiap editor hanya meminta informasi inti terlebih dahulu.</p>
        </div>
        <nav aria-label="Buat konten baru">
          <Link href={`${base}/tulisan#editor`}><span>01</span><strong>Tulisan</strong><small>Esai, catatan, atau opini</small></Link>
          <Link href={`${base}/materi#editor`}><span>02</span><strong>Materi</strong><small>Berkas atau tautan kelas</small></Link>
          <Link href={`${base}/agenda#editor`}><span>03</span><strong>Agenda</strong><small>Acara dan forum publik</small></Link>
          <Link href={`${base}/publikasi#editor`}><span>04</span><strong>Publikasi</strong><small>Rekam bibliografis</small></Link>
        </nav>
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
