import "server-only";

import { createHash, randomBytes } from "node:crypto";

import { cookies } from "next/headers";

import { prisma } from "@/lib/prisma";

export const adminSessionCookie = "bm_admin_session";
const sessionDurationSeconds = 8 * 60 * 60;

export type AdminSession = {
  id: string;
  email: string;
  name: string;
  role: "ADMIN";
};

function hashToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

export function getAuthReadiness() {
  return { ready: process.env.DATABASE_READY === "true" };
}

export async function createAdminSession(session: AdminSession) {
  if (process.env.DATABASE_READY !== "true") {
    throw new Error("DATABASE_NOT_READY");
  }

  const token = randomBytes(32).toString("base64url");
  const expiresAt = new Date(Date.now() + sessionDurationSeconds * 1000);

  await prisma.$transaction([
    prisma.adminSession.deleteMany({
      where: { adminUserId: session.id, expiresAt: { lte: new Date() } },
    }),
    prisma.adminSession.create({
      data: {
        tokenHash: hashToken(token),
        adminUserId: session.id,
        expiresAt,
      },
    }),
  ]);

  const store = await cookies();
  store.set(adminSessionCookie, token, {
    httpOnly: true,
    maxAge: sessionDurationSeconds,
    path: "/",
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
  });
}

export async function readAdminSession(): Promise<AdminSession | null> {
  if (process.env.DATABASE_READY !== "true") return null;

  const token = (await cookies()).get(adminSessionCookie)?.value;
  if (!token) return null;

  const session = await prisma.adminSession.findUnique({
    where: { tokenHash: hashToken(token) },
    include: { adminUser: true },
  });

  if (!session || session.expiresAt <= new Date() || session.adminUser.role !== "ADMIN") {
    if (session) {
      await prisma.adminSession.delete({ where: { id: session.id } });
    }
    return null;
  }

  return {
    id: session.adminUser.id,
    email: session.adminUser.email,
    name: session.adminUser.name,
    role: "ADMIN",
  };
}

export async function deleteAdminSession() {
  const store = await cookies();
  const token = store.get(adminSessionCookie)?.value;
  if (token && process.env.DATABASE_READY === "true") {
    await prisma.adminSession.deleteMany({
      where: { tokenHash: hashToken(token) },
    });
  }
  store.delete(adminSessionCookie);
}
