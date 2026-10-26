type P = { size?: number; className?: string };

const base = (size = 22) => ({
  width: size,
  height: size,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.9,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
});

export const IconCup = ({ size, className }: P) => (
  <svg {...base(size)} className={className}>
    <path d="M4 9h13v5a6 6 0 0 1-6 6h-1a6 6 0 0 1-6-6V9Z" />
    <path d="M17 11h1.5a2.5 2.5 0 0 1 0 5H17" />
    <path d="M8 3.5c0 1 1 1.5 1 2.5M12 3.5c0 1 1 1.5 1 2.5" />
  </svg>
);

export const IconBook = ({ size, className }: P) => (
  <svg {...base(size)} className={className}>
    <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15H6.5A2.5 2.5 0 0 0 4 20.5v-15Z" />
    <path d="M4 20.5A2.5 2.5 0 0 0 6.5 21H20" />
    <path d="M9 8h7" />
  </svg>
);

export const IconCards = ({ size, className }: P) => (
  <svg {...base(size)} className={className}>
    <rect x="3" y="6" width="13" height="15" rx="2.5" />
    <path d="M8 3h10.5A2.5 2.5 0 0 1 21 5.5V17" />
  </svg>
);

export const IconTarget = ({ size, className }: P) => (
  <svg {...base(size)} className={className}>
    <circle cx="12" cy="12" r="8.5" />
    <circle cx="12" cy="12" r="4.5" />
    <circle cx="12" cy="12" r="0.8" fill="currentColor" />
  </svg>
);

export const IconPen = ({ size, className }: P) => (
  <svg {...base(size)} className={className}>
    <path d="M15.5 4.5 19.5 8.5 9 19H5v-4L15.5 4.5Z" />
    <path d="M13.5 6.5 17.5 10.5" />
  </svg>
);

export const IconChart = ({ size, className }: P) => (
  <svg {...base(size)} className={className}>
    <path d="M4 20V10M10 20V4M16 20v-7M22 20H2" />
  </svg>
);

export const IconGear = ({ size, className }: P) => (
  <svg {...base(size)} className={className}>
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1Z" />
  </svg>
);

export const IconSpeaker = ({ size, className }: P) => (
  <svg {...base(size)} className={className}>
    <path d="M4 9.5h3.5L12 5v14l-4.5-4.5H4v-5Z" />
    <path d="M15.5 9a4 4 0 0 1 0 6M18 6.5a7.5 7.5 0 0 1 0 11" />
  </svg>
);

export const IconX = ({ size, className }: P) => (
  <svg {...base(size)} className={className}>
    <path d="M6 6l12 12M18 6 6 18" />
  </svg>
);

export const IconCheck = ({ size, className }: P) => (
  <svg {...base(size)} className={className}>
    <path d="m5 12.5 4.5 4.5L19 7.5" />
  </svg>
);

export const IconBean = ({ size, className }: P) => (
  <svg {...base(size)} className={className}>
    <ellipse cx="12" cy="12" rx="6.5" ry="8.5" transform="rotate(35 12 12)" />
    <path d="M8.5 17.5c2-2 1-5 3.5-7.5s3.5-3 3.5-3" />
  </svg>
);

export const IconList = ({ size, className }: P) => (
  <svg {...base(size)} className={className}>
    <path d="M9 6h11M9 12h11M9 18h11M4.5 6h.01M4.5 12h.01M4.5 18h.01" />
  </svg>
);

export const IconChat = ({ size, className }: P) => (
  <svg {...base(size)} className={className}>
    <path d="M20 12a7.5 7.5 0 0 1-11.2 6.5L4 20l1.5-4.5A7.5 7.5 0 1 1 20 12Z" />
  </svg>
);

export const IconArrowLeft = ({ size, className }: P) => (
  <svg {...base(size)} className={className}>
    <path d="M15 5l-7 7 7 7" />
  </svg>
);

export const IconArrowRight = ({ size, className }: P) => (
  <svg {...base(size)} className={className}>
    <path d="M9 5l7 7-7 7" />
  </svg>
);

export const IconSpark = ({ size, className }: P) => (
  <svg {...base(size)} className={className}>
    <path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M6 18l2.5-2.5M15.5 8.5 18 6" />
  </svg>
);
