"use client";

import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useActionState, useEffect, useState } from "react";

import {
  createAgendaAction,
  createMaterialAction,
  createPostAction,
  createPublicationAction,
  type EditorActionState,
} from "@/app/[locale]/admin/(workspace)/editor-actions";
import { useEditorRecovery } from "@/components/admin/editor-recovery";
import { adminText } from "@/data/admin-qol";
import { UploadDropzone } from "@/lib/uploadthing";
import type { Locale } from "@/lib/i18n";

const initialState: EditorActionState = {};

type UploadedAsset = {
  storageKey: string;
  url: string;
  fileName: string;
  mimeType: string;
  size: number;
};

function FormStatus({ state }: { state: EditorActionState }) {
  if (!state.message) return null;
  return (
    <p
      aria-live="polite"
      className={`editor-form-status ${state.ok ? "is-success" : ""}`}
      role={state.ok ? "status" : "alert"}
    >
      {state.message}
    </p>
  );
}

function NewDraftRecovery({
  form,
  kind,
  locale,
  returnPath,
  state,
  userId,
}: {
  form: HTMLFormElement | null;
  kind: string;
  locale: Locale;
  returnPath: string;
  state: EditorActionState;
  userId: string;
}) {
  const router = useRouter();
  const { clear, notice } = useEditorRecovery({
    baseDraftVersion: 0,
    form,
    kind,
    locale,
    recordId: `new:${returnPath.split("?")[0]}`,
    serverUpdatedAt: 0,
    userId,
  });
  useEffect(() => {
    if (!state.ok || !state.recordId) return;
    void clear().then(() => {
      const base = returnPath.split("?")[0];
      router.replace(
        `${base}/${state.recordId}?created=1&returnTo=${encodeURIComponent(returnPath)}`,
      );
    });
  }, [clear, returnPath, router, state.ok, state.recordId]);
  return notice;
}

