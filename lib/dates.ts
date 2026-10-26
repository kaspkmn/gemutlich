/** Local calendar-day keys like "2026-10-26". */
export function dayKey(d: Date = new Date()): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function parseDay(key: string): Date {
  const [y, m, d] = key.split("-").map(Number);
  return new Date(y, m - 1, d);
}

export function addDays(key: string, n: number): string {
  const d = parseDay(key);
  d.setDate(d.getDate() + n);
  return dayKey(d);
}

export function daysBetween(a: string, b: string): number {
  return Math.round((parseDay(b).getTime() - parseDay(a).getTime()) / 86400000);
}

/** Current streak: consecutive days with XP, ending today (or yesterday if today isn't done yet). */
export function currentStreak(days: Record<string, number>): number {
  let k = dayKey();
  if (!(days[k] > 0)) k = addDays(k, -1);
  let n = 0;
  while (days[k] > 0) {
    n++;
    k = addDays(k, -1);
  }
  return n;
}

export function longestStreak(days: Record<string, number>): number {
  const keys = Object.keys(days).filter((k) => days[k] > 0).sort();
  let best = 0;
  let run = 0;
  let prev = "";
  for (const k of keys) {
    run = prev && daysBetween(prev, k) === 1 ? run + 1 : 1;
    best = Math.max(best, run);
    prev = k;
  }
  return best;
}

export function hashString(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}
