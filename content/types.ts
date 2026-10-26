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

export type Drill =
  | { t: "fill"; de: string; en: string; answer: string; options: string[] }
  | { t: "build"; de: string; en: string }
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
}

export interface CourseWord extends Word {
  id: string;
  unitId: string;
  custom?: boolean;
}
