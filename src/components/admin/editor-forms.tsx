"use client";

import Image from "next/image";
import { useActionState, useState } from "react";

import {
  createAgendaAction,
  createMaterialAction,
  createPostAction,
  createPublicationAction,
  type EditorActionState,
} from "@/app/[locale]/admin/(workspace)/editor-actions";
import { UploadDropzone } from "@/lib/uploadthing";

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

function Optional() {
  return <span className="field-optional">Opsional</span>;
}

function FormActions({
  pending,
  ready,
}: {
  pending: boolean;
  ready: boolean;
}) {
  return (
    <div className="editor-action-bar">
      <p>
        <strong>Draft privat</strong>
        Belum terlihat di situs publik.
      </p>
      <button
        className="button button-primary"
        disabled={!ready || pending}
        type="submit"
      >
        {pending ? "Menyimpan…" : "Simpan draft"}
      </button>
    </div>
  );
}

export function PostEditorForm({
  ready,
  returnPath,
}: {
  ready: boolean;
  returnPath: string;
}) {
  const [state, action, pending] = useActionState(createPostAction, initialState);

  return (
    <form action={action} className="editor-form">
      <input name="returnPath" type="hidden" value={returnPath} />
      <FormStatus state={state} />
      <fieldset disabled={pending}>
        <legend className="sr-only">Tulisan baru</legend>

        <section className="editor-section" aria-labelledby="post-main">
          <div className="editor-section-heading">
            <span>01</span>
            <div>
              <h3 id="post-main">Naskah utama</h3>
              <p>Judul dan isi sudah cukup untuk membuat draft. Slug dibuat otomatis.</p>
            </div>
          </div>
          <div className="editor-form-grid">
            <label className="editor-span-2">
              Judul
              <input autoFocus name="titleId" placeholder="Judul tulisan" required />
            </label>
            <label className="editor-span-2">
              Isi tulisan
              <textarea
                className="editor-body"
                name="contentId"
                placeholder="Mulai menulis. Pisahkan paragraf dengan satu baris kosong."
                required
                rows={14}
              />
            </label>
          </div>
        </section>

        <details className="editor-options">
          <summary>Ringkasan & pengelompokan <Optional /></summary>
          <div className="editor-form-grid">
            <label className="editor-span-2">
              Ringkasan singkat <Optional />
              <textarea name="excerptId" rows={3} />
            </label>
            <label className="editor-span-2">
              Topik <Optional />
              <input name="topics" placeholder="Pemilu, demokrasi, opini publik" />
              <small>Pisahkan topik dengan koma.</small>
            </label>
            <label>
              Gambar sampul <Optional />
              <input name="coverImage" placeholder="https://" type="url" />
            </label>
            <label>
              Sumber kanonis <Optional />
              <input name="canonicalExternal" placeholder="https://" type="url" />
            </label>
          </div>
        </details>

        <details className="editor-options">
          <summary>Versi Inggris <Optional /></summary>
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
  ready,
  returnPath,
}: {
  ready: boolean;
  returnPath: string;
}) {
  const [state, action, pending] = useActionState(createAgendaAction, initialState);

  return (
    <form action={action} className="editor-form">
      <input name="returnPath" type="hidden" value={returnPath} />
      <FormStatus state={state} />
      <fieldset disabled={pending}>
        <legend className="sr-only">Agenda baru</legend>

        <section className="editor-section" aria-labelledby="agenda-main">
          <div className="editor-section-heading">
            <span>01</span>
            <div>
              <h3 id="agenda-main">Informasi acara</h3>
              <p>Isi informasi yang perlu diketahui pengunjung. Waktu ditampilkan dalam WIB.</p>
            </div>
          </div>
          <div className="editor-form-grid">
            <label className="editor-span-2">
              Judul agenda
              <input autoFocus name="titleId" required />
            </label>
            <label className="editor-span-2">
              Deskripsi singkat
              <textarea name="descriptionId" required rows={3} />
            </label>
            <label>
              Mulai (WIB)
              <input name="startsAt" required type="datetime-local" />
            </label>
            <label>
              Selesai (WIB) <Optional />
              <input name="endsAt" type="datetime-local" />
            </label>
          </div>
        </section>

        <details className="editor-options">
          <summary>Lokasi & tautan <Optional /></summary>
          <div className="editor-form-grid">
            <label>
              Lokasi <Optional />
              <input name="locationLabelId" />
            </label>
            <label>
              Tautan sumber / registrasi <Optional />
              <input name="externalUrl" placeholder="https://" type="url" />
            </label>
          </div>
        </details>

        <details className="editor-options">
          <summary>Versi Inggris <Optional /></summary>
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
  ready,
  returnPath,
}: {
  ready: boolean;
  returnPath: string;
}) {
  const [state, action, pending] = useActionState(createPublicationAction, initialState);
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
    <form action={action} className="editor-form">
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
      <fieldset disabled={pending}>
        <legend className="sr-only">Publikasi baru</legend>

        <section className="editor-section" aria-labelledby="publication-main">
          <div className="editor-section-heading">
            <span>01</span>
            <div>
              <h3 id="publication-main">Karya</h3>
              <p>Masukkan judul publikasi saja—tanpa penulis, tahun, jurnal, atau URL.</p>
            </div>
          </div>
          <div className="editor-form-grid">
            <label className="editor-span-2">
              Judul asli publikasi
              <input
                autoFocus
                name="title"
                onChange={(event) => updatePreview("title", event.target.value)}
                required
              />
              <small>Gunakan redaksi asli sumber; jangan tempel seluruh sitasi.</small>
            </label>
            <label>
              Tahun
              <input
                min="1900"
                name="year"
                onChange={(event) => updatePreview("year", event.target.value)}
                required
                type="number"
              />
            </label>
            <label>
              Jenis publikasi
              <select
                name="type"
                onChange={(event) => updatePreview("type", event.target.value)}
              >
                <option value="BOOK">Buku</option>
                <option value="JOURNAL_ARTICLE">Artikel jurnal</option>
                <option value="BOOK_CHAPTER">Bab buku</option>
                <option value="ADDITIONAL_RESEARCH_OUTPUT">Output riset lain</option>
              </select>
            </label>
            <label>
              Status bibliografis
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
              Keterangan tanggal <Optional />
              <input name="dateLabel" placeholder="Contoh: Februari" />
            </label>
          </div>
        </section>

        <section className="editor-section" aria-labelledby="publication-contributors">
          <div className="editor-section-heading">
            <span>02</span>
            <div>
              <h3 id="publication-contributors">Kontributor</h3>
              <p>Satu nama per baris, dalam urutan yang sama dengan sumber.</p>
            </div>
          </div>
          <div className="editor-form-grid">
            <label className="editor-span-2">
              Penulis
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
                Editor buku induk <Optional />
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
              <h3 id="publication-bibliography">Detail terbitan</h3>
              <p>Pisahkan jurnal, buku induk, penerbit, nomor, dan halaman.</p>
            </div>
          </div>
          <div className="editor-form-grid">
            {preview.type !== "BOOK" ? (
              <label className="editor-span-2">
                Jurnal, seri, atau buku induk
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
              Penerbit {preview.type === "BOOK" ? null : <Optional />}
              <input
                name="publisher"
                onChange={(event) => updatePreview("publisher", event.target.value)}
                required={preview.type === "BOOK"}
              />
            </label>
            <label>
              Tempat terbit <Optional />
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
              Nomor seri <Optional />
              <input
                name="seriesNumber"
                onChange={(event) =>
                  updatePreview("seriesNumber", event.target.value)
                }
              />
            </label>
            <label>
              Halaman <Optional />
              <input
                name="pages"
                onChange={(event) => updatePreview("pages", event.target.value)}
                placeholder="127-141"
              />
            </label>
            <label>
              DOI <Optional />
              <input name="doi" placeholder="10.xxxx/..." />
              <small>Tanpa awalan https://doi.org/.</small>
            </label>
            <label>
              URL kanonis <Optional />
              <input name="externalUrl" placeholder="https://" type="url" />
            </label>
          </div>
        </section>

        <section className="editor-section" aria-labelledby="publication-source-media">
          <div className="editor-section-heading">
            <span>04</span>
            <div>
              <h3 id="publication-source-media">Sumber dan gambar</h3>
              <p>Simpan jejak sumber dan hanya gunakan gambar dengan hak yang jelas.</p>
            </div>
          </div>
          <div className="publication-cover-editor">
            <h4>Gambar publikasi <Optional /></h4>
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
                  Upload aktif setelah database siap.
                </div>
              )}
              <p role="status">
                {coverAsset
                  ? `Gambar siap disimpan: ${coverAsset.fileName}`
                  : "JPG, PNG, atau WebP maks. 4 MB. Placeholder bibliografis tampil jika dikosongkan."}
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
                  Catatan hak penggunaan
                  <input
                    name="coverRightsNote"
                    placeholder="Contoh: sampul resmi, disetujui untuk tampilan situs"
                    required
                  />
                  <small>
                    Jelaskan sumber dan izin penggunaan gambar sebelum draft disimpan.
                  </small>
                </label>
                <button
                  className="button button-secondary"
                  onClick={() => setCoverAsset(null)}
                  type="button"
                >
                  Hapus dari draft
                </button>
              </div>
            ) : null}
          </div>
          <div className="editor-form-grid">
            <label>
              Nama sumber <Optional />
              <input name="sourceName" placeholder="Input manual" />
            </label>
            <label>
              URL sumber <Optional />
              <input name="sourceUrl" placeholder="https://" type="url" />
            </label>
            <label className="editor-span-2">
              Catatan sumber <Optional />
              <textarea name="sourceNote" rows={3} />
            </label>
          </div>
        </section>

        <section className="publication-admin-preview" aria-labelledby="publication-preview-title">
          <div className="editor-section-heading">
            <span aria-hidden="true">↗</span>
            <div>
              <h3 id="publication-preview-title">Pratinjau card</h3>
              <p>Struktur ini mengikuti card pada indeks publikasi.</p>
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
                {typeNames[preview.type]} · {preview.year || "Tahun"} ·{" "}
                {preview.status}
              </small>
              <h4>{preview.title || "Judul publikasi"}</h4>
              <p>{previewAuthors || "Urutan penulis"}</p>
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
  ready,
  returnPath,
}: {
  ready: boolean;
  returnPath: string;
}) {
  const [state, action, pending] = useActionState(createMaterialAction, initialState);
  const [asset, setAsset] = useState<UploadedAsset | null>(null);
  const [delivery, setDelivery] = useState<"upload" | "link">("upload");

  return (
    <form action={action} className="editor-form">
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
      <fieldset disabled={pending}>
        <legend className="sr-only">Materi baru</legend>

        <section className="editor-section" aria-labelledby="material-main">
          <div className="editor-section-heading">
            <span>01</span>
            <div>
              <h3 id="material-main">Identitas materi</h3>
              <p>Gunakan judul yang mudah dikenali mahasiswa. Slug dibuat otomatis.</p>
            </div>
          </div>
          <div className="editor-form-grid">
            <label className="editor-span-2">
              Judul materi
              <input autoFocus name="titleId" required />
            </label>
            <label className="editor-span-2">
              Deskripsi singkat
              <textarea name="descriptionId" required rows={3} />
            </label>
            <label>
              Mata kuliah
              <input name="courseId" required />
            </label>
            <label>
              Jenis materi
              <select name="resourceType">
                <option value="SLIDE">Slide</option>
                <option value="READING">Bacaan</option>
                <option value="SYLLABUS">Silabus</option>
                <option value="ASSIGNMENT">Tugas</option>
                <option value="DATASET">Dataset</option>
                <option value="VIDEO">Video</option>
                <option value="LINK">Tautan</option>
                <option value="OTHER">Lainnya</option>
              </select>
            </label>
          </div>
        </section>

        <section className="editor-section" aria-labelledby="material-delivery">
          <div className="editor-section-heading">
            <span>02</span>
            <div>
              <h3 id="material-delivery">Cara membuka materi</h3>
              <p>Pilih satu tujuan agar tombol publik selalu dapat digunakan.</p>
            </div>
          </div>
          <div className="delivery-choice" role="radiogroup" aria-label="Cara membuka materi">
            <label className={delivery === "upload" ? "is-selected" : ""}>
              <input
                checked={delivery === "upload"}
                name="deliveryMode"
                onChange={() => setDelivery("upload")}
                type="radio"
                value="upload"
              />
              <span><strong>Unggah berkas</strong><small>PDF atau gambar</small></span>
            </label>
            <label className={delivery === "link" ? "is-selected" : ""}>
              <input
                checked={delivery === "link"}
                name="deliveryMode"
                onChange={() => setDelivery("link")}
                type="radio"
                value="link"
              />
              <span><strong>Tautan eksternal</strong><small>Video, laman, atau dokumen luar</small></span>
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
                <div className="admin-upload-disabled">Upload aktif setelah database siap.</div>
              )}
              <p role="status">
                {asset
                  ? `Siap disimpan: ${asset.fileName}`
                  : "PDF maks. 16 MB atau gambar maks. 4 MB."}
              </p>
            </div>
          ) : (
            <label className="delivery-url">
              Alamat materi
              <input name="externalUrl" placeholder="https://" required type="url" />
            </label>
          )}

          <label className="editor-check">
            <input name="downloadAllowed" type="checkbox" />
            <span>
              <strong>Izinkan unduhan</strong>
              <small>Aktifkan hanya jika hak distribusi berkas sudah jelas.</small>
            </span>
          </label>
        </section>

        <details className="editor-options">
          <summary>Metadata kelas <Optional /></summary>
          <div className="editor-form-grid">
            <label>
              Topik <Optional />
              <input name="topicId" />
            </label>
            <label>
              Semester <Optional />
              <input name="semester" placeholder="Ganjil" />
            </label>
            <label>
              Tahun akademik <Optional />
              <input name="academicYear" placeholder="2026/2027" />
            </label>
            <label>
              Catatan hak penggunaan <Optional />
              <input name="rightsNote" />
            </label>
          </div>
        </details>

        <details className="editor-options">
          <summary>Versi Inggris <Optional /></summary>
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
