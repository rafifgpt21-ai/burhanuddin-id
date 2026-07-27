import { ExistingEditorialPage } from "@/components/admin/editor-page";
import { hasLocale } from "@/lib/i18n";
export default async function Page({ params }: { params: Promise<{ locale: string; id: string }> }) {
  const { locale, id } = await params;
  return <ExistingEditorialPage kind="publication" locale={hasLocale(locale) ? locale : "id"} id={id} />;
}
