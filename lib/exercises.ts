import { ALL_WORDS, ALL_SENTENCES, UNITS } from "@/content/course";
import type { CourseWord, Unit } from "@/content/types";
import { VERBS, type Verb } from "@/content/verbs";
import { tokens } from "./answers";

export type Exercise =
  | { kind: "mc"; id: string; dir: "de-en" | "en-de"; word: CourseWord; options: string[]; answer: string }
  | { kind: "listen"; id: string; word: CourseWord; options: string[] }
  | { kind: "type"; id: string; word: CourseWord }
  | { kind: "typeEn"; id: string; word: CourseWord }
  | { kind: "gender"; id: string; word: CourseWord }
  | { kind: "match"; id: string; words: CourseWord[] }
  | { kind: "fill"; id: string; de: string; en: string; answer: string; options: string[] }
  | { kind: "fillType"; id: string; de: string; en: string; answer: string }
  | { kind: "build"; id: string; de: string; en: string; tiles: string[] }
  | { kind: "choice"; id: string; q: string; answer: string; options: string[]; explain?: string }
  | { kind: "dictation"; id: string; de: string; en: string }
  | { kind: "conj"; id: string; verb: Verb; person: number; pronoun: string };

let counter = 0;
export const uid = (p: string) => `${p}-${Date.now().toString(36)}-${(counter++).toString(36)}`;

export function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export const sample = <T,>(arr: T[], n: number): T[] => shuffle(arr).slice(0, n);

const pick = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

/** Wrong options that look like the right kind of answer. */
function distractors(word: CourseWord, field: "de" | "en", n: number, pool: CourseWord[]): string[] {
  const seen = new Set([word[field].toLowerCase()]);
  const sameType = shuffle(pool.filter((w) => w.type === word.type && w.id !== word.id));
  const sameTypeAll = shuffle(ALL_WORDS.filter((w) => w.type === word.type && w.id !== word.id));
  const anything = shuffle(ALL_WORDS.filter((w) => w.id !== word.id));
  const out: string[] = [];
  for (const w of [...sameType, ...sameTypeAll, ...anything]) {
    const v = w[field];
    if (seen.has(v.toLowerCase())) continue;
    seen.add(v.toLowerCase());
    out.push(v);
    if (out.length >= n) break;
  }
  return out;
}

// ── single-exercise builders ───────────────────────────────────────────────

export function mcExercise(word: CourseWord, dir: "de-en" | "en-de", pool: CourseWord[]): Exercise {
  const field = dir === "de-en" ? "en" : "de";
  const answer = word[field];
  return { kind: "mc", id: uid("mc"), dir, word, answer, options: shuffle([answer, ...distractors(word, field, 3, pool)]) };
}

export function listenExercise(word: CourseWord, pool: CourseWord[]): Exercise {
  return { kind: "listen", id: uid("ls"), word, options: shuffle([word.de, ...distractors(word, "de", 3, pool)]) };
}

export const typeExercise = (word: CourseWord): Exercise => ({ kind: "type", id: uid("ty"), word });
export const typeEnExercise = (word: CourseWord): Exercise => ({ kind: "typeEn", id: uid("te"), word });
export const genderExercise = (word: CourseWord): Exercise => ({ kind: "gender", id: uid("gd"), word });
export const dictationExercise = (de: string, en: string): Exercise => ({ kind: "dictation", id: uid("dc"), de, en });

export const typeable = (w: CourseWord) => !w.noType && w.de.length <= 40;
export const typeableEn = (w: CourseWord) => w.en.length <= 40;
export const genderable = (w: CourseWord) => w.type === "noun" && w.gender !== "pl" && /^(der|die|das) /.test(w.de);

export function buildExercise(de: string, en: string, others: string[]): Exercise {
  const toks = tokens(de);
  const extra = shuffle(
    others.flatMap((s) => tokens(s)).filter((t) => !toks.some((x) => x.toLowerCase() === t.toLowerCase()))
  );
  const distract = [...new Set(extra)].slice(0, toks.length > 6 ? 2 : 3);
  return { kind: "build", id: uid("bd"), de, en, tiles: shuffle([...toks, ...distract]) };
}

const PRONOUNS: string[][] = [["ich"], ["du"], ["er", "sie", "es"], ["wir"], ["ihr"], ["sie (they)", "Sie"]];

export function conjExercise(verb: Verb): Exercise {
  const person = Math.floor(Math.random() * 6);
  return { kind: "conj", id: uid("cj"), verb, person, pronoun: pick(PRONOUNS[person]) };
}

/** A lesson's hand-written drills as exercises. Fill drills can be tapped or typed. */
export function drillExercises(unit: Unit, typedFill = false): Exercise[] {
  const sentences = unit.drills.flatMap((d) => (d.t === "build" ? [d.de] : d.t === "fill" ? [d.de.replace("___", d.answer)] : []));
  return unit.drills.map((d) => {
    if (d.t === "fill") {
      return typedFill
        ? { kind: "fillType", id: uid("ft"), de: d.de, en: d.en, answer: d.answer }
        : { kind: "fill", id: uid("fl"), de: d.de, en: d.en, answer: d.answer, options: shuffle(d.options) };
    }
    if (d.t === "build") return buildExercise(d.de, d.en, sentences.filter((s) => s !== d.de));
    return { kind: "choice", id: uid("ch"), q: d.q, answer: d.answer, options: shuffle(d.options), explain: d.explain };
  });
}

