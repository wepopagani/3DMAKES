export type LabDocument = {
  id: string;
  type: string;
  typeLabel: string;
  reference: string | null;
  amount: number | null;
  docDate: string;
  fileName: string;
  mime: string;
  url: string;
};

const DEFAULT_GESTIONALE = "https://clienti.3dmakes.ch";

function documentsEndpoint() {
  const base = (import.meta.env.VITE_GESTIONALE_URL as string | undefined)?.replace(/\/$/, "");
  if (base) return `${base}/api/public/client-documents`;
  if (import.meta.env.DEV) return "http://localhost:5174/api/public/client-documents";
  return `${DEFAULT_GESTIONALE}/api/public/client-documents`;
}

export async function fetchLabDocuments(idToken: string): Promise<LabDocument[]> {
  const res = await fetch(documentsEndpoint(), {
    headers: { authorization: `Bearer ${idToken}` },
  });
  if (!res.ok) return [];
  const data = (await res.json()) as { documents?: LabDocument[] };
  return Array.isArray(data.documents) ? data.documents : [];
}

export function formatLabDate(value: string) {
  const [year, month, day] = value.split("-");
  if (!year || !month || !day) return value || "—";
  return `${day}.${month}.${year}`;
}

export function formatLabAmount(amount: number | null) {
  if (amount == null || Number.isNaN(amount)) return null;
  return `CHF ${amount.toFixed(2)}`;
}
