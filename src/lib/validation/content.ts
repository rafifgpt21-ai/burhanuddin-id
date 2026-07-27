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
const optionalShortTextWithDefault = (maximum: number) =>
  optionalShortText(maximum).default("");

const blockText = z.string().trim().min(1).max(12_000);
const postBlockSchema = z.discriminatedUnion("type", [
  z.object({ type: z.literal("paragraph"), text: blockText }),
  z.object({
    type: z.literal("heading"),
    level: z.union([z.literal(2), z.literal(3)]),
    text: z.string().trim().min(1).max(240),
  }),
  z.object({ type: z.literal("quote"), text: blockText, citation: optionalShortText(240) }),
  z.object({
    type: z.literal("link"),
    label: z.string().trim().min(1).max(180),
    url: httpsUrl,
  }),
  z.object({
    type: z.literal("image"),
    url: httpsUrl,
    alt: z.string().trim().min(3).max(240),
    rightsNote: z.string().trim().min(3).max(400),
  }),
  z.object({
    type: z.literal("file"),
    label: z.string().trim().min(1).max(180),
    url: httpsUrl,
  }),
  z.object({
    type: z.literal("video"),
    url: httpsUrl.refine((value) => {
      const hostname = new URL(value).hostname.replace(/^www\./, "");
      return ["youtube.com", "youtu.be", "vimeo.com"].includes(hostname);
    }, "Video hanya boleh berasal dari YouTube atau Vimeo."),
    title: z.string().trim().min(1).max(180),
  }),
]);

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
  pinned: z.boolean().default(false),
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
    tagsEn: z.array(z.string().trim().min(1).max(48)).max(12).default([]),
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
    title: z
      .string()
      .trim()
      .min(3)
      .max(500)
      .refine((value) => !/https?:\/\//i.test(value), {
        message: "Judul tidak boleh memuat URL.",
      }),
    authors: z.array(z.string().trim().min(1).max(180)).min(1).max(40),
    editors: z.array(z.string().trim().min(1).max(180)).max(40).default([]),
    year: z.coerce.number().int().min(1900).max(2100),
    dateLabel: optionalShortText(80),
    containerTitle: optionalShortText(400),
    venue: z.string().trim().max(300).optional().or(z.literal("")),
    publisher: optionalShortText(300),
    publicationPlace: optionalShortText(180),
    volume: optionalShortText(40),
    issue: optionalShortText(40),
    seriesNumber: optionalShortText(80),
    pages: optionalShortText(80),
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
    if (value.doi && !/^10\.\d{4,9}\/\S+$/i.test(value.doi)) {
      context.addIssue({
        code: "custom",
        path: ["doi"],
        message: "DOI harus ditulis tanpa https://doi.org/ dan memakai format 10.xxxx/...",
      });
    }
    if (value.type === "BOOK" && !value.publisher?.trim()) {
      context.addIssue({
        code: "custom",
        path: ["publisher"],
        message: "Penerbit wajib diisi untuk buku.",
      });
    }
    if (value.type !== "BOOK" && !value.containerTitle?.trim()) {
      context.addIssue({
        code: "custom",
        path: ["containerTitle"],
        message: "Jurnal, seri, atau buku induk wajib diisi untuk karya non-buku.",
      });
    }
    if (value.coverImage && !value.coverRightsNote?.trim()) {
      context.addIssue({
        code: "custom",
        path: ["coverRightsNote"],
        message: "Catatan hak penggunaan gambar wajib diisi.",
      });
    }
  });

