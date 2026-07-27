import { AdminAgendaShortcut } from "@/components/admin-agenda-shortcut";
import { ArrowUpRightIcon, CalendarIcon } from "@/components/icons";
import {
  formatAgendaDate,
  partitionAgenda,
  type PublicAgendaItem,
} from "@/lib/content/agenda-utils";
import type { Locale } from "@/lib/i18n";

export function PublicAgendaList({
  items,
  locale,
  compact = false,
  showAdminShortcut = false,
}: {
  items: readonly PublicAgendaItem[];
  locale: Locale;
  compact?: boolean;
  showAdminShortcut?: boolean;
}) {
  const { upcoming, completed } = partitionAgenda(items);
  const hasPublishedItems = items.length > 0;
  const hasNoUpcomingItems = compact && upcoming.length === 0;
  const emptyCopy = hasPublishedItems
    ? locale === "id"
      ? {
          title: "Belum ada agenda mendatang.",
          description:
            "Agenda yang telah selesai tetap tersedia di halaman Kiprah.",
        }
      : {
          title: "No upcoming agenda.",
          description:
            "Completed events remain available on the Outreach page.",
        }
    : locale === "id"
      ? {
          title: "Belum ada agenda yang diterbitkan.",
          description:
            "Kegiatan akan muncul setelah tanggal, waktu, dan informasinya selesai diverifikasi.",
        }
      : {
          title: "No published agenda yet.",
          description:
            "Events will appear after their date, time, and supporting information have been verified.",
        };

  if (!hasPublishedItems || hasNoUpcomingItems) {
    return (
      <div className="agenda-empty">
        <CalendarIcon />
        <div>
          <h3>{emptyCopy.title}</h3>
          <p>{emptyCopy.description}</p>
          {showAdminShortcut ? (
            <AdminAgendaShortcut
              locale={locale}
              mode={hasPublishedItems ? "manage" : "create"}
            />
          ) : null}
        </div>
      </div>
    );
  }

  const visibleUpcoming = compact ? upcoming.slice(0, 1) : upcoming;
  const visibleCompleted = compact ? [] : completed;

  return (
    <div className="agenda-groups">
      <AgendaGroup
        items={visibleUpcoming}
        label={locale === "id" ? "Mendatang" : "Upcoming"}
        locale={locale}
      />
      {visibleCompleted.length ? (
        <AgendaGroup
          items={visibleCompleted}
          label={locale === "id" ? "Selesai" : "Completed"}
          locale={locale}
          completed
        />
      ) : null}
      {showAdminShortcut ? <AdminAgendaShortcut locale={locale} /> : null}
    </div>
  );
}

function AgendaGroup({
  items,
  label,
  locale,
  completed = false,
}: {
  items: readonly PublicAgendaItem[];
  label: string;
  locale: Locale;
  completed?: boolean;
}) {
  if (items.length === 0) return null;

  return (
    <section className="agenda-group" aria-label={label}>
      <p className="agenda-group-label">{label}</p>
      <div className="agenda-list">
        {items.map((item) => (
          <article className={completed ? "is-completed" : undefined} key={item.id}>
            <time dateTime={item.startsAt.toISOString()}>
              {formatAgendaDate(item.startsAt, locale)}
              <span> WIB</span>
            </time>
            <h3>{item.title}</h3>
            <p>{item.description}</p>
            {item.location ? <small>{item.location}</small> : null}
            {item.externalUrl ? (
              <a href={item.externalUrl} target="_blank" rel="noreferrer">
                {locale === "id" ? "Buka informasi" : "Open details"}
                <ArrowUpRightIcon />
              </a>
            ) : null}
          </article>
        ))}
      </div>
    </section>
  );
}
