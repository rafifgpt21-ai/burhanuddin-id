import Image from "next/image";

import { ArrowUpRightIcon } from "@/components/icons";
import type { Publication } from "@/data/site";
import { getDictionary } from "@/data/translations";
import {
  formatContributors,
  publicationGroupKey,
  publicationGroupOrder,
  publicationImprint,
  publicationSourceLabel,
} from "@/lib/content/publication-display";
import type { Locale } from "@/lib/i18n";

const labels = {
  id: {
    authors: "Penulis",
    editors: "Editor",
    publishedIn: "Terbit di",
    details: "Detail",
    volume: "Vol.",
    issue: "No.",
    seriesNumber: "Nomor",
    pages: "Hal.",
    open: "Buka publikasi",
    works: "karya",
    status: {
      PUBLISHED: "Terbit",
      FORTHCOMING: "Akan terbit",
      PREPRINT: "Pracetak",
      ERRATUM: "Koreksi",
      REVIEW: "Ulasan",
    },
  },
  en: {
    authors: "Authors",
    editors: "Editors",
    publishedIn: "Published in",
    details: "Details",
    volume: "Vol.",
    issue: "No.",
    seriesNumber: "Number",
    pages: "pp.",
    open: "Open publication",
    works: "works",
    status: {
      PUBLISHED: "Published",
      FORTHCOMING: "Forthcoming",
      PREPRINT: "Preprint",
      ERRATUM: "Erratum",
      REVIEW: "Review",
    },
  },
} as const;

function publicationDetails(
  publication: Publication,
  locale: Locale,
) {
  const copy = labels[locale];
  return [
    publication.volume
      ? `${copy.volume} ${publication.volume}`
      : null,
    publication.issue ? `${copy.issue} ${publication.issue}` : null,
    publication.seriesNumber
      ? `${copy.seriesNumber} ${publication.seriesNumber}`
      : null,
    publication.pages ? `${copy.pages} ${publication.pages}` : null,
    publication.dateLabel,
  ].filter((item): item is string => Boolean(item));
}

function PublicationCard({
  publication,
  locale,
}: {
  publication: Publication;
  locale: Locale;
}) {
  const dictionary = getDictionary(locale);
  const copy = labels[locale];
  const imprint = publicationImprint(publication);
  const details = publicationDetails(publication, locale);
  const sourceLabel = publicationSourceLabel(publication);
  const typeLabel = dictionary.publications.typeNames[publication.typeKey];
  const imageAlt =
    locale === "id"
      ? publication.image?.altId || `Gambar publikasi ${publication.title}`
      : publication.image?.altEn || `Publication image for ${publication.title}`;

  return (
    <article className="publication-card">
      <div className="publication-card-visual">
        {publication.image ? (
          <Image
            alt={imageAlt}
            fill
            sizes="(max-width: 359px) calc(100vw - 40px), (max-width: 720px) 104px, 176px"
            src={publication.image.url}
          />
        ) : (
          <div className="publication-placeholder" aria-hidden="true">
            <span>{typeLabel}</span>
            <strong>{publication.year}</strong>
            <small>{copy.status[publication.status]}</small>
          </div>
        )}
      </div>

      <div className="publication-card-content">
        <div className="publication-card-body">
          <p className="publication-card-kicker">
            <span>{typeLabel}</span>
            <span aria-hidden="true">·</span>
            <span>{publication.year}</span>
            <span aria-hidden="true">·</span>
            <span>{copy.status[publication.status]}</span>
          </p>
          <h3>{publication.title}</h3>
        </div>
        <dl className="publication-metadata">
          <div>
            <dt>{copy.authors}</dt>
            <dd>{formatContributors(publication.authors, locale)}</dd>
          </div>
          {publication.editors?.length ? (
            <div>
              <dt>{copy.editors}</dt>
              <dd>{formatContributors(publication.editors, locale)}</dd>
            </div>
          ) : null}
          {imprint ? (
            <div>
              <dt>{copy.publishedIn}</dt>
              <dd>{imprint}</dd>
            </div>
          ) : null}
          {details.length ? (
            <div>
              <dt>{copy.details}</dt>
              <dd>{details.join(" · ")}</dd>
            </div>
          ) : null}
        </dl>
      </div>
      {publication.href ? (
        <div className="publication-card-footer">
          <span>{sourceLabel}</span>
          <a
            className="publication-card-link"
            href={publication.href}
            target="_blank"
            rel="noreferrer"
            aria-label={`${copy.open}: ${publication.title}`}
          >
            {copy.open}
            <ArrowUpRightIcon />
          </a>
        </div>
      ) : null}
    </article>
  );
}

export function PublicationList({
  publications,
  locale,
}: {
  publications: Publication[];
  locale: Locale;
}) {
  const dictionary = getDictionary(locale);
  const copy = labels[locale];
  const groups = publicationGroupOrder
    .map((key) => ({
      key,
      publications: publications.filter(
        (publication) => publicationGroupKey(publication) === key,
      ),
    }))
    .filter((group) => group.publications.length);

  return (
    <div className="publication-groups">
      {groups.map((group) => {
        const headingId = `publication-group-${group.key}`;
        return (
          <section
            className="publication-group"
            aria-labelledby={headingId}
            key={group.key}
          >
            <header className="publication-group-heading">
              <h2 id={headingId}>
                {dictionary.publications.typeNames[group.key]}
              </h2>
              <p>
                {String(group.publications.length).padStart(2, "0")} {copy.works}
              </p>
            </header>
            <div className="publication-card-list">
              {group.publications.map((publication) => (
                <PublicationCard
                  key={publication.id || `${publication.year}-${publication.title}`}
                  publication={publication}
                  locale={locale}
                />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
