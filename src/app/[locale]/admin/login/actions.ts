"use server";

import { redirect } from "next/navigation";
import { z } from "zod";

import { verifyAdminCredentials } from "@/lib/auth/credentials";
import { createAdminSession } from "@/lib/auth/session";
import { hasLocale } from "@/lib/i18n";

export type LoginState = {
  message?: string;
  errors?: { email?: string[]; password?: string[] };
};

const loginSchema = z.object({
  email: z.email("Masukkan alamat email yang valid.").trim(),
  password: z.string().min(1, "Kata sandi wajib diisi."),
  locale: z.string(),
});

export async function loginAction(
  _previousState: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
    locale: formData.get("locale"),
  });

  if (!parsed.success) {
    return { errors: parsed.error.flatten().fieldErrors };
  }

  const locale = hasLocale(parsed.data.locale) ? parsed.data.locale : "id";
  const result = await verifyAdminCredentials(parsed.data.email, parsed.data.password);

  if (!result.ok) {
    if (result.reason === "NOT_CONFIGURED") {
      return {
        message:
          "Akses admin belum siap. Pastikan database sudah diaktifkan dan user admin telah di-seed.",
      };
    }
    if (result.reason === "UNAVAILABLE") {
      return { message: "Database admin sedang tidak dapat dijangkau. Coba kembali nanti." };
    }
    if (result.reason === "LIMITED") {
      return { message: "Terlalu banyak percobaan. Coba kembali dalam 15 menit." };
    }
    return { message: "Email atau kata sandi tidak cocok." };
  }

  await createAdminSession({
    id: result.id,
    email: result.email,
    name: result.name,
    role: "ADMIN",
  });
  redirect(`/${locale}/admin`);
}
