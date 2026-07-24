import "server-only";

import { prisma } from "@/lib/prisma";
import type { Locale } from "@/lib/i18n";
import type { PublicAgendaItem } from "@/lib/content/agenda-utils";

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

  const records = await prisma.agendaItem.findMany({
      where: { status: "PUBLISHED" },
      orderBy: { startsAt: "asc" },
    })
    .catch(() => {
      agendaDatabaseUnavailable = true;
      return [];
    });

  return records.map((record) => ({
    id: record.id,
    title:
      locale === "en" && record.titleEn ? record.titleEn : record.titleId,
    description:
      locale === "en" && record.descriptionEn
        ? record.descriptionEn
        : record.descriptionId,
    startsAt: record.startsAt,
    endsAt: record.endsAt ?? undefined,
    location:
      locale === "en" && record.locationLabelEn
        ? record.locationLabelEn
        : record.locationLabelId ?? undefined,
    externalUrl: record.externalUrl ?? undefined,
  }));
}
