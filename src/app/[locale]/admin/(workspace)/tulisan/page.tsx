import Link from "next/link";

import { PostEditorForm } from "@/components/admin/editor-forms";
import { getAdminCollectionCounts } from "@/lib/content/admin-counts";
import { getDatabaseReadiness } from "@/lib/content/database-readiness";
import { getRoutePath, hasLocale } from "@/lib/i18n";

export default async function AdminPosts({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: value } = await params;
  const locale = hasLocale(value) ? value : "id";
  const path = `/${locale}/admin/tulisan`;
  const ready = getDatabaseReadiness();
  const counts = await getAdminCollectionCounts();

  return (
    <>
      <header className="admin-page-heading">
        <div>
          <p className="eyebrow">Ruang menulis</p>
          <h1>Tulisan</h1>
          <p>Mulai dari judul dan naskah. Ringkasan, topik, gambar, dan versi Inggris dapat ditambahkan kemudian.</p>
        </div>
        <div className="admin-page-actions">
          <span className="collection-count">{counts?.posts ?? "—"} record</span>
          <Link className="text-link" href={getRoutePath(locale, "posts")}>
            {locale === "id" ? "Lihat arsip tulisan" : "View writing archive"}
          </Link>
        </div>
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
        <span aria-hidden="true">{counts?.posts ?? "—"}</span>
        <div>
          <h2>{counts?.posts ? "Tulisan tersimpan" : "Belum ada tulisan"}</h2>
          <p>
            {counts?.posts
              ? "Record tersedia di database. Daftar edit dan perubahan status menyusul pada tahap workflow editorial berikutnya."
              : "Tulisan yang disimpan akan muncul di sini sebagai draft privat."}
          </p>
        </div>
      </section>
    </>
  );
}
