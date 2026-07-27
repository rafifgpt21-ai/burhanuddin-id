"use client";

import { useTransition } from "react";

import { logoutAction } from "@/app/[locale]/admin/actions";
import { clearDraftRecoveriesForUser } from "@/lib/admin/draft-recovery";
import type { Locale } from "@/lib/i18n";

export function AdminLogout({
  label,
  locale,
  userId,
}: {
  label: string;
  locale: Locale;
  userId: string;
}) {
  const [pending, startTransition] = useTransition();
  return (
    <button
      className="admin-logout"
      disabled={pending}
      onClick={() => {
        startTransition(async () => {
          await clearDraftRecoveriesForUser(userId);
          const data = new FormData();
          data.set("locale", locale);
          await logoutAction(data);
        });
      }}
      type="button"
    >
      {pending ? "…" : label}
    </button>
  );
}
