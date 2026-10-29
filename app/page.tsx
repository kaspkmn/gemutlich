"use client";

import { L, IS_ES } from "@/lib/lang";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useStore } from "@/lib/store";
import { ALL_WORDS, UNITS } from "@/content/course";
import { STORIES } from "@/content/stories";
import { currentStreak, dayKey, hashString } from "@/lib/dates";
import { planSession } from "@/lib/session";
import SpeakButton from "@/components/SpeakButton";
import GenderTag, { GermanWord } from "@/components/GenderTag";
import { IconAlert, IconBook, IconExam, IconFlame, IconHeadphones, IconMic, IconRead } from "@/components/Icons";

function greeting(h: number) {
  if (IS_ES) {
    if (h < 12) return { de: "Buenos días", en: "Good morning" };
    if (h < 19) return { de: "Buenas tardes", en: "Good afternoon" };
    return { de: "Buenas noches", en: "Good evening" };
  }
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
  const xpToday = ready ? (state.days[today] ?? 0) : 0;
  const goal = state.settings.dailyGoal;
  const goalDone = xpToday >= goal;
  const streak = currentStreak(state.days);
  const plan = useMemo(
    () => (ready ? planSession(state) : []),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [ready, state.cards, state.mistakes, state.units, state.skills]
  );
  const nextUnit = UNITS.find((u) => !state.units[u.id]?.completed);
  const doneCount = UNITS.filter((u) => state.units[u.id]?.completed).length;
  const unreadStory = STORIES.find((s) => state.units[s.after]?.completed && !state.read[`story:${s.id}`]);
  const mistakes = Object.keys(state.mistakes).length;
  const wordOfDay = ALL_WORDS[hashString(today) % ALL_WORDS.length];
  const g = hour === null ? null : greeting(hour);
  const name = state.settings.name;

  return (
    <div className="page">
      <section className="greeting">
        <h1>{g ? `${g.de}${name ? `, ${name}` : ""}` : " "}</h1>
        <p className="en">{g ? g.en : " "}</p>
      </section>

      {plan.length > 0 ? (
        <section className="session-card">
          <div>
            <h2>Today's session</h2>
            <p className="small muted">About 10 to 15 minutes, built from what's due and what you've been missing.</p>
          </div>
          <ul>
            {plan.map((s) => (
              <li key={s.kind}>{s.label}</li>
            ))}
          </ul>
          <Link href="/session" className="btn block">
            Start session
          </Link>
        </section>
      ) : (
        <section className="session-card">
          <div>
            <h2>{doneCount === 0 ? "Start here" : "Next up"}</h2>
            <p className="small muted">
              {doneCount === 0
                ? `Your first lesson covers how ${L.name} sounds. About 10 minutes.`
                : "Nothing to review right now. Keep going with the course."}
            </p>
          </div>
          <Link href={nextUnit ? `/learn/${nextUnit.id}` : "/read"} className="btn block">
            {nextUnit ? `Lesson ${nextUnit.n}: ${nextUnit.title}` : "Read a story"}
          </Link>
        </section>
      )}

      <section className="panel goal" aria-label="Daily goal">
        <div className="goal-head">
          <b>{goalDone ? "Daily goal reached" : "Daily goal"}</b>
          <span>
            {Math.min(xpToday, goal)} / {goal} XP
          </span>
        </div>
        <div className={`segbar${goalDone ? " done" : ""}`}>
          <div style={{ width: `${Math.min(100, (xpToday / goal) * 100)}%` }} />
        </div>
        <p className="tiny faint row" style={{ gap: 4 }}>
          <IconFlame size={14} className="flame" />
          {streak === 0 ? "Start a streak today" : `${streak} day streak`}
        </p>
      </section>

      <section className="quick-grid" aria-label="Shortcuts">
        <Link href={nextUnit ? `/learn/${nextUnit.id}` : "/learn"} className="quick">
          <IconBook size={20} />
          <b>{nextUnit ? "Next lesson" : "Lessons"}</b>
          <span>{nextUnit ? `${nextUnit.n}. ${nextUnit.title}` : "All finished"}</span>
        </Link>
        <Link href={unreadStory ? `/read/${unreadStory.id}` : "/read"} className="quick">
          <IconRead size={20} />
          <b>Stories</b>
          <span>{unreadStory ? unreadStory.titleEn : "Read with tap-to-translate"}</span>
        </Link>
        <Link href="/speak" className="quick">
          <IconMic size={20} />
          <b>Speaking</b>
          <span>Say it out loud</span>
        </Link>
        <Link href="/listen" className="quick">
          <IconHeadphones size={20} />
          <b>Listening</b>
          <span>Short conversations</span>
        </Link>
        <Link href="/mistakes" className="quick">
          <IconAlert size={20} />
          <b>Mistakes</b>
          <span>{mistakes ? <span className="count">{mistakes} to fix</span> : "Nothing to fix"}</span>
        </Link>
        <Link href="/test" className="quick">
          <IconExam size={20} />
          <b>Tests</b>
          <span>Check what's stuck</span>
        </Link>
      </section>

      <section>
        <h2 className="section-title">Word of the day</h2>
        <div className={`tile g-${wordOfDay.gender ?? ""}`}>
          <div className="stack">
            <div className="row">
              <p className="tile-word grow" lang={L.code}>
                <GermanWord de={wordOfDay.de} gender={wordOfDay.gender} />
              </p>
              <SpeakButton text={wordOfDay.de} />
            </div>
            <p className="tile-en">{wordOfDay.en}</p>
            <GenderTag gender={wordOfDay.gender} />
            {wordOfDay.ex && (
              <div className="example">
                <p className="de" lang={L.code}>
                  {wordOfDay.ex[0]}
                </p>
                <p className="muted small">{wordOfDay.ex[1]}</p>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
