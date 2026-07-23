import { MaterialEditorForm } from "@/components/admin/editor-forms";
import { getDatabaseReadiness } from "@/lib/content/review-data";
import { hasLocale } from "@/lib/i18n";

export default async function AdminMaterials({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: value } = await params;
  const locale = hasLocale(value) ? value : "id";
  const path = `/${locale}/admin/materi`;
  const ready = getDatabaseReadiness();
  return <>
    <header className="admin-page-heading"><div><p className="eyebrow">Koleksi mahasiswa</p><h1>Materi kuliah</h1><p>Koleksi sengaja kosong sampai berkas, metadata mata kuliah, dan keputusan hak tersedia.</p></div><span className="collection-count">0 record</span></header>
    <section className="admin-empty"><span aria-hidden="true">00</span><div><h2>Belum ada materi</h2><p>Unggah materi pertama setelah database siap. Setiap materi membutuhkan deskripsi, semester, target berkas/tautan, dan catatan hak penggunaan.</p></div></section>
    <details className="editor-disclosure" open><summary>Tambah materi</summary>{!ready ? <p className="locked-help">Form dapat ditinjau, tetapi baru aktif setelah rotasi kredensial database.</p> : null}<MaterialEditorForm ready={ready} returnPath={path} /></details>
  </>;
}
