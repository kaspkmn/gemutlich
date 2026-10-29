"use client";

import { L } from "@/lib/lang";
import { useCallback, useEffect, useState } from "react";
import { useStore } from "@/lib/store";
import { findWord } from "@/lib/state";
import { Grade, intervalLabel, nextInterval } from "@/lib/srs";
import SpeakButton, { useSpeak } from "./SpeakButton";
import GenderTag, { GermanWord } from "./GenderTag";
import { IconX } from "./Icons";

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

export interface DeckResult {
  reviewed: number;
  again: number;
}

/** Spaced-repetition review of the given card ids. */
export default function FlashcardDeck({
  ids,
  onDone,
  onExit,
}: {
  ids: string[];
  onDone: (r: DeckResult) => void;
  onExit: () => void;
}) {
  const { state, reviewCard } = useStore();
  const say = useSpeak();
  const [queue, setQueue] = useState<Item[]>(() =>
    ids.map((id, n) => {
      const dir = state.settings.direction;
      const front: "de" | "en" = dir === "mixed" ? (Math.random() < 0.5 ? "de" : "en") : dir === "en-de" ? "en" : "de";
      return { id, front, key: `${id}-${n}` };
    })
  );
  const [pos, setPos] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [counts, setCounts] = useState<DeckResult>({ reviewed: 0, again: 0 });

  const item = queue[pos];
  const word = item ? findWord(state, item.id) : undefined;
  const card = item ? state.cards[item.id] : undefined;

  // skip anything that's been deleted
  useEffect(() => {
    if (item && (!word || !card)) setPos((p) => p + 1);
  }, [item, word, card]);

  useEffect(() => {
    if (pos >= queue.length && queue.length) onDone(counts);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pos, queue.length]);

  // Say the German when it first shows.
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
      if (g === "again") setQueue((q) => [...q, { ...item, key: `${item.key}-again` }]);
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

  if (!item || !word || !card) return null;

  const left = queue.length - pos;

  return (
    <div className="stack">
      <div className="runner-top">
        <button className="close-btn" onClick={onExit} aria-label="Stop reviewing">
          <IconX />
        </button>
        <div className="progress grow">
          <div style={{ width: `${(pos / queue.length) * 100}%` }} />
        </div>
        <span className="small faint">{left} left</span>
      </div>

      <div
        className={`tile flash ${flipped ? `g-${word.gender ?? ""}` : ""}`}
        role="button"
        tabIndex={0}
        aria-label={flipped ? "Card answer" : "Show the answer"}
        onClick={() => setFlipped(true)}
      >
        {item.front === "de" ? (
          <div className="row">
            <p className="tile-word grow" lang={L.code}>
              <GermanWord de={word.de} gender={flipped ? word.gender : undefined} />
            </p>
            <SpeakButton text={word.de} />
          </div>
        ) : (
          <p className="tile-word">{word.en}</p>
        )}
        {!flipped && <p className="small faint">Tap or press space to show the answer</p>}
        {flipped && (
          <>
            <hr />
            {item.front === "de" ? (
              <p className="tile-en">{word.en}</p>
            ) : (
              <div className="row">
                <p className="tile-word grow" lang={L.code} style={{ fontSize: "1.9rem" }}>
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
                <p className="de" lang={L.code}>
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
              <span>{g === "again" ? "soon" : intervalLabel(nextInterval(card, g))}</span>
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
