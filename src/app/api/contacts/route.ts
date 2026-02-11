import { NextResponse } from "next/server";
import { query } from "@/utils/db";
export const revalidate = 0;

function isAuthorized(req: Request) {
  const token =
    req.headers.get("x-admin-token") ||
    req.headers.get("authorization")?.replace("Bearer ", "");
  return token && process.env.ADMIN_PASSWORD && token === process.env.ADMIN_PASSWORD;
}

export async function GET(req: Request) {
  if (!isAuthorized(req)) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  try {
    const { rows } = await query(
      "SELECT id, name, email, message, created_at FROM contacts ORDER BY created_at DESC LIMIT 200"
    );
    return NextResponse.json({ contacts: rows ?? [] });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || "db error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const body = await req.json();
  const payload = {
    name: body.name?.toString().slice(0, 200) ?? "",
    email: body.email?.toString().slice(0, 200) ?? "",
    message: body.message?.toString().slice(0, 4000) ?? "",
  };
  try {
    await query("INSERT INTO contacts (name, email, message) VALUES ($1, $2, $3)", [
      payload.name,
      payload.email,
      payload.message,
    ]);
    return NextResponse.json({ ok: true });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || "db error" }, { status: 500 });
  }
}
