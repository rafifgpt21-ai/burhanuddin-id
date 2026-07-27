import Link from "next/link";

import {
  bulkEditorialAction,
  duplicateEditorialAction,
  editorialTransitionAction,
} from "@/app/[locale]/admin/(workspace)/editor-actions";
import {
  getEditorialRecords,
  type EditorialFilters,
  type EditorialKind,
} from "@/lib/content/admin-records";
import { getDatabaseReadiness } from "@/lib/content/database-readiness";
import { readAdminSession } from "@/lib/auth/session";
import { canPermanentlyDelete } from "@/lib/auth/access";
import { PreviewLink } from "@/components/admin/preview-link";
import { PermanentDeleteButton } from "@/components/admin/permanent-delete-button";
import type { Locale } from "@/lib/i18n";

const segments: Record<EditorialKind, string> = {
  homepage: "beranda",
  post: "tulisan",
  agenda: "agenda",
  material: "materi",
  publication: "publikasi",
};

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
  const data = await getEditorialRecords(kind, filters);
  const base = `/${locale}/admin/${segments[kind]}`;

  return (
    <>
      <header className="admin-page-heading">
        <div>
          <p className="eyebrow">{eyebrow}</p>
          <h1>{title}</h1>
          <p>{description}</p>
        </div>
        <div className="admin-page-actions">
          <span className="collection-count">{ready ? data.total : "—"} record</span>
          <Link className="text-link" href={publicHref}>Lihat halaman publik</Link>
          <Link className="button button-primary" href={`${base}/baru`}>
            {kind === "homepage" ? "Edit beranda" : "Buat draft"}
          </Link>
        </div>
      </header>

      {filters.editorialError ? (
        <div className="admin-feedback is-error" role="alert">
          <div>
            <strong>Belum dapat diterbitkan</strong>
            <Link href={base}>Tutup pesan</Link>
          </div>
          <p>{filters.editorialError}</p>
        </div>
      ) : null}

      {!ready ? (
        <section className="admin-notice">
          <span aria-hidden="true">!</span>
          <div>
            <h2>Penyimpanan masih terkunci</h2>
            <p>Daftar dan mutasi aktif setelah kredensial database dirotasi dan DATABASE_READY diaktifkan.</p>
          </div>
        </section>
      ) : (
        <>
          <form className="admin-collection-filters" method="get">
            <label>
              Cari
              <input defaultValue={filters.q} name="q" placeholder="Judul atau metadata" type="search" />
            </label>
            <label>
              Status
              <select defaultValue={filters.status ?? ""} name="status">
                <option value="">Semua status</option>
                <option value="DRAFT">Draft</option>
                <option value="PUBLISHED">Terbit</option>
                <option value="ARCHIVED">Arsip</option>
              </select>
            </label>
            <label>
              Urutan
              <select defaultValue={filters.sort ?? "updated-desc"} name="sort">
                <option value="updated-desc">Terbaru diperbarui</option>
                <option value="updated-asc">Terlama diperbarui</option>
              </select>
            </label>
            <button className="filter-submit" type="submit">Terapkan</button>
          </form>

          {data.records.length ? (
            <form action={bulkEditorialAction} className="editorial-record-form">
              <input name="kind" type="hidden" value={kind} />
              <input name="locale" type="hidden" value={locale} />
              {kind !== "homepage" ? <div className="editorial-bulk-bar">
                <span>Pilih record untuk tindakan bersama.</span>
                <button name="transition" value="archive" type="submit">Arsipkan pilihan</button>
                <button name="transition" value="restore" type="submit">Pulihkan pilihan</button>
              </div> : null}
              <div className="editorial-record-list">
                {data.records.map((record) => (
                  <article key={record.id}>
                    {kind !== "homepage" ? <label className="editorial-record-check">
                      <input aria-label={`Pilih ${record.title}`} name="ids" type="checkbox" value={record.id} />
                    </label> : <span />}
                    <div className="editorial-record-copy">
                      <div>
                        <span className={`status-pill is-${record.status.toLowerCase()}`}>
                          {record.status}
                        </span>
                        {record.hasUnpublishedChanges ? <span className="change-pill">Perubahan belum terbit</span> : null}
                        {record.protected ? <span className="change-pill">Kanonis</span> : null}
                      </div>
                      <h2><Link href={`${base}/${record.id}`}>{record.title}</Link></h2>
                      <p>{record.meta}</p>
                      <small>Diperbarui {new Intl.DateTimeFormat(locale === "id" ? "id-ID" : "en-GB", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      }).format(record.updatedAt)}</small>
                    </div>
                    <div className="editorial-record-actions">
                      <Link href={`${base}/${record.id}`}>Edit</Link>
                      <PreviewLink href={`/${locale}/admin/preview/${kind}/${record.id}`} />
                      {kind !== "homepage" ? (
                        <button
                          formAction={duplicateEditorialAction.bind(null, record.id)}
                          type="submit"
                        >
                          Duplikasi
                        </button>
                      ) : null}
                      <button
                        formAction={editorialTransitionAction.bind(
                          null,
                          `${record.id}:${record.status === "PUBLISHED" ? "unpublish" : record.status === "ARCHIVED" ? "restore" : "publish"}`,
                        )}
                        type="submit"
                      >
                        {record.status === "PUBLISHED" ? "Batalkan terbit" : record.status === "ARCHIVED" ? "Pulihkan" : "Terbitkan"}
                      </button>
                      {record.status !== "ARCHIVED" ? (
                        <button
                          formAction={editorialTransitionAction.bind(
                            null,
                            `${record.id}:archive`,
                          )}
                          type="submit"
                        >
                          Arsipkan
                        </button>
                      ) : mayDelete && kind !== "homepage" ? (
                        <PermanentDeleteButton
                          disabled={record.protected}
                          id={record.id}
                          title={record.title}
                        />
                      ) : <span className="action-help">{kind === "homepage" ? "Beranda tidak dapat dihapus" : "Hanya admin dapat menghapus"}</span>}
                    </div>
                  </article>
                ))}
              </div>
            </form>
          ) : (
            <section className="admin-empty compact">
              <span aria-hidden="true">0</span>
              <div><h2>Belum ada record</h2><p>Buat draft pertama atau ubah filter pencarian.</p></div>
            </section>
          )}

          {data.pages > 1 ? (
            <nav className="admin-pagination" aria-label="Halaman koleksi">
              {Array.from({ length: data.pages }, (_, index) => (
                <Link
                  aria-current={(filters.page ?? 1) === index + 1 ? "page" : undefined}
                  href={`${base}?page=${index + 1}`}
                  key={index}
                >
                  {index + 1}
                </Link>
              ))}
            </nav>
          ) : null}
        </>
      )}
    </>
  );
}
