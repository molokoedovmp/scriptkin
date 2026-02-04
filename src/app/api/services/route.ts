import { NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/utils/supabase/server";

export const runtime = "edge";

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
    .from("services")
    .select("title, slug, description, price_from, tags, published_at")
    .eq("status", "published")
    .order("published_at", { ascending: false })
    .limit(50);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ services: data ?? [] });
}

export async function POST(req: Request) {
  if (!isAuthorized(req)) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const body = await req.json();
  const supabase = await getSupabaseServerClient();

  const payload = {
    title: body.title ?? "",
    slug: body.slug ?? "",
    description: body.description ?? null,
    content: body.content ?? null,
    price_from: body.price_from ?? null,
    tags: Array.isArray(body.tags)
      ? body.tags
      : typeof body.tags === "string"
        ? body.tags.split(",").map((t: string) => t.trim()).filter(Boolean)
        : [],
    status: body.status ?? "published",
    published_at: body.published_at ?? new Date().toISOString(),
  };

  const { error, data } = await supabase.from("services").insert([payload]).select("slug").single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true, slug: data?.slug });
}
