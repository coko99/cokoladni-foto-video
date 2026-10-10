import fs from "node:fs";
import path from "node:path";

const base = process.env.POZE_SOURCE_DIR || "D:/COMPRESSs";
const cats = ["samo-mlada", "samo-mladozenje", "mladenci-zajedno"];

for (const cat of cats) {
  const dir = path.join(base, cat);
  const gen = fs.existsSync(dir)
    ? fs.readdirSync(dir).filter((f) => /^gen-/.test(f)).length
    : 0;
  const total = fs.existsSync(dir)
    ? fs.readdirSync(dir).filter((f) => /\.(png|jpe?g|webp)$/i.test(f)).length
    : 0;
  console.log(`${cat}: gen ${gen}/30, ukupno u folderu ${total}`);
}
