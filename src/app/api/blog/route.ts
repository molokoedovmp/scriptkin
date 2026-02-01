import { NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/utils/supabase/server";

export const revalidate = 0;

function isAuthorized(req: Request) {
  const token =
    req.headers.get("x-admin-token") ||
    req.headers.get("authorization")?.replace("Bearer ", "");
  return token && process.env.ADMIN_PASSWORD && token === process.env.ADMIN_PASSWORD;
}

export async function GET() {
  const supabase = await getSupabaseServerClient();
  const { data, error } = await supabase
    .from("blog_posts")
    .select("title, slug, excerpt, cover_url, published_at, tags")
    .eq("status", "published")
    .order("published_at", { ascending: false })
    .limit(50);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ posts: data ?? [] });
}

export async function POST(req: Request) {
  if (!isAuthorized(req)) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const body = await req.json();
  const supabase = await getSupabaseServerClient();

  const payload = {
    title: body.title ?? "",
    slug: body.slug ?? "",
    excerpt: body.excerpt ?? null,
    cover_url: body.cover_url ?? null,
    tags: Array.isArray(body.tags)
      ? body.tags
      : typeof body.tags === "string"
        ? body.tags.split(",").map((t: string) => t.trim()).filter(Boolean)
        : [],
    content: body.content ?? null,
    status: body.status ?? "published",
    published_at: body.published_at ?? new Date().toISOString(),
  };

  const { error, data } = await supabase.from("blog_posts").insert([payload]).select("slug").single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true, slug: data?.slug });
}
