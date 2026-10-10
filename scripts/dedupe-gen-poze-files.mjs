#!/usr/bin/env node
/** Jedan fajl po gen-{cat}-{NN}: prefer .jpg ako postoje oba .jpg i .png */
import fs from "node:fs";
import path from "node:path";

const base = process.env.POZE_SOURCE_DIR || "D:/COMPRESSs";
const cats = ["samo-mlada", "samo-mladozenje", "mladenci-zajedno"];
let removed = 0;

for (const cat of cats) {
  const dir = path.join(base, cat);
  if (!fs.existsSync(dir)) continue;
  const byNum = new Map();
  for (const f of fs.readdirSync(dir)) {
    const m = f.match(new RegExp(`^gen-${cat.replace(/-/g, "\\-")}-(\\d{2})\\.(png|jpe?g|webp)$`, "i"));
    if (!m) continue;
    const num = m[1];
    if (!byNum.has(num)) byNum.set(num, []);
    byNum.get(num).push(f);
  }
  for (const [, files] of byNum) {
    if (files.length <= 1) continue;
    const prefer = files.find((f) => /\.jpe?g$/i.test(f)) ?? files[0];
    for (const f of files) {
      if (f === prefer) continue;
      fs.unlinkSync(path.join(dir, f));
      removed++;
    }
  }
}
console.log("Uklonjeni dupli gen fajlovi:", removed);
