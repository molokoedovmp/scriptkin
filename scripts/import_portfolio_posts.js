/* eslint-disable no-console */
const fs = require("fs");
const path = require("path");
const { Client } = require("pg");

function loadEnv() {
  const envPath = path.join(process.cwd(), ".env");
  if (!fs.existsSync(envPath)) return;
  const content = fs.readFileSync(envPath, "utf8");
  for (const line of content.split(/\r?\n/)) {
    if (!line || line.startsWith("#")) continue;
    const match = line.match(/^([A-Za-z_][A-Za-z0-9_]*)=(.*)$/);
    if (!match) continue;
    const key = match[1];
    let value = match[2].trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (!(key in process.env)) process.env[key] = value;
  }
}

function parseTags(tags) {
  if (Array.isArray(tags)) return tags;
  if (typeof tags === "string") {
    try {
      const parsed = JSON.parse(tags);
      if (Array.isArray(parsed)) return parsed;
    } catch {
      return tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);
    }
  }
  return [];
}

function parseContent(content, slug) {
  if (content === null || content === undefined || content === "") return [];
  if (typeof content === "string") {
    try {
      return JSON.parse(content);
    } catch {
      console.warn(`Invalid JSON content for slug: ${slug}. Saved as empty array.`);
      try {
        const dir = path.join(process.cwd(), "scripts", "bad_content");
        fs.mkdirSync(dir, { recursive: true });
        fs.writeFileSync(path.join(dir, `${slug}.txt`), content);
      } catch {
        // ignore
      }
      return [];
    }
  }
  return content;
}

async function main() {
  loadEnv();
  const filePath =
    process.argv[2] ||
    "/Users/mikhailmolokoedov/Documents/scriptkin/portfolio_posts_rows.json";
  const raw = fs.readFileSync(filePath, "utf8");
  const rows = JSON.parse(raw);

  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL is not set");
  }

  const ssl =
    process.env.PGSSLMODE === "require" || connectionString.includes("sslmode=require")
      ? { rejectUnauthorized: false }
      : undefined;

  const client = new Client({ connectionString, ssl });
  await client.connect();

  const insertSql = `
    INSERT INTO portfolio_posts
      (id, created_at, updated_at, title, slug, excerpt, content, cover_url, tags, status, published_at)
    VALUES
      ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
    ON CONFLICT (id) DO UPDATE SET
      created_at = EXCLUDED.created_at,
      updated_at = EXCLUDED.updated_at,
      title = EXCLUDED.title,
      slug = EXCLUDED.slug,
      excerpt = EXCLUDED.excerpt,
      content = EXCLUDED.content,
      cover_url = EXCLUDED.cover_url,
      tags = EXCLUDED.tags,
      status = EXCLUDED.status,
      published_at = EXCLUDED.published_at;
  `;

  let inserted = 0;
  await client.query("BEGIN");
  try {
    for (const row of rows) {
      const contentValue = parseContent(row.content, row.slug);
      const values = [
        row.id,
        row.created_at,
        row.updated_at,
        row.title,
        row.slug,
        row.excerpt ?? null,
        contentValue ? JSON.stringify(contentValue) : null,
        row.cover_url ?? null,
        parseTags(row.tags),
        row.status ?? "published",
        row.published_at ?? null,
      ];
      await client.query(insertSql, values);
      inserted += 1;
    }
    await client.query("COMMIT");
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    await client.end();
  }

  console.log(`Imported ${inserted} rows into portfolio_posts`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
