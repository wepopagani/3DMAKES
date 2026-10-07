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
  /^(referente|contatto|sig\.?ra?|signore|signora|dott\.?|ing\.?|dr\.?|name|contact|person|da|from|inviato da)\s*[:\-–]?\s*/i;

const NOT_NAME_WORD =
  /^(via|viale|strada|switzerland|svizzera|ticino|lugano|consulting|technology|research|advanced|tech|gmbh|sagl|uid|mwst|che|info|office|hello|sales|admin|contact|mail|team|mostra|pi[uù]|more|show|from|encrypted|messages|people|only|this|chat|re|oggetto)$/i;

const NAME_NOISE_WORD =
  /^(la|il|lo|le|i|un|una|di|da|del|della|dei|degl[ie]|de|el|the|of|a|al|alla)$/i;

const SKIP_EMAIL_LOCAL = /^(info|office|hello|sales|admin|contact|mail|team|segreteria|noreply|no-reply)$/i;

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

const CHE_VAT_RE = /CHE[\s.\-–—]*([0-9OIl]{3})[\s.,\-–—]*([0-9OIl]{3})[\s.,\-–—]*([0-9OIl]{3})/i;
const IT_VAT_RE = /(?:P\.?\s*IVA|IVA|VAT)[\s:.\-]*(\d{11})/i;
const BARE_CHE_RE = /\bCHE([0-9OIl]{9})\b/i;

const YEAR_RE = /^(19|20)\d{2}$/;

function vatDigits(chunk: string): string {
  return chunk.replace(/[Oo]/g, "0").replace(/[Il]/g, "1").replace(/\D/g, "");
}

