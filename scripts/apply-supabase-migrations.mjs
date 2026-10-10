#!/usr/bin/env node
/**
 * Primena SQL migracija preko direktne Postgres konekcije.
 * U .env.local dodaj:
 *   SUPABASE_DB_PASSWORD=lozinka_iz_Supabase_Settings_Database
 * ili puni:
 *   SUPABASE_DB_URL=postgresql://postgres.[ref]:[pass]@...pooler.supabase.com:6543/postgres
 */
import { readFileSync, existsSync, readdirSync } from "node:fs";
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

function projectRefFromUrl(url) {
  try {
    return new URL(url).hostname.split(".")[0];
  } catch {
    return "";
  }
}

function buildConnectionString(env) {
  if (env.SUPABASE_DB_URL?.trim()) return env.SUPABASE_DB_URL.trim();
  const password = env.SUPABASE_DB_PASSWORD?.trim();
  const baseUrl = env.SUPABASE_URL || env.NEXT_PUBLIC_SUPABASE_URL;
  const ref = projectRefFromUrl(baseUrl);
  if (!password || !ref) return null;
  if (env.SUPABASE_DB_HOST?.trim()) {
    const host = env.SUPABASE_DB_HOST.trim();
    const port = env.SUPABASE_DB_PORT?.trim() || "5432";
    const user = env.SUPABASE_DB_USER?.trim() || "postgres";
    return `postgresql://${user}:${encodeURIComponent(password)}@${host}:${port}/postgres`;
  }
  const region = env.SUPABASE_DB_REGION?.trim() || "eu-west-1";
  const poolerPort = env.SUPABASE_DB_PORT?.trim() || "6543";
  return `postgresql://postgres.${ref}:${encodeURIComponent(password)}@aws-0-${region}.pooler.supabase.com:${poolerPort}/postgres`;
}

const FILES = ["schema.sql", "migration-wedding-poses.sql"];
const OPTIONAL_FILES = ["migration-v2.sql", "migration-storage-size.sql"];

async function main() {
  const env = loadEnv();
  const conn = buildConnectionString(env);
  if (!conn) {
    console.error(
      "Dodaj u .env.local: SUPABASE_DB_PASSWORD (Database password iz Supabase → Settings → Database)"
    );
    process.exit(1);
  }

  const client = new pg.Client({ connectionString: conn, ssl: { rejectUnauthorized: false } });
  await client.connect();
  console.log("Povezan na Postgres, primenjujem migracije…\n");

  const supabaseDir = join(root, "supabase");
  for (const file of [...FILES, ...OPTIONAL_FILES]) {
    const path = join(supabaseDir, file);
    if (!existsSync(path)) {
      console.warn("Preskačem (nema fajla):", file);
      continue;
    }
    const sql = readFileSync(path, "utf8");
    console.log("→", file);
    try {
      await client.query(sql);
      console.log("  ✓ OK");
    } catch (e) {
      const msg = e.message || String(e);
      if (msg.includes("already exists") || msg.includes("duplicate")) {
        console.log("  ~ već postoji (OK)");
      } else {
        console.error("  ✗", msg);
        throw e;
      }
    }
  }

  await client.end();
  console.log("\nMigracije završene. Pokreni: npm run setup:supabase");
}

main().catch((e) => {
  console.error("Greška:", e.message || e);
  process.exit(1);
});
