import type { Word } from "@/content/types";
import { IS_ES } from "./lang";

/**
 * Lowercase and drop punctuation and "...".
 * German: fold umlauts/ß so "Strasse" matches "Straße".
 * Spanish: accents are kept here (see `fold`), so a missing accent can be pointed out.
 */
export function norm(s: string): string {
  let t = s.normalize("NFC").toLowerCase();
  if (!IS_ES) t = t.replace(/ß/g, "ss").replace(/ä/g, "ae").replace(/ö/g, "oe").replace(/ü/g, "ue");
  return t
    .replace(/\.\.\.|…/g, " ")
    .replace(/[.,!?¿¡;:"'’‘()\-]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

/** norm() without accents: "está" → "esta", "niño" → "nino". */
export function fold(s: string): string {
  return norm(s)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .normalize("NFC");
}

/** Right apart from accents or ñ (Spanish only; German umlauts are already folded by norm). */
export function onlyAccents(input: string, answer: string): boolean {
  return IS_ES && norm(input) !== norm(answer) && fold(input) === fold(answer);
}

export function lev(a: string, b: string): number {
  if (a === b) return 0;
  if (!a.length) return b.length;
  if (!b.length) return a.length;
  let prev = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    const cur = [i];
    for (let j = 1; j <= b.length; j++) {
      cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
    }
    prev = cur;
  }
  return prev[b.length];
}

export type CheckStatus = "correct" | "typo" | "almost" | "wrong";

export interface CheckResult {
  status: CheckStatus;
  message?: string;
}

const ARTICLES = IS_ES ? ["el", "la", "los", "las"] : ["der", "die", "das"];
const accentMsg = (right: string) => `Watch the accents: ${right}`;

function typoAllowance(s: string) {
  return s.replace(/ /g, "").length >= 6 ? 1 : 0;
}

/** Check a typed answer against a word (handles articles, umlauts or accents, small typos). */
export function checkWord(input: string, word: Pick<Word, "de" | "alts" | "type" | "gender">): CheckResult {
  const n = norm(input);
  if (!n) return { status: "wrong" };
  const candidates = [word.de, ...(word.alts ?? [])].map(norm);
  if (candidates.includes(n)) return { status: "correct" };
  if (IS_ES && [word.de, ...(word.alts ?? [])].some((c) => fold(c) === fold(input))) return { status: "typo", message: accentMsg(word.de) };

  if (word.type === "noun") {
    const [article, ...rest] = norm(word.de).split(" ");
    const bare = rest.join(" ");
    const parts = n.split(" ");
    if (fold(n) === fold(bare) || lev(n, bare) <= typoAllowance(bare)) {
      return { status: "almost", message: `Don't forget the article: ${word.de}` };
    }
    if (parts.length >= 2 && ARTICLES.includes(parts[0])) {
      const typedBare = parts.slice(1).join(" ");
      if (fold(typedBare) === fold(bare) || lev(typedBare, bare) <= typoAllowance(bare)) {
        if (parts[0] !== article) {
          return { status: "wrong", message: `Check the gender: it's ${word.de}` };
        }
        return { status: "typo", message: `Watch the spelling: ${word.de}` };
      }
    }
    return { status: "wrong" };
  }

  for (const c of candidates) {
    if (lev(n, c) <= typoAllowance(c)) return { status: "typo", message: `Watch the spelling: ${word.de}` };
  }
  return { status: "wrong" };
}

/** Check a typed form (conjugation, dictation sentence) against one or more answers. */
export function checkText(input: string, answers: string[]): CheckResult {
  const n = norm(input);
  if (!n) return { status: "wrong" };
  const cands = answers.map(norm);
  if (cands.includes(n)) return { status: "correct" };
  if (IS_ES && answers.some((a) => fold(a) === fold(input))) return { status: "typo", message: accentMsg(answers[0]) };
  for (const c of cands) {
    if (c.length >= 10 && lev(n, c) <= 1) return { status: "typo", message: `Watch the spelling: ${answers[0]}` };
  }
  return { status: "wrong" };
}

/** Split a sentence into tiles for sentence building. */
export function tokens(sentence: string): string[] {
  return sentence
    .replace(/[.,!?¿¡]/g, "")
    .split(/\s+/)
    .filter(Boolean);
}

// ── English answers ("what does this German word mean?") ──────────────────

function normEn(s: string): string {
  return s
    .toLowerCase()
    .replace(/\.\.\.|…/g, " ")
    .replace(/[.!?"'’‘]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

const LEADING = /^(to|a|an|the) /;

/** Every acceptable English answer: "big, tall" → ["big", "tall", ...]. */
export function englishVariants(en: string): string[] {
  const noParens = en.replace(/\([^)]*\)/g, " ");
  const parts = noParens.split(/[,/;?!]| or /);
  const out = new Set<string>();
  for (const p of [...parts, noParens]) {
    const n = normEn(p);
    if (!n) continue;
    out.add(n);
    out.add(n.replace(LEADING, ""));
  }
  return [...out];
}

export function checkEnglish(input: string, en: string): CheckResult {
  const n = normEn(input).replace(LEADING, "");
  if (!n) return { status: "wrong" };
  const variants = englishVariants(en);
  if (variants.includes(n)) return { status: "correct" };
  for (const v of variants) {
    if (v.length >= 5 && lev(n, v) <= 1) return { status: "typo", message: `Watch the spelling: ${en}` };
  }
  return { status: "wrong" };
}
