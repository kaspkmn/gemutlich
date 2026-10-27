import { ALL_WORDS } from "@/content/course";
import { VERBS, PERSONS } from "@/content/verbs";
import type { Gloss, Story } from "@/content/stories";

export interface Lookup {
  /** the word as tapped */
  word: string;
  meaning: string;
  /** dictionary form to save as a flashcard */
  base: string;
  /** id of a course word, if this is one */
  courseId?: string;
}

/** Small, very common words that every story uses. */
const COMMON: Record<string, Gloss> = {
  der: "the (masculine)",
  die: "the (feminine or plural)",
  das: "the (neuter); also: that",
  den: "the (masculine object)",
  dem: "the (after mit, in, auf...)",
  des: "of the",
  ein: "a, an",
  eine: "a, an",
  einen: "a, an (masculine object)",
  einem: "a, an (after mit, in, auf...)",
  einer: "a, an (after mit, in, auf...)",
  kein: "no, not a",
  keine: "no, not a",
  keinen: "no, not a",
  mein: "my",
  meine: "my",
  meinen: "my",
  meinem: "my",
  meiner: "my",
  dein: "your",
  deine: "your",
  sein: "his; also: to be",
  seine: "his",
  ihr: "her; also: you all",
  ihre: "her, their",
  und: "and",
  aber: "but",
  oder: "or",
  ist: "is (sein)",
  sind: "are (sein)",
  bin: "am (sein)",
  bist: "are (sein)",
  hat: "has (haben)",
  habe: "have (haben)",
  hast: "have (haben)",
  haben: "have (haben)",
  ich: "I",
  du: "you",
  er: "he, it",
  sie: "she, it, they",
  Sie: "you (formal); she, they",
  es: "it",
  wir: "we",
  mich: "me",
  dich: "you",
  ihn: "him, it",
  im: "in the",
  am: "on the, at the",
  um: "at (a time), around",
  zum: "to the",
  zur: "to the",
  ins: "into the",
  nicht: "not",
  sehr: "very",
  auch: "also, too",
  so: "so",
  hier: "here",
  da: "there",
  ja: "yes",
  nein: "no",
  Deutsch: "German (the language)",
  Hunger: "hunger (Hunger haben = to be hungry)",
  Durst: "thirst (Durst haben = to be thirsty)",
  Rechnung: ["check, bill", "die Rechnung"],
  bisschen: "bit (ein bisschen = a little)",
  Mia: "Mia (a name)",
};

const lower = (s: string) => s.toLocaleLowerCase("de-DE");

/** exact-case keys (nouns are capitalized) and lowercase keys */
const EXACT = new Map<string, Lookup>();
const LOWER = new Map<string, Lookup>();

function add(key: string, l: Lookup, exact: boolean) {
  const map = exact ? EXACT : LOWER;
  const k = exact ? key : lower(key);
  if (!map.has(k)) map.set(k, l);
}

for (const w of ALL_WORDS) {
  if (w.type === "noun") {
    const m = /^(der|die|das) (.+)$/.exec(w.de);
    const bare = m ? m[2] : w.de;
    if (!bare.includes(" ")) add(bare, { word: bare, meaning: w.en, base: w.de, courseId: w.id }, true);
    if (w.plural) {
      const pm = /^die (.+)$/.exec(w.plural);
      const pl = pm ? pm[1] : w.plural;
      if (!pl.includes(" ")) {
        add(pl, { word: pl, meaning: `${w.en} (plural)`, base: w.de, courseId: w.id }, true);
        // dative plural adds -n: den Kindern
        if (!/[ns]$/.test(pl)) add(`${pl}n`, { word: `${pl}n`, meaning: `${w.en} (plural)`, base: w.de, courseId: w.id }, true);
      }
    }
  } else {
    const clean = w.de.replace(/[.!?,]/g, "").trim();
    if (!clean.includes(" ")) add(clean, { word: clean, meaning: w.en, base: w.de, courseId: w.id }, false);
  }
}

for (const v of VERBS) {
  add(v.inf, { word: v.inf, meaning: v.en, base: v.inf }, false);
  // group persons that share a form: isst → "du, er"
  const byForm = new Map<string, string[]>();
  v.forms.forEach((f, i) => {
    if (f === v.inf) return;
    const who = PERSONS[i].split(" / ")[0];
    byForm.set(f, [...(byForm.get(f) ?? []), who]);
  });
  for (const [f, who] of byForm) {
    const meaning = `${v.en.replace(/(^|, )to /g, "$1")} (${v.inf}, ${who.join("/")} form)`;
    const existing = LOWER.get(lower(f));
    if (existing && existing.base !== v.inf) {
      // e.g. weiß = white, and also "know" from wissen
      LOWER.set(lower(f), { ...existing, meaning: `${existing.meaning}; also: ${meaning}` });
    } else {
      add(f, { word: f, meaning, base: v.inf }, false);
    }
  }
}

function fromGloss(word: string, g: Gloss): Lookup {
  return Array.isArray(g) ? { word, meaning: g[0], base: g[1] } : { word, meaning: g, base: word };
}

for (const [k, g] of Object.entries(COMMON)) {
  // common words win for exact matches so "sein" reads as "his; also: to be"
  const l = fromGloss(k, g);
  if (k[0] === k[0].toUpperCase() && k[0] !== k[0].toLowerCase()) EXACT.set(k, l);
  else LOWER.set(k, l);
}

const ENDINGS = ["en", "em", "er", "es", "e", "n", "s"];

/** Look up a tapped word: story glossary first, then the course, then common endings. */
export function lookupWord(token: string, story?: Story): Lookup | null {
  const t = token.replace(/[„“"'’‚‘»«]/g, "");
  if (!t) return null;
  if (story) {
    const g = story.gloss[t] ?? story.gloss[lower(t)];
    if (g !== undefined) return fromGloss(t, g);
  }
  const exact = EXACT.get(t);
  if (exact) return { ...exact, word: t };
  const low = LOWER.get(lower(t));
  if (low) return { ...low, word: t };
  // a noun at the start of a sentence, or a capitalized word mid-sentence
  const cap = t[0].toUpperCase() + t.slice(1);
  const asNoun = EXACT.get(cap);
  if (asNoun) return { ...asNoun, word: t };
  // adjective and noun endings: großes → groß, Kindern → Kinder
  for (const e of ENDINGS) {
    if (t.length > e.length + 2 && lower(t).endsWith(e)) {
      const stem = t.slice(0, -e.length);
      const hit = LOWER.get(lower(stem)) ?? EXACT.get(stem) ?? EXACT.get(stem[0].toUpperCase() + stem.slice(1));
      if (hit) return { ...hit, word: t };
    }
  }
  return null;
}

/** Split a sentence into words and the bits between them. */
export function splitWords(sentence: string): { text: string; word: boolean }[] {
  const out: { text: string; word: boolean }[] = [];
  const re = /[A-Za-zÄÖÜäöüßéÉ]+(?:-[A-Za-zÄÖÜäöüßéÉ]+)*/g;
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(sentence))) {
    if (m.index > last) out.push({ text: sentence.slice(last, m.index), word: false });
    out.push({ text: m[0], word: true });
    last = m.index + m[0].length;
  }
  if (last < sentence.length) out.push({ text: sentence.slice(last), word: false });
  return out;
}
