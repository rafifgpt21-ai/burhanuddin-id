import "server-only";
import { unstable_cache } from "next/cache";

import { prisma } from "@/lib/prisma";
import type { Locale } from "@/lib/i18n";
import {
  materialInputSchema,
  postInputSchema,
  type MaterialInput,
  type PostBlock,
  type PostInput,
} from "@/lib/validation/content";

export type PublicPost = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: PostBlock[];
  topics: string[];
  pinned: boolean;
  publishedAt?: Date;
  updatedAt: Date;
  canonicalExternal?: string;
};

export type PublicMaterial = {
  id: string;
  title: string;
  slug: string;
  description: string;
  course: string;
  topic?: string;
  resourceType: MaterialInput["resourceType"];
  semester?: string;
  academicYear?: string;
  tags: string[];
  pinned: boolean;
  downloadAllowed: boolean;
  updatedAt: Date;
  target?: {
    url: string;
    fileName?: string;
    mimeType?: string;
    rightsNote?: string;
    external: boolean;
  };
};

function postDraft(record: {
  titleId: string;
  titleEn: string | null;
  slugId: string;
  slugEn: string | null;
  excerptId: string | null;
  excerptEn: string | null;
  contentId: unknown;
  contentEn: unknown;
  topics: string[];
  pinned: boolean;
  coverImage: string | null;
  canonicalExternal: string | null;
}) {
  return {
    ...record,
    titleEn: record.titleEn ?? "",
    slugEn: record.slugEn ?? "",
    excerptId: record.excerptId ?? "",
    excerptEn: record.excerptEn ?? "",
    contentId: record.contentId,
    contentEn: record.contentEn ?? [],
    coverImage: record.coverImage ?? "",
    canonicalExternal: record.canonicalExternal ?? "",
    status: "PUBLISHED",
  };
}

function materialDraft(record: {
  titleId: string;
  titleEn: string | null;
  slugId: string;
  slugEn: string | null;
  descriptionId: string;
  descriptionEn: string | null;
  courseId: string;
  courseEn: string | null;
  topicId: string | null;
  topicEn: string | null;
  resourceType: MaterialInput["resourceType"];
  semester: string | null;
  academicYear: string | null;
  tagsId: string[];
  tagsEn: string[];
  assetId: string | null;
  externalUrl: string | null;
  downloadAllowed: boolean;
  pinned: boolean;
}) {
  return {
    ...record,
    titleEn: record.titleEn ?? "",
    slugEn: record.slugEn ?? "",
    descriptionEn: record.descriptionEn ?? "",
    courseEn: record.courseEn ?? "",
    topicId: record.topicId ?? "",
    topicEn: record.topicEn ?? "",
    semester: record.semester ?? "",
    academicYear: record.academicYear ?? "",
    assetId: record.assetId ?? "",
    externalUrl: record.externalUrl ?? "",
    status: "PUBLISHED",
  };
}

export async function getPublishedPosts(locale: Locale): Promise<PublicPost[]> {
  if (process.env.DATABASE_READY !== "true") return [];
  const records = await unstable_cache(() => prisma.post.findMany({
      where: { status: "PUBLISHED" },
      orderBy: [{ pinned: "desc" }, { publishedAt: "desc" }, { updatedAt: "desc" }],
    }), ["published-posts"], { tags: ["content:post"] })().catch(() => []);

  const posts = records.flatMap((record) => {
    const parsed = postInputSchema.safeParse(
      record.publishedSnapshot ?? postDraft(record),
    );
    if (!parsed.success) return [];
    const value: PostInput = parsed.data;
    return [{
      id: record.id,
      title: locale === "en" ? value.titleEn || value.titleId : value.titleId,
      slug: locale === "en" ? value.slugEn || value.slugId : value.slugId,
      excerpt:
        locale === "en"
          ? value.excerptEn || value.excerptId || ""
          : value.excerptId || "",
      content:
        locale === "en" && value.contentEn?.length
          ? value.contentEn
          : value.contentId,
      topics: value.topics,
      pinned: value.pinned,
      publishedAt: record.publishedAt ?? undefined,
      updatedAt: record.updatedAt,
      canonicalExternal: value.canonicalExternal || undefined,
    }];
  });
  return posts.sort((first, second) => {
    if (first.pinned !== second.pinned) return first.pinned ? -1 : 1;
    return (second.publishedAt?.getTime() ?? 0) - (first.publishedAt?.getTime() ?? 0);
  });
}

