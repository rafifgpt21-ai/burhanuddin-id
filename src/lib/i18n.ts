export const locales = ["id", "en"] as const;

export type Locale = (typeof locales)[number];
export type RouteKey =
  | "home"
  | "materials"
  | "posts"
  | "agenda"
  | "publications"
  | "about"
  | "admin";

export const localeCookieName = "bm_locale";

const routeSegments: Record<RouteKey, Record<Locale, string>> = {
  home: { id: "", en: "" },
  materials: { id: "materi", en: "materials" },
  posts: { id: "tulisan", en: "writing" },
  agenda: { id: "agenda", en: "agenda" },
  publications: { id: "publikasi", en: "publications" },
  about: { id: "tentang", en: "about" },
  admin: { id: "admin/login", en: "admin/login" },
};

export function hasLocale(value: string | undefined | null): value is Locale {
  return value === "id" || value === "en";
}

export function getRoutePath(locale: Locale, route: RouteKey): string {
  const segment = routeSegments[route][locale];
  return segment ? `/${locale}/${segment}` : `/${locale}`;
}

function routeKeyFromSegment(segment: string): RouteKey | undefined {
  return (Object.keys(routeSegments) as RouteKey[]).find((route) =>
    locales.some((locale) => routeSegments[route][locale].split("/")[0] === segment),
  );
}

export function switchLocalePath(pathname: string, targetLocale: Locale): string {
  const segments = pathname.split("/").filter(Boolean);

  if (hasLocale(segments[0])) {
    segments.shift();
  }

  const route = segments[0] ? routeKeyFromSegment(segments[0]) : "home";
  if (!route) {
    return `/${targetLocale}/${segments.join("/")}`.replace(/\/$/, "");
  }

  const sourceSegmentLength = routeSegments[route].id.split("/").filter(Boolean).length;
  const remainder = segments.slice(sourceSegmentLength).join("/");
  const base = getRoutePath(targetLocale, route);

  return remainder ? `${base}/${remainder}` : base;
}

export function localizeLegacyPath(pathname: string, locale: Locale): string {
  return switchLocalePath(pathname, locale);
}

export function detectLocale({
  manualPreference,
  country,
  acceptLanguage,
}: {
  manualPreference?: string | null;
  country?: string | null;
  acceptLanguage?: string | null;
}): Locale {
  if (hasLocale(manualPreference)) {
    return manualPreference;
  }

  const normalizedCountry = country?.trim().toUpperCase();
  if (normalizedCountry && normalizedCountry !== "XX") {
    return normalizedCountry === "ID" ? "id" : "en";
  }

  const preferredBrowserLanguage = acceptLanguage
    ?.split(",")
    .map((entry) => entry.trim().split(";")[0]?.toLowerCase())
    .find(Boolean);

  if (preferredBrowserLanguage) {
    return preferredBrowserLanguage === "id" || preferredBrowserLanguage.startsWith("id-")
      ? "id"
      : "en";
  }

  return "id";
}

export function sectionMatchesLocale(section: string, locale: Locale): RouteKey | undefined {
  return (Object.keys(routeSegments) as RouteKey[]).find(
    (route) => routeSegments[route][locale] === section,
  );
}
