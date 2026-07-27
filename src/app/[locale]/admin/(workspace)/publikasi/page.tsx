import { EditorialCollection } from "@/components/admin/editorial-collection";
import { HomepagePublicationSelection } from "@/components/admin/homepage-publication-selection";
import { getRoutePath, hasLocale } from "@/lib/i18n";

export default async function AdminPublications({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const [{ locale: value }, filters] = await Promise.all([params, searchParams]);
  const locale = hasLocale(value) ? value : "id";
  return (
    <>
    <EditorialCollection
      locale={locale}
      kind="publication"
      eyebrow={locale === "id" ? "Rekam ilmiah" : "Scholarly record"}
      title={locale === "id" ? "Publikasi" : "Publications"}
      description={locale === "id" ? "Kelola bibliografi tanpa mengubah urutan penulis atau wording sumber kanonis." : "Manage source-faithful bibliographic records."}
      publicHref={getRoutePath(locale, "publications")}
      filters={{
        editorialError: filters.editorialError,
        q: filters.q,
        status: filters.status as "DRAFT" | "PUBLISHED" | "ARCHIVED" | undefined,
        sort: filters.sort as "updated-desc" | "updated-asc" | undefined,
        page: Number(filters.page) || 1,
      }}
    />
    <HomepagePublicationSelection locale={locale} />
    </>
  );
}
