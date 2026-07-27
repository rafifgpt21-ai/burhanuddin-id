import "server-only";

import { prisma } from "@/lib/prisma";
import type { EditorialFilters } from "@/lib/content/editorial-filters";
export {
  parseEditorialFilters,
  type EditorialFilters,
} from "@/lib/content/editorial-filters";

export type EditorialKind =
  | "homepage"
  | "post"
  | "agenda"
  | "material"
  | "publication";

export type EditorialRecord = {
  id: string;
  title: string;
  meta: string;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  hasUnpublishedChanges: boolean;
  draftVersion: number;
  lastEditedById?: string;
  lastEditorName?: string;
  updatedAt: Date;
  protected?: boolean;
};

function orderBy(sort: EditorialFilters["sort"], titleField: string) {
  if (sort === "updated-asc") return { updatedAt: "asc" as const };
  if (sort === "title") return { [titleField]: "asc" as const };
  return { updatedAt: "desc" as const };
}

function pageWindow(page = 1) {
  return { skip: Math.max(0, page - 1) * 25, take: 25 };
}

async function attachEditors(records: EditorialRecord[]) {
  const ids = Array.from(
    new Set(records.map((record) => record.lastEditedById).filter(Boolean)),
  ) as string[];
  if (!ids.length) return records;
  const editors = await prisma.adminUser.findMany({
    where: { id: { in: ids } },
    select: { id: true, name: true, username: true },
  });
  const names = new Map(
    editors.map((editor) => [
      editor.id,
      editor.name || `@${editor.username}`,
    ]),
  );
  return records.map((record) => ({
    ...record,
    lastEditorName: record.lastEditedById
      ? names.get(record.lastEditedById)
      : undefined,
  }));
}

function commonWhere(filters: EditorialFilters) {
  return {
    ...(filters.changed !== undefined
      ? { hasUnpublishedChanges: filters.changed }
      : {}),
    ...(filters.editor ? { lastEditedById: filters.editor } : {}),
  };
}

