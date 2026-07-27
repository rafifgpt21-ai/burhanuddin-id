"use server";

import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";

import { canManageUsers } from "@/lib/auth/access";
import { readAdminSession } from "@/lib/auth/session";
import { hasLocale } from "@/lib/i18n";
import { prisma } from "@/lib/prisma";
import {
  createAdminUserSchema,
  updateManagedUserSchema,
  updateOwnAccountSchema,
} from "@/lib/validation/admin-users";

type FieldErrors = Record<string, string[] | undefined>;

export type UserActionState = {
  ok?: boolean;
  message?: string;
  errors?: FieldErrors;
};

function text(formData: FormData, name: string) {
  const value = formData.get(name);
  return typeof value === "string" ? value : "";
}

function isUniqueConflict(error: unknown) {
  return Boolean(
    error &&
      typeof error === "object" &&
      "code" in error &&
      error.code === "P2002",
  );
}

function localeFrom(formData: FormData) {
  const locale = text(formData, "locale");
  return hasLocale(locale) ? locale : "id";
}

export async function createUserAction(
  _state: UserActionState,
  formData: FormData,
): Promise<UserActionState> {
  const session = await readAdminSession();
  if (!session || !canManageUsers(session.role)) {
    return { message: "Hanya super admin yang dapat menambahkan pengguna." };
  }

  const parsed = createAdminUserSchema.safeParse({
    name: text(formData, "name"),
    username: text(formData, "username"),
    password: text(formData, "password"),
    passwordConfirmation: text(formData, "passwordConfirmation"),
    role: text(formData, "role"),
  });

  if (!parsed.success) {
    return { errors: parsed.error.flatten().fieldErrors };
  }

  try {
    await prisma.adminUser.create({
      data: {
        name: parsed.data.name,
        username: parsed.data.username,
        passwordHash: await bcrypt.hash(parsed.data.password, 12),
        role: parsed.data.role,
      },
    });
  } catch (error) {
    if (isUniqueConflict(error)) {
      return { errors: { username: ["Username sudah digunakan."] } };
    }
    return { message: "Pengguna belum dapat ditambahkan. Coba kembali." };
  }

  revalidatePath(`/${localeFrom(formData)}/admin/users`);
  return { ok: true, message: "Pengguna baru ditambahkan." };
}

export async function updateManagedUserAction(
  _state: UserActionState,
  formData: FormData,
): Promise<UserActionState> {
  const session = await readAdminSession();
  if (!session || !canManageUsers(session.role)) {
    return { message: "Hanya super admin yang dapat mengelola pengguna." };
  }

  const parsed = updateManagedUserSchema.safeParse({
    userId: text(formData, "userId"),
    name: text(formData, "name"),
    username: text(formData, "username"),
    newPassword: text(formData, "newPassword"),
    passwordConfirmation: text(formData, "passwordConfirmation"),
    role: text(formData, "role"),
  });

  if (!parsed.success) {
    return { errors: parsed.error.flatten().fieldErrors };
  }
  if (parsed.data.userId === session.id) {
    return { message: "Gunakan menu Akun saya untuk mengubah akun Anda sendiri." };
  }

  let target;
  try {
    target = await prisma.adminUser.findUnique({
      where: { id: parsed.data.userId },
      select: { id: true, role: true },
    });
  } catch {
    return { message: "Daftar pengguna belum dapat dijangkau. Coba kembali." };
  }
  if (!target) return { message: "Pengguna tidak ditemukan." };
  if (target.role === "SUPER_ADMIN") {
    return { message: "Akun super admin hanya dapat diubah dari Akun saya." };
  }

  const updateData = {
    name: parsed.data.name,
    username: parsed.data.username,
    role: parsed.data.role,
    ...(parsed.data.newPassword
      ? { passwordHash: await bcrypt.hash(parsed.data.newPassword, 12) }
      : {}),
  };

  try {
    await prisma.$transaction([
      prisma.adminUser.update({
        where: { id: target.id },
        data: updateData,
      }),
      prisma.adminSession.deleteMany({
        where: { adminUserId: target.id },
      }),
    ]);
  } catch (error) {
    if (isUniqueConflict(error)) {
      return { errors: { username: ["Username sudah digunakan."] } };
    }
    return { message: "Perubahan pengguna belum dapat disimpan. Coba kembali." };
  }

  revalidatePath(`/${localeFrom(formData)}/admin/users`);
  return {
    ok: true,
    message: "Perubahan disimpan. Sesi pengguna tersebut telah dicabut.",
  };
}

export async function revokeManagedUserSessionsAction(formData: FormData) {
  const session = await readAdminSession();
  if (!session || !canManageUsers(session.role)) return;
  const userId = text(formData, "userId");
  if (!/^[a-f0-9]{24}$/i.test(userId) || userId === session.id) return;
  const target = await prisma.adminUser.findUnique({
    where: { id: userId },
    select: { role: true },
  });
  if (!target || target.role === "SUPER_ADMIN") return;
  await prisma.adminSession.deleteMany({ where: { adminUserId: userId } });
  revalidatePath(`/${localeFrom(formData)}/admin/users`);
}

export async function updateOwnAccountAction(
  _state: UserActionState,
  formData: FormData,
): Promise<UserActionState> {
  const session = await readAdminSession();
  if (!session) return { message: "Sesi berakhir. Masuk kembali untuk melanjutkan." };

  const parsed = updateOwnAccountSchema.safeParse({
    username: text(formData, "username"),
    currentPassword: text(formData, "currentPassword"),
    newPassword: text(formData, "newPassword"),
    passwordConfirmation: text(formData, "passwordConfirmation"),
  });

  if (!parsed.success) {
    return { errors: parsed.error.flatten().fieldErrors };
  }

  let user;
  try {
    user = await prisma.adminUser.findUnique({
      where: { id: session.id },
      select: { passwordHash: true },
    });
  } catch {
    return { message: "Akun belum dapat dijangkau. Coba kembali." };
  }
  if (!user) return { message: "Akun tidak ditemukan." };

  const passwordMatches = await bcrypt.compare(
    parsed.data.currentPassword,
    user.passwordHash,
  );
  if (!passwordMatches) {
    return { errors: { currentPassword: ["Password saat ini tidak cocok."] } };
  }

  const updateData = {
    username: parsed.data.username,
    ...(parsed.data.newPassword
      ? { passwordHash: await bcrypt.hash(parsed.data.newPassword, 12) }
      : {}),
  };

  try {
    await prisma.$transaction([
      prisma.adminUser.update({
        where: { id: session.id },
        data: updateData,
      }),
      prisma.adminSession.deleteMany({
        where: {
          adminUserId: session.id,
          id: { not: session.sessionId },
        },
      }),
    ]);
  } catch (error) {
    if (isUniqueConflict(error)) {
      return { errors: { username: ["Username sudah digunakan."] } };
    }
    return { message: "Perubahan akun belum dapat disimpan. Coba kembali." };
  }

  revalidatePath(`/${localeFrom(formData)}/admin/account`);
  return {
    ok: true,
    message: parsed.data.newPassword
      ? "Username dan password diperbarui. Sesi lain telah dicabut."
      : "Username diperbarui. Sesi lain telah dicabut.",
  };
}
