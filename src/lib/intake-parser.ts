export type ParsedIntake = {
  type?: "privato" | "azienda";
  company_name?: string;
  vat_number?: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  phone?: string;
  address?: string;
  zip?: string;
  city?: string;
};

const IGNORE_EMAIL = /@3dmakes\.ch$/i;
const IGNORE_EMAIL_LOCAL = /^(noreply|no-reply|mailer-daemon|notifications?)$/i;

const LEGAL_SUFFIX_RE =
  /\b(S\.?\s*A\.?|SA|SAGL|S\.?\s*a\.?\s*g\.?\s*l\.?|GmbH|S\.?\s*r\.?\s*l\.?|SRL|Ltd\.?|LLC|Inc\.?|AG|SE|SAS|SPA|S\.?\s*p\.?\s*A\.?)\b/i;

const COMPANY_LABEL_RE =
  /^(ragione sociale|societ[aà]|azienda|ditta|company|firmenname|firma|rag\.?\s*soc\.?)\s*[:\-–]?\s*/i;

const NAME_LABEL_RE =
  /^(referente|contatto|sig\.?ra?|signore|signora|name|contact|person|da|from)\s*[:\-–]?\s*/i;

const GREETING_RE =
  /^(buongiorno|buonasera|ciao|gentil[ei]|salve|hello|hi\b|good\s|dear\b|cordiali|kind regards|best regards|distinti|grazie|thanks|inviato da|sent from)/i;

const JOB_TITLE_RE =
  /\b(direttore|ceo|cfo|cto|coo|responsabile|manager|impiegat|segreter|ufficio|acquisti|vendite|titolare|founder|owner|ingegnere|architetto|amministratore|socio)\b/i;

const STREET_RE =
  /^(via|viale|strada|piazza|piazzale|c\.?so|corso|contrada|largo|vicolo|rue|street|st\.|chemin|weg|gasse)\b/i;

const ADDRESS_LABEL_RE = /^(indirizzo|address|adresse|adress)\s*[:\-–]?\s*/i;

const FAX_RE = /\bfax\b/i;

const PHONE_RE =
  /(?:\+41|0041|\(?0\d{1,2}\)?)[\s./-]?\d{2,3}[\s./-]?\d{2,3}[\s./-]?\d{2}(?:[\s./-]?\d{2})?/g;

