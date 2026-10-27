import { ALL_SENTENCES, UNITS, getUnit } from "@/content/course";
import type { CourseWord } from "@/content/types";
import { VERBS } from "@/content/verbs";
import {
  Exercise,
  buildExercise,
  conjExercise,
  dictationExercise,
  drillExercises,
  genderExercise,
  genderable,
  listenExercise,
  mcExercise,
  shuffle,
  typeEnExercise,
  typeExercise,
  typeable,
  typeableEn,
} from "./exercises";
import { tokens } from "./answers";

export type QType = "choice" | "written" | "listening" | "build";

export const QTYPES: { id: QType; label: string; blurb: string }[] = [
  { id: "choice", label: "Multiple choice", blurb: "Meanings, der/die/das, grammar questions, fill the gap" },
  { id: "written", label: "Written", blurb: "Type the German, type the English, fill the gap, verb endings" },
  { id: "listening", label: "Listening", blurb: "Pick what you heard, or type it (needs sound)" },
  { id: "build", label: "Sentence building", blurb: "Put the words in the right order" },
];

const ALL_TYPES: QType[] = ["choice", "written", "listening", "build"];

export interface TestSpec {
  id: string;
  title: string;
  subtitle?: string;
  units: string[];
  count: number;
  types: QType[];
  timed: boolean;
}

// ── the fixed tests ────────────────────────────────────────────────────────

export interface Boss {
  n: number;
  title: string;
  titleDe: string;
  units: string[];
}

export const BOSSES: Boss[] = [
  { n: 1, title: "First words", titleDe: "Die ersten Wörter", units: UNITS.slice(0, 4).map((u) => u.id) },
  { n: 2, title: "Me and mine", titleDe: "Ich und meine Welt", units: UNITS.slice(4, 8).map((u) => u.id) },
  { n: 3, title: "Day to day", titleDe: "Der Alltag", units: UNITS.slice(8, 12).map((u) => u.id) },
  { n: 4, title: "Grammar gauntlet", titleDe: "Die Grammatik", units: UNITS.slice(12, 16).map((u) => u.id) },
];

export const FINAL_ID = "final";

export function unitTestSpec(unitId: string): TestSpec | null {
  const u = getUnit(unitId);
  if (!u) return null;
  return {
    id: `unit:${u.id}`,
    title: `Lesson ${u.n} test`,
    subtitle: u.title,
    units: [u.id],
    count: 15,
    types: ALL_TYPES,
    timed: false,
  };
}

export function bossSpec(n: number): TestSpec | null {
  const b = BOSSES.find((x) => x.n === n);
  if (!b) return null;
  const first = getUnit(b.units[0])!.n;
  const last = getUnit(b.units[b.units.length - 1])!.n;
  return {
    id: `boss:${b.n}`,
    title: `Boss ${b.n}: ${b.title}`,
    subtitle: `Lessons ${first} to ${last}`,
    units: b.units,
    count: 25,
    types: ALL_TYPES,
    timed: true,
  };
}

export function finalSpec(): TestSpec {
  return {
    id: FINAL_ID,
    title: "Final exam",
    subtitle: `All ${UNITS.length} lessons`,
    units: UNITS.map((u) => u.id),
    count: 40,
    types: ALL_TYPES,
    timed: true,
  };
}

/** Read a test from the URL: ?id=unit:food, ?id=boss:2, ?id=final, or ?id=custom&units=...&n=...&types=...&timer=1 */
export function specFromParams(p: URLSearchParams): TestSpec | null {
  const id = p.get("id") ?? "";
  if (id.startsWith("unit:")) return unitTestSpec(id.slice(5));
  if (id.startsWith("boss:")) return bossSpec(Number(id.slice(5)));
  if (id === FINAL_ID) return finalSpec();
  if (id === "custom") {
    const units = (p.get("units") ?? "").split(",").filter((u) => getUnit(u));
    const types = (p.get("types") ?? "").split(",").filter((t): t is QType => ALL_TYPES.includes(t as QType));
    const count = Math.min(60, Math.max(5, Number(p.get("n")) || 20));
    if (!units.length || !types.length) return null;
    return {
      id: "custom",
      title: "Custom test",
      subtitle: units.length === 1 ? getUnit(units[0])!.title : `${units.length} lessons`,
      units,
      count,
      types,
      timed: p.get("timer") === "1",
    };
  }
  return null;
}

export function customHref(units: string[], count: number, types: QType[], timed: boolean): string {
  const q = new URLSearchParams({ id: "custom", units: units.join(","), n: String(count), types: types.join(","), timer: timed ? "1" : "0" });
  return `/test/run?${q.toString()}`;
}

// ── building the questions ─────────────────────────────────────────────────

