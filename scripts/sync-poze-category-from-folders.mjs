#!/usr/bin/env node
/** Ažuriraj category_id u bazi prema folderu na disku (samo poznati fajlovi). */
import fs from "node:fs";
import path from "node:path";
import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import pg from "pg";

const base = process.env.POZE_SOURCE_DIR || "D:/COMPRESSs";
const exts = /\.(png|jpe?g|webp)$/i;
const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const env = {};
for (const line of readFileSync(join(root, ".env.local"), "utf8").split(/\r?\n/)) {
  const t = line.trim();
  if (!t || t.startsWith("#")) continue;
  const i = t.indexOf("=");
  if (i > 0) env[t.slice(0, i).trim()] = t.slice(i + 1).trim();
}
const ref = new URL(env.SUPABASE_URL).hostname.split(".")[0];
const pgUrl = `postgresql://postgres.${ref}:${encodeURIComponent(env.SUPABASE_DB_PASSWORD)}@aws-0-eu-west-1.pooler.supabase.com:6543/postgres`;

const pgClient = new pg.Client({ connectionString: pgUrl, ssl: { rejectUnauthorized: false } });
await pgClient.connect();
const cats = await pgClient.query(
  `SELECT id, slug FROM wedding_pose_categories WHERE slug IN ('samo-mlada','samo-mladozenje','mladenci-zajedno')`
);
const catId = Object.fromEntries(cats.rows.map((r) => [r.slug, r.id]));

let total = 0;
for (const slug of ["samo-mlada", "samo-mladozenje", "mladenci-zajedno"]) {
  const dir = path.join(base, slug);
  if (!fs.existsSync(dir)) continue;
  for (const f of fs.readdirSync(dir)) {
    if (!exts.test(f)) continue;
    const safe = f.replace(/[^a-zA-Z0-9._-]/g, "_");
    const res = await pgClient.query(
      `UPDATE wedding_poses SET category_id = $1, updated_at = now()
       WHERE archived_at IS NULL AND storage_path ILIKE $2`,
      [catId[slug], `%${safe}%`]
    );
    if (res.rowCount) {
      total += res.rowCount;
      console.log(slug, f, "→", res.rowCount);
    }
  }
}
await pgClient.end();
console.log("Ukupno ažurirano redova:", total);
