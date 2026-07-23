"use server";

import { redirect } from "next/navigation";

import { deleteAdminSession } from "@/lib/auth/session";
import { hasLocale } from "@/lib/i18n";

export async function logoutAction(formData: FormData) {
  const value = formData.get("locale");
  const locale = typeof value === "string" && hasLocale(value) ? value : "id";
  await deleteAdminSession();
  redirect(`/${locale}/admin/login`);
}
