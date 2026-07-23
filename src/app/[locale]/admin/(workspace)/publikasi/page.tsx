import Link from "next/link";

import { PublicationEditorForm } from "@/components/admin/editor-forms";
import { getDatabaseReadiness, getReviewDataset } from "@/lib/content/review-data";
import { hasLocale } from "@/lib/i18n";

const pageSize = 25;

function sourceKey(sourceName: string) {
  if (sourceName.startsWith("CV")) return "cv";
  if (sourceName.startsWith("ResearchGate")) return "researchgate";
  if (sourceName.startsWith("Academia")) return "academia";
  return "address";
}

export default async function AdminPublications({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const [{ locale: value }, filters] = await Promise.all([params, searchParams]);
  const locale = hasLocale(value) ? value : "id";
  const path = `/${locale}/admin/publikasi`;
  const data = getReviewDataset();
  const ready = getDatabaseReadiness();
  const query = typeof filters.q === "string" ? filters.q.trim().toLowerCase() : "";
  const source = typeof filters.source === "string" ? filters.source : "all";
  const requestedPage = typeof filters.page === "string" ? Number(filters.page) : 1;
  const filtered = data.candidates.filter((candidate) => {
    const matchesQuery = !query || candidate.rawText.toLowerCase().includes(query);
    const matchesSource = source === "all" || sourceKey(candidate.sourceName) === source;
    return matchesQuery && matchesSource;
  });
  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Number.isFinite(requestedPage) ? Math.min(Math.max(1, requestedPage), pageCount) : 1;
  const visible = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const makePageLink = (page: number) => {
    const queryParams = new URLSearchParams();
    if (query) queryParams.set("q", query);
    if (source !== "all") queryParams.set("source", source);
    queryParams.set("page", String(page));
    return `${path}?${queryParams.toString()}`;
  };

  return <>
    <header className="admin-page-heading"><div><p className="eyebrow">Rekonsiliasi sumber</p><h1>Publikasi</h1><p>CV adalah sumber utama. Record ResearchGate dan Academia tetap terpisah sampai versi kanonis dan tipenya disetujui.</p></div><span className="collection-count">{data.candidates.length} kandidat</span></header>

    <section className="publication-review-summary" aria-label="Sumber kandidat publikasi">
      <div><span>CV</span><strong>{data.sourceCounts.cv}</strong></div><div><span>ResearchGate</span><strong>{data.sourceCounts.researchGate}</strong></div><div><span>Academia</span><strong>{data.sourceCounts.academia}</strong></div><div><span>Pidato</span><strong>{data.sourceCounts.professorialAddress}</strong></div>
    </section>

    <section className="admin-editor-panel" id="editor" aria-labelledby="publication-editor-title"><div className="admin-editor-intro"><p className="eyebrow">Draft baru</p><h2 id="publication-editor-title">Tambah publikasi manual</h2>{!ready ? <p className="locked-help">Form dapat dicoba, tetapi penyimpanan aktif setelah rotasi kredensial database.</p> : null}</div><PublicationEditorForm ready={ready} returnPath={path} /></section>

    <section className="review-queue" aria-labelledby="review-queue-title">
      <div className="review-queue-heading"><div><p className="eyebrow">Needs review</p><h2 id="review-queue-title">Antrean kandidat</h2></div><p>{filtered.length} hasil · halaman {currentPage} dari {pageCount}</p></div>
      <form className="admin-filter" method="get">
        <label>Cari judul atau sitasi<input defaultValue={query} name="q" placeholder="Ketik kata kunci…" /></label>
        <label>Sumber<select defaultValue={source} name="source"><option value="all">Semua sumber</option><option value="cv">CV Maret 2026</option><option value="researchgate">ResearchGate</option><option value="academia">Academia Books</option><option value="address">Pidato pengukuhan</option></select></label>
        <button className="button button-primary" type="submit">Terapkan</button>
        <Link className="button button-secondary" href={path}>Reset</Link>
      </form>

      {visible.length ? <ol className="candidate-list" start={(currentPage - 1) * pageSize + 1}>
        {visible.map((candidate) => <li key={candidate.fingerprint}>
          <div className="candidate-marker"><span>{candidate.rawPayload.year || "—"}</span><small>{candidate.rawPayload.suggestedType.replaceAll("_", " ")}</small></div>
          <div><p className="candidate-source">{candidate.sourceName}</p><h3>{candidate.rawText}</h3><p>{candidate.note}</p></div>
          <div className="candidate-actions"><span>Needs review</span>{candidate.sourceUrl ? <a href={candidate.sourceUrl} rel="noreferrer" target="_blank">Buka sumber ↗</a> : null}</div>
        </li>)}
      </ol> : <div className="admin-empty compact"><span aria-hidden="true">0</span><div><h2>Tidak ada hasil</h2><p>Ubah kata kunci atau reset filter untuk melihat kandidat lain.</p></div></div>}

      <nav className="admin-pagination" aria-label="Halaman kandidat">
        {currentPage > 1 ? <Link href={makePageLink(currentPage - 1)}>← Sebelumnya</Link> : <span />}
        {currentPage < pageCount ? <Link href={makePageLink(currentPage + 1)}>Berikutnya →</Link> : <span />}
      </nav>
    </section>
  </>;
}
