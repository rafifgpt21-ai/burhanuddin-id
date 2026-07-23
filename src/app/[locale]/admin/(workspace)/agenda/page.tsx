import { AgendaEditorForm } from "@/components/admin/editor-forms";
import { getDatabaseReadiness } from "@/lib/content/review-data";
import { hasLocale } from "@/lib/i18n";

export default async function AdminAgenda({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: value } = await params;
  const locale = hasLocale(value) ? value : "id";
  const path = `/${locale}/admin/agenda`;
  const ready = getDatabaseReadiness();
  return <>
    <header className="admin-page-heading"><div><p className="eyebrow">Kalender editorial</p><h1>Agenda</h1><p>Judul, deskripsi, dan waktu mulai sudah cukup untuk membuat draft agenda dalam WIB.</p></div><span className="collection-count">0 record</span></header>
    <section className="admin-editor-panel" id="editor" aria-labelledby="agenda-editor-title"><div className="admin-editor-intro"><p className="eyebrow">Draft baru</p><h2 id="agenda-editor-title">Tambah agenda</h2>{!ready ? <p className="locked-help">Form dapat dicoba, tetapi penyimpanan aktif setelah rotasi kredensial database.</p> : null}</div><AgendaEditorForm ready={ready} returnPath={path} /></section>
    <section className="admin-empty compact"><span aria-hidden="true">00</span><div><h2>Belum ada agenda nyata</h2><p>Agenda yang disimpan akan muncul di sini sebagai draft privat.</p></div></section>
  </>;
}
