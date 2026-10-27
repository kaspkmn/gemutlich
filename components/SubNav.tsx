"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const GROUPS = {
  learn: [
    { href: "/learn", label: "Lessons" },
    { href: "/read", label: "Stories" },
    { href: "/listen", label: "Listening" },
    { href: "/grammar", label: "Grammar" },
  ],
  practice: [
    { href: "/practice", label: "Drills" },
    { href: "/review", label: "Flashcards" },
    { href: "/mistakes", label: "Mistakes" },
    { href: "/speak", label: "Speaking" },
    { href: "/numbers", label: "Numbers" },
    { href: "/weak", label: "Weak spots" },
  ],
};

/** Tabs across the top of the Learn and Practice sections. */
export default function SubNav({ group }: { group: keyof typeof GROUPS }) {
  const pathname = usePathname();
  return (
    <nav className="subnav" aria-label={group === "learn" ? "Learn sections" : "Practice sections"}>
      {GROUPS[group].map((g) => (
        <Link key={g.href} href={g.href} aria-current={pathname === g.href ? "page" : undefined}>
          {g.label}
        </Link>
      ))}
    </nav>
  );
}
