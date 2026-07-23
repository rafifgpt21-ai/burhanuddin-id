import { NextResponse, type NextRequest } from "next/server";

import {
  detectLocale,
  hasLocale,
  localeCookieName,
  localizeLegacyPath,
} from "@/lib/i18n";

const oneYear = 60 * 60 * 24 * 365;

export function proxy(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;
  const pathLocale = pathname.split("/")[1];

  if (hasLocale(pathLocale)) {
    const requestedPreference = searchParams.get("setLocale");

    if (requestedPreference === pathLocale) {
      const cleanUrl = request.nextUrl.clone();
      cleanUrl.searchParams.delete("setLocale");
      const response = NextResponse.redirect(cleanUrl);
      response.cookies.set(localeCookieName, pathLocale, {
        httpOnly: true,
        maxAge: oneYear,
        path: "/",
        sameSite: "lax",
        secure: request.nextUrl.protocol === "https:",
      });
      return response;
    }

    return NextResponse.next();
  }

  const country =
    request.headers.get("x-vercel-ip-country") ??
    request.headers.get("cf-ipcountry") ??
    request.headers.get("cloudfront-viewer-country");
  const locale = detectLocale({
    manualPreference: request.cookies.get(localeCookieName)?.value,
    country,
    acceptLanguage: request.headers.get("accept-language"),
  });
  const destination = request.nextUrl.clone();
  destination.pathname = localizeLegacyPath(pathname, locale);

  return NextResponse.redirect(destination);
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\..*).*)"],
};
