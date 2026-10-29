"use client";

import { L } from "@/lib/lang";
import Link from "next/link";
import { useMemo, useState } from "react";
import { useStore } from "@/lib/store";
import { findWord } from "@/lib/state";
import type { CourseWord } from "@/content/types";
import { practiceExercises, type Exercise, type PracticeMode } from "@/lib/exercises";
import { dayKey } from "@/lib/dates";
import ExerciseRunner, { type RunResult } from "@/components/ExerciseRunner";
import SubNav from "@/components/SubNav";
import { IconAlert, IconBars, IconCards, IconHash, IconMic } from "@/components/Icons";

const MODES: { id: PracticeMode; title: string; blurb: string; needs: "words" | "units" }[] = [
  { id: "type", title: "Type it", blurb: `See English, type the ${L.name}. Some go the other way.`, needs: "words" },
  { id: "dictation", title: "Dictation", blurb: "Hear a word or sentence, type exactly what you heard.", needs: "units" },
  { id: "conj", title: "Verb endings", blurb: "Type the right form: du ___ (sprechen).", needs: "units" },
  { id: "sentences", title: "Sentences", blurb: "Fill gaps and put words in order, from your lessons.", needs: "units" },
  { id: "gender", title: L.genderOptions.join(", "), blurb: "Quick-fire genders for your nouns.", needs: "words" },
  { id: "listen", title: "Listening", blurb: "Hear a word, pick what you heard.", needs: "words" },
  { id: "mixed", title: "Quick mix", blurb: "A bit of everything.", needs: "words" },
  { id: "weak", title: "Tricky words", blurb: "Flashcards you've missed the most.", needs: "words" },
];

export default function PracticePage() {
  const { state } = useStore();
  const [run, setRun] = useState<{ mode: PracticeMode; ex: Exercise[] } | null>(null);
  const [result, setResult] = useState<(RunResult & { mode: PracticeMode }) | null>(null);

  const doneUnits = useMemo(() => Object.keys(state.units).filter((id) => state.units[id].completed), [state.units]);
  const deck = useMemo(
    () => Object.keys(state.cards).map((id) => findWord(state, id)).filter(Boolean) as CourseWord[],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [state.cards, state.custom]
  );
  const weak = useMemo(
    () =>
      deck
        .map((w) => ({ w, c: state.cards[w.id] }))
        .filter(({ c }) => c && (c.lapses > 0 || c.ease < 2.4))
        .sort((a, b) => b.c.lapses - a.c.lapses || a.c.ease - b.c.ease)
        .map(({ w }) => w),
    [deck, state.cards]
  );
  const due = Object.values(state.cards).filter((c) => c.due <= dayKey()).length;
  const mistakeCount = Object.keys(state.mistakes).length;

  const start = (mode: PracticeMode) => {
    const words = mode === "weak" ? (weak.length >= 4 ? weak : deck) : deck;
    const ex = practiceExercises(mode, words, doneUnits);
    if (ex.length) {
      setResult(null);
      setRun({ mode, ex });
      window.scrollTo({ top: 0 });
    }
  };

  if (run) {
    return (
      <div className="page">
        <ExerciseRunner
          exercises={run.ex}
          onExit={() => setRun(null)}
          onDone={(r) => {
            setResult({ ...r, mode: run.mode });
            setRun(null);
          }}
        />
      </div>
    );
  }

  const hasWords = deck.length >= 4;
  const hasUnits = doneUnits.length > 0;

  return (
    <div className="page">
      <SubNav group="practice" />
      <div className="page-head">
        <h1>Practice</h1>
        <p className="sub">Short rounds using what you've already learned.</p>
      </div>

      {result && (
        <section className="panel stack">
          <div className="row between">
            <h2>{MODES.find((m) => m.id === result.mode)?.title}: done</h2>
            <span className="pill red">
              {result.correct}/{result.total}
            </span>
          </div>
          <p className="muted small">+{result.xp} XP. Anything you missed went into your mistake notebook.</p>
          <button className="btn ghost block" onClick={() => start(result.mode)}>
            Another round
          </button>
        </section>
      )}

      {!hasUnits && (
        <p className="notice">
          Practice uses lessons you've finished. <Link href="/learn">Start the first lesson</Link> and everything here opens up.
        </p>
      )}

      <div className="action-list">
        <Link href="/review" className="action">
          <span className="ico">
            <IconCards size={20} />
          </span>
          <span className="grow">
            <b>Flashcards</b>
            <span className="small muted" style={{ display: "block" }}>
              {due ? `${due} ready to review` : "All caught up"}
            </span>
          </span>
        </Link>
        <Link href="/mistakes" className="action">
          <span className="ico">
            <IconAlert size={20} />
          </span>
          <span className="grow">
            <b>Mistake notebook</b>
            <span className="small muted" style={{ display: "block" }}>
              {mistakeCount ? `${mistakeCount} to fix` : "Nothing to fix right now"}
            </span>
          </span>
        </Link>
        <Link href="/speak" className="action">
          <span className="ico">
            <IconMic size={20} />
          </span>
          <span className="grow">
            <b>Speaking</b>
            <span className="small muted" style={{ display: "block" }}>
              Say it out loud and get checked
            </span>
          </span>
        </Link>
        <Link href="/numbers" className="action">
          <span className="ico">
            <IconHash size={20} />
          </span>
          <span className="grow">
            <b>Numbers & time</b>
            <span className="small muted" style={{ display: "block" }}>
              Prices, clock times, phone numbers
            </span>
          </span>
        </Link>
        <Link href="/weak" className="action">
          <span className="ico">
            <IconBars size={20} />
          </span>
          <span className="grow">
            <b>Weak spots</b>
            <span className="small muted" style={{ display: "block" }}>
              See what you miss most and work on it
            </span>
          </span>
        </Link>
      </div>

      <section className="stack">
        <h2 className="section-title" style={{ margin: 0 }}>
          Drills
        </h2>
        <div className="mode-grid">
          {MODES.map((m) => {
            const available = m.needs === "words" ? hasWords : hasUnits;
            return (
              <button key={m.id} className="mode-card" disabled={!available} onClick={() => start(m.id)} style={available ? undefined : { opacity: 0.45 }}>
                <b>{m.title}</b>
                <span className="small muted">{m.blurb}</span>
              </button>
            );
          })}
        </div>
      </section>
    </div>
  );
}
