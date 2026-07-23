import { MaterialEditorForm } from "@/components/admin/editor-forms";
import { getDatabaseReadiness } from "@/lib/content/review-data";
import { hasLocale } from "@/lib/i18n";

export default async function AdminMaterials({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: value } = await params;
  const locale = hasLocale(value) ? value : "id";
  const path = `/${locale}/admin/materi`;
  const ready = getDatabaseReadiness();
  return <>
    <header className="admin-page-heading"><div><p className="eyebrow">Koleksi mahasiswa</p><h1>Materi kuliah</h1><p>Buat draft dari judul, mata kuliah, dan satu berkas atau tautan. Metadata kelas dapat dilengkapi kemudian.</p></div><span className="collection-count">0 record</span></header>
    <section className="admin-editor-panel" id="editor" aria-labelledby="material-editor-title"><div className="admin-editor-intro"><p className="eyebrow">Draft baru</p><h2 id="material-editor-title">Tambah materi</h2>{!ready ? <p className="locked-help">Form dapat dicoba, tetapi penyimpanan aktif setelah rotasi kredensial database.</p> : null}</div><MaterialEditorForm ready={ready} returnPath={path} /></section>
    <section className="admin-empty compact"><span aria-hidden="true">00</span><div><h2>Belum ada materi</h2><p>Materi yang disimpan akan muncul di sini sebagai draft privat.</p></div></section>
  </>;
}
