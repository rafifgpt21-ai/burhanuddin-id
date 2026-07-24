import Link from "next/link";

import { MaterialEditorForm } from "@/components/admin/editor-forms";
import { getAdminCollectionCounts } from "@/lib/content/admin-counts";
import { getDatabaseReadiness } from "@/lib/content/database-readiness";
import { getRoutePath, hasLocale } from "@/lib/i18n";

export default async function AdminMaterials({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: value } = await params;
  const locale = hasLocale(value) ? value : "id";
  const path = `/${locale}/admin/materi`;
  const ready = getDatabaseReadiness();
  const counts = await getAdminCollectionCounts();
  return <>
    <header className="admin-page-heading">
      <div><p className="eyebrow">Koleksi mahasiswa</p><h1>Materi kuliah</h1><p>Buat draft dari judul, mata kuliah, dan satu berkas atau tautan. Metadata kelas dapat dilengkapi kemudian.</p></div>
      <div className="admin-page-actions">
        <span className="collection-count">{counts?.materials ?? "—"} record</span>
        <Link className="text-link" href={getRoutePath(locale, "materials")}>
          {locale === "id" ? "Lihat koleksi materi" : "View materials"}
        </Link>
      </div>
    </header>
    <section className="admin-editor-panel" id="editor" aria-labelledby="material-editor-title"><div className="admin-editor-intro"><p className="eyebrow">Draft baru</p><h2 id="material-editor-title">Tambah materi</h2>{!ready ? <p className="locked-help">Form dapat dicoba, tetapi penyimpanan aktif setelah rotasi kredensial database.</p> : null}</div><MaterialEditorForm ready={ready} returnPath={path} /></section>
    <section className="admin-empty compact"><span aria-hidden="true">{counts?.materials ?? "—"}</span><div><h2>{counts?.materials ? "Materi tersimpan" : "Belum ada materi"}</h2><p>{counts?.materials ? "Record tersedia di database. Daftar edit dan perubahan status menyusul pada tahap workflow editorial berikutnya." : "Materi yang disimpan akan muncul di sini sebagai draft privat."}</p></div></section>
  </>;
}
