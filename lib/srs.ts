import { addDays, dayKey } from "./dates";

export interface CardState {
  ease: number;
  /** days until next review */
  interval: number;
  /** day key when the card is due */
  due: string;
  reps: number;
  lapses: number;
  added: string;
  last?: string;
}

export type Grade = "again" | "hard" | "good" | "easy";

export function newCard(): CardState {
  const today = dayKey();
  return { ease: 2.5, interval: 0, due: today, reps: 0, lapses: 0, added: today };
}

export function nextInterval(c: CardState, g: Grade): number {
  if (g === "again") return 0;
  if (g === "hard") return c.reps === 0 ? 1 : Math.max(1, Math.round(c.interval * 1.2));
  if (g === "good") {
    if (c.reps === 0) return 1;
    if (c.reps === 1) return 3;
    return Math.max(c.interval + 1, Math.round(c.interval * c.ease));
  }
  // easy
  if (c.reps === 0) return 4;
  return Math.max(c.interval + 2, Math.round(Math.max(c.interval, 1) * c.ease * 1.3));
}

export function review(c: CardState, g: Grade): CardState {
  const today = dayKey();
  const interval = nextInterval(c, g);
  let ease = c.ease;
  if (g === "again") ease -= 0.2;
  if (g === "hard") ease -= 0.15;
  if (g === "easy") ease += 0.15;
  ease = Math.min(3.2, Math.max(1.3, ease));
  return {
    ...c,
    ease,
    interval,
    due: addDays(today, interval),
    reps: g === "again" ? 0 : c.reps + 1,
    lapses: g === "again" && c.reps > 0 ? c.lapses + 1 : c.lapses,
    last: today,
  };
}

export function intervalLabel(days: number): string {
  if (days <= 0) return "today";
  if (days === 1) return "1 day";
  if (days < 30) return `${days} days`;
  const m = Math.round(days / 30);
  return m === 1 ? "1 month" : `${m} months`;
}

export type Strength = "new" | "learning" | "familiar" | "strong";

export function strength(c?: CardState): Strength {
  if (!c || c.reps === 0) return "new";
  if (c.interval < 7) return "learning";
  if (c.interval < 21) return "familiar";
  return "strong";
}
