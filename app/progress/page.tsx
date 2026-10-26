"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useStore } from "@/lib/store";
import { UNITS } from "@/content/course";
import { addDays, currentStreak, dayKey, longestStreak, parseDay } from "@/lib/dates";
import { strength } from "@/lib/srs";

const WEEKS = 18;

export default function ProgressPage() {
  const { state } = useStore();
  const today = dayKey();
  const goal = state.settings.dailyGoal;

  const cells = useMemo(() => {
    // start on the Monday WEEKS weeks ago so columns are whole weeks
    const t = parseDay(today);
    const weekday = (t.getDay() + 6) % 7; // Monday = 0
    const start = addDays(today, -(WEEKS - 1) * 7 - weekday);
    return Array.from({ length: WEEKS * 7 }, (_, i) => {
      const k = addDays(start, i);
      const xp = state.days[k] ?? 0;
      const l = k > today ? -1 : xp <= 0 ? 0 : xp < goal * 0.5 ? 1 : xp < goal ? 2 : xp < goal * 2 ? 3 : 4;
      return { k, xp, l };
    });
  }, [state.days, today, goal]);

  const cards = Object.values(state.cards);
  const strong = cards.filter((c) => strength(c) === "strong").length;
  const familiar = cards.filter((c) => strength(c) === "familiar").length;
  const accuracy = state.stats.exercises ? Math.round((state.stats.correct / state.stats.exercises) * 100) : 0;
  const done = UNITS.filter((u) => state.units[u.id]?.completed).length;

  const stats = [
    { v: currentStreak(state.days), l: "day streak" },
    { v: longestStreak(state.days), l: "longest streak" },
    { v: state.xp, l: "total XP" },
    { v: cards.length, l: "words in your deck" },
    { v: strong + familiar, l: "words that have stuck" },
    { v: `${accuracy}%`, l: "exercise accuracy" },
    { v: state.stats.written, l: "things written in German" },
    { v: state.stats.reviews, l: "flashcard reviews" },
  ];

  return (
    <div className="page">
      <div className="page-head">
        <h1>Your progress</h1>
        <p className="sub">
          {done} of {UNITS.length} lessons finished.
        </p>
      </div>

      <div className="stat-grid">
        {stats.map((s) => (
          <div key={s.l} className="stat-box">
            <b>{s.v}</b>
            <span>{s.l}</span>
          </div>
        ))}
      </div>

      <section className="panel stack">
        <h2>The last {WEEKS} weeks</h2>
        <div className="heatmap" role="img" aria-label="Calendar of study days">
          {cells.map((c) =>
            c.l < 0 ? (
              <i key={c.k} style={{ visibility: "hidden" }} />
            ) : (
              <i key={c.k} data-l={c.l} data-today={c.k === today ? 1 : undefined} title={`${c.k}: ${c.xp} XP`} />
            )
          )}
        </div>
        <p className="tiny faint">Darker squares are days you filled your cup ({goal} XP) or more.</p>
      </section>

      <section className="panel stack">
        <h2>Lessons</h2>
        <ul className="stack" style={{ listStyle: "none", margin: 0, padding: 0 }}>
          {UNITS.map((u) => {
            const p = state.units[u.id];
            const learned = u.words.filter((w) => state.cards[w.de] && strength(state.cards[w.de]) !== "new").length;
            const pct = Math.round((learned / u.words.length) * 100);
            return (
              <li key={u.id} className="stack tight">
                <div className="row between">
                  <Link href={`/learn/${u.id}`} style={{ textDecoration: "none", fontWeight: 700 }}>
                    {u.n}. {u.title}
                  </Link>
                  <span className="small faint">{p?.completed ? `${Math.round(p.best * 100)}%` : "not started"}</span>
                </div>
                <div className="bar-track" aria-label={`${pct}% of words reviewed`}>
                  <div style={{ width: `${pct}%` }} />
                </div>
              </li>
            );
          })}
        </ul>
        <p className="tiny faint">Green bars fill as you review each lesson's words in flashcards.</p>
      </section>
    </div>
  );
}
