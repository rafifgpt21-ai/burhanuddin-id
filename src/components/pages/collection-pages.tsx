import Image from "next/image";
import Link from "next/link";

import { EmptyState } from "@/components/empty-state";
import { ArrowRightIcon } from "@/components/icons";
import { PageHero } from "@/components/page-hero";
import { PublicationList } from "@/components/publication-list";
import { aboutProfile } from "@/data/about";
import { portraitSource, researchAreas } from "@/data/site";
import { getDictionary } from "@/data/translations";
import {
  publicationGroupKey,
  publicationSearchText,
} from "@/lib/content/publication-display";
import { getPublishedPublications } from "@/lib/content/publications";
import {
  getPublishedMaterials,
  getPublishedPosts,
} from "@/lib/content/collections";
import { getRoutePath, type Locale } from "@/lib/i18n";

type SearchParams = Record<string, string | string[] | undefined>;

function searchValue(value: string | string[] | undefined) {
  return typeof value === "string" ? value : "";
}

export async function MaterialsPage({
  locale,
  filters,
}: {
  locale: Locale;
  filters: SearchParams;
}) {
  const copy = getDictionary(locale).materials;
  const allMaterials = await getPublishedMaterials(locale);
  const query = searchValue(filters.q).trim().toLocaleLowerCase(locale);
  const course = searchValue(filters.course);
  const type = searchValue(filters.type).toUpperCase();
  const period = searchValue(filters.period);
  const materials = allMaterials.filter((material) => {
    const searchable = [
      material.title,
      material.description,
      material.course,
      material.topic,
      material.tags.join(" "),
    ]
      .filter(Boolean)
      .join(" ")
      .toLocaleLowerCase(locale);
    return (
      (!query || searchable.includes(query)) &&
      (!course || material.course === course) &&
      (!type || material.resourceType === type) &&
      (!period ||
        material.academicYear === period ||
        material.semester === period)
    );
  });
  const courses = [...new Set(allMaterials.map((material) => material.course))];
  const periods = [
    ...new Set(
      allMaterials.flatMap((material) =>
        [material.academicYear, material.semester].filter(
          (value): value is string => Boolean(value),
        ),
      ),
    ),
  ];
  const typeValues = ["slide", "reading", "syllabus", "assignment", "dataset", "video", "link", "other"];

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
                {courses.map((option) => <option value={option} key={option}>{option}</option>)}
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
                {periods.map((option) => <option value={option} key={option}>{option}</option>)}
              </select>
            </div>
            <button className="filter-submit" type="submit">
              {copy.apply}
            </button>
          </form>
          {materials.length ? (
            <div className="public-content-list material-card-list">
              {materials.map((material) => (
                <article key={material.id}>
                  <div className="content-list-meta">
                    <span>{material.resourceType.replaceAll("_", " ")}</span>
                    {material.academicYear ? <span>{material.academicYear}</span> : null}
                  </div>
                  <h2>
                    <Link href={`${getRoutePath(locale, "materials")}/${material.slug}`}>
                      {material.title}
                    </Link>
                  </h2>
                  <p>{material.description}</p>
                  <small>{material.course}{material.topic ? ` · ${material.topic}` : ""}</small>
                </article>
              ))}
            </div>
          ) : (
            <EmptyState title={copy.emptyTitle} description={copy.emptyDescription} />
          )}
        </div>
      </section>
    </main>
  );
}