export async function getPublishedPost(
  locale: Locale,
  slug: string,
): Promise<PublicPost | null> {
  const posts = await getPublishedPosts(locale);
  const direct = posts.find((post) => post.slug === slug);
  if (direct) return direct;
  if (process.env.DATABASE_READY !== "true") return null;

  const redirect = await prisma.slugRedirect
    .findUnique({
      where: {
        kind_locale_oldSlug: { kind: "POST", locale, oldSlug: slug },
      },
      select: { recordId: true },
    })
    .catch(() => null);
  if (redirect) return posts.find((post) => post.id === redirect.recordId) ?? null;
  const alternate = await prisma.post.findMany({
    where: { status: "PUBLISHED" },
    select: { id: true, publishedSnapshot: true },
  });
  const matching = alternate.find((record) => {
    const parsed = postInputSchema.safeParse(record.publishedSnapshot);
    return parsed.success && [parsed.data.slugId, parsed.data.slugEn].includes(slug);
  });
  return matching ? posts.find((post) => post.id === matching.id) ?? null : null;
}

export async function getPublishedMaterials(
  locale: Locale,
): Promise<PublicMaterial[]> {
  if (process.env.DATABASE_READY !== "true") return [];
  const records = await unstable_cache(() => prisma.studyMaterial.findMany({
      where: { status: "PUBLISHED" },
      include: { asset: true },
      orderBy: [{ pinned: "desc" }, { updatedAt: "desc" }],
    }), ["published-materials"], { tags: ["content:material"] })().catch(() => []);

  const materials = await Promise.all(records.map(async (record): Promise<PublicMaterial | null> => {
    const parsed = materialInputSchema.safeParse(
      record.publishedSnapshot ?? materialDraft(record),
    );
    if (!parsed.success) return null;
    const value = parsed.data;
    const snapshotAsset = value.assetId
      ? record.asset?.id === value.assetId
        ? record.asset
        : await prisma.mediaAsset.findUnique({ where: { id: value.assetId } }).catch(() => null)
      : null;
    const target = snapshotAsset
      ? {
          url: snapshotAsset.url,
          fileName: snapshotAsset.fileName,
          mimeType: snapshotAsset.mimeType,
          rightsNote: snapshotAsset.rightsNote,
          external: false as const,
        }
      : value.externalUrl
        ? { url: value.externalUrl, external: true as const }
        : undefined;
    return {
      id: record.id,
      title: locale === "en" ? value.titleEn || value.titleId : value.titleId,
      slug: locale === "en" ? value.slugEn || value.slugId : value.slugId,
      description:
        locale === "en"
          ? value.descriptionEn || value.descriptionId
          : value.descriptionId,
      course: locale === "en" ? value.courseEn || value.courseId : value.courseId,
      topic: locale === "en" ? value.topicEn || value.topicId : value.topicId,
      resourceType: value.resourceType,
      semester: value.semester || undefined,
      academicYear: value.academicYear || undefined,
      tags:
        locale === "en" && value.tagsEn.length
          ? value.tagsEn
          : value.tagsId,
      pinned: value.pinned,
      downloadAllowed: value.downloadAllowed,
      updatedAt: record.publishedAt ?? record.updatedAt,
      target,
    };
  }));
  return materials
    .filter((material): material is PublicMaterial => material !== null)
    .sort((first, second) => {
      if (first.pinned !== second.pinned) return first.pinned ? -1 : 1;
      return second.updatedAt.getTime() - first.updatedAt.getTime();
    });
}

export async function getPublishedMaterial(
  locale: Locale,
  slug: string,
): Promise<PublicMaterial | null> {
  const materials = await getPublishedMaterials(locale);
  const direct = materials.find((material) => material.slug === slug);
  if (direct) return direct;
  if (process.env.DATABASE_READY !== "true") return null;
  const redirect = await prisma.slugRedirect
    .findUnique({
      where: {
        kind_locale_oldSlug: { kind: "MATERIAL", locale, oldSlug: slug },
      },
      select: { recordId: true },
    })
    .catch(() => null);
  if (redirect) return materials.find((material) => material.id === redirect.recordId) ?? null;
  const alternate = await prisma.studyMaterial.findMany({
    where: { status: "PUBLISHED" },
    select: { id: true, publishedSnapshot: true },
  });
  const matching = alternate.find((record) => {
    const parsed = materialInputSchema.safeParse(record.publishedSnapshot);
    return parsed.success && [parsed.data.slugId, parsed.data.slugEn].includes(slug);
  });
  return matching
    ? materials.find((material) => material.id === matching.id) ?? null
    : null;
}
