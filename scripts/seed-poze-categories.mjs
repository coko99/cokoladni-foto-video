#!/usr/bin/env node
/** Podrazumevane kategorije poza — zamena starih šablona novim setom. */
import { readFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import dns from "node:dns";
import pg from "pg";

dns.setDefaultResultOrder("ipv6first");

const CATEGORIES = [
  ["mladenci-zajedno", "Mladenci zajedno", 1],
  ["samo-mlada", "Samo mlada", 2],
  ["samo-mladozenje", "Samo mladoženje", 3],
];

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

function buildConnectionString(env) {
  if (env.SUPABASE_DB_URL?.trim()) return env.SUPABASE_DB_URL.trim();
  const password = env.SUPABASE_DB_PASSWORD?.trim();
  const baseUrl = env.SUPABASE_URL || env.NEXT_PUBLIC_SUPABASE_URL;
  const ref = new URL(baseUrl).hostname.split(".")[0];
  const region = env.SUPABASE_DB_REGION?.trim() || "eu-west-1";
  const poolerPort = env.SUPABASE_DB_PORT?.trim() || "6543";
  return `postgresql://postgres.${ref}:${encodeURIComponent(password)}@aws-0-${region}.pooler.supabase.com:${poolerPort}/postgres`;
}

const env = loadEnv();
const client = new pg.Client({
  connectionString: buildConnectionString(env),
  ssl: { rejectUnauthorized: false },
});

const slugs = CATEGORIES.map(([slug]) => slug);

await client.connect();

await client.query(
  `UPDATE wedding_pose_categories
   SET archived_at = now(), updated_at = now()
   WHERE slug <> ALL($1::text[]) AND archived_at IS NULL`,
  [slugs]
);

for (const [slug, name, sort_order] of CATEGORIES) {
  await client.query(
    `INSERT INTO wedding_pose_categories (name, slug, sort_order, archived_at)
     VALUES ($1, $2, $3, NULL)
     ON CONFLICT (slug) DO UPDATE SET
       name = EXCLUDED.name,
       sort_order = EXCLUDED.sort_order,
       archived_at = NULL,
       updated_at = now()`,
    [name, slug, sort_order]
  );
  console.log(`✓ ${name}`);
}

await client.end();
console.log("\nKategorije su ažurirane. Stare (romantične, editorial…) su arhivirane.");
