import "server-only";

export function isExpiredPreview(value: number) {
  return !Number.isFinite(value) || value < Date.now();
}
