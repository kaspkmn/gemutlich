"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useStore } from "@/lib/store";
import { ALL_WORDS, UNITS } from "@/content/course";
import { currentStreak, dayKey, hashString } from "@/lib/dates";
import Cup from "@/components/Cup";
import SpeakButton from "@/components/SpeakButton";
import GenderTag, { GermanWord } from "@/components/GenderTag";
import { IconBook, IconCards, IconPen, IconTarget } from "@/components/Icons";

function greeting(h: number) {
  if (h < 11) return { de: "Guten Morgen", en: "Good morning" };
  if (h < 18) return { de: "Guten Tag", en: "Good afternoon" };
  if (h < 22) return { de: "Guten Abend", en: "Good evening" };
  return { de: "Gute Nacht", en: "Good night" };
}

export default function Home() {
  const { state, ready } = useStore();
  const [hour, setHour] = useState<number | null>(null);
  useEffect(() => setHour(new Date().getHours()), []);

  const today = dayKey();
  const xpToday = state.days[today] ?? 0;
  const goal = state.settings.dailyGoal;
  const streak = currentStreak(state.days);
  const due = useMemo(() => Object.values(state.cards).filter((c) => c.due <= today).length, [state.cards, today]);
  const nextUnit = UNITS.find((u) => !state.units[u.id]?.completed);
  const doneCount = UNITS.filter((u) => state.units[u.id]?.completed).length;
  const wordOfDay = ALL_WORDS[hashString(today) % ALL_WORDS.length];
  const g = hour === null ? null : greeting(hour);

  const goalText =
    xpToday >= goal
      ? "Today's cup is full. Anything more is a bonus."
      : xpToday === 0
        ? `Fill today's cup: ${goal} XP.`
        : `${goal - xpToday} XP to fill today's cup.`;

  return (
    <div className="page">
      <section className="greeting" aria-live="polite">
        <h1>{g ? `${g.de}${state.settings.name ? `, ${state.settings.name}` : ""}!` : "\u00a0"}</h1>
        <p className="en">{g ? g.en : "\u00a0"}</p>
      </section>

      <section className="panel today">
        <Cup value={ready ? xpToday : 0} goal={goal} />
        <div className="stack tight">
          <p>{goalText}</p>
          <div className="stat-line">
            <div className="stat">
              <b>{xpToday}</b>
              <span>XP today</span>
            </div>
            <div className="stat">
              <b>{streak}</b>
              <span>day streak</span>
            </div>
            <div className="stat">
              <b>{Object.keys(state.cards).length}</b>
              <span>words</span>
            </div>
          </div>
        </div>
      </section>

      <section className="action-list" aria-label="What to do next">
        {nextUnit ? (
          <Link href={`/learn/${nextUnit.id}`} className="action">
            <span className="ico">
              <IconBook />
            </span>
            <span className="grow">
              <b>{doneCount === 0 ? "Start your first lesson" : "Next lesson"}</b>
              <span className="muted small" style={{ display: "block" }}>
                {nextUnit.n}. {nextUnit.title}
              </span>
            </span>
          </Link>
        ) : (
          <Link href="/learn" className="action">
            <span className="ico">
              <IconBook />
            </span>
            <span className="grow">
              <b>Course complete</b>
              <span className="muted small" style={{ display: "block" }}>
                Revisit any lesson to keep it fresh.
              </span>
            </span>
          </Link>
        )}
        <Link href="/review" className="action">
          <span className="ico">
            <IconCards />
          </span>
          <span className="grow">
            <b>Flashcards</b>
            <span className="muted small" style={{ display: "block" }}>
              {due ? "Ready for review" : Object.keys(state.cards).length ? "All caught up" : "Finish a lesson to fill your deck"}
            </span>
          </span>
          {due > 0 && <span className="count">{due}</span>}
        </Link>
        <Link href="/write" className="action">
          <span className="ico">
            <IconPen />
          </span>
          <span className="grow">
            <b>Write in German</b>
            <span className="muted small" style={{ display: "block" }}>
              Translate, answer questions, or chat, with corrections
            </span>
          </span>
        </Link>
        <Link href="/practice" className="action">
          <span className="ico">
            <IconTarget />
          </span>
          <span className="grow">
            <b>Practice</b>
            <span className="muted small" style={{ display: "block" }}>
              Listening, typing, genders, verb endings
            </span>
          </span>
        </Link>
      </section>

      <section>
        <h2 className="section-title">Word of the day</h2>
        <div className={`tile g-${wordOfDay.gender ?? ""}`}>
          <div className="stack">
            <div className="row">
              <p className="tile-word grow">
                <GermanWord de={wordOfDay.de} gender={wordOfDay.gender} />
              </p>
              <SpeakButton text={wordOfDay.de} />
            </div>
            <p className="tile-en">{wordOfDay.en}</p>
            <GenderTag gender={wordOfDay.gender} />
            {wordOfDay.ex && (
              <div className="example">
                <p className="de">{wordOfDay.ex[0]}</p>
                <p className="muted small">{wordOfDay.ex[1]}</p>
              </div>
            )}
            {wordOfDay.note && <p className="small muted">{wordOfDay.note}</p>}
          </div>
        </div>
      </section>
    </div>
  );
}
