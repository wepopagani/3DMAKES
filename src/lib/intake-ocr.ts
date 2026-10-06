import { createWorker } from "tesseract.js";

export async function extractTextFromImage(file: Blob): Promise<string> {
  const worker = await createWorker("ita+eng");
  try {
    const { data } = await worker.recognize(file);
    return (data.text ?? "").trim();
  } finally {
    await worker.terminate();
  }
}
