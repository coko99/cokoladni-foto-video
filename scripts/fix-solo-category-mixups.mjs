#!/usr/bin/env node
/**
 * Ispravi poznate mešavine solo kategorija (heuristika + couple detection).
 * Premesti fajlove i ažuriraj wedding_poses.category_id po storage_path.
 *
 *   node scripts/fix-solo-category-mixups.mjs          # dry-run
 *   node scripts/fix-solo-category-mixups.mjs --apply
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

/** Ručno potvrđene greške (vizuelna provera). */
const MANUAL = [
  {
    f: "ChatGPT Image Oct 10, 2026, 12_10_07 AM-2.png",
    from: "samo-mlada",
    to: "samo-mladozenje",
    reason: "mladoženje u folderu mlada",
  },
  {
    f: "ChatGPT Image Oct 9, 2026, 11_52_41 PM-2.png",
    from: "samo-mladozenje",
    to: "mladenci-zajedno",
    reason: "par u folderu mladoženje",
  },
  {
    f: "ChatGPT Image Oct 9, 2026, 11_52_57 PM-9.png",
    from: "samo-mladozenje",
    to: "mladenci-zajedno",
    reason: "par",
  },
  {
    f: "ChatGPT Image Oct 9, 2026, 11_53_16 PM-1.png",
    from: "samo-mladozenje",
    to: "mladenci-zajedno",
    reason: "par",
  },
  {
    f: "ChatGPT Image Oct 9, 2026, 11_53_18 PM-3.png",
    from: "samo-mladozenje",
    to: "mladenci-zajedno",
    reason: "par",
  },
  {
    f: "ChatGPT Image Oct 9, 2026, 11_53_21 PM-5.png",
    from: "samo-mladozenje",
    to: "mladenci-zajedno",
    reason: "par",
  },
];

const moves = [];

for (const item of MANUAL) {
  const file = path.join(base, item.from, item.f);
  if (!fs.existsSync(file)) continue;
  moves.push({
    file,
    f: item.f,
    fromSlug: item.from,
    toSlug: item.to,
    predicted: item.reason,
  });
}

async function scanCrossSolo() {
  for (const [fromSlug, toSlug] of [
    ["samo-mlada", "samo-mladozenje"],
    ["samo-mladozenje", "samo-mlada"],
  ]) {
    const dir = path.join(base, fromSlug);
    if (!fs.existsSync(dir)) continue;
    for (const f of fs.readdirSync(dir)) {
      if (!exts.test(f)) continue;
      if (MANUAL.some((m) => m.f === f)) continue;
      const file = path.join(dir, f);
      const predicted = await classifyPoseImage(file);
      if (predicted === toSlug) {
        moves.push({ file, f, fromSlug, toSlug, predicted: "heuristika" });
      }
    }
  }
}

await scanCrossSolo();

console.log("Predložene izmene:", moves.length);
for (const m of moves) {
  console.log(`  ${m.fromSlug} → ${m.toSlug}: ${m.f} (${m.predicted})`);
}

if (!apply || !moves.length) {
  if (moves.length && !apply) console.log("\nPokreni sa --apply da primeniš.");
  process.exit(0);
}

const pgClient = new pg.Client({ connectionString: pgUrl, ssl: { rejectUnauthorized: false } });
await pgClient.connect();
const catRes = await pgClient.query(
  `SELECT id, slug FROM wedding_pose_categories WHERE slug IN ('samo-mlada','samo-mladozenje','mladenci-zajedno')`
);
const catId = Object.fromEntries(catRes.rows.map((r) => [r.slug, r.id]));

for (const m of moves) {
  const destDir = path.join(base, m.toSlug);
  fs.mkdirSync(destDir, { recursive: true });
  let dest = path.join(destDir, m.f);
  if (fs.existsSync(dest)) {
    const p = path.parse(m.f);
    dest = path.join(destDir, `${p.name}-fixed${p.ext}`);
  }
  fs.renameSync(m.file, dest);
  const baseName = path.basename(dest);
  const safe = path.basename(m.f).replace(/[^a-zA-Z0-9._-]/g, "_");
  const upd = await pgClient.query(
    `UPDATE wedding_poses SET category_id = $1, updated_at = now()
     WHERE archived_at IS NULL AND storage_path ILIKE $2`,
    [catId[m.toSlug], `%${safe}%`]
  );
  console.log("OK", baseName, "db rows:", upd.rowCount);
}

await pgClient.end();
console.log("Gotovo.");
