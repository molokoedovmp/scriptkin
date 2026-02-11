import { NextResponse } from "next/server";
import { parseTags, query } from "@/utils/db";
export const revalidate = 0;

function isAuthorized(req: Request) {
  const token =
    req.headers.get("x-admin-token") ||
    req.headers.get("authorization")?.replace("Bearer ", "");
  return token && process.env.ADMIN_PASSWORD && token === process.env.ADMIN_PASSWORD;
}

export async function GET() {
  try {
    const { rows } = await query(
      "SELECT title, slug, description, price_from, tags, published_at FROM services WHERE status = $1 ORDER BY published_at DESC LIMIT 50",
      ["published"]
    );
    return NextResponse.json({ services: rows ?? [] });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || "db error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  if (!isAuthorized(req)) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const body = await req.json();
  const tags = parseTags(body.tags);
  const publishedAt = body.published_at ?? new Date().toISOString();
  const contentValue =
    body.content === null || body.content === undefined
      ? null
      : typeof body.content === "string"
        ? body.content
        : JSON.stringify(body.content);

  try {
    const { rows } = await query<{ slug: string }>(
      `INSERT INTO services (title, slug, description, content, price_from, tags, status, published_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING slug`,
      [
        body.title ?? "",
        body.slug ?? "",
        body.description ?? null,
        contentValue,
        body.price_from ?? null,
        tags,
        body.status ?? "published",
        publishedAt,
      ]
    );
    return NextResponse.json({ ok: true, slug: rows[0]?.slug });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || "db error" }, { status: 500 });
  }
}
