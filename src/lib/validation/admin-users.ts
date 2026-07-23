import { z } from "zod";

export const adminUsernameSchema = z
  .string()
  .trim()
  .toLowerCase()
  .min(3, "Username minimal 3 karakter.")
  .max(32, "Username maksimal 32 karakter.")
  .regex(
    /^[a-z0-9](?:[a-z0-9._-]*[a-z0-9])?$/,
    "Gunakan huruf kecil, angka, titik, garis bawah, atau tanda hubung.",
  );

export const adminPasswordSchema = z
  .string()
  .min(12, "Password minimal 12 karakter.")
  .refine((value) => value.trim().length > 0, "Password tidak boleh hanya berisi spasi.")
  .refine(
    (value) => Buffer.byteLength(value, "utf8") <= 72,
    "Password maksimal 72 byte.",
  );

const editableRoleSchema = z.enum(["ADMIN", "EDITOR"]);
const optionalNewPasswordSchema = z.union([z.literal(""), adminPasswordSchema]);

export const createAdminUserSchema = z
  .object({
    name: z.string().trim().min(2, "Nama minimal 2 karakter.").max(80),
    username: adminUsernameSchema,
    password: adminPasswordSchema,
    passwordConfirmation: z.string(),
    role: editableRoleSchema,
  })
  .refine((value) => value.password === value.passwordConfirmation, {
    message: "Konfirmasi password tidak cocok.",
    path: ["passwordConfirmation"],
  });

export const updateManagedUserSchema = z
  .object({
    userId: z.string().min(1),
    name: z.string().trim().min(2, "Nama minimal 2 karakter.").max(80),
    username: adminUsernameSchema,
    newPassword: optionalNewPasswordSchema,
    passwordConfirmation: z.string(),
    role: editableRoleSchema,
  })
  .refine((value) => value.newPassword === value.passwordConfirmation, {
    message: "Konfirmasi password tidak cocok.",
    path: ["passwordConfirmation"],
  });

export const updateOwnAccountSchema = z
  .object({
    username: adminUsernameSchema,
    currentPassword: z.string().min(1, "Password saat ini wajib diisi."),
    newPassword: optionalNewPasswordSchema,
    passwordConfirmation: z.string(),
  })
  .refine((value) => value.newPassword === value.passwordConfirmation, {
    message: "Konfirmasi password baru tidak cocok.",
    path: ["passwordConfirmation"],
  });
