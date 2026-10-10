/**
 * Heuristika za AI ilustracije poza (bela pozadina, jedna ili dve figure).
 * Vraća: mladenci-zajedno | samo-mlada | samo-mladozenje
 */
import sharp from "sharp";

function isBackground(r, g, b) {
  if (r > 248 && g > 248 && b > 245) return true;
  if (r > 235 && g > 228 && b > 215 && r - b < 35) return true;
  return false;
}

function columnScore(data, w, h, x0, x1) {
  let fg = 0;
  let sumR = 0;
  let sumG = 0;
  let sumB = 0;
  let dark = 0;
  for (let y = 0; y < h; y++) {
    for (let x = x0; x < x1; x++) {
      const i = (y * w + x) * 3;
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      if (isBackground(r, g, b)) continue;
      fg++;
      sumR += r;
      sumG += g;
      sumB += b;
      if (r + g + b < 200) dark++;
    }
  }
  if (fg === 0) return { fg: 0, darkRatio: 0, mean: 255 };
  const mean = (sumR + sumG + sumB) / (fg * 3);
  return { fg, darkRatio: dark / fg, mean };
}

/**
 * @param {string} filePath
 * @returns {Promise<'mladenci-zajedno'|'samo-mlada'|'samo-mladozenje'>}
 */
export async function classifyPoseImage(filePath) {
  const { data, info } = await sharp(filePath)
    .resize(120, 160, { fit: "inside" })
    .removeAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const { width: w, height: h } = info;
  const third = Math.floor(w / 3);
  const left = columnScore(data, w, h, 0, third);
  const mid = columnScore(data, w, h, third, 2 * third);
  const right = columnScore(data, w, h, 2 * third, w);

  const minSide = w * h * 0.022;
  const bothSides = left.fg > minSide && right.fg > minSide;
  const leftSuit = left.darkRatio > 0.16;
  const rightSuit = right.darkRatio > 0.16;
  const leftDress = left.mean > 168 && left.darkRatio < 0.14;
  const rightDress = right.mean > 168 && right.darkRatio < 0.14;

  if (bothSides && ((leftSuit && rightDress) || (rightSuit && leftDress))) {
    return "mladenci-zajedno";
  }
  if (bothSides && leftDress && rightDress) {
    return "samo-mlada";
  }

  const totalFg = left.fg + mid.fg + right.fg;
  let dark = 0;
  let sum = 0;
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const i = (y * w + x) * 3;
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      if (isBackground(r, g, b)) continue;
      sum += r + g + b;
      if (r + g + b < 200) dark++;
    }
  }
  const darkRatio = totalFg ? dark / totalFg : 0;
  const mean = totalFg ? sum / (totalFg * 3) : 255;

  if (darkRatio > 0.19 || mean < 108) {
    return "samo-mladozenje";
  }
  return "samo-mlada";
}
