import Image from "next/image";
import Link from "next/link";

import {
  ArrowRightIcon,
  BookIcon,
  CalendarIcon,
  FileIcon,
} from "@/components/icons";
import { PublicationList } from "@/components/publication-list";
import { SectionHeading } from "@/components/section-heading";
import { researchAreas, roles, selectedPublications } from "@/data/site";
import { getDictionary } from "@/data/translations";
import { getRoutePath, type Locale } from "@/lib/i18n";

const collectionIcons = {
  file: FileIcon,
  book: BookIcon,
  calendar: CalendarIcon,
};

export function HomePage({ locale }: { locale: Locale }) {
  const dictionary = getDictionary(locale);
  const copy = dictionary.home;

  return (
    <main id="konten-utama">
      <section className="hero">
        <div className="hero-grid hero-shell shell">
          <aside className="hero-index" aria-label={copy.indexLabel}>
            <span>{copy.index}</span>
            <strong>{copy.indexRange}</strong>
            <span>{copy.indexTopic}</span>
          </aside>

          <div className="hero-copy">
            <p className="eyebrow hero-eyebrow">{copy.eyebrow}</p>
            <h1>
              Burhanuddin
              <span>Muhtadi</span>
            </h1>
            <p className="hero-lead">{copy.lead}</p>
            <div className="hero-actions">
              <Link
                className="button button-primary"
                href={getRoutePath(locale, "materials")}
              >
                {copy.materialsAction}
                <ArrowRightIcon />
              </Link>
              <Link
                className="button button-secondary"
                href={getRoutePath(locale, "posts")}
              >
                {copy.postsAction}
              </Link>
            </div>
            <ul className="role-list" aria-label={copy.rolesLabel}>
              {roles[locale].map((role) => (
                <li key={role}>{role}</li>
              ))}
            </ul>
          </div>

          <figure className="portrait-block">
            <div className="portrait-frame">
              <Image
                src="/burhanuddin-muhtadi.webp"
                alt="Prof. Burhanuddin Muhtadi"
                fill
                priority
                sizes="(max-width: 720px) 86vw, (max-width: 1100px) 42vw, (max-width: 1199px) 420px, 560px"
              />
            </div>
            <figcaption>
              <span>{copy.portraitLabel}</span>
              <strong>{copy.portraitTopic}</strong>
            </figcaption>
          </figure>
        </div>

        <div
          className="collection-rail hero-shell shell"
          aria-label={copy.collectionsLabel}
        >
          {copy.collections.map((item) => {
            const Icon = collectionIcons[item.icon];
            return (
              <Link href={getRoutePath(locale, item.route)} key={item.route}>
                <span className="collection-code">{item.code}</span>
                <span className="collection-icon" aria-hidden="true">
                  <Icon />
                </span>
                <span>
                  <strong>{item.label}</strong>
                  <small>{item.description}</small>
                </span>
                <ArrowRightIcon className="collection-arrow" />
              </Link>
            );
          })}
        </div>
      </section>

      <section className="section section-materials">
        <div className="shell materials-layout">
          <SectionHeading
            eyebrow={copy.materials.eyebrow}
            title={copy.materials.title}
            description={copy.materials.description}
            action={
              <Link className="text-link" href={getRoutePath(locale, "materials")}>
                {copy.materials.action} <ArrowRightIcon />
              </Link>
            }
          />
          <div className="repository-preview">
            <div className="repository-note">
              <span className="empty-icon" aria-hidden="true">
                <FileIcon />
              </span>
              <div>
                <p className="repository-kicker">{copy.materials.kicker}</p>
                <h3>{copy.materials.noteTitle}</h3>
                <p>{copy.materials.note}</p>
              </div>
            </div>
            <dl className="repository-anatomy">
              {copy.materials.anatomy.map(([term, description]) => (
                <div key={term}>
                  <dt>{term}</dt>
                  <dd>{description}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      <section className="section section-publications">
        <div className="shell publications-layout">
          <SectionHeading
            eyebrow={copy.publications.eyebrow}
            title={copy.publications.title}
            description={copy.publications.description}
            action={
              <Link
                className="text-link text-link-light"
                href={getRoutePath(locale, "publications")}
              >
                {copy.publications.action} <ArrowRightIcon />
              </Link>
            }
          />
          <PublicationList publications={selectedPublications.slice(0, 3)} locale={locale} />
        </div>
      </section>

      <section className="section section-focus">
        <div className="shell focus-grid">
          <SectionHeading
            eyebrow={copy.focus.eyebrow}
            title={copy.focus.title}
            description={copy.focus.description}
          />
          <ul className="topic-list">
            {researchAreas[locale].map((area) => (
              <li key={area}>{area}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section section-updates">
        <div className="shell updates-grid">
          <div className="updates-intro">
            <p className="eyebrow">{copy.updates.eyebrow}</p>
            <h2>{copy.updates.title}</h2>
            <p>{copy.updates.description}</p>
          </div>
          <Link className="update-card" href={getRoutePath(locale, "posts")}>
            <span className="update-label">{copy.updates.postLabel}</span>
            <strong>{copy.updates.postTitle}</strong>
            <small>{copy.updates.postNote}</small>
            <ArrowRightIcon />
          </Link>
          <Link
            className="update-card update-card-agenda"
            href={getRoutePath(locale, "agenda")}
          >
            <span className="update-label">{copy.updates.agendaLabel}</span>
            <strong>{copy.updates.agendaTitle}</strong>
            <small>{copy.updates.agendaNote}</small>
            <CalendarIcon />
          </Link>
        </div>
      </section>
    </main>
  );
}
