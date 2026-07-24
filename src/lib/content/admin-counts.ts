import { prisma } from "@/lib/prisma";

import { getDatabaseReadiness } from "./database-readiness";

export type AdminCollectionCounts = {
  publications: number;
  agenda: number;
  posts: number;
  materials: number;
};

export async function getAdminCollectionCounts(): Promise<AdminCollectionCounts | null> {
  if (!getDatabaseReadiness()) return null;

  try {
    const [publications, agenda, posts, materials] = await Promise.all([
      prisma.publication.count(),
      prisma.agendaItem.count(),
      prisma.post.count(),
      prisma.studyMaterial.count(),
    ]);

    return { publications, agenda, posts, materials };
  } catch {
    return null;
  }
}
