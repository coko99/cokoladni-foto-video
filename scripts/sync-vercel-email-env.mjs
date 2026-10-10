#!/usr/bin/env node
/**
 * Syncs email-related env vars from .env.local to Vercel Production.
 * Usage: node scripts/sync-vercel-email-env.mjs [--redeploy]
 */
import { readFileSync, existsSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const envFile = join(root, ".env.local");
const EMAIL_VARS = ["RESEND_API_KEY", "CONTACT_FROM_EMAIL", "CONTACT_TO_EMAIL"];
const redeploy = process.argv.includes("--redeploy");

function parseEnvFile(path) {
  const values = {};
  for (const line of readFileSync(path, "utf8").split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const idx = trimmed.indexOf("=");
    if (idx <= 0) continue;
    values[trimmed.slice(0, idx).trim()] = trimmed.slice(idx + 1).trim();
  }
  return values;
}

function runVercel(args, input) {
  const result = spawnSync("npx", ["vercel@latest", ...args], {
    cwd: root,
    input,
    encoding: "utf8",
    stdio: ["pipe", "pipe", "pipe"],
    shell: true,
  });
  return result;
}

function upsertEnv(name, value, target) {
  runVercel(["env", "rm", name, target, "--yes"]);
  const add = runVercel(["env", "add", name, target], `${value}\n`);
  if (add.status !== 0) {
    const err = (add.stderr || add.stdout || "").trim();
    throw new Error(`Failed to set ${name} (${target}): ${err}`);
  }
  console.log(`✓ ${name} → ${target}`);
}

if (!existsSync(envFile)) {
  console.error("Missing .env.local in project root.");
  process.exit(1);
}

const env = parseEnvFile(envFile);
const missing = EMAIL_VARS.filter((key) => !env[key]?.trim());
if (missing.length) {
  console.error(`Missing in .env.local: ${missing.join(", ")}`);
  process.exit(1);
}

const whoami = runVercel(["whoami"]);
if (whoami.status !== 0) {
  console.error("Not logged in to Vercel CLI. Run: npx vercel login");
  process.exit(1);
}

console.log(`Logged in as: ${(whoami.stdout || "").trim()}`);

for (const name of EMAIL_VARS) {
  upsertEnv(name, env[name], "production");
  upsertEnv(name, env[name], "preview");
}

if (redeploy) {
  console.log("Redeploying production…");
  const deploy = runVercel(["--prod"]);
  if (deploy.status !== 0) {
    console.error((deploy.stderr || deploy.stdout || "").trim());
    process.exit(1);
  }
  console.log("✓ Production redeploy started.");
} else {
  console.log("\nDone. Redeploy production in Vercel dashboard (or rerun with --redeploy).");
}
