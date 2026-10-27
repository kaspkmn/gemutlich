"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo } from "react";
import { useStore } from "@/lib/store";
import { currentStreak, dayKey } from "@/lib/dates";
import { IconBook, IconChart, IconExam, IconFlame, IconGear, IconHome, IconList, IconPen, IconTarget } from "./Icons";

export const LEARN_PATHS = ["/learn", "/read", "/listen", "/grammar"];
export const PRACTICE_PATHS = ["/practice", "/review", "/mistakes", "/speak", "/numbers", "/weak"];

const NAV = [
  { href: "/", label: "Home", Icon: IconHome, match: ["/", "/session"] },
  { href: "/learn", label: "Learn", Icon: IconBook, match: LEARN_PATHS },
  { href: "/practice", label: "Practice", Icon: IconTarget, match: PRACTICE_PATHS },
  { href: "/test", label: "Tests", Icon: IconExam, match: ["/test"] },
  { href: "/write", label: "Write", Icon: IconPen, match: ["/write"] },
];

const SYNC_LABEL: Record<string, string> = {
  loading: "Loading your progress",
  synced: "Progress saved",
  saving: "Saving",
  offline: "Offline: saved on this device and will sync later",
  "signed-out": "Signed out",
};

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { state, sync } = useStore();

  const due = useMemo(() => {
    const today = dayKey();
    return Object.values(state.cards).filter((c) => c.due <= today).length;
  }, [state.cards]);
  const streak = currentStreak(state.days);

  if (pathname === "/login") return <>{children}</>;

  const isActive = (match: string[]) =>
    match.some((m) => (m === "/" ? pathname === "/" : pathname === m || pathname.startsWith(`${m}/`)));

  return (
    <>
      <div className="shell">
        <header className="topbar">
          <Link href="/" className="brand" aria-label="Deutsch home">
            <span className="brand-mark" aria-hidden>
              D
            </span>
            Deutsch
          </Link>
          <div className="topbar-actions">
            <span className="sync-dot" data-s={sync} title={SYNC_LABEL[sync]} aria-label={SYNC_LABEL[sync]} role="status" />
            <Link href="/progress" className="icon-link" title={`${streak} day streak`}>
              <IconFlame size={18} className="flame" />
              <span>{streak}</span>
              <span className="sr-only">day streak</span>
            </Link>
            <Link href="/words" className="icon-link" title="Words and phrases" aria-label="Words and phrases">
              <IconList size={20} />
            </Link>
            <Link href="/progress" className="icon-link" title="Progress" aria-label="Progress">
              <IconChart size={19} />
            </Link>
            <Link href="/settings" className="icon-link" title="Settings" aria-label="Settings">
              <IconGear size={19} />
            </Link>
          </div>
        </header>
        <main>{children}</main>
      </div>
      <nav className="nav" aria-label="Main">
        <ul>
          {NAV.map(({ href, label, Icon, match }) => (
            <li key={href}>
              <Link href={href} aria-current={isActive(match) ? "page" : undefined}>
                <span className="icon-wrap">
                  <Icon size={22} />
                  {href === "/practice" && due > 0 && <span className="badge">{due > 99 ? "99+" : due}</span>}
                </span>
                {label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
}
