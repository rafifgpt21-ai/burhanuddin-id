import "server-only";

import { prisma } from "@/lib/prisma";
import type { Locale } from "@/lib/i18n";

export type AdminSearchResult = {
  id: string;
  kind: "homepage" | "publication" | "agenda" | "post" | "material";
  label: string;
  meta: string;
  href: string;
};

export async function searchAdminContent(
  query: string,
  locale: Locale,
): Promise<AdminSearchResult[]> {
  const q = query.trim();
  if (q.length < 2 || process.env.DATABASE_READY !== "true") return [];
  const base = `/${locale}/admin`;
  const [homepage, publications, agenda, posts, materials] = await Promise.all([
    prisma.homepageContent.findUnique({
      where: { key: "main" },
      select: { id: true },
    }),
    prisma.publication.findMany({
      where: {
        OR: [
          { title: { contains: q, mode: "insensitive" } },
          { authors: { has: q } },
          { publisher: { contains: q, mode: "insensitive" } },
          { containerTitle: { contains: q, mode: "insensitive" } },
          { doi: { contains: q, mode: "insensitive" } },
        ],
      },
      take: 5,
      orderBy: { updatedAt: "desc" },
      select: { id: true, title: true, year: true, type: true },
    }),
    prisma.agendaItem.findMany({
      where: {
        OR: [
          { titleId: { contains: q, mode: "insensitive" } },
          { titleEn: { contains: q, mode: "insensitive" } },
          { locationLabelId: { contains: q, mode: "insensitive" } },
          { locationLabelEn: { contains: q, mode: "insensitive" } },
        ],
      },
      take: 5,
      orderBy: { updatedAt: "desc" },
      select: { id: true, titleId: true, startsAt: true },
    }),
    prisma.post.findMany({
      where: {
        OR: [
          { titleId: { contains: q, mode: "insensitive" } },
          { titleEn: { contains: q, mode: "insensitive" } },
          { topics: { has: q } },
        ],
      },
      take: 5,
      orderBy: { updatedAt: "desc" },
      select: { id: true, titleId: true, topics: true },
    }),
    prisma.studyMaterial.findMany({
      where: {
        OR: [
          { titleId: { contains: q, mode: "insensitive" } },
          { titleEn: { contains: q, mode: "insensitive" } },
          { courseId: { contains: q, mode: "insensitive" } },
          { courseEn: { contains: q, mode: "insensitive" } },
          { topicId: { contains: q, mode: "insensitive" } },
        ],
      },
      take: 5,
      orderBy: { updatedAt: "desc" },
      select: { id: true, titleId: true, courseId: true, resourceType: true },
    }),
  ]);

  const results: AdminSearchResult[] = [];
  if (homepage && /beranda|homepage|identitas|identity/i.test(q)) {
    results.push({
      id: homepage.id,
      kind: "homepage",
      label: locale === "id" ? "Beranda utama" : "Main homepage",
      meta: locale === "id" ? "Identitas dan pilihan" : "Identity and selections",
      href: `${base}/beranda/${homepage.id}`,
    });
  }
  results.push(
    ...publications.map((item) => ({
      id: item.id,
      kind: "publication" as const,
      label: item.title,
      meta: `${item.year} · ${item.type.replaceAll("_", " ")}`,
      href: `${base}/publikasi/${item.id}`,
    })),
    ...agenda.map((item) => ({
      id: item.id,
      kind: "agenda" as const,
      label: item.titleId,
      meta: new Intl.DateTimeFormat(locale === "id" ? "id-ID" : "en-GB", {
        dateStyle: "medium",
        timeZone: "Asia/Jakarta",
      }).format(item.startsAt),
      href: `${base}/agenda/${item.id}`,
    })),
    ...posts.map((item) => ({
      id: item.id,
      kind: "post" as const,
      label: item.titleId,
      meta: item.topics.join(" · ") || (locale === "id" ? "Tanpa topik" : "No topics"),
      href: `${base}/tulisan/${item.id}`,
    })),
    ...materials.map((item) => ({
      id: item.id,
      kind: "material" as const,
      label: item.titleId,
      meta: `${item.courseId} · ${item.resourceType.replaceAll("_", " ")}`,
      href: `${base}/materi/${item.id}`,
    })),
  );
  return results;
}
