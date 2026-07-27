"use client";

import { useActionState, useEffect, useRef, useState } from "react";

import {
  editorialTransitionAction,
  saveEditorialRecordAction,
  type EditorActionState,
} from "@/app/[locale]/admin/(workspace)/editor-actions";
import { PreviewLink } from "@/components/admin/preview-link";
import type { EditorialKind } from "@/lib/content/admin-records";
import type { PostBlock } from "@/lib/validation/content";
import { UploadDropzone } from "@/lib/uploadthing";

const initialState: EditorActionState = {};

function Optional() {
  return <span className="field-optional">Opsional</span>;
}

function Status({ state }: { state: EditorActionState }) {
  const ref = useRef<HTMLParagraphElement>(null);
  useEffect(() => {
    if (!state.message || state.ok) return;
    const form = ref.current?.closest("form");
    const firstField = form?.querySelector<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >("input:not([type='hidden']):not([disabled]), textarea:not([disabled]), select:not([disabled])");
    firstField?.focus();
  }, [state]);
  if (!state.message) return null;
  return <p className={`editor-form-status ${state.ok ? "is-success" : ""}`} ref={ref} role={state.ok ? "status" : "alert"}>{state.message}</p>;
}

function ActionBar({
  dirty,
  id,
  kind,
  locale,
  pending,
  published,
  savedAt,
  status,
}: {
  dirty: boolean;
  id: string;
  kind: Exclude<EditorialKind, "homepage">;
  locale: "id" | "en";
  pending: boolean;
  published: boolean;
  savedAt: Date;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
}) {
  return (
    <div className="editor-action-bar">
      <p>
        <strong>{dirty ? "Belum tersimpan" : "Draft tersimpan"}</strong>
        {dirty
          ? "Simpan draft sebelum preview atau menerbitkan."
          : <>Disimpan <time>{new Intl.DateTimeFormat(locale === "id" ? "id-ID" : "en-GB", { dateStyle: "medium", timeStyle: "short" }).format(savedAt)}</time>. Preview privat berlaku 15 menit.</>}
      </p>
      <div className="editor-action-group">
        <button className="button" disabled={pending} type="submit">
          {pending ? "Menyimpan…" : "Simpan draft"}
        </button>
        <PreviewLink
          href={`/${locale}/admin/preview/${kind}/${id}`}
          label="Preview"
        />
        {status !== "ARCHIVED" ? (
          <button
            className="button button-primary"
            disabled={dirty || pending}
            formAction={editorialTransitionAction.bind(
              null,
              `${id}:publish`,
            )}
            type="submit"
          >
            {published ? "Terbitkan perubahan" : "Terbitkan"}
          </button>
        ) : null}
      </div>
    </div>
  );
}

