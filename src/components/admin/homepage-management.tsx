import Link from "next/link";

import { HomepagePublicationSelection } from "@/components/admin/homepage-publication-selection";
import { PreviewLink } from "@/components/admin/preview-link";
import { ArrowRightIcon, CalendarIcon } from "@/components/icons";
import { getDatabaseReadiness } from "@/lib/content/database-readiness";
import { getHomepageFallback } from "@/lib/content/homepage";
import { prisma } from "@/lib/prisma";
import { homepageInputSchema } from "@/lib/validation/content";
import type { Locale } from "@/lib/i18n";

type HomepageFeedback = {
  editorialError?: string;
  selectionError?: string;
  selectionSaved?: string;
};

const statusCopy = {
  DRAFT: "Draft",
  PUBLISHED: "Terbit",
  ARCHIVED: "Arsip",
} as const;

function formatDate(value: Date, locale: Locale) {
  return new Intl.DateTimeFormat(locale === "id" ? "id-ID" : "en-GB", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Jakarta",
  }).format(value);
}

export async function HomepageManagement({
  feedback,
  locale,
}: {
  feedback: HomepageFeedback;
  locale: Locale;
}) {
  const ready = getDatabaseReadiness();
  const publicHref = `/${locale}`;

  if (!ready) {
    return (
      <>
        <HomepageHeading
          editHref={`/${locale}/admin/beranda/baru`}
          publicHref={publicHref}
        />
        <section className="admin-notice">
          <span aria-hidden="true">!</span>
          <div>
            <h2>Penyimpanan masih terkunci</h2>
            <p>
              Pengelolaan beranda aktif setelah kredensial database dirotasi dan
              DATABASE_READY diaktifkan.
            </p>
          </div>
        </section>
      </>
    );
  }

  const now = new Date();
  const record = await prisma.homepageContent.findUnique({
    where: { key: "main" },
  });
  const [selectedPublications, eligibleBooks, nextAgenda, revisionCount] =
    await Promise.all([
      prisma.publication.findMany({
        where: {
          contentStatus: "PUBLISHED",
          homepageOrder: { not: null },
          type: { not: "BOOK" },
        },
        orderBy: { homepageOrder: "asc" },
        select: { id: true, title: true, year: true, homepageOrder: true },
      }),
      prisma.publication.findMany({
        where: {
          contentStatus: "PUBLISHED",
          type: "BOOK",
          OR: [{ cardImageId: { not: null } }, { coverImage: { not: null } }],
        },
        orderBy: [{ year: "desc" }, { createdAt: "asc" }],
        select: {
          id: true,
          title: true,
          year: true,
          homepageOrder: true,
        },
      }),
      prisma.agendaItem.findFirst({
        where: {
          status: "PUBLISHED",
          OR: [
            { endsAt: { gte: now } },
            { endsAt: null, startsAt: { gte: now } },
          ],
        },
        orderBy: { startsAt: "asc" },
        select: { id: true, titleId: true, startsAt: true },
      }),
      record
        ? prisma.contentRevision.count({
            where: { kind: "HOMEPAGE", recordId: record.id },
          })
        : Promise.resolve(0),
    ]);
  const selectedBooks = eligibleBooks
    .filter((book) => book.homepageOrder)
    .sort((a, b) => (a.homepageOrder ?? 99) - (b.homepageOrder ?? 99));
  const displayedBooks =
    selectedBooks.length === 3 ? selectedBooks : eligibleBooks.slice(0, 3);
  const booksUseFallback = selectedBooks.length !== 3;

  const parsed = homepageInputSchema.safeParse(record?.payload);
  const content = parsed.success ? parsed.data : getHomepageFallback();
  const editHref = record
    ? `/${locale}/admin/beranda/${record.id}`
    : `/${locale}/admin/beranda/baru`;
  const isPublished = record?.status === "PUBLISHED";
  const status = record ? statusCopy[record.status] : "Belum dibuat";
  const publicSource = isPublished
    ? "Snapshot beranda yang diterbitkan"
    : "Konten bawaan situs";

  const sections = [
    {
      number: "01",
      title: "Identitas situs",
      summary: content.id.officialLabel,
      detail: content.id.tagline,
      source: "Manual",
      anchor: "identitas",
    },
    {
      number: "02",
      title: "Profil akademik",
      summary: `${content.id.academicPrefix} ${content.id.academicName}`,
      detail: "Nama, lead, tiga jabatan, potret, dan aksi profil.",
      source: "Manual",
      anchor: "profil",
    },
    {
      number: "03",
      title: "Publikasi pilihan",
      summary: content.id.publicationTitle,
      detail: `${displayedBooks.length}/3 buku tampil · ${selectedPublications.length}/3 karya non-buku dipilih`,
      source: "Kurasi",
      anchor: "publikasi",
    },
    {
      number: "04",
      title: "Peta riset",
      summary: `${content.research.length} tema riset`,
      detail: content.research.map((item) => item.titleId).join(" · "),
      source: "Manual",
      anchor: "riset",
    },
    {
      number: "05",
      title: "Kiprah",
      summary: content.id.outreachTitle,
      detail: nextAgenda
        ? `Agenda berikutnya: ${nextAgenda.titleId}`
        : "Belum ada agenda mendatang · dua forum dikelola manual",
      source: "Campuran",
      anchor: "kiprah",
    },
    {
      number: "06",
      title: "Penutup",
      summary: content.id.closingTitle,
      detail: "Aksi kontak, profil, dan Google Scholar.",
      source: "Manual",
      anchor: "penutup",
    },
  ];

  return (
    <>
      <HomepageHeading
        editHref={editHref}
        publicHref={publicHref}
      />

      {feedback.editorialError || feedback.selectionError ? (
        <div className="admin-feedback is-error" role="alert">
          <div>
            <strong>Perubahan belum diterapkan</strong>
            <Link href={`/${locale}/admin/beranda`}>Tutup pesan</Link>
          </div>
          <p>{feedback.editorialError || feedback.selectionError}</p>
        </div>
      ) : null}
      {feedback.selectionSaved ? (
        <div className="admin-feedback is-success" role="status">
          <div>
            <strong>Pilihan tersimpan</strong>
            <Link href={`/${locale}/admin/beranda`}>Tutup pesan</Link>
          </div>
          <p>
            {feedback.selectionSaved === "books"
              ? "Urutan tiga buku di beranda sudah diperbarui."
              : "Urutan tiga karya non-buku di beranda sudah diperbarui."}
          </p>
        </div>
      ) : null}

      <section className="homepage-command">
        <div className="homepage-command-status">
          <div>
            <span
              className={`status-pill ${record ? `is-${record.status.toLowerCase()}` : ""}`}
            >
              {status}
            </span>
            {record?.hasUnpublishedChanges ? (
              <span className="change-pill">Perubahan belum terbit</span>
            ) : null}
          </div>
          <p className="eyebrow">Yang dilihat pengunjung sekarang</p>
          <h2>{publicSource}</h2>
          <p>
            {record
              ? `Draft terakhir disimpan ${formatDate(record.updatedAt, locale)}.`
              : "Buat draft pertama untuk mulai mengganti konten bawaan."}
          </p>
        </div>
        <dl className="homepage-command-facts">
          <div>
            <dt>Versi draft</dt>
            <dd>{record?.draftVersion ?? "—"}</dd>
          </div>
          <div>
            <dt>Versi publik</dt>
            <dd>{record?.publishedVersion ?? "—"}</dd>
          </div>
          <div>
            <dt>Riwayat terbit</dt>
            <dd>{revisionCount}</dd>
          </div>
        </dl>
        <div className="homepage-command-actions">
          <Link className="button button-primary" href={editHref}>
            {record ? "Sunting konten" : "Buat draft beranda"}
            <ArrowRightIcon />
          </Link>
          {record ? (
            <PreviewLink
              className="button button-secondary"
              href={`/${locale}/admin/preview/homepage/${record.id}`}
              label="Preview draft"
            />
          ) : null}
        </div>
      </section>

      <div className="homepage-management-grid">
        <section className="homepage-map" aria-labelledby="homepage-map-title">
          <header>
            <div>
              <p className="eyebrow">Urutan halaman publik</p>
              <h2 id="homepage-map-title">Peta beranda</h2>
            </div>
            <span>6 bagian</span>
          </header>
          <ol>
            {sections.map((section) => (
              <li key={section.anchor}>
                <span aria-hidden="true">{section.number}</span>
                <div>
                  <div className="homepage-map-title">
                    <h3>{section.title}</h3>
                    <small>{section.source}</small>
                  </div>
                  <strong>{section.summary}</strong>
                  <p>{section.detail}</p>
                </div>
                <Link
                  aria-label={`Sunting ${section.title}`}
                  href={`${editHref}#${section.anchor}`}
                >
                  Sunting
                  <ArrowRightIcon />
                </Link>
              </li>
            ))}
          </ol>
        </section>

        <aside className="homepage-automation" aria-labelledby="automation-title">
          <header>
            <p className="eyebrow">Terhubung ke koleksi</p>
            <h2 id="automation-title">Konten yang tampil</h2>
            <p>
              Hanya record yang sedang terbit yang dapat digunakan oleh
              beranda.
            </p>
          </header>
          <section>
            <span className="homepage-automation-icon" aria-hidden="true">
              03
            </span>
            <div>
              <h3>Buku yang tampil</h3>
              <p>
                {booksUseFallback
                  ? "Pilihan belum lengkap; beranda sementara memakai buku terbaru."
                  : "Mengikuti tiga pilihan editorial dan urutannya."}
              </p>
              <ol>
                {displayedBooks.map((book) => (
                  <li key={book.id}>
                    <span>{book.year}</span>
                    {book.title}
                  </li>
                ))}
              </ol>
              {booksUseFallback ? (
                <small className="automation-warning">
                  Pilih tiga buku di bagian Kurasi publikasi.
                </small>
              ) : null}
            </div>
          </section>
          <section>
            <span className="homepage-automation-icon">
              <CalendarIcon />
            </span>
            <div>
              <h3>Agenda terdekat</h3>
              {nextAgenda ? (
                <>
                  <p>{nextAgenda.titleId}</p>
                  <time>{formatDate(nextAgenda.startsAt, locale)} WIB</time>
                </>
              ) : (
                <p>
                  Belum ada agenda mendatang. Agenda selesai tetap berada di
                  halaman Kiprah.
                </p>
              )}
              <Link href={`/${locale}/admin/agenda`}>Kelola agenda</Link>
            </div>
          </section>
        </aside>
      </div>

      <section id="publikasi-otomatis">
        <HomepagePublicationSelection locale={locale} />
      </section>
    </>
  );
}

function HomepageHeading({
  editHref,
  publicHref,
}: {
  editHref: string;
  publicHref: string;
}) {
  return (
    <header className="admin-page-heading homepage-admin-heading">
      <div>
        <p className="eyebrow">Kontrol halaman utama</p>
        <h1>Beranda</h1>
        <p>
          Atur isi, pahami sumber otomatis, preview draft, lalu terbitkan saat
          siap.
        </p>
      </div>
      <div className="admin-page-actions">
        <Link
          className="text-link"
          href={publicHref}
          rel="noreferrer"
          target="_blank"
        >
          Lihat beranda
        </Link>
        <Link className="button button-primary" href={editHref}>
          Kelola konten
        </Link>
      </div>
    </header>
  );
}
