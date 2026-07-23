import Link from "next/link";

import { ArrowRightIcon, FileIcon } from "@/components/icons";

export function EmptyState({
  title,
  description,
  actionHref,
  actionLabel,
}: {
  title: string;
  description: string;
  actionHref?: string;
  actionLabel?: string;
}) {
  return (
    <div className="empty-state">
      <span className="empty-icon" aria-hidden="true">
        <FileIcon />
      </span>
      <div>
        <h2>{title}</h2>
        <p>{description}</p>
        {actionHref && actionLabel ? (
          <Link className="text-link" href={actionHref}>
            {actionLabel}
            <ArrowRightIcon />
          </Link>
        ) : null}
      </div>
    </div>
  );
}
