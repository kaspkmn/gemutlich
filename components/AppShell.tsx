"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo } from "react";
import { useStore } from "@/lib/store";
import { currentStreak, dayKey } from "@/lib/dates";
import { IconBean, IconBook, IconCards, IconCup, IconGear, IconList, IconPen, IconTarget } from "./Icons";

const NAV = [
  { href: "/", label: "Today", Icon: IconCup },
  { href: "/learn", label: "Learn", Icon: IconBook },
  { href: "/review", label: "Cards", Icon: IconCards },
  { href: "/practice", label: "Practice", Icon: IconTarget },
  { href: "/write", label: "Write", Icon: IconPen },
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

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  return (
    <>
      <div className="shell">
        <header className="topbar">
          <Link href="/" className="brand" aria-label="Gemütlich home">
            <IconCup size={26} />
            Gemütlich
          </Link>
          <div className="topbar-actions">
            <span className="sync-dot" data-s={sync} title={SYNC_LABEL[sync]} aria-label={SYNC_LABEL[sync]} role="status" />
            <Link href="/progress" className="icon-link" title="Your progress">
              <IconBean size={20} />
              <span>{streak}</span>
              <span className="sr-only">day streak</span>
            </Link>
            <Link href="/words" className="icon-link" title="Word bank" aria-label="Word bank">
              <IconList size={20} />
            </Link>
            <Link href="/settings" className="icon-link" title="Settings" aria-label="Settings">
              <IconGear size={20} />
            </Link>
          </div>
        </header>
        <main>{children}</main>
      </div>
      <nav className="nav" aria-label="Main">
        <ul>
          {NAV.map(({ href, label, Icon }) => (
            <li key={href}>
              <Link href={href} aria-current={isActive(href) ? "page" : undefined}>
                <span className="icon-wrap">
                  <Icon size={24} />
                  {href === "/review" && due > 0 && <span className="badge">{due > 99 ? "99+" : due}</span>}
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
