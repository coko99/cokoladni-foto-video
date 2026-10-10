#!/usr/bin/env node
/**
 * Rasporedi PNG iz root-a D:\COMPRESSs u tri podfoldera (heuristika).
 * Duplikati u _duplicates se ne diraju.
 */
import fs from "node:fs";
import path from "node:path";
import { classifyPoseImage } from "./classify-pose-image.mjs";

const SOURCE = process.env.POZE_SOURCE_DIR || "D:/COMPRESSs";
const FOLDERS = {
  "mladenci-zajedno": "mladenci-zajedno",
  "samo-mlada": "samo-mlada",
  "samo-mladozenje": "samo-mladozenje",
};

for (const dir of Object.values(FOLDERS)) {
  fs.mkdirSync(path.join(SOURCE, dir), { recursive: true });
}

const exts = new Set([".png", ".jpg", ".jpeg", ".webp"]);
const rootFiles = fs.readdirSync(SOURCE, { withFileTypes: true }).filter(
  (e) => e.isFile() && exts.has(path.extname(e.name).toLowerCase())
);

const counts = { moved: 0, skipped: 0 };
for (const entry of rootFiles) {
  const file = path.join(SOURCE, entry.name);
  const slug = await classifyPoseImage(file);
  const destDir = path.join(SOURCE, FOLDERS[slug]);
  let dest = path.join(destDir, entry.name);
  if (fs.existsSync(dest)) {
    const parsed = path.parse(entry.name);
    let n = 1;
    while (fs.existsSync(dest)) {
      dest = path.join(destDir, `${parsed.name}-${n}${parsed.ext}`);
      n++;
    }
  }
  fs.renameSync(file, dest);
  counts.moved++;
  if (counts.moved % 15 === 0) console.log("  …", counts.moved);
}

console.log(`Raspoređeno: ${counts.moved} slika u podfoldere.`);
console.log("Pokreni: npm run poze:reimport-compress (obriše stari import i ponovo učita).");
