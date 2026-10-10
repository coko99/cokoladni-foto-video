#!/usr/bin/env node
/**
 * Generiše nove ilustracije poza (OpenAI Images API).
 * Zahteva OPENAI_API_KEY u .env.local
 *
 *   npm run poze:generate-images
 *   npm run poze:generate-images -- --category samo-mlada --from 1 --to 5
 */
import fs from "node:fs";
import path from "node:path";
import { readFileSync, existsSync, mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const envPath = join(root, ".env.local");
const promptsPath = join(root, "data", "poze-gen-prompts.json");
const OUT_BASE = process.env.POZE_SOURCE_DIR || "D:/COMPRESSs";

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

function parseArgs() {
  const args = process.argv.slice(2);
  let category = null;
  let from = 1;
  let to = 30;
  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--category") category = args[++i];
    if (args[i] === "--from") from = Number(args[++i]);
    if (args[i] === "--to") to = Number(args[++i]);
  }
  return { category, from, to };
}

const env = loadEnv();
const apiKey = env.OPENAI_API_KEY?.trim();
if (!apiKey) {
  console.error("Dodaj OPENAI_API_KEY u .env.local pa pokreni ponovo.");
  process.exit(1);
}

const data = JSON.parse(readFileSync(promptsPath, "utf8"));
const { category: onlyCat, from, to } = parseArgs();

const styleByCat = {
  "samo-mlada": data.styleBride,
  "samo-mladozenje": data.styleGroom,
  "mladenci-zajedno": data.styleCouple,
};

const categories = onlyCat ? [onlyCat] : ["samo-mlada", "samo-mladozenje", "mladenci-zajedno"];

async function generateOne(prompt, outFile) {
  const body = {
    model: "dall-e-3",
    prompt,
    size: "1024x1792",
    quality: "standard",
    response_format: "b64_json",
    n: 1,
  };

  const res = await fetch("https://api.openai.com/v1/images/generations", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`${res.status} ${err.slice(0, 400)}`);
  }

  const json = await res.json();
  const b64 = json.data?.[0]?.b64_json;
  if (!b64) throw new Error("Nema slike u odgovoru");
  fs.writeFileSync(outFile, Buffer.from(b64, "base64"));
}

let done = 0;
let skipped = 0;

for (const cat of categories) {
  const list = data[cat];
  if (!list) {
    console.warn("Nepoznata kategorija:", cat);
    continue;
  }
  const outDir = join(OUT_BASE, cat);
  mkdirSync(outDir, { recursive: true });

  for (let i = from; i <= Math.min(to, list.length); i++) {
    const slug = `gen-${cat}-${String(i).padStart(2, "0")}.png`;
    const outFile = join(outDir, slug);
    if (existsSync(outFile)) {
      skipped++;
      continue;
    }
    const prompt = `${data.style} ${styleByCat[cat]} Scene: ${list[i - 1]}`;
    process.stdout.write(`${slug} … `);
    try {
      await generateOne(prompt, outFile);
      done++;
      console.log("OK");
    } catch (e) {
      console.log("GREŠKA", e.message);
    }
    await new Promise((r) => setTimeout(r, 1200));
  }
}

console.log(`\nGenerisano: ${done}, preskočeno (već postoji): ${skipped}`);
console.log("Zatim: npm run poze:reimport-compress");
