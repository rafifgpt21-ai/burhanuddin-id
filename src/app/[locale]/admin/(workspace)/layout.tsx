import { redirect } from "next/navigation";

import { AdminShell } from "@/components/admin/admin-shell";
import { readAdminSession } from "@/lib/auth/session";
import { hasLocale } from "@/lib/i18n";

export const dynamic = "force-dynamic";
export const metadata = { robots: { index: false, follow: false } };

export default async function AdminWorkspaceLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<unknown>;
}) {
  const { locale } = (await params) as { locale?: string };
  if (!hasLocale(locale)) redirect("/id/admin/login");
  const session = await readAdminSession();
  if (!session) redirect(`/${locale}/admin/login`);

  return <AdminShell locale={locale} session={session}>{children}</AdminShell>;
}
