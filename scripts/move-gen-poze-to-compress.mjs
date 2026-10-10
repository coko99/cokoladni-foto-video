#!/usr/bin/env node
/** Premesti gen-* iz assets/ u D:\\COMPRESSs\\{kategorija}\\ */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const assetDirs = [
  path.join(root, "assets"),
  path.join(process.env.USERPROFILE || "", ".cursor", "projects", "e-sajtovi-moj-prvi-sajt", "assets"),
].filter((d) => fs.existsSync(d));
const OUT_BASE = process.env.POZE_SOURCE_DIR || "D:/COMPRESSs";

if (!assetDirs.length) {
  console.log("Nema assets foldera.");
  process.exit(0);
}

const re = /^gen-(samo-mlada|samo-mladozenje|mladenci-zajedno)-(\d{2})\.(png|jpg|jpeg|webp)$/i;
let moved = 0;
const seen = new Set();
for (const assets of assetDirs) {
for (const name of fs.readdirSync(assets)) {
  const m = name.match(re);
  if (!m) continue;
  const [, cat, num, ext] = m;
  const destDir = path.join(OUT_BASE, cat);
  fs.mkdirSync(destDir, { recursive: true });
  const destName = `gen-${cat}-${num}.${ext.toLowerCase() === "jpeg" ? "jpg" : ext.toLowerCase()}`;
  const dest = path.join(destDir, destName);
  if (fs.existsSync(dest) || seen.has(dest)) continue;
  fs.copyFileSync(path.join(assets, name), dest);
  seen.add(dest);
  moved++;
}
}
console.log("Kopirano u COMPRESSs:", moved);
