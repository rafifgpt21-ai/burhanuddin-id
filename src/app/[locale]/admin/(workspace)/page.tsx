import Link from "next/link";

import { getAdminCollectionCounts } from "@/lib/content/admin-counts";
import { getDatabaseReadiness } from "@/lib/content/database-readiness";
import { getRoutePath, hasLocale, type Locale } from "@/lib/i18n";

const copy = {
  id: {
    eyebrow: "Meja editorial",
    title: "Ringkasan",
    intro:
      "Kelola konten berdasarkan tempat kemunculannya di situs publik, lalu terbitkan hanya setelah data dan sumber selesai ditinjau.",
    databaseReady: "Database siap",
    databaseLocked: "Database terkunci",
    collectionsLabel: "Status koleksi editorial",
    unavailable: "Belum terhubung",
    collections: {
      publications: {
        label: "Publikasi",
        destination: "Indeks publikasi",
        action: "Tambah publikasi",
        description: "Rekam bibliografis",
        context: "Publik utama",
      },
      agenda: {
        label: "Kiprah · Agenda",
        destination: "Halaman Kiprah",
        action: "Tambah agenda",
        description: "Kegiatan dan forum publik",
        context: "Bagian dari Kiprah",
      },
      posts: {
        label: "Tulisan",
        destination: "Arsip tulisan",
        action: "Buat tulisan",
        description: "Esai, catatan, atau opini",
        context: "Koleksi sekunder",
      },
      materials: {
        label: "Materi kuliah",
        destination: "Koleksi pengajaran",
        action: "Tambah materi",
        description: "Berkas atau tautan kelas",
        context: "Koleksi sekunder",
      },
    },
    createEyebrow: "Buat konten",
    createTitle: "Mulai draft baru",
    createIntro:
      "Pilih koleksi tujuan. Editor akan meminta informasi inti terlebih dahulu.",
    scopeEyebrow: "Di luar editor",
    scopeTitle: "Profil, Riset, dan Kontak",
    scopeDescription:
      "Ketiga halaman ini masih dikelola sebagai konten terkurasi di aplikasi. Perubahannya memerlukan peninjauan sumber dan belum tersedia sebagai formulir editor.",
    viewProfile: "Lihat Profil",
    viewResearch: "Lihat Riset",
    viewContact: "Lihat Kontak",
    databaseTitle: "Penyimpanan konten belum aktif",
    databaseDescription:
      "Kredensial lama tidak disentuh. Setelah password dirotasi, aktifkan DATABASE_READY melalui secret store untuk membuka penyimpanan dan unggahan.",
  },
  en: {
    eyebrow: "Editorial desk",
    title: "Overview",
    intro:
      "Manage content according to where it appears on the public site, and publish only after its data and sources have been reviewed.",
    databaseReady: "Database ready",
    databaseLocked: "Database locked",
    collectionsLabel: "Editorial collection status",
    unavailable: "Not connected",
    collections: {
      publications: {
        label: "Publications",
        destination: "Publication index",
        action: "Add publication",
        description: "Bibliographic records",
        context: "Primary public record",
      },
      agenda: {
        label: "Outreach · Agenda",
        destination: "Outreach page",
        action: "Add agenda item",
        description: "Public events and forums",
        context: "Part of Outreach",
      },
      posts: {
        label: "Writing",
        destination: "Writing archive",
        action: "Create writing",
        description: "Essays, notes, or commentary",
        context: "Secondary collection",
      },
      materials: {
        label: "Course materials",
        destination: "Teaching collection",
        action: "Add material",
        description: "Files or course links",
        context: "Secondary collection",
      },
    },
    createEyebrow: "Create content",
    createTitle: "Start a new draft",
    createIntro:
      "Choose its destination collection. The editor asks for essential information first.",
    scopeEyebrow: "Outside the editor",
    scopeTitle: "About, Research, and Contact",
    scopeDescription:
      "These three pages remain curated application content. Changes require source review and are not yet available through an editor form.",
    viewProfile: "View About",
    viewResearch: "View Research",
    viewContact: "View Contact",
    databaseTitle: "Content storage is not active",
    databaseDescription:
      "The previous credentials remain untouched. After rotating the password, enable DATABASE_READY through the secret store to open storage and uploads.",
  },
} as const;

