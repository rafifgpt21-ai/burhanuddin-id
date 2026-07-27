import { EditorialCollection } from "@/components/admin/editorial-collection";
import { getRoutePath, hasLocale } from "@/lib/i18n";
import { parseEditorialFilters } from "@/lib/content/admin-records";

export default async function AdminPosts({
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
      kind="post"
      eyebrow={locale === "id" ? "Ruang menulis" : "Writing desk"}
      title={locale === "id" ? "Tulisan" : "Writing"}
      description={locale === "id" ? "Tulis dan kelola esai; seluruh terjemahan Inggris bersifat opsional." : "Write and manage essays; English translations are optional."}
      publicHref={getRoutePath(locale, "posts")}
      filters={parseEditorialFilters(filters)}
    />
  );
}
