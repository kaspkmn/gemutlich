import type { CardState } from "./srs";
import type { MistakeEntry, SkillStat } from "./mistakes";
import type { CourseWord, Gender, WordType } from "@/content/types";
import { getCourseWord } from "@/content/course";
import type { Lang } from "./lang";

export interface UnitProgress {
  completed: boolean;
  best: number; // best accuracy 0..1
  times: number;
  last: number;
}

export interface CustomWord {
  de: string;
  en: string;
  type: WordType;
  gender?: Gender;
  added: string;
}

export type WritingMode = "translate" | "answer" | "journal" | "chat";
export type Verdict = "perfect" | "good" | "almost" | "needs_work" | "sent";

export interface WritingEntry {
  at: number;
  mode: WritingMode;
  prompt: string;
  text: string;
  corrected: string;
  verdict: Verdict;
  note?: string;
}

export interface TestRecord {
  at: number;
  /** "unit:food", "boss:1", "final" or "custom" */
  id: string;
  title: string;
  correct: number;
  total: number;
  seconds: number;
}

export interface Settings {
  dailyGoal: number;
  rate: number;
  voiceURI: string;
  direction: "de-en" | "en-de" | "mixed";
  autoplay: boolean;
  name: string;
}

/** Everything that belongs to one language. The language not being studied waits in `shelf`. */
export const LANG_FIELDS = ["units", "cards", "custom", "writing", "tests", "mistakes", "skills", "read", "stats"] as const;
export type LangData = Pick<AppState, (typeof LANG_FIELDS)[number]> & { voiceURI: string };

export interface AppState {
  version: 1;
  /** the language being studied */
  lang: Lang;
  /** progress for the other language(s), swapped in when switching */
  shelf: Partial<Record<Lang, LangData>>;
  updatedAt: number;
  xp: number;
  days: Record<string, number>;
  units: Record<string, UnitProgress>;
  cards: Record<string, CardState>;
  custom: Record<string, CustomWord>;
  writing: WritingEntry[];
  tests: TestRecord[];
  /** questions answered wrong, until answered right 3 times in a row */
  mistakes: Record<string, MistakeEntry>;
  /** accuracy per skill (genders, verb forms, listening...) */
  skills: Record<string, SkillStat>;
  /** stories and dialogues finished, by id */
  read: Record<string, number>;
  stats: { exercises: number; correct: number; reviews: number; written: number; mastered: number; spoken: number };
  settings: Settings;
}

export const DEFAULT_SETTINGS: Settings = {
  dailyGoal: 50,
  rate: 0.9,
  voiceURI: "",
  direction: "de-en",
  autoplay: true,
  name: "Kas",
};

export function emptyState(): AppState {
  return {
    version: 1,
    lang: "de",
    shelf: {},
    updatedAt: 0,
    xp: 0,
    days: {},
    units: {},
    cards: {},
    custom: {},
    writing: [],
    tests: [],
    mistakes: {},
    skills: {},
    read: {},
    stats: { exercises: 0, correct: 0, reviews: 0, written: 0, mastered: 0, spoken: 0 },
    settings: { ...DEFAULT_SETTINGS },
  };
}

/** Fill in anything missing from older or partial saves. */
export function hydrate(raw: unknown): AppState {
  const base = emptyState();
  if (!raw || typeof raw !== "object") return base;
  const r = raw as Partial<AppState>;
  return {
    ...base,
    ...r,
    version: 1,
    lang: r.lang === "es" ? "es" : "de",
    shelf: r.shelf && typeof r.shelf === "object" ? r.shelf : {},
    days: r.days ?? {},
    units: r.units ?? {},
    cards: r.cards ?? {},
    custom: r.custom ?? {},
    writing: Array.isArray(r.writing) ? r.writing : [],
    tests: Array.isArray(r.tests) ? r.tests : [],
    mistakes: r.mistakes ?? {},
    skills: r.skills ?? {},
    read: r.read ?? {},
    stats: { ...base.stats, ...(r.stats ?? {}) },
    settings: { ...DEFAULT_SETTINGS, ...(r.settings ?? {}) },
  };
}

/** Look up a word from the course or from the learner's saved words. */
export function findWord(state: AppState, id: string): CourseWord | undefined {
  const c = getCourseWord(id);
  if (c) return c;
  const w = state.custom[id];
  if (!w) return undefined;
  return { ...w, id, unitId: "custom", custom: true };
}

/** Best score (0..1) for a test id, or undefined if never taken. */
export function bestTest(state: AppState, id: string): number | undefined {
  let best: number | undefined;
  for (const t of state.tests) {
    if (t.id !== id || !t.total) continue;
    const s = t.correct / t.total;
    if (best === undefined || s > best) best = s;
  }
  return best;
}

function emptyLangData(): LangData {
  const e = emptyState();
  return { units: e.units, cards: e.cards, custom: e.custom, writing: e.writing, tests: e.tests, mistakes: e.mistakes, skills: e.skills, read: e.read, stats: e.stats, voiceURI: "" };
}

/** Put the current language's progress on the shelf and take out another's. XP, streak and settings stay shared. */
export function swapLanguage(s: AppState, to: Lang): AppState {
  if (s.lang === to) return s;
  const current: LangData = {
    units: s.units,
    cards: s.cards,
    custom: s.custom,
    writing: s.writing,
    tests: s.tests,
    mistakes: s.mistakes,
    skills: s.skills,
    read: s.read,
    stats: s.stats,
    voiceURI: s.settings.voiceURI,
  };
  const next = { ...emptyLangData(), ...(s.shelf[to] ?? {}) };
  const shelf = { ...s.shelf, [s.lang]: current };
  delete shelf[to];
  const { voiceURI, ...data } = next;
  return {
    ...s,
    ...data,
    stats: { ...emptyState().stats, ...data.stats },
    lang: to,
    shelf,
    settings: { ...s.settings, voiceURI },
  };
}
