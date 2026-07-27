import { NewEditorialPage } from "@/components/admin/editor-page";
import { hasLocale } from "@/lib/i18n";

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ returnTo?: string }>;
}) {
  const [{ locale }, query] = await Promise.all([params, searchParams]);
  return <NewEditorialPage kind="post" locale={hasLocale(locale) ? locale : "id"} returnTo={query.returnTo} />;
}