export async function getEditorialRecords(
  kind: EditorialKind,
  filters: EditorialFilters = {},
): Promise<{ records: EditorialRecord[]; total: number; pages: number }> {
  if (process.env.DATABASE_READY !== "true") {
    return { records: [], total: 0, pages: 0 };
  }

  const query = filters.q?.trim() ?? "";
  const status = filters.status;
  const pagination = pageWindow(filters.page);

  if (kind === "homepage") {
    const record = await prisma.homepageContent.findUnique({
      where: { key: "main" },
    });
    const records: EditorialRecord[] = record
      ? [{
          id: record.id,
          title: "Beranda utama",
          meta: "Identitas, hero, riset, forum, dan CTA",
          status: record.status,
          hasUnpublishedChanges: record.hasUnpublishedChanges,
          draftVersion: record.draftVersion,
          lastEditedById: record.lastEditedById ?? undefined,
          updatedAt: record.updatedAt,
        }]
      : [];
    return {
      records: await attachEditors(records),
      total: records.length,
      pages: records.length ? 1 : 0,
    };
  }

  if (kind === "post") {
    const where = {
      ...commonWhere(filters),
      ...(status ? { status } : {}),
      ...(query
        ? {
            OR: [
              { titleId: { contains: query, mode: "insensitive" as const } },
              { titleEn: { contains: query, mode: "insensitive" as const } },
              { topics: { has: query } },
            ],
          }
        : {}),
    };
    const [records, total] = await Promise.all([
      prisma.post.findMany({
        where,
        ...pagination,
        orderBy: orderBy(filters.sort, "titleId"),
      }),
      prisma.post.count({ where }),
    ]);
    return {
      records: await attachEditors(records.map((record) => ({
        id: record.id,
        title: record.titleId,
        meta: record.topics.join(" · ") || "Tanpa topik",
        status: record.status,
        hasUnpublishedChanges: record.hasUnpublishedChanges,
        draftVersion: record.draftVersion,
        lastEditedById: record.lastEditedById ?? undefined,
        updatedAt: record.updatedAt,
      }))),
      total,
      pages: Math.ceil(total / 25),
    };
  }

  if (kind === "agenda") {
    const where = {
      ...commonWhere(filters),
      ...(status ? { status } : {}),
      ...(query
        ? {
            OR: [
              { titleId: { contains: query, mode: "insensitive" as const } },
              { titleEn: { contains: query, mode: "insensitive" as const } },
              { locationLabelId: { contains: query, mode: "insensitive" as const } },
            ],
          }
        : {}),
    };
    const [records, total] = await Promise.all([
      prisma.agendaItem.findMany({
        where,
        ...pagination,
        orderBy: orderBy(filters.sort, "titleId"),
      }),
      prisma.agendaItem.count({ where }),
    ]);
    return {
      records: await attachEditors(records.map((record) => ({
        id: record.id,
        title: record.titleId,
        meta: new Intl.DateTimeFormat("id-ID", {
          dateStyle: "medium",
          timeStyle: "short",
          timeZone: "Asia/Jakarta",
        }).format(record.startsAt),
        status: record.status,
        hasUnpublishedChanges: record.hasUnpublishedChanges,
        draftVersion: record.draftVersion,
        lastEditedById: record.lastEditedById ?? undefined,
        updatedAt: record.updatedAt,
      }))),
      total,
      pages: Math.ceil(total / 25),
    };
  }

  if (kind === "material") {
    const where = {
      ...commonWhere(filters),
      ...(status ? { status } : {}),
      ...(query
        ? {
            OR: [
              { titleId: { contains: query, mode: "insensitive" as const } },
              { titleEn: { contains: query, mode: "insensitive" as const } },
              { courseId: { contains: query, mode: "insensitive" as const } },
              { topicId: { contains: query, mode: "insensitive" as const } },
            ],
          }
        : {}),
    };
    const [records, total] = await Promise.all([
      prisma.studyMaterial.findMany({
        where,
        ...pagination,
        orderBy: orderBy(filters.sort, "titleId"),
      }),
      prisma.studyMaterial.count({ where }),
    ]);
    return {
      records: await attachEditors(records.map((record) => ({
        id: record.id,
        title: record.titleId,
        meta: `${record.courseId} · ${record.resourceType.replaceAll("_", " ")}`,
        status: record.status,
        hasUnpublishedChanges: record.hasUnpublishedChanges,
        draftVersion: record.draftVersion,
        lastEditedById: record.lastEditedById ?? undefined,
        updatedAt: record.updatedAt,
      }))),
      total,
      pages: Math.ceil(total / 25),
    };
  }

  const where = {
    ...commonWhere(filters),
    ...(status ? { contentStatus: status } : {}),
    ...(query
      ? {
          OR: [
            { title: { contains: query, mode: "insensitive" as const } },
            { authors: { has: query } },
            { publisher: { contains: query, mode: "insensitive" as const } },
            { containerTitle: { contains: query, mode: "insensitive" as const } },
          ],
        }
      : {}),
  };
  const [records, total] = await Promise.all([
    prisma.publication.findMany({
      where,
      ...pagination,
      orderBy: orderBy(filters.sort, "title"),
    }),
    prisma.publication.count({ where }),
  ]);
  return {
    records: await attachEditors(records.map((record) => ({
      id: record.id,
      title: record.title,
      meta: `${record.year} · ${record.type.replaceAll("_", " ")}`,
      status: record.contentStatus,
      hasUnpublishedChanges: record.hasUnpublishedChanges,
      draftVersion: record.draftVersion,
      lastEditedById: record.lastEditedById ?? undefined,
      updatedAt: record.updatedAt,
      protected: Boolean(record.sourceFingerprint),
    }))),
    total,
    pages: Math.ceil(total / 25),
  };
}

export async function getAdminEditorOptions() {
  if (process.env.DATABASE_READY !== "true") return [];
  return prisma.adminUser.findMany({
    orderBy: { name: "asc" },
    select: { id: true, name: true, username: true },
  });
}
