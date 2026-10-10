#!/usr/bin/env node
/**
 * Automatska postavka: bucket-i, admin korisnik, provera tabela.
 * SQL migracije: pokreni migration fajlove u Supabase SQL Editoru ako tabele nedostaju.
 */
import { readFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { createClient } from "@supabase/supabase-js";
import { randomBytes } from "node:crypto";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const envPath = join(root, ".env.local");

function loadEnv() {
  if (!existsSync(envPath)) throw new Error(".env.local nije pronađen");
  const env = {};
  for (const line of readFileSync(envPath, "utf8").split(/\r?\n/)) {
    const t = line.trim();
    if (!t || t.startsWith("#")) continue;
    const i = t.indexOf("=");
    if (i > 0) env[t.slice(0, i).trim()] = t.slice(i + 1).trim();
  }
  return env;
}

const env = loadEnv();
const url = env.NEXT_PUBLIC_SUPABASE_URL || env.SUPABASE_URL;
const serviceKey = env.SUPABASE_SERVICE_ROLE_KEY || env.SUPABASE_SECRET_KEY;

if (!url || !serviceKey) {
  console.error("Nedostaje SUPABASE_URL ili SUPABASE_SECRET_KEY u .env.local");
  process.exit(1);
}

const admin = createClient(url, serviceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const ADMIN_EMAIL = (env.SETUP_ADMIN_EMAIL || "admin@cokoladni.rs").trim();
const ADMIN_PASSWORD = env.SETUP_ADMIN_PASSWORD?.trim();

async function ensureBucket(id, publicBucket = true) {
  const { data: buckets, error: listErr } = await admin.storage.listBuckets();
  if (listErr) throw listErr;
  if (buckets?.some((b) => b.id === id || b.name === id)) {
    console.log(`✓ Bucket "${id}" već postoji`);
    return;
  }
  const { error } = await admin.storage.createBucket(id, {
    public: publicBucket,
    fileSizeLimit: 20 * 1024 * 1024,
  });
  if (error) throw error;
  console.log(`✓ Bucket "${id}" kreiran (public=${publicBucket})`);
}

async function ensureAdminUser() {
  const { data: list, error: listErr } = await admin.auth.admin.listUsers({
    page: 1,
    perPage: 50,
  });
  if (listErr) throw listErr;

  const existing = list.users.find(
    (u) => u.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase()
  );
  if (existing) {
    console.log(`✓ Admin korisnik već postoji: ${ADMIN_EMAIL}`);
    return;
  }

  const password = ADMIN_PASSWORD || randomBytes(12).toString("base64url") + "Aa1!";
  const { data, error } = await admin.auth.admin.createUser({
    email: ADMIN_EMAIL,
    password,
    email_confirm: true,
  });
  if (error) throw error;
  console.log(`✓ Admin korisnik kreiran: ${ADMIN_EMAIL}`);
  if (!ADMIN_PASSWORD) {
    console.log("");
    console.log("  Privremena lozinka (sačuvaj i promeni u Supabase Auth):");
    console.log(`  ${password}`);
    console.log("");
  }
  return data.user;
}

async function checkTable(name) {
  const { error } = await admin.from(name).select("*", { count: "exact", head: true });
  if (error) {
    if (
      error.code === "PGRST205" ||
      error.message?.includes("Could not find the table") ||
      error.message?.includes("does not exist") ||
      error.code === "42P01"
    ) {
      return false;
    }
    console.warn(`  ? ${name}: ${error.message}`);
    return null;
  }
  return true;
}

async function main() {
  console.log("Supabase postavka —", url.replace(/https:\/\//, ""));
  console.log("");

  await ensureBucket("gallery-images", true);
  await ensureBucket("wedding-poses", true);
  console.log("");

  await ensureAdminUser();
  console.log("");

  console.log("Provera tabela:");
  const tables = [
    "galleries",
    "wedding_pose_categories",
    "wedding_poses",
    "wedding_pose_submissions",
  ];
  const missing = [];
  for (const t of tables) {
    const ok = await checkTable(t);
    if (ok === true) console.log(`  ✓ ${t}`);
    else if (ok === false) {
      console.log(`  ✗ ${t} — nedostaje`);
      missing.push(t);
    }
  }

  if (missing.length) {
    console.log("");
    console.log("Pokreni u Supabase SQL Editoru:");
    if (missing.includes("galleries")) {
      console.log("  1. supabase/schema.sql (+ migration-v2.sql po potrebi)");
    }
    if (missing.some((m) => m.startsWith("wedding_pose"))) {
      console.log("  2. supabase/migration-wedding-poses.sql");
    }
  } else {
    console.log("");
    console.log("Sve ključne tabele su dostupne.");
  }

  console.log("");
  console.log("Prijava: /login → tab Fotograf →", ADMIN_EMAIL);
}

main().catch((e) => {
  console.error("Greška:", e.message || e);
  process.exit(1);
});