function repairOcrText(text: string): string {
  return text
    .replace(/[\u200B-\u200D\uFEFF]/g, "")
    .replace(/[|•·]+/g, "\n")
    .replace(/\+4[lI]\b/g, "+41")
    .replace(/\bO(?=\d{8,})/g, "0")
    .replace(/([a-z0-9._%+'-]+)\s*[@＠]\s*([a-z0-9.-]+(?:\s*\.\s*[a-z0-9.-]+)+)/gi, (_, user, host) => {
      return `${user}@${String(host).replace(/\s+/g, "")}`;
    })
    .replace(/\b(Viale|Piazzale|Piazza|Vicolo|Strada|Chemin|Corso|Via)(?=[A-Za-zÀ-ÿ])/g, "$1 ")
    .replace(/\b([1-9]\d{3})(?=[A-ZÀ-ÿ])/g, "$1 ")
    .replace(/([a-zà-ÿ])(\()/g, "$1 $2")
    .replace(/([a-zà-ÿ])(Consulting|GmbH|Studio|Group|Holding)\b/gi, "$1 $2")
    .replace(/\bUID\s*[\\/|I1l]\s*MWST\b/gi, "UID/MWST")
    .replace(/\bUIDIMWST\b/gi, "UID/MWST")
    .replace(/mostra di pi[uù] da\s+/gi, "")
    .replace(/show more from\s+/gi, "")
    .replace(/messages? and data are end-to-end encrypted[^\n]*/gi, "");
}

function normalize(text: string): string {
  return repairOcrText(text)
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n")
    .replace(/\u00a0/g, " ")
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

/** Check digit ufficiale UID svizzero (modulo 11). */
function isValidCheUid(digits: string): boolean {
  if (!/^\d{9}$/.test(digits)) return false;
  const weights = [5, 4, 3, 2, 7, 6, 5, 4];
  let sum = 0;
  for (let i = 0; i < 8; i++) sum += Number(digits[i]) * (weights[i] ?? 0);
  let check = 11 - (sum % 11);
  if (check === 10) return false;
  if (check === 11) check = 0;
  return check === Number(digits[8]);
}

/** Confusione OCR più frequente sui numeri UID (6↔8, 5↔6). */
const OCR_DIGIT: Record<string, string[]> = {
  "5": ["6"],
  "6": ["5", "8"],
  "8": ["6"],
};

function repairCheUid(digits: string): string {
  if (isValidCheUid(digits)) return digits;
  const hits: string[] = [];
  for (let i = 0; i < digits.length; i++) {
    const alts = OCR_DIGIT[digits[i] ?? ""] ?? [];
    for (const alt of alts) {
      const next = `${digits.slice(0, i)}${alt}${digits.slice(i + 1)}`;
      if (isValidCheUid(next) && !hits.includes(next)) hits.push(next);
    }
  }
  return hits.length === 1 && hits[0] ? hits[0] : digits;
}

function usableEmail(email: string): boolean {
  const local = email.split("@")[0] ?? "";
  if (IGNORE_EMAIL.test(email)) return false;
  if (IGNORE_EMAIL_LOCAL.test(local)) return false;
  return true;
}

function titleCaseWord(word: string): string {
  const lower = word.toLowerCase();
  return lower.charAt(0).toUpperCase() + lower.slice(1);
}

function nameFromEmail(email: string): { first: string; last: string } | undefined {
  const local = (email.split("@")[0] ?? "").replace(/^\d+/, "");
  if (SKIP_EMAIL_LOCAL.test(local)) return undefined;
  const parts = local
    .split(/[._-]+/)
    .map((p) => p.replace(/[^A-Za-zÀ-ÿ]/g, ""))
    .filter((p) => p.length > 1 && !NOT_NAME_WORD.test(p));
  if (parts.length < 2 || parts.length > 3) return undefined;
  return { first: titleCaseWord(parts[0] ?? ""), last: parts.slice(1).map(titleCaseWord).join(" ") };
}

function extractFromHeader(text: string): {
  first_name?: string;
  last_name?: string;
  email?: string;
} {
  const m = text.match(
    /^(?:da|from|inviato da)\s*:?\s*(?:["']?([A-Za-zÀ-ÿ][A-Za-zÀ-ÿ' .-]{1,80})["']?\s*)?(?:<([^>]+@[^>]+)>|([^\s<]+@[^\s>]+))?/im,
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
  const withoutMail = line.replace(EMAIL_RE, "").replace(/[<>]/g, " ").trim();
  const clean = withoutMail
    .replace(/^(a|to|cc|re|oggetto|subject)\s*:\s*.*$/i, "")
    .replace(NAME_LABEL_RE, "")
    .trim();
  if (!clean || GREETING_RE.test(clean)) return undefined;
  if (JOB_TITLE_RE.test(clean) && clean.split(/\s+/).length < 3) return undefined;
  if (STREET_RE.test(clean) || ADDRESS_LABEL_RE.test(clean) || LEGAL_SUFFIX_RE.test(clean)) {
    return undefined;
  }
  if (/\d{3,}/.test(clean) || /https?:\/\//i.test(clean)) return undefined;
  const spaced = clean.replace(/([a-zà-ÿ])([A-ZÀ-ÿ])/g, "$1 $2");
  const parts = spaced
    .split(/\s+/)
    .map((p) => p.replace(/[^A-Za-zÀ-ÿ'’-]+/g, "").trim())
    .filter(
      (p) =>
        p.length > 1 &&
        /^[A-Za-zÀ-ÿ][A-Za-zÀ-ÿ'’-]+$/.test(p) &&
        !NOT_NAME_WORD.test(p) &&
        !NAME_NOISE_WORD.test(p),
    );
  if (parts.length < 2 || parts.length > 4) return undefined;
  const first = parts[0];
  const rest = parts.slice(1);
  if (!first || rest.length === 0 || NAME_NOISE_WORD.test(first) || first.length < 3) {
    return undefined;
  }
  return { first: titleCaseWord(first), last: rest.map(titleCaseWord).join(" ") };
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
    if (looksLikePersonName(line)) return false;
    return (
      LEGAL_SUFFIX_RE.test(line) ||
      /\b(consulting|studio|group|holding|partners|associati)\b/i.test(line)
    );
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
  if (che?.[1] && che[2] && che[3]) {
    const a = vatDigits(che[1]);
    const b = vatDigits(che[2]);
    const c = vatDigits(che[3]);
    if (a.length === 3 && b.length === 3 && c.length === 3) {
      const digits = repairCheUid(`${a}${b}${c}`);
      return formatCheVat(digits.slice(0, 3), digits.slice(3, 6), digits.slice(6, 9));
    }
  }
  const bare = text.match(BARE_CHE_RE);
  if (bare?.[1]) {
    const raw = vatDigits(bare[1]);
    if (raw.length === 9) {
      const digits = repairCheUid(raw);
      return formatCheVat(digits.slice(0, 3), digits.slice(3, 6), digits.slice(6, 9));
    }
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

const SKIP_WEB_HOST = /\b(facebook|instagram|linkedin|google|youtube|3dmakes|whatsapp|apple|icloud)\b/i;

function extractWebsiteHost(text: string): string | undefined {
  const patched = text.replace(/https?:\/(?!\/)/gi, "https://");
  const m =
    patched.match(/https?:\/\/(?:www\.)?([a-z0-9-]+(?:\.[a-z0-9-]+)+)/i) ??
    patched.match(/\bwww\.([a-z0-9-]+(?:\.[a-z0-9-]+)+)/i) ??
    patched.match(/\b([a-z0-9-]+\.(?:ch|com|tech|io|it|net|org|eu))\b/i);
  const host = (m?.[1] ?? "").toLowerCase();
  if (!host || SKIP_WEB_HOST.test(host)) return undefined;
  return host;
}

function slugName(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z]/g, "");
}

function emailFromNameAndHost(first: string, last: string, host: string): string {
  const lastMain = last.split(/\s+/)[0] ?? last;
  return `${slugName(first)}.${slugName(lastMain)}@${host}`;
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

const CITY_ZIP: Record<string, string> = {
  pregassona: "6963",
  figino: "6918",
  mendrisio: "6850",
  locarno: "6600",
  chiasso: "6830",
  bellinzona: "6500",
  minusio: "6648",
  ascona: "6612",
};

function repairZip(zip: string, city: string): string {
  const known = CITY_ZIP[city.toLowerCase()];
  if (!known || known === zip || known.length !== zip.length) return zip;
  let diff = 0;
  for (let i = 0; i < zip.length; i++) {
    if (zip[i] !== known[i]) diff += 1;
  }
  return diff === 1 ? known : zip;
}

function extractZipCity(ls: string[]): { zip?: string; city?: string } {
  for (const line of ls) {
    const swiss = line.match(/\b([1-9]\d{3})\b[ \t,]*([A-Za-zÀ-ÿ][A-Za-zÀ-ÿ\-']+(?:[ \t]+[A-Za-zÀ-ÿ\-']+)?)(?:\s*\([A-Z]{2}\))?/);
    if (swiss?.[1] && swiss[2] && !YEAR_RE.test(swiss[1])) {
      const city = swiss[2].trim();
      return { zip: repairZip(swiss[1], city), city };
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

function extractName(
  ls: string[],
  companyName?: string,
  headerName?: { first: string; last: string },
  email?: string,
): {
  first_name?: string;
  last_name?: string;
} {
  const votes = new Map<string, { first: string; last: string; n: number }>();
  const consider = (name?: { first: string; last: string }) => {
    if (!name || name.first.length < 3 || NAME_NOISE_WORD.test(name.first)) return;
    const key = `${name.first} ${name.last}`.toLowerCase();
    const prev = votes.get(key);
    votes.set(key, { first: name.first, last: name.last, n: (prev?.n ?? 0) + 1 });
  };
  consider(headerName);
  const companyLower = companyName?.toLowerCase();
  for (const line of ls) {
    if (companyLower && line.toLowerCase().includes(companyLower)) continue;
    consider(looksLikePersonName(line));
  }
  if (email) consider(nameFromEmail(email));
  let best: { first: string; last: string; n: number } | undefined;
  for (const vote of votes.values()) {
    const better =
      !best ||
      vote.n > best.n ||
      (vote.n === best.n && vote.last.split(/\s+/).length < best.last.split(/\s+/).length);
    if (better) best = vote;
  }
  if (best) return { first_name: best.first, last_name: best.last };
  return {};
}

export function parseIntakeText(text: string): ParsedIntake {
  const t = normalize(text);
  const ls = lines(t);
  const header = extractFromHeader(t);
  const company_name = extractCompanyName(ls);
  const vat_number = extractVat(t);
  let email = extractEmail(t, header.email);
  const phone = extractPhone(t, ls);
  const zipCity = extractZipCity(ls);
  const address = extractAddress(ls, zipCity.zip, zipCity.city);
  const headerName =
    header.first_name && header.last_name
      ? { first: header.first_name, last: header.last_name }
      : undefined;
  const name = extractName(ls, company_name, headerName, email);
  if (!email && name.first_name && name.last_name) {
    const host = extractWebsiteHost(t);
    if (host) email = emailFromNameAndHost(name.first_name, name.last_name, host);
  }

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
