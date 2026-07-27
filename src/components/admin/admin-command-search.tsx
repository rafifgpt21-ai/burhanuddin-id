"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import { getAdminQolCopy } from "@/data/admin-qol";
import type { AdminSearchResult } from "@/lib/content/admin-search";
import type { Locale } from "@/lib/i18n";

const kindLabels = {
  id: {
    homepage: "Beranda",
    publication: "Publikasi",
    agenda: "Agenda",
    post: "Tulisan",
    material: "Materi",
  },
  en: {
    homepage: "Homepage",
    publication: "Publications",
    agenda: "Agenda",
    post: "Writing",
    material: "Materials",
  },
} as const;

export function AdminCommandSearch({ locale }: { locale: Locale }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<AdminSearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [failed, setFailed] = useState(false);
  const [active, setActive] = useState(0);
  const copy = getAdminQolCopy(locale).search;

  const open = () => {
    dialogRef.current?.showModal();
    requestAnimationFrame(() => inputRef.current?.focus());
  };

  useEffect(() => {
    const handleShortcut = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        open();
      }
    };
    window.addEventListener("keydown", handleShortcut);
    return () => window.removeEventListener("keydown", handleShortcut);
  }, []);

  useEffect(() => {
    if (query.trim().length < 2) return;
    const controller = new AbortController();
    const timer = setTimeout(async () => {
      setLoading(true);
      setFailed(false);
      try {
        const response = await fetch(
          `/api/admin/search?locale=${locale}&q=${encodeURIComponent(query)}`,
          { cache: "no-store", signal: controller.signal },
        );
        if (!response.ok) throw new Error("SEARCH_FAILED");
        const payload = (await response.json()) as { results: AdminSearchResult[] };
        setResults(payload.results);
        setActive(0);
      } catch (error) {
        if ((error as Error).name !== "AbortError") setFailed(true);
      } finally {
        setLoading(false);
      }
    }, 250);
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [locale, query]);

  return (
    <>
      <button className="admin-command-trigger" onClick={open} type="button">
        <span>{copy.button}</span>
        <kbd>Ctrl K</kbd>
      </button>
      <dialog
        aria-labelledby="admin-search-title"
        className="admin-command-dialog"
        ref={dialogRef}
        onClose={() => {
          setQuery("");
          setResults([]);
        }}
      >
        <div className="admin-command-heading">
          <h2 id="admin-search-title">{copy.dialogTitle}</h2>
          <button
            aria-label={copy.close}
            onClick={() => dialogRef.current?.close()}
            type="button"
          >
            ×
          </button>
        </div>
        <input
          aria-activedescendant={results[active] ? `admin-result-${active}` : undefined}
          aria-controls="admin-search-results"
          aria-expanded={results.length > 0}
          autoComplete="off"
          onChange={(event) => {
            const next = event.target.value;
            setQuery(next);
            if (next.trim().length < 2) {
              setResults([]);
              setLoading(false);
              setFailed(false);
            }
          }}
          onKeyDown={(event) => {
            if (event.key === "ArrowDown") {
              event.preventDefault();
              setActive((value) => Math.min(value + 1, results.length - 1));
            }
            if (event.key === "ArrowUp") {
              event.preventDefault();
              setActive((value) => Math.max(value - 1, 0));
            }
            if (event.key === "Enter" && results[active]) {
              event.preventDefault();
              document.getElementById(`admin-result-${active}`)?.click();
            }
          }}
          placeholder={copy.placeholder}
          ref={inputRef}
          role="combobox"
          type="search"
          value={query}
        />
        <p className="admin-command-hint">{copy.hint}</p>
        <div aria-live="polite" id="admin-search-results">
          {loading ? <p className="admin-command-state">{copy.loading}</p> : null}
          {failed ? <p className="admin-command-state is-error">{copy.error}</p> : null}
          {!loading && !failed && query.trim().length >= 2 && !results.length ? (
            <p className="admin-command-state">{copy.empty}</p>
          ) : null}
          {results.length ? (
            <div className="admin-command-results">
              {results.map((result, index) => (
                <Link
                  aria-selected={active === index}
                  href={result.href}
                  id={`admin-result-${index}`}
                  key={`${result.kind}-${result.id}`}
                  onClick={() => dialogRef.current?.close()}
                  role="option"
                >
                  <span>{kindLabels[locale][result.kind]}</span>
                  <strong>{result.label}</strong>
                  <small>{result.meta}</small>
                </Link>
              ))}
            </div>
          ) : null}
        </div>
      </dialog>
    </>
  );
}
