import { prisma } from "@/lib/prisma";

import { getDatabaseReadiness } from "./database-readiness";

export type AdminWorkItem = {
  kind: string;
  id: string;
  title: string;
  updatedAt: Date;
  pending: boolean;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  lastEditedById?: string;
  lastEditorName?: string;
};

export type AdminCollectionCounts = {
  publications: number;
  agenda: number;
  posts: number;
  materials: number;
  status: { draft: number; published: number; archived: number; pending: number };
  recent: AdminWorkItem[];
  mine: AdminWorkItem[];
  attention: AdminWorkItem[];
};

async function attachEditorNames(items: AdminWorkItem[]) {
  const ids = Array.from(
    new Set(items.map((item) => item.lastEditedById).filter(Boolean)),
  ) as string[];
  if (!ids.length) return items;
  const editors = await prisma.adminUser.findMany({
    where: { id: { in: ids } },
    select: { id: true, name: true, username: true },
  });
  const names = new Map(
    editors.map((editor) => [editor.id, editor.name || `@${editor.username}`]),
  );
  return items.map((item) => ({
    ...item,
    lastEditorName: item.lastEditedById
      ? names.get(item.lastEditedById)
      : undefined,
  }));
}

export async function getAdminCollectionCounts(
  currentUserId?: string,
): Promise<AdminCollectionCounts | null> {
  if (!getDatabaseReadiness()) return null;

  try {
    const [
      publications,
      agenda,
      posts,
      materials,
      postGroups,
      agendaGroups,
      materialGroups,
      publicationGroups,
      recentPosts,
      recentAgenda,
      recentMaterials,
      recentPublications,
    ] = await Promise.all([
      prisma.publication.count(),
      prisma.agendaItem.count(),
      prisma.post.count(),
      prisma.studyMaterial.count(),
      prisma.post.groupBy({ by: ["status"], _count: true }),
      prisma.agendaItem.groupBy({ by: ["status"], _count: true }),
      prisma.studyMaterial.groupBy({ by: ["status"], _count: true }),
      prisma.publication.groupBy({ by: ["contentStatus"], _count: true }),
      prisma.post.findMany({
        take: 8,
        orderBy: { updatedAt: "desc" },
        select: {
          id: true,
          titleId: true,
          status: true,
          updatedAt: true,
          hasUnpublishedChanges: true,
          lastEditedById: true,
        },
      }),
      prisma.agendaItem.findMany({
        take: 8,
        orderBy: { updatedAt: "desc" },
        select: {
          id: true,
          titleId: true,
          status: true,
          updatedAt: true,
          hasUnpublishedChanges: true,
          lastEditedById: true,
        },
      }),
      prisma.studyMaterial.findMany({
        take: 8,
        orderBy: { updatedAt: "desc" },
        select: {
          id: true,
          titleId: true,
          status: true,
          updatedAt: true,
          hasUnpublishedChanges: true,
          lastEditedById: true,
        },
      }),
      prisma.publication.findMany({
        take: 8,
        orderBy: { updatedAt: "desc" },
        select: {
          id: true,
          title: true,
          contentStatus: true,
          updatedAt: true,
          hasUnpublishedChanges: true,
          lastEditedById: true,
        },
      }),
    ]);

    const all: AdminWorkItem[] = [
      ...recentPosts.map((item) => ({
        kind: "tulisan",
        id: item.id,
        title: item.titleId,
        status: item.status,
        updatedAt: item.updatedAt,
        pending: item.hasUnpublishedChanges,
        lastEditedById: item.lastEditedById ?? undefined,
      })),
      ...recentAgenda.map((item) => ({
        kind: "agenda",
        id: item.id,
        title: item.titleId,
        status: item.status,
        updatedAt: item.updatedAt,
        pending: item.hasUnpublishedChanges,
        lastEditedById: item.lastEditedById ?? undefined,
      })),
      ...recentMaterials.map((item) => ({
        kind: "materi",
        id: item.id,
        title: item.titleId,
        status: item.status,
        updatedAt: item.updatedAt,
        pending: item.hasUnpublishedChanges,
        lastEditedById: item.lastEditedById ?? undefined,
      })),
      ...recentPublications.map((item) => ({
        kind: "publikasi",
        id: item.id,
        title: item.title,
        status: item.contentStatus,
        updatedAt: item.updatedAt,
        pending: item.hasUnpublishedChanges,
        lastEditedById: item.lastEditedById ?? undefined,
      })),
    ].sort((first, second) => second.updatedAt.getTime() - first.updatedAt.getTime());

    const countStatus = (
      value: "DRAFT" | "PUBLISHED" | "ARCHIVED",
    ) =>
      (postGroups.find((item) => item.status === value)?._count ?? 0) +
      (agendaGroups.find((item) => item.status === value)?._count ?? 0) +
      (materialGroups.find((item) => item.status === value)?._count ?? 0) +
      (publicationGroups.find((item) => item.contentStatus === value)?._count ?? 0);
    const pending = await Promise.all([
      prisma.post.count({ where: { hasUnpublishedChanges: true } }),
      prisma.agendaItem.count({ where: { hasUnpublishedChanges: true } }),
      prisma.studyMaterial.count({ where: { hasUnpublishedChanges: true } }),
      prisma.publication.count({ where: { hasUnpublishedChanges: true } }),
    ]);
    const enriched = await attachEditorNames(all.slice(0, 24));
    return {
      publications,
      agenda,
      posts,
      materials,
      status: {
        draft: countStatus("DRAFT"),
        published: countStatus("PUBLISHED"),
        archived: countStatus("ARCHIVED"),
        pending: pending.reduce((sum, value) => sum + value, 0),
      },
      recent: enriched.slice(0, 8),
      mine: enriched.filter((item) => item.lastEditedById === currentUserId && item.status === "DRAFT").slice(0, 6),
      attention: enriched.filter((item) => item.pending).slice(0, 6),
    };
  } catch {
    return null;
  }
}
