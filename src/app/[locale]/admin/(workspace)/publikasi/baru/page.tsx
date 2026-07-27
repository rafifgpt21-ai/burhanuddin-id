import { NewEditorialPage } from "@/components/admin/editor-page";
import { hasLocale } from "@/lib/i18n";
export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return <NewEditorialPage kind="publication" locale={hasLocale(locale) ? locale : "id"} />;
}
