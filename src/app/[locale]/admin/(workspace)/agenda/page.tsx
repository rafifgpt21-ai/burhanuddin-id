import { EditorialCollection } from "@/components/admin/editorial-collection";
import { getRoutePath, hasLocale } from "@/lib/i18n";
import { parseEditorialFilters } from "@/lib/content/admin-records";

export default async function AdminAgenda({
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
      kind="agenda"
      eyebrow={locale === "id" ? "Kiprah · Agenda publik" : "Outreach · Public agenda"}
      title="Agenda"
      description={locale === "id" ? "Kelola kegiatan dan status; seluruh terjemahan Inggris bersifat opsional." : "Manage events and their lifecycle; English translations are optional."}
      publicHref={`${getRoutePath(locale, "outreach")}#agenda`}
      filters={parseEditorialFilters(filters)}
    />
  );
}
