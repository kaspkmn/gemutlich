import type { Exercise } from "./exercises";
import { VERBS } from "@/content/verbs";

// ── skills ─────────────────────────────────────────────────────────────────

export type Skill = "vocab" | "spelling" | "gender" | "verbs" | "cases" | "wordorder" | "listening" | "numbers" | "speaking";

export const SKILLS: { id: Skill; label: string; blurb: string }[] = [
  { id: "vocab", label: "Word meanings", blurb: "Knowing what words mean, in both directions" },
  { id: "spelling", label: "Writing words", blurb: "Typing German words from memory" },
  { id: "gender", label: "der, die, das", blurb: "Knowing each noun's gender" },
  { id: "verbs", label: "Verb forms", blurb: "Endings, past tense, separable verbs" },
  { id: "cases", label: "Articles & cases", blurb: "den, dem, einen, mir, zum and friends" },
  { id: "wordorder", label: "Sentence structure", blurb: "Putting words in the right order" },
  { id: "listening", label: "Listening", blurb: "Understanding and writing what you hear" },
  { id: "numbers", label: "Numbers & time", blurb: "Prices, clock times, ages, phone numbers" },
  { id: "speaking", label: "Speaking", blurb: "Saying it out loud so you're understood" },
];

export const skillLabel = (s: Skill) => SKILLS.find((x) => x.id === s)?.label ?? s;

const CASE_WORD = /^(der|die|das|den|dem|des|ein|eine|einen|einem|einer|kein|keine|keinen|mein|meine|meinen|dein|deine|im|am|zum|zur|ins|ihn|ihm|mir|mich|dir|dich|uns|euch)$/i;
const VERB_FORMS = new Set(VERBS.flatMap((v) => [v.inf, ...v.forms]).map((f) => f.toLowerCase()));
const UNIT_SKILL: Record<string, Skill> = {
  numbers: "numbers",
  time: "numbers",
  sein: "verbs",
  verbs: "verbs",
  modals: "verbs",
  separable: "verbs",
  "perfekt-haben": "verbs",
  "perfekt-sein": "verbs",
  articles: "cases",
  accusative: "cases",
  dative: "cases",
  "dative-pronouns": "cases",
  "at-home": "cases",
  negation: "cases",
  because: "wordorder",
};

export function skillOf(ex: Exercise): Skill {
  switch (ex.kind) {
    case "mc":
    case "typeEn":
    case "match":
      return "vocab";
    case "type":
      return "spelling";
    case "gender":
      return "gender";
    case "conj":
      return "verbs";
    case "listen":
    case "dictation":
      return "listening";
    case "build":
      return "wordorder";
    case "fill":
    case "fillType": {
      const a = ex.answer.trim();
      if (CASE_WORD.test(a)) return "cases";
      if (VERB_FORMS.has(a.toLowerCase()) || /^ge\w+(t|en)$/.test(a)) return "verbs";
      return (ex.unitId && UNIT_SKILL[ex.unitId]) || "vocab";
    }
    case "choice":
      return (ex.unitId && UNIT_SKILL[ex.unitId]) || "vocab";
  }
}

// ── the notebook ───────────────────────────────────────────────────────────

/** How many right answers in a row take a question out of the notebook. */
export const FIX_TARGET = 3;
const MAX_ENTRIES = 400;
const RECENT = 40;

export interface MistakeEntry {
  ex: Exercise;
  misses: number;
  /** right answers in a row since the last miss */
  fixed: number;
  first: number;
  last: number;
}

export interface SkillStat {
  n: number;
  ok: number;
  /** last answers, "1" right, "0" wrong, newest last */
  recent: string;
}

/** A stable id for "this question", regardless of when it was generated. */
export function mistakeKey(ex: Exercise): string | null {
  switch (ex.kind) {
    case "mc":
      return `mc:${ex.dir}:${ex.word.id}`;
    case "listen":
      return `listen:${ex.word.id}`;
    case "type":
      return `type:${ex.word.id}`;
    case "typeEn":
      return `typeEn:${ex.word.id}`;
    case "gender":
      return `gender:${ex.word.id}`;
    case "fill":
    case "fillType":
      return `fill:${ex.de}`;
    case "choice":
      return `choice:${ex.q}`;
    case "build":
      return `build:${ex.de}`;
    case "dictation":
      return `dict:${ex.de}`;
    case "conj":
      return `conj:${ex.verb.inf}:${ex.person}`;
    case "match":
      return null;
  }
}

export interface Tracked {
  mistakes: Record<string, MistakeEntry>;
  skills: Record<string, SkillStat>;
  mastered: number;
}

export function bumpSkill(skills: Record<string, SkillStat>, skill: Skill, correct: boolean): Record<string, SkillStat> {
  const prev = skills[skill] ?? { n: 0, ok: 0, recent: "" };
  return {
    ...skills,
    [skill]: {
      n: prev.n + 1,
      ok: prev.ok + (correct ? 1 : 0),
      recent: (prev.recent + (correct ? "1" : "0")).slice(-RECENT),
    },
  };
}

/** Record one answer: update the skill, and add to or work down the notebook. */
export function applyAnswer(t: Tracked, ex: Exercise, correct: boolean): Tracked {
  const skills = bumpSkill(t.skills, skillOf(ex), correct);
  const key = mistakeKey(ex);
  if (!key) return { ...t, skills };
  const now = Date.now();
  const entry = t.mistakes[key];
  const mistakes = { ...t.mistakes };
  let mastered = t.mastered;

  if (correct) {
    if (!entry) return { ...t, skills };
    if (entry.fixed + 1 >= FIX_TARGET) {
      delete mistakes[key];
      mastered++;
    } else {
      mistakes[key] = { ...entry, fixed: entry.fixed + 1, last: now };
    }
  } else {
    // store without the generated id
    const stored = { ...ex, id: "" } as Exercise;
    mistakes[key] = entry
      ? { ...entry, ex: stored, misses: entry.misses + 1, fixed: 0, last: now }
      : { ex: stored, misses: 1, fixed: 0, first: now, last: now };
    const keys = Object.keys(mistakes);
    if (keys.length > MAX_ENTRIES) {
      keys.sort((a, b) => mistakes[a].last - mistakes[b].last);
      for (const k of keys.slice(0, keys.length - MAX_ENTRIES)) delete mistakes[k];
    }
  }
  return { mistakes, skills, mastered };
}

/** Recent accuracy for a skill, or undefined with too few answers to say. */
export function skillAccuracy(s: SkillStat | undefined, min = 8): number | undefined {
  if (!s || s.recent.length < min) return undefined;
  const ok = [...s.recent].filter((c) => c === "1").length;
  return ok / s.recent.length;
}

/** Notebook entries to practice: most-missed first, then oldest. */
export function pickMistakes(m: Record<string, MistakeEntry>, n: number, skill?: Skill): MistakeEntry[] {
  return Object.values(m)
    .filter((e) => !skill || skillOf(e.ex) === skill)
    .sort((a, b) => b.misses - a.misses || a.last - b.last)
    .slice(0, n);
}
