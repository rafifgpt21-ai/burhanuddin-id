import { createHash } from "node:crypto";

type Attempt = { count: number; resetAt: number };

const windowMs = 15 * 60 * 1000;
const maximumAttempts = 5;

const globalForRateLimit = globalThis as unknown as {
  adminLoginAttempts?: Map<string, Attempt>;
};

const attempts =
  globalForRateLimit.adminLoginAttempts ?? new Map<string, Attempt>();

if (process.env.NODE_ENV !== "production") {
  globalForRateLimit.adminLoginAttempts = attempts;
}

function keyFor(identifier: string) {
  return createHash("sha256").update(identifier.trim().toLowerCase()).digest("hex");
}

export function checkLoginRateLimit(identifier: string) {
  const key = keyFor(identifier);
  const now = Date.now();
  const current = attempts.get(key);

  if (!current || current.resetAt <= now) {
    attempts.set(key, { count: 0, resetAt: now + windowMs });
    return { allowed: true, remaining: maximumAttempts, resetAt: now + windowMs };
  }

  return {
    allowed: current.count < maximumAttempts,
    remaining: Math.max(0, maximumAttempts - current.count),
    resetAt: current.resetAt,
  };
}

export function registerLoginFailure(identifier: string) {
  const key = keyFor(identifier);
  const now = Date.now();
  const current = attempts.get(key);

  if (!current || current.resetAt <= now) {
    attempts.set(key, { count: 1, resetAt: now + windowMs });
    return;
  }

  current.count += 1;
  attempts.set(key, current);
}

export function clearLoginFailures(identifier: string) {
  attempts.delete(keyFor(identifier));
}
