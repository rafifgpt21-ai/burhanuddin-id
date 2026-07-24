import Link from "next/link";

import { PublicationEditorForm } from "@/components/admin/editor-forms";
import { getAdminCollectionCounts } from "@/lib/content/admin-counts";
import { getDatabaseReadiness } from "@/lib/content/database-readiness";
import { getRoutePath, hasLocale, type Locale } from "@/lib/i18n";

const copy = {
  id: {
    eyebrow: "Rekam ilmiah",
    title: "Publikasi",
    intro:
      "Kelola record yang tampil di indeks publikasi. Judul asli, urutan penulis, tahun, status bibliografis, dan tautan sumber harus tetap mengikuti sumber kanonis.",
    count: "record",
    viewPublic: "Lihat indeks publikasi",
    draftEyebrow: "Draft baru",
    editorTitle: "Tambah publikasi",
    locked:
      "Form dapat ditinjau, tetapi penyimpanan aktif setelah kredensial database selesai diamankan.",
    collectionTitle: "Publikasi tersimpan",
    collectionDescription:
      "Record kanonis dan cover buku dikelola langsung sebagai koleksi publikasi. Daftar edit dan perubahan status akan tersedia pada tahap workflow editorial berikutnya.",
  },
  en: {
    eyebrow: "Scholarly record",
    title: "Publications",
    intro:
      "Manage records shown in the publication index. Original titles, author order, year, bibliographic status, and source links must remain faithful to the canonical source.",
    count: "records",
    viewPublic: "View publication index",
    draftEyebrow: "New draft",
    editorTitle: "Add publication",
    locked:
      "The form can be reviewed, but storage is enabled only after the database credentials have been secured.",
    collectionTitle: "Stored publications",
    collectionDescription:
      "Canonical records and book covers are managed directly as the publication collection. Editing and status controls will be available in the next editorial-workflow phase.",
  },
} as const;

export default async function AdminPublications({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: value } = await params;
  const locale: Locale = hasLocale(value) ? value : "id";
  const path = `/${locale}/admin/publikasi`;
  const ready = getDatabaseReadiness();
  const counts = await getAdminCollectionCounts();
  const pageCopy = copy[locale];

  return (
    <>
      <header className="admin-page-heading">
        <div>
          <p className="eyebrow">{pageCopy.eyebrow}</p>
          <h1>{pageCopy.title}</h1>
          <p>{pageCopy.intro}</p>
        </div>
        <div className="admin-page-actions">
          <span className="collection-count">
            {counts?.publications ?? "—"} {pageCopy.count}
          </span>
          <Link className="text-link" href={getRoutePath(locale, "publications")}>
            {pageCopy.viewPublic}
          </Link>
        </div>
      </header>

      <section
        className="admin-editor-panel"
        id="editor"
        aria-labelledby="publication-editor-title"
      >
        <div className="admin-editor-intro">
          <p className="eyebrow">{pageCopy.draftEyebrow}</p>
          <h2 id="publication-editor-title">{pageCopy.editorTitle}</h2>
          {!ready ? <p className="locked-help">{pageCopy.locked}</p> : null}
        </div>
        <PublicationEditorForm ready={ready} returnPath={path} />
      </section>

      <section className="admin-empty compact">
        <span aria-hidden="true">{counts?.publications ?? "—"}</span>
        <div>
          <h2>{pageCopy.collectionTitle}</h2>
          <p>{pageCopy.collectionDescription}</p>
        </div>
      </section>
    </>
  );
}
