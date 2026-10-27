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

/** The app mark: a shield with a chevron. */
export const IconShield = ({ size, className }: P) => (
  <svg {...base(size)} className={className}>
    <path d="M12 2.8 20 6v6c0 4.6-3.3 8.1-8 9.4C7.3 20.1 4 16.6 4 12V6l8-3.2Z" />
    <path d="m8.5 10.5 3.5 3.5 3.5-3.5" />
  </svg>
);

export const IconHome = ({ size, className }: P) => (
  <svg {...base(size)} className={className}>
    <path d="M3.5 11 12 4l8.5 7" />
    <path d="M6 9.5V20h12V9.5" />
    <path d="M10 20v-5h4v5" />
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
    <rect x="3" y="6" width="13" height="15" rx="2" />
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

export const IconExam = ({ size, className }: P) => (
  <svg {...base(size)} className={className}>
    <path d="M9 4h6v3H9z" />
    <path d="M9 5.5H6.5A1.5 1.5 0 0 0 5 7v12.5A1.5 1.5 0 0 0 6.5 21h11a1.5 1.5 0 0 0 1.5-1.5V7a1.5 1.5 0 0 0-1.5-1.5H15" />
    <path d="m8.5 14 2.5 2.5 4.5-5" />
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

export const IconFlame = ({ size, className }: P) => (
  <svg {...base(size)} className={className}>
    <path d="M12 21c-4 0-6.5-2.6-6.5-6 0-3.6 2.7-5.3 3.6-8.8.2-.7 1-.9 1.4-.3C12.4 8.4 14 9 14.6 7.2c.2-.6 1-.7 1.3-.1 1.4 2.2 2.6 4.5 2.6 7.9 0 3.4-2.5 6-6.5 6Z" />
    <path d="M12 21c-1.7 0-2.8-1.1-2.8-2.7 0-1.8 1.6-2.6 2.1-4.3.1-.4.6-.5.8-.1.8 1.4 2.7 2.4 2.7 4.4 0 1.6-1.1 2.7-2.8 2.7Z" />
  </svg>
);

export const IconSkull = ({ size, className }: P) => (
  <svg {...base(size)} className={className}>
    <path d="M12 3c-4.4 0-8 3.2-8 7.5 0 2.4 1.1 4.3 3 5.5V19a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-3c1.9-1.2 3-3.1 3-5.5C20 6.2 16.4 3 12 3Z" />
    <circle cx="9" cy="11" r="1.7" />
    <circle cx="15" cy="11" r="1.7" />
    <path d="M10 20v-2.5M14 20v-2.5M12 14.5l-.8 1.5h1.6L12 14.5Z" />
  </svg>
);

export const IconTrophy = ({ size, className }: P) => (
  <svg {...base(size)} className={className}>
    <path d="M7 4h10v5a5 5 0 0 1-10 0V4Z" />
    <path d="M7 6H4.5v1.5A3.5 3.5 0 0 0 8 11M17 6h2.5v1.5A3.5 3.5 0 0 1 16 11" />
    <path d="M12 14v3.5M8.5 20.5h7M9.5 20.5c0-1.7 1.1-3 2.5-3s2.5 1.3 2.5 3" />
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