function NewFormErrorSummary({
  locale,
  state,
}: {
  locale: Locale;
  state: EditorActionState;
}) {
  const errors = Object.entries(state.fieldErrors ?? {}).flatMap(
    ([field, messages]) => (messages ?? []).map((message) => ({ field, message })),
  );
  if (!errors.length) return null;
  return (
    <section className="editor-error-summary" role="alert">
      <strong>{adminText(locale, "Periksa kembali bagian berikut", "Review the following fields")}</strong>
      <ul>
        {errors.map((error, index) => (
          <li key={`${error.field}-${index}`}>
            <button
              onClick={() => document.querySelector<HTMLElement>(`[name="${CSS.escape(error.field)}"]`)?.focus()}
              type="button"
            >
              {error.message}
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}

function Optional() {
  const { locale } = useParams<{ locale: string }>();
  return (
    <span className="field-optional">
      {adminText(locale === "en" ? "en" : "id", "Opsional", "Optional")}
    </span>
  );
}

function FormActions({
  pending,
  ready,
}: {
  pending: boolean;
  ready: boolean;
}) {
  const { locale } = useParams<{ locale: string }>();
  const activeLocale = locale === "en" ? "en" : "id";
  return (
    <div className="editor-action-bar">
      <p>
        <strong>{adminText(activeLocale, "Draft privat", "Private draft")}</strong>
        {adminText(activeLocale, "Belum terlihat di situs publik.", "Not visible on the public site.")}
      </p>
      <button
        className="button button-primary"
        disabled={!ready || pending}
        type="submit"
      >
        {pending
          ? adminText(activeLocale, "Menyimpan…", "Saving…")
          : adminText(activeLocale, "Simpan draft", "Save draft")}
      </button>
    </div>
  );
}

export function PostEditorForm({
  locale,
  ready,
  returnPath,
  userId,
}: {
  locale: Locale;
  ready: boolean;
  returnPath: string;
  userId: string;
}) {
  const [state, action, pending] = useActionState(createPostAction, initialState);
  const [formNode, setFormNode] = useState<HTMLFormElement | null>(null);

  return (
    <form action={action} className="editor-form" ref={setFormNode}>
      <input name="returnPath" type="hidden" value={returnPath} />
      <FormStatus state={state} />
      <NewFormErrorSummary locale={locale} state={state} />
      <NewDraftRecovery form={formNode} kind="post" locale={locale} returnPath={returnPath} state={state} userId={userId} />
      <fieldset disabled={pending}>
        <legend className="sr-only">{adminText(locale, "Tulisan baru", "New writing")}</legend>

        <section className="editor-section" aria-labelledby="post-main">
          <div className="editor-section-heading">
            <span>01</span>
            <div>
              <h3 id="post-main">{adminText(locale, "Naskah utama", "Main article")}</h3>
              <p>{adminText(locale, "Judul dan isi sudah cukup untuk membuat draft. Slug dibuat otomatis.", "A title and article are enough to create a draft. The slug is generated automatically.")}</p>
            </div>
          </div>
          <div className="editor-form-grid">
            <label className="editor-span-2">
              {adminText(locale, "Judul Indonesia", "Indonesian title")}
              <input autoFocus name="titleId" placeholder={adminText(locale, "Judul tulisan", "Writing title")} required />
            </label>
            <label className="editor-span-2">
              {adminText(locale, "Naskah Indonesia", "Indonesian article")}
              <textarea
                className="editor-body"
                name="contentId"
                placeholder={adminText(locale, "Mulai menulis. Pisahkan paragraf dengan satu baris kosong.", "Start writing. Separate paragraphs with a blank line.")}
                required
                rows={14}
              />
            </label>
          </div>
        </section>

        <details className="editor-options">
          <summary>{adminText(locale, "Ringkasan & pengelompokan", "Summary & grouping")} <Optional /></summary>
          <div className="editor-form-grid">
            <label className="editor-span-2">
              {adminText(locale, "Ringkasan singkat", "Short summary")} <Optional />
              <textarea name="excerptId" rows={3} />
            </label>
            <label className="editor-span-2">
              {adminText(locale, "Topik", "Topics")} <Optional />
              <input name="topics" placeholder="Pemilu, demokrasi, opini publik" />
              <small>{adminText(locale, "Pisahkan topik dengan koma.", "Separate topics with commas.")}</small>
            </label>
            <label>
              {adminText(locale, "Gambar sampul", "Cover image")} <Optional />
              <input name="coverImage" placeholder="https://" type="url" />
            </label>
            <label>
              {adminText(locale, "Sumber kanonis", "Canonical source")} <Optional />
              <input name="canonicalExternal" placeholder="https://" type="url" />
            </label>
          </div>
        </details>

        <details className="editor-options">
          <summary>{adminText(locale, "Versi English", "English version")} <Optional /></summary>
          <div className="editor-form-grid">
            <label className="editor-span-2">
              English title <Optional />
              <input name="titleEn" />
            </label>
            <label className="editor-span-2">
              English summary <Optional />
              <textarea name="excerptEn" rows={3} />
            </label>
            <label className="editor-span-2">
              English article <Optional />
              <textarea className="editor-body" name="contentEn" rows={10} />
            </label>
          </div>
        </details>

        <FormActions pending={pending} ready={ready} />
      </fieldset>
    </form>
  );
}

export function AgendaEditorForm({
  locale,
  ready,
  returnPath,
  userId,
}: {
  locale: Locale;
  ready: boolean;
  returnPath: string;
  userId: string;
}) {
  const [state, action, pending] = useActionState(createAgendaAction, initialState);
  const [formNode, setFormNode] = useState<HTMLFormElement | null>(null);

  return (
    <form action={action} className="editor-form" ref={setFormNode}>
      <input name="returnPath" type="hidden" value={returnPath} />
      <FormStatus state={state} />
      <NewFormErrorSummary locale={locale} state={state} />
      <NewDraftRecovery form={formNode} kind="agenda" locale={locale} returnPath={returnPath} state={state} userId={userId} />
      <fieldset disabled={pending}>
        <legend className="sr-only">{adminText(locale, "Agenda baru", "New agenda item")}</legend>

        <section className="editor-section" aria-labelledby="agenda-main">
          <div className="editor-section-heading">
            <span>01</span>
            <div>
              <h3 id="agenda-main">{adminText(locale, "Informasi acara", "Event information")}</h3>
              <p>{adminText(locale, "Isi informasi yang perlu diketahui pengunjung. Waktu ditampilkan dalam WIB.", "Add the information visitors need. Times are displayed in WIB.")}</p>
            </div>
          </div>
          <div className="editor-form-grid">
            <label className="editor-span-2">
              {adminText(locale, "Judul agenda Indonesia", "Indonesian agenda title")}
              <input autoFocus name="titleId" required />
            </label>
            <label className="editor-span-2">
              {adminText(locale, "Deskripsi singkat Indonesia", "Short Indonesian description")}
              <textarea name="descriptionId" required rows={3} />
            </label>
            <label>
              {adminText(locale, "Mulai (WIB)", "Starts (WIB)")}
              <input name="startsAt" required type="datetime-local" />
            </label>
            <label>
              {adminText(locale, "Selesai (WIB)", "Ends (WIB)")} <Optional />
              <input name="endsAt" type="datetime-local" />
            </label>
          </div>
        </section>

        <details className="editor-options">
          <summary>{adminText(locale, "Lokasi & tautan", "Location & link")} <Optional /></summary>
          <div className="editor-form-grid">
            <label>
              {adminText(locale, "Lokasi Indonesia", "Indonesian location")} <Optional />
              <input name="locationLabelId" />
            </label>
            <label>
              {adminText(locale, "Tautan sumber / registrasi", "Source / registration link")} <Optional />
              <input name="externalUrl" placeholder="https://" type="url" />
            </label>
          </div>
        </details>

        <details className="editor-options">
          <summary>{adminText(locale, "Versi English", "English version")} <Optional /></summary>
          <div className="editor-form-grid">
            <label>
              English title <Optional />
              <input name="titleEn" />
            </label>
            <label>
              English location <Optional />
              <input name="locationLabelEn" />
            </label>
            <label className="editor-span-2">
              English description <Optional />
              <textarea name="descriptionEn" rows={3} />
            </label>
          </div>
        </details>

        <FormActions pending={pending} ready={ready} />
      </fieldset>
    </form>
  );
}

export function PublicationEditorForm({
  locale,
  ready,
  returnPath,
  userId,
}: {
  locale: Locale;
  ready: boolean;
  returnPath: string;
  userId: string;
}) {
  const [state, action, pending] = useActionState(createPublicationAction, initialState);
  const [formNode, setFormNode] = useState<HTMLFormElement | null>(null);
  const [coverAsset, setCoverAsset] = useState<UploadedAsset | null>(null);
  const [preview, setPreview] = useState({
    type: "BOOK",
    title: "",
    authors: "",
    year: "",
    status: "PUBLISHED",
    containerTitle: "",
    publisher: "",
    publicationPlace: "",
    volume: "",
    issue: "",
    seriesNumber: "",
    pages: "",
  });
  const typeNames: Record<string, string> = {
    BOOK: "Buku",
    JOURNAL_ARTICLE: "Artikel jurnal",
    BOOK_CHAPTER: "Bab buku",
    ADDITIONAL_RESEARCH_OUTPUT: "Output riset lain",
  };
  const updatePreview = (name: keyof typeof preview, value: string) =>
    setPreview((current) => ({ ...current, [name]: value }));
  const previewAuthors = preview.authors
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean)
    .join(", ");
  const previewImprint =
    preview.type === "BOOK"
      ? [preview.publicationPlace, preview.publisher].filter(Boolean).join(": ")
      : preview.containerTitle;
  const previewDetails = [
    preview.volume ? `Vol. ${preview.volume}` : "",
    preview.issue ? `No. ${preview.issue}` : "",
    preview.seriesNumber ? `Nomor ${preview.seriesNumber}` : "",
    preview.pages ? `Hal. ${preview.pages}` : "",
  ].filter(Boolean);

  return (
    <form action={action} className="editor-form" ref={setFormNode}>
      <input name="returnPath" type="hidden" value={returnPath} />
      {coverAsset ? (
        <>
          <input name="coverImage" type="hidden" value={coverAsset.url} />
          <input name="coverStorageKey" type="hidden" value={coverAsset.storageKey} />
          <input name="coverFileName" type="hidden" value={coverAsset.fileName} />
          <input name="coverMimeType" type="hidden" value={coverAsset.mimeType} />
          <input name="coverFileSize" type="hidden" value={coverAsset.size} />
        </>
      ) : null}
      <FormStatus state={state} />
      <NewFormErrorSummary locale={locale} state={state} />
      <NewDraftRecovery form={formNode} kind="publication" locale={locale} returnPath={returnPath} state={state} userId={userId} />
      <fieldset disabled={pending}>
        <legend className="sr-only">{adminText(locale, "Publikasi baru", "New publication")}</legend>

        <section className="editor-section" aria-labelledby="publication-main">
          <div className="editor-section-heading">
            <span>01</span>
            <div>
              <h3 id="publication-main">{adminText(locale, "Karya", "Work")}</h3>
              <p>{adminText(locale, "Masukkan judul publikasi saja—tanpa penulis, tahun, jurnal, atau URL.", "Enter the publication title only—without authors, year, journal, or URL.")}</p>
            </div>
          </div>
          <div className="editor-form-grid">
            <label className="editor-span-2">
              {adminText(locale, "Judul asli publikasi", "Original publication title")}
              <input
                autoFocus
                name="title"
                onChange={(event) => updatePreview("title", event.target.value)}
                required
              />
              <small>{adminText(locale, "Gunakan redaksi asli sumber; jangan tempel seluruh sitasi.", "Preserve the source wording; do not paste the full citation.")}</small>
            </label>
            <label>
              {adminText(locale, "Tahun", "Year")}
              <input
                min="1900"
                name="year"
                onChange={(event) => updatePreview("year", event.target.value)}
                required
                type="number"
              />
            </label>
            <label>
              {adminText(locale, "Jenis publikasi", "Publication type")}
              <select
                name="type"
                onChange={(event) => updatePreview("type", event.target.value)}
              >
                <option value="BOOK">{adminText(locale, "Buku", "Book")}</option>
                <option value="JOURNAL_ARTICLE">{adminText(locale, "Artikel jurnal", "Journal article")}</option>
                <option value="BOOK_CHAPTER">{adminText(locale, "Bab buku", "Book chapter")}</option>
                <option value="ADDITIONAL_RESEARCH_OUTPUT">{adminText(locale, "Output riset lain", "Other research output")}</option>
              </select>
            </label>
            <label>
              {adminText(locale, "Status bibliografis", "Bibliographic status")}
              <select
                name="status"
                onChange={(event) => updatePreview("status", event.target.value)}
              >
                <option value="PUBLISHED">Published</option>
                <option value="FORTHCOMING">Forthcoming</option>
                <option value="PREPRINT">Preprint</option>
                <option value="ERRATUM">Erratum</option>
                <option value="REVIEW">Review</option>
              </select>
            </label>
            <label>
              {adminText(locale, "Keterangan tanggal", "Date label")} <Optional />
              <input name="dateLabel" placeholder="Contoh: Februari" />
            </label>
          </div>
        </section>

        <section className="editor-section" aria-labelledby="publication-contributors">
          <div className="editor-section-heading">
            <span>02</span>
            <div>
              <h3 id="publication-contributors">{adminText(locale, "Kontributor", "Contributors")}</h3>
              <p>{adminText(locale, "Satu nama per baris, dalam urutan yang sama dengan sumber.", "Use one name per line, preserving the source order.")}</p>
            </div>
          </div>
          <div className="editor-form-grid">
            <label className="editor-span-2">
              {adminText(locale, "Penulis", "Authors")}
              <textarea
                name="authors"
                onChange={(event) => updatePreview("authors", event.target.value)}
                placeholder={"Burhanuddin Muhtadi\nNama penulis berikutnya"}
                required
                rows={4}
              />
            </label>
            {preview.type === "BOOK_CHAPTER" ? (
              <label className="editor-span-2">
                {adminText(locale, "Editor buku induk", "Parent book editors")} <Optional />
                <textarea
                  name="editors"
                  placeholder={"Nama editor pertama\nNama editor berikutnya"}
                  rows={3}
                />
              </label>
            ) : (
              <input name="editors" type="hidden" value="" />
            )}
          </div>
        </section>

        <section className="editor-section" aria-labelledby="publication-bibliography">
          <div className="editor-section-heading">
            <span>03</span>
            <div>
              <h3 id="publication-bibliography">{adminText(locale, "Detail terbitan", "Publication details")}</h3>
              <p>{adminText(locale, "Pisahkan jurnal, buku induk, penerbit, nomor, dan halaman.", "Keep the journal or parent book, publisher, issue, and pages in separate fields.")}</p>
            </div>
          </div>
          <div className="editor-form-grid">
            {preview.type !== "BOOK" ? (
              <label className="editor-span-2">
                {adminText(locale, "Jurnal, seri, atau buku induk", "Journal, series, or parent book")}
                <input
                  name="containerTitle"
                  onChange={(event) =>
                    updatePreview("containerTitle", event.target.value)
                  }
                  required
                />
              </label>
            ) : (
              <input name="containerTitle" type="hidden" value="" />
            )}
            <label>
              {adminText(locale, "Penerbit", "Publisher")} {preview.type === "BOOK" ? null : <Optional />}
              <input
                name="publisher"
                onChange={(event) => updatePreview("publisher", event.target.value)}
                required={preview.type === "BOOK"}
              />
            </label>
            <label>
              {adminText(locale, "Tempat terbit", "Publication place")} <Optional />
              <input
                name="publicationPlace"
                onChange={(event) =>
                  updatePreview("publicationPlace", event.target.value)
                }
              />
            </label>
            <label>
              Volume <Optional />
              <input
                name="volume"
                onChange={(event) => updatePreview("volume", event.target.value)}
              />
            </label>
            <label>
              Issue <Optional />
              <input
                name="issue"
                onChange={(event) => updatePreview("issue", event.target.value)}
              />
            </label>
            <label>
              {adminText(locale, "Nomor seri", "Series number")} <Optional />
              <input
                name="seriesNumber"
                onChange={(event) =>
                  updatePreview("seriesNumber", event.target.value)
                }
              />
            </label>
            <label>
              {adminText(locale, "Halaman", "Pages")} <Optional />
              <input
                name="pages"
                onChange={(event) => updatePreview("pages", event.target.value)}
                placeholder="127-141"
              />
            </label>
            <label>
              DOI <Optional />
              <input name="doi" placeholder="10.xxxx/..." />
              <small>{adminText(locale, "Tanpa awalan https://doi.org/.", "Without the https://doi.org/ prefix.")}</small>
            </label>
            <label>
              {adminText(locale, "URL kanonis", "Canonical URL")} <Optional />
              <input name="externalUrl" placeholder="https://" type="url" />
            </label>
          </div>
        </section>

        <section className="editor-section" aria-labelledby="publication-source-media">
          <div className="editor-section-heading">
            <span>04</span>
            <div>
              <h3 id="publication-source-media">{adminText(locale, "Sumber dan gambar", "Source and image")}</h3>
              <p>{adminText(locale, "Simpan jejak sumber dan hanya gunakan gambar dengan hak yang jelas.", "Preserve source provenance and only use images with clear rights.")}</p>
            </div>
          </div>
          <div className="publication-cover-editor">
            <h4>{adminText(locale, "Gambar publikasi", "Publication image")} <Optional /></h4>
            <div className="admin-upload-zone">
              {ready ? (
                <UploadDropzone
                  endpoint="publicationImage"
                  onClientUploadComplete={(files) => {
                    const file = files[0];
                    if (!file) return;
                    setCoverAsset({
                      storageKey: file.key,
                      url: file.ufsUrl,
                      fileName: file.name,
                      mimeType: file.type,
                      size: file.size,
                    });
                  }}
                  onUploadError={() => setCoverAsset(null)}
                />
              ) : (
                <div className="admin-upload-disabled">
                  {adminText(locale, "Upload aktif setelah database siap.", "Uploads become available when the database is ready.")}
                </div>
              )}
              <p role="status">
                {coverAsset
                  ? adminText(locale, `Gambar siap disimpan: ${coverAsset.fileName}`, `Image ready to save: ${coverAsset.fileName}`)
                  : adminText(locale, "JPG, PNG, atau WebP maks. 4 MB. Placeholder bibliografis tampil jika dikosongkan.", "JPG, PNG, or WebP up to 4 MB. A bibliographic placeholder is used when left empty.")}
              </p>
            </div>
            {coverAsset ? (
              <div className="publication-cover-rights">
                <div className="publication-cover-upload-preview">
                  <Image
                    alt=""
                    fill
                    sizes="160px"
                    src={coverAsset.url}
                  />
                </div>
                <label>
                  {adminText(locale, "Catatan hak penggunaan", "Usage rights note")}
                  <input
                    name="coverRightsNote"
                    placeholder="Contoh: sampul resmi, disetujui untuk tampilan situs"
                    required
                  />
                  <small>
                    {adminText(locale, "Jelaskan sumber dan izin penggunaan gambar sebelum draft disimpan.", "Describe the image source and permission before saving the draft.")}
                  </small>
                </label>
                <button
                  className="button button-secondary"
                  onClick={() => setCoverAsset(null)}
                  type="button"
                >
                  {adminText(locale, "Hapus dari draft", "Remove from draft")}
                </button>
              </div>
            ) : null}
          </div>
          <div className="editor-form-grid">
            <label>
              {adminText(locale, "Nama sumber", "Source name")} <Optional />
              <input name="sourceName" placeholder="Input manual" />
            </label>
            <label>
              {adminText(locale, "URL sumber", "Source URL")} <Optional />
              <input name="sourceUrl" placeholder="https://" type="url" />
            </label>
            <label className="editor-span-2">
              {adminText(locale, "Catatan sumber", "Source note")} <Optional />
              <textarea name="sourceNote" rows={3} />
            </label>
          </div>
        </section>

        <section className="publication-admin-preview" aria-labelledby="publication-preview-title">
          <div className="editor-section-heading">
            <span aria-hidden="true">↗</span>
            <div>
              <h3 id="publication-preview-title">{adminText(locale, "Pratinjau kartu", "Card preview")}</h3>
              <p>{adminText(locale, "Struktur ini mengikuti kartu pada indeks publikasi.", "This structure matches the publication index card.")}</p>
            </div>
          </div>
          <article>
            <div className="publication-admin-preview-visual">
              {coverAsset ? (
                <Image alt="" fill sizes="120px" src={coverAsset.url} />
              ) : (
                <div aria-hidden="true">
                  <span>{typeNames[preview.type]}</span>
                  <strong>{preview.year || "20—"}</strong>
                </div>
              )}
            </div>
            <div>
              <small>
                {typeNames[preview.type]} · {preview.year || adminText(locale, "Tahun", "Year")} ·{" "}
                {preview.status}
              </small>
              <h4>{preview.title || adminText(locale, "Judul publikasi", "Publication title")}</h4>
              <p>{previewAuthors || adminText(locale, "Urutan penulis", "Author order")}</p>
              {previewImprint ? <p>{previewImprint}</p> : null}
              {previewDetails.length ? <p>{previewDetails.join(" · ")}</p> : null}
            </div>
          </article>
        </section>

        <FormActions pending={pending} ready={ready} />
      </fieldset>
    </form>
  );
}

export function MaterialEditorForm({
  locale,
  ready,
  returnPath,
  userId,
}: {
  locale: Locale;
  ready: boolean;
  returnPath: string;
  userId: string;
}) {
  const [state, action, pending] = useActionState(createMaterialAction, initialState);
  const [formNode, setFormNode] = useState<HTMLFormElement | null>(null);
  const [asset, setAsset] = useState<UploadedAsset | null>(null);
  const [delivery, setDelivery] = useState<"upload" | "link">("upload");

  return (
    <form action={action} className="editor-form" ref={setFormNode}>
      <input name="returnPath" type="hidden" value={returnPath} />
      {delivery === "upload" && asset ? (
        <>
          <input name="storageKey" type="hidden" value={asset.storageKey} />
          <input name="assetUrl" type="hidden" value={asset.url} />
          <input name="fileName" type="hidden" value={asset.fileName} />
          <input name="mimeType" type="hidden" value={asset.mimeType} />
          <input name="fileSize" type="hidden" value={asset.size} />
        </>
      ) : null}
      <FormStatus state={state} />
      <NewFormErrorSummary locale={locale} state={state} />
      <NewDraftRecovery form={formNode} kind="material" locale={locale} returnPath={returnPath} state={state} userId={userId} />
      <fieldset disabled={pending}>
        <legend className="sr-only">{adminText(locale, "Materi baru", "New material")}</legend>

        <section className="editor-section" aria-labelledby="material-main">
          <div className="editor-section-heading">
            <span>01</span>
            <div>
              <h3 id="material-main">{adminText(locale, "Identitas materi", "Material identity")}</h3>
              <p>{adminText(locale, "Gunakan judul yang mudah dikenali mahasiswa. Slug dibuat otomatis.", "Use a title students can recognize easily. The slug is generated automatically.")}</p>
            </div>
          </div>
          <div className="editor-form-grid">
            <label className="editor-span-2">
              {adminText(locale, "Judul materi Indonesia", "Indonesian material title")}
              <input autoFocus name="titleId" required />
            </label>
            <label className="editor-span-2">
              {adminText(locale, "Deskripsi singkat Indonesia", "Short Indonesian description")}
              <textarea name="descriptionId" required rows={3} />
            </label>
            <label>
              {adminText(locale, "Mata kuliah", "Course")}
              <input name="courseId" required />
            </label>
            <label>
              {adminText(locale, "Jenis materi", "Material type")}
              <select name="resourceType">
                <option value="SLIDE">Slide</option>
                <option value="READING">{adminText(locale, "Bacaan", "Reading")}</option>
                <option value="SYLLABUS">{adminText(locale, "Silabus", "Syllabus")}</option>
                <option value="ASSIGNMENT">{adminText(locale, "Tugas", "Assignment")}</option>
                <option value="DATASET">Dataset</option>
                <option value="VIDEO">Video</option>
                <option value="LINK">{adminText(locale, "Tautan", "Link")}</option>
                <option value="OTHER">{adminText(locale, "Lainnya", "Other")}</option>
              </select>
            </label>
          </div>
        </section>

        <section className="editor-section" aria-labelledby="material-delivery">
          <div className="editor-section-heading">
            <span>02</span>
            <div>
              <h3 id="material-delivery">{adminText(locale, "Cara membuka materi", "Material delivery")}</h3>
              <p>{adminText(locale, "Pilih satu tujuan agar tombol publik selalu dapat digunakan.", "Choose one destination so the public action always works.")}</p>
            </div>
          </div>
          <div className="delivery-choice" role="radiogroup" aria-label={adminText(locale, "Cara membuka materi", "Material delivery")}>
            <label className={delivery === "upload" ? "is-selected" : ""}>
              <input
                checked={delivery === "upload"}
                name="deliveryMode"
                onChange={() => setDelivery("upload")}
                type="radio"
                value="upload"
              />
              <span><strong>{adminText(locale, "Unggah berkas", "Upload file")}</strong><small>{adminText(locale, "PDF atau gambar", "PDF or image")}</small></span>
            </label>
            <label className={delivery === "link" ? "is-selected" : ""}>
              <input
                checked={delivery === "link"}
                name="deliveryMode"
                onChange={() => setDelivery("link")}
                type="radio"
                value="link"
              />
              <span><strong>{adminText(locale, "Tautan eksternal", "External link")}</strong><small>{adminText(locale, "Video, laman, atau dokumen luar", "Video, webpage, or external document")}</small></span>
            </label>
          </div>

          {delivery === "upload" ? (
            <div className="admin-upload-zone">
              {ready ? (
                <UploadDropzone
                  endpoint="academicAsset"
                  onClientUploadComplete={(files) => {
                    const file = files[0];
                    if (!file) return;
                    setAsset({
                      storageKey: file.key,
                      url: file.ufsUrl,
                      fileName: file.name,
                      mimeType: file.type,
                      size: file.size,
                    });
                  }}
                  onUploadError={() => setAsset(null)}
                />
              ) : (
                <div className="admin-upload-disabled">{adminText(locale, "Upload aktif setelah database siap.", "Uploads become available when the database is ready.")}</div>
              )}
              <p role="status">
                {asset
                  ? adminText(locale, `Siap disimpan: ${asset.fileName}`, `Ready to save: ${asset.fileName}`)
                  : adminText(locale, "PDF maks. 16 MB atau gambar maks. 4 MB.", "PDF up to 16 MB or image up to 4 MB.")}
              </p>
            </div>
          ) : (
            <label className="delivery-url">
              {adminText(locale, "Alamat materi", "Material URL")}
              <input name="externalUrl" placeholder="https://" required type="url" />
            </label>
          )}

          <label className="editor-check">
            <input name="downloadAllowed" type="checkbox" />
            <span>
              <strong>{adminText(locale, "Izinkan unduhan", "Allow download")}</strong>
              <small>{adminText(locale, "Aktifkan hanya jika hak distribusi berkas sudah jelas.", "Enable only when file distribution rights are clear.")}</small>
            </span>
          </label>
        </section>

        <details className="editor-options">
          <summary>{adminText(locale, "Metadata kelas", "Class metadata")} <Optional /></summary>
          <div className="editor-form-grid">
            <label>
              {adminText(locale, "Topik", "Topic")} <Optional />
              <input name="topicId" />
            </label>
            <label>
              Semester <Optional />
              <input name="semester" placeholder="Ganjil" />
            </label>
            <label>
              {adminText(locale, "Tahun akademik", "Academic year")} <Optional />
              <input name="academicYear" placeholder="2026/2027" />
            </label>
            <label>
              {adminText(locale, "Catatan hak penggunaan", "Usage rights note")} <Optional />
              <input name="rightsNote" />
            </label>
          </div>
        </details>

        <details className="editor-options">
          <summary>{adminText(locale, "Versi English", "English version")} <Optional /></summary>
          <div className="editor-form-grid">
            <label>
              English title <Optional />
              <input name="titleEn" />
            </label>
            <label>
              Course name <Optional />
              <input name="courseEn" />
            </label>
            <label>
              Topic <Optional />
              <input name="topicEn" />
            </label>
            <label className="editor-span-2">
              English description <Optional />
              <textarea name="descriptionEn" rows={3} />
            </label>
          </div>
        </details>

        <FormActions pending={pending} ready={ready} />
      </fieldset>
    </form>
  );
}
