const TARGET_LONG_SIDE = 1800;
const MIN_LONG_SIDE = 1600;
const MAX_UPSCALE = 4;

function hasCanvas(): boolean {
  return typeof document !== "undefined" && typeof document.createElement === "function";
}

async function decodeImage(file: Blob): Promise<ImageBitmap | HTMLImageElement> {
  if (typeof createImageBitmap === "function") {
    try {
      return await createImageBitmap(file, { imageOrientation: "from-image" });
    } catch {
      try {
        return await createImageBitmap(file);
      } catch {
        /* fallback sotto */
      }
    }
  }
  if (typeof Image === "undefined" || typeof URL === "undefined") {
    throw new Error("decode");
  }
  return await new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("decode"));
    };
    img.src = url;
  });
}

function sourceSize(source: ImageBitmap | HTMLImageElement): { w: number; h: number } {
  if ("naturalWidth" in source && source.naturalWidth) {
    return { w: source.naturalWidth, h: source.naturalHeight };
  }
  return { w: source.width, h: source.height };
}

function invertOrStretch(image: ImageData): boolean {
  const d = image.data;
  let sum = 0;
  let samples = 0;
  let min = 255;
  let max = 0;
  for (let i = 0; i < d.length; i += 32) {
    const y = 0.299 * d[i] + 0.587 * d[i + 1] + 0.114 * d[i + 2];
    sum += y;
    samples += 1;
    if (y < min) min = y;
    if (y > max) max = y;
  }
  const mean = samples ? sum / samples : 128;
  return mean < 118;
}

function enhanceForOcr(image: ImageData, invert: boolean) {
  const d = image.data;
  let min = 255;
  let max = 0;
  for (let i = 0; i < d.length; i += 16) {
    let y = 0.299 * d[i] + 0.587 * d[i + 1] + 0.114 * d[i + 2];
    if (invert) y = 255 - y;
    if (y < min) min = y;
    if (y > max) max = y;
  }
  const range = Math.max(24, max - min);
  for (let i = 0; i < d.length; i += 4) {
    let y = 0.299 * d[i] + 0.587 * d[i + 1] + 0.114 * d[i + 2];
    if (invert) y = 255 - y;
    y = ((y - min) / range) * 255;
    y = (y - 128) * 1.28 + 128;
    y = y < 0 ? 0 : y > 255 ? 255 : y;
    d[i] = d[i + 1] = d[i + 2] = y;
    d[i + 3] = 255;
  }
}

function invertCanvasPixels(canvas: HTMLCanvasElement) {
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) return;
  const img = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const d = img.data;
  for (let i = 0; i < d.length; i += 4) {
    d[i] = 255 - d[i];
    d[i + 1] = 255 - d[i + 1];
    d[i + 2] = 255 - d[i + 2];
  }
  ctx.putImageData(img, 0, 0);
}

async function prepareOcrCanvas(file: Blob): Promise<HTMLCanvasElement> {
  const source = await decodeImage(file);
  const { w, h } = sourceSize(source);
  if (!w || !h) throw new Error("decode");
  const long = Math.max(w, h);
  let scale = 1;
  if (long > TARGET_LONG_SIDE) scale = TARGET_LONG_SIDE / long;
  else if (long < MIN_LONG_SIDE) scale = Math.min(MAX_UPSCALE, MIN_LONG_SIDE / long);
  const cw = Math.max(1, Math.round(w * scale));
  const ch = Math.max(1, Math.round(h * scale));
  const canvas = document.createElement("canvas");
  canvas.width = cw;
  canvas.height = ch;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) throw new Error("canvas");
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(source, 0, 0, cw, ch);
  if ("close" in source && typeof source.close === "function") source.close();
  const img = ctx.getImageData(0, 0, cw, ch);
  enhanceForOcr(img, invertOrStretch(img));
  sharpen(img, cw, ch);
  ctx.putImageData(img, 0, 0);
  return canvas;
}

function sharpen(image: ImageData, w: number, h: number) {
  const src = new Uint8ClampedArray(image.data);
  const d = image.data;
  for (let y = 1; y < h - 1; y++) {
    for (let x = 1; x < w - 1; x++) {
      const i = (y * w + x) * 4;
      const c = src[i] ?? 0;
      const n = src[i - w * 4] ?? c;
      const s = src[i + w * 4] ?? c;
      const e = src[i + 4] ?? c;
      const west = src[i - 4] ?? c;
      let yv = c * 5 - n - s - e - west;
      yv = yv < 0 ? 0 : yv > 255 ? 255 : yv;
      d[i] = d[i + 1] = d[i + 2] = yv;
    }
  }
}

export async function extractTextFromImage(file: Blob): Promise<string> {
  const { createWorker } = await import("tesseract.js");
  const canvas = hasCanvas() ? await prepareOcrCanvas(file) : null;
  const worker = await createWorker("ita+eng");
  try {
    await worker.setParameters({
      tessedit_pageseg_mode: "3",
      preserve_interword_spaces: "1",
    });
    const source = canvas ?? file;
    let { data } = await worker.recognize(source);
    let text = (data.text ?? "").trim();
    if (canvas && text.length < 28) {
      invertCanvasPixels(canvas);
      const second = await worker.recognize(canvas);
      const alt = (second.data.text ?? "").trim();
      if (alt.length > text.length) text = alt;
    }
    return text;
  } finally {
    await worker.terminate();
  }
}
