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

export async function GET(req: Request) {
  if (!isAuthorized(req)) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const supabase = await getSupabaseServerClient();
  const { data, error } = await supabase
    .from("contacts")
    .select("id, name, email, message, created_at")
    .order("created_at", { ascending: false })
    .limit(200);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ contacts: data ?? [] });
}

export async function POST(req: Request) {
  const body = await req.json();
  const supabase = await getSupabaseServerClient();
  const payload = {
    name: body.name?.toString().slice(0, 200) ?? "",
    email: body.email?.toString().slice(0, 200) ?? "",
    message: body.message?.toString().slice(0, 4000) ?? "",
  };
  const { error } = await supabase.from("contacts").insert([payload]);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
