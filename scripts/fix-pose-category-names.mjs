#!/usr/bin/env node
/** Ispravi nazive kategorija u bazi ako su ušli sa pogrešnim enkodingom. */
import { readFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import dns from "node:dns";
import pg from "pg";

dns.setDefaultResultOrder("ipv6first");

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

const CATEGORIES = [
  ["samo-mlada", "Samo mlada"],
  ["samo-mladozenje", "Samo mladoženje"],
  ["mlada-sa-devojkama", "Mlada sa devojkama"],
  ["mladozenje-sa-momcima", "Mladoženje sa momcima"],
];

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

await client.connect();
for (const [slug, name] of CATEGORIES) {
  await client.query(
    "UPDATE wedding_pose_categories SET name = $1, updated_at = now() WHERE slug = $2",
    [name, slug]
  );
}
await client.end();
console.log("✓ Nazivi kategorija ažurirani (UTF-8).");
