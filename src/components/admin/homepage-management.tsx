import Link from "next/link";

import { HomepagePublicationSelection } from "@/components/admin/homepage-publication-selection";
import { PreviewLink } from "@/components/admin/preview-link";
import { ArrowRightIcon, CalendarIcon } from "@/components/icons";
import { adminText } from "@/data/admin-qol";
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
  const t = (id: string, en: string) => adminText(locale, id, en);

  if (!ready) {
    return (
      <>
        <HomepageHeading
          editHref={`/${locale}/admin/beranda/baru`}
          locale={locale}
          publicHref={publicHref}
        />
        <section className="admin-notice">
          <span aria-hidden="true">!</span>
          <div>
            <h2>{t("Penyimpanan masih terkunci", "Storage remains locked")}</h2>
            <p>
              {t(
                "Pengelolaan beranda aktif setelah kredensial database dirotasi dan DATABASE_READY diaktifkan.",
                "Homepage management becomes available after the database credentials are rotated and DATABASE_READY is enabled.",
              )}
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
  const status = record
    ? record.status === "DRAFT"
      ? t("Draft", "Draft")
      : record.status === "PUBLISHED"
        ? t("Terbit", "Published")
        : t("Arsip", "Archived")
    : t("Belum dibuat", "Not created");
  const publicSource = isPublished
    ? t("Snapshot beranda yang diterbitkan", "Published homepage snapshot")
    : t("Konten bawaan situs", "Default site content");

  const sections = [
    {
      number: "01",
      title: t("Identitas situs", "Site identity"),
      summary: content.id.officialLabel,
      detail: content.id.tagline,
      source: t("Manual", "Manual"),
      anchor: "identitas",
    },
    {
      number: "02",
      title: t("Profil akademik", "Academic profile"),
      summary: `${content.id.academicPrefix} ${content.id.academicName}`,
      detail: t("Nama, lead, tiga jabatan, potret, dan aksi profil.", "Name, lead, three positions, portrait, and profile action."),
      source: t("Manual", "Manual"),
      anchor: "profil",
    },
    {
      number: "03",
      title: t("Publikasi pilihan", "Featured publications"),
      summary: content.id.publicationTitle,
      detail: t(
        `${displayedBooks.length}/3 buku tampil · ${selectedPublications.length}/3 karya non-buku dipilih`,
        `${displayedBooks.length}/3 books shown · ${selectedPublications.length}/3 non-book works selected`,
      ),
      source: t("Kurasi", "Curated"),
      anchor: "publikasi",
    },
    {
      number: "04",
      title: t("Peta riset", "Research map"),
      summary: t(`${content.research.length} tema riset`, `${content.research.length} research themes`),
      detail: content.research.map((item) => item.titleId).join(" · "),
      source: t("Manual", "Manual"),
      anchor: "riset",
    },
    {
      number: "05",
      title: t("Kiprah", "Outreach"),
      summary: content.id.outreachTitle,
      detail: nextAgenda
        ? t(`Agenda berikutnya: ${nextAgenda.titleId}`, `Next agenda: ${nextAgenda.titleId}`)
        : t("Belum ada agenda mendatang · dua forum dikelola manual", "No upcoming agenda · two forums are managed manually"),
      source: t("Campuran", "Mixed"),
      anchor: "kiprah",
    },
    {
      number: "06",
      title: t("Penutup", "Closing"),
      summary: content.id.closingTitle,
      detail: t("Aksi kontak, profil, dan Google Scholar.", "Contact, profile, and Google Scholar actions."),
      source: t("Manual", "Manual"),
      anchor: "penutup",
    },
  ];

  return (
    <>
      <HomepageHeading
        editHref={editHref}
        locale={locale}
        publicHref={publicHref}
      />

      {feedback.editorialError || feedback.selectionError ? (
        <div className="admin-feedback is-error" role="alert">
          <div>
            <strong>{t("Perubahan belum diterapkan", "Changes were not applied")}</strong>
            <Link href={`/${locale}/admin/beranda`}>{t("Tutup pesan", "Dismiss message")}</Link>
          </div>
          <p>{feedback.editorialError || feedback.selectionError}</p>
        </div>
      ) : null}
      {feedback.selectionSaved ? (
        <div className="admin-feedback is-success" role="status">
          <div>
            <strong>{t("Pilihan tersimpan", "Selection saved")}</strong>
            <Link href={`/${locale}/admin/beranda`}>{t("Tutup pesan", "Dismiss message")}</Link>
          </div>
          <p>
            {feedback.selectionSaved === "books"
              ? t("Urutan tiga buku di beranda sudah diperbarui.", "The order of the three homepage books has been updated.")
              : t("Urutan tiga karya non-buku di beranda sudah diperbarui.", "The order of the three non-book works has been updated.")}
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
              <span className="change-pill">{t("Perubahan belum terbit", "Unpublished changes")}</span>
            ) : null}
          </div>
          <p className="eyebrow">{t("Yang dilihat pengunjung sekarang", "What visitors see now")}</p>
          <h2>{publicSource}</h2>
          <p>
            {record
              ? t(`Draft terakhir disimpan ${formatDate(record.updatedAt, locale)}.`, `Draft last saved ${formatDate(record.updatedAt, locale)}.`)
              : t("Buat draft pertama untuk mulai mengganti konten bawaan.", "Create the first draft to replace the default content.")}
          </p>
        </div>
        <dl className="homepage-command-facts">
          <div>
            <dt>{t("Versi draft", "Draft version")}</dt>
            <dd>{record?.draftVersion ?? "—"}</dd>
          </div>
          <div>
            <dt>{t("Versi publik", "Public version")}</dt>
            <dd>{record?.publishedVersion ?? "—"}</dd>
          </div>
          <div>
            <dt>{t("Riwayat terbit", "Publication history")}</dt>
            <dd>{revisionCount}</dd>
          </div>
        </dl>
        <div className="homepage-command-actions">
          <Link className="button button-primary" href={editHref}>
            {record ? t("Sunting konten", "Edit content") : t("Buat draft beranda", "Create homepage draft")}
            <ArrowRightIcon />
          </Link>
          {record ? (
            <PreviewLink
              className="button button-secondary"
              href={`/${locale}/admin/preview/homepage/${record.id}`}
              label={t("Preview draft", "Preview draft")}
            />
          ) : null}
        </div>
      </section>

      <div className="homepage-management-grid">
        <section className="homepage-map" aria-labelledby="homepage-map-title">
          <header>
            <div>
              <p className="eyebrow">{t("Urutan halaman publik", "Public page order")}</p>
              <h2 id="homepage-map-title">{t("Peta beranda", "Homepage map")}</h2>
            </div>
            <span>{t("6 bagian", "6 sections")}</span>
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
                  aria-label={t(`Sunting ${section.title}`, `Edit ${section.title}`)}
                  href={`${editHref}#${section.anchor}`}
                >
                  {t("Sunting", "Edit")}
                  <ArrowRightIcon />
                </Link>
              </li>
            ))}
          </ol>
        </section>

        <aside className="homepage-automation" aria-labelledby="automation-title">
          <header>
            <p className="eyebrow">{t("Terhubung ke koleksi", "Connected to collections")}</p>
            <h2 id="automation-title">{t("Konten yang tampil", "Displayed content")}</h2>
            <p>
              {t(
                "Hanya record yang sedang terbit yang dapat digunakan oleh beranda.",
                "Only currently published records can be used on the homepage.",
              )}
            </p>
          </header>
          <section>
            <span className="homepage-automation-icon" aria-hidden="true">
              03
            </span>
            <div>
              <h3>{t("Buku yang tampil", "Displayed books")}</h3>
              <p>
                {booksUseFallback
                  ? t("Pilihan belum lengkap; beranda sementara memakai buku terbaru.", "The selection is incomplete; the homepage temporarily uses the latest books.")
                  : t("Mengikuti tiga pilihan editorial dan urutannya.", "Uses the three editorial selections and their order.")}
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
                  {t("Pilih tiga buku di bagian Kurasi publikasi.", "Select three books in Publication curation.")}
                </small>
              ) : null}
            </div>
          </section>
          <section>
            <span className="homepage-automation-icon">
              <CalendarIcon />
            </span>
            <div>
              <h3>{t("Agenda terdekat", "Next agenda")}</h3>
              {nextAgenda ? (
                <>
                  <p>{nextAgenda.titleId}</p>
                  <time>{formatDate(nextAgenda.startsAt, locale)} WIB</time>
                </>
              ) : (
                <p>
                  {t(
                    "Belum ada agenda mendatang. Agenda selesai tetap berada di halaman Kiprah.",
                    "There is no upcoming agenda. Past agenda items remain on the Outreach page.",
                  )}
                </p>
              )}
              <Link href={`/${locale}/admin/agenda`}>{t("Kelola agenda", "Manage agenda")}</Link>
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
  locale,
  publicHref,
}: {
  editHref: string;
  locale: Locale;
  publicHref: string;
}) {
  const t = (id: string, en: string) => adminText(locale, id, en);
  return (
    <header className="admin-page-heading homepage-admin-heading">
      <div>
        <p className="eyebrow">{t("Kontrol halaman utama", "Homepage control")}</p>
        <h1>{t("Beranda", "Homepage")}</h1>
        <p>
          {t(
            "Atur isi, pahami sumber otomatis, preview draft, lalu terbitkan saat siap.",
            "Edit content, understand automated sources, preview the draft, and publish when ready.",
          )}
        </p>
      </div>
      <div className="admin-page-actions">
        <Link
          className="text-link"
          href={publicHref}
          rel="noreferrer"
          target="_blank"
        >
          {t("Lihat beranda", "View homepage")}
        </Link>
        <Link className="button button-primary" href={editHref}>
          {t("Kelola konten", "Manage content")}
        </Link>
      </div>
    </header>
  );
}
