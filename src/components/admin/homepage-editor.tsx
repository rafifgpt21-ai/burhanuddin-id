"use client";

import { useActionState, useEffect, useRef, useState } from "react";

import {
  editorialTransitionAction,
  saveEditorialRecordAction,
  upsertHomepageAction,
  type EditorActionState,
} from "@/app/[locale]/admin/(workspace)/editor-actions";
import { PreviewLink } from "@/components/admin/preview-link";
import type { HomepageInput } from "@/lib/validation/content";

const initialState: EditorActionState = {};

type HomepageLocale = "id" | "en";
type HomepageTextField = Exclude<keyof HomepageInput["id"], "roles">;
type FieldDefinition = {
  field: HomepageTextField;
  label: string;
  max: number;
  textarea?: boolean;
  wide?: boolean;
};

const identityFields: FieldDefinition[] = [
  { field: "officialLabel", label: "Label situs resmi", max: 120, wide: true },
  { field: "tagline", label: "Tagline", max: 160, wide: true },
  { field: "quote", label: "Kutipan utama", max: 800, textarea: true, wide: true },
  { field: "fields", label: "Bidang pada folio", max: 160 },
  { field: "continueAction", label: "Teks lanjut", max: 80 },
];

const profileFields: FieldDefinition[] = [
  { field: "academicPrefix", label: "Prefiks nama", max: 30 },
  { field: "academicName", label: "Nama akademik", max: 120 },
  { field: "academicSuffix", label: "Sufiks akademik", max: 60 },
  { field: "profileAction", label: "Aksi profil", max: 80 },
  { field: "lead", label: "Lead profil", max: 800, textarea: true, wide: true },
  { field: "portraitCaption", label: "Caption potret", max: 180, wide: true },
];

const publicationFields: FieldDefinition[] = [
  { field: "publicationEyebrow", label: "Label bagian", max: 80 },
  { field: "booksLabel", label: "Label buku", max: 80 },
  { field: "publicationTitle", label: "Judul bagian", max: 100, wide: true },
  {
    field: "publicationDescription",
    label: "Deskripsi bagian",
    max: 400,
    textarea: true,
    wide: true,
  },
  { field: "publicationAction", label: "Aksi publikasi", max: 80 },
];

const outreachFields: FieldDefinition[] = [
  { field: "outreachEyebrow", label: "Label bagian", max: 80 },
  { field: "outreachTitle", label: "Judul bagian", max: 100 },
  {
    field: "outreachDescription",
    label: "Deskripsi bagian",
    max: 400,
    textarea: true,
    wide: true,
  },
  { field: "outreachAction", label: "Aksi Kiprah", max: 80 },
  { field: "agendaLabel", label: "Label agenda", max: 80 },
  { field: "forumLabel", label: "Label forum", max: 80 },
  { field: "materialsAction", label: "Aksi materi", max: 80 },
];

const closingFields: FieldDefinition[] = [
  { field: "closingEyebrow", label: "Label penutup", max: 100 },
  { field: "closingTitle", label: "Judul penutup", max: 100, wide: true },
  { field: "contactAction", label: "Aksi kontak", max: 80 },
  { field: "closingProfileAction", label: "Aksi profil", max: 80 },
];

const allEnglishFields = [
  ...identityFields,
  ...profileFields,
  ...publicationFields,
  ...outreachFields,
  ...closingFields,
];

