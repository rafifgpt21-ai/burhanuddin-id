import Link from "next/link";

import { HomepageEditor } from "@/components/admin/homepage-editor";
import { getHomepageFallback } from "@/lib/content/homepage";
import { getDatabaseReadiness } from "@/lib/content/database-readiness";
import { prisma } from "@/lib/prisma";
import { homepageInputSchema } from "@/lib/validation/content";
import { hasLocale } from "@/lib/i18n";

export default async function HomepageDraftPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: value } = await params;
  const locale = hasLocale(value) ? value : "id";
  const ready = getDatabaseReadiness();
  const record = ready
    ? await prisma.homepageContent.findUnique({ where: { key: "main" } })
    : null;
  const parsed = homepageInputSchema.safeParse(record?.payload);
  const initial = parsed.success ? parsed.data : getHomepageFallback();

  return (
    <>
      <header className="admin-page-heading">
        <div>
          <p className="eyebrow">Draft beranda</p>
          <h1>Susun konten beranda</h1>
          <p>
            Ikuti urutan halaman publik. Simpan sebagai draft, preview, lalu
            terbitkan saat siap.
          </p>
        </div>
        <div className="admin-page-actions">
          <Link className="text-link" href={`/${locale}/admin/beranda`}>
            Kembali ke peta beranda
          </Link>
        </div>
      </header>
      <HomepageEditor
        initial={initial}
        locale={locale}
        ready={ready}
        recordId={record?.id}
        status={record?.status}
        updatedAt={record?.updatedAt}
      />
    </>
  );
}