const homepageLinkSchema = z.object({
  label: z.string().trim().min(1).max(100),
  href: httpsUrl.or(z.string().trim().regex(/^\/[a-z0-9/_#-]*$/i)),
});

const homepageLocaleSchema = z.object({
  officialLabel: z.string().trim().min(3).max(120),
  tagline: z.string().trim().min(3).max(160),
  quote: z.string().trim().min(20).max(800),
  fields: z.string().trim().min(3).max(160),
  continueAction: z.string().trim().min(2).max(80),
  academicPrefix: z.string().trim().min(1).max(30),
  academicName: z.string().trim().min(3).max(120),
  academicSuffix: z.string().trim().min(1).max(60),
  lead: z.string().trim().min(20).max(800),
  profileAction: z.string().trim().min(2).max(80),
  portraitCaption: z.string().trim().min(3).max(180),
  roles: z.array(z.string().trim().min(3).max(240)).length(3),
  publicationEyebrow: z.string().trim().min(2).max(80),
  publicationTitle: z.string().trim().min(2).max(100),
  publicationDescription: z.string().trim().min(10).max(400),
  publicationAction: z.string().trim().min(2).max(80),
  booksLabel: z.string().trim().min(2).max(80),
  outreachEyebrow: z.string().trim().min(2).max(80),
  outreachTitle: z.string().trim().min(2).max(100),
  outreachDescription: z.string().trim().min(10).max(400),
  outreachAction: z.string().trim().min(2).max(80),
  agendaLabel: z.string().trim().min(2).max(80),
  forumLabel: z.string().trim().min(2).max(80),
  materialsAction: z.string().trim().min(2).max(80),
  closingEyebrow: z.string().trim().min(2).max(100),
  closingTitle: z.string().trim().min(2).max(100),
  contactAction: z.string().trim().min(2).max(80),
  closingProfileAction: z.string().trim().min(2).max(80),
});

const homepageEnglishLocaleSchema = z.object({
  officialLabel: optionalShortTextWithDefault(120),
  tagline: optionalShortTextWithDefault(160),
  quote: optionalShortTextWithDefault(800),
  fields: optionalShortTextWithDefault(160),
  continueAction: optionalShortTextWithDefault(80),
  academicPrefix: optionalShortTextWithDefault(30),
  academicName: optionalShortTextWithDefault(120),
  academicSuffix: optionalShortTextWithDefault(60),
  lead: optionalShortTextWithDefault(800),
  profileAction: optionalShortTextWithDefault(80),
  portraitCaption: optionalShortTextWithDefault(180),
  roles: z
    .array(z.string().trim().max(240))
    .max(3)
    .transform((items) => items.filter(Boolean))
    .default([]),
  publicationEyebrow: optionalShortTextWithDefault(80),
  publicationTitle: optionalShortTextWithDefault(100),
  publicationDescription: optionalShortTextWithDefault(400),
  publicationAction: optionalShortTextWithDefault(80),
  booksLabel: optionalShortTextWithDefault(80),
  outreachEyebrow: optionalShortTextWithDefault(80),
  outreachTitle: optionalShortTextWithDefault(100),
  outreachDescription: optionalShortTextWithDefault(400),
  outreachAction: optionalShortTextWithDefault(80),
  agendaLabel: optionalShortTextWithDefault(80),
  forumLabel: optionalShortTextWithDefault(80),
  materialsAction: optionalShortTextWithDefault(80),
  closingEyebrow: optionalShortTextWithDefault(100),
  closingTitle: optionalShortTextWithDefault(100),
  contactAction: optionalShortTextWithDefault(80),
  closingProfileAction: optionalShortTextWithDefault(80),
});

const homepageResearchSchema = z.object({
  key: z.enum(["money-politics", "democracy", "political-islam", "public-opinion"]),
  titleId: z.string().trim().min(3).max(180),
  titleEn: optionalShortTextWithDefault(180),
  descriptionId: z.string().trim().min(20).max(600),
  descriptionEn: optionalShortTextWithDefault(600),
  workYear: z.string().trim().min(4).max(20),
  workTitle: z.string().trim().min(3).max(400),
  workUrl: optionalHttpsUrl,
});

export const homepageInputSchema = z.object({
  id: homepageLocaleSchema,
  en: homepageEnglishLocaleSchema
    .optional()
    .transform((value) => value ?? homepageEnglishLocaleSchema.parse({})),
  logoUrl: httpsUrl,
  portraitUrl: httpsUrl,
  portraitAltId: z.string().trim().min(3).max(240),
  portraitAltEn: optionalShortTextWithDefault(240),
  mediaRightsNote: z.string().trim().min(3).max(500),
  research: z.array(homepageResearchSchema).length(4),
  forums: z
    .array(
      z.object({
        year: z.string().trim().min(4).max(20),
        titleId: z.string().trim().min(3).max(300),
        titleEn: optionalShortTextWithDefault(300),
        institutionId: z.string().trim().min(2).max(240),
        institutionEn: optionalShortTextWithDefault(240),
      }),
    )
    .length(2),
  scholar: homepageLinkSchema,
});

export function getPublishReadiness(
  kind: "POST" | "AGENDA" | "MATERIAL" | "PUBLICATION" | "HOMEPAGE",
  input: unknown,
) {
  const issues: string[] = [];

  if (kind === "HOMEPAGE") {
    const result = homepageInputSchema.safeParse(input);
    return result.success ? issues : result.error.issues.map((issue) => issue.message);
  }

  if (kind === "POST") {
    const result = postInputSchema.safeParse(input);
    if (!result.success) return result.error.issues.map((issue) => issue.message);
    if (!result.data.excerptId) {
      issues.push("Ringkasan Indonesia wajib sebelum tulisan diterbitkan.");
    }
  }

  if (kind === "AGENDA") {
    const result = agendaInputSchema.safeParse(input);
    if (!result.success) return result.error.issues.map((issue) => issue.message);
  }

  if (kind === "MATERIAL") {
    const result = materialInputSchema.safeParse(input);
    if (!result.success) return result.error.issues.map((issue) => issue.message);
  }

  if (kind === "PUBLICATION") {
    const result = publicationInputSchema.safeParse(input);
    if (!result.success) return result.error.issues.map((issue) => issue.message);
    if (!result.data.doi && !result.data.externalUrl && !result.data.sourceUrl) {
      issues.push("Publikasi wajib memiliki DOI atau tautan sumber HTTPS.");
    }
  }

  return issues;
}

export type PostInput = z.infer<typeof postInputSchema>;
export type MaterialInput = z.infer<typeof materialInputSchema>;
export type AgendaInput = z.infer<typeof agendaInputSchema>;
export type PublicationInput = z.infer<typeof publicationInputSchema>;
export type PostBlock = z.infer<typeof postBlockSchema>;
export type HomepageInput = z.infer<typeof homepageInputSchema>;
