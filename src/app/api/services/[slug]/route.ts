import { NextResponse } from "next/server";
import { buildUpdate, parseTags, query } from "@/utils/db";
export const revalidate = 0;

function isAuthorized(req: Request) {
  const token =
    req.headers.get("x-admin-token") ||
    req.headers.get("authorization")?.replace("Bearer ", "");
  return token && process.env.ADMIN_PASSWORD && token === process.env.ADMIN_PASSWORD;
}

export async function GET(req: Request, ctx: { params: Promise<{ slug: string }> }) {
  const { slug } = await ctx.params;
  const admin = isAuthorized(req);
  try {
    const { rows } = await query(
      `SELECT title, slug, description, content, price_from, tags, published_at, status
       FROM services
       WHERE slug = $1 ${admin ? "" : "AND status = 'published'"}
       LIMIT 1`,
      [slug]
    );
    const service = rows[0];
    if (!service) return NextResponse.json({ error: "not found" }, { status: 404 });
    return NextResponse.json({ service });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || "not found" }, { status: 404 });
  }
}

export async function PATCH(req: Request, ctx: { params: Promise<{ slug: string }> }) {
  if (!isAuthorized(req)) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const { slug } = await ctx.params;
  const body = await req.json();
  const updates: Record<string, unknown> = { ...body };
  if (Object.prototype.hasOwnProperty.call(body, "tags")) {
    updates.tags = parseTags(body.tags);
  }
  if (Object.prototype.hasOwnProperty.call(body, "content")) {
    updates.content =
      body.content === null || body.content === undefined
        ? null
        : typeof body.content === "string"
          ? body.content
          : JSON.stringify(body.content);
  }
  const built = buildUpdate(updates, [
    "title",
    "slug",
    "description",
    "content",
    "price_from",
    "tags",
    "status",
    "published_at",
  ]);
  if (!built) return NextResponse.json({ ok: true });
  try {
    await query(`UPDATE services SET ${built.set} WHERE slug = $${built.values.length + 1}`, [
      ...built.values,
      slug,
    ]);
    return NextResponse.json({ ok: true });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || "db error" }, { status: 500 });
  }
}

export async function DELETE(req: Request, ctx: { params: Promise<{ slug: string }> }) {
  if (!isAuthorized(req)) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const { slug } = await ctx.params;
  try {
    await query("DELETE FROM services WHERE slug = $1", [slug]);
    return NextResponse.json({ ok: true });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || "db error" }, { status: 500 });
  }
}
