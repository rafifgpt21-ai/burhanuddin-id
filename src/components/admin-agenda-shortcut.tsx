"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import { ArrowRightIcon } from "@/components/icons";
import type { Locale } from "@/lib/i18n";

export function AdminAgendaShortcut({
  locale,
  mode = "manage",
}: {
  locale: Locale;
  mode?: "create" | "manage";
}) {
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    void fetch("/api/admin/session-status", {
      cache: "no-store",
      signal: controller.signal,
    })
      .then((response) => (response.ok ? response.json() : null))
      .then((result: { authenticated?: boolean } | null) => {
        setAuthenticated(result?.authenticated === true);
      })
      .catch(() => undefined);

    return () => controller.abort();
  }, []);

  if (!authenticated) return null;

  return (
    <Link
      className="agenda-admin-shortcut"
      href={
        mode === "create"
          ? `/${locale}/admin/agenda/baru`
          : `/${locale}/admin/agenda`
      }
    >
      {mode === "create"
        ? locale === "id"
          ? "Buat agenda"
          : "Create agenda"
        : locale === "id"
          ? "Kelola agenda"
          : "Manage agenda"}
      <ArrowRightIcon />
    </Link>
  );
}
