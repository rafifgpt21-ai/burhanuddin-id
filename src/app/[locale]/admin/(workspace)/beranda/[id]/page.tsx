import { notFound } from "next/navigation";
import Link from "next/link";

import { HomepageEditor } from "@/components/admin/homepage-editor";
import { restoreRevisionAction } from "@/app/[locale]/admin/(workspace)/editor-actions";
import { getDatabaseReadiness } from "@/lib/content/database-readiness";
import { prisma } from "@/lib/prisma";
import { homepageInputSchema } from "@/lib/validation/content";
import { hasLocale } from "@/lib/i18n";

export default async function HomepageEditPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale: value, id } = await params;
  const locale = hasLocale(value) ? value : "id";
  if (!getDatabaseReadiness()) notFound();
  const [record, revisions] = await Promise.all([
    prisma.homepageContent.findUnique({ where: { id } }),
    prisma.contentRevision.findMany({
      where: { kind: "HOMEPAGE", recordId: id },
      orderBy: { version: "desc" },
      take: 10,
    }),
  ]);
  const parsed = homepageInputSchema.safeParse(record?.payload);
  if (!record || !parsed.success) notFound();
  return (
    <>
      <header className="admin-page-heading">
        <div>
          <p className="eyebrow">Draft beranda</p>
          <h1>Sunting konten beranda</h1>
          <p>
            Ikuti urutan halaman publik. Versi yang sedang terbit tetap aktif
            sampai perubahan diterbitkan.
          </p>
        </div>
        <div className="admin-page-actions">
          <span className={`status-pill is-${record.status.toLowerCase()}`}>
            {record.status}
          </span>
          <Link className="text-link" href={`/${locale}/admin/beranda`}>
            Kembali ke peta beranda
          </Link>
        </div>
      </header>
      <HomepageEditor
        initial={parsed.data}
        locale={locale}
        ready
        recordId={record.id}
        status={record.status}
        updatedAt={record.updatedAt}
      />
      {revisions.length ? (
        <section className="revision-panel">
          <div>
            <p className="eyebrow">Riwayat terbit</p>
            <h2>Versi beranda sebelumnya</h2>
            <p>
              Pemulihan menyalin snapshot menjadi draft; versi publik tetap
              aktif sampai diterbitkan lagi.
            </p>
          </div>
          <div>
            {revisions.map((revision) => (
              <form action={restoreRevisionAction} key={revision.id}>
                <input name="kind" type="hidden" value="homepage" />
                <input name="id" type="hidden" value={record.id} />
                <input name="locale" type="hidden" value={locale} />
                <input
                  name="version"
                  type="hidden"
                  value={revision.version}
                />
                <span>Versi {revision.version}</span>
                <time>
                  {new Intl.DateTimeFormat(
                    locale === "id" ? "id-ID" : "en-GB",
                    { dateStyle: "medium", timeStyle: "short" },
                  ).format(revision.createdAt)}
                </time>
                <button type="submit">Pulihkan sebagai draft</button>
              </form>
            ))}
          </div>
        </section>
      ) : null}
    </>
  );
}
