/** Levels: level 1 needs 100 XP, and each level after needs 50 more than the last. */
export function levelInfo(xp: number) {
  let level = 1;
  let floor = 0;
  let need = 100;
  while (xp >= floor + need) {
    floor += need;
    level++;
    need = 100 + (level - 1) * 50;
  }
  const into = xp - floor;
  return { level, into, need, pct: need ? into / need : 0 };
}

export type Rank = "S" | "A" | "B" | "C" | "D";

export const PASS_MARK = 0.7;

export function rankFor(score: number): Rank {
  if (score >= 0.95) return "S";
  if (score >= 0.85) return "A";
  if (score >= PASS_MARK) return "B";
  if (score >= 0.5) return "C";
  return "D";
}

export const RANK_LABEL: Record<Rank, string> = {
  S: "Flawless",
  A: "Excellent",
  B: "Cleared",
  C: "Almost there",
  D: "Keep training",
};
