import { UNITS } from "@/content/course";
import type { CourseWord } from "@/content/types";
import { dayKey } from "./dates";
import { cloneExercise, practiceExercises, shuffle, type Exercise } from "./exercises";
import { findWord, type AppState } from "./state";
import { SKILLS, pickMistakes, skillAccuracy, type Skill } from "./mistakes";
import { practiceForSkill } from "./skill-practice";
import { speakItemsFor } from "./speak-items";
import type { SpeakItem } from "@/components/SpeakRunner";

export type Stage =
  | { kind: "cards"; label: string; ids: string[] }
  | { kind: "mistakes"; label: string; ex: Exercise[] }
  | { kind: "focus"; label: string; ex: Exercise[] }
  | { kind: "speak"; label: string; items: SpeakItem[] };

const MAX_CARDS = 15;

/** The weakest skill with enough answers to judge, if it's below 85%. */
export function weakestSkill(state: AppState): Skill | undefined {
  let worst: { s: Skill; acc: number } | undefined;
  for (const { id } of SKILLS) {
    if (id === "numbers" || id === "speaking") continue;
    const acc = skillAccuracy(state.skills[id]);
    if (acc !== undefined && acc < 0.85 && (!worst || acc < worst.acc)) worst = { s: id, acc };
  }
  return worst?.s;
}

/** A 10 to 15 minute session built from what's due and what's weak. */
export function planSession(state: AppState): Stage[] {
  const today = dayKey();
  const doneUnits = UNITS.filter((u) => state.units[u.id]?.completed).map((u) => u.id);
  const deck = Object.keys(state.cards).map((id) => findWord(state, id)).filter(Boolean) as CourseWord[];
  const stages: Stage[] = [];

  const due = shuffle(Object.entries(state.cards).filter(([, c]) => c.due <= today).map(([id]) => id)).slice(0, MAX_CARDS);
  if (due.length) stages.push({ kind: "cards", label: `${due.length} flashcards`, ids: due });

  const mistakes = pickMistakes(state.mistakes, 6).map((m) => cloneExercise(m.ex));
  if (mistakes.length) stages.push({ kind: "mistakes", label: `${mistakes.length} mistakes to fix`, ex: mistakes });

  if (doneUnits.length) {
    const weak = weakestSkill(state);
    if (weak) {
      const ex = practiceForSkill(weak, deck, doneUnits, {}, 6);
      if (ex.length) stages.push({ kind: "focus", label: `${SKILLS.find((s) => s.id === weak)!.label.toLowerCase()} practice`, ex });
    } else if (deck.length >= 4) {
      const ex = practiceExercises("mixed", deck, doneUnits, 6).slice(0, 6);
      if (ex.length) stages.push({ kind: "focus", label: "a quick practice round", ex });
    }
    stages.push({ kind: "speak", label: "4 things to say out loud", items: speakItemsFor("sentences", deck, doneUnits, 4) });
  }
  return stages;
}

/** What comes after the session: the next lesson or something to read. */
export function nextStep(state: AppState): { href: string; label: string } {
  const next = UNITS.find((u) => !state.units[u.id]?.completed);
  if (next) return { href: `/learn/${next.id}`, label: `Lesson ${next.n}: ${next.title}` };
  return { href: "/read", label: "Read a story" };
}
