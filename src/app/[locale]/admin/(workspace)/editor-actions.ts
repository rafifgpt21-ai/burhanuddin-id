"use server";

import { revalidatePath } from "next/cache";

import { readAdminSession } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";
import {
  agendaInputSchema,
  materialInputSchema,
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

export async function createAgendaAction(
  _state: EditorActionState,
  formData: FormData,
): Promise<EditorActionState> {
  if (!(await canWrite())) return { message: "Penyimpanan masih terkunci sampai database siap." };
  const parsed = agendaInputSchema.safeParse({
    titleId: text(formData, "titleId"), titleEn: text(formData, "titleEn"),
    slugId: text(formData, "slugId"), slugEn: text(formData, "slugEn"),
    descriptionId: text(formData, "descriptionId"), descriptionEn: text(formData, "descriptionEn"),
    startsAt: text(formData, "startsAt"), endsAt: text(formData, "endsAt") || undefined,
    locationLabelId: text(formData, "locationLabelId"), locationLabelEn: text(formData, "locationLabelEn"),
    externalUrl: text(formData, "externalUrl"), status: "DRAFT",
  });
  if (!parsed.success) return { message: parsed.error.issues[0]?.message || "Periksa kembali data agenda." };
  await prisma.agendaItem.create({ data: parsed.data });
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
    sourceName: text(formData, "sourceName"), sourceUrl: text(formData, "sourceUrl"),
    sourceNote: text(formData, "sourceNote"),
  });
  if (!parsed.success) return { message: parsed.error.issues[0]?.message || "Periksa kembali metadata publikasi." };
  await prisma.publication.create({
    data: {
      ...parsed.data,
      venue: parsed.data.venue || null,
      doi: parsed.data.doi || null,
      externalUrl: parsed.data.externalUrl || null,
      sourceUrl: parsed.data.sourceUrl || null,
      sourceCheckedAt: new Date(),
      alternateUrls: [],
      contentStatus: "DRAFT",
    },
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
  const parsed = materialInputSchema.safeParse({
    titleId: text(formData, "titleId"), titleEn: text(formData, "titleEn"),
    slugId: text(formData, "slugId"), slugEn: text(formData, "slugEn"),
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
    await database.studyMaterial.create({ data: { ...parsed.data, assetId, externalUrl: parsed.data.externalUrl || null } });
  });
  revalidatePath(text(formData, "returnPath"));
  return { ok: true, message: "Draft materi tersimpan." };
}
