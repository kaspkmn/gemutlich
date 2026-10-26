/** Daily goal as a cup that fills with coffee. */
export default function Cup({ value, goal }: { value: number; goal: number }) {
  const pct = Math.max(0, Math.min(1, goal ? value / goal : 0));
  const full = pct >= 1;
  // the liquid lives in the cup body between y=34 and y=96
  const top = 34;
  const bottom = 96;
  const level = bottom - (bottom - top) * pct;
  return (
    <svg
      className={`cup${full ? " full" : ""}`}
      viewBox="0 0 120 120"
      role="img"
      aria-label={`Daily goal: ${value} of ${goal} XP`}
    >
      <defs>
        <clipPath id="cup-body">
          <path d="M18 32h66v38c0 17-13 28-29 28h-8c-16 0-29-11-29-28V32Z" />
        </clipPath>
      </defs>
      <g className="steam" transform="translate(0 0)">
        <path d="M38 22c-4-5 4-8 0-14" />
        <path d="M51 22c-4-5 4-8 0-14" />
        <path d="M64 22c-4-5 4-8 0-14" />
      </g>
      <ellipse cx="52" cy="108" rx="44" ry="6" fill="var(--bg-deep)" />
      <g clipPath="url(#cup-body)">
        <rect x="10" y="20" width="90" height="90" fill="var(--paper-2)" />
        <g className="coffee" style={{ transform: `translateY(${level - top}px)` }}>
          <rect x="10" y={top} width="90" height="80" fill="var(--crema)" />
          <rect x="10" y={top + 4} width="90" height="80" fill="#6b4630" />
        </g>
      </g>
      <path
        d="M18 32h66v38c0 17-13 28-29 28h-8c-16 0-29-11-29-28V32Z"
        fill="none"
        stroke="var(--espresso)"
        strokeWidth="4"
        strokeLinejoin="round"
      />
      <path d="M84 44h6a12 12 0 0 1 0 24h-7" fill="none" stroke="var(--espresso)" strokeWidth="4" strokeLinecap="round" />
    </svg>
  );
}
