"use server";

import { revalidatePath } from "next/cache";

import { readAdminSession } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";
import {
  agendaInputSchema,
  materialInputSchema,
  postInputSchema,
  publicationInputSchema,
} from "@/lib/validation/content";

export type EditorActionState = { ok?: boolean; message?: string };

async function canWrite() {
  return Boolean((await readAdminSession()) && process.env.DATABASE_READY === "true");
}

function text(formData: FormData, name: string) {
  const value = formData.get(name);
  return typeof value === "string" ? value : "";
}

function optional(value: string) {
  return value.trim() || null;
}

function slugify(value: string) {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 170) || "draft";
}

async function availableSlug(
  base: string,
  exists: (candidate: string) => Promise<unknown>,
) {
  let candidate = base;
  let suffix = 2;

  while (await exists(candidate)) {
    candidate = `${base.slice(0, 165)}-${suffix}`;
    suffix += 1;
  }

  return candidate;
}

function paragraphs(value: string) {
  return value
    .split(/\n\s*\n/)
    .map((item) => item.trim())
    .filter(Boolean)
    .map((item) => ({ type: "paragraph" as const, text: item }));
}

export async function createPostAction(
  _state: EditorActionState,
  formData: FormData,
): Promise<EditorActionState> {
  if (!(await canWrite())) return { message: "Penyimpanan masih terkunci sampai database siap." };
  const titleId = text(formData, "titleId");
  const titleEn = text(formData, "titleEn");
  const slugId = await availableSlug(slugify(titleId), (candidate) =>
    prisma.post.findUnique({ where: { slugId: candidate }, select: { id: true } }),
  );
  const slugEn = titleEn
    ? await availableSlug(slugify(titleEn), (candidate) =>
        prisma.post.findUnique({ where: { slugEn: candidate }, select: { id: true } }),
      )
    : "";
  const parsed = postInputSchema.safeParse({
    titleId,
    titleEn,
    slugId,
    slugEn,
    excerptId: text(formData, "excerptId"),
    excerptEn: text(formData, "excerptEn"),
    contentId: paragraphs(text(formData, "contentId")),
    contentEn: paragraphs(text(formData, "contentEn")),
    topics: text(formData, "topics").split(",").map((item) => item.trim()).filter(Boolean),
    coverImage: text(formData, "coverImage"),
    canonicalExternal: text(formData, "canonicalExternal"),
    status: "DRAFT",
  });
  if (!parsed.success) return { message: parsed.error.issues[0]?.message || "Periksa kembali isi tulisan." };
  await prisma.post.create({
    data: {
      ...parsed.data,
      titleEn: optional(parsed.data.titleEn || ""),
      slugEn: optional(parsed.data.slugEn || ""),
      excerptId: optional(parsed.data.excerptId || ""),
      excerptEn: optional(parsed.data.excerptEn || ""),
      contentEn: parsed.data.contentEn?.length ? parsed.data.contentEn : undefined,
      coverImage: optional(parsed.data.coverImage || ""),
      canonicalExternal: optional(parsed.data.canonicalExternal || ""),
    },
  });
  revalidatePath(text(formData, "returnPath"));
  return { ok: true, message: "Draft tulisan tersimpan." };
}

export async function createAgendaAction(
  _state: EditorActionState,
  formData: FormData,
): Promise<EditorActionState> {
  if (!(await canWrite())) return { message: "Penyimpanan masih terkunci sampai database siap." };
  const titleId = text(formData, "titleId");
  const titleEn = text(formData, "titleEn");
  const slugId = await availableSlug(slugify(titleId), (candidate) =>
    prisma.agendaItem.findUnique({ where: { slugId: candidate }, select: { id: true } }),
  );
  const slugEn = titleEn
    ? await availableSlug(slugify(titleEn), (candidate) =>
        prisma.agendaItem.findUnique({ where: { slugEn: candidate }, select: { id: true } }),
      )
    : "";
  const parsed = agendaInputSchema.safeParse({
    titleId, titleEn, slugId, slugEn,
    descriptionId: text(formData, "descriptionId"), descriptionEn: text(formData, "descriptionEn"),
    startsAt: text(formData, "startsAt"), endsAt: text(formData, "endsAt") || undefined,
    locationLabelId: text(formData, "locationLabelId"), locationLabelEn: text(formData, "locationLabelEn"),
    externalUrl: text(formData, "externalUrl"), status: "DRAFT",
  });
  if (!parsed.success) return { message: parsed.error.issues[0]?.message || "Periksa kembali data agenda." };
  await prisma.agendaItem.create({
    data: {
      ...parsed.data,
      titleEn: optional(parsed.data.titleEn || ""),
      slugEn: optional(parsed.data.slugEn || ""),
      descriptionEn: optional(parsed.data.descriptionEn || ""),
      locationLabelId: optional(parsed.data.locationLabelId || ""),
      locationLabelEn: optional(parsed.data.locationLabelEn || ""),
      externalUrl: optional(parsed.data.externalUrl || ""),
    },
  });
  revalidatePath(text(formData, "returnPath"));
  return { ok: true, message: "Draft agenda tersimpan." };
}

