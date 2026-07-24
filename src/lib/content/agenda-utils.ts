import type { Locale } from "@/lib/i18n";

export type PublicAgendaItem = {
  id: string;
  title: string;
  description: string;
  startsAt: Date;
  endsAt?: Date;
  location?: string;
  externalUrl?: string;
};

export function partitionAgenda(
  items: readonly PublicAgendaItem[],
  now = new Date(),
) {
  const sorted = [...items].sort(
    (left, right) => left.startsAt.getTime() - right.startsAt.getTime(),
  );

  return {
    upcoming: sorted.filter((item) => (item.endsAt ?? item.startsAt) >= now),
    completed: sorted
      .filter((item) => (item.endsAt ?? item.startsAt) < now)
      .reverse(),
  };
}

export function formatAgendaDate(value: Date, locale: Locale) {
  return new Intl.DateTimeFormat(locale === "id" ? "id-ID" : "en-GB", {
    dateStyle: "long",
    timeStyle: "short",
    timeZone: "Asia/Jakarta",
  }).format(value);
}