// ── rounds ─────────────────────────────────────────────────────────────────

/** A full practice round for one lesson. */
export function lessonExercises(unit: Unit): Exercise[] {
  const words: CourseWord[] = unit.words.map((w) => ({ ...w, id: w.de, unitId: unit.id }));
  const deck = shuffle(words);
  const take = (n: number, filter: (w: CourseWord) => boolean = () => true) => {
    const chosen = deck.filter(filter).slice(0, n);
    // rotate so the next pick favors different words
    for (const c of chosen) deck.push(deck.splice(deck.indexOf(c), 1)[0]);
    return chosen;
  };

  const intro = take(3).map((w) => mcExercise(w, "de-en", words));
  const listen = take(2).map((w) => listenExercise(w, words));
  const reverse = take(3).map((w) => mcExercise(w, "en-de", words));
  const match: Exercise = { kind: "match", id: uid("mt"), words: sample(words, Math.min(5, words.length)) };
  const more = take(2).map((w) => mcExercise(w, "de-en", words));
  const genders = take(3, genderable).map(genderExercise);
  const drills = shuffle(drillExercises(unit)).slice(0, 7);
  const typing = take(4, typeable).map(typeExercise);

  return [...intro, ...listen, ...reverse.slice(0, 2), match, ...more, ...genders, ...reverse.slice(2), ...drills, ...typing];
}

export type PracticeMode = "mixed" | "weak" | "listen" | "gender" | "type" | "dictation" | "conj" | "sentences";

/** Practice rounds drawn from words in the learner's flashcard deck and finished lessons. */
export function practiceExercises(mode: PracticeMode, words: CourseWord[], doneUnits: string[], size = 12): Exercise[] {
  const pool = words.length >= 4 ? words : ALL_WORDS.filter((w) => doneUnits.includes(w.unitId));
  const units = UNITS.filter((u) => doneUnits.includes(u.id));

  switch (mode) {
    case "listen":
      return sample(pool, size).map((w) => listenExercise(w, pool));
    case "gender":
      return sample(pool.filter(genderable), size + 3).map(genderExercise);
    case "type": {
      // mostly English → German, with some German → English mixed in
      const ws = sample(pool.filter(typeable), size);
      return ws.map((w, i) => (i % 3 === 2 && typeableEn(w) ? typeEnExercise(w) : typeExercise(w)));
    }
    case "dictation": {
      const sentences = ALL_SENTENCES.filter((s) => doneUnits.includes(s.unitId));
      const fromWords = sample(pool.filter((w) => typeable(w) && w.type !== "noun"), 3).map((w) => ({ de: w.de, en: w.en }));
      const items = [...sample(sentences, size - fromWords.length), ...fromWords];
      return shuffle(items).map((s) => dictationExercise(s.de, s.en));
    }
    case "conj": {
      const verbs = VERBS.filter((v) => doneUnits.includes(v.unitId));
      const list = verbs.length ? verbs : VERBS.filter((v) => ["intro", "sein"].includes(v.unitId));
      return Array.from({ length: size }, () => conjExercise(pick(list)));
    }
    case "sentences": {
      return shuffle(units.flatMap((u) => drillExercises(u, Math.random() < 0.5))).slice(0, size);
    }
    case "weak":
    case "mixed":
    default: {
      const ex: Exercise[] = [];
      const ws = shuffle(pool);
      ws.slice(0, 4).forEach((w) => ex.push(mcExercise(w, "de-en", pool)));
      ws.slice(4, 6).forEach((w) => ex.push(listenExercise(w, pool)));
      ws.slice(6, 9).forEach((w) => ex.push(mcExercise(w, "en-de", pool)));
      if (ws.length >= 5) ex.push({ kind: "match", id: uid("mt"), words: sample(ws, 5) });
      ws.filter(genderable).slice(0, 2).forEach((w) => ex.push(genderExercise(w)));
      ws.slice(9).filter(typeable).slice(0, 3).forEach((w) => ex.push(typeExercise(w)));
      if (mode === "mixed" && units.length) ex.push(...sample(units.flatMap((u) => drillExercises(u)), 2));
      return ex.slice(0, size + 2);
    }
  }
}

/** The word an exercise is about, if any (used to add missed words to flashcards). */
export function exerciseWord(ex: Exercise): CourseWord | undefined {
  if ("word" in ex) return ex.word;
  return undefined;
}

/** A fresh copy of an exercise with a new id, for retrying. */
export function cloneExercise(ex: Exercise): Exercise {
  return { ...ex, id: uid("re") } as Exercise;
}
