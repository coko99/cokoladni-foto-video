#!/usr/bin/env node
/** Obriši prethodni import (storage_path import/*) i ponovo pokreni import. */
import { readFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import dns from "node:dns";
import pg from "pg";
import { createClient } from "@supabase/supabase-js";
import { spawn } from "node:child_process";

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

function buildPgConn(env) {
  if (env.SUPABASE_DB_URL?.trim()) return env.SUPABASE_DB_URL.trim();
  const password = env.SUPABASE_DB_PASSWORD?.trim();
  const baseUrl = env.SUPABASE_URL || env.NEXT_PUBLIC_SUPABASE_URL;
  const ref = new URL(baseUrl).hostname.split(".")[0];
  const region = env.SUPABASE_DB_REGION?.trim() || "eu-west-1";
  const port = env.SUPABASE_DB_PORT?.trim() || "6543";
  return `postgresql://postgres.${ref}:${encodeURIComponent(password)}@aws-0-${region}.pooler.supabase.com:${port}/postgres`;
}

const env = loadEnv();
const supabaseUrl = env.SUPABASE_URL || env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = env.SUPABASE_SECRET_KEY || env.SUPABASE_SERVICE_ROLE_KEY;
if (!supabaseUrl || !serviceKey) {
  console.error("Nedostaje SUPABASE_URL / SUPABASE_SECRET_KEY");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceKey, { auth: { persistSession: false } });

const { data: rows, error } = await supabase
  .from("wedding_poses")
  .select("id, storage_path")
  .like("storage_path", "import/%");

if (error) {
  console.error(error.message);
  process.exit(1);
}

const list = rows ?? [];
console.log("Brisanje prethodnog importa:", list.length, "poza");

if (list.length) {
  const paths = list.map((r) => r.storage_path);
  const { error: stErr } = await supabase.storage.from("wedding-poses").remove(paths);
  if (stErr) console.warn("Storage:", stErr.message);

  const pgClient = new pg.Client({
    connectionString: buildPgConn(env),
    ssl: { rejectUnauthorized: false },
  });
  await pgClient.connect();
  await pgClient.query("DELETE FROM wedding_poses WHERE storage_path LIKE 'import/%'");
  await pgClient.end();
}

await new Promise((resolve, reject) => {
  const child = spawn(process.execPath, [join(root, "scripts/import-compress-poses.mjs")], {
    stdio: "inherit",
    cwd: root,
  });
  child.on("exit", (code) => (code === 0 ? resolve() : reject(new Error("import failed"))));
});
