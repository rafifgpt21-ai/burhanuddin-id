import Link from "next/link";

import { ArrowRightIcon, ArrowUpRightIcon } from "@/components/icons";
import { researchClusters } from "@/data/public";
import type { ResearchCluster } from "@/data/public";
import { getDictionary } from "@/data/translations";
import { getRoutePath, type Locale } from "@/lib/i18n";

export function ResearchLedger({
  locale,
  showIntroduction = true,
  clusters,
}: {
  locale: Locale;
  showIntroduction?: boolean;
  clusters?: readonly ResearchCluster[];
}) {
  const copy = getDictionary(locale).researchPage;
  const visibleClusters = clusters ?? researchClusters[locale];

  return (
    <div className="research-ledger-layout">
      {showIntroduction ? (
        <div className="research-ledger-intro">
          <p className="eyebrow">{copy.ledgerEyebrow}</p>
          <h2>{copy.ledgerTitle}</h2>
          <p>{copy.ledgerDescription}</p>
          <Link className="text-link" href={getRoutePath(locale, "research")}>
            {copy.ledgerAction}
            <ArrowRightIcon />
          </Link>
        </div>
      ) : null}

      <ol className="research-ledger">
        {visibleClusters.map((cluster, index) => (
          <li key={cluster.key}>
            <span className="ledger-marker" aria-hidden="true">
              {String(index + 1).padStart(2, "0")}
            </span>
            <div className="ledger-copy">
              <h3>{cluster.title}</h3>
              <p>{cluster.description}</p>
            </div>
            <div className="ledger-work">
              <span>{copy.relatedWork}</span>
              {cluster.work.href ? (
                <a
                  href={cluster.work.href}
                  target="_blank"
                  rel="noreferrer"
                >
                  <small>{cluster.work.year}</small>
                  <strong>{cluster.work.title}</strong>
                  <ArrowUpRightIcon />
                </a>
              ) : (
                <div>
                  <small>{cluster.work.year}</small>
                  <strong>{cluster.work.title}</strong>
                </div>
              )}
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
