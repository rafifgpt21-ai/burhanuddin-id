import Link from "next/link";
import { notFound } from "next/navigation";

import {
  AgendaEditorForm,
  MaterialEditorForm,
  PostEditorForm,
  PublicationEditorForm,
} from "@/components/admin/editor-forms";
import { RecordEditor } from "@/components/admin/record-editor";
import { RevisionRestoreForm } from "@/components/admin/revision-restore-form";
import { adminText } from "@/data/admin-qol";
import { readAdminSession } from "@/lib/auth/session";
import { diffEditorialSnapshots } from "@/lib/content/editorial-diff";
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

const segments: Record<RecordKind, string> = {
  post: "tulisan",
  agenda: "agenda",
  material: "materi",
  publication: "publikasi",
};

function safeReturnTo(locale: Locale, kind: RecordKind, value?: string) {
  const base = `/${locale}/admin/${segments[kind]}`;
  return value?.startsWith(base) && !value.startsWith("//") ? value : base;
}

function draftSnapshot(kind: RecordKind, record: Record<string, unknown>) {
  const fields = {
    post: ["titleId", "titleEn", "slugId", "slugEn", "excerptId", "excerptEn", "contentId", "contentEn", "topics", "pinned", "coverImage", "canonicalExternal"],
    agenda: ["titleId", "titleEn", "slugId", "slugEn", "descriptionId", "descriptionEn", "startsAt", "endsAt", "locationLabelId", "locationLabelEn", "externalUrl"],
    material: ["titleId", "titleEn", "slugId", "slugEn", "descriptionId", "descriptionEn", "courseId", "courseEn", "topicId", "topicEn", "resourceType", "semester", "academicYear", "tagsId", "tagsEn", "assetId", "externalUrl", "downloadAllowed", "pinned"],
    publication: ["type", "title", "authors", "editors", "year", "dateLabel", "containerTitle", "publisher", "publicationPlace", "volume", "issue", "seriesNumber", "pages", "doi", "externalUrl", "status", "coverImage", "sourceName", "sourceUrl", "sourceNote"],
  }[kind];
  return Object.fromEntries(fields.map((field) => [field, record[field]]));
}

export async function NewEditorialPage({
  kind,
  locale,
  returnTo,
}: {
  kind: RecordKind;
  locale: Locale;
  returnTo?: string;
}) {
  const ready = getDatabaseReadiness();
  const session = await readAdminSession();
  const returnPath = safeReturnTo(locale, kind, returnTo);
  return (
    <>
      <header className="admin-page-heading">
        <div>
          <p className="eyebrow">{adminText(locale, "Draft baru", "New draft")}</p>
          <h1>{adminText(locale, labels[kind][1], `Create ${labels[kind][0].toLowerCase()}`)}</h1>
          <p>{adminText(locale, "Isi informasi inti terlebih dahulu. Detail tambahan dapat dilengkapi saat mengedit draft.", "Start with the essential information. Additional details can be completed in the full editor.")}</p>
        </div>
        <Link className="text-link" href={returnPath}>{adminText(locale, "Kembali ke koleksi", "Back to collection")}</Link>
      </header>
      <section className="admin-editor-panel admin-editor-panel-single">
        {kind === "post" ? <PostEditorForm locale={locale} ready={ready} returnPath={returnPath} userId={session?.id ?? ""} /> : null}
        {kind === "agenda" ? <AgendaEditorForm locale={locale} ready={ready} returnPath={returnPath} userId={session?.id ?? ""} /> : null}
        {kind === "material" ? <MaterialEditorForm locale={locale} ready={ready} returnPath={returnPath} userId={session?.id ?? ""} /> : null}
        {kind === "publication" ? <PublicationEditorForm locale={locale} ready={ready} returnPath={returnPath} userId={session?.id ?? ""} /> : null}
      </section>
    </>
  );
}

