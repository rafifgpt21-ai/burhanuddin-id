export type EditorialDiff = {
  field: string;
  before: string;
  after: string;
  change: "added" | "removed" | "changed";
};

function summarize(value: unknown): string {
  if (value === null || value === undefined || value === "") return "—";
  if (typeof value === "string" || typeof value === "number") return String(value);
  if (typeof value === "boolean") return value ? "Ya" : "Tidak";
  if (Array.isArray(value)) {
    if (value.every((item) => item && typeof item === "object" && "type" in item)) {
      const labels = value.map((item) => {
        const block = item as { type?: string; text?: string; label?: string; title?: string };
        const preview = block.text ?? block.label ?? block.title ?? "";
        return `${block.type ?? "block"}${preview ? `: ${preview.slice(0, 48)}` : ""}`;
      });
      return `${value.length} blok · ${labels.join(" | ")}`;
    }
    return value.map((item) => summarize(item)).join(" · ") || "—";
  }
  if (typeof value === "object") {
    return Object.entries(value as Record<string, unknown>)
      .map(([key, item]) => `${key}: ${summarize(item)}`)
      .join(" · ");
  }
  return String(value);
}

export function diffEditorialSnapshots(
  before: unknown,
  after: unknown,
): EditorialDiff[] {
  const previous =
    before && typeof before === "object" ? (before as Record<string, unknown>) : {};
  const next =
    after && typeof after === "object" ? (after as Record<string, unknown>) : {};
  const keys = Array.from(new Set([...Object.keys(previous), ...Object.keys(next)])).sort();

  return keys.flatMap((field) => {
    const beforeText = summarize(previous[field]);
    const afterText = summarize(next[field]);
    if (beforeText === afterText) return [];
    return [{
      field,
      before: beforeText,
      after: afterText,
      change:
        beforeText === "—" ? "added" : afterText === "—" ? "removed" : "changed",
    } satisfies EditorialDiff];
  });
}
