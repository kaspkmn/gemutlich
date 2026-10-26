import type { Word } from "@/content/types";

/** Lowercase, fold umlauts/ß, drop punctuation and "..." so "Strasse" matches "Straße". */
export function norm(s: string): string {
  return s
    .normalize("NFC")
    .toLowerCase()
    .replace(/ß/g, "ss")
    .replace(/ä/g, "ae")
    .replace(/ö/g, "oe")
    .replace(/ü/g, "ue")
    .replace(/\.\.\.|…/g, " ")
    .replace(/[.,!?¿¡;:"'’‘()\-]/g, "")
    .replace(/\s+/g, " ")
    .trim();
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

const ARTICLES = ["der", "die", "das"];

function typoAllowance(s: string) {
  return s.replace(/ /g, "").length >= 6 ? 1 : 0;
}

/** Check a typed German answer against a word (handles articles, umlauts, small typos). */
export function checkWord(input: string, word: Pick<Word, "de" | "alts" | "type" | "gender">): CheckResult {
  const n = norm(input);
  if (!n) return { status: "wrong" };
  const candidates = [word.de, ...(word.alts ?? [])].map(norm);
  if (candidates.includes(n)) return { status: "correct" };

  if (word.type === "noun") {
    const [article, ...rest] = norm(word.de).split(" ");
    const bare = rest.join(" ");
    const parts = n.split(" ");
    if (n === bare || lev(n, bare) <= typoAllowance(bare)) {
      return { status: "almost", message: `Don't forget the article: ${word.de}` };
    }
    if (parts.length >= 2 && ARTICLES.includes(parts[0])) {
      const typedBare = parts.slice(1).join(" ");
      if (typedBare === bare || lev(typedBare, bare) <= typoAllowance(bare)) {
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
  for (const c of cands) {
    if (c.length >= 10 && lev(n, c) <= 1) return { status: "typo", message: `Watch the spelling: ${answers[0]}` };
  }
  return { status: "wrong" };
}

/** Split a sentence into tiles for sentence building. */
export function tokens(sentence: string): string[] {
  return sentence
    .replace(/[.,!?]/g, "")
    .split(/\s+/)
    .filter(Boolean);
}
