import { prisma } from "@/lib/prisma";

import { getDatabaseReadiness } from "./database-readiness";

export type AdminCollectionCounts = {
  publications: number;
  agenda: number;
  posts: number;
  materials: number;
  status: { draft: number; published: number; archived: number };
  recent: { kind: string; id: string; title: string; updatedAt: Date; pending: boolean }[];
};

export async function getAdminCollectionCounts(): Promise<AdminCollectionCounts | null> {
  if (!getDatabaseReadiness()) return null;

  try {
    const [publications, agenda, posts, materials, recentPosts, recentAgenda, recentMaterials, recentPublications] = await Promise.all([
      prisma.publication.count(),
      prisma.agendaItem.count(),
      prisma.post.count(),
      prisma.studyMaterial.count(),
      prisma.post.findMany({ take: 3, orderBy: { updatedAt: "desc" }, select: { id: true, titleId: true, status: true, updatedAt: true, hasUnpublishedChanges: true } }),
      prisma.agendaItem.findMany({ take: 3, orderBy: { updatedAt: "desc" }, select: { id: true, titleId: true, status: true, updatedAt: true, hasUnpublishedChanges: true } }),
      prisma.studyMaterial.findMany({ take: 3, orderBy: { updatedAt: "desc" }, select: { id: true, titleId: true, status: true, updatedAt: true, hasUnpublishedChanges: true } }),
      prisma.publication.findMany({ take: 3, orderBy: { updatedAt: "desc" }, select: { id: true, title: true, contentStatus: true, updatedAt: true, hasUnpublishedChanges: true } }),
    ]);

    const all = [
      ...recentPosts.map((item) => ({ kind: "tulisan", id: item.id, title: item.titleId, status: item.status, updatedAt: item.updatedAt, pending: item.hasUnpublishedChanges })),
      ...recentAgenda.map((item) => ({ kind: "agenda", id: item.id, title: item.titleId, status: item.status, updatedAt: item.updatedAt, pending: item.hasUnpublishedChanges })),
      ...recentMaterials.map((item) => ({ kind: "materi", id: item.id, title: item.titleId, status: item.status, updatedAt: item.updatedAt, pending: item.hasUnpublishedChanges })),
      ...recentPublications.map((item) => ({ kind: "publikasi", id: item.id, title: item.title, status: item.contentStatus, updatedAt: item.updatedAt, pending: item.hasUnpublishedChanges })),
    ];
    const status = {
      draft: all.filter((item) => item.status === "DRAFT").length,
      published: all.filter((item) => item.status === "PUBLISHED").length,
      archived: all.filter((item) => item.status === "ARCHIVED").length,
    };
    const recent = all
      .filter((item) => item.status === "DRAFT" || item.pending)
      .sort((first, second) => second.updatedAt.getTime() - first.updatedAt.getTime())
      .slice(0, 6);
    return { publications, agenda, posts, materials, status, recent };
  } catch {
    return null;
  }
}