export async function createPublicationAction(
  _state: EditorActionState,
  formData: FormData,
): Promise<EditorActionState> {
  if (!(await canWrite())) return { message: "Penyimpanan masih terkunci sampai database siap." };
  const parsed = publicationInputSchema.safeParse({
    type: text(formData, "type"), title: text(formData, "title"),
    authors: text(formData, "authors").split("\n").map((item) => item.trim()).filter(Boolean),
    year: text(formData, "year"), venue: text(formData, "venue"), doi: text(formData, "doi"),
    externalUrl: text(formData, "externalUrl"), status: text(formData, "status"),
    coverImage: text(formData, "coverImage"),
    coverRightsNote: text(formData, "coverRightsNote"),
    sourceName: text(formData, "sourceName") || "Input manual", sourceUrl: text(formData, "sourceUrl"),
    sourceNote: text(formData, "sourceNote"),
  });
  if (!parsed.success) return { message: parsed.error.issues[0]?.message || "Periksa kembali metadata publikasi." };
  const coverStorageKey = text(formData, "coverStorageKey");
  const coverMimeType = text(formData, "coverMimeType");
  const coverFileName = text(formData, "coverFileName");
  const coverFileSize = Number(text(formData, "coverFileSize"));
  if (
    parsed.data.coverImage &&
    (
      !coverStorageKey ||
      !coverFileName ||
      !coverMimeType.startsWith("image/") ||
      !Number.isFinite(coverFileSize) ||
      coverFileSize <= 0 ||
      coverFileSize > 4 * 1024 * 1024
    )
  ) {
    return { message: "Metadata unggahan gambar publikasi tidak valid." };
  }
  await prisma.$transaction(async (database) => {
    if (coverStorageKey && parsed.data.coverImage) {
      await database.mediaAsset.create({
        data: {
          storageKey: coverStorageKey,
          url: parsed.data.coverImage,
          fileName: coverFileName,
          mimeType: coverMimeType,
          size: coverFileSize,
          rightsNote: parsed.data.coverRightsNote || "",
        },
      });
    }

    const publication = { ...parsed.data };
    delete publication.coverRightsNote;
    await database.publication.create({
      data: {
        ...publication,
        venue: publication.venue || null,
        doi: publication.doi || null,
        externalUrl: publication.externalUrl || null,
        coverImage: publication.coverImage || null,
        sourceUrl: publication.sourceUrl || null,
        sourceNote: publication.sourceNote || "",
        sourceCheckedAt: new Date(),
        alternateUrls: [],
        contentStatus: "DRAFT",
      },
    });
  });
  revalidatePath(text(formData, "returnPath"));
  return { ok: true, message: "Draft publikasi tersimpan." };
}

export async function createMaterialAction(
  _state: EditorActionState,
  formData: FormData,
): Promise<EditorActionState> {
  if (!(await canWrite())) return { message: "Penyimpanan dan upload masih terkunci sampai database siap." };
  const uploadedKey = text(formData, "storageKey");
  const externalUrl = text(formData, "externalUrl");
  const titleId = text(formData, "titleId");
  const titleEn = text(formData, "titleEn");
  const slugId = await availableSlug(slugify(titleId), (candidate) =>
    prisma.studyMaterial.findUnique({ where: { slugId: candidate }, select: { id: true } }),
  );
  const slugEn = titleEn
    ? await availableSlug(slugify(titleEn), (candidate) =>
        prisma.studyMaterial.findUnique({ where: { slugEn: candidate }, select: { id: true } }),
      )
    : "";
  const parsed = materialInputSchema.safeParse({
    titleId, titleEn, slugId, slugEn,
    descriptionId: text(formData, "descriptionId"), descriptionEn: text(formData, "descriptionEn"),
    courseId: text(formData, "courseId"), courseEn: text(formData, "courseEn"),
    topicId: text(formData, "topicId"), topicEn: text(formData, "topicEn"),
    resourceType: text(formData, "resourceType"), semester: text(formData, "semester"),
    academicYear: text(formData, "academicYear"), tagsId: [], tagsEn: [], assetId: uploadedKey,
    externalUrl, downloadAllowed: formData.get("downloadAllowed") === "on", pinned: false, status: "DRAFT",
  });
  if (!parsed.success) return { message: parsed.error.issues[0]?.message || "Periksa kembali metadata materi." };
  await prisma.$transaction(async (database) => {
    let assetId: string | null = null;
    if (uploadedKey) {
      const asset = await database.mediaAsset.create({
        data: {
          storageKey: uploadedKey,
          url: text(formData, "assetUrl"), fileName: text(formData, "fileName"),
          mimeType: text(formData, "mimeType"), size: Number(text(formData, "fileSize")),
          rightsNote: text(formData, "rightsNote"),
        },
      });
      assetId = asset.id;
    }
    await database.studyMaterial.create({
      data: {
        ...parsed.data,
        titleEn: optional(parsed.data.titleEn || ""),
        slugEn: optional(parsed.data.slugEn || ""),
        descriptionEn: optional(parsed.data.descriptionEn || ""),
        courseEn: optional(parsed.data.courseEn || ""),
        topicId: optional(parsed.data.topicId || ""),
        topicEn: optional(parsed.data.topicEn || ""),
        semester: optional(parsed.data.semester || ""),
        academicYear: optional(parsed.data.academicYear || ""),
        assetId,
        externalUrl: parsed.data.externalUrl || null,
      },
    });
  });
  revalidatePath(text(formData, "returnPath"));
  return { ok: true, message: "Draft materi tersimpan." };
}
