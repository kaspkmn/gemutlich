"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useStore } from "@/lib/store";
import { dayKey, daysBetween } from "@/lib/dates";
import { shuffle } from "@/lib/exercises";
import FlashcardDeck, { type DeckResult } from "@/components/FlashcardDeck";
import SubNav from "@/components/SubNav";

export default function ReviewPage() {
  const { state, ready } = useStore();
  const today = dayKey();
  const [run, setRun] = useState<string[] | null>(null);
  const [result, setResult] = useState<DeckResult | null>(null);

  const dueIds = useMemo(
    () =>
      Object.entries(state.cards)
        .filter(([, c]) => c.due <= today)
        .map(([id]) => id),
    [state.cards, today]
  );

  if (!ready) return <div className="page" />;

  if (run) {
    return (
      <div className="page">
        <FlashcardDeck
          ids={run}
          onExit={() => setRun(null)}
          onDone={(r) => {
            setResult(r);
            setRun(null);
          }}
        />
      </div>
    );
  }

  const total = Object.keys(state.cards).length;
  const upcoming = Object.values(state.cards)
    .map((c) => c.due)
    .filter((d) => d > today)
    .sort();
  const tomorrow = upcoming.filter((d) => daysBetween(today, d) === 1).length;

  return (
    <div className="page">
      <SubNav group="practice" />
      <div className="page-head">
        <h1>Flashcards</h1>
        <p className="sub">Cards come back right before you'd forget them. Grade yourself honestly and the timing takes care of itself.</p>
      </div>

      {result && (
        <section className="panel stack">
          <h2>Done</h2>
          <p className="muted">
            {result.reviewed} reviews
            {result.again ? `, ${result.again} sent back for another look` : ""}.
          </p>
        </section>
      )}

      <section className="panel stack">
        {total === 0 ? (
          <>
            <h2>Your deck is empty</h2>
            <p className="muted">Finish a lesson and its words land here. You can also add your own words and phrases.</p>
            <div className="row wrap">
              <Link href="/learn" className="btn grow">
                Go to lessons
              </Link>
              <Link href="/words" className="btn ghost grow">
                Add your own
              </Link>
            </div>
          </>
        ) : dueIds.length ? (
          <>
            <h2>
              {dueIds.length} {dueIds.length === 1 ? "card" : "cards"} ready
            </h2>
            <p className="muted small">{total} cards in your deck.</p>
            <button className="btn block" onClick={() => { setResult(null); setRun(shuffle(dueIds).slice(0, 200)); }}>
              Start review
            </button>
          </>
        ) : (
          <>
            <h2>All caught up</h2>
            <p className="muted">
              Nothing is due right now.
              {tomorrow > 0 ? ` ${tomorrow} ${tomorrow === 1 ? "card comes" : "cards come"} back tomorrow.` : ""}
              {tomorrow === 0 && upcoming[0] ? ` The next card is due in ${daysBetween(today, upcoming[0])} days.` : ""}
            </p>
            <button className="btn ghost block" onClick={() => { setResult(null); setRun(shuffle(Object.keys(state.cards)).slice(0, 20)); }}>
              Review 20 cards anyway
            </button>
          </>
        )}
      </section>
    </div>
  );
}
