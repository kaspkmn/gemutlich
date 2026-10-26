import type { CardState } from "./srs";
import type { CourseWord, Gender, WordType } from "@/content/types";
import { getCourseWord } from "@/content/course";

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
export type Verdict = "perfect" | "good" | "almost" | "needs_work";

export interface WritingEntry {
  at: number;
  mode: WritingMode;
  prompt: string;
  text: string;
  corrected: string;
  verdict: Verdict;
  note?: string;
}

export interface Settings {
  dailyGoal: number;
  rate: number;
  voiceURI: string;
  direction: "de-en" | "en-de" | "mixed";
  autoplay: boolean;
  theme: "system" | "light" | "dark";
  name: string;
}

export interface AppState {
  version: 1;
  updatedAt: number;
  xp: number;
  days: Record<string, number>;
  units: Record<string, UnitProgress>;
  cards: Record<string, CardState>;
  custom: Record<string, CustomWord>;
  writing: WritingEntry[];
  stats: { exercises: number; correct: number; reviews: number; written: number };
  settings: Settings;
}

export const DEFAULT_SETTINGS: Settings = {
  dailyGoal: 50,
  rate: 0.9,
  voiceURI: "",
  direction: "de-en",
  autoplay: true,
  theme: "system",
  name: "Kas",
};

export function emptyState(): AppState {
  return {
    version: 1,
    updatedAt: 0,
    xp: 0,
    days: {},
    units: {},
    cards: {},
    custom: {},
    writing: [],
    stats: { exercises: 0, correct: 0, reviews: 0, written: 0 },
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
    days: r.days ?? {},
    units: r.units ?? {},
    cards: r.cards ?? {},
    custom: r.custom ?? {},
    writing: Array.isArray(r.writing) ? r.writing : [],
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
