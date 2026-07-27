import { ExistingEditorialPage } from "@/components/admin/editor-page";
import { hasLocale } from "@/lib/i18n";

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string; id: string }>;
  searchParams: Promise<{ returnTo?: string }>;
}) {
  const [{ locale, id }, query] = await Promise.all([params, searchParams]);
  return <ExistingEditorialPage kind="publication" locale={hasLocale(locale) ? locale : "id"} id={id} returnTo={query.returnTo} />;
}
