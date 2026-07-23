import Image from "next/image";
import Link from "next/link";

import { EmptyState } from "@/components/empty-state";
import { ArrowRightIcon } from "@/components/icons";
import { PageHero } from "@/components/page-hero";
import { PublicationList } from "@/components/publication-list";
import { researchAreas, roles } from "@/data/site";
import { getDictionary } from "@/data/translations";
import { getPublishedPublications } from "@/lib/content/publications";
import { getRoutePath, type Locale } from "@/lib/i18n";

type SearchParams = Record<string, string | string[] | undefined>;

function searchValue(value: string | string[] | undefined) {
  return typeof value === "string" ? value : "";
}

export function MaterialsPage({
  locale,
  filters,
}: {
  locale: Locale;
  filters: SearchParams;
}) {
  const copy = getDictionary(locale).materials;
  const typeValues = ["slide", "reading", "syllabus", "assignment", "dataset", "video"];

  return (
    <main id="konten-utama">
      <PageHero {...copy} />
      <section className="page-content">
        <div className="shell">
          <form
            className="filter-panel"
            id="pencarian"
            action={getRoutePath(locale, "materials")}
            method="get"
          >
            <div className="filter-field">
              <label htmlFor="q">{copy.searchLabel}</label>
              <input
                id="q"
                name="q"
                type="search"
                placeholder={copy.searchPlaceholder}
                defaultValue={searchValue(filters.q)}
              />
            </div>
            <div className="filter-field">
              <label htmlFor="course">{copy.courseLabel}</label>
              <select id="course" name="course" defaultValue={searchValue(filters.course)}>
                <option value="">{copy.allCourses}</option>
              </select>
            </div>
            <div className="filter-field">
              <label htmlFor="type">{copy.typeLabel}</label>
              <select id="type" name="type" defaultValue={searchValue(filters.type)}>
                <option value="">{copy.allTypes}</option>
                {copy.types.map((label, index) => (
                  <option value={typeValues[index]} key={typeValues[index]}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
            <div className="filter-field">
              <label htmlFor="period">{copy.periodLabel}</label>
              <select id="period" name="period" defaultValue={searchValue(filters.period)}>
                <option value="">{copy.allPeriods}</option>
              </select>
            </div>
            <button className="filter-submit" type="submit">
              {copy.apply}
            </button>
          </form>
          <EmptyState title={copy.emptyTitle} description={copy.emptyDescription} />
        </div>
      </section>
    </main>
  );
}

export function PostsPage({
  locale,
  filters,
}: {
  locale: Locale;
  filters: SearchParams;
}) {
  const copy = getDictionary(locale).posts;

  return (
    <main id="konten-utama">
      <PageHero {...copy} />
      <section className="page-content">
        <div className="shell">
          <form className="filter-panel" action={getRoutePath(locale, "posts")} method="get">
            <div className="filter-field">
              <label htmlFor="q">{copy.searchLabel}</label>
              <input
                id="q"
                name="q"
                type="search"
                placeholder={copy.searchPlaceholder}
                defaultValue={searchValue(filters.q)}
              />
            </div>
            <div className="filter-field">
              <label htmlFor="topic">{copy.topicLabel}</label>
              <select id="topic" name="topic" defaultValue={searchValue(filters.topic)}>
                <option value="">{copy.allTopics}</option>
              </select>
            </div>
            <button className="filter-submit" type="submit">
              {copy.apply}
            </button>
          </form>
          <EmptyState title={copy.emptyTitle} description={copy.emptyDescription} />
        </div>
      </section>
    </main>
  );
}

export function AgendaPage({ locale }: { locale: Locale }) {
  const copy = getDictionary(locale).agenda;

  return (
    <main id="konten-utama">
      <PageHero {...copy} />
      <section className="page-content">
        <div className="shell">
          <div className="content-note">
            <div>
              <strong>{copy.noteTitle}</strong> {copy.note}
            </div>
          </div>
          <EmptyState title={copy.emptyTitle} description={copy.emptyDescription} />
        </div>
      </section>
    </main>
  );
}

export async function PublicationsPage({
  locale,
  filters,
}: {
  locale: Locale;
  filters: SearchParams;
}) {
  const copy = getDictionary(locale).publications;
  const allPublications = await getPublishedPublications();
  const query = searchValue(filters.q).trim().toLocaleLowerCase(locale);
  const type = searchValue(filters.type);
  const year = searchValue(filters.year);
  const publications = allPublications.filter((publication) => {
    const matchesQuery =
      !query ||
      [publication.title, publication.authors, publication.venue, publication.year]
        .join(" ")
        .toLocaleLowerCase(locale)
        .includes(query);
    return (!type || publication.typeKey === type) && (!year || publication.year === year) && matchesQuery;
  });
  const years = [...new Set(allPublications.map((publication) => publication.year))];

  return (
    <main id="konten-utama">
      <PageHero {...copy} />
      <section className="page-content publication-page">
        <div className="shell">
          <div className="content-note">
            <div>
              <strong>{copy.noteTitle}</strong> {copy.note}
            </div>
          </div>
          <form
            className="filter-panel"
            action={getRoutePath(locale, "publications")}
            method="get"
          >
            <div className="filter-field">
              <label htmlFor="q">{copy.searchLabel}</label>
              <input
                id="q"
                name="q"
                type="search"
                placeholder={copy.searchPlaceholder}
                defaultValue={searchValue(filters.q)}
              />
            </div>
            <div className="filter-field">
              <label htmlFor="type">{copy.typeLabel}</label>
              <select id="type" name="type" defaultValue={type}>
                <option value="">{copy.allTypes}</option>
                {Object.entries(copy.typeNames).map(([value, label]) => (
                  <option value={value} key={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
            <div className="filter-field">
              <label htmlFor="year">{copy.yearLabel}</label>
              <select id="year" name="year" defaultValue={year}>
                <option value="">{copy.allYears}</option>
                {years.map((option) => (
                  <option value={option} key={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
            <button className="filter-submit" type="submit">
              {copy.apply}
            </button>
          </form>
          {publications.length > 0 ? (
            <PublicationList publications={publications} locale={locale} showFullLink />
          ) : (
            <div className="empty-state">
              <div>
                <h2>{copy.noResultsTitle}</h2>
                <p>{copy.noResultsDescription}</p>
              </div>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

export function AboutPage({ locale }: { locale: Locale }) {
  const copy = getDictionary(locale).about;

  return (
    <main id="konten-utama">
      <PageHero {...copy} />
      <section className="page-content">
        <div className="shell about-grid">
          <aside className="about-aside">
            <div className="about-photo">
              <Image
                src="/burhanuddin-muhtadi.webp"
                alt="Prof. Burhanuddin Muhtadi"
                fill
                sizes="(max-width: 840px) 90vw, 36vw"
              />
            </div>
            <p className="about-caption">{copy.photoCaption}</p>
          </aside>

          <div className="about-copy">
            {copy.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}

            <section className="about-section" aria-labelledby="roles-title">
              <h2 id="roles-title">{copy.rolesTitle}</h2>
              <dl className="timeline">
                {roles[locale].map((role, index) => (
                  <div key={role}>
                    <dt>{copy.roleDates[index]}</dt>
                    <dd>{role}</dd>
                  </div>
                ))}
              </dl>
            </section>

            <section className="about-section" aria-labelledby="education-title">
              <h2 id="education-title">{copy.educationTitle}</h2>
              <p>{copy.education}</p>
            </section>

            <section className="about-section" aria-labelledby="research-title">
              <h2 id="research-title">{copy.researchTitle}</h2>
              <ul className="topic-list">
                {researchAreas[locale].map((area) => (
                  <li key={area}>{area}</li>
                ))}
              </ul>
            </section>
          </div>
        </div>
      </section>
    </main>
  );
}

export function AdminLoginPage({ locale }: { locale: Locale }) {
  const copy = getDictionary(locale).admin;

  return (
    <main id="konten-utama" className="login-wrap">
      <section className="login-card" aria-labelledby="login-title">
        <p className="eyebrow">{copy.eyebrow}</p>
        <h1 id="login-title">{copy.title}</h1>
        <p>{copy.intro}</p>
        <div className="foundation-lock" role="status">
          <strong>{copy.lockTitle}</strong>
          {copy.lockText}
        </div>
        <div className="upload-flow" aria-label={copy.flowLabel}>
          {copy.steps.map((step) => (
            <span key={step}>{step}</span>
          ))}
        </div>
        <Link className="text-link" href={getRoutePath(locale, "home")}>
          {copy.back} <ArrowRightIcon />
        </Link>
      </section>
    </main>
  );
}
