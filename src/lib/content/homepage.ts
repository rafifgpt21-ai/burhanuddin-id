import "server-only";
import { unstable_cache } from "next/cache";

import { aboutProfile } from "@/data/about";
import { researchClusters } from "@/data/public";
import {
  brandLogoSource,
  googleScholarProfile,
  portraitSource,
  roles,
} from "@/data/site";
import { getDictionary } from "@/data/translations";
import { prisma } from "@/lib/prisma";
import {
  homepageInputSchema,
  type HomepageInput,
} from "@/lib/validation/content";

function localePayload(locale: "id" | "en"): HomepageInput["id"] {
  const copy = getDictionary(locale).home;

  return {
    officialLabel: copy.brandIntro.label,
    tagline: copy.brandIntro.tagline,
    quote: copy.brandIntro.quote,
    fields: copy.brandIntro.fields,
    continueAction: copy.brandIntro.continueAction,
    academicPrefix: copy.academicName.prefix,
    academicName: copy.academicName.name,
    academicSuffix: copy.academicName.suffix,
    lead: copy.lead,
    profileAction: copy.profileAction,
    portraitCaption: copy.portraitCaption,
    roles: [...roles[locale]] as [string, string, string],
    publicationEyebrow: copy.publications.eyebrow,
    publicationTitle: copy.publications.title,
    publicationDescription: copy.publications.description,
    publicationAction: copy.publications.action,
    booksLabel: copy.publications.booksLabel,
    outreachEyebrow: copy.outreach.eyebrow,
    outreachTitle: copy.outreach.title,
    outreachDescription: copy.outreach.description,
    outreachAction: copy.outreach.action,
    agendaLabel: copy.outreach.agendaLabel,
    forumLabel: copy.outreach.forumLabel,
    materialsAction: copy.outreach.materialsAction,
    closingEyebrow: copy.closing.eyebrow,
    closingTitle: copy.closing.title,
    contactAction: copy.closing.contactAction,
    closingProfileAction: copy.closing.profileAction,
  };
}

export function getHomepageFallback(): HomepageInput {
  const talksId = aboutProfile.id.talks.slice(0, 2);
  const talksEn = aboutProfile.en.talks.slice(0, 2);

  return {
    id: localePayload("id"),
    en: localePayload("en"),
    logoUrl: brandLogoSource,
    portraitUrl: portraitSource,
    portraitAltId: "Potret resmi Prof. Burhanuddin Muhtadi",
    portraitAltEn: "Official portrait of Prof. Burhanuddin Muhtadi",
    mediaRightsNote:
      "Logo dan potret disediakan serta disetujui oleh pemilik situs.",
    research: researchClusters.id.map((cluster, index) => ({
      key: cluster.key,
      titleId: cluster.title,
      titleEn: researchClusters.en[index]?.title ?? cluster.title,
      descriptionId: cluster.description,
      descriptionEn:
        researchClusters.en[index]?.description ?? cluster.description,
      workYear: cluster.work.year,
      workTitle: cluster.work.title,
      workUrl: cluster.work.href ?? "",
    })),
    forums: talksId.map((talk, index) => ({
      year: talk.year,
      titleId: talk.title,
      titleEn: talksEn[index]?.title ?? talk.title,
      institutionId: talk.institution ?? "Forum akademik",
      institutionEn: talksEn[index]?.institution ?? "Academic forum",
    })) as HomepageInput["forums"],
    scholar: googleScholarProfile,
  };
}

export function resolveHomepageLocaleContent(
  homepage: HomepageInput,
  locale: "id" | "en",
): HomepageInput["id"] {
  if (locale === "id") return homepage.id;

  const merged = Object.fromEntries(
    Object.entries(homepage.id).map(([key, indonesianValue]) => {
      const englishValue =
        homepage.en[key as keyof HomepageInput["en"]];
      return [
        key,
        typeof englishValue === "string" && englishValue.trim()
          ? englishValue
          : indonesianValue,
      ];
    }),
  ) as HomepageInput["id"];

  merged.roles = homepage.id.roles.map(
    (role, index) => homepage.en.roles[index] || role,
  );
  return merged;
}

export async function getPublishedHomepage(): Promise<HomepageInput> {
  const fallback = getHomepageFallback();
  if (process.env.DATABASE_READY !== "true") return fallback;

  const record = await unstable_cache(
    () => prisma.homepageContent.findUnique({
      where: { key: "main" },
      select: { status: true, publishedSnapshot: true },
    }),
    ["published-homepage"],
    { tags: ["content:homepage"] },
  )().catch(() => null);

  if (record?.status !== "PUBLISHED" || !record.publishedSnapshot) {
    return fallback;
  }

  const parsed = homepageInputSchema.safeParse(record.publishedSnapshot);
  return parsed.success ? parsed.data : fallback;
}
