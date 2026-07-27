import Link from "next/link";

import {
  bulkEditorialAction,
  duplicateEditorialAction,
} from "@/app/[locale]/admin/(workspace)/editor-actions";
import {
  BulkConfirmButton,
  BulkSelectionControl,
  EditorialTransitionButton,
} from "@/components/admin/editorial-list-controls";
import { PreviewLink } from "@/components/admin/preview-link";
import { PermanentDeleteButton } from "@/components/admin/permanent-delete-button";
import { getAdminQolCopy, adminText } from "@/data/admin-qol";
import { canPermanentlyDelete } from "@/lib/auth/access";
import { readAdminSession } from "@/lib/auth/session";
import {
  getAdminEditorOptions,
  getEditorialRecords,
  type EditorialFilters,
  type EditorialKind,
} from "@/lib/content/admin-records";
import { getDatabaseReadiness } from "@/lib/content/database-readiness";
import type { Locale } from "@/lib/i18n";

const segments: Record<EditorialKind, string> = {
  homepage: "beranda",
  post: "tulisan",
  agenda: "agenda",
  material: "materi",
  publication: "publikasi",
};

function queryFor(filters: EditorialFilters, overrides: Record<string, string | undefined> = {}) {
  const query = new URLSearchParams();
  if (filters.q) query.set("q", filters.q);
  if (filters.status) query.set("status", filters.status);
  if (filters.changed !== undefined) query.set("changed", String(filters.changed));
  if (filters.editor) query.set("editor", filters.editor);
  if (filters.sort) query.set("sort", filters.sort);
  if (filters.page && filters.page > 1) query.set("page", String(filters.page));
  for (const [key, value] of Object.entries(overrides)) {
    if (value) query.set(key, value);
    else query.delete(key);
  }
  return query.toString();
}

