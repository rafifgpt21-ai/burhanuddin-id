import "server-only";
import { unstable_cache } from "next/cache";

import { prisma } from "@/lib/prisma";
import type { Locale } from "@/lib/i18n";
import type { PublicAgendaItem } from "@/lib/content/agenda-utils";
import { agendaInputSchema } from "@/lib/validation/content";

let agendaDatabaseUnavailable = false;

export async function getPublishedAgenda(
  locale: Locale,
): Promise<PublicAgendaItem[]> {
  if (
    process.env.DATABASE_READY !== "true" ||
    agendaDatabaseUnavailable
  ) {
    return [];
  }

  const records = await unstable_cache(() => prisma.agendaItem.findMany({
      where: { status: "PUBLISHED" },
    }), ["published-agenda"], { tags: ["content:agenda"] })().catch(() => {
      agendaDatabaseUnavailable = true;
      return [];
    });

  return records.flatMap((record) => {
    const parsed = agendaInputSchema.safeParse(record.publishedSnapshot ?? {
      titleId: record.titleId, titleEn: record.titleEn ?? "",
      slugId: record.slugId, slugEn: record.slugEn ?? "",
      descriptionId: record.descriptionId, descriptionEn: record.descriptionEn ?? "",
      startsAt: record.startsAt, endsAt: record.endsAt ?? undefined,
      locationLabelId: record.locationLabelId ?? "", locationLabelEn: record.locationLabelEn ?? "",
      externalUrl: record.externalUrl ?? "", status: record.status,
    });
    if (!parsed.success) return [];
    const value = parsed.data;
    return [{
      id: record.id,
      title: locale === "en" ? value.titleEn || value.titleId : value.titleId,
      description: locale === "en" ? value.descriptionEn || value.descriptionId : value.descriptionId,
      startsAt: value.startsAt,
      endsAt: value.endsAt,
      location: locale === "en" ? value.locationLabelEn || value.locationLabelId || undefined : value.locationLabelId || undefined,
      externalUrl: value.externalUrl || undefined,
    }];
  }).sort((first, second) => first.startsAt.getTime() - second.startsAt.getTime());
}