function BlockEditor({
  label,
  value,
  onChange,
}: {
  label: string;
  value: PostBlock[];
  onChange: (blocks: PostBlock[]) => void;
}) {
  const add = () => onChange([...value, { type: "paragraph", text: "" }]);
  const update = (index: number, patch: Record<string, unknown>) =>
    onChange(value.map((block, blockIndex) => blockIndex === index ? ({ ...block, ...patch } as PostBlock) : block));
  const move = (index: number, direction: -1 | 1) => {
    const nextIndex = index + direction;
    if (nextIndex < 0 || nextIndex >= value.length) return;
    const next = [...value];
    [next[index], next[nextIndex]] = [next[nextIndex], next[index]];
    onChange(next);
  };

  return (
    <div className="block-editor">
      <div className="block-editor-heading"><h3>{label}</h3><button type="button" onClick={add}>Tambah blok</button></div>
      {value.map((block, index) => (
        <fieldset key={index}>
          <legend>Blok {index + 1}</legend>
          <label>Jenis
            <select
              value={block.type}
              onChange={(event) => {
                const type = event.target.value as PostBlock["type"];
                const blank: PostBlock =
                  type === "heading" ? { type, level: 2, text: "" } :
                  type === "quote" ? { type, text: "", citation: "" } :
                  type === "link" ? { type, label: "", url: "https://" } :
                  type === "image" ? { type, url: "https://", alt: "", rightsNote: "" } :
                  type === "file" ? { type, label: "", url: "https://" } :
                  type === "video" ? { type, title: "", url: "https://" } :
                  { type: "paragraph", text: "" };
                onChange(value.map((item, itemIndex) => itemIndex === index ? blank : item));
              }}
            >
              <option value="paragraph">Paragraf</option><option value="heading">Heading</option>
              <option value="quote">Kutipan</option><option value="link">Tautan</option>
              <option value="image">Gambar</option><option value="file">Berkas</option>
              <option value="video">Video</option>
            </select>
          </label>
          {"text" in block ? <label>Isi<textarea value={block.text} onChange={(event) => update(index, { text: event.target.value })} /></label> : null}
          {"url" in block ? <label>URL<input type="url" value={block.url} onChange={(event) => update(index, { url: event.target.value })} /></label> : null}
          {"label" in block ? <label>Label<input value={block.label} onChange={(event) => update(index, { label: event.target.value })} /></label> : null}
          {"title" in block ? <label>Judul<input value={block.title} onChange={(event) => update(index, { title: event.target.value })} /></label> : null}
          {"alt" in block ? <label>Alt text<input value={block.alt} onChange={(event) => update(index, { alt: event.target.value })} /></label> : null}
          {"rightsNote" in block ? <label>Catatan hak<input value={block.rightsNote} onChange={(event) => update(index, { rightsNote: event.target.value })} /></label> : null}
          {"citation" in block ? <label>Sumber kutipan<input value={block.citation ?? ""} onChange={(event) => update(index, { citation: event.target.value })} /></label> : null}
          <div className="block-actions">
            <button disabled={index === 0} type="button" onClick={() => move(index, -1)}>Naik</button>
            <button disabled={index === value.length - 1} type="button" onClick={() => move(index, 1)}>Turun</button>
            <button type="button" onClick={() => onChange([...value.slice(0, index + 1), block, ...value.slice(index + 1)])}>Duplikasi</button>
            <button type="button" onClick={() => onChange(value.filter((_, itemIndex) => itemIndex !== index))}>Hapus blok</button>
          </div>
        </fieldset>
      ))}
    </div>
  );
}

