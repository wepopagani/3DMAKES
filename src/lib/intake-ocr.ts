export async function extractTextFromImage(file: Blob): Promise<string> {
  const { createWorker } = await import("tesseract.js");
  const worker = await createWorker("ita+eng");
  try {
    const { data } = await worker.recognize(file);
    return (data.text ?? "").trim();
  } finally {
    await worker.terminate();
  }
}
