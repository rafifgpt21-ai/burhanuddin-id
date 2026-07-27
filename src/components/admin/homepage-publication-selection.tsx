import Link from "next/link";

import {
  setHomepageBooksAction,
  setHomepagePublicationsAction,
} from "@/app/[locale]/admin/(workspace)/editor-actions";
import { BookIcon } from "@/components/icons";
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
          <p className="eyebrow">Pilihan editorial</p>
          <h2 id="homepage-curation-title">Kurasi publikasi beranda</h2>
          <p>
            Susun tiga buku dan tiga karya non-buku. Nomor slot mengikuti urutan
            tampil dari kiri ke kanan.
          </p>
        </div>
        <Link href={`/${locale}/admin/publikasi`}>Buka koleksi publikasi</Link>
      </header>
      <div className="homepage-curation-grid">
        <PublicationSelectionForm
          action={setHomepageBooksAction}
          emptyCopy="Belum ada buku terbit dengan cover berizin."
          eyebrow="Rak buku"
          help="Hanya buku terbit dengan cover berizin yang dapat dipilih."
          locale={locale}
          records={books}
          title="Tiga buku pilihan"
        />
        <PublicationSelectionForm
          action={setHomepagePublicationsAction}
          emptyCopy="Belum ada karya non-buku yang sedang terbit."
          eyebrow="Karya ilmiah"
          help="Artikel, bab buku, dan keluaran riset yang sedang terbit."
          locale={locale}
          records={nonBooks}
          title="Tiga karya non-buku"
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
          {selected.length}/3 slot terisi
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
                  Slot {index + 1}
                </span>
                <select
                  defaultValue={selected[index]?.id ?? ""}
                  name={name}
                  required
                >
                  <option value="">Pilih publikasi</option>
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
              Ketiga pilihan harus berbeda dan tetap berstatus terbit.
            </small>
            <button className="button button-primary" type="submit">
              Simpan pilihan
            </button>
          </div>
        </>
      ) : (
        <div className="homepage-selection-empty">
          <p>{emptyCopy}</p>
          <Link href={`/${locale}/admin/publikasi`}>
            Kelola publikasi
          </Link>
        </div>
      )}
    </form>
  );
}
