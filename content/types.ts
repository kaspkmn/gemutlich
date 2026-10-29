export type Gender = "m" | "f" | "n" | "pl";
export type WordType = "noun" | "verb" | "phrase" | "adj" | "word" | "number";

export interface Word {
  /** German, nouns include their article ("der Hund") */
  de: string;
  en: string;
  type: WordType;
  gender?: Gender;
  plural?: string;
  /** other accepted German spellings when typing */
  alts?: string[];
  /** example sentence [German, English] */
  ex?: [string, string];
  /** pronunciation or usage note */
  note?: string;
  /** don't ask the learner to type this one (has "..." etc) */
  noType?: boolean;
}

export interface GrammarSection {
  title: string;
  body: string[];
  table?: { head: string[]; rows: string[][] };
  tip?: string;
}

/** `why` explains the answer; shown whenever it's answered wrong. */
export type Drill =
  | { t: "fill"; de: string; en: string; answer: string; options: string[]; why?: string }
  | { t: "build"; de: string; en: string; why?: string }
  | { t: "choice"; q: string; answer: string; options: string[]; explain?: string };

export interface Unit {
  id: string;
  n: number;
  title: string;
  titleDe: string;
  blurb: string;
  words: Word[];
  notes: GrammarSection[];
  drills: Drill[];
  /** German questions the learner answers in their own words [German, English] */
  prompts?: [string, string][];
  /** which skill this lesson's questions practice (for weak spots) */
  skill?: "verbs" | "cases" | "wordorder" | "numbers" | "vocab";
}

export interface CourseWord extends Word {
  id: string;
  unitId: string;
  custom?: boolean;
}

// ── stories ──

/** A gloss is either "meaning" or ["meaning", "dictionary form"]. */
export type Gloss = string | [string, string];

export interface Story {
  id: string;
  title: string;
  titleEn: string;
  /** unlocks after this lesson */
  after: string;
  blurb: string;
  /** [target language, English] sentences; null starts a new paragraph */
  lines: ([string, string] | null)[];
  gloss: Record<string, Gloss>;
  questions: { q: string; options: string[]; answer: string }[];
}

// ── listening ──

export interface DialogueLine {
  /** 0 = first speaker, 1 = second speaker */
  who: 0 | 1;
  de: string;
  en: string;
}

export interface Dialogue {
  id: string;
  title: string;
  /** unlocks after this lesson */
  after: string;
  setting: string;
  speakers: [string, string];
  lines: DialogueLine[];
  questions: { q: string; options: string[]; answer: string }[];
}

// ── verbs ──

export interface Verb {
  inf: string;
  en: string;
  unitId: string;
  forms: [string, string, string, string, string, string];
}

// ── writing chat ──

export interface ChatScenario {
  id: string;
  title: string;
  titleDe: string;
  blurb: string;
  opener: string;
  openerEn: string;
  role: string;
}
