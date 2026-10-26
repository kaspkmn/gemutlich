"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useStore } from "@/lib/store";
import { findWord } from "@/lib/state";
import { dayKey, daysBetween } from "@/lib/dates";
import { Grade, intervalLabel, nextInterval } from "@/lib/srs";
import { shuffle } from "@/lib/exercises";
import SpeakButton, { useSpeak } from "@/components/SpeakButton";
import GenderTag, { GermanWord } from "@/components/GenderTag";
import { IconX } from "@/components/Icons";

interface Item {
  id: string;
  front: "de" | "en";
  key: string;
}

const GRADES: { g: Grade; label: string }[] = [
  { g: "again", label: "Again" },
  { g: "hard", label: "Hard" },
  { g: "good", label: "Good" },
  { g: "easy", label: "Easy" },
];

export default function ReviewPage() {
  const { state, ready, reviewCard } = useStore();
  const say = useSpeak();
  const today = dayKey();
  const [queue, setQueue] = useState<Item[] | null>(null);
  const [pos, setPos] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [counts, setCounts] = useState({ reviewed: 0, again: 0 });
  const started = useRef(false);

  const dueIds = useMemo(
    () =>
      Object.entries(state.cards)
        .filter(([, c]) => c.due <= today)
        .sort((a, b) => (a[1].due < b[1].due ? -1 : a[1].due > b[1].due ? 1 : Math.random() - 0.5))
        .map(([id]) => id),
    [state.cards, today]
  );

  const buildQueue = useCallback(
    (ids: string[]) =>
      ids.map((id, n) => {
        const dir = state.settings.direction;
        const front: "de" | "en" = dir === "mixed" ? (Math.random() < 0.5 ? "de" : "en") : dir === "en-de" ? "en" : "de";
        return { id, front, key: `${id}-${n}` };
      }),
    [state.settings.direction]
  );

  useEffect(() => {
    if (!ready || started.current) return;
    if (dueIds.length) {
      started.current = true;
      setQueue(buildQueue(shuffle(dueIds.slice(0, 200))));
    }
  }, [ready, dueIds, buildQueue]);

  const item = queue?.[pos];
  const word = item ? findWord(state, item.id) : undefined;
  const card = item ? state.cards[item.id] : undefined;

  // Speak German when it's showing for the first time.
  useEffect(() => {
    if (!item || !word || !state.settings.autoplay) return;
    if ((item.front === "de" && !flipped) || (item.front === "en" && flipped)) say(word.de);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [item?.key, flipped]);

  const grade = useCallback(
    (g: Grade) => {
      if (!item || !flipped) return;
      reviewCard(item.id, g);
      setCounts((c) => ({ reviewed: c.reviewed + 1, again: c.again + (g === "again" ? 1 : 0) }));
      if (g === "again") {
        setQueue((q) => (q ? [...q, { ...item, key: `${item.key}-again` }] : q));
      }
      setFlipped(false);
      setPos((p) => p + 1);
    },
    [item, flipped, reviewCard]
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!item) return;
      if (e.key === " " || e.key === "Enter") {
        e.preventDefault();
        if (!flipped) setFlipped(true);
      }
      const n = Number(e.key);
      if (flipped && n >= 1 && n <= 4) grade(GRADES[n - 1].g);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [item, flipped, grade]);

  // ── empty and finished states ──
  if (!ready) return <div className="page" />;

  const totalCards = Object.keys(state.cards).length;

  if (!queue || (item === undefined && pos === 0)) {
    const upcoming = Object.values(state.cards)
      .map((c) => c.due)
      .filter((d) => d > today)
      .sort();
    const tomorrow = upcoming.filter((d) => daysBetween(today, d) === 1).length;
    return (
      <div className="page">
        <div className="page-head">
          <h1>Flashcards</h1>
          <p className="sub">Cards come back right before you'd forget them.</p>
        </div>
        <section className="panel stack">
          {totalCards === 0 ? (
            <>
              <h2>Your deck is empty</h2>
              <p className="muted">Finish a lesson and its words land here, ready to review.</p>
              <Link href="/learn" className="btn">
                Go to the course
              </Link>
            </>
          ) : (
            <>
              <h2>All caught up</h2>
              <p className="muted">
                Nothing is due right now.
                {tomorrow > 0 ? ` ${tomorrow} ${tomorrow === 1 ? "card comes" : "cards come"} back tomorrow.` : ""}
                {tomorrow === 0 && upcoming[0] ? ` The next card is due in ${daysBetween(today, upcoming[0])} days.` : ""}
              </p>
              <Link href="/practice" className="btn">
                Practice instead
              </Link>
            </>
          )}
        </section>
      </div>
    );
  }

  if (!item || !word || !card) {
    return (
      <div className="page">
        <section className="panel stack done-card">
          <p className="big">{counts.reviewed}</p>
          <h2>Fertig! (Done!)</h2>
          <p className="muted">
            {counts.reviewed} reviews
            {counts.again ? `, ${counts.again} sent back for another look` : ""}. Come back tomorrow for the next batch.
          </p>
          <div className="stack" style={{ width: "100%" }}>
            <Link href="/write" className="btn block">
              Write a few sentences
            </Link>
            <Link href="/" className="btn ghost block">
              Back to today
            </Link>
          </div>
        </section>
      </div>
    );
  }

  const front = item.front === "de" ? (
    <div className="row">
      <p className="tile-word grow" lang="de">
        <GermanWord de={word.de} gender={word.gender} />
      </p>
      <SpeakButton text={word.de} />
    </div>
  ) : (
    <p className="tile-word">{word.en}</p>
  );

  const left = queue.length - pos;

  return (
    <div className="page">
      <div className="runner-top">
        <Link href="/" className="close-btn" aria-label="Stop reviewing">
          <IconX />
        </Link>
        <div className="progress">
          <div style={{ width: `${(pos / queue.length) * 100}%` }} />
        </div>
        <span className="small muted">{left} left</span>
      </div>

      <div
        className={`tile flash ${flipped ? `g-${word.gender ?? ""}` : ""}`}
        role="button"
        tabIndex={0}
        aria-label={flipped ? "Card answer" : "Show the answer"}
        onClick={() => setFlipped(true)}
      >
        {front}
        {!flipped && <p className="small faint">Tap or press space to flip</p>}
        {flipped && (
          <>
            <hr />
            {item.front === "de" ? (
              <p className="tile-en">{word.en}</p>
            ) : (
              <div className="row">
                <p className="tile-word grow" lang="de" style={{ fontSize: "2rem" }}>
                  <GermanWord de={word.de} gender={word.gender} />
                </p>
                <SpeakButton text={word.de} />
              </div>
            )}
            <div className="row wrap">
              <GenderTag gender={word.gender} />
              {word.plural && <span className="small muted">plural: {word.plural}</span>}
            </div>
            {word.ex && (
              <div className="example">
                <p className="de" lang="de">
                  {word.ex[0]}
                </p>
                <p className="muted small">{word.ex[1]}</p>
              </div>
            )}
          </>
        )}
      </div>

      {flipped ? (
        <div className="grades" role="group" aria-label="How well did you know it?">
          {GRADES.map(({ g, label }, n) => (
            <button key={g} className={`grade ${g}`} onClick={() => grade(g)}>
              {label}
              <span>{g === "again" ? "again soon" : intervalLabel(nextInterval(card, g))}</span>
              <span className="sr-only">key {n + 1}</span>
            </button>
          ))}
        </div>
      ) : (
        <button className="btn block" onClick={() => setFlipped(true)}>
          Show answer
        </button>
      )}
    </div>
  );
}
