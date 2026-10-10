#!/usr/bin/env node
/**
 * Pronađi solo slike koje heuristika vidi kao pogrešnu kategoriju (mlada ↔ mladoženje),
 * premesti fajl u drugi folder i ažuriraj category_id u bazi (match po storage_path basename hint).
 *
 * Dry-run: node scripts/fix-swapped-solo-categories.mjs
 * Apply:   node scripts/fix-swapped-solo-categories.mjs --apply
 */
import fs from "node:fs";
import path from "node:path";
import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import pg from "pg";
import { classifyPoseImage } from "./classify-pose-image.mjs";

const apply = process.argv.includes("--apply");
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

const swaps = [];

async function scanFolder(folderSlug, expected) {
  const other = expected === "samo-mlada" ? "samo-mladozenje" : "samo-mlada";
  const dir = path.join(base, folderSlug);
  for (const f of fs.readdirSync(dir)) {
    if (!exts.test(f)) continue;
    const file = path.join(dir, f);
    const predicted = await classifyPoseImage(file);
    if (predicted === other) {
      swaps.push({ file, f, from: folderSlug, to: other, predicted });
    }
  }
}

await scanFolder("samo-mlada", "samo-mlada");
await scanFolder("samo-mladozenje", "samo-mladozenje");

console.log("Heuristika predlaže zamenu:", swaps.length);
for (const s of swaps) {
  console.log(`  ${s.from} → ${s.to}: ${s.f}`);
}

if (!apply || !swaps.length) {
  if (!swaps.length) console.log("\nNema zamena prema heuristici.");
  else console.log("\nDry-run. Pokreni sa --apply da premestiš fajlove i ažuriraš bazu.");
  process.exit(0);
}

const pgClient = new pg.Client({ connectionString: pgUrl, ssl: { rejectUnauthorized: false } });
await pgClient.connect();
const catRes = await pgClient.query(
  `SELECT id, slug FROM wedding_pose_categories WHERE slug IN ('samo-mlada','samo-mladozenje')`
);
const catId = Object.fromEntries(catRes.rows.map((r) => [r.slug, r.id]));

for (const s of swaps) {
  const destDir = path.join(base, s.to);
  let dest = path.join(destDir, s.f);
  if (fs.existsSync(dest)) {
    const parsed = path.parse(s.f);
    dest = path.join(destDir, `${parsed.name}-moved${parsed.ext}`);
  }
  fs.renameSync(s.file, dest);
  const baseName = path.basename(dest);
  const upd = await pgClient.query(
    `UPDATE wedding_poses SET category_id = $1, updated_at = now()
     WHERE archived_at IS NULL AND storage_path LIKE $2`,
    [catId[s.to], `%${baseName.replace(/[%_\\]/g, "")}%`]
  );
  console.log("Premesteno", baseName, "rows updated:", upd.rowCount);
}

await pgClient.end();
console.log("Gotovo.");
