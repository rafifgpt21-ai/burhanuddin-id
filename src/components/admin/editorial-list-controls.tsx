"use client";

import { useEffect, useRef, useState } from "react";

import { editorialTransitionAction } from "@/app/[locale]/admin/(workspace)/editor-actions";
import { adminText } from "@/data/admin-qol";
import type { Locale } from "@/lib/i18n";

export function BulkSelectionControl({
  label,
}: {
  label: string;
}) {
  const [selected, setSelected] = useState(0);
  const labelRef = useRef<HTMLLabelElement>(null);
  useEffect(() => {
    const form = labelRef.current?.closest("form");
    if (!form) return;
    const update = () => {
      const checked = form.querySelectorAll<HTMLInputElement>(
        'input[name="ids"]:checked',
      ).length;
      setSelected(checked);
      const pageToggle = labelRef.current?.querySelector<HTMLInputElement>(
        'input[type="checkbox"]',
      );
      const total = form.querySelectorAll<HTMLInputElement>(
        'input[name="ids"]',
      ).length;
      if (pageToggle) {
        pageToggle.checked = total > 0 && checked === total;
        pageToggle.indeterminate = checked > 0 && checked < total;
      }
    };
    form.addEventListener("change", update);
    return () => form.removeEventListener("change", update);
  }, []);
  return (
    <label className="editorial-select-page" ref={labelRef}>
      <input
        onChange={(event) => {
          const form = event.currentTarget.closest("form");
          const checkboxes = Array.from(
            form?.querySelectorAll<HTMLInputElement>('input[name="ids"]') ?? [],
          );
          for (const checkbox of checkboxes) checkbox.checked = event.currentTarget.checked;
          setSelected(event.currentTarget.checked ? checkboxes.length : 0);
        }}
        type="checkbox"
      />
      <span>{label}</span>
      <strong aria-live="polite">{selected}</strong>
    </label>
  );
}

export function EditorialTransitionButton({
  id,
  locale,
  title,
  transition,
}: {
  id: string;
  locale: Locale;
  title: string;
  transition: "publish" | "unpublish" | "archive" | "restore";
}) {
  const labels = {
    publish: adminText(locale, "Terbitkan", "Publish"),
    unpublish: adminText(locale, "Batalkan terbit", "Unpublish"),
    archive: adminText(locale, "Arsipkan", "Archive"),
    restore: adminText(locale, "Pulihkan", "Restore"),
  };
  const confirmation = {
    publish: adminText(
      locale,
      `Terbitkan “${title}” ke situs publik?`,
      `Publish “${title}” to the public site?`,
    ),
    unpublish: adminText(
      locale,
      `Batalkan penerbitan “${title}”? Konten tidak lagi tampil di situs publik.`,
      `Unpublish “${title}”? It will no longer appear on the public site.`,
    ),
    archive: adminText(
      locale,
      `Arsipkan “${title}”? Konten terbit akan ditarik dari situs publik.`,
      `Archive “${title}”? Published content will be removed from the public site.`,
    ),
    restore: adminText(
      locale,
      `Pulihkan “${title}” sebagai draft?`,
      `Restore “${title}” as a draft?`,
    ),
  };
  return (
    <button
      formAction={editorialTransitionAction.bind(null, `${id}:${transition}`)}
      onClick={(event) => {
        if (!window.confirm(confirmation[transition])) event.preventDefault();
      }}
      type="submit"
    >
      {labels[transition]}
    </button>
  );
}

export function BulkConfirmButton({
  children,
  locale,
  transition,
}: {
  children: React.ReactNode;
  locale: Locale;
  transition: "archive" | "restore";
}) {
  return (
    <button
      name="transition"
      onClick={(event) => {
        const message =
          transition === "archive"
            ? adminText(
                locale,
                "Arsipkan seluruh record yang dipilih? Record terbit akan ditarik dari situs publik.",
                "Archive all selected records? Published records will be removed from the public site.",
              )
            : adminText(
                locale,
                "Pulihkan seluruh record yang dipilih sebagai draft?",
                "Restore all selected records as drafts?",
              );
        if (!window.confirm(message)) event.preventDefault();
      }}
      type="submit"
      value={transition}
    >
      {children}
    </button>
  );
}
