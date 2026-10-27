"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useStore } from "@/lib/store";
import { bestTest } from "@/lib/state";
import { ALL_WORDS, UNITS } from "@/content/course";
import { currentStreak, dayKey, hashString } from "@/lib/dates";
import { levelInfo, PASS_MARK } from "@/lib/level";
import { BOSSES } from "@/lib/tests";
import SpeakButton from "@/components/SpeakButton";
import GenderTag, { GermanWord } from "@/components/GenderTag";
import { IconBook, IconCards, IconCheck, IconExam, IconFlame, IconPen, IconSkull, IconTarget } from "@/components/Icons";

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
  const xpToday = ready ? (state.days[today] ?? 0) : 0;
  const goal = state.settings.dailyGoal;
  const questDone = xpToday >= goal;
  const streak = currentStreak(state.days);
  const lv = levelInfo(state.xp);
  const due = useMemo(() => Object.values(state.cards).filter((c) => c.due <= today).length, [state.cards, today]);
  const nextUnit = UNITS.find((u) => !state.units[u.id]?.completed);
  const doneIds = UNITS.filter((u) => state.units[u.id]?.completed).map((u) => u.id);
  const passed = new Set(state.tests.filter((t) => t.total && t.correct / t.total >= PASS_MARK).map((t) => t.id)).size;
  // a boss whose lessons are all done but hasn't been beaten yet
  const bossReady = BOSSES.find((b) => b.units.every((u) => doneIds.includes(u)) && (bestTest(state, `boss:${b.n}`) ?? 0) < PASS_MARK);
  const wordOfDay = ALL_WORDS[hashString(today) % ALL_WORDS.length];
  const g = hour === null ? null : greeting(hour);
  const name = state.settings.name;

  return (
    <div className="page">
      <section className="greeting">
        <h1>{g ? `${g.de}${name ? `, ${name}` : ""}!` : " "}</h1>
        <p className="en">{g ? g.en : " "}</p>
      </section>

      <section className="panel hud player" aria-label="Your stats">
        <div className="player-top">
          <div className="lv-hex" aria-label={`Level ${lv.level}`}>
            <span>
              <small>LV</small>
              <b>{lv.level}</b>
            </span>
          </div>
          <div className="grow">
            <p className="player-name">{name || "Player"}</p>
            <div className="segbar" style={{ marginTop: 6 }} aria-label={`${lv.into} of ${lv.need} XP to level ${lv.level + 1}`}>
              <div style={{ width: `${Math.round(lv.pct * 100)}%` }} />
            </div>
            <div className="xp-line">
              <span>
                {lv.into} / {lv.need} XP
              </span>
              <span>to level {lv.level + 1}</span>
            </div>
          </div>
        </div>
        <div className="stat-line">
          <div className="stat">
            <b className="row" style={{ gap: 4 }}>
              <IconFlame size={20} className="flame" />
              {streak}
            </b>
            <span>day streak</span>
          </div>
          <div className="stat">
            <b>{Object.keys(state.cards).length}</b>
            <span>words</span>
          </div>
          <div className="stat">
            <b>{passed}</b>
            <span>tests passed</span>
          </div>
        </div>
      </section>

      <section className={`panel quest${questDone ? " complete" : ""}`} aria-label="Daily quest">
        <div className="quest-head">
          <b>{questDone ? "Daily quest complete" : `Daily quest: earn ${goal} XP`}</b>
          <span>
            {questDone && <IconCheck size={16} />} {Math.min(xpToday, goal)} / {goal}
          </span>
        </div>
        <div className={`segbar${questDone ? " done" : ""}`}>
          <div style={{ width: `${Math.min(100, (xpToday / goal) * 100)}%` }} />
        </div>
        {questDone && xpToday > goal && <p className="tiny faint">+{xpToday - goal} bonus XP today</p>}
      </section>

      <section className="action-list" aria-label="What to do next">
        {nextUnit ? (
          <Link href={`/learn/${nextUnit.id}`} className="action primary">
            <span className="ico">
              <IconBook />
            </span>
            <span className="grow">
              <b>{doneIds.length === 0 ? "Start your first lesson" : "Next lesson"}</b>
              <span className="muted small" style={{ display: "block" }}>
                {nextUnit.n}. {nextUnit.title}
              </span>
            </span>
          </Link>
        ) : (
          <Link href="/test/run?id=final" className="action primary">
            <span className="ico">
              <IconExam />
            </span>
            <span className="grow">
              <b>Course complete</b>
              <span className="muted small" style={{ display: "block" }}>
                Take the final exam
              </span>
            </span>
          </Link>
        )}
        {bossReady && (
          <Link href={`/test/run?id=boss:${bossReady.n}`} className="action">
            <span className="ico">
              <IconSkull />
            </span>
            <span className="grow">
              <b>Boss {bossReady.n} is ready</b>
              <span className="muted small" style={{ display: "block" }}>
                {bossReady.title}: test yourself on 4 lessons
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
        <Link href="/practice" className="action">
          <span className="ico">
            <IconTarget />
          </span>
          <span className="grow">
            <b>Practice</b>
            <span className="muted small" style={{ display: "block" }}>
              Typing, listening, genders, verb endings
            </span>
          </span>
        </Link>
        <Link href="/write" className="action">
          <span className="ico">
            <IconPen />
          </span>
          <span className="grow">
            <b>Write in German</b>
            <span className="muted small" style={{ display: "block" }}>
              Translate, answer questions, journal, chat
            </span>
          </span>
        </Link>
      </section>

      <section>
        <h2 className="section-title">Word of the day</h2>
        <div className={`tile g-${wordOfDay.gender ?? ""}`}>
          <div className="stack">
            <div className="row">
              <p className="tile-word grow" lang="de">
                <GermanWord de={wordOfDay.de} gender={wordOfDay.gender} />
              </p>
              <SpeakButton text={wordOfDay.de} />
            </div>
            <p className="tile-en">{wordOfDay.en}</p>
            <GenderTag gender={wordOfDay.gender} />
            {wordOfDay.ex && (
              <div className="example">
                <p className="de" lang="de">
                  {wordOfDay.ex[0]}
                </p>
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
