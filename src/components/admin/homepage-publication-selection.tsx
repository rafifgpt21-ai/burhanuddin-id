import Link from "next/link";

import {
  setHomepageBooksAction,
  setHomepagePublicationsAction,
} from "@/app/[locale]/admin/(workspace)/editor-actions";
import { BookIcon } from "@/components/icons";
import { adminText } from "@/data/admin-qol";
import { prisma } from "@/lib/prisma";
import type { Locale } from "@/lib/i18n";

type SelectionRecord = {
  id: string;
  title: string;
  year: number;
  homepageOrder: number | null;
};

export async function HomepagePublicationSelection({
  locale,
}: {
  locale: Locale;
}) {
  if (process.env.DATABASE_READY !== "true") return null;
  const t = (id: string, en: string) => adminText(locale, id, en);

  const [books, nonBooks] = await Promise.all([
    prisma.publication.findMany({
      where: {
        type: "BOOK",
        contentStatus: "PUBLISHED",
        OR: [{ cardImageId: { not: null } }, { coverImage: { not: null } }],
      },
      select: { id: true, title: true, year: true, homepageOrder: true },
      orderBy: [{ year: "desc" }, { title: "asc" }],
    }),
    prisma.publication.findMany({
      where: { type: { not: "BOOK" }, contentStatus: "PUBLISHED" },
      select: { id: true, title: true, year: true, homepageOrder: true },
      orderBy: [{ year: "desc" }, { title: "asc" }],
    }),
  ]);

  return (
    <section
      className="homepage-publication-curation"
      aria-labelledby="homepage-curation-title"
    >
      <header>
        <div>
          <p className="eyebrow">{t("Pilihan editorial", "Editorial selection")}</p>
          <h2 id="homepage-curation-title">{t("Kurasi publikasi beranda", "Homepage publication curation")}</h2>
          <p>
            {t(
              "Susun tiga buku dan tiga karya non-buku. Nomor slot mengikuti urutan tampil dari kiri ke kanan.",
              "Arrange three books and three non-book works. Slot numbers follow their left-to-right display order.",
            )}
          </p>
        </div>
        <Link href={`/${locale}/admin/publikasi`}>{t("Buka koleksi publikasi", "Open publication collection")}</Link>
      </header>
      <div className="homepage-curation-grid">
        <PublicationSelectionForm
          action={setHomepageBooksAction}
          emptyCopy={t("Belum ada buku terbit dengan cover berizin.", "There are no published books with an approved cover.")}
          eyebrow={t("Rak buku", "Bookshelf")}
          help={t("Hanya buku terbit dengan cover berizin yang dapat dipilih.", "Only published books with an approved cover can be selected.")}
          locale={locale}
          records={books}
          title={t("Tiga buku pilihan", "Three featured books")}
        />
        <PublicationSelectionForm
          action={setHomepagePublicationsAction}
          emptyCopy={t("Belum ada karya non-buku yang sedang terbit.", "There are no published non-book works.")}
          eyebrow={t("Karya ilmiah", "Scholarly works")}
          help={t("Artikel, bab buku, dan keluaran riset yang sedang terbit.", "Published articles, book chapters, and research outputs.")}
          locale={locale}
          records={nonBooks}
          title={t("Tiga karya non-buku", "Three non-book works")}
        />
      </div>
    </section>
  );
}

function PublicationSelectionForm({
  action,
  emptyCopy,
  eyebrow,
  help,
  locale,
  records,
  title,
}: {
  action: (formData: FormData) => void | Promise<void>;
  emptyCopy: string;
  eyebrow: string;
  help: string;
  locale: Locale;
  records: SelectionRecord[];
  title: string;
}) {
  const t = (id: string, en: string) => adminText(locale, id, en);
  const selected = records
    .filter((record) => record.homepageOrder)
    .sort((a, b) => (a.homepageOrder ?? 99) - (b.homepageOrder ?? 99));

  return (
    <form action={action} className="homepage-publication-selection">
      <input name="locale" type="hidden" value={locale} />
      <div className="homepage-selection-copy">
        <span className="homepage-selection-icon" aria-hidden="true">
          <BookIcon />
        </span>
        <div>
          <p className="eyebrow">{eyebrow}</p>
          <h3>{title}</h3>
          <p>{help}</p>
        </div>
        <span
          className={`selection-readiness ${selected.length === 3 ? "is-ready" : ""}`}
        >
          {selected.length}/3 {t("slot terisi", "slots filled")}
        </span>
      </div>

      {records.length ? (
        <>
          <fieldset>
            <legend className="sr-only">{title}</legend>
            {(["first", "second", "third"] as const).map((name, index) => (
              <label key={name}>
                <span>
                  <strong>{String(index + 1).padStart(2, "0")}</strong>
                  {t("Slot", "Slot")} {index + 1}
                </span>
                <select
                  defaultValue={selected[index]?.id ?? ""}
                  name={name}
                  required
                >
                  <option value="">{t("Pilih publikasi", "Select a publication")}</option>
                  {records.map((record) => (
                    <option key={record.id} value={record.id}>
                      {record.year} · {record.title}
                    </option>
                  ))}
                </select>
              </label>
            ))}
          </fieldset>
          <div className="homepage-selection-actions">
            <small>
              {t("Ketiga pilihan harus berbeda dan tetap berstatus terbit.", "All three selections must be different and remain published.")}
            </small>
            <button className="button button-primary" type="submit">
              {t("Simpan pilihan", "Save selection")}
            </button>
          </div>
        </>
      ) : (
        <div className="homepage-selection-empty">
          <p>{emptyCopy}</p>
          <Link href={`/${locale}/admin/publikasi`}>
            {t("Kelola publikasi", "Manage publications")}
          </Link>
        </div>
      )}
    </form>
  );
}
