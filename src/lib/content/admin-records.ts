import "server-only";

import { prisma } from "@/lib/prisma";

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
  updatedAt: Date;
  protected?: boolean;
};

export type EditorialFilters = {
  editorialError?: string;
  q?: string;
  status?: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  page?: number;
  sort?: "updated-desc" | "updated-asc" | "title";
};

function orderBy(sort: EditorialFilters["sort"]) {
  if (sort === "updated-asc") return { updatedAt: "asc" as const };
  return { updatedAt: "desc" as const };
}

function pageWindow(page = 1) {
  return { skip: Math.max(0, page - 1) * 25, take: 25 };
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
    const record = await prisma.homepageContent.findUnique({ where: { key: "main" } });
    const records: EditorialRecord[] = record
      ? [{
          id: record.id,
          title: "Beranda utama",
          meta: "Identitas, hero, riset, forum, dan CTA",
          status: record.status,
          hasUnpublishedChanges: record.hasUnpublishedChanges,
          updatedAt: record.updatedAt,
        }]
      : [];
    return { records, total: records.length, pages: records.length ? 1 : 0 };
  }

  if (kind === "post") {
    const where = {
      ...(status ? { status } : {}),
      ...(query
        ? { OR: [{ titleId: { contains: query, mode: "insensitive" as const } }, { titleEn: { contains: query, mode: "insensitive" as const } }] }
        : {}),
    };
    const [records, total] = await Promise.all([
      prisma.post.findMany({ where, ...pagination, orderBy: orderBy(filters.sort) }),
      prisma.post.count({ where }),
    ]);
    return {
      records: records.map((record) => ({
        id: record.id,
        title: record.titleId,
        meta: record.topics.join(" · ") || "Tanpa topik",
        status: record.status,
        hasUnpublishedChanges: record.hasUnpublishedChanges,
        updatedAt: record.updatedAt,
      })),
      total,
      pages: Math.ceil(total / 25),
    };
  }

  if (kind === "agenda") {
    const where = {
      ...(status ? { status } : {}),
      ...(query
        ? { OR: [{ titleId: { contains: query, mode: "insensitive" as const } }, { titleEn: { contains: query, mode: "insensitive" as const } }] }
        : {}),
    };
    const [records, total] = await Promise.all([
      prisma.agendaItem.findMany({ where, ...pagination, orderBy: orderBy(filters.sort) }),
      prisma.agendaItem.count({ where }),
    ]);
    return {
      records: records.map((record) => ({
        id: record.id,
        title: record.titleId,
        meta: new Intl.DateTimeFormat("id-ID", { dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Jakarta" }).format(record.startsAt),
        status: record.status,
        hasUnpublishedChanges: record.hasUnpublishedChanges,
        updatedAt: record.updatedAt,
      })),
      total,
      pages: Math.ceil(total / 25),
    };
  }

  if (kind === "material") {
    const where = {
      ...(status ? { status } : {}),
      ...(query
        ? { OR: [{ titleId: { contains: query, mode: "insensitive" as const } }, { courseId: { contains: query, mode: "insensitive" as const } }] }
        : {}),
    };
    const [records, total] = await Promise.all([
      prisma.studyMaterial.findMany({ where, ...pagination, orderBy: orderBy(filters.sort) }),
      prisma.studyMaterial.count({ where }),
    ]);
    return {
      records: records.map((record) => ({
        id: record.id,
        title: record.titleId,
        meta: `${record.courseId} · ${record.resourceType.replaceAll("_", " ")}`,
        status: record.status,
        hasUnpublishedChanges: record.hasUnpublishedChanges,
        updatedAt: record.updatedAt,
      })),
      total,
      pages: Math.ceil(total / 25),
    };
  }

  const where = {
    ...(status ? { contentStatus: status } : {}),
    ...(query
      ? { OR: [{ title: { contains: query, mode: "insensitive" as const } }, { authors: { has: query } }] }
      : {}),
  };
  const [records, total] = await Promise.all([
    prisma.publication.findMany({ where, ...pagination, orderBy: orderBy(filters.sort) }),
    prisma.publication.count({ where }),
  ]);
  return {
    records: records.map((record) => ({
      id: record.id,
      title: record.title,
      meta: `${record.year} · ${record.type.replaceAll("_", " ")}`,
      status: record.contentStatus,
      hasUnpublishedChanges: record.hasUnpublishedChanges,
      updatedAt: record.updatedAt,
      protected: Boolean(record.sourceFingerprint),
    })),
    total,
    pages: Math.ceil(total / 25),
  };
}
