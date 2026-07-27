import { HomepageManagement } from "@/components/admin/homepage-management";
import { hasLocale } from "@/lib/i18n";

export default async function AdminHomepage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const [{ locale: value }, filters] = await Promise.all([params, searchParams]);
  const locale = hasLocale(value) ? value : "id";

  return (
    <HomepageManagement
      locale={locale}
      feedback={{
        editorialError: filters.editorialError,
        selectionError: filters.selectionError,
        selectionSaved: filters.selectionSaved,
      }}
    />
  );
}
