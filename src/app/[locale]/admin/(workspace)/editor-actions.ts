"use server";

import { ContentStatus, type Prisma } from "@prisma/client";
import { revalidatePath, revalidateTag, updateTag } from "next/cache";
import { redirect } from "next/navigation";

import { readAdminSession } from "@/lib/auth/session";
import { canPermanentlyDelete } from "@/lib/auth/access";
import { prisma } from "@/lib/prisma";
import {
  agendaInputSchema,
  getPublishReadiness,
  homepageInputSchema,
  materialInputSchema,
  postInputSchema,
  publicationInputSchema,
} from "@/lib/validation/content";
import type { EditorialKind } from "@/lib/content/admin-records";
import {
  canTransitionEditorialStatus,
  type EditorialStatus,
  type EditorialTransition,
} from "@/lib/content/editorial-state";
import { toJsonSnapshot } from "@/lib/content/snapshots";

export type EditorActionState = {
  ok?: boolean;
  message?: string;
  recordId?: string;
  savedAt?: string;
};

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

function isObjectId(value: string) {
  return /^[a-f0-9]{24}$/i.test(value);
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
    Promise.all([
      prisma.post.findUnique({ where: { slugId: candidate }, select: { id: true } }),
      prisma.slugRedirect.findUnique({ where: { kind_locale_oldSlug: { kind: "POST", locale: "id", oldSlug: candidate } }, select: { id: true } }),
    ]).then(([record, redirect]) => record ?? redirect),
  );
  const slugEn = titleEn
    ? await availableSlug(slugify(titleEn), (candidate) =>
        Promise.all([
          prisma.post.findUnique({ where: { slugEn: candidate }, select: { id: true } }),
          prisma.slugRedirect.findUnique({ where: { kind_locale_oldSlug: { kind: "POST", locale: "en", oldSlug: candidate } }, select: { id: true } }),
        ]).then(([record, redirect]) => record ?? redirect),
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
    pinned: formData.get("pinned") === "on",
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
    editors: text(formData, "editors").split("\n").map((item) => item.trim()).filter(Boolean),
    year: text(formData, "year"), dateLabel: text(formData, "dateLabel"),
    containerTitle: text(formData, "containerTitle"), publisher: text(formData, "publisher"),
    publicationPlace: text(formData, "publicationPlace"), volume: text(formData, "volume"),
    issue: text(formData, "issue"), seriesNumber: text(formData, "seriesNumber"),
    pages: text(formData, "pages"), doi: text(formData, "doi"),
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
    let cardImageId: string | null = null;
    if (coverStorageKey && parsed.data.coverImage) {
      const cardImage = await database.mediaAsset.create({
        data: {
          storageKey: coverStorageKey,
          url: parsed.data.coverImage,
          fileName: coverFileName,
          mimeType: coverMimeType,
          size: coverFileSize,
          altTextId: `Gambar publikasi ${parsed.data.title}`,
          altTextEn: `Publication image for ${parsed.data.title}`,
          rightsNote: parsed.data.coverRightsNote || "",
        },
      });
      cardImageId = cardImage.id;
    }

    const publication = { ...parsed.data };
    delete publication.coverRightsNote;
    await database.publication.create({
      data: {
        ...publication,
        editors: publication.editors,
        dateLabel: optional(publication.dateLabel || ""),
        containerTitle: optional(publication.containerTitle || ""),
        venue: optional(publication.containerTitle || ""),
        publisher: optional(publication.publisher || ""),
        publicationPlace: optional(publication.publicationPlace || ""),
        volume: optional(publication.volume || ""),
        issue: optional(publication.issue || ""),
        seriesNumber: optional(publication.seriesNumber || ""),
        pages: optional(publication.pages || ""),
        doi: publication.doi || null,
        externalUrl: publication.externalUrl || null,
        cardImageId,
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
    Promise.all([
      prisma.studyMaterial.findUnique({ where: { slugId: candidate }, select: { id: true } }),
      prisma.slugRedirect.findUnique({ where: { kind_locale_oldSlug: { kind: "MATERIAL", locale: "id", oldSlug: candidate } }, select: { id: true } }),
    ]).then(([record, redirect]) => record ?? redirect),
  );
  const slugEn = titleEn
    ? await availableSlug(slugify(titleEn), (candidate) =>
        Promise.all([
          prisma.studyMaterial.findUnique({ where: { slugEn: candidate }, select: { id: true } }),
          prisma.slugRedirect.findUnique({ where: { kind_locale_oldSlug: { kind: "MATERIAL", locale: "en", oldSlug: candidate } }, select: { id: true } }),
        ]).then(([record, redirect]) => record ?? redirect),
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

type PersistedKind = Exclude<EditorialKind, "homepage">;

function revisionKind(kind: EditorialKind) {
  return {
    homepage: "HOMEPAGE",
    post: "POST",
    agenda: "AGENDA",
    material: "MATERIAL",
    publication: "PUBLICATION",
  }[kind] as "HOMEPAGE" | "POST" | "AGENDA" | "MATERIAL" | "PUBLICATION";
}

function collectionPath(locale: string, kind: EditorialKind) {
  const segment = {
    homepage: "beranda",
    post: "tulisan",
    agenda: "agenda",
    material: "materi",
    publication: "publikasi",
  }[kind];
  return `/${locale}/admin/${segment}`;
}

function redirectEditorialError(
  locale: string,
  kind: EditorialKind,
  message: string,
): never {
  const query = new URLSearchParams({ editorialError: message });
  redirect(`${collectionPath(locale, kind)}?${query.toString()}`);
}

function publicPaths(kind: EditorialKind) {
  if (kind === "post") return ["/id/tulisan", "/en/writing"];
  if (kind === "material") return ["/id/materi", "/en/materials"];
  if (kind === "publication") return ["/id/publikasi", "/en/publications", "/id", "/en"];
  if (kind === "agenda") return ["/id/outreach-dan-kiprah", "/en/outreach-and-engagement", "/id", "/en"];
  return ["/id", "/en"];
}

async function revalidateEditorial(locale: string, kind: EditorialKind) {
  revalidateTag(`content:${kind}`, "max");
  revalidatePath(collectionPath(locale, kind));
  for (const path of publicPaths(kind)) revalidatePath(path);
}

async function currentSnapshot(kind: EditorialKind, id: string) {
  if (kind === "homepage") {
    const record = await prisma.homepageContent.findUnique({ where: { id } });
    if (!record) return null;
    const parsed = homepageInputSchema.safeParse(record.payload);
    return parsed.success
      ? { record, input: parsed.data, status: record.status }
      : null;
  }
  if (kind === "post") {
    const record = await prisma.post.findUnique({ where: { id } });
    if (!record) return null;
    const input = {
      titleId: record.titleId,
      titleEn: record.titleEn ?? "",
      slugId: record.slugId,
      slugEn: record.slugEn ?? "",
      excerptId: record.excerptId ?? "",
      excerptEn: record.excerptEn ?? "",
      contentId: record.contentId,
      contentEn: record.contentEn ?? [],
      topics: record.topics,
      pinned: record.pinned,
      coverImage: record.coverImage ?? "",
      canonicalExternal: record.canonicalExternal ?? "",
      status: record.status,
    };
    return { record, input, status: record.status };
  }
  if (kind === "agenda") {
    const record = await prisma.agendaItem.findUnique({ where: { id } });
    if (!record) return null;
    const input = {
      titleId: record.titleId,
      titleEn: record.titleEn ?? "",
      slugId: record.slugId,
      slugEn: record.slugEn ?? "",
      descriptionId: record.descriptionId,
      descriptionEn: record.descriptionEn ?? "",
      startsAt: record.startsAt,
      endsAt: record.endsAt ?? undefined,
      locationLabelId: record.locationLabelId ?? "",
      locationLabelEn: record.locationLabelEn ?? "",
      externalUrl: record.externalUrl ?? "",
      status: record.status,
    };
    return { record, input, status: record.status };
  }
  if (kind === "material") {
    const record = await prisma.studyMaterial.findUnique({ where: { id } });
    if (!record) return null;
    const input = {
      titleId: record.titleId,
      titleEn: record.titleEn ?? "",
      slugId: record.slugId,
      slugEn: record.slugEn ?? "",
      descriptionId: record.descriptionId,
      descriptionEn: record.descriptionEn ?? "",
      courseId: record.courseId,
      courseEn: record.courseEn ?? "",
      topicId: record.topicId ?? "",
      topicEn: record.topicEn ?? "",
      resourceType: record.resourceType,
      semester: record.semester ?? "",
      academicYear: record.academicYear ?? "",
      tagsId: record.tagsId,
      tagsEn: record.tagsEn,
      assetId: record.assetId ?? "",
      externalUrl: record.externalUrl ?? "",
      downloadAllowed: record.downloadAllowed,
      pinned: record.pinned,
      status: record.status,
    };
    return { record, input, status: record.status };
  }
  const record = await prisma.publication.findUnique({
    where: { id },
    include: { cardImage: true },
  });
  if (!record) return null;
  const input = {
    type: record.type,
    title: record.title,
    authors: record.authors,
    editors: record.editors,
    year: record.year,
    dateLabel: record.dateLabel ?? "",
    containerTitle: record.containerTitle ?? "",
    venue: record.venue ?? "",
    publisher: record.publisher ?? "",
    publicationPlace: record.publicationPlace ?? "",
    volume: record.volume ?? "",
    issue: record.issue ?? "",
    seriesNumber: record.seriesNumber ?? "",
    pages: record.pages ?? "",
    doi: record.doi ?? "",
    externalUrl: record.externalUrl ?? "",
    status: record.status,
    coverImage: record.cardImage?.url ?? record.coverImage ?? "",
    coverRightsNote: record.cardImage?.rightsNote ?? "",
    sourceName: record.sourceName,
    sourceUrl: record.sourceUrl ?? "",
    sourceNote: record.sourceNote,
  };
  return { record, input, status: record.contentStatus };
}

export async function editorialTransitionAction(
  requestedTransition: string,
  formData: FormData,
) {
  const session = await readAdminSession();
  if (!session || process.env.DATABASE_READY !== "true") return;
  const kind = text(formData, "kind") as EditorialKind;
  const [encodedId, encodedTransition] = requestedTransition.split(":");
  const id = encodedTransition ? encodedId : text(formData, "id");
  const transition = encodedTransition || requestedTransition;
  const locale = text(formData, "locale") === "en" ? "en" : "id";
  if (!isObjectId(id)) {
    redirectEditorialError(
      locale,
      kind,
      "Tindakan tidak memiliki ID record yang valid. Muat ulang daftar lalu coba lagi.",
    );
  }
  const current = await currentSnapshot(kind, id);
  if (!current) {
    redirectEditorialError(
      locale,
      kind,
      "Record tidak ditemukan. Muat ulang daftar lalu coba lagi.",
    );
  }
  if (
    !canTransitionEditorialStatus(
      current.status as EditorialStatus,
      transition as EditorialTransition,
    )
  ) {
    redirectEditorialError(
      locale,
      kind,
      "Status record telah berubah. Muat ulang daftar sebelum melanjutkan.",
    );
  }

  if (transition === "publish") {
    const issues = getPublishReadiness(revisionKind(kind), current.input);
    if (issues.length) {
      redirectEditorialError(locale, kind, issues.join(" "));
    }
    const nextVersion = (current.record.publishedVersion ?? 0) + 1;
    const snapshot = toJsonSnapshot(current.input);
    const common = {
      status: "PUBLISHED" as const,
      publishedSnapshot: snapshot,
      publishedVersion: nextVersion,
      hasUnpublishedChanges: false,
      lastEditedById: session.id,
      publishedAt: new Date(),
    };
    try {
      await prisma.$transaction(async (database) => {
        if (kind === "post" && current.record.publishedSnapshot) {
          const previous = postInputSchema.safeParse(current.record.publishedSnapshot);
          const next = postInputSchema.safeParse(current.input);
          if (previous.success && next.success) {
            for (const [routeLocale, oldSlug, newSlug] of [
              ["id", previous.data.slugId, next.data.slugId],
              ["en", previous.data.slugEn, next.data.slugEn],
            ] as const) {
              if (oldSlug && newSlug && oldSlug !== newSlug) {
                await database.slugRedirect.upsert({
                  where: { kind_locale_oldSlug: { kind: "POST", locale: routeLocale, oldSlug } },
                  update: { recordId: id },
                  create: { kind: "POST", locale: routeLocale, oldSlug, recordId: id },
                });
              }
            }
          }
        }
        if (kind === "material" && current.record.publishedSnapshot) {
          const previous = materialInputSchema.safeParse(current.record.publishedSnapshot);
          const next = materialInputSchema.safeParse(current.input);
          if (previous.success && next.success) {
            for (const [routeLocale, oldSlug, newSlug] of [
              ["id", previous.data.slugId, next.data.slugId],
              ["en", previous.data.slugEn, next.data.slugEn],
            ] as const) {
              if (oldSlug && newSlug && oldSlug !== newSlug) {
                await database.slugRedirect.upsert({
                  where: { kind_locale_oldSlug: { kind: "MATERIAL", locale: routeLocale, oldSlug } },
                  update: { recordId: id },
                  create: { kind: "MATERIAL", locale: routeLocale, oldSlug, recordId: id },
                });
              }
            }
          }
        }
        if (kind === "homepage") await database.homepageContent.update({ where: { id }, data: common });
        if (kind === "post") await database.post.update({ where: { id }, data: common });
        if (kind === "agenda") await database.agendaItem.update({ where: { id }, data: common });
        if (kind === "material") await database.studyMaterial.update({ where: { id }, data: common });
        if (kind === "publication") {
          const { status: _status, ...publicationCommon } = common;
          void _status;
          await database.publication.update({
            where: { id },
            data: { ...publicationCommon, contentStatus: "PUBLISHED" },
          });
        }
        await database.contentRevision.create({
          data: {
            kind: revisionKind(kind),
            recordId: id,
            version: nextVersion,
            snapshot,
            publishedById: session.id,
          },
        });
      });
    } catch {
      redirectEditorialError(
        locale,
        kind,
        "Penerbitan gagal disimpan. Draft tetap aman; muat ulang lalu coba lagi.",
      );
    }
  }

  if (transition === "unpublish" || transition === "archive") {
    if (
      kind === "publication" &&
      "homepageOrder" in current.record &&
      current.record.homepageOrder
    ) {
      redirectEditorialError(
        locale,
        kind,
        "Keluarkan publikasi dari pilihan beranda sebelum mengubah statusnya.",
      );
    }
    const nextStatus = transition === "archive" ? "ARCHIVED" : "DRAFT";
    if (kind === "homepage") await prisma.homepageContent.update({ where: { id }, data: { status: nextStatus } });
    if (kind === "post") await prisma.post.update({ where: { id }, data: { status: nextStatus } });
    if (kind === "agenda") await prisma.agendaItem.update({ where: { id }, data: { status: nextStatus } });
    if (kind === "material") await prisma.studyMaterial.update({ where: { id }, data: { status: nextStatus } });
    if (kind === "publication") await prisma.publication.update({ where: { id }, data: { contentStatus: nextStatus } });
  }

  if (transition === "restore") {
    if (kind === "homepage") await prisma.homepageContent.update({ where: { id }, data: { status: "DRAFT" } });
    if (kind === "post") await prisma.post.update({ where: { id }, data: { status: "DRAFT" } });
    if (kind === "agenda") await prisma.agendaItem.update({ where: { id }, data: { status: "DRAFT" } });
    if (kind === "material") await prisma.studyMaterial.update({ where: { id }, data: { status: "DRAFT" } });
    if (kind === "publication") await prisma.publication.update({ where: { id }, data: { contentStatus: "DRAFT" } });
  }

  await revalidateEditorial(locale, kind);
  redirect(collectionPath(locale, kind));
}

export async function deleteEditorialAction(
  recordId: string,
  formData: FormData,
) {
  const session = await readAdminSession();
  if (!session || !canPermanentlyDelete(session.role) || process.env.DATABASE_READY !== "true") return;
  const kind = text(formData, "kind") as PersistedKind;
  const id = recordId || text(formData, "id");
  if (!isObjectId(id)) return;
  const current = await currentSnapshot(kind, id);
  if (!current || current.status !== "ARCHIVED") throw new Error("Record harus diarsipkan sebelum dihapus.");
  if (kind === "publication" && "sourceFingerprint" in current.record && current.record.sourceFingerprint) {
    throw new Error("Publikasi kanonis hanya dapat diarsipkan.");
  }
  const assetId =
    kind === "material" && "assetId" in current.record
      ? current.record.assetId
      : kind === "publication" && "cardImageId" in current.record
        ? current.record.cardImageId
        : null;
  let removableAsset: { id: string; storageKey: string } | null = null;
  if (assetId) {
    const [asset, materialReferences, publicationReferences] = await Promise.all([
      prisma.mediaAsset.findUnique({ where: { id: assetId }, select: { id: true, storageKey: true } }),
      prisma.studyMaterial.count({ where: { assetId } }),
      prisma.publication.count({ where: { cardImageId: assetId } }),
    ]);
    if (asset && materialReferences + publicationReferences <= 1) {
      const { UTApi } = await import("uploadthing/server");
      const deleted = await new UTApi().deleteFiles(asset.storageKey);
      if (!deleted.success) throw new Error("Berkas storage gagal dihapus; record dipertahankan.");
      removableAsset = asset;
    }
  }
  await prisma.$transaction(async (database) => {
    await database.contentRevision.deleteMany({ where: { kind: revisionKind(kind), recordId: id } });
    await database.slugRedirect.deleteMany({ where: { kind: revisionKind(kind), recordId: id } });
    if (kind === "post") await database.post.delete({ where: { id } });
    if (kind === "agenda") await database.agendaItem.delete({ where: { id } });
    if (kind === "material") await database.studyMaterial.delete({ where: { id } });
    if (kind === "publication") await database.publication.delete({ where: { id } });
    if (removableAsset) await database.mediaAsset.delete({ where: { id: removableAsset.id } });
  });
  await revalidateEditorial(text(formData, "locale"), kind);
}

export async function bulkEditorialAction(formData: FormData) {
  const session = await readAdminSession();
  if (!session || process.env.DATABASE_READY !== "true") return;
  const kind = text(formData, "kind") as PersistedKind;
  const transition = text(formData, "transition");
  const ids = formData
    .getAll("ids")
    .filter((value): value is string => typeof value === "string");
  if (!ids.length || !["archive", "restore"].includes(transition)) return;
  const status: ContentStatus =
    transition === "archive" ? ContentStatus.ARCHIVED : ContentStatus.DRAFT;
  const allowedCurrent: ContentStatus | { in: ContentStatus[] } =
    transition === "archive"
      ? { in: [ContentStatus.DRAFT, ContentStatus.PUBLISHED] }
      : ContentStatus.ARCHIVED;
  const data = { status, lastEditedById: session.id };
  if (kind === "post") {
    await prisma.post.updateMany({
      where: { id: { in: ids }, status: allowedCurrent },
      data,
    });
  }
  if (kind === "agenda") {
    await prisma.agendaItem.updateMany({
      where: { id: { in: ids }, status: allowedCurrent },
      data,
    });
  }
  if (kind === "material") {
    await prisma.studyMaterial.updateMany({
      where: { id: { in: ids }, status: allowedCurrent },
      data,
    });
  }
  if (kind === "publication") {
    await prisma.publication.updateMany({
      where: {
        id: { in: ids },
        homepageOrder: null,
        contentStatus: allowedCurrent,
      },
      data: { contentStatus: status, lastEditedById: session.id },
    });
  }
  await revalidateEditorial(text(formData, "locale"), kind);
}

function jsonField(formData: FormData, name: string) {
  try {
    return JSON.parse(text(formData, name)) as unknown;
  } catch {
    return undefined;
  }
}

export async function saveEditorialRecordAction(
  _state: EditorActionState,
  formData: FormData,
): Promise<EditorActionState> {
  const session = await readAdminSession();
  if (!session || process.env.DATABASE_READY !== "true") {
    return { message: "Penyimpanan masih terkunci sampai database siap." };
  }
  const kind = text(formData, "kind") as EditorialKind;
  const id = text(formData, "id");
  const current = await currentSnapshot(kind, id);
  if (!current) return { message: "Record tidak ditemukan." };
  const changed = current.status === "PUBLISHED";

  if (kind === "homepage") {
    const parsed = homepageInputSchema.safeParse(jsonField(formData, "payload"));
    if (!parsed.success) return { message: parsed.error.issues[0]?.message || "Periksa isi beranda." };
    await prisma.homepageContent.update({
      where: { id },
      data: {
        payload: parsed.data as Prisma.InputJsonValue,
        draftVersion: { increment: 1 },
        hasUnpublishedChanges: changed,
        lastEditedById: session.id,
      },
    });
  }

  if (kind === "post") {
    const parsed = postInputSchema.safeParse({
      titleId: text(formData, "titleId"),
      titleEn: text(formData, "titleEn"),
      slugId: text(formData, "slugId"),
      slugEn: text(formData, "slugEn"),
      excerptId: text(formData, "excerptId"),
      excerptEn: text(formData, "excerptEn"),
      contentId: jsonField(formData, "contentId"),
      contentEn: jsonField(formData, "contentEn"),
      topics: text(formData, "topics").split(",").map((item) => item.trim()).filter(Boolean),
      pinned: formData.get("pinned") === "on",
      coverImage: text(formData, "coverImage"),
      canonicalExternal: text(formData, "canonicalExternal"),
      status: current.status,
    });
    if (!parsed.success) return { message: parsed.error.issues[0]?.message || "Periksa isi tulisan." };
    const collision = await prisma.post.findFirst({
      where: {
        id: { not: id },
        OR: [
          { slugId: parsed.data.slugId },
          ...(parsed.data.slugEn ? [{ slugEn: parsed.data.slugEn }] : []),
        ],
      },
      select: { id: true },
    });
    if (collision) return { message: "Slug sudah digunakan tulisan lain." };
    const redirectCollision = await prisma.slugRedirect.findFirst({
      where: {
        kind: "POST",
        recordId: { not: id },
        OR: [
          { locale: "id", oldSlug: parsed.data.slugId },
          ...(parsed.data.slugEn ? [{ locale: "en", oldSlug: parsed.data.slugEn }] : []),
        ],
      },
      select: { id: true },
    });
    if (redirectCollision) return { message: "Slug merupakan alamat lama tulisan lain." };
    const previous = postInputSchema.safeParse(current.record.publishedSnapshot);
    if (previous.success) {
      for (const [routeLocale, oldSlug, newSlug] of [
        ["id", previous.data.slugId, parsed.data.slugId],
        ["en", previous.data.slugEn, parsed.data.slugEn],
      ] as const) {
        if (oldSlug && newSlug && oldSlug !== newSlug) {
          await prisma.slugRedirect.upsert({
            where: { kind_locale_oldSlug: { kind: "POST", locale: routeLocale, oldSlug } },
            update: { recordId: id },
            create: { kind: "POST", locale: routeLocale, oldSlug, recordId: id },
          });
        }
      }
    }
    await prisma.post.update({
      where: { id },
      data: {
        ...parsed.data,
        titleEn: optional(parsed.data.titleEn || ""),
        slugEn: optional(parsed.data.slugEn || ""),
        excerptId: optional(parsed.data.excerptId || ""),
        excerptEn: optional(parsed.data.excerptEn || ""),
        contentEn: parsed.data.contentEn?.length ? parsed.data.contentEn : undefined,
        coverImage: optional(parsed.data.coverImage || ""),
        canonicalExternal: optional(parsed.data.canonicalExternal || ""),
        draftVersion: { increment: 1 },
        hasUnpublishedChanges: changed,
        lastEditedById: session.id,
      },
    });
  }

  if (kind === "agenda") {
    const parsed = agendaInputSchema.safeParse({
      titleId: text(formData, "titleId"), titleEn: text(formData, "titleEn"),
      slugId: text(formData, "slugId"), slugEn: text(formData, "slugEn"),
      descriptionId: text(formData, "descriptionId"), descriptionEn: text(formData, "descriptionEn"),
      startsAt: text(formData, "startsAt"), endsAt: text(formData, "endsAt") || undefined,
      locationLabelId: text(formData, "locationLabelId"), locationLabelEn: text(formData, "locationLabelEn"),
      externalUrl: text(formData, "externalUrl"), status: current.status,
    });
    if (!parsed.success) return { message: parsed.error.issues[0]?.message || "Periksa agenda." };
    const collision = await prisma.agendaItem.findFirst({
      where: {
        id: { not: id },
        OR: [
          { slugId: parsed.data.slugId },
          ...(parsed.data.slugEn ? [{ slugEn: parsed.data.slugEn }] : []),
        ],
      },
      select: { id: true },
    });
    if (collision) return { message: "Slug sudah digunakan agenda lain." };
    await prisma.agendaItem.update({
      where: { id },
      data: {
        ...parsed.data,
        titleEn: optional(parsed.data.titleEn || ""),
        slugEn: optional(parsed.data.slugEn || ""),
        descriptionEn: optional(parsed.data.descriptionEn || ""),
        locationLabelId: optional(parsed.data.locationLabelId || ""),
        locationLabelEn: optional(parsed.data.locationLabelEn || ""),
        externalUrl: optional(parsed.data.externalUrl || ""),
        draftVersion: { increment: 1 },
        hasUnpublishedChanges: changed,
        lastEditedById: session.id,
      },
    });
  }

  if (kind === "material") {
    const replacementKey = text(formData, "storageKey");
    let replacementAssetId = replacementKey ? "replacement-pending" : text(formData, "assetId");
    const replacementSize = Number(text(formData, "fileSize"));
    const replacementRights = text(formData, "rightsNote").trim();
    if (replacementKey) {
      if (!replacementRights || !Number.isFinite(replacementSize) || replacementSize <= 0) {
        return { message: "Metadata dan catatan hak berkas pengganti wajib diisi." };
      }
    }
    const parsed = materialInputSchema.safeParse({
      titleId: text(formData, "titleId"), titleEn: text(formData, "titleEn"),
      slugId: text(formData, "slugId"), slugEn: text(formData, "slugEn"),
      descriptionId: text(formData, "descriptionId"), descriptionEn: text(formData, "descriptionEn"),
      courseId: text(formData, "courseId"), courseEn: text(formData, "courseEn"),
      topicId: text(formData, "topicId"), topicEn: text(formData, "topicEn"),
      resourceType: text(formData, "resourceType"), semester: text(formData, "semester"),
      academicYear: text(formData, "academicYear"),
      tagsId: text(formData, "tagsId").split(",").map((item) => item.trim()).filter(Boolean),
      tagsEn: text(formData, "tagsEn").split(",").map((item) => item.trim()).filter(Boolean),
      assetId: replacementAssetId, externalUrl: text(formData, "externalUrl"),
      downloadAllowed: formData.get("downloadAllowed") === "on",
      pinned: formData.get("pinned") === "on", status: current.status,
    });
    if (!parsed.success) return { message: parsed.error.issues[0]?.message || "Periksa materi." };
    const collision = await prisma.studyMaterial.findFirst({
      where: {
        id: { not: id },
        OR: [
          { slugId: parsed.data.slugId },
          ...(parsed.data.slugEn ? [{ slugEn: parsed.data.slugEn }] : []),
        ],
      },
      select: { id: true },
    });
    if (collision) return { message: "Slug sudah digunakan materi lain." };
    const redirectCollision = await prisma.slugRedirect.findFirst({
      where: {
        kind: "MATERIAL",
        recordId: { not: id },
        OR: [
          { locale: "id", oldSlug: parsed.data.slugId },
          ...(parsed.data.slugEn ? [{ locale: "en", oldSlug: parsed.data.slugEn }] : []),
        ],
      },
      select: { id: true },
    });
    if (redirectCollision) return { message: "Slug merupakan alamat lama materi lain." };
    const previous = materialInputSchema.safeParse(current.record.publishedSnapshot);
    if (previous.success) {
      for (const [routeLocale, oldSlug, newSlug] of [
        ["id", previous.data.slugId, parsed.data.slugId],
        ["en", previous.data.slugEn, parsed.data.slugEn],
      ] as const) {
        if (oldSlug && newSlug && oldSlug !== newSlug) {
          await prisma.slugRedirect.upsert({
            where: { kind_locale_oldSlug: { kind: "MATERIAL", locale: routeLocale, oldSlug } },
            update: { recordId: id },
            create: { kind: "MATERIAL", locale: routeLocale, oldSlug, recordId: id },
          });
        }
      }
    }
    if (replacementKey) {
      const asset = await prisma.mediaAsset.create({
        data: {
          storageKey: replacementKey,
          url: text(formData, "assetUrl"),
          fileName: text(formData, "fileName"),
          mimeType: text(formData, "mimeType"),
          size: replacementSize,
          rightsNote: replacementRights,
        },
      });
      replacementAssetId = asset.id;
    }
    await prisma.studyMaterial.update({
      where: { id },
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
        assetId: replacementAssetId || null,
        externalUrl: parsed.data.externalUrl || null,
        draftVersion: { increment: 1 },
        hasUnpublishedChanges: changed,
        lastEditedById: session.id,
      },
    });
  }

  if (kind === "publication") {
    const parsed = publicationInputSchema.safeParse({
      type: text(formData, "type"), title: text(formData, "title"),
      authors: text(formData, "authors").split("\n").map((item) => item.trim()).filter(Boolean),
      editors: text(formData, "editors").split("\n").map((item) => item.trim()).filter(Boolean),
      year: text(formData, "year"), dateLabel: text(formData, "dateLabel"),
      containerTitle: text(formData, "containerTitle"), publisher: text(formData, "publisher"),
      publicationPlace: text(formData, "publicationPlace"), volume: text(formData, "volume"),
      issue: text(formData, "issue"), seriesNumber: text(formData, "seriesNumber"),
      pages: text(formData, "pages"), doi: text(formData, "doi"),
      externalUrl: text(formData, "externalUrl"), status: text(formData, "status"),
      coverImage: text(formData, "coverImage"), coverRightsNote: text(formData, "coverRightsNote"),
      sourceName: text(formData, "sourceName"), sourceUrl: text(formData, "sourceUrl"),
      sourceNote: text(formData, "sourceNote"),
    });
    if (!parsed.success) return { message: parsed.error.issues[0]?.message || "Periksa publikasi." };
    const value = { ...parsed.data };
    delete value.coverRightsNote;
    await prisma.publication.update({
      where: { id },
      data: {
        ...value,
        dateLabel: optional(value.dateLabel || ""),
        containerTitle: optional(value.containerTitle || ""),
        venue: optional(value.containerTitle || ""),
        publisher: optional(value.publisher || ""),
        publicationPlace: optional(value.publicationPlace || ""),
        volume: optional(value.volume || ""),
        issue: optional(value.issue || ""),
        seriesNumber: optional(value.seriesNumber || ""),
        pages: optional(value.pages || ""),
        doi: value.doi || null, externalUrl: value.externalUrl || null,
        sourceUrl: value.sourceUrl || null,
        coverImage: value.coverImage || null,
        draftVersion: { increment: 1 },
        hasUnpublishedChanges: changed,
        lastEditedById: session.id,
      },
    });
  }

  await revalidateEditorial(text(formData, "locale"), kind);
  return {
    ok: true,
    message: "Perubahan draft tersimpan.",
    savedAt: new Date().toISOString(),
  };
}

export async function upsertHomepageAction(
  _state: EditorActionState,
  formData: FormData,
): Promise<EditorActionState> {
  const session = await readAdminSession();
  if (!session || process.env.DATABASE_READY !== "true") {
    return { message: "Penyimpanan masih terkunci sampai database siap." };
  }
  const parsed = homepageInputSchema.safeParse(jsonField(formData, "payload"));
  if (!parsed.success) {
    return { message: parsed.error.issues[0]?.message || "Periksa isi beranda." };
  }
  const record = await prisma.homepageContent.upsert({
    where: { key: "main" },
    update: {
      payload: parsed.data as Prisma.InputJsonValue,
      draftVersion: { increment: 1 },
      hasUnpublishedChanges: true,
      lastEditedById: session.id,
    },
    create: {
      key: "main",
      payload: parsed.data as Prisma.InputJsonValue,
      lastEditedById: session.id,
    },
  });
  revalidatePath(collectionPath(text(formData, "locale"), "homepage"));
  return {
    ok: true,
    message: `Draft beranda tersimpan (${record.id}).`,
    recordId: record.id,
    savedAt: new Date().toISOString(),
  };
}

export async function duplicateEditorialAction(
  recordId: string,
  formData: FormData,
) {
  const session = await readAdminSession();
  if (!session || process.env.DATABASE_READY !== "true") return;
  const kind = text(formData, "kind") as PersistedKind;
  const id = recordId;
  if (!isObjectId(id)) return;
  const suffix = Date.now().toString(36);

  if (kind === "post") {
    const record = await prisma.post.findUnique({ where: { id } });
    if (record) {
      const { id: _id, createdAt: _createdAt, updatedAt: _updatedAt, ...data } = record;
      void _id; void _createdAt; void _updatedAt;
      await prisma.post.create({
        data: {
          ...data,
          contentId: data.contentId as Prisma.InputJsonValue,
          contentEn: data.contentEn
            ? (data.contentEn as Prisma.InputJsonValue)
            : undefined,
          titleId: `${data.titleId} (salinan)`,
          slugId: `${data.slugId}-salinan-${suffix}`,
          slugEn: data.slugEn ? `${data.slugEn}-copy-${suffix}` : null,
          status: "DRAFT",
          pinned: false,
          publishedSnapshot: undefined,
          publishedVersion: null,
          publishedAt: null,
          hasUnpublishedChanges: false,
          lastEditedById: session.id,
        },
      });
    }
  }
  if (kind === "agenda") {
    const record = await prisma.agendaItem.findUnique({ where: { id } });
    if (record) {
      const { id: _id, createdAt: _createdAt, updatedAt: _updatedAt, ...data } = record;
      void _id; void _createdAt; void _updatedAt;
      await prisma.agendaItem.create({
        data: {
          ...data,
          titleId: `${data.titleId} (salinan)`,
          slugId: `${data.slugId}-salinan-${suffix}`,
          slugEn: data.slugEn ? `${data.slugEn}-copy-${suffix}` : null,
          status: "DRAFT", publishedSnapshot: undefined, publishedVersion: null,
          publishedAt: null, hasUnpublishedChanges: false, lastEditedById: session.id,
        },
      });
    }
  }
  if (kind === "material") {
    const record = await prisma.studyMaterial.findUnique({ where: { id } });
    if (record) {
      const { id: _id, createdAt: _createdAt, updatedAt: _updatedAt, ...data } = record;
      void _id; void _createdAt; void _updatedAt;
      await prisma.studyMaterial.create({
        data: {
          ...data,
          titleId: `${data.titleId} (salinan)`,
          slugId: `${data.slugId}-salinan-${suffix}`,
          slugEn: data.slugEn ? `${data.slugEn}-copy-${suffix}` : null,
          status: "DRAFT", pinned: false, publishedSnapshot: undefined,
          publishedVersion: null, publishedAt: null,
          hasUnpublishedChanges: false, lastEditedById: session.id,
        },
      });
    }
  }
  if (kind === "publication") {
    const record = await prisma.publication.findUnique({ where: { id } });
    if (record) {
      const { id: _id, createdAt: _createdAt, updatedAt: _updatedAt, ...data } = record;
      void _id; void _createdAt; void _updatedAt;
      await prisma.publication.create({
        data: {
          ...data,
          title: `${data.title} (salinan)`,
          sourceFingerprint: null,
          rawCitation: null,
          contentStatus: "DRAFT",
          featured: false,
          homepageOrder: null,
          publishedSnapshot: undefined,
          publishedVersion: null,
          publishedAt: null,
          hasUnpublishedChanges: false,
          lastEditedById: session.id,
        },
      });
    }
  }
  await revalidateEditorial(text(formData, "locale"), kind);
}

export async function setHomepagePublicationsAction(formData: FormData) {
  return setHomepagePublicationGroup(formData, "non-books");
}

export async function setHomepageBooksAction(formData: FormData) {
  return setHomepagePublicationGroup(formData, "books");
}

async function setHomepagePublicationGroup(
  formData: FormData,
  group: "books" | "non-books",
) {
  const session = await readAdminSession();
  if (!session || process.env.DATABASE_READY !== "true") return;
  const locale = text(formData, "locale") === "en" ? "en" : "id";
  const base = collectionPath(locale, "homepage");
  const label = group === "books" ? "buku" : "publikasi non-buku";
  const ids = ["first", "second", "third"].map((name) => text(formData, name));
  if (new Set(ids).size !== 3 || ids.some((id) => !id)) {
    const query = new URLSearchParams({
      selectionError: `Pilih tepat tiga ${label} yang berbeda.`,
    });
    redirect(`${base}?${query.toString()}#publikasi-otomatis`);
  }
  const eligible = await prisma.publication.count({
    where: {
      id: { in: ids },
      type: group === "books" ? "BOOK" : { not: "BOOK" },
      contentStatus: "PUBLISHED",
      ...(group === "books"
        ? {
            OR: [
              { cardImageId: { not: null } },
              { coverImage: { not: null } },
            ],
          }
        : {}),
    },
  });
  if (eligible !== 3) {
    const query = new URLSearchParams({
      selectionError:
        group === "books"
          ? "Semua pilihan harus berupa buku terbit dengan cover berizin."
          : "Semua pilihan harus berupa publikasi non-buku yang sedang terbit.",
    });
    redirect(`${base}?${query.toString()}#publikasi-otomatis`);
  }
  await prisma.$transaction([
    prisma.publication.updateMany({
      where: {
        homepageOrder: { not: null },
        type: group === "books" ? "BOOK" : { not: "BOOK" },
      },
      data: { homepageOrder: null, featured: false },
    }),
    ...ids.map((id, index) =>
      prisma.publication.update({
        where: { id },
        data: { homepageOrder: index + 1, featured: true, lastEditedById: session.id },
      }),
    ),
  ]);
  updateTag("content:publication");
  revalidatePath("/id");
  revalidatePath("/en");
  revalidatePath(base);
  revalidatePath(collectionPath(locale, "publication"));
  redirect(`${base}?selectionSaved=${group}#publikasi-otomatis`);
}

export async function restoreRevisionAction(formData: FormData) {
  const session = await readAdminSession();
  if (!session || process.env.DATABASE_READY !== "true") return;
  const kind = text(formData, "kind") as EditorialKind;
  const id = text(formData, "id");
  const version = Number(text(formData, "version"));
  const revision = await prisma.contentRevision.findUnique({
    where: { kind_recordId_version: { kind: revisionKind(kind), recordId: id, version } },
  });
  if (!revision) return;

  if (kind === "homepage") {
    const parsed = homepageInputSchema.safeParse(revision.snapshot);
    if (parsed.success) await prisma.homepageContent.update({ where: { id }, data: { payload: parsed.data as Prisma.InputJsonValue, draftVersion: { increment: 1 }, hasUnpublishedChanges: true, lastEditedById: session.id } });
  }
  if (kind === "post") {
    const parsed = postInputSchema.safeParse(revision.snapshot);
    if (parsed.success) await prisma.post.update({ where: { id }, data: { ...parsed.data, titleEn: optional(parsed.data.titleEn || ""), slugEn: optional(parsed.data.slugEn || ""), excerptId: optional(parsed.data.excerptId || ""), excerptEn: optional(parsed.data.excerptEn || ""), contentEn: parsed.data.contentEn?.length ? parsed.data.contentEn : undefined, coverImage: optional(parsed.data.coverImage || ""), canonicalExternal: optional(parsed.data.canonicalExternal || ""), draftVersion: { increment: 1 }, hasUnpublishedChanges: true, lastEditedById: session.id } });
  }
  if (kind === "agenda") {
    const parsed = agendaInputSchema.safeParse(revision.snapshot);
    if (parsed.success) await prisma.agendaItem.update({ where: { id }, data: { ...parsed.data, titleEn: optional(parsed.data.titleEn || ""), slugEn: optional(parsed.data.slugEn || ""), descriptionEn: optional(parsed.data.descriptionEn || ""), locationLabelId: optional(parsed.data.locationLabelId || ""), locationLabelEn: optional(parsed.data.locationLabelEn || ""), externalUrl: optional(parsed.data.externalUrl || ""), draftVersion: { increment: 1 }, hasUnpublishedChanges: true, lastEditedById: session.id } });
  }
  if (kind === "material") {
    const parsed = materialInputSchema.safeParse(revision.snapshot);
    if (parsed.success) await prisma.studyMaterial.update({ where: { id }, data: { ...parsed.data, titleEn: optional(parsed.data.titleEn || ""), slugEn: optional(parsed.data.slugEn || ""), descriptionEn: optional(parsed.data.descriptionEn || ""), courseEn: optional(parsed.data.courseEn || ""), topicId: optional(parsed.data.topicId || ""), topicEn: optional(parsed.data.topicEn || ""), semester: optional(parsed.data.semester || ""), academicYear: optional(parsed.data.academicYear || ""), assetId: parsed.data.assetId || null, externalUrl: parsed.data.externalUrl || null, draftVersion: { increment: 1 }, hasUnpublishedChanges: true, lastEditedById: session.id } });
  }
  if (kind === "publication") {
    const parsed = publicationInputSchema.safeParse(revision.snapshot);
    if (parsed.success) {
      const value = { ...parsed.data };
      delete value.coverRightsNote;
      await prisma.publication.update({ where: { id }, data: { ...value, dateLabel: optional(value.dateLabel || ""), containerTitle: optional(value.containerTitle || ""), venue: optional(value.containerTitle || ""), publisher: optional(value.publisher || ""), publicationPlace: optional(value.publicationPlace || ""), volume: optional(value.volume || ""), issue: optional(value.issue || ""), seriesNumber: optional(value.seriesNumber || ""), pages: optional(value.pages || ""), doi: value.doi || null, externalUrl: value.externalUrl || null, sourceUrl: value.sourceUrl || null, coverImage: value.coverImage || null, draftVersion: { increment: 1 }, hasUnpublishedChanges: true, lastEditedById: session.id } });
    }
  }
  await revalidateEditorial(text(formData, "locale"), kind);
}