interface Maker {
  /** what the question is about, so the same word isn't asked twice */
  key: string;
  make: () => Exercise;
}

const WEIGHT: Record<QType, number> = { choice: 4, written: 4, listening: 2, build: 2 };

export function buildTest(spec: TestSpec): Exercise[] {
  const units = UNITS.filter((u) => spec.units.includes(u.id));
  const words: CourseWord[] = units.flatMap((u) => u.words.map((w) => ({ ...w, id: w.de, unitId: u.id })));
  const verbs = VERBS.filter((v) => spec.units.includes(v.unitId));
  const sentences = ALL_SENTENCES.filter((s) => spec.units.includes(s.unitId));

  const pools: Record<QType, Maker[]> = { choice: [], written: [], listening: [], build: [] };

  for (const w of words) {
    pools.choice.push({ key: w.id, make: () => mcExercise(w, "de-en", words) });
    pools.choice.push({ key: w.id, make: () => mcExercise(w, "en-de", words) });
    if (genderable(w)) pools.choice.push({ key: w.id, make: () => genderExercise(w) });
    // one written question per word: usually English → German, sometimes German → English
    if (typeable(w) || typeableEn(w)) {
      pools.written.push({
        key: w.id,
        make: () => (typeable(w) && (!typeableEn(w) || Math.random() < 0.65) ? typeExercise(w) : typeEnExercise(w)),
      });
    }
    pools.listening.push({ key: w.id, make: () => listenExercise(w, words) });
    if (typeable(w) && w.type !== "noun") pools.listening.push({ key: w.id, make: () => dictationExercise(w.de, w.en) });
  }

  for (const u of units) {
    u.drills.forEach((d, i) => {
      const key = `${u.id}#${i}`;
      if (d.t === "fill") {
        pools.choice.push({ key, make: () => drillExercises({ ...u, drills: [d] })[0] });
        pools.written.push({ key, make: () => drillExercises({ ...u, drills: [d] }, true)[0] });
      } else if (d.t === "choice") {
        pools.choice.push({ key, make: () => drillExercises({ ...u, drills: [d] })[0] });
      }
    });
  }

  for (const v of verbs) {
    for (let i = 0; i < 2; i++) pools.written.push({ key: `verb:${v.inf}:${i}`, make: () => conjExercise(v) });
  }

  const allSentenceText = sentences.map((s) => s.de);
  for (const s of sentences) {
    const len = tokens(s.de).length;
    if (len >= 3 && len <= 8) {
      pools.build.push({ key: `s:${s.de}`, make: () => buildExercise(s.de, s.en, allSentenceText.filter((x) => x !== s.de)) });
    }
    if (len <= 7) pools.listening.push({ key: `s:${s.de}`, make: () => dictationExercise(s.de, s.en) });
  }

  // How many of each type: split by weight, then top up from whatever has questions left.
  const types = spec.types.filter((t) => pools[t].length);
  if (!types.length) return [];
  const totalWeight = types.reduce((n, t) => n + WEIGHT[t], 0);
  const want: Record<QType, number> = { choice: 0, written: 0, listening: 0, build: 0 };
  let assigned = 0;
  for (const t of types) {
    want[t] = Math.floor((spec.count * WEIGHT[t]) / totalWeight);
    assigned += want[t];
  }
  for (let i = 0; assigned < spec.count; i++, assigned++) want[types[i % types.length]]++;

  const used = new Set<string>();
  const shuffled: Record<QType, Maker[]> = {
    choice: shuffle(pools.choice),
    written: shuffle(pools.written),
    listening: shuffle(pools.listening),
    build: shuffle(pools.build),
  };

  const takeFrom = (t: QType, allowRepeat: boolean): Exercise | null => {
    const list = shuffled[t];
    const idx = list.findIndex((m) => allowRepeat || !used.has(m.key));
    if (idx < 0) return null;
    const [m] = list.splice(idx, 1);
    used.add(m.key);
    return m.make();
  };

  const out: Exercise[] = [];
  for (const t of types) {
    for (let i = 0; i < want[t]; i++) {
      const ex = takeFrom(t, false) ?? takeFrom(t, true);
      if (ex) out.push(ex);
    }
  }
  // top up if a type ran dry
  let guard = 0;
  while (out.length < spec.count && guard++ < spec.count * 4) {
    const t = types[guard % types.length];
    const ex = takeFrom(t, false) ?? takeFrom(t, true);
    if (ex) out.push(ex);
    if (types.every((x) => !shuffled[x].length)) break;
  }

  // Mix the formats together.
  return shuffle(out);
}

export function xpForTest(correct: number, total: number): number {
  const pass = total > 0 && correct / total >= 0.7;
  return correct * 3 + (pass ? 25 : 0);
}
