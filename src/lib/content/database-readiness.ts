export function getDatabaseReadiness() {
  return process.env.DATABASE_READY === "true";
}
