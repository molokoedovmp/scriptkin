import { Pool } from "pg";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is not set");
}

const globalForPg = globalThis as unknown as { pgPool?: Pool };

let ssl: { rejectUnauthorized: boolean } | undefined;
try {
  const url = new URL(connectionString);
  if (url.searchParams.get("sslmode") === "require") {
    ssl = { rejectUnauthorized: false };
  }
} catch {
  // ignore invalid URL parsing, pg can still handle the connection string
}

const pool =
  globalForPg.pgPool ??
  new Pool({
    connectionString,
    ssl,
  });

if (process.env.NODE_ENV !== "production") {
  globalForPg.pgPool = pool;
}

export async function query<T = unknown>(text: string, params?: unknown[]) {
  return pool.query<T>(text, params);
}

export function parseTags(input: unknown): string[] {
  if (Array.isArray(input)) {
    return input.map((t) => t?.toString().trim()).filter(Boolean) as string[];
  }
  if (typeof input === "string") {
    return input
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
  }
  return [];
}

export function buildUpdate(
  updates: Record<string, unknown>,
  allowed: string[]
): { set: string; values: unknown[] } | null {
  const entries = allowed
    .map((key) => [key, updates[key]] as const)
    .filter(([, value]) => value !== undefined);

  if (entries.length === 0) return null;

  const set = entries.map(([key], i) => `"${key}" = $${i + 1}`).join(", ");
  const values = entries.map(([, value]) => value);
  return { set, values };
}