export async function PostsPage({
  locale,
  filters,
}: {
  locale: Locale;
  filters: SearchParams;
}) {
  const copy = getDictionary(locale).posts;
  const allPosts = await getPublishedPosts(locale);
  const query = searchValue(filters.q).trim().toLocaleLowerCase(locale);
  const topic = searchValue(filters.topic);
  const posts = allPosts.filter((post) => {
    const searchable = [post.title, post.excerpt, post.topics.join(" ")]
      .join(" ")
      .toLocaleLowerCase(locale);
    return (!query || searchable.includes(query)) && (!topic || post.topics.includes(topic));
  });
  const topics = [...new Set(allPosts.flatMap((post) => post.topics))];

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
                {topics.map((option) => <option value={option} key={option}>{option}</option>)}
              </select>
            </div>
            <button className="filter-submit" type="submit">
              {copy.apply}
            </button>
          </form>
          {posts.length ? (
            <div className="public-content-list post-card-list">
              {posts.map((post) => (
                <article key={post.id}>
                  <div className="content-list-meta">
                    {post.pinned ? <span>{locale === "id" ? "Pilihan" : "Featured"}</span> : null}
                    {post.publishedAt ? (
                      <time dateTime={post.publishedAt.toISOString()}>
                        {new Intl.DateTimeFormat(locale === "id" ? "id-ID" : "en-GB", {
                          dateStyle: "medium",
                        }).format(post.publishedAt)}
                      </time>
                    ) : null}
                  </div>
                  <h2>
                    <Link href={`${getRoutePath(locale, "posts")}/${post.slug}`}>
                      {post.title}
                    </Link>
                  </h2>
                  {post.excerpt ? <p>{post.excerpt}</p> : null}
                  <small>{post.topics.join(" · ")}</small>
                </article>
              ))}
            </div>
          ) : (
            <EmptyState title={copy.emptyTitle} description={copy.emptyDescription} />
          )}
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
      publicationSearchText(publication)
        .toLocaleLowerCase(locale)
        .includes(query);
    return (
      (!type || publicationGroupKey(publication) === type) &&
      (!year || publication.year === year) &&
      matchesQuery
    );
  });
  const years = [...new Set(allPublications.map((publication) => publication.year))];

  return (
    <main id="konten-utama">
      <PageHero {...copy} showIndex={false} />
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
                {Object.entries(copy.typeNames)
                  .filter(([value]) => value !== "inaugural-address")
                  .map(([value, label]) => (
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
            <PublicationList publications={publications} locale={locale} />
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
  const profile = aboutProfile[locale];
  const ids =
    locale === "id"
      ? {
          biography: "biografi",
          roles: "peran",
          education: "pendidikan",
          career: "karier",
          honours: "penghargaan",
        }
      : {
          biography: "biography",
          roles: "roles",
          education: "education",
          career: "career",
          honours: "honours",
        };
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Burhanuddin Muhtadi",
    honorificPrefix: "Prof.",
    honorificSuffix: "M.A., Ph.D.",
    birthDate: "1977-12-15",
    birthPlace: {
      "@type": "Place",
      name: "Rembang, Jawa Tengah, Indonesia",
    },
    image: portraitSource,
    jobTitle: [
      "Professor of Political Science",
      "Founder and Executive Director of Indikator Politik Indonesia",
      "Visiting Senior Research Fellow",
    ],
    alumniOf: [
      {
        "@type": "CollegeOrUniversity",
        name: "Australian National University",
      },
      {
        "@type": "CollegeOrUniversity",
        name: "UIN Syarif Hidayatullah Jakarta",
      },
    ],
    knowsAbout: researchAreas.en,
    sameAs: profile.links.map((link) => link.href),
  };

  return (
    <main id="konten-utama">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData).replace(/</g, "\\u003c"),
        }}
      />
      <PageHero {...copy} description="" showIndex={false} />

      <section className="page-content about-dossier">
        <div className="shell about-grid">
          <aside className="about-aside" aria-label={copy.contentsLabel}>
            <figure className="about-portrait">
              <div className="about-photo">
                <Image
                  src={portraitSource}
                  alt={copy.photoAlt}
                  fill
                  priority
                  sizes="(max-width: 840px) 92vw, 420px"
                />
                <span className="about-monogram" aria-hidden="true">
                  BM
                </span>
              </div>
              <figcaption className="about-caption">{copy.photoCaption}</figcaption>
            </figure>

            <dl className="about-facts">
              {profile.facts.map((fact) => (
                <div key={fact.label}>
                  <dt>{fact.label}</dt>
                  <dd>{fact.value}</dd>
                </div>
              ))}
            </dl>

            <nav className="about-contents about-contents-desktop">
              <p>{copy.contentsLabel}</p>
              {copy.contents.map((item) => (
                <a href={item.href} key={item.href}>
                  <span>{item.label}</span>
                  <ArrowRightIcon />
                </a>
              ))}
            </nav>

            <details className="about-contents-mobile">
              <summary>
                <span>{copy.contentsLabel}</span>
                <ArrowRightIcon />
              </summary>
              <nav aria-label={copy.contentsLabel}>
                {copy.contents.map((item) => (
                  <a href={item.href} key={item.href}>
                    <span>{item.label}</span>
                    <ArrowRightIcon />
                  </a>
                ))}
              </nav>
            </details>
          </aside>

          <article className="about-copy">
            <section className="about-introduction" id={ids.biography}>
              <h2 className="eyebrow about-biography-heading">
                {copy.biographyTitle}
              </h2>
              <div className="about-prose">
                <p>
                  {profile.lead} {profile.biography[0]}
                </p>
                {profile.biography.slice(1).map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </section>

            <section className="about-section" id={ids.roles} aria-labelledby="roles-title">
              <div className="about-section-heading">
                <p className="eyebrow">{copy.rolesTitle}</p>
                <h2 id="roles-title">{copy.rolesTitle}</h2>
              </div>
              <div className="about-role-grid">
                {profile.currentRoles.map((role) => (
                  <article key={`${role.year}-${role.title}`}>
                    <span>{role.year}</span>
                    <h3>{role.title}</h3>
                    {role.institution ? <p>{role.institution}</p> : null}
                    {role.detail ? <small>{role.detail}</small> : null}
                  </article>
                ))}
              </div>
            </section>

            <section className="about-section" aria-labelledby="research-title">
              <div className="about-section-heading">
                <p className="eyebrow">{copy.researchTitle}</p>
                <h2 id="research-title">{copy.researchTitle}</h2>
              </div>
              <ul className="about-topic-list">
                {researchAreas[locale].map((area) => (
                  <li key={area}>{area}</li>
                ))}
              </ul>
            </section>

            <section
              className="about-section"
              id={ids.education}
              aria-labelledby="education-title"
            >
              <div className="about-section-heading">
                <p className="eyebrow">{copy.educationTitle}</p>
                <h2 id="education-title">{copy.educationTitle}</h2>
              </div>
              <AboutTimeline entries={profile.education} />
            </section>

            <section className="about-section" id={ids.career} aria-labelledby="career-title">
              <div className="about-section-heading">
                <p className="eyebrow">{copy.careerTitle}</p>
                <h2 id="career-title">{copy.careerTitle}</h2>
                <p>{copy.careerIntro}</p>
              </div>
              <AboutTimeline entries={profile.career} />
            </section>

            <section
              className="about-section"
              id={ids.honours}
              aria-labelledby="awards-title"
            >
              <div className="about-section-heading">
                <p className="eyebrow">{copy.awardsTitle}</p>
                <h2 id="awards-title">{copy.awardsTitle}</h2>
              </div>
              <AboutTimeline entries={profile.awards} />
            </section>

            <section className="about-section" aria-labelledby="talks-title">
              <div className="about-section-heading">
                <p className="eyebrow">{copy.talksTitle}</p>
                <h2 id="talks-title">{copy.talksTitle}</h2>
                <p>{copy.talksIntro}</p>
              </div>
              <AboutTimeline entries={profile.talks} />
            </section>
          </article>
        </div>
      </section>
    </main>
  );
}

function AboutTimeline({
  entries,
}: {
  entries: readonly {
    year: string;
    title: string;
    institution?: string;
    detail?: string;
  }[];
}) {
  return (
    <ol className="about-timeline">
      {entries.map((entry) => (
        <li key={`${entry.year}-${entry.title}`}>
          <div className="about-timeline-year">{entry.year}</div>
          <div>
            <h3>{entry.title}</h3>
            {entry.institution ? <p>{entry.institution}</p> : null}
            {entry.detail ? <small>{entry.detail}</small> : null}
          </div>
        </li>
      ))}
    </ol>
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
