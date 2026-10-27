import { rankFor, type Rank } from "@/lib/level";

/** A rank letter (S, A, B, C, D) for a 0..1 score. */
export default function RankBadge({ score, rank, big = false }: { score?: number; rank?: Rank; big?: boolean }) {
  const r = rank ?? (score === undefined ? undefined : rankFor(score));
  if (!r) return null;
  const badge = (
    <span className={`rank rank-${r}${big ? " big" : ""}`} aria-label={`Rank ${r}`}>
      {r}
    </span>
  );
  return big ? <span className={`rank-glow ${r}`}>{badge}</span> : badge;
}
