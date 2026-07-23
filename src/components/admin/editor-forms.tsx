"use client";

import { useActionState, useState } from "react";

import {
  createAgendaAction,
  createMaterialAction,
  createPublicationAction,
  type EditorActionState,
} from "@/app/[locale]/admin/(workspace)/editor-actions";
import { UploadDropzone } from "@/lib/uploadthing";

const initialState: EditorActionState = {};

function FormStatus({ state }: { state: EditorActionState }) {
  if (!state.message) return null;
  return <p className={`editor-form-status ${state.ok ? "is-success" : ""}`} role={state.ok ? "status" : "alert"}>{state.message}</p>;
}

export function AgendaEditorForm({ ready, returnPath }: { ready: boolean; returnPath: string }) {
  const [state, action, pending] = useActionState(createAgendaAction, initialState);
  return (
    <form action={action} className="editor-form">
      <input name="returnPath" type="hidden" value={returnPath} />
      <FormStatus state={state} />
      <fieldset disabled={!ready || pending}>
        <legend className="sr-only">Agenda baru</legend>
        <div className="editor-form-grid">
          <label>Judul Indonesia<input name="titleId" required /></label>
          <label>Judul Inggris<input name="titleEn" required /></label>
          <label>Slug Indonesia<input name="slugId" placeholder="judul-agenda" required /></label>
          <label>Slug Inggris<input name="slugEn" placeholder="agenda-title" required /></label>
          <label className="editor-span-2">Deskripsi Indonesia<textarea name="descriptionId" required rows={3} /></label>
          <label className="editor-span-2">Deskripsi Inggris<textarea name="descriptionEn" required rows={3} /></label>
          <label>Mulai (WIB)<input name="startsAt" required type="datetime-local" /></label>
          <label>Selesai (WIB)<input name="endsAt" type="datetime-local" /></label>
          <label>Lokasi Indonesia<input name="locationLabelId" /></label>
          <label>Lokasi Inggris<input name="locationLabelEn" /></label>
          <label className="editor-span-2">Tautan sumber / registrasi<input name="externalUrl" placeholder="https://" type="url" /></label>
        </div>
        <button className="button button-primary" type="submit">{pending ? "Menyimpan…" : "Simpan sebagai draft"}</button>
      </fieldset>
    </form>
  );
}

export function PublicationEditorForm({ ready, returnPath }: { ready: boolean; returnPath: string }) {
  const [state, action, pending] = useActionState(createPublicationAction, initialState);
  return (
    <form action={action} className="editor-form">
      <input name="returnPath" type="hidden" value={returnPath} />
      <FormStatus state={state} />
      <fieldset disabled={!ready || pending}>
        <legend className="sr-only">Publikasi baru</legend>
        <div className="editor-form-grid">
          <label className="editor-span-2">Judul asli publikasi<input name="title" required /></label>
          <label className="editor-span-2">Penulis, satu nama per baris<textarea name="authors" required rows={4} /></label>
          <label>Tahun<input min="1900" name="year" required type="number" /></label>
          <label>Tipe<select name="type"><option value="BOOK">Buku</option><option value="JOURNAL_ARTICLE">Artikel jurnal</option><option value="BOOK_CHAPTER">Bab buku</option><option value="ADDITIONAL_RESEARCH_OUTPUT">Output riset lain</option></select></label>
          <label>Status bibliografis<select name="status"><option value="PUBLISHED">Published</option><option value="FORTHCOMING">Forthcoming</option><option value="PREPRINT">Preprint</option><option value="ERRATUM">Erratum</option><option value="REVIEW">Review</option></select></label>
          <label>Venue / jurnal<input name="venue" /></label>
          <label>DOI<input name="doi" /></label>
          <label>URL kanonis<input name="externalUrl" placeholder="https://" type="url" /></label>
          <label>Nama sumber<input name="sourceName" required /></label>
          <label>URL sumber<input name="sourceUrl" placeholder="https://" type="url" /></label>
          <label className="editor-span-2">Catatan sumber<textarea name="sourceNote" required rows={3} /></label>
        </div>
        <button className="button button-primary" type="submit">{pending ? "Menyimpan…" : "Simpan sebagai draft"}</button>
      </fieldset>
    </form>
  );
}

type UploadedAsset = {
  storageKey: string; url: string; fileName: string; mimeType: string; size: number;
};

export function MaterialEditorForm({ ready, returnPath }: { ready: boolean; returnPath: string }) {
  const [state, action, pending] = useActionState(createMaterialAction, initialState);
  const [asset, setAsset] = useState<UploadedAsset | null>(null);
  return (
    <form action={action} className="editor-form">
      <input name="returnPath" type="hidden" value={returnPath} />
      {asset ? <><input name="storageKey" type="hidden" value={asset.storageKey} /><input name="assetUrl" type="hidden" value={asset.url} /><input name="fileName" type="hidden" value={asset.fileName} /><input name="mimeType" type="hidden" value={asset.mimeType} /><input name="fileSize" type="hidden" value={asset.size} /></> : null}
      <FormStatus state={state} />
      <fieldset disabled={!ready || pending}>
        <legend className="sr-only">Materi baru</legend>
        <div className="editor-form-grid">
          <label>Judul Indonesia<input name="titleId" required /></label><label>Judul Inggris<input name="titleEn" required /></label>
          <label>Slug Indonesia<input name="slugId" placeholder="judul-materi" required /></label><label>Slug Inggris<input name="slugEn" placeholder="material-title" required /></label>
          <label className="editor-span-2">Deskripsi Indonesia<textarea name="descriptionId" required rows={3} /></label><label className="editor-span-2">Deskripsi Inggris<textarea name="descriptionEn" required rows={3} /></label>
          <label>Mata kuliah<input name="courseId" required /></label><label>Course name<input name="courseEn" required /></label>
          <label>Topik<input name="topicId" required /></label><label>Topic<input name="topicEn" required /></label>
          <label>Tipe<select name="resourceType"><option value="SLIDE">Slide</option><option value="READING">Bacaan</option><option value="SYLLABUS">Silabus</option><option value="ASSIGNMENT">Tugas</option><option value="DATASET">Dataset</option><option value="VIDEO">Video</option><option value="LINK">Tautan</option><option value="OTHER">Lainnya</option></select></label>
          <label>Semester<input name="semester" placeholder="Ganjil" required /></label><label>Tahun akademik<input name="academicYear" placeholder="2026/2027" required /></label>
          <label className="editor-span-2">Tautan eksternal (pilih ini atau upload)<input name="externalUrl" placeholder="https://" type="url" /></label>
          <label className="editor-span-2">Catatan hak penggunaan<textarea name="rightsNote" required rows={2} /></label>
          <label className="editor-check"><input name="downloadAllowed" type="checkbox" /> Izinkan unduhan</label>
        </div>
        <div className="admin-upload-zone">
          {ready ? (
            <UploadDropzone
              endpoint="academicAsset"
              onClientUploadComplete={(files) => {
                const file = files[0];
                if (!file) return;
                setAsset({ storageKey: file.key, url: file.ufsUrl, fileName: file.name, mimeType: file.type, size: file.size });
              }}
              onUploadError={() => setAsset(null)}
            />
          ) : (
            <div className="admin-upload-disabled">Upload terkunci sampai database siap.</div>
          )}
          <p role="status">{asset ? `Siap disimpan: ${asset.fileName}` : "PDF maks. 16 MB atau gambar maks. 4 MB."}</p>
        </div>
        <button className="button button-primary" type="submit">{pending ? "Menyimpan…" : "Simpan sebagai draft"}</button>
      </fieldset>
    </form>
  );
}
