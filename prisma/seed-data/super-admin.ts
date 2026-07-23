import type { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { z } from "zod";

import {
  adminPasswordSchema,
  adminUsernameSchema,
} from "../../src/lib/validation/admin-users";

const superAdminSeedSchema = z.object({
  name: z.string().trim().min(2).max(80),
  username: adminUsernameSchema,
  password: adminPasswordSchema,
});

export type SuperAdminSeed = z.infer<typeof superAdminSeedSchema>;

export function readSuperAdminSeed({
  required,
}: {
  required: boolean;
}): SuperAdminSeed | null {
  const username = process.env.SEED_SUPER_ADMIN_USERNAME;
  const password = process.env.SEED_SUPER_ADMIN_PASSWORD;
  const name = process.env.SEED_SUPER_ADMIN_NAME?.trim() || "Super Admin";

  if (!username && !password) {
    if (required) {
      throw new Error(
        "SEED_SUPER_ADMIN_USERNAME dan SEED_SUPER_ADMIN_PASSWORD wajib diberikan.",
      );
    }
    return null;
  }
  if (!username || !password) {
    throw new Error(
      "SEED_SUPER_ADMIN_USERNAME dan SEED_SUPER_ADMIN_PASSWORD harus diberikan bersama-sama.",
    );
  }

  const parsed = superAdminSeedSchema.safeParse({ name, username, password });
  if (!parsed.success) {
    throw new Error(
      `Input super admin tidak valid: ${parsed.error.issues[0]?.message ?? "periksa kembali input."}`,
    );
  }
  return parsed.data;
}

export async function upsertSuperAdmin(
  prisma: PrismaClient,
  input: SuperAdminSeed,
) {
  const passwordHash = await bcrypt.hash(input.password, 12);
  return prisma.adminUser.upsert({
    where: { username: input.username },
    update: {
      name: input.name,
      passwordHash,
      role: "SUPER_ADMIN",
    },
    create: {
      name: input.name,
      username: input.username,
      passwordHash,
      role: "SUPER_ADMIN",
    },
  });
}
