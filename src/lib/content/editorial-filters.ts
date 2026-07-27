export type EditorialFilters = {
  editorialError?: string;
  editorialNotice?: string;
  q?: string;
  status?: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  changed?: boolean;
  editor?: string;
  page?: number;
  sort?: "updated-desc" | "updated-asc" | "title";
};

export function parseEditorialFilters(
  values: Record<string, string | undefined>,
): EditorialFilters {
  const status = ["DRAFT", "PUBLISHED", "ARCHIVED"].includes(values.status ?? "")
    ? (values.status as EditorialFilters["status"])
    : undefined;
  const sort = ["updated-desc", "updated-asc", "title"].includes(values.sort ?? "")
    ? (values.sort as EditorialFilters["sort"])
    : undefined;
  const changed =
    values.changed === "true"
      ? true
      : values.changed === "false"
        ? false
        : undefined;
  return {
    editorialError: values.editorialError,
    editorialNotice: values.editorialNotice,
    q: values.q?.trim().slice(0, 180) || undefined,
    status,
    changed,
    editor: /^[a-f0-9]{24}$/i.test(values.editor ?? "")
      ? values.editor
      : undefined,
    sort,
    page: Math.max(1, Number.parseInt(values.page ?? "1", 10) || 1),
  };
}
