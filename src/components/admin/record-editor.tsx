"use client";

import { useActionState, useEffect, useRef, useState } from "react";

import {
  editorialTransitionAction,
  saveEditorialRecordAction,
  type EditorActionState,
} from "@/app/[locale]/admin/(workspace)/editor-actions";
import { useEditorRecovery } from "@/components/admin/editor-recovery";
import { PreviewLink } from "@/components/admin/preview-link";
import { getAdminQolCopy, adminText } from "@/data/admin-qol";
import type { EditorialKind } from "@/lib/content/admin-records";
import type { PostBlock } from "@/lib/validation/content";
import { UploadDropzone } from "@/lib/uploadthing";

const initialState: EditorActionState = {};

function Optional({ locale }: { locale: "id" | "en" }) {
  return <span className="field-optional">{adminText(locale, "Opsional", "Optional")}</span>;
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

function ErrorSummary({
  locale,
  state,
}: {
  locale: "id" | "en";
  state: EditorActionState;
}) {
  const entries = Object.entries(state.fieldErrors ?? {}).flatMap(
    ([field, messages]) => (messages ?? []).map((message) => ({ field, message })),
  );
  if (!entries.length) return null;
  return (
    <section className="editor-error-summary" role="alert" tabIndex={-1}>
      <strong>{getAdminQolCopy(locale).editor.errorTitle}</strong>
      <ul>
        {entries.map((entry, index) => (
          <li key={`${entry.field}-${index}`}>
            <button
              onClick={() => {
                document.querySelector<HTMLElement>(`[name="${CSS.escape(entry.field)}"]`)?.focus();
              }}
              type="button"
            >
              {entry.message}
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}

function EditorReadinessRail({
  form,
  kind,
  locale,
  revision,
}: {
  form: HTMLFormElement | null;
  kind: Exclude<EditorialKind, "homepage">;
  locale: "id" | "en";
  revision: number;
}) {
  void revision;
  const value = (name: string) => {
    const field = form?.elements.namedItem(name);
    return field && "value" in field ? String(field.value).trim() : "";
  };
  const items: Array<[boolean, string]> =
    kind === "post"
      ? [
          [Boolean(value("titleId")), adminText(locale, "Judul Indonesia", "Indonesian title")],
          [Boolean(value("contentId") && value("contentId") !== "[]"), adminText(locale, "Naskah utama", "Main article")],
          [Boolean(value("excerptId")), adminText(locale, "Ringkasan publikasi", "Publishing summary")],
        ]
      : kind === "agenda"
        ? [
            [Boolean(value("titleId")), adminText(locale, "Judul agenda", "Agenda title")],
            [value("descriptionId").length >= 20, adminText(locale, "Deskripsi", "Description")],
            [Boolean(value("startsAt")), adminText(locale, "Waktu mulai WIB", "WIB start time")],
            [!value("endsAt") || value("endsAt") > value("startsAt"), adminText(locale, "Urutan waktu valid", "Valid time order")],
          ]
        : kind === "material"
          ? [
              [Boolean(value("titleId")), adminText(locale, "Judul materi", "Material title")],
              [value("descriptionId").length >= 20, adminText(locale, "Deskripsi", "Description")],
              [Boolean(value("courseId")), adminText(locale, "Mata kuliah", "Course")],
              [Number(Boolean(value("assetId") || value("storageKey"))) + Number(Boolean(value("externalUrl"))) === 1, adminText(locale, "Satu tujuan materi", "One delivery target")],
              [!value("storageKey") || Boolean(value("rightsNote")), adminText(locale, "Hak penggunaan berkas", "File rights")],
            ]
          : [
              [Boolean(value("title")), adminText(locale, "Judul publikasi", "Publication title")],
              [Boolean(value("authors")), adminText(locale, "Penulis", "Authors")],
              [Boolean(value("year")), adminText(locale, "Tahun", "Year")],
              [Boolean(value("sourceName")), adminText(locale, "Sumber data", "Data source")],
              [Boolean(value("doi") || value("externalUrl") || value("sourceUrl")), adminText(locale, "Tautan publik", "Public link")],
              [!value("coverImage") || Boolean(value("coverRightsNote")), adminText(locale, "Hak gambar", "Image rights")],
            ];
  const complete = items.filter(([ready]) => ready).length;
  const copy = getAdminQolCopy(locale).editor;
  return (
    <aside className="editor-readiness-rail" aria-label={copy.readiness}>
      <p className="eyebrow">{copy.readiness}</p>
      <strong>{complete === items.length ? copy.ready : copy.notReady}</strong>
      <span>{complete}/{items.length}</span>
      <ul>
        {items.map(([ready, label]) => (
          <li className={ready ? "is-ready" : ""} key={label}>
            <span aria-hidden="true">{ready ? "✓" : "○"}</span>
            {label}
          </li>
        ))}
      </ul>
    </aside>
  );
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
  const copy = getAdminQolCopy(locale);
  return (
    <div className="editor-action-bar">
      <p>
        <strong>{dirty ? copy.editor.unsaved : copy.editor.saved}</strong>
        {dirty
          ? copy.editor.saveBeforePreview
          : <>{adminText(locale, "Disimpan", "Saved")} <time>{new Intl.DateTimeFormat(locale === "id" ? "id-ID" : "en-GB", { dateStyle: "medium", timeStyle: "short" }).format(savedAt)}</time>. {adminText(locale, "Preview privat berlaku 15 menit.", "Private previews remain valid for 15 minutes.")}</>}
      </p>
      <div className="editor-action-group">
        <button className="button" disabled={pending} type="submit">
          {pending ? copy.common.saving : copy.common.save}
        </button>
        <PreviewLink
          disabled={dirty || pending}
          href={`/${locale}/admin/preview/${kind}/${id}`}
          label={copy.common.preview}
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
            {published ? copy.common.publishChanges : copy.common.publish}
          </button>
        ) : null}
      </div>
    </div>
  );
}

function BlockEditor({
  label,
  locale,
  value,
  onChange,
}: {
  label: string;
  locale: "id" | "en";
  value: PostBlock[];
  onChange: (blocks: PostBlock[]) => void;
}) {
  const [collapsed, setCollapsed] = useState<Set<number>>(new Set());
  const textFor = (id: string, en: string) => adminText(locale, id, en);
  const add = () => onChange([...value, { type: "paragraph", text: "" }]);
  const insertAfter = (index: number) =>
    onChange([
      ...value.slice(0, index + 1),
      { type: "paragraph", text: "" },
      ...value.slice(index + 1),
    ]);
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
      <div className="block-editor-heading"><h3>{label}</h3><button type="button" onClick={add}>{textFor("Tambah blok", "Add block")}</button></div>
      {value.map((block, index) => (
        <fieldset key={index}>
          <legend>{textFor("Blok", "Block")} {index + 1}</legend>
          <button
            aria-expanded={!collapsed.has(index)}
            className="block-collapse"
            onClick={() => {
              const next = new Set(collapsed);
              if (next.has(index)) next.delete(index);
              else next.add(index);
              setCollapsed(next);
            }}
            type="button"
          >
            {collapsed.has(index)
              ? textFor("Buka blok", "Expand block")
              : textFor("Ringkas blok", "Collapse block")}
          </button>
          {!collapsed.has(index) ? <>
          <label>{textFor("Jenis", "Type")}
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
              <option value="paragraph">{textFor("Paragraf", "Paragraph")}</option><option value="heading">Heading</option>
              <option value="quote">{textFor("Kutipan", "Quote")}</option><option value="link">{textFor("Tautan", "Link")}</option>
              <option value="image">{textFor("Gambar", "Image")}</option><option value="file">{textFor("Berkas", "File")}</option>
              <option value="video">Video</option>
            </select>
          </label>
          {"text" in block ? <label>{textFor("Isi", "Content")}<textarea value={block.text} onChange={(event) => update(index, { text: event.target.value })} /></label> : null}
          {"url" in block ? <label>URL<input type="url" value={block.url} onChange={(event) => update(index, { url: event.target.value })} /></label> : null}
          {"label" in block ? <label>Label<input value={block.label} onChange={(event) => update(index, { label: event.target.value })} /></label> : null}
          {"title" in block ? <label>{textFor("Judul", "Title")}<input value={block.title} onChange={(event) => update(index, { title: event.target.value })} /></label> : null}
          {"alt" in block ? <label>Alt text<input value={block.alt} onChange={(event) => update(index, { alt: event.target.value })} /></label> : null}
          {"rightsNote" in block ? <label>{textFor("Catatan hak", "Rights note")}<input value={block.rightsNote} onChange={(event) => update(index, { rightsNote: event.target.value })} /></label> : null}
          {"citation" in block ? <label>{textFor("Sumber kutipan", "Quotation source")}<input value={block.citation ?? ""} onChange={(event) => update(index, { citation: event.target.value })} /></label> : null}
          </> : null}
          <div className="block-actions">
            <button disabled={index === 0} type="button" onClick={() => move(index, -1)}>{textFor("Naik", "Move up")}</button>
            <button disabled={index === value.length - 1} type="button" onClick={() => move(index, 1)}>{textFor("Turun", "Move down")}</button>
            <button type="button" onClick={() => insertAfter(index)}>{textFor("Sisipkan setelah", "Insert after")}</button>
            <button type="button" onClick={() => onChange([...value.slice(0, index + 1), block, ...value.slice(index + 1)])}>{textFor("Duplikasi", "Duplicate")}</button>
            <button
              type="button"
              onClick={() => {
                const containsContent = Object.values(block).some(
                  (item) => typeof item === "string" && item.trim() && item !== block.type,
                );
                if (containsContent && !window.confirm(textFor("Hapus blok yang sudah berisi konten?", "Delete this block and its content?"))) return;
                onChange(value.filter((_, itemIndex) => itemIndex !== index));
              }}
            >
              {textFor("Hapus blok", "Delete block")}
            </button>
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
  userId,
}: {
  kind: Exclude<EditorialKind, "homepage">;
  locale: "id" | "en";
  userId: string;
  // Prisma records are reduced to editorial fields by the server-only loader.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  record: Record<string, any>;
}) {
  const [state, action, pending] = useActionState(saveEditorialRecordAction, initialState);
  const [contentId, setContentId] = useState<PostBlock[]>(record.contentId ?? []);
  const [contentEn, setContentEn] = useState<PostBlock[]>(record.contentEn ?? []);
  const [dirty, setDirty] = useState(false);
  const [formRevision, setFormRevision] = useState(0);
  const [draftVersion, setDraftVersion] = useState(record.draftVersion ?? 1);
  const [formNode, setFormNode] = useState<HTMLFormElement | null>(null);
  const [replacementAsset, setReplacementAsset] = useState<{
    storageKey: string;
    url: string;
    fileName: string;
    mimeType: string;
    size: number;
  } | null>(null);
  const copy = getAdminQolCopy(locale);
  const { clear: clearRecovery, notice: recoveryNotice } = useEditorRecovery({
    baseDraftVersion: draftVersion,
    form: formNode,
    kind,
    locale,
    recordId: record.id,
    serverUpdatedAt: new Date(record.updatedAt).getTime(),
    userId,
    onRestore: (value) => {
      const restoredId = value.fields.contentId;
      const restoredEn = value.fields.contentEn;
      if (typeof restoredId === "string") {
        try { setContentId(JSON.parse(restoredId) as PostBlock[]); } catch { /* keep current blocks */ }
      }
      if (typeof restoredEn === "string") {
        try { setContentEn(JSON.parse(restoredEn) as PostBlock[]); } catch { /* keep current blocks */ }
      }
      setDirty(true);
    },
  });
  useEffect(() => {
    const warn = (event: BeforeUnloadEvent) => {
      if (!dirty) return;
      event.preventDefault();
    };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);
  useEffect(() => {
    if (!state.ok) return;
    const timer = window.setTimeout(() => {
      setDirty(false);
      if (state.draftVersion) setDraftVersion(state.draftVersion);
      void clearRecovery();
    }, 0);
    return () => window.clearTimeout(timer);
  }, [clearRecovery, state.draftVersion, state.ok]);
  useEffect(() => {
    const intercept = (event: MouseEvent) => {
      if (!dirty) return;
      const link = (event.target as HTMLElement).closest("a");
      if (!link || link.target === "_blank" || link.origin !== window.location.origin) return;
      if (!window.confirm(copy.editor.leaveWarning)) {
        event.preventDefault();
        event.stopPropagation();
      }
    };
    document.addEventListener("click", intercept, true);
    return () => document.removeEventListener("click", intercept, true);
  }, [copy.editor.leaveWarning, dirty]);

  return (
    <form
      action={action}
      className="editor-form record-editor"
      onChange={() => {
        setDirty(true);
        setFormRevision((value) => value + 1);
      }}
      onKeyDown={(event) => {
        if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "s") {
          event.preventDefault();
          event.currentTarget.requestSubmit();
        }
      }}
      ref={setFormNode}
    >
      <input name="kind" type="hidden" value={kind} />
      <input name="id" type="hidden" value={record.id} />
      <input name="locale" type="hidden" value={locale} />
      <input name="expectedDraftVersion" type="hidden" value={draftVersion} />
      <Status state={state} />
      <ErrorSummary locale={locale} state={state} />
      {recoveryNotice}
      {state.conflict ? (
        <section className="editor-conflict-notice" role="alert">
          <div>
            <strong>{copy.editor.conflictTitle}</strong>
            <p>{copy.editor.conflictBody}</p>
            <small>
              {state.conflict.editorName} · {new Intl.DateTimeFormat(locale === "id" ? "id-ID" : "en-GB", {
                dateStyle: "medium",
                timeStyle: "short",
              }).format(new Date(state.conflict.updatedAt))}
            </small>
          </div>
          <button className="button button-secondary" onClick={() => window.location.reload()} type="button">
            {copy.editor.reloadLatest}
          </button>
        </section>
      ) : null}
      {dirty ? <p className="unsaved-indicator" role="status">{copy.editor.unsaved}</p> : null}
      {record.publishedSnapshot && (kind === "post" || kind === "material") ? (
        <p className="editor-context-note">{copy.editor.slugWarning}</p>
      ) : null}

      <div className="record-editor-layout">
        <div className="record-editor-canvas">

      {kind === "post" ? (
        <>
          <input name="contentId" type="hidden" value={JSON.stringify(contentId)} />
          <input name="contentEn" type="hidden" value={JSON.stringify(contentEn)} />
          <section className="editor-section"><div className="editor-form-grid">
            <label className="editor-span-2">{adminText(locale, "Judul Indonesia", "Indonesian title")}<input autoFocus defaultValue={record.titleId} name="titleId" /></label>
            <label>{adminText(locale, "Slug Indonesia", "Indonesian slug")}<input defaultValue={record.slugId} name="slugId" /></label>
            <label>Slug English <Optional locale={locale} /><input defaultValue={record.slugEn} name="slugEn" /></label>
            <label className="editor-span-2">English title <Optional locale={locale} /><input defaultValue={record.titleEn} name="titleEn" /></label>
            <label className="editor-span-2">{adminText(locale, "Ringkasan Indonesia", "Indonesian summary")}<textarea defaultValue={record.excerptId} name="excerptId" /></label>
            <label className="editor-span-2">English summary <Optional locale={locale} /><textarea defaultValue={record.excerptEn} name="excerptEn" /></label>
            <label>{adminText(locale, "Topik", "Topics")}<input defaultValue={record.topics.join(", ")} name="topics" /></label>
            <label>{adminText(locale, "URL sampul", "Cover URL")}<input defaultValue={record.coverImage} name="coverImage" type="url" /></label>
            <label className="editor-span-2">{adminText(locale, "Sumber kanonis", "Canonical source")}<input defaultValue={record.canonicalExternal} name="canonicalExternal" type="url" /></label>
            <label className="editor-check"><input defaultChecked={record.pinned} name="pinned" type="checkbox" />{adminText(locale, "Tandai sebagai tulisan pilihan", "Mark as featured writing")}</label>
          </div></section>
          <BlockEditor label={adminText(locale, "Naskah Indonesia", "Indonesian article")} locale={locale} value={contentId} onChange={setContentId} />
          <BlockEditor label={adminText(locale, "Artikel English · opsional", "English article · optional")} locale={locale} value={contentEn} onChange={setContentEn} />
        </>
      ) : null}

      {kind === "agenda" ? (
        <section className="editor-section"><div className="editor-form-grid">
          <label className="editor-span-2">{adminText(locale, "Judul Indonesia", "Indonesian title")}<input autoFocus defaultValue={record.titleId} name="titleId" /></label>
          <label className="editor-span-2">English title <Optional locale={locale} /><input defaultValue={record.titleEn} name="titleEn" /></label>
          <label>{adminText(locale, "Slug Indonesia", "Indonesian slug")}<input defaultValue={record.slugId} name="slugId" /></label>
          <label>Slug English <Optional locale={locale} /><input defaultValue={record.slugEn} name="slugEn" /></label>
          <label className="editor-span-2">{adminText(locale, "Deskripsi Indonesia", "Indonesian description")}<textarea defaultValue={record.descriptionId} name="descriptionId" /></label>
          <label className="editor-span-2">English description <Optional locale={locale} /><textarea defaultValue={record.descriptionEn} name="descriptionEn" /></label>
          <label>{adminText(locale, "Mulai WIB", "Starts (WIB)")}<input defaultValue={record.startsAt} name="startsAt" type="datetime-local" /></label>
          <label>{adminText(locale, "Selesai WIB", "Ends (WIB)")}<input defaultValue={record.endsAt} name="endsAt" type="datetime-local" /></label>
          <label>{adminText(locale, "Lokasi Indonesia", "Indonesian location")}<input defaultValue={record.locationLabelId} name="locationLabelId" /></label>
          <label>English location <Optional locale={locale} /><input defaultValue={record.locationLabelEn} name="locationLabelEn" /></label>
          <label className="editor-span-2">{adminText(locale, "Tautan sumber", "Source link")}<input defaultValue={record.externalUrl} name="externalUrl" type="url" /></label>
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
          <label className="editor-span-2">{adminText(locale, "Judul Indonesia", "Indonesian title")}<input autoFocus defaultValue={record.titleId} name="titleId" /></label>
          <label className="editor-span-2">English title <Optional locale={locale} /><input defaultValue={record.titleEn} name="titleEn" /></label>
          <label>{adminText(locale, "Slug Indonesia", "Indonesian slug")}<input defaultValue={record.slugId} name="slugId" /></label>
          <label>Slug English <Optional locale={locale} /><input defaultValue={record.slugEn} name="slugEn" /></label>
          <label className="editor-span-2">{adminText(locale, "Deskripsi Indonesia", "Indonesian description")}<textarea defaultValue={record.descriptionId} name="descriptionId" /></label>
          <label className="editor-span-2">English description <Optional locale={locale} /><textarea defaultValue={record.descriptionEn} name="descriptionEn" /></label>
          <label>{adminText(locale, "Mata kuliah", "Course")}<input defaultValue={record.courseId} name="courseId" /></label>
          <label>Course name <Optional locale={locale} /><input defaultValue={record.courseEn} name="courseEn" /></label>
          <label>{adminText(locale, "Topik", "Topic")}<input defaultValue={record.topicId} name="topicId" /></label>
          <label>English topic <Optional locale={locale} /><input defaultValue={record.topicEn} name="topicEn" /></label>
          <label>{adminText(locale, "Jenis", "Type")}<select defaultValue={record.resourceType} name="resourceType">{["SLIDE","READING","SYLLABUS","ASSIGNMENT","DATASET","VIDEO","LINK","OTHER"].map((item) => <option key={item}>{item}</option>)}</select></label>
          <label>Semester<input defaultValue={record.semester} name="semester" /></label>
          <label>{adminText(locale, "Tahun akademik", "Academic year")}<input defaultValue={record.academicYear} name="academicYear" /></label>
          <label>{adminText(locale, "ID aset aktif", "Active asset ID")}<input value={replacementAsset ? "" : record.assetId} name="assetId" readOnly /></label>
          <label className="editor-span-2">{adminText(locale, "Tautan eksternal", "External link")}<input defaultValue={record.externalUrl} name="externalUrl" type="url" /></label>
          <label>{adminText(locale, "Tag Indonesia", "Indonesian tags")}<input defaultValue={record.tagsId.join(", ")} name="tagsId" /></label>
          <label>English tags <Optional locale={locale} /><input defaultValue={record.tagsEn.join(", ")} name="tagsEn" /></label>
          <label className="editor-check"><input defaultChecked={record.downloadAllowed} name="downloadAllowed" type="checkbox" />{adminText(locale, "Izinkan unduh", "Allow download")}</label>
          <label className="editor-check"><input defaultChecked={record.pinned} name="pinned" type="checkbox" />{adminText(locale, "Pin di awal koleksi", "Pin to the top of the collection")}</label>
          <div className="admin-upload-zone editor-span-2">
            <strong>{adminText(locale, "Ganti berkas", "Replace file")}</strong>
            {record.asset ? (
              <p className="active-asset">
                <strong>{record.asset.fileName}</strong>
                <span>{record.asset.mimeType} · {Math.ceil(record.asset.size / 1024)} KB</span>
              </p>
            ) : null}
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
            <p role="status">{replacementAsset
              ? adminText(locale, `Berkas pengganti siap: ${replacementAsset.fileName}`, `Replacement ready: ${replacementAsset.fileName}`)
              : adminText(locale, "Berkas lama tetap dipakai sampai penggantian disimpan dan diterbitkan.", "The current file remains active until the replacement is saved and published.")}</p>
            {replacementAsset ? (
              <button className="button button-secondary" onClick={() => setReplacementAsset(null)} type="button">
                {adminText(locale, "Batalkan penggantian", "Cancel replacement")}
              </button>
            ) : null}
            {replacementAsset ? <label>{adminText(locale, "Catatan hak penggunaan", "Usage rights note")}<input name="rightsNote" required /></label> : null}
          </div>
        </div></section>
      ) : null}

      {kind === "publication" ? (
        <section className="editor-section"><div className="editor-form-grid">
          {replacementAsset ? (
            <>
              <input name="coverStorageKey" type="hidden" value={replacementAsset.storageKey} />
              <input name="coverFileName" type="hidden" value={replacementAsset.fileName} />
              <input name="coverMimeType" type="hidden" value={replacementAsset.mimeType} />
              <input name="coverFileSize" type="hidden" value={replacementAsset.size} />
            </>
          ) : null}
          <label className="editor-span-2">{adminText(locale, "Judul", "Title")}<input autoFocus defaultValue={record.title} name="title" /></label>
          <label>{adminText(locale, "Jenis", "Type")}<select defaultValue={record.type} name="type">{["BOOK","JOURNAL_ARTICLE","BOOK_CHAPTER","ADDITIONAL_RESEARCH_OUTPUT"].map((item) => <option key={item}>{item}</option>)}</select></label>
          <label>{adminText(locale, "Tahun", "Year")}<input defaultValue={record.year} name="year" type="number" /></label>
          <label className="editor-span-2">{adminText(locale, "Penulis", "Authors")}<textarea defaultValue={record.authors.join("\n")} name="authors" /></label>
          <label className="editor-span-2">Editor<textarea defaultValue={record.editors.join("\n")} name="editors" /></label>
          <label>{adminText(locale, "Status bibliografis", "Bibliographic status")}<select defaultValue={record.status} name="status">{["PUBLISHED","FORTHCOMING","PREPRINT","ERRATUM","REVIEW"].map((item) => <option key={item}>{item}</option>)}</select></label>
          <label>{adminText(locale, "Label tanggal", "Date label")}<input defaultValue={record.dateLabel} name="dateLabel" /></label>
          <label className="editor-span-2">{adminText(locale, "Jurnal / buku induk", "Journal / parent book")}<input defaultValue={record.containerTitle} name="containerTitle" /></label>
          <label>{adminText(locale, "Penerbit", "Publisher")}<input defaultValue={record.publisher} name="publisher" /></label>
          <label>{adminText(locale, "Tempat terbit", "Publication place")}<input defaultValue={record.publicationPlace} name="publicationPlace" /></label>
          <label>Volume<input defaultValue={record.volume} name="volume" /></label>
          <label>Issue<input defaultValue={record.issue} name="issue" /></label>
          <label>{adminText(locale, "Nomor seri", "Series number")}<input defaultValue={record.seriesNumber} name="seriesNumber" /></label>
          <label>{adminText(locale, "Halaman", "Pages")}<input defaultValue={record.pages} name="pages" /></label>
          <label>DOI<input defaultValue={record.doi} name="doi" /></label>
          <label>{adminText(locale, "Tautan publik", "Public link")}<input defaultValue={record.externalUrl} name="externalUrl" type="url" /></label>
          <label className="editor-span-2">URL cover<input name="coverImage" readOnly type="url" value={replacementAsset?.url ?? record.coverImage} /></label>
          <label className="editor-span-2">{adminText(locale, "Catatan hak cover", "Cover rights note")}<input defaultValue={record.coverRightsNote} name="coverRightsNote" /></label>
          <div className="admin-upload-zone editor-span-2">
            <strong>{adminText(locale, "Ganti gambar publikasi", "Replace publication image")}</strong>
            {record.cardImage ? (
              <p className="active-asset">
                <strong>{record.cardImage.fileName}</strong>
                <span>{record.cardImage.mimeType} · {Math.ceil(record.cardImage.size / 1024)} KB</span>
              </p>
            ) : null}
            <UploadDropzone
              endpoint="publicationImage"
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
            <p role="status">
              {replacementAsset
                ? adminText(locale, `Gambar pengganti siap: ${replacementAsset.fileName}`, `Replacement image ready: ${replacementAsset.fileName}`)
                : adminText(locale, "Gambar aktif tetap dipakai sampai penggantian disimpan dan diterbitkan.", "The current image remains active until the replacement is saved and published.")}
            </p>
            {replacementAsset ? (
              <button className="button button-secondary" onClick={() => setReplacementAsset(null)} type="button">
                {adminText(locale, "Batalkan penggantian", "Cancel replacement")}
              </button>
            ) : null}
          </div>
          <label>{adminText(locale, "Nama sumber", "Source name")}<input defaultValue={record.sourceName} name="sourceName" /></label>
          <label>{adminText(locale, "URL sumber", "Source URL")}<input defaultValue={record.sourceUrl} name="sourceUrl" type="url" /></label>
          <label className="editor-span-2">{adminText(locale, "Catatan sumber", "Source note")}<textarea defaultValue={record.sourceNote} name="sourceNote" /></label>
        </div></section>
      ) : null}
        </div>
        <EditorReadinessRail form={formNode} kind={kind} locale={locale} revision={formRevision} />
      </div>

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
