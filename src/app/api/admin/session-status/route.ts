import { readAdminSession } from "@/lib/auth/session";

export const dynamic = "force-dynamic";

export async function GET() {
  const authenticated = await readAdminSession()
    .then(Boolean)
    .catch(() => false);

  return Response.json(
    { authenticated },
    {
      headers: {
        "Cache-Control": "private, no-store",
      },
    },
  );
}
