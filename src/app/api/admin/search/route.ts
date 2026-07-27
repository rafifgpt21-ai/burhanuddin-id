import { NextResponse } from "next/server";

import { readAdminSession } from "@/lib/auth/session";
import { searchAdminContent } from "@/lib/content/admin-search";
import { hasLocale } from "@/lib/i18n";

export async function GET(request: Request) {
  const session = await readAdminSession();
  if (!session) return NextResponse.json({ results: [] }, { status: 401 });
  const url = new URL(request.url);
  const localeValue = url.searchParams.get("locale");
  const locale = hasLocale(localeValue) ? localeValue : "id";
  const query = url.searchParams.get("q") ?? "";
  const results = await searchAdminContent(query, locale);
  return NextResponse.json(
    { results },
    { headers: { "Cache-Control": "private, no-store" } },
  );
}