export async function ExistingEditorialPage({
  kind,
  locale,
  id,
  returnTo,
}: {
  kind: RecordKind;
  locale: Locale;
  id: string;
  returnTo?: string;
}) {
  const [record, session] = await Promise.all([
    getEditorRecord(kind, id),
    readAdminSession(),
  ]);
  if (!record || !session) notFound();
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
  const publisherIds = Array.from(new Set(revisions.map((item) => item.publishedById).filter(Boolean))) as string[];
  const publishers = publisherIds.length
    ? await prisma.adminUser.findMany({
        where: { id: { in: publisherIds } },
        select: { id: true, name: true, username: true },
      })
    : [];
  const publisherNames = new Map(publishers.map((item) => [item.id, item.name || `@${item.username}`]));
  const currentDiff = record.publishedSnapshot
    ? diffEditorialSnapshots(record.publishedSnapshot, draftSnapshot(kind, record))
    : [];
  const backHref = safeReturnTo(locale, kind, returnTo);

  return (
    <>
      <header className="admin-page-heading">
        <div>
          <p className="eyebrow">{adminText(locale, `Edit ${labels[kind][0]}`, `Edit ${labels[kind][0].toLowerCase()}`)}</p>
          <h1>{String("titleId" in record ? record.titleId : record.title)}</h1>
          <p>{adminText(locale, "Simpan perubahan sebagai draft kerja; versi publik tidak berubah sampai diterbitkan kembali.", "Save changes to the working draft; the public version remains unchanged until it is published again.")}</p>
        </div>
        <Link className="text-link" href={backHref}>{adminText(locale, "Kembali ke koleksi", "Back to collection")}</Link>
      </header>
      <RecordEditor kind={kind} locale={locale} record={record} userId={session.id} />

      {currentDiff.length ? (
        <section className="editor-diff-panel">
          <header>
            <p className="eyebrow">{adminText(locale, "Perbandingan", "Comparison")}</p>
            <h2>{adminText(locale, "Draft terhadap versi publik", "Draft versus public version")}</h2>
            <span>{currentDiff.length} {adminText(locale, "bagian berubah", "changed fields")}</span>
          </header>
          <div>
            {currentDiff.map((change) => (
              <details key={change.field}>
                <summary><strong>{change.field}</strong><span>{change.change}</span></summary>
                <dl>
                  <div><dt>{adminText(locale, "Versi publik", "Public")}</dt><dd>{change.before}</dd></div>
                  <div><dt>{adminText(locale, "Draft", "Draft")}</dt><dd>{change.after}</dd></div>
                </dl>
              </details>
            ))}
          </div>
        </section>
      ) : null}

      {revisions.length ? (
        <section className="revision-panel">
          <div>
            <p className="eyebrow">{adminText(locale, "Riwayat terbit", "Publishing history")}</p>
            <h2>{adminText(locale, "Versi sebelumnya", "Previous versions")}</h2>
            <p>{adminText(locale, "Pemulihan menyalin snapshot menjadi draft kerja; versi publik tetap tidak berubah.", "Restoring copies a snapshot into the working draft; the public version remains unchanged.")}</p>
          </div>
          <div>
            {revisions.map((revision, index) => {
              const older = revisions[index + 1]?.snapshot;
              const changes = older ? diffEditorialSnapshots(older, revision.snapshot) : [];
              return (
                <RevisionRestoreForm id={id} kind={kind} locale={locale} key={revision.id} version={revision.version}>
                  <span>{adminText(locale, "Versi", "Version")} {revision.version}</span>
                  <div>
                    <time>{new Intl.DateTimeFormat(locale === "id" ? "id-ID" : "en-GB", { dateStyle: "medium", timeStyle: "short" }).format(revision.createdAt)}</time>
                    <small>{revision.publishedById ? publisherNames.get(revision.publishedById) ?? "—" : "—"} · {changes.length} {adminText(locale, "perubahan", "changes")}</small>
                  </div>
                </RevisionRestoreForm>
              );
            })}
          </div>
        </section>
      ) : null}
    </>
  );
}
