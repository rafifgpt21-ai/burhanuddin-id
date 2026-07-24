import { z } from "zod";

const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const academicYearPattern = /^20\d{2}\/20\d{2}$/;

const httpsUrl = z
  .string()
  .trim()
  .url("Alamat tautan tidak valid.")
  .refine((value) => value.startsWith("https://"), {
    message: "Tautan harus menggunakan HTTPS.",
  });

const optionalHttpsUrl = z.union([z.literal(""), httpsUrl]).optional();
const optionalPublicationImageUrl = z
  .union([
    z.literal(""),
    httpsUrl.refine(
      (value) => {
        const url = new URL(value);
        return (
          url.hostname === "m0xcz6d4a4.ufs.sh" &&
          url.pathname.startsWith("/f/")
        );
      },
      { message: "Gambar publikasi harus berasal dari unggahan situs." },
    ),
  ])
  .optional();
const optionalShortText = (maximum: number) =>
  z.string().trim().max(maximum).optional().or(z.literal(""));

const postBlockSchema = z.object({
  type: z.literal("paragraph"),
  text: z.string().trim().min(1).max(12_000),
});

export const postInputSchema = z.object({
  titleId: z.string().trim().min(3).max(180),
  titleEn: optionalShortText(180),
  slugId: z.string().trim().regex(slugPattern).max(180),
  slugEn: optionalShortText(180),
  excerptId: optionalShortText(600),
  excerptEn: optionalShortText(600),
  contentId: z.array(postBlockSchema).min(1).max(120),
  contentEn: z.array(postBlockSchema).max(120).optional(),
  topics: z.array(z.string().trim().min(1).max(48)).max(12),
  coverImage: optionalHttpsUrl,
  canonicalExternal: optionalHttpsUrl,
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]),
});

export const materialInputSchema = z
  .object({
    titleId: z.string().trim().min(3).max(180),
    titleEn: optionalShortText(180),
    slugId: z.string().trim().regex(slugPattern).max(180),
    slugEn: optionalShortText(180),
    descriptionId: z.string().trim().min(20).max(600),
    descriptionEn: optionalShortText(600),
    courseId: z.string().trim().min(2).max(120),
    courseEn: optionalShortText(120),
    topicId: optionalShortText(120),
    topicEn: optionalShortText(120),
    resourceType: z.enum([
      "SLIDE",
      "READING",
      "SYLLABUS",
      "ASSIGNMENT",
      "DATASET",
      "VIDEO",
      "LINK",
      "OTHER",
    ]),
    semester: optionalShortText(40),
    academicYear: z.union([z.literal(""), z.string().trim().regex(academicYearPattern)]).optional(),
    tagsId: z.array(z.string().trim().min(1).max(48)).max(12),
    tagsEn: z.array(z.string().trim().min(1).max(48)).max(12),
    assetId: z.string().trim().min(1).optional().or(z.literal("")),
    externalUrl: optionalHttpsUrl,
    downloadAllowed: z.boolean(),
    pinned: z.boolean(),
    status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]),
  })
  .superRefine((value, context) => {
    const targets = Number(Boolean(value.assetId)) + Number(Boolean(value.externalUrl));

    if (targets !== 1) {
      context.addIssue({
        code: "custom",
        path: ["assetId"],
        message: "Pilih tepat satu tujuan: berkas unggahan atau tautan eksternal.",
      });
    }
  });

export const agendaInputSchema = z
  .object({
    titleId: z.string().trim().min(3).max(180),
    titleEn: optionalShortText(180),
    slugId: z.string().trim().regex(slugPattern).max(180),
    slugEn: optionalShortText(180),
    descriptionId: z.string().trim().min(20).max(600),
    descriptionEn: optionalShortText(600),
    startsAt: z.coerce.date(),
    endsAt: z.coerce.date().optional(),
    locationLabelId: z.string().trim().max(220).optional().or(z.literal("")),
    locationLabelEn: z.string().trim().max(220).optional().or(z.literal("")),
    externalUrl: optionalHttpsUrl,
    status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]),
  })
  .superRefine((value, context) => {
    if (value.endsAt && value.endsAt <= value.startsAt) {
      context.addIssue({
        code: "custom",
        path: ["endsAt"],
        message: "Waktu selesai harus setelah waktu mulai.",
      });
    }
  });

export const publicationInputSchema = z
  .object({
    type: z.enum(["BOOK", "JOURNAL_ARTICLE", "BOOK_CHAPTER", "ADDITIONAL_RESEARCH_OUTPUT"]),
    title: z.string().trim().min(3).max(500),
    authors: z.array(z.string().trim().min(1).max(180)).min(1).max(40),
    year: z.coerce.number().int().min(1900).max(2100),
    venue: z.string().trim().max(300).optional().or(z.literal("")),
    doi: z.string().trim().max(180).optional().or(z.literal("")),
    externalUrl: optionalHttpsUrl,
    status: z.enum(["PUBLISHED", "FORTHCOMING", "PREPRINT", "ERRATUM", "REVIEW"]),
    coverImage: optionalPublicationImageUrl,
    coverRightsNote: optionalShortText(300),
    sourceName: z.string().trim().min(2).max(180),
    sourceUrl: optionalHttpsUrl,
    sourceNote: optionalShortText(600),
  })
  .superRefine((value, context) => {
    if (value.coverImage && !value.coverRightsNote?.trim()) {
      context.addIssue({
        code: "custom",
        path: ["coverRightsNote"],
        message: "Catatan hak penggunaan gambar wajib diisi.",
      });
    }
  });

export type PostInput = z.infer<typeof postInputSchema>;
export type MaterialInput = z.infer<typeof materialInputSchema>;
export type AgendaInput = z.infer<typeof agendaInputSchema>;
export type PublicationInput = z.infer<typeof publicationInputSchema>;