const EMAIL_RE = /[a-zA-Z0-9._%+'-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;

const CHE_VAT_RE = /CHE[\s.\-]*(\d{3})[\s.\-]*(\d{3})[\s.\-]*(\d{3})/i;
const IT_VAT_RE = /(?:P\.?\s*IVA|IVA|VAT)[\s:.\-]*(\d{11})/i;
const BARE_CHE_RE = /\bCHE(\d{9})\b/i;

const YEAR_RE = /^(19|20)\d{2}$/;

function normalize(text: string): string {
  return text
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n")
    .replace(/\u00a0/g, " ")
    .replace(/[|•·]+/g, "\n")
    .replace(/([a-z0-9._%+'-]+)\s+@\s+([a-z0-9.-]+\.[a-z]{2,})/gi, "$1@$2")
    .replace(/[ \t]+/g, " ")
    .trim();
}

function lines(text: string): string[] {
  return text
    .split("\n")
    .map((l) => l.replace(/^[-–—>\s]+/, "").trim())
    .filter(Boolean);
}

function cleanPhone(phone: string): string {
  return phone.replace(/[./]/g, " ").replace(/\s+/g, " ").trim();
}

function formatCheVat(a: string, b: string, c: string): string {
  return `CHE-${a}.${b}.${c}`;
}

function usableEmail(email: string): boolean {
  const local = email.split("@")[0] ?? "";
  if (IGNORE_EMAIL.test(email)) return false;
  if (IGNORE_EMAIL_LOCAL.test(local)) return false;
  return true;
}

function extractFromHeader(text: string): {
  first_name?: string;
  last_name?: string;
  email?: string;
} {
  const m = text.match(
    /^(?:da|from)\s*:\s*(?:["']?([A-Za-zÀ-ÿ][A-Za-zÀ-ÿ' -]{1,60})["']?\s*)?(?:<([^>]+@[^>]+)>|([^\s<]+@[^\s>]+))?/im,
  );
  if (!m) return {};
  const result: { first_name?: string; last_name?: string; email?: string } = {};
  const email = (m[2] || m[3] || "").trim();
  if (email && usableEmail(email)) result.email = email.toLowerCase();
  const name = looksLikePersonName(m[1] ?? "");
  if (name) {
    result.first_name = name.first;
    result.last_name = name.last;
  }
  return result;
}

function looksLikePersonName(line: string): { first: string; last: string } | undefined {
  const clean = line.replace(NAME_LABEL_RE, "").replace(/<[^>]+>/g, "").trim();
  if (!clean || GREETING_RE.test(clean) || JOB_TITLE_RE.test(clean) && clean.split(/\s+/).length < 3) {
    return undefined;
  }
  if (STREET_RE.test(clean) || ADDRESS_LABEL_RE.test(clean) || LEGAL_SUFFIX_RE.test(clean)) {
    return undefined;
  }
  if (clean.includes("@") || /\d{3,}/.test(clean)) return undefined;
  const parts = clean
    .split(/\s+/)
    .map((p) => p.replace(/[^A-Za-zÀ-ÿ\-']+$/g, "").trim())
    .filter((p) => p.length > 1 && /^[A-ZÀ-ÿ][a-zà-ÿ'’-]+$/.test(p));
  if (parts.length < 2 || parts.length > 4) return undefined;
  const first = parts[0];
  const rest = parts.slice(1);
  if (!first || rest.length === 0) return undefined;
  return { first, last: rest.join(" ") };
}

const VAT_LINE_RE = /(?:UID\s*\/?\s*MWST|MWST|UID|P\.?\s*IVA|IVA|VAT|CHE[\s.\-]*\d{3})/i;

function cleanCompany(name: string): string {
  return name.replace(/[\s·|•,;:\-–—]+$/g, "").replace(/^[·|•,\s]+/, "").trim();
}

function companyFromVatLine(line: string): string | undefined {
  const parts = line.split(
    /\s*(?:UID\s*\/?\s*MWST|MWST-Nr\.?|MWST|UID|P\.?\s*IVA|partita iva|IVA|VAT)\s*:?\s*/i,
  );
  const name = cleanCompany((parts[0] ?? "").replace(/[·|•]+/g, " "));
  if (name.length > 2 && name.length < 100 && !STREET_RE.test(name) && !/^CHE/i.test(name)) {
    return name;
  }
  return undefined;
}

function extractCompanyName(ls: string[]): string | undefined {
  for (const line of ls) {
    const labeled = line.match(COMPANY_LABEL_RE);
    if (labeled) {
      const rest = line.replace(COMPANY_LABEL_RE, "").replace(/["']/g, "").trim();
      if (rest.length > 1 && rest.length < 100) return cleanCompany(rest);
    }
    const fromVat = companyFromVatLine(line);
    if (fromVat && VAT_LINE_RE.test(line) && fromVat !== line.trim()) return fromVat;
  }
  const suffixHits = ls.filter((line) => {
    if (line.length < 3 || line.length > 100) return false;
    if (line.includes("@") || GREETING_RE.test(line) || STREET_RE.test(line)) return false;
    if (/^www\./i.test(line) || VAT_LINE_RE.test(line)) return false;
    return LEGAL_SUFFIX_RE.test(line);
  });
  if (suffixHits[0]) {
    return cleanCompany(suffixHits[0].replace(/\s*[|•].*$/, ""));
  }
  for (let i = 0; i < ls.length; i++) {
    const line = ls[i];
    const prev = ls[i - 1];
    if (!line || !prev) continue;
    if (!VAT_LINE_RE.test(line)) continue;
    if (STREET_RE.test(prev) || prev.includes("@") || GREETING_RE.test(prev)) continue;
    if (prev.length > 2 && prev.length < 100) return cleanCompany(prev);
  }
  return undefined;
}

function extractVat(text: string): string | undefined {
  const che = text.match(CHE_VAT_RE);
  if (che?.[1] && che[2] && che[3]) return formatCheVat(che[1], che[2], che[3]);
  const bare = text.match(BARE_CHE_RE);
  if (bare?.[1] && bare[1].length === 9) {
    return formatCheVat(bare[1].slice(0, 3), bare[1].slice(3, 6), bare[1].slice(6, 9));
  }
  const it = text.match(IT_VAT_RE);
  if (it?.[1]) return it[1];
  return undefined;
}

function extractEmail(text: string, fromHeader?: string): string | undefined {
  if (fromHeader && usableEmail(fromHeader)) return fromHeader.toLowerCase();
  const all = text.match(EMAIL_RE) ?? [];
  const usable = all.filter(usableEmail);
  return usable[0]?.toLowerCase();
}

function extractPhone(text: string, ls: string[]): string | undefined {
  const candidates: string[] = [];
  for (const line of ls) {
    if (FAX_RE.test(line)) continue;
    PHONE_RE.lastIndex = 0;
    const found = line.match(PHONE_RE);
    if (found) candidates.push(...found);
  }
  if (candidates.length === 0) {
    const all = text.match(PHONE_RE);
    if (all) candidates.push(...all);
  }
  if (candidates.length === 0) return undefined;
  const swiss = candidates.find((p) => p.includes("+41") || p.includes("0041"));
  const best = swiss || [...candidates].sort((a, b) => b.length - a.length)[0];
  return best ? cleanPhone(best) : undefined;
}

function extractZipCity(ls: string[]): { zip?: string; city?: string } {
  for (const line of ls) {
    const swiss = line.match(/\b([1-9]\d{3})\b[ \t]+([A-Za-zÀ-ÿ][A-Za-zÀ-ÿ\-']+(?:[ \t]+[A-Za-zÀ-ÿ\-']+)?)(?:\s*\([A-Z]{2}\))?/);
    if (swiss?.[1] && swiss[2] && !YEAR_RE.test(swiss[1])) {
      return { zip: swiss[1], city: swiss[2].trim() };
    }
    const it = line.match(/\b(\d{5})\b[ \t]+([A-Za-zÀ-ÿ][A-Za-zÀ-ÿ\-']+(?:[ \t]+[A-Za-zÀ-ÿ\-']+)?)/);
    if (it?.[1] && it[2]) return { zip: it[1], city: it[2].trim() };
  }
  return {};
}

function extractAddress(ls: string[], zip?: string, city?: string): string | undefined {
  for (const line of ls) {
    const labeled = line.replace(ADDRESS_LABEL_RE, "").trim();
    const source = ADDRESS_LABEL_RE.test(line) ? labeled : line;
    if (STREET_RE.test(source) && /\d/.test(source)) {
      let address = source.replace(ADDRESS_LABEL_RE, "").replace(/[,\s]+$/, "").trim();
      if (zip && address.includes(zip)) {
        address = address.slice(0, address.indexOf(zip)).replace(/[,\s]+$/, "").trim();
      }
      return address || undefined;
    }
  }
  if (zip && city) {
    for (let i = 0; i < ls.length; i++) {
      const line = ls[i];
      const prev = ls[i - 1];
      if (line && line.includes(zip) && line.toLowerCase().includes(city.toLowerCase()) && prev) {
        if (!prev.includes("@") && !PHONE_RE.test(prev) && !GREETING_RE.test(prev)) {
          return prev.replace(ADDRESS_LABEL_RE, "").trim();
        }
      }
    }
  }
  return undefined;
}

function extractName(ls: string[], companyName?: string, headerName?: { first: string; last: string }): {
  first_name?: string;
  last_name?: string;
} {
  if (headerName) return { first_name: headerName.first, last_name: headerName.last };
  const companyLower = companyName?.toLowerCase();
  for (const line of ls) {
    if (line.includes("@")) continue;
    if (companyLower && line.toLowerCase().includes(companyLower)) continue;
    const name = looksLikePersonName(line);
    if (name) return { first_name: name.first, last_name: name.last };
  }
  return {};
}

export function parseIntakeText(text: string): ParsedIntake {
  const t = normalize(text);
  const ls = lines(t);
  const header = extractFromHeader(t);
  const company_name = extractCompanyName(ls);
  const vat_number = extractVat(t);
  const email = extractEmail(t, header.email);
  const phone = extractPhone(t, ls);
  const zipCity = extractZipCity(ls);
  const address = extractAddress(ls, zipCity.zip, zipCity.city);
  const headerName =
    header.first_name && header.last_name
      ? { first: header.first_name, last: header.last_name }
      : undefined;
  const name = extractName(ls, company_name, headerName);

  const result: ParsedIntake = {};
  if (company_name || vat_number) result.type = "azienda";
  if (company_name) result.company_name = company_name;
  if (vat_number) result.vat_number = vat_number;
  if (name.first_name) result.first_name = name.first_name;
  if (name.last_name) result.last_name = name.last_name;
  if (email) result.email = email;
  if (phone) result.phone = phone;
  if (address) result.address = address;
  if (zipCity.zip) result.zip = zipCity.zip;
  if (zipCity.city) result.city = zipCity.city;
  return result;
}
