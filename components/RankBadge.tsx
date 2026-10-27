import { PASS_MARK } from "@/lib/level";

/** A score as a small percentage pill. Red when it's a pass. */
export default function RankBadge({ score }: { score?: number; rank?: string; big?: boolean }) {
  if (score === undefined) return null;
  const pct = Math.round(score * 100);
  return (
    <span className={`rank${score >= PASS_MARK ? " pass" : ""}`} aria-label={`Best score ${pct}%`}>
      {pct}%
    </span>
  );
}