export async function EditorialCollection({
  locale,
  kind,
  title,
  eyebrow,
  description,
  publicHref,
  filters,
}: {
  locale: Locale;
  kind: EditorialKind;
  title: string;
  eyebrow: string;
  description: string;
  publicHref: string;
  filters: EditorialFilters;
}) {
  const ready = getDatabaseReadiness();
  const session = await readAdminSession();
  const mayDelete = Boolean(session && canPermanentlyDelete(session.role));
  const [data, editors] = await Promise.all([
    getEditorialRecords(kind, filters),
    getAdminEditorOptions(),
  ]);
  const base = `/${locale}/admin/${segments[kind]}`;
  const copy = getAdminQolCopy(locale);
  const returnTo = `${base}${queryFor(filters) ? `?${queryFor(filters)}` : ""}`;
  const dateFormatter = new Intl.DateTimeFormat(
    locale === "id" ? "id-ID" : "en-GB",
    { dateStyle: "medium", timeStyle: "short" },
  );

  return (
    <>
      <header className="admin-page-heading">
        <div>
          <p className="eyebrow">{eyebrow}</p>
          <h1>{title}</h1>
          <p>{description}</p>
        </div>
        <div className="admin-page-actions">
          <span className="collection-count">
            {ready ? data.total : "—"} {copy.common.records}
          </span>
          <Link className="text-link" href={publicHref}>{adminText(locale, "Lihat halaman publik", "View public page")}</Link>
          <Link className="button button-primary" href={`${base}/baru?returnTo=${encodeURIComponent(returnTo)}`}>
            {kind === "homepage"
              ? adminText(locale, "Edit beranda", "Edit homepage")
              : adminText(locale, "Buat draft", "Create draft")}
          </Link>
        </div>
      </header>

      {filters.editorialError ? (
        <div className="admin-feedback is-error" role="alert">
          <div>
            <strong>{adminText(locale, "Tindakan belum selesai", "Action not completed")}</strong>
            <Link href={returnTo}>{adminText(locale, "Tutup pesan", "Dismiss")}</Link>
          </div>
          <p>{filters.editorialError}</p>
        </div>
      ) : null}
      {filters.editorialNotice ? (
        <div className="admin-feedback is-success" role="status">
          <strong>{adminText(locale, "Tindakan selesai", "Action completed")}</strong>
          <p>{filters.editorialNotice}</p>
        </div>
      ) : null}

      {!ready ? (
        <section className="admin-notice">
          <span aria-hidden="true">!</span>
          <div>
            <h2>{adminText(locale, "Penyimpanan masih terkunci", "Storage is locked")}</h2>
            <p>{adminText(locale, "Daftar dan mutasi aktif setelah kredensial database dirotasi dan DATABASE_READY diaktifkan.", "Lists and mutations become available after the database credential is rotated and DATABASE_READY is enabled.")}</p>
          </div>
        </section>
      ) : (
        <>
          <form className="admin-collection-filters" method="get">
            <label>
              {adminText(locale, "Cari", "Search")}
              <input defaultValue={filters.q} name="q" placeholder={adminText(locale, "Judul atau metadata", "Title or metadata")} type="search" />
            </label>
            <label>
              {adminText(locale, "Status", "Status")}
              <select defaultValue={filters.status ?? ""} name="status">
                <option value="">{adminText(locale, "Semua status", "All statuses")}</option>
                <option value="DRAFT">{adminText(locale, "Draft", "Draft")}</option>
                <option value="PUBLISHED">{adminText(locale, "Terbit", "Published")}</option>
                <option value="ARCHIVED">{adminText(locale, "Arsip", "Archived")}</option>
              </select>
            </label>
            <label>
              {adminText(locale, "Perubahan publik", "Public changes")}
              <select defaultValue={filters.changed === undefined ? "" : String(filters.changed)} name="changed">
                <option value="">{adminText(locale, "Semua", "All")}</option>
                <option value="true">{adminText(locale, "Belum diterbitkan", "Unpublished changes")}</option>
                <option value="false">{adminText(locale, "Sudah sinkron", "Up to date")}</option>
              </select>
            </label>
            <label>
              {adminText(locale, "Editor terakhir", "Last editor")}
              <select defaultValue={filters.editor ?? ""} name="editor">
                <option value="">{adminText(locale, "Semua editor", "All editors")}</option>
                {editors.map((editor) => (
                  <option key={editor.id} value={editor.id}>{editor.name} · @{editor.username}</option>
                ))}
              </select>
            </label>
            <label>
              {adminText(locale, "Urutan", "Sort")}
              <select defaultValue={filters.sort ?? "updated-desc"} name="sort">
                <option value="updated-desc">{adminText(locale, "Terbaru diperbarui", "Recently updated")}</option>
                <option value="updated-asc">{adminText(locale, "Terlama diperbarui", "Oldest updated")}</option>
                <option value="title">{adminText(locale, "Judul A–Z", "Title A–Z")}</option>
              </select>
            </label>
            <div className="admin-filter-actions">
              <button className="filter-submit" type="submit">{copy.common.applyFilters}</button>
              <Link href={base}>{copy.common.resetFilters}</Link>
            </div>
          </form>

          {data.records.length ? (
            <form action={bulkEditorialAction} className="editorial-record-form">
              <input name="kind" type="hidden" value={kind} />
              <input name="locale" type="hidden" value={locale} />
              <input name="returnTo" type="hidden" value={returnTo} />
              {kind !== "homepage" ? (
                <div className="editorial-bulk-bar">
                  <BulkSelectionControl label={copy.common.selectPage} />
                  <BulkConfirmButton locale={locale} transition="archive">{adminText(locale, "Arsipkan pilihan", "Archive selected")}</BulkConfirmButton>
                  <BulkConfirmButton locale={locale} transition="restore">{adminText(locale, "Pulihkan pilihan", "Restore selected")}</BulkConfirmButton>
                </div>
              ) : null}
              <div className="editorial-record-list">
                {data.records.map((record) => {
                  const editHref = `${base}/${record.id}?returnTo=${encodeURIComponent(returnTo)}`;
                  return (
                    <article key={record.id}>
                      {kind !== "homepage" ? (
                        <label className="editorial-record-check">
                          <input aria-label={`${adminText(locale, "Pilih", "Select")} ${record.title}`} name="ids" type="checkbox" value={record.id} />
                        </label>
                      ) : <span />}
                      <div className="editorial-record-copy">
                        <div>
                          <span className={`status-pill is-${record.status.toLowerCase()}`}>{record.status}</span>
                          {record.hasUnpublishedChanges ? <span className="change-pill">{adminText(locale, "Perubahan belum terbit", "Unpublished changes")}</span> : null}
                          {record.protected ? <span className="change-pill">{adminText(locale, "Kanonis", "Canonical")}</span> : null}
                        </div>
                        <h2><Link href={editHref}>{record.title}</Link></h2>
                        <p>{record.meta}</p>
                        <small>
                          {copy.common.lastEditedBy} {record.lastEditorName ?? copy.common.unknownEditor} · {dateFormatter.format(record.updatedAt)} · v{record.draftVersion}
                        </small>
                      </div>
                      <div className="editorial-record-actions">
                        <Link href={editHref}>{copy.common.edit}</Link>
                        <PreviewLink href={`/${locale}/admin/preview/${kind}/${record.id}`} label={copy.common.preview} />
                        <details>
                          <summary>{copy.common.moreActions}</summary>
                          <div>
                            {kind !== "homepage" ? (
                              <button formAction={duplicateEditorialAction.bind(null, record.id)} type="submit">{copy.common.duplicate}</button>
                            ) : null}
                            <EditorialTransitionButton
                              id={record.id}
                              locale={locale}
                              title={record.title}
                              transition={record.status === "PUBLISHED" ? "unpublish" : record.status === "ARCHIVED" ? "restore" : "publish"}
                            />
                            {record.status !== "ARCHIVED" ? (
                              <EditorialTransitionButton id={record.id} locale={locale} title={record.title} transition="archive" />
                            ) : mayDelete && kind !== "homepage" ? (
                              <PermanentDeleteButton disabled={record.protected} id={record.id} title={record.title} />
                            ) : <span className="action-help">{kind === "homepage" ? adminText(locale, "Beranda tidak dapat dihapus", "Homepage cannot be deleted") : adminText(locale, "Hanya admin dapat menghapus", "Only admins can delete")}</span>}
                          </div>
                        </details>
                      </div>
                    </article>
                  );
                })}
              </div>
            </form>
          ) : (
            <section className="admin-empty compact">
              <span aria-hidden="true">0</span>
              <div>
                <h2>{adminText(locale, "Tidak ada hasil", "No results")}</h2>
                <p>{adminText(locale, "Ubah filter atau buat draft pertama.", "Change the filters or create the first draft.")}</p>
                {queryFor(filters) ? <Link href={base}>{copy.common.resetFilters}</Link> : null}
              </div>
            </section>
          )}

          {data.pages > 1 ? (
            <nav className="admin-pagination" aria-label={adminText(locale, "Halaman koleksi", "Collection pages")}>
              {Array.from({ length: data.pages }, (_, index) => {
                const page = index + 1;
                return (
                  <Link
                    aria-current={(filters.page ?? 1) === page ? "page" : undefined}
                    href={`${base}?${queryFor(filters, { page: String(page) })}`}
                    key={page}
                  >
                    {page}
                  </Link>
                );
              })}
            </nav>
          ) : null}
        </>
      )}
    </>
  );
}
