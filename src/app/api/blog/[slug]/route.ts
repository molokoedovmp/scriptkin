import { NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/utils/supabase/server";

export const revalidate = 0;

function isAuthorized(req: Request) {
  const token =
    req.headers.get("x-admin-token") ||
    req.headers.get("authorization")?.replace("Bearer ", "");
  return token && process.env.ADMIN_PASSWORD && token === process.env.ADMIN_PASSWORD;
}

export async function GET(req: Request, ctx: { params: Promise<{ slug: string }> }) {
  const { slug } = await ctx.params;
  const supabase = await getSupabaseServerClient();
  let query = supabase
    .from("blog_posts")
    .select("title, slug, excerpt, cover_url, published_at, tags, content, status")
    .eq("slug", slug)
    .limit(1)
    .single();

  let { data, error } = await query;

  const admin = isAuthorized(req);
  if (error && admin) {
    // повтор без фильтра статуса, если админ
    const res = await supabase
      .from("blog_posts")
      .select("title, slug, excerpt, cover_url, published_at, tags, content, status")
      .eq("slug", slug)
      .limit(1)
      .single();
    data = res.data;
    error = res.error;
  }

  if (!admin && data && data.status !== "published") {
    return NextResponse.json({ error: "not published" }, { status: 404 });
  }

  if (error || !data) return NextResponse.json({ error: error?.message || "not found" }, { status: 404 });
  return NextResponse.json({ post: data });
}

export async function PATCH(req: Request, ctx: { params: Promise<{ slug: string }> }) {
  if (!isAuthorized(req)) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const { slug } = await ctx.params;
  const body = await req.json();
  const supabase = await getSupabaseServerClient();
  const updates = { ...body, updated_at: new Date().toISOString() };
  const { error } = await supabase.from("blog_posts").update(updates).eq("slug", slug);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: Request, ctx: { params: Promise<{ slug: string }> }) {
  if (!isAuthorized(req)) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const { slug } = await ctx.params;
  const supabase = await getSupabaseServerClient();
  const { error } = await supabase.from("blog_posts").delete().eq("slug", slug);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
