import "server-only";

import bcrypt from "bcryptjs";

import {
  checkLoginRateLimit,
  clearLoginFailures,
  registerLoginFailure,
} from "@/lib/auth/rate-limit";
import { prisma } from "@/lib/prisma";

export type CredentialResult =
  | { ok: true; id: string; email: string; name: string }
  | { ok: false; reason: "INVALID" | "LIMITED" | "NOT_CONFIGURED" | "UNAVAILABLE"; resetAt?: number };

export async function verifyAdminCredentials(
  email: string,
  password: string,
): Promise<CredentialResult> {
  if (process.env.DATABASE_READY !== "true") {
    return { ok: false, reason: "NOT_CONFIGURED" };
  }

  const limit = checkLoginRateLimit(email);
  if (!limit.allowed) {
    return { ok: false, reason: "LIMITED", resetAt: limit.resetAt };
  }

  const normalizedEmail = email.trim().toLowerCase();
  let user;
  try {
    user = await prisma.adminUser.findUnique({ where: { email: normalizedEmail } });
  } catch {
    return { ok: false, reason: "UNAVAILABLE" };
  }

  if (!user || user.role !== "ADMIN") {
    registerLoginFailure(email);
    return { ok: false, reason: "INVALID" };
  }

  const passwordMatches = await bcrypt.compare(password, user.passwordHash);
  if (!passwordMatches) {
    registerLoginFailure(email);
    return { ok: false, reason: "INVALID" };
  }

  clearLoginFailures(email);
  return {
    ok: true,
    id: user.id,
    email: user.email,
    name: user.name,
  };
}
