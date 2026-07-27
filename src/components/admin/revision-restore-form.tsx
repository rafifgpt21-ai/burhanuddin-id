"use client";

import { restoreRevisionAction } from "@/app/[locale]/admin/(workspace)/editor-actions";
import { adminText } from "@/data/admin-qol";
import type { EditorialKind } from "@/lib/content/admin-records";
import type { Locale } from "@/lib/i18n";

export function RevisionRestoreForm({
  children,
  id,
  kind,
  locale,
  version,
}: {
  children: React.ReactNode;
  id: string;
  kind: EditorialKind;
  locale: Locale;
  version: number;
}) {
  return (
    <form action={restoreRevisionAction}>
      <input name="kind" type="hidden" value={kind} />
      <input name="id" type="hidden" value={id} />
      <input name="locale" type="hidden" value={locale} />
      <input name="version" type="hidden" value={version} />
      {children}
      <button
        onClick={(event) => {
          if (!window.confirm(adminText(
            locale,
            `Pulihkan versi ${version} sebagai draft kerja? Versi publik tidak akan berubah.`,
            `Restore version ${version} as the working draft? The public version will not change.`,
          ))) {
            event.preventDefault();
          }
        }}
        type="submit"
      >
        {adminText(locale, "Pulihkan sebagai draft", "Restore as draft")}
      </button>
    </form>
  );
}
