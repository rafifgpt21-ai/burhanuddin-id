import Link from "next/link";

import { AgendaEditorForm } from "@/components/admin/editor-forms";
import { getAdminCollectionCounts } from "@/lib/content/admin-counts";
import { getDatabaseReadiness } from "@/lib/content/database-readiness";
import { getRoutePath, hasLocale, type Locale } from "@/lib/i18n";

const copy = {
  id: {
    eyebrow: "Kiprah · Agenda publik",
    title: "Agenda",
    intro:
      "Kelola kegiatan yang akan tampil di bagian Agenda pada halaman Kiprah. Waktu publik ditampilkan dalam WIB.",
    viewPublic: "Lihat halaman Kiprah",
    count: "record",
    draftEyebrow: "Draft baru",
    editorTitle: "Tambah agenda",
    locked:
      "Form dapat ditinjau, tetapi penyimpanan aktif setelah kredensial database selesai diamankan.",
    emptyTitle: "Belum ada agenda",
    emptyDescription:
      "Agenda baru disimpan sebagai draft privat dan hanya muncul di halaman Kiprah setelah diterbitkan.",
    existingTitle: "Agenda tersimpan",
    existingDescription:
      "Record sudah tersedia di database. Daftar edit dan perubahan status akan ditambahkan pada tahap workflow editorial berikutnya.",
  },
  en: {
    eyebrow: "Outreach · Public agenda",
    title: "Agenda",
    intro:
      "Manage activities that will appear in the Agenda section of the Outreach page. Public times are displayed in WIB.",
    viewPublic: "View Outreach page",
    count: "records",
    draftEyebrow: "New draft",
    editorTitle: "Add agenda item",
    locked:
      "The form can be reviewed, but storage is enabled only after the database credentials have been secured.",
    emptyTitle: "No agenda items yet",
    emptyDescription:
      "New agenda items are saved as private drafts and appear on Outreach only after publication.",
    existingTitle: "Stored agenda items",
    existingDescription:
      "Records are available in the database. Editing and status controls will be added in the next editorial-workflow phase.",
  },
} as const;

export default async function AdminAgenda({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: value } = await params;
  const locale: Locale = hasLocale(value) ? value : "id";
  const path = `/${locale}/admin/agenda`;
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
            {counts?.agenda ?? "—"} {pageCopy.count}
          </span>
          <Link className="text-link" href={`${getRoutePath(locale, "outreach")}#agenda`}>
            {pageCopy.viewPublic}
          </Link>
        </div>
      </header>

      <section
        className="admin-editor-panel"
        id="editor"
        aria-labelledby="agenda-editor-title"
      >
        <div className="admin-editor-intro">
          <p className="eyebrow">{pageCopy.draftEyebrow}</p>
          <h2 id="agenda-editor-title">{pageCopy.editorTitle}</h2>
          {!ready ? <p className="locked-help">{pageCopy.locked}</p> : null}
        </div>
        <AgendaEditorForm ready={ready} returnPath={path} />
      </section>

      <section className="admin-empty compact">
        <span aria-hidden="true">{counts?.agenda ?? "—"}</span>
        <div>
          <h2>{counts?.agenda ? pageCopy.existingTitle : pageCopy.emptyTitle}</h2>
          <p>
            {counts?.agenda
              ? pageCopy.existingDescription
              : pageCopy.emptyDescription}
          </p>
        </div>
      </section>
    </>
  );
}
