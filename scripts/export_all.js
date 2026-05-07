/* eslint-disable no-console */
/**
 * Exports ALL tables from PostgreSQL to JSON files in scripts/backup/
 * Usage: node scripts/export_all.js
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
  console.log("Connected to database");

  const backupDir = path.join(process.cwd(), "scripts", "backup");
  fs.mkdirSync(backupDir, { recursive: true });

  // Get all user tables
  const tablesResult = await client.query(`
    SELECT table_name
    FROM information_schema.tables
    WHERE table_schema = 'public'
      AND table_type = 'BASE TABLE'
    ORDER BY table_name;
  `);

  const tables = tablesResult.rows.map((r) => r.table_name);
  console.log(`Found ${tables.length} tables: ${tables.join(", ")}`);

  const summary = { exported_at: new Date().toISOString(), tables: {} };

  for (const table of tables) {
    console.log(`Exporting ${table}...`);
    const result = await client.query(`SELECT * FROM "${table}"`);
    const filePath = path.join(backupDir, `${table}.json`);
    fs.writeFileSync(filePath, JSON.stringify(result.rows, null, 2));
    summary.tables[table] = result.rows.length;
    console.log(`  → ${result.rows.length} rows saved to scripts/backup/${table}.json`);
  }

  // Save summary
  fs.writeFileSync(
    path.join(backupDir, "_summary.json"),
    JSON.stringify(summary, null, 2)
  );

  await client.end();
  console.log("\nDone! All files saved to scripts/backup/");
  console.log("Summary:", summary.tables);
}

main().catch((err) => {
  console.error("Export failed:", err.message);
  process.exit(1);
});
