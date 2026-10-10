#!/usr/bin/env node
/** Provera da li fajlovi u folderima odgovaraju heuristici (mlada vs mladoženje). */
import fs from "node:fs";
import path from "node:path";
import { classifyPoseImage } from "./classify-pose-image.mjs";

const base = process.env.POZE_SOURCE_DIR || "D:/COMPRESSs";
const exts = /\.(png|jpe?g|webp)$/i;

async function auditFolder(folderSlug, expected) {
  const dir = path.join(base, folderSlug);
  if (!fs.existsSync(dir)) return { folderSlug, files: 0, wrong: [] };
  const wrong = [];
  const files = fs.readdirSync(dir).filter((f) => exts.test(f));
  for (const f of files) {
    const file = path.join(dir, f);
    let predicted;
    try {
      predicted = await classifyPoseImage(file);
    } catch (e) {
      wrong.push({ f, predicted: "error", note: e.message });
      continue;
    }
    if (predicted !== expected && predicted !== "mladenci-zajedno") {
      wrong.push({ f, predicted });
    } else if (predicted === "mladenci-zajedno") {
      wrong.push({ f, predicted, note: "couple in solo folder" });
    }
  }
  return { folderSlug, files: files.length, wrong };
}

const mlada = await auditFolder("samo-mlada", "samo-mlada");
const zenja = await auditFolder("samo-mladozenje", "samo-mladozenje");

console.log("\n=== samo-mlada (očekivano: mlada) ===");
console.log("Fajlova:", mlada.files, "| sumnjivih:", mlada.wrong.length);
for (const w of mlada.wrong.slice(0, 40)) {
  console.log(" ", w.f, "→", w.predicted, w.note ?? "");
}
if (mlada.wrong.length > 40) console.log("  … +", mlada.wrong.length - 40, "više");

console.log("\n=== samo-mladozenje (očekivano: mladoženje) ===");
console.log("Fajlova:", zenja.files, "| sumnjivih:", zenja.wrong.length);
for (const w of zenja.wrong.slice(0, 40)) {
  console.log(" ", w.f, "→", w.predicted, w.note ?? "");
}
if (zenja.wrong.length > 40) console.log("  … +", zenja.wrong.length - 40, "više");

const crossMladaAsGroom = mlada.wrong.filter((w) => w.predicted === "samo-mladozenje").length;
const crossGroomAsBride = zenja.wrong.filter((w) => w.predicted === "samo-mlada").length;
console.log("\nZbir: u mlada folderu kao mladoženje:", crossMladaAsGroom);
console.log("Zbir: u mladoženje folderu kao mlada:", crossGroomAsBride);
