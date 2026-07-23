import "server-only";

import bcrypt from "bcryptjs";

import {
  checkLoginRateLimit,
  clearLoginFailures,
  registerLoginFailure,
} from "@/lib/auth/rate-limit";
import { canAccessAdmin, type AdminRoleName } from "@/lib/auth/access";
import { prisma } from "@/lib/prisma";

export type CredentialResult =
  | { ok: true; id: string; username: string; name: string; role: AdminRoleName }
  | { ok: false; reason: "INVALID" | "LIMITED" | "NOT_CONFIGURED" | "UNAVAILABLE"; resetAt?: number };

export async function verifyAdminCredentials(
  username: string,
  password: string,
): Promise<CredentialResult> {
  if (process.env.DATABASE_READY !== "true") {
    return { ok: false, reason: "NOT_CONFIGURED" };
  }

  const normalizedUsername = username.trim().toLowerCase();
  const limit = checkLoginRateLimit(normalizedUsername);
  if (!limit.allowed) {
    return { ok: false, reason: "LIMITED", resetAt: limit.resetAt };
  }

  let user;
  try {
    user = await prisma.adminUser.findUnique({ where: { username: normalizedUsername } });
  } catch {
    return { ok: false, reason: "UNAVAILABLE" };
  }

  if (!user || !canAccessAdmin(user.role)) {
    registerLoginFailure(normalizedUsername);
    return { ok: false, reason: "INVALID" };
  }

  const passwordMatches = await bcrypt.compare(password, user.passwordHash);
  if (!passwordMatches) {
    registerLoginFailure(normalizedUsername);
    return { ok: false, reason: "INVALID" };
  }

  clearLoginFailures(normalizedUsername);
  return {
    ok: true,
    id: user.id,
    username: user.username,
    name: user.name,
    role: user.role,
  };
}
