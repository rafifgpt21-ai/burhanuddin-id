import { notFound } from "next/navigation";

import {
  AgendaEditorForm,
  MaterialEditorForm,
  PostEditorForm,
  PublicationEditorForm,
} from "@/components/admin/editor-forms";
import { RecordEditor } from "@/components/admin/record-editor";
import { restoreRevisionAction } from "@/app/[locale]/admin/(workspace)/editor-actions";
import type { EditorialKind } from "@/lib/content/admin-records";
import { getDatabaseReadiness } from "@/lib/content/database-readiness";
import { getEditorRecord } from "@/lib/content/editor-record";
import type { Locale } from "@/lib/i18n";

const labels = {
  post: ["Tulisan", "Tulis konten"],
  agenda: ["Agenda", "Tambah agenda"],
  material: ["Materi kuliah", "Tambah materi"],
  publication: ["Publikasi", "Tambah publikasi"],
} as const;

type RecordKind = Exclude<EditorialKind, "homepage">;

export function NewEditorialPage({
  kind,
  locale,
}: {
  kind: RecordKind;
  locale: Locale;
}) {
  const ready = getDatabaseReadiness();
  const returnPath = `/${locale}/admin/${
    { post: "tulisan", agenda: "agenda", material: "materi", publication: "publikasi" }[kind]
  }`;
  return (
    <>
      <header className="admin-page-heading">
        <div><p className="eyebrow">Draft baru</p><h1>{labels[kind][1]}</h1><p>Isi informasi inti terlebih dahulu. Detail tambahan dapat dilengkapi saat mengedit draft.</p></div>
      </header>
      <section className="admin-editor-panel admin-editor-panel-single">
        {kind === "post" ? <PostEditorForm ready={ready} returnPath={returnPath} /> : null}
        {kind === "agenda" ? <AgendaEditorForm ready={ready} returnPath={returnPath} /> : null}
        {kind === "material" ? <MaterialEditorForm ready={ready} returnPath={returnPath} /> : null}
        {kind === "publication" ? <PublicationEditorForm ready={ready} returnPath={returnPath} /> : null}
      </section>
    </>
  );
}

export async function ExistingEditorialPage({
  kind,
  locale,
  id,
}: {
  kind: RecordKind;
  locale: Locale;
  id: string;
}) {
  const record = await getEditorRecord(kind, id);
  if (!record) notFound();
  const { prisma } = await import("@/lib/prisma");
  const revisions = await prisma.contentRevision.findMany({
    where: {
      kind: (
        { post: "POST", agenda: "AGENDA", material: "MATERIAL", publication: "PUBLICATION" } as const
      )[kind],
      recordId: id,
    },
    orderBy: { version: "desc" },
    take: 10,
  });
  return (
    <>
      <header className="admin-page-heading">
        <div><p className="eyebrow">Edit {labels[kind][0]}</p><h1>{String("titleId" in record ? record.titleId : record.title)}</h1><p>Simpan perubahan sebagai draft kerja; versi publik tidak berubah sampai diterbitkan kembali.</p></div>
      </header>
      <RecordEditor kind={kind} locale={locale} record={record} />
      {revisions.length ? (
        <section className="revision-panel">
          <div><p className="eyebrow">Riwayat terbit</p><h2>Versi sebelumnya</h2><p>Pemulihan menyalin snapshot menjadi draft kerja; versi publik tetap tidak berubah.</p></div>
          <div>
            {revisions.map((revision) => (
              <form action={restoreRevisionAction} key={revision.id}>
                <input name="kind" type="hidden" value={kind} /><input name="id" type="hidden" value={id} />
                <input name="locale" type="hidden" value={locale} /><input name="version" type="hidden" value={revision.version} />
                <span>Versi {revision.version}</span><time>{new Intl.DateTimeFormat(locale === "id" ? "id-ID" : "en-GB", { dateStyle: "medium", timeStyle: "short" }).format(revision.createdAt)}</time>
                <button type="submit">Pulihkan sebagai draft</button>
              </form>
            ))}
          </div>
        </section>
      ) : null}
    </>
  );
}