export function HomepageEditor({
  initial,
  locale,
  recordId,
  ready,
  status,
  updatedAt,
}: {
  initial: HomepageInput;
  locale: "id" | "en";
  recordId?: string;
  ready: boolean;
  status?: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  updatedAt?: Date;
}) {
  const [value, setValue] = useState(initial);
  const [dirty, setDirty] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const actionHandler = recordId
    ? saveEditorialRecordAction
    : upsertHomepageAction;
  const [state, action, pending] = useActionState(actionHandler, initialState);
  const effectiveRecordId = recordId ?? state.recordId;

  useEffect(() => {
    const warn = (event: BeforeUnloadEvent) => {
      if (!dirty) return;
      event.preventDefault();
    };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  useEffect(() => {
    const savedStateTimer = state.ok
      ? window.setTimeout(() => setDirty(false), 0)
      : undefined;
    if (state.message && !state.ok) {
      formRef.current
        ?.querySelector<
          HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >(
          "input:not([type='hidden']):not([disabled]), textarea:not([disabled]), select:not([disabled])",
        )
        ?.focus();
    }
    return () => {
      if (savedStateTimer) window.clearTimeout(savedStateTimer);
    };
  }, [state]);

  const updateLocale = (
    language: HomepageLocale,
    field: keyof HomepageInput["id"],
    next: string | string[],
  ) => {
    setValue((current) => ({
      ...current,
      [language]: { ...current[language], [field]: next },
    }));
    setDirty(true);
  };

  const updateResearch = (
    index: number,
    patch: Partial<HomepageInput["research"][number]>,
  ) => {
    setValue((current) => ({
      ...current,
      research: current.research.map((item, itemIndex) =>
        itemIndex === index ? { ...item, ...patch } : item,
      ),
    }));
    setDirty(true);
  };

  const updateForum = (
    index: number,
    patch: Partial<HomepageInput["forums"][number]>,
  ) => {
    setValue((current) => ({
      ...current,
      forums: current.forums.map((item, itemIndex) =>
        itemIndex === index ? { ...item, ...patch } : item,
      ) as HomepageInput["forums"],
    }));
    setDirty(true);
  };

  const renderFields = (
    language: HomepageLocale,
    fields: FieldDefinition[],
  ) => (
    <div className="editor-form-grid">
      {fields.map(({ field, label, max, textarea, wide }) => {
        const fieldValue = String(value[language][field] ?? "");
        return (
          <label className={wide ? "editor-span-2" : undefined} key={field}>
            <span className="editor-field-label">
              <span>{label}</span>
              {language === "en" ? (
                <small className="field-optional">Opsional</small>
              ) : null}
            </span>
            {textarea ? (
              <textarea
                maxLength={max}
                onChange={(event) =>
                  updateLocale(language, field, event.target.value)
                }
                rows={4}
                value={fieldValue}
              />
            ) : (
              <input
                maxLength={max}
                onChange={(event) =>
                  updateLocale(language, field, event.target.value)
                }
                value={fieldValue}
              />
            )}
            <small className="field-counter">
              {fieldValue.length}/{max}
            </small>
          </label>
        );
      })}
    </div>
  );

  return (
    <form
      action={action}
      className="editor-form homepage-editor"
      onChange={() => setDirty(true)}
      ref={formRef}
    >
      <input name="kind" type="hidden" value="homepage" />
      <input name="locale" type="hidden" value={locale} />
      {effectiveRecordId ? (
        <input name="id" type="hidden" value={effectiveRecordId} />
      ) : null}
      <input name="payload" type="hidden" value={JSON.stringify(value)} />

      {state.message ? (
        <p
          className={`editor-form-status ${state.ok ? "is-success" : ""}`}
          role={state.ok ? "status" : "alert"}
        >
          {state.message}
        </p>
      ) : null}
      {dirty ? (
        <p className="unsaved-indicator" role="status">
          Ada perubahan yang belum disimpan.
        </p>
      ) : null}

      <div className="homepage-editor-layout">
        <aside className="homepage-editor-index">
          <p className="eyebrow">Struktur beranda</p>
          <nav aria-label="Bagian editor beranda">
            <a href="#identitas">
              <span>01</span> Identitas
            </a>
            <a href="#profil">
              <span>02</span> Profil akademik
            </a>
            <a href="#publikasi">
              <span>03</span> Publikasi
            </a>
            <a href="#riset">
              <span>04</span> Peta riset
            </a>
            <a href="#kiprah">
              <span>05</span> Kiprah
            </a>
            <a href="#penutup">
              <span>06</span> Penutup
            </a>
            <a href="#terjemahan">
              <span>EN</span> English
            </a>
          </nav>
          <p>
            Simpan draft sebelum membuka preview. Versi publik tidak berubah
            sampai Anda menerbitkannya.
          </p>
        </aside>

        <div className="homepage-editor-canvas">
          <EditorSection
            description="Judul halaman pembuka, tagline, kutipan, dan logo."
            eyebrow="Bagian 01"
            id="identitas"
            title="Identitas situs"
          >
            {renderFields("id", identityFields)}
            <div className="editor-form-grid homepage-media-fields">
              <label className="editor-span-2">
                URL logo
                <input
                  onChange={(event) =>
                    setValue((current) => ({
                      ...current,
                      logoUrl: event.target.value,
                    }))
                  }
                  type="url"
                  value={value.logoUrl}
                />
              </label>
            </div>
          </EditorSection>

          <EditorSection
            description="Nama akademik, pengantar, tiga jabatan, potret, dan aksi profil."
            eyebrow="Bagian 02"
            id="profil"
            title="Profil akademik"
          >
            {renderFields("id", profileFields)}
            <label className="homepage-role-field">
              <span className="editor-field-label">
                <span>Tiga jabatan aktif</span>
                <small>Gunakan satu baris per jabatan</small>
              </span>
              <textarea
                onChange={(event) =>
                  updateLocale(
                    "id",
                    "roles",
                    event.target.value.split("\n").slice(0, 3),
                  )
                }
                rows={5}
                value={value.id.roles.join("\n")}
              />
              <small className="field-counter">
                {value.id.roles.filter(Boolean).length}/3 jabatan
              </small>
            </label>
            <div className="editor-form-grid homepage-media-fields">
              <label className="editor-span-2">
                URL potret
                <input
                  onChange={(event) =>
                    setValue((current) => ({
                      ...current,
                      portraitUrl: event.target.value,
                    }))
                  }
                  type="url"
                  value={value.portraitUrl}
                />
              </label>
              <label>
                Alt potret Indonesia
                <input
                  onChange={(event) =>
                    setValue((current) => ({
                      ...current,
                      portraitAltId: event.target.value,
                    }))
                  }
                  value={value.portraitAltId}
                />
              </label>
              <label>
                Portrait alt English
                <span className="field-optional">Opsional</span>
                <input
                  onChange={(event) =>
                    setValue((current) => ({
                      ...current,
                      portraitAltEn: event.target.value,
                    }))
                  }
                  value={value.portraitAltEn}
                />
              </label>
              <label className="editor-span-2">
                Catatan hak penggunaan
                <textarea
                  onChange={(event) =>
                    setValue((current) => ({
                      ...current,
                      mediaRightsNote: event.target.value,
                    }))
                  }
                  rows={3}
                  value={value.mediaRightsNote}
                />
              </label>
            </div>
          </EditorSection>

          <EditorSection
            description="Label dan pengantar. Pilihan karya non-buku diatur pada pusat Beranda."
            eyebrow="Bagian 03"
            id="publikasi"
            title="Publikasi pilihan"
          >
            {renderFields("id", publicationFields)}
            <p className="editor-context-note">
              Tiga buku dan tiga karya non-buku dipilih serta diurutkan dari
              pusat pengelolaan Beranda.
            </p>
          </EditorSection>

          <EditorSection
            description="Empat tema tetap dengan satu karya terkait untuk setiap tema."
            eyebrow="Bagian 04"
            id="riset"
            title="Peta riset"
          >
            <div className="homepage-repeat-list">
              {value.research.map((cluster, index) => (
                <fieldset key={cluster.key}>
                  <legend>
                    {String(index + 1).padStart(2, "0")} · {cluster.key}
                  </legend>
                  <label>
                    Judul Indonesia
                    <input
                      onChange={(event) =>
                        updateResearch(index, { titleId: event.target.value })
                      }
                      value={cluster.titleId}
                    />
                  </label>
                  <label>
                    Tahun karya
                    <input
                      onChange={(event) =>
                        updateResearch(index, { workYear: event.target.value })
                      }
                      value={cluster.workYear}
                    />
                  </label>
                  <label className="editor-span-2">
                    Deskripsi Indonesia
                    <textarea
                      onChange={(event) =>
                        updateResearch(index, {
                          descriptionId: event.target.value,
                        })
                      }
                      rows={4}
                      value={cluster.descriptionId}
                    />
                  </label>
                  <label className="editor-span-2">
                    Judul karya terkait
                    <input
                      onChange={(event) =>
                        updateResearch(index, { workTitle: event.target.value })
                      }
                      value={cluster.workTitle}
                    />
                  </label>
                  <label className="editor-span-2">
                    URL karya
                    <input
                      onChange={(event) =>
                        updateResearch(index, { workUrl: event.target.value })
                      }
                      type="url"
                      value={cluster.workUrl ?? ""}
                    />
                  </label>
                  <details className="repeat-translation editor-span-2">
                    <summary>English fields · opsional</summary>
                    <div>
                      <label>
                        English title
                        <input
                          onChange={(event) =>
                            updateResearch(index, {
                              titleEn: event.target.value,
                            })
                          }
                          value={cluster.titleEn}
                        />
                      </label>
                      <label>
                        English description
                        <textarea
                          onChange={(event) =>
                            updateResearch(index, {
                              descriptionEn: event.target.value,
                            })
                          }
                          rows={3}
                          value={cluster.descriptionEn}
                        />
                      </label>
                    </div>
                  </details>
                </fieldset>
              ))}
            </div>
          </EditorSection>

          <EditorSection
            description="Pengantar Kiprah dan dua forum pilihan. Agenda terdekat diisi otomatis."
            eyebrow="Bagian 05"
            id="kiprah"
            title="Kiprah"
          >
            {renderFields("id", outreachFields)}
            <div className="homepage-repeat-list">
              {value.forums.map((forum, index) => (
                <fieldset key={index}>
                  <legend>Forum {index + 1}</legend>
                  <label>
                    Tahun
                    <input
                      onChange={(event) =>
                        updateForum(index, { year: event.target.value })
                      }
                      value={forum.year}
                    />
                  </label>
                  <label>
                    Institusi
                    <input
                      onChange={(event) =>
                        updateForum(index, {
                          institutionId: event.target.value,
                        })
                      }
                      value={forum.institutionId}
                    />
                  </label>
                  <label className="editor-span-2">
                    Judul forum
                    <input
                      onChange={(event) =>
                        updateForum(index, { titleId: event.target.value })
                      }
                      value={forum.titleId}
                    />
                  </label>
                  <details className="repeat-translation editor-span-2">
                    <summary>English fields · opsional</summary>
                    <div>
                      <label>
                        English title
                        <input
                          onChange={(event) =>
                            updateForum(index, { titleEn: event.target.value })
                          }
                          value={forum.titleEn}
                        />
                      </label>
                      <label>
                        English institution
                        <input
                          onChange={(event) =>
                            updateForum(index, {
                              institutionEn: event.target.value,
                            })
                          }
                          value={forum.institutionEn}
                        />
                      </label>
                    </div>
                  </details>
                </fieldset>
              ))}
            </div>
            <p className="editor-context-note">
              Agenda pada beranda selalu mengambil acara terbit terdekat yang
              belum selesai.
            </p>
          </EditorSection>

          <EditorSection
            description="Ajakan terakhir menuju kontak, profil, dan kanal akademik."
            eyebrow="Bagian 06"
            id="penutup"
            title="Penutup"
          >
            {renderFields("id", closingFields)}
            <div className="editor-form-grid">
              <label className="editor-span-2">
                URL Google Scholar
                <input
                  onChange={(event) =>
                    setValue((current) => ({
                      ...current,
                      scholar: { ...current.scholar, href: event.target.value },
                    }))
                  }
                  type="url"
                  value={value.scholar.href}
                />
              </label>
              <label className="editor-span-2">
                Label Google Scholar
                <input
                  onChange={(event) =>
                    setValue((current) => ({
                      ...current,
                      scholar: { ...current.scholar, label: event.target.value },
                    }))
                  }
                  value={value.scholar.label}
                />
              </label>
            </div>
          </EditorSection>

          <section
            className="homepage-editor-section homepage-translation-section"
            id="terjemahan"
          >
            <details>
              <summary>
                <span>
                  <small>English · opsional</small>
                  Konten bahasa Inggris
                </span>
                <strong>
                  Field kosong memakai konten Indonesia secara otomatis
                </strong>
              </summary>
              <div className="homepage-translation-body">
                {renderFields("en", allEnglishFields)}
                <label className="homepage-role-field">
                  <span className="editor-field-label">
                    <span>Three active roles</span>
                    <small className="field-optional">Opsional</small>
                  </span>
                  <textarea
                    onChange={(event) =>
                      updateLocale(
                        "en",
                        "roles",
                        event.target.value.split("\n").slice(0, 3),
                      )
                    }
                    rows={5}
                    value={value.en.roles.join("\n")}
                  />
                </label>
              </div>
            </details>
          </section>
        </div>
      </div>

      <div className="editor-action-bar homepage-editor-actions">
        <p>
          <strong>{dirty ? "Belum tersimpan" : "Draft privat"}</strong>
          {dirty ? (
            "Simpan draft sebelum preview atau menerbitkan."
          ) : (
            <>
              Disimpan{" "}
              <time>
                {new Intl.DateTimeFormat(
                  locale === "id" ? "id-ID" : "en-GB",
                  { dateStyle: "medium", timeStyle: "short" },
                ).format(
                  state.savedAt
                    ? new Date(state.savedAt)
                    : updatedAt ?? new Date(),
                )}
              </time>
              . Beranda publik belum berubah.
            </>
          )}
        </p>
        <div className="editor-action-group">
          <button
            className="button button-secondary"
            disabled={!ready || pending}
            type="submit"
          >
            {pending ? "Menyimpan…" : "Simpan draft"}
          </button>
          {effectiveRecordId ? (
            <PreviewLink
              className="button button-secondary"
              href={`/${locale}/admin/preview/homepage/${effectiveRecordId}`}
              label="Preview"
            />
          ) : null}
          {effectiveRecordId && status !== "ARCHIVED" ? (
            <button
              className="button button-primary"
              disabled={dirty || !ready || pending}
              formAction={editorialTransitionAction.bind(
                null,
                `${effectiveRecordId}:publish`,
              )}
              type="submit"
            >
              {status === "PUBLISHED"
                ? "Terbitkan perubahan"
                : "Terbitkan"}
            </button>
          ) : null}
        </div>
      </div>
    </form>
  );
}

function EditorSection({
  children,
  description,
  eyebrow,
  id,
  title,
}: {
  children: React.ReactNode;
  description: string;
  eyebrow: string;
  id: string;
  title: string;
}) {
  return (
    <section className="homepage-editor-section" id={id}>
      <header>
        <div>
          <p>{eyebrow}</p>
          <h2>{title}</h2>
        </div>
        <p>{description}</p>
      </header>
      <div className="homepage-editor-section-body">{children}</div>
    </section>
  );
}
