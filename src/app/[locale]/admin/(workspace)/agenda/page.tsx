import { AgendaEditorForm } from "@/components/admin/editor-forms";
import { getDatabaseReadiness } from "@/lib/content/review-data";
import { hasLocale } from "@/lib/i18n";

export default async function AdminAgenda({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: value } = await params;
  const locale = hasLocale(value) ? value : "id";
  const path = `/${locale}/admin/agenda`;
  const ready = getDatabaseReadiness();
  return <>
    <header className="admin-page-heading"><div><p className="eyebrow">Kalender editorial</p><h1>Agenda</h1><p>Kelola agenda ringan dalam WIB, tanpa registrasi, tiket, atau pelacakan peserta.</p></div><span className="collection-count">0 record</span></header>
    <section className="admin-empty"><span aria-hidden="true">00</span><div><h2>Belum ada agenda nyata</h2><p>Tidak ada acara yang dibuat dari asumsi. Tambahkan agenda setelah judul, waktu, lokasi, dan sumber disetujui.</p></div></section>
    <details className="editor-disclosure" open><summary>Tambah agenda</summary>{!ready ? <p className="locked-help">Form dapat ditinjau, tetapi baru aktif setelah rotasi kredensial database.</p> : null}<AgendaEditorForm ready={ready} returnPath={path} /></details>
  </>;
}
