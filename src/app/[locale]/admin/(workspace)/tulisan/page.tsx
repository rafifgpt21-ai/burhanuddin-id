import { PostEditorForm } from "@/components/admin/editor-forms";
import { getDatabaseReadiness } from "@/lib/content/review-data";
import { hasLocale } from "@/lib/i18n";

export default async function AdminPosts({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: value } = await params;
  const locale = hasLocale(value) ? value : "id";
  const path = `/${locale}/admin/tulisan`;
  const ready = getDatabaseReadiness();

  return (
    <>
      <header className="admin-page-heading">
        <div>
          <p className="eyebrow">Ruang menulis</p>
          <h1>Tulisan</h1>
          <p>Mulai dari judul dan naskah. Ringkasan, topik, gambar, dan versi Inggris dapat ditambahkan kemudian.</p>
        </div>
        <span className="collection-count">0 record</span>
      </header>

      <section className="admin-editor-panel" id="editor" aria-labelledby="post-editor-title">
        <div className="admin-editor-intro">
          <p className="eyebrow">Draft baru</p>
          <h2 id="post-editor-title">Tulis konten</h2>
          {!ready ? (
            <p className="locked-help">Form dapat dicoba, tetapi penyimpanan aktif setelah rotasi kredensial database.</p>
          ) : null}
        </div>
        <PostEditorForm ready={ready} returnPath={path} />
      </section>

      <section className="admin-empty compact">
        <span aria-hidden="true">00</span>
        <div>
          <h2>Belum ada tulisan</h2>
          <p>Tulisan yang disimpan akan muncul di sini sebagai draft privat.</p>
        </div>
      </section>
    </>
  );
}
