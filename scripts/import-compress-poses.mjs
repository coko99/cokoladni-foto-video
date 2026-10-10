#!/usr/bin/env node
/**
 * 1) Ukloni duplikate iz D:\COMPRESSs → _duplicates
 * 2) Tri kategorije u bazi
 * 3) Upload u Supabase (kategorija iz podfoldera ako postoje)
 *
 * Raspored u foldere (opciono, pre pokretanja):
 *   D:\COMPRESSs\samo-mlada
 *   D:\COMPRESSs\samo-mladozenje
 *   D:\COMPRESSs\mladenci-zajedno
 */
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import dns from "node:dns";
import { readFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import pg from "pg";
import { createClient } from "@supabase/supabase-js";

dns.setDefaultResultOrder("ipv6first");

const SOURCE = process.env.POZE_SOURCE_DIR || "D:/COMPRESSs";
const BUCKET = "wedding-poses";
const EXTS = new Set([".png", ".jpg", ".jpeg", ".webp"]);

const CATEGORIES = [
  ["mladenci-zajedno", "Mladenci zajedno", 1],
  ["samo-mlada", "Samo mlada", 2],
  ["samo-mladozenje", "Samo mladoženje", 3],
];

const FOLDER_TO_SLUG = {
  "mladenci-zajedno": "mladenci-zajedno",
  "samo-mlada": "samo-mlada",
  "samo-mladozenje": "samo-mladozenje",
  "zajedno": "mladenci-zajedno",
  mlada: "samo-mlada",
  mladozenje: "samo-mladozenje",
};

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const envPath = join(root, ".env.local");

function loadEnv() {
  const env = {};
  if (!existsSync(envPath)) return env;
  for (const line of readFileSync(envPath, "utf8").split(/\r?\n/)) {
    const t = line.trim();
    if (!t || t.startsWith("#")) continue;
    const i = t.indexOf("=");
    if (i > 0) env[t.slice(0, i).trim()] = t.slice(i + 1).trim();
  }
  return env;
}

function buildPgConn(env) {
  if (env.SUPABASE_DB_URL?.trim()) return env.SUPABASE_DB_URL.trim();
  const password = env.SUPABASE_DB_PASSWORD?.trim();
  const baseUrl = env.SUPABASE_URL || env.NEXT_PUBLIC_SUPABASE_URL;
  const ref = new URL(baseUrl).hostname.split(".")[0];
  const region = env.SUPABASE_DB_REGION?.trim() || "eu-west-1";
  const port = env.SUPABASE_DB_PORT?.trim() || "6543";
  return `postgresql://postgres.${ref}:${encodeURIComponent(password)}@aws-0-${region}.pooler.supabase.com:${port}/postgres`;
}

function mimeFor(file) {
  const ext = path.extname(file).toLowerCase();
  if (ext === ".png") return "image/png";
  if (ext === ".webp") return "image/webp";
  return "image/jpeg";
}

function listImages(dir) {
  if (!existsSync(dir)) return [];
  return fs
    .readdirSync(dir, { withFileTypes: true })
    .filter((e) => e.isFile() && EXTS.has(path.extname(e.name).toLowerCase()))
    .map((e) => path.join(dir, e.name));
}

function dedupeFolder(sourceDir) {
  const dupDir = path.join(sourceDir, "_duplicates");
  fs.mkdirSync(dupDir, { recursive: true });
  const files = listImages(sourceDir);
  const byHash = new Map();
  let moved = 0;

  for (const file of files) {
    const hash = crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex");
    if (!byHash.has(hash)) {
      byHash.set(hash, file);
      continue;
    }
    const dest = path.join(dupDir, path.basename(file));
    let target = dest;
    let n = 1;
    while (existsSync(target)) {
      const parsed = path.parse(dest);
      target = path.join(parsed.dir, `${parsed.name}-${n}${parsed.ext}`);
      n++;
    }
    fs.renameSync(file, target);
    moved++;
  }
  return { unique: byHash.size, moved };
}

function collectFilesWithCategories(sourceDir) {
  const items = [];
  const seenPaths = new Set();
  const canonicalFolders = ["mladenci-zajedno", "samo-mlada", "samo-mladozenje"];
  for (const folder of canonicalFolders) {
    const slug = FOLDER_TO_SLUG[folder] ?? folder;
    const dir = path.join(sourceDir, folder);
    for (const file of listImages(dir)) {
      const key = path.resolve(file);
      if (seenPaths.has(key)) continue;
      seenPaths.add(key);
      items.push({ file, categorySlug: slug });
    }
  }
  for (const file of listImages(sourceDir)) {
    const key = path.resolve(file);
    if (seenPaths.has(key)) continue;
    seenPaths.add(key);
    items.push({ file, categorySlug: null });
  }
  return items;
}

const env = loadEnv();
const supabaseUrl = env.SUPABASE_URL || env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = env.SUPABASE_SECRET_KEY || env.SUPABASE_SERVICE_ROLE_KEY;
if (!supabaseUrl || !serviceKey) {
  console.error("Nedostaje SUPABASE_URL / SUPABASE_SECRET_KEY u .env.local");
  process.exit(1);
}

console.log("Izvor:", SOURCE);
const dedupe = dedupeFolder(SOURCE);
console.log(`Duplikati premešteni u _duplicates: ${dedupe.moved} (jedinstvenih u root-u: ${dedupe.unique})`);

const pgClient = new pg.Client({
  connectionString: buildPgConn(env),
  ssl: { rejectUnauthorized: false },
});
await pgClient.connect();

const slugs = CATEGORIES.map(([s]) => s);
await pgClient.query(
  `UPDATE wedding_pose_categories SET archived_at = now(), updated_at = now()
   WHERE slug <> ALL($1::text[]) AND archived_at IS NULL`,
  [slugs]
);

const categoryIds = {};
for (const [slug, name, sort_order] of CATEGORIES) {
  const res = await pgClient.query(
    `INSERT INTO wedding_pose_categories (name, slug, sort_order, archived_at)
     VALUES ($1, $2, $3, NULL)
     ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, sort_order = EXCLUDED.sort_order, archived_at = NULL, updated_at = now()
     RETURNING id`,
    [name, slug, sort_order]
  );
  categoryIds[slug] = res.rows[0].id;
  console.log("Kategorija:", name);
}

await pgClient.end();

const supabase = createClient(supabaseUrl, serviceKey, {
  auth: { persistSession: false },
});

let filesToImport = collectFilesWithCategories(SOURCE);
if (!filesToImport.some((x) => x.categorySlug)) {
  console.log("\nNema slika u podfolderima — sve iz root-a idu bez kategorije.");
  console.log("Za automatsku kategoriju, rasporedi u:");
  console.log("  samo-mlada / samo-mladozenje / mladenci-zajedno\n");
}

const seen = new Set();
filesToImport = filesToImport.filter(({ file }) => {
  const hash = crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex");
  if (seen.has(hash)) return false;
  seen.add(hash);
  return true;
});

console.log("Upload:", filesToImport.length, "fajlova…");

let ok = 0;
let fail = 0;
for (const { file, categorySlug } of filesToImport) {
  if (!existsSync(file)) {
    console.warn("Preskočeno (nema fajla):", file);
    fail++;
    continue;
  }
  const buf = fs.readFileSync(file);
  const safe = path.basename(file).replace(/[^a-zA-Z0-9._-]/g, "_");
  const storage_path = `import/${Date.now()}-${crypto.randomBytes(4).toString("hex")}-${safe}`;

  const { error: upErr } = await supabase.storage.from(BUCKET).upload(storage_path, buf, {
    contentType: mimeFor(file),
    upsert: false,
  });
  if (upErr) {
    console.error("Storage:", path.basename(file), upErr.message);
    fail++;
    continue;
  }

  const { count } = await supabase.from("wedding_poses").select("*", { count: "exact", head: true });
  const sort_order = (count ?? 0) + 1;

  const { error: dbErr } = await supabase.from("wedding_poses").insert({
    storage_path,
    thumbnail_path: storage_path,
    category_id: categorySlug ? categoryIds[categorySlug] : null,
    sort_order,
  });
  if (dbErr) {
    console.error("DB:", path.basename(file), dbErr.message);
    fail++;
    continue;
  }
  ok++;
  if (ok % 10 === 0) console.log("  …", ok);
}

console.log(`\nGotovo. Uspešno: ${ok}, greške: ${fail}`);
if (filesToImport.some((x) => !x.categorySlug)) {
  console.log("Dodeli kategorije u /admin/poze → Fotografije (dropdown).");
}
