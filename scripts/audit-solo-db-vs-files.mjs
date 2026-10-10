#!/usr/bin/env node
/** Uporedi heuristiku na disk fajlovima sa category_id u bazi (preko storage_path basename). */
import fs from "node:fs";
import path from "node:path";
import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import pg from "pg";
import { classifyPoseImage } from "./classify-pose-image.mjs";

const base = process.env.POZE_SOURCE_DIR || "D:/COMPRESSs";
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

const c = new pg.Client({ connectionString: pgUrl, ssl: { rejectUnauthorized: false } });
await c.connect();
const cats = await c.query(
  `SELECT id, slug FROM wedding_pose_categories WHERE slug IN ('samo-mlada','samo-mladozenje')`
);
const slugById = Object.fromEntries(cats.rows.map((r) => [r.id, r.slug]));
await c.end();

const fileIndex = new Map();
for (const slug of ["samo-mlada", "samo-mladozenje"]) {
  const dir = path.join(base, slug);
  for (const f of fs.readdirSync(dir)) {
    if (!/\.(png|jpe?g|webp)$/i.test(f)) continue;
    fileIndex.set(f.replace(/\s/g, "_").toLowerCase(), { file: path.join(dir, f), folder: slug, f });
  }
}

const c2 = new pg.Client({ connectionString: pgUrl, ssl: { rejectUnauthorized: false } });
await c2.connect();
const poses = await c2.query(`
  SELECT id, storage_path, category_id FROM wedding_poses
  WHERE archived_at IS NULL AND category_id = ANY($1::uuid[])`,
  [cats.rows.map((r) => r.id)]
);
await c2.end();

const mismatches = [];
for (const p of poses.rows) {
  const baseName = path.basename(p.storage_path).replace(/^import\/\d+-[a-f0-9]+-/, "");
  const key = baseName.replace(/\s/g, "_").toLowerCase();
  const hit = fileIndex.get(key);
  if (!hit) continue;
  const dbSlug = slugById[p.category_id];
  const predicted = await classifyPoseImage(hit.file);
  if (predicted !== dbSlug && predicted !== "mladenci-zajedno") {
    mismatches.push({ f: hit.f, dbSlug, folder: hit.folder, predicted });
  } else if (predicted === "mladenci-zajedno") {
    mismatches.push({ f: hit.f, dbSlug, folder: hit.folder, predicted, note: "couple" });
  } else if (hit.folder !== dbSlug) {
    mismatches.push({ f: hit.f, dbSlug, folder: hit.folder, predicted, note: "folder≠db" });
  }
}

console.log("Provereno poza sa lokalnim fajlom:", poses.rows.length);
console.log("Neslaganja:", mismatches.length);
for (const m of mismatches) {
  console.log(`  [${m.dbSlug}] ${m.f} → heuristika: ${m.predicted}${m.note ? " (" + m.note + ")" : ""}`);
}
