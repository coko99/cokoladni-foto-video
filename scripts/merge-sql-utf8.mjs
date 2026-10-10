#!/usr/bin/env node
import { readFileSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const parts = ["schema.sql", "migration-wedding-poses.sql"];
const out = join(root, "supabase", "apply-all-migrations.sql");

const combined = parts
  .map((f) => readFileSync(join(root, "supabase", f), "utf8"))
  .join("\n\n-- ─── next file ───\n\n");

writeFileSync(out, combined, "utf8");
console.log("Written", out);
