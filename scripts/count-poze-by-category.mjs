import pg from "pg";
import { readFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const envPath = join(root, ".env.local");
const env = {};
for (const line of readFileSync(envPath, "utf8").split(/\r?\n/)) {
  const t = line.trim();
  if (!t || t.startsWith("#")) continue;
  const i = t.indexOf("=");
  if (i > 0) env[t.slice(0, i).trim()] = t.slice(i + 1).trim();
}
const ref = new URL(env.SUPABASE_URL).hostname.split(".")[0];
const url = `postgresql://postgres.${ref}:${encodeURIComponent(env.SUPABASE_DB_PASSWORD)}@aws-0-eu-west-1.pooler.supabase.com:6543/postgres`;
const c = new pg.Client({ connectionString: url, ssl: { rejectUnauthorized: false } });
await c.connect();
const r = await c.query(`
  SELECT cat.name, count(p.id)::int AS n
  FROM wedding_poses p
  JOIN wedding_pose_categories cat ON cat.id = p.category_id
  WHERE p.archived_at IS NULL
  GROUP BY cat.name, cat.sort_order
  ORDER BY cat.sort_order`);
console.table(r.rows);
const unc = await c.query(
  "SELECT count(p.id)::int AS n FROM wedding_poses p WHERE p.category_id IS NULL AND p.archived_at IS NULL"
);
console.log("Bez kategorije:", unc.rows[0].n);
await c.end();