export default async function AdminDashboard({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: value } = await params;
  const locale: Locale = hasLocale(value) ? value : "id";
  const databaseReady = getDatabaseReadiness();
  const counts = await getAdminCollectionCounts();
  const pageCopy = copy[locale];
  const base = `/${locale}/admin`;
  const collections = [
    {
      key: "publications" as const,
      href: `${base}/publikasi`,
      editorHref: `${base}/publikasi#editor`,
      copy: pageCopy.collections.publications,
    },
    {
      key: "agenda" as const,
      href: `${base}/agenda`,
      editorHref: `${base}/agenda#editor`,
      copy: pageCopy.collections.agenda,
    },
    {
      key: "posts" as const,
      href: `${base}/tulisan`,
      editorHref: `${base}/tulisan#editor`,
      copy: pageCopy.collections.posts,
    },
    {
      key: "materials" as const,
      href: `${base}/materi`,
      editorHref: `${base}/materi#editor`,
      copy: pageCopy.collections.materials,
    },
  ];

  return (
    <>
      <header className="admin-page-heading">
        <div>
          <p className="eyebrow">{pageCopy.eyebrow}</p>
          <h1>{pageCopy.title}</h1>
          <p>{pageCopy.intro}</p>
        </div>
        <span className={`readiness-badge ${databaseReady ? "is-ready" : ""}`}>
          {databaseReady ? pageCopy.databaseReady : pageCopy.databaseLocked}
        </span>
      </header>

      <section className="admin-metrics" aria-label={pageCopy.collectionsLabel}>
        {collections.map((collection) => (
          <Link href={collection.href} key={collection.key}>
            <span>{collection.copy.label}</span>
            <strong>{counts ? counts[collection.key] : "—"}</strong>
            <small>
              {counts ? collection.copy.destination : pageCopy.unavailable}
            </small>
          </Link>
        ))}
      </section>

      <section className="admin-create-hub" aria-labelledby="create-content-title">
        <div>
          <p className="eyebrow">{pageCopy.createEyebrow}</p>
          <h2 id="create-content-title">{pageCopy.createTitle}</h2>
          <p>{pageCopy.createIntro}</p>
        </div>
        <nav aria-label={pageCopy.createTitle}>
          {collections.map((collection) => (
            <Link href={collection.editorHref} key={collection.key}>
              <span>{collection.copy.context}</span>
              <strong>{collection.copy.action}</strong>
              <small>{collection.copy.description}</small>
            </Link>
          ))}
        </nav>
      </section>

      <section className="admin-scope-note" aria-labelledby="admin-scope-title">
        <div>
          <p className="eyebrow">{pageCopy.scopeEyebrow}</p>
          <h2 id="admin-scope-title">{pageCopy.scopeTitle}</h2>
          <p>{pageCopy.scopeDescription}</p>
        </div>
        <nav aria-label={pageCopy.scopeTitle}>
          <Link href={getRoutePath(locale, "about")}>{pageCopy.viewProfile}</Link>
          <Link href={getRoutePath(locale, "research")}>{pageCopy.viewResearch}</Link>
          <Link href={getRoutePath(locale, "contact")}>{pageCopy.viewContact}</Link>
        </nav>
      </section>

      {!databaseReady ? (
        <section className="admin-notice" aria-labelledby="database-lock-title">
          <span aria-hidden="true">!</span>
          <div>
            <h2 id="database-lock-title">{pageCopy.databaseTitle}</h2>
            <p>{pageCopy.databaseDescription}</p>
          </div>
        </section>
      ) : null}

    </>
  );
}