export function RecordEditor({
  kind,
  locale,
  record,
}: {
  kind: Exclude<EditorialKind, "homepage">;
  locale: "id" | "en";
  // Prisma records are reduced to editorial fields by the server-only loader.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  record: Record<string, any>;
}) {
  const [state, action, pending] = useActionState(saveEditorialRecordAction, initialState);
  const [contentId, setContentId] = useState<PostBlock[]>(record.contentId ?? []);
  const [contentEn, setContentEn] = useState<PostBlock[]>(record.contentEn ?? []);
  const [dirty, setDirty] = useState(false);
  const [replacementAsset, setReplacementAsset] = useState<{
    storageKey: string;
    url: string;
    fileName: string;
    mimeType: string;
    size: number;
  } | null>(null);
  useEffect(() => {
    const warn = (event: BeforeUnloadEvent) => {
      if (!dirty) return;
      event.preventDefault();
    };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  return (
    <form action={action} className="editor-form record-editor" onChange={() => setDirty(true)} onSubmit={() => setDirty(false)}>
      <input name="kind" type="hidden" value={kind} />
      <input name="id" type="hidden" value={record.id} />
      <input name="locale" type="hidden" value={locale} />
      <Status state={state} />
      {dirty ? <p className="unsaved-indicator" role="status">Ada perubahan yang belum disimpan.</p> : null}

      {kind === "post" ? (
        <>
          <input name="contentId" type="hidden" value={JSON.stringify(contentId)} />
          <input name="contentEn" type="hidden" value={JSON.stringify(contentEn)} />
          <section className="editor-section"><div className="editor-form-grid">
            <label className="editor-span-2">Judul Indonesia<input autoFocus defaultValue={record.titleId} name="titleId" /></label>
            <label>Slug Indonesia<input defaultValue={record.slugId} name="slugId" /></label>
            <label>Slug English <Optional /><input defaultValue={record.slugEn} name="slugEn" /></label>
            <label className="editor-span-2">English title <Optional /><input defaultValue={record.titleEn} name="titleEn" /></label>
            <label className="editor-span-2">Ringkasan Indonesia<textarea defaultValue={record.excerptId} name="excerptId" /></label>
            <label className="editor-span-2">English summary <Optional /><textarea defaultValue={record.excerptEn} name="excerptEn" /></label>
            <label>Topik<input defaultValue={record.topics.join(", ")} name="topics" /></label>
            <label>URL sampul<input defaultValue={record.coverImage} name="coverImage" type="url" /></label>
            <label className="editor-span-2">Sumber kanonis<input defaultValue={record.canonicalExternal} name="canonicalExternal" type="url" /></label>
            <label className="editor-check"><input defaultChecked={record.pinned} name="pinned" type="checkbox" />Tandai sebagai tulisan pilihan</label>
          </div></section>
          <BlockEditor label="Naskah Indonesia" value={contentId} onChange={setContentId} />
          <BlockEditor label="English article · opsional" value={contentEn} onChange={setContentEn} />
        </>
      ) : null}

      {kind === "agenda" ? (
        <section className="editor-section"><div className="editor-form-grid">
          <label className="editor-span-2">Judul Indonesia<input autoFocus defaultValue={record.titleId} name="titleId" /></label>
          <label className="editor-span-2">English title <Optional /><input defaultValue={record.titleEn} name="titleEn" /></label>
          <label>Slug Indonesia<input defaultValue={record.slugId} name="slugId" /></label>
          <label>Slug English <Optional /><input defaultValue={record.slugEn} name="slugEn" /></label>
          <label className="editor-span-2">Deskripsi Indonesia<textarea defaultValue={record.descriptionId} name="descriptionId" /></label>
          <label className="editor-span-2">English description <Optional /><textarea defaultValue={record.descriptionEn} name="descriptionEn" /></label>
          <label>Mulai WIB<input defaultValue={record.startsAt} name="startsAt" type="datetime-local" /></label>
          <label>Selesai WIB<input defaultValue={record.endsAt} name="endsAt" type="datetime-local" /></label>
          <label>Lokasi Indonesia<input defaultValue={record.locationLabelId} name="locationLabelId" /></label>
          <label>English location <Optional /><input defaultValue={record.locationLabelEn} name="locationLabelEn" /></label>
          <label className="editor-span-2">Tautan sumber<input defaultValue={record.externalUrl} name="externalUrl" type="url" /></label>
        </div></section>
      ) : null}

      {kind === "material" ? (
        <section className="editor-section"><div className="editor-form-grid">
          {replacementAsset ? <>
            <input name="storageKey" type="hidden" value={replacementAsset.storageKey} />
            <input name="assetUrl" type="hidden" value={replacementAsset.url} />
            <input name="fileName" type="hidden" value={replacementAsset.fileName} />
            <input name="mimeType" type="hidden" value={replacementAsset.mimeType} />
            <input name="fileSize" type="hidden" value={replacementAsset.size} />
          </> : null}
          <label className="editor-span-2">Judul Indonesia<input autoFocus defaultValue={record.titleId} name="titleId" /></label>
          <label className="editor-span-2">English title <Optional /><input defaultValue={record.titleEn} name="titleEn" /></label>
          <label>Slug Indonesia<input defaultValue={record.slugId} name="slugId" /></label>
          <label>Slug English <Optional /><input defaultValue={record.slugEn} name="slugEn" /></label>
          <label className="editor-span-2">Deskripsi Indonesia<textarea defaultValue={record.descriptionId} name="descriptionId" /></label>
          <label className="editor-span-2">English description <Optional /><textarea defaultValue={record.descriptionEn} name="descriptionEn" /></label>
          <label>Mata kuliah<input defaultValue={record.courseId} name="courseId" /></label>
          <label>Course name <Optional /><input defaultValue={record.courseEn} name="courseEn" /></label>
          <label>Topik<input defaultValue={record.topicId} name="topicId" /></label>
          <label>English topic <Optional /><input defaultValue={record.topicEn} name="topicEn" /></label>
          <label>Jenis<select defaultValue={record.resourceType} name="resourceType">{["SLIDE","READING","SYLLABUS","ASSIGNMENT","DATASET","VIDEO","LINK","OTHER"].map((item) => <option key={item}>{item}</option>)}</select></label>
          <label>Semester<input defaultValue={record.semester} name="semester" /></label>
          <label>Tahun akademik<input defaultValue={record.academicYear} name="academicYear" /></label>
          <label>ID aset aktif<input value={replacementAsset ? "" : record.assetId} name="assetId" readOnly /></label>
          <label className="editor-span-2">Tautan eksternal<input defaultValue={record.externalUrl} name="externalUrl" type="url" /></label>
          <label>Tag Indonesia<input defaultValue={record.tagsId.join(", ")} name="tagsId" /></label>
          <label>English tags <Optional /><input defaultValue={record.tagsEn.join(", ")} name="tagsEn" /></label>
          <label className="editor-check"><input defaultChecked={record.downloadAllowed} name="downloadAllowed" type="checkbox" />Izinkan unduh</label>
          <label className="editor-check"><input defaultChecked={record.pinned} name="pinned" type="checkbox" />Pin di awal koleksi</label>
          <div className="admin-upload-zone editor-span-2">
            <strong>Ganti berkas</strong>
            <UploadDropzone
              endpoint="academicAsset"
              onClientUploadComplete={(files) => {
                const file = files[0];
                if (!file) return;
                setReplacementAsset({
                  storageKey: file.key,
                  url: file.ufsUrl,
                  fileName: file.name,
                  mimeType: file.type,
                  size: file.size,
                });
                setDirty(true);
              }}
              onUploadError={() => setReplacementAsset(null)}
            />
            <p role="status">{replacementAsset ? `Berkas pengganti siap: ${replacementAsset.fileName}` : "Berkas lama tetap dipakai sampai penggantian disimpan dan diterbitkan."}</p>
            {replacementAsset ? <label>Catatan hak penggunaan<input name="rightsNote" required /></label> : null}
          </div>
        </div></section>
      ) : null}

      {kind === "publication" ? (
        <section className="editor-section"><div className="editor-form-grid">
          <label className="editor-span-2">Judul<input autoFocus defaultValue={record.title} name="title" /></label>
          <label>Jenis<select defaultValue={record.type} name="type">{["BOOK","JOURNAL_ARTICLE","BOOK_CHAPTER","ADDITIONAL_RESEARCH_OUTPUT"].map((item) => <option key={item}>{item}</option>)}</select></label>
          <label>Tahun<input defaultValue={record.year} name="year" type="number" /></label>
          <label className="editor-span-2">Penulis<textarea defaultValue={record.authors.join("\n")} name="authors" /></label>
          <label className="editor-span-2">Editor<textarea defaultValue={record.editors.join("\n")} name="editors" /></label>
          <label>Status bibliografis<select defaultValue={record.status} name="status">{["PUBLISHED","FORTHCOMING","PREPRINT","ERRATUM","REVIEW"].map((item) => <option key={item}>{item}</option>)}</select></label>
          <label>Label tanggal<input defaultValue={record.dateLabel} name="dateLabel" /></label>
          <label className="editor-span-2">Jurnal / buku induk<input defaultValue={record.containerTitle} name="containerTitle" /></label>
          <label>Penerbit<input defaultValue={record.publisher} name="publisher" /></label>
          <label>Tempat terbit<input defaultValue={record.publicationPlace} name="publicationPlace" /></label>
          <label>Volume<input defaultValue={record.volume} name="volume" /></label>
          <label>Issue<input defaultValue={record.issue} name="issue" /></label>
          <label>Nomor seri<input defaultValue={record.seriesNumber} name="seriesNumber" /></label>
          <label>Halaman<input defaultValue={record.pages} name="pages" /></label>
          <label>DOI<input defaultValue={record.doi} name="doi" /></label>
          <label>Tautan publik<input defaultValue={record.externalUrl} name="externalUrl" type="url" /></label>
          <label className="editor-span-2">URL cover<input defaultValue={record.coverImage} name="coverImage" type="url" /></label>
          <label className="editor-span-2">Catatan hak cover<input defaultValue={record.coverRightsNote} name="coverRightsNote" /></label>
          <label>Nama sumber<input defaultValue={record.sourceName} name="sourceName" /></label>
          <label>URL sumber<input defaultValue={record.sourceUrl} name="sourceUrl" type="url" /></label>
          <label className="editor-span-2">Catatan sumber<textarea defaultValue={record.sourceNote} name="sourceNote" /></label>
        </div></section>
      ) : null}

      <ActionBar
        dirty={dirty}
        id={record.id}
        kind={kind}
        locale={locale}
        pending={pending}
        published={
          (kind === "publication" ? record.contentStatus : record.status) ===
          "PUBLISHED"
        }
        savedAt={
          state.savedAt ? new Date(state.savedAt) : new Date(record.updatedAt)
        }
        status={
          kind === "publication" ? record.contentStatus : record.status
        }
      />
    </form>
  );
}
