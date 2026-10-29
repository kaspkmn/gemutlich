import { ALL_WORDS } from "@/content/course";
import { VERBS, PERSONS } from "@/content/verbs";
import type { Gloss, Story } from "@/content/stories";
import { IS_ES, L } from "./lang";

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
const DE_COMMON: Record<string, Gloss> = {
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

const ES_COMMON: Record<string, Gloss> = {
  el: "the (masculine)",
  la: "the (feminine); also: her, it",
  los: "the (masculine plural); also: them",
  las: "the (feminine plural); also: them",
  un: "a, an (masculine)",
  una: "a, an (feminine)",
  unos: "some",
  unas: "some",
  de: "of, from",
  del: "of the (de + el)",
  al: "to the (a + el)",
  a: "to, at",
  en: "in, on, at",
  y: "and",
  o: "or",
  pero: "but",
  que: "that, which; also: than",
  qué: "what",
  con: "with",
  sin: "without",
  por: "for, through, by",
  para: "for, in order to",
  mi: "my",
  mis: "my (plural)",
  tu: "your",
  tus: "your (plural)",
  tú: "you",
  su: "his, her, their, your (formal)",
  sus: "his, her, their (plural)",
  nuestro: "our",
  nuestra: "our",
  yo: "I",
  él: "he",
  ella: "she",
  usted: "you (formal)",
  nosotros: "we",
  ellos: "they",
  ellas: "they (all women)",
  ustedes: "you all",
  me: "me, to me, myself",
  te: "you, to you, yourself",
  se: "himself, herself, themselves",
  le: "to him, to her, to you",
  les: "to them",
  lo: "it, him",
  nos: "us, to us",
  es: "is (ser)",
  son: "are (ser)",
  soy: "am (ser)",
  eres: "are (ser)",
  está: "is (estar)",
  están: "are (estar)",
  estoy: "am (estar)",
  hay: "there is, there are",
  muy: "very",
  también: "also, too",
  no: "no, not",
  sí: "yes",
  si: "if",
  este: "this",
  esta: "this",
  esto: "this (thing)",
  eso: "that (thing)",
  ese: "that",
  esa: "that",
  aquí: "here",
  allí: "there",
  ya: "already, now",
  más: "more",
  todo: "all, everything",
  todos: "everyone, all",
  mucho: "a lot, much",
  muchos: "many",
  poco: "little (un poco = a little)",
  bien: "well, good",
  mal: "badly, bad",
  cuando: "when",
  como: "like, as",
  cómo: "how",
  porque: "because",
  hoy: "today",
  mí: "me (after a, para, de: para mí = for me)",
  ti: "you (after a, para, de: para ti = for you)",
  favor: "favor (por favor = please)",
  gusta: ["pleases (me gusta = I like)", "gustar"],
  gustan: ["please (me gustan = I like, for more than one thing)", "gustar"],
  encanta: ["delights (me encanta = I love)", "encantar"],
  hace: "makes, does (hacer); also: ago (hace dos días)",
  ahora: "now",
  luego: "then, later",
  después: "after, afterwards",
  entonces: "so, then",
};

const COMMON: Record<string, Gloss> = IS_ES ? ES_COMMON : DE_COMMON;

const lower = (s: string) => s.toLocaleLowerCase(L.bcp);

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
    const m = L.articleRe.exec(w.de);
    const bare = m ? m[2] : w.de;
    if (!bare.includes(" ")) add(bare, { word: bare, meaning: w.en, base: w.de, courseId: w.id }, !IS_ES);
    if (w.plural) {
      const pm = L.articleRe.exec(w.plural);
      const pl = pm ? pm[2] : w.plural;
      if (!pl.includes(" ")) {
        add(pl, { word: pl, meaning: `${w.en} (plural)`, base: w.de, courseId: w.id }, !IS_ES);
        // German dative plural adds -n: den Kindern
        if (!IS_ES && !/[ns]$/.test(pl)) add(`${pl}n`, { word: `${pl}n`, meaning: `${w.en} (plural)`, base: w.de, courseId: w.id }, true);
      }
    }
  } else {
    const clean = w.de.replace(/[.!?,¿¡]/g, "").trim();
    if (!clean.includes(" ")) add(clean, { word: clean, meaning: w.en.replace(/\s*\.\.\.$/, ""), base: w.de, courseId: w.id }, false);
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
  else {
    // Spanish: keep both meanings, e.g. como = "like, as" and "I eat"
    const before = LOWER.get(lower(k));
    const merge = IS_ES && before && before.base !== k && !l.meaning.includes(`(${before.base})`);
    LOWER.set(k, merge ? { ...l, meaning: `${l.meaning}; also: ${before!.meaning}` } : l);
  }
}

/** [ending to remove, what to put back]: großes → groß, rojas → rojo */
const ENDINGS: [string, string][] = IS_ES
  ? [["as", "o"], ["os", "o"], ["a", "o"], ["es", ""], ["s", ""], ["ita", "a"], ["ito", "o"]]
  : [["en", ""], ["em", ""], ["er", ""], ["es", ""], ["e", ""], ["n", ""], ["s", ""]];

/** Look up a tapped word: story glossary first, then the course, then common endings. */
export function lookupWord(token: string, story?: Story): Lookup | null {
  const t = token.replace(/[„“"'’‚‘»«¿¡]/g, "");
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
  for (const [e, back] of ENDINGS) {
    if (t.length > e.length + 2 && lower(t).endsWith(e)) {
      const stem = t.slice(0, -e.length) + back;
      const hit = LOWER.get(lower(stem)) ?? EXACT.get(stem) ?? EXACT.get(stem[0].toUpperCase() + stem.slice(1));
      if (hit) return { ...hit, word: t };
    }
  }
  return null;
}

/** Split a sentence into words and the bits between them. */
export function splitWords(sentence: string): { text: string; word: boolean }[] {
  const out: { text: string; word: boolean }[] = [];
  const re = /[A-Za-zÄÖÜäöüßáéíóúñÁÉÍÓÚÑ]+(?:-[A-Za-zÄÖÜäöüßáéíóúñÁÉÍÓÚÑ]+)*/g;
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
