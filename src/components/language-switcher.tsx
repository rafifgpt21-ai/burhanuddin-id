"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { MouseEvent } from "react";

import { switchLocalePath, type Locale } from "@/lib/i18n";

export function LanguageSwitcher({
  locale,
  label,
  switchLabel,
}: {
  locale: Locale;
  label: string;
  switchLabel: string;
}) {
  const pathname = usePathname();
  const targetLocale: Locale = locale === "id" ? "en" : "id";
  const targetPath = switchLocalePath(pathname, targetLocale);
  const baseHref = `${targetPath}?setLocale=${targetLocale}`;

  function preserveCurrentFilters(event: MouseEvent<HTMLAnchorElement>) {
    event.preventDefault();
    const query = new URLSearchParams(window.location.search);
    query.set("setLocale", targetLocale);
    window.location.assign(`${targetPath}?${query.toString()}`);
  }

  return (
    <div className="language-switcher" role="group" aria-label={label}>
      <span className="language-label" aria-hidden="true">
        {locale === "id" ? "Bahasa" : "Language"}
      </span>
      <span className="language-options">
        {locale === "id" ? (
          <>
            <strong aria-current="true">ID</strong>
            <span aria-hidden="true">/</span>
            <Link href={baseHref} onClick={preserveCurrentFilters} aria-label={switchLabel}>
              EN
            </Link>
          </>
        ) : (
          <>
            <Link href={baseHref} onClick={preserveCurrentFilters} aria-label={switchLabel}>
              ID
            </Link>
            <span aria-hidden="true">/</span>
            <strong aria-current="true">EN</strong>
          </>
        )}
      </span>
    </div>
  );
}
