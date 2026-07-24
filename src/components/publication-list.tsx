import Image from "next/image";

import { ArrowUpRightIcon } from "@/components/icons";
import type { Publication } from "@/data/site";
import { getDictionary } from "@/data/translations";
import type { Locale } from "@/lib/i18n";

export function PublicationList({
  publications,
  locale,
  showFullLink = false,
}: {
  publications: Publication[];
  locale: Locale;
  showFullLink?: boolean;
}) {
  const dictionary = getDictionary(locale);

  return (
    <div className="publication-list">
      {publications.map((publication) => (
        <article
          className={`publication-row${showFullLink ? " publication-row-no-index" : ""}${
            publication.image ? " publication-row-has-image" : ""
          }`}
          key={publication.id || `${publication.year}-${publication.title}`}
        >
          {publication.image ? (
            <div className="publication-cover">
              <Image
                alt=""
                fill
                sizes="(max-width: 720px) calc(100vw - 40px), 180px"
                src={publication.image}
              />
            </div>
          ) : showFullLink ? null : (
            <div className="publication-index" aria-hidden="true">
              {publication.year.slice(-2)}
            </div>
          )}
          <div className="publication-copy">
            <p className="publication-type">
              {dictionary.publications.typeNames[publication.typeKey]} <span>·</span>{" "}
              {publication.year}
            </p>
            <h3>{publication.title}</h3>
            {publication.authors ? (
              <p>
                {locale === "en"
                  ? publication.authors.replace(", dan ", ", and ")
                  : publication.authors}
              </p>
            ) : null}
            {publication.venue ? <p className="publication-venue">{publication.venue}</p> : null}
          </div>
          {publication.href ? (
            <a
              className={`publication-link${showFullLink ? " publication-source-link" : ""}`}
              href={publication.href}
              target="_blank"
              rel="noreferrer"
              aria-label={`${dictionary.common.openSource} ${publication.title}`}
            >
              {showFullLink ? (
                <span className="publication-link-copy">
                  <span className="publication-link-label">
                    {locale === "id" ? "Buka sumber" : "Open source"}
                  </span>
                  <span className="publication-link-url">{publication.href}</span>
                </span>
              ) : null}
              <ArrowUpRightIcon />
            </a>
          ) : showFullLink ? null : (
            <span aria-hidden="true" />
          )}
        </article>
      ))}
    </div>
  );
}
