import { EditorialCollection } from "@/components/admin/editorial-collection";
import { getRoutePath, hasLocale } from "@/lib/i18n";

export default async function AdminMaterials({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const [{ locale: value }, filters] = await Promise.all([params, searchParams]);
  const locale = hasLocale(value) ? value : "id";
  return (
    <EditorialCollection
      locale={locale}
      kind="material"
      eyebrow={locale === "id" ? "Koleksi mahasiswa" : "Student collection"}
      title={locale === "id" ? "Materi kuliah" : "Course materials"}
      description={locale === "id" ? "Kelola berkas, metadata kelas, dan hak distribusi; terjemahan Inggris opsional." : "Manage files, course metadata, and distribution rights; English translations are optional."}
      publicHref={getRoutePath(locale, "materials")}
      filters={{
        editorialError: filters.editorialError,
        q: filters.q,
        status: filters.status as "DRAFT" | "PUBLISHED" | "ARCHIVED" | undefined,
        sort: filters.sort as "updated-desc" | "updated-asc" | undefined,
        page: Number(filters.page) || 1,
      }}
    />
  );
}
