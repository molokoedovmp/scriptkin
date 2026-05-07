/* eslint-disable no-console */
/**
 * Imports all JSON files from scripts/backup/ into PostgreSQL
 * Run this on the NEW server after setting DATABASE_URL in .env
 * Usage: node scripts/import_all.js
 */

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

async function importTable(client, table, rows) {
  if (rows.length === 0) {
    console.log(`  ${table}: 0 rows, skipping`);
    return 0;
  }

  const columns = Object.keys(rows[0]);
  const quotedCols = columns.map((c) => `"${c}"`).join(", ");
  const conflictCols = columns
    .filter((c) => c !== "id")
    .map((c) => `"${c}" = EXCLUDED."${c}"`)
    .join(", ");

  let inserted = 0;
  await client.query("BEGIN");
  try {
    for (const row of rows) {
      const placeholders = columns.map((_, i) => `$${i + 1}`).join(", ");
      const values = columns.map((col) => {
        const val = row[col];
        if (val === null || val === undefined) return null;
        // TEXT[] arrays — pass as JS array, pg driver handles conversion
        if (Array.isArray(val) && (col === "tags" || col === "categories")) return val;
        // JSONB objects/arrays — serialize to string
        if (typeof val === "object") return JSON.stringify(val);
        return val;
      });

      const sql = `
        INSERT INTO "${table}" (${quotedCols})
        VALUES (${placeholders})
        ON CONFLICT (id) DO UPDATE SET ${conflictCols};
      `;
      await client.query(sql, values);
      inserted++;
    }
    await client.query("COMMIT");
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  }

  return inserted;
}

async function main() {
  loadEnv();

  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) throw new Error("DATABASE_URL is not set in .env");

  const ssl =
    process.env.PGSSLMODE === "require" || connectionString.includes("sslmode=require")
      ? { rejectUnauthorized: false }
      : undefined;

  const client = new Client({ connectionString, ssl });
  await client.connect();
  console.log("Connected to new database");

  const backupDir = path.join(process.cwd(), "scripts", "backup");
  if (!fs.existsSync(backupDir)) {
    throw new Error("scripts/backup/ directory not found. Run export_all.js first.");
  }

  const files = fs
    .readdirSync(backupDir)
    .filter((f) => f.endsWith(".json") && !f.startsWith("_"));

  console.log(`Found ${files.length} table files to import`);

  const results = {};
  for (const file of files) {
    const table = file.replace(".json", "");
    console.log(`Importing ${table}...`);
    try {
      const raw = fs.readFileSync(path.join(backupDir, file), "utf8");
      const rows = JSON.parse(raw);
      const count = await importTable(client, table, rows);
      results[table] = count;
      console.log(`  → ${count} rows imported`);
    } catch (err) {
      console.error(`  ERROR importing ${table}: ${err.message}`);
      results[table] = `ERROR: ${err.message}`;
    }
  }

  await client.end();
  console.log("\nImport complete!");
  console.table(results);
}

main().catch((err) => {
  console.error("Import failed:", err.message);
  process.exit(1);
});
