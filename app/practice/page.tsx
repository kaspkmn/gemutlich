"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useStore } from "@/lib/store";
import { findWord } from "@/lib/state";
import type { CourseWord } from "@/content/types";
import { practiceExercises, type Exercise, type PracticeMode } from "@/lib/exercises";
import ExerciseRunner, { type RunResult } from "@/components/ExerciseRunner";

const MODES: { id: PracticeMode; title: string; de: string; blurb: string; needs: "words" | "units" }[] = [
  { id: "mixed", title: "Quick mix", de: "Gemischt", blurb: "A bit of everything from words you've learned.", needs: "words" },
  { id: "type", title: "Type the German", de: "Schreiben", blurb: "See the English, type the German word. No multiple choice.", needs: "words" },
  { id: "dictation", title: "Dictation", de: "Diktat", blurb: "Listen to a word or sentence and type exactly what you hear.", needs: "units" },
  { id: "conj", title: "Verb endings", de: "Konjugation", blurb: "Type the right form: du ___ (sprechen).", needs: "units" },
  { id: "sentences", title: "Sentences", de: "Sätze", blurb: "Fill-in-the-blank and sentence building from your lessons.", needs: "units" },
  { id: "gender", title: "der, die, das", de: "Artikel", blurb: "Rapid-fire gender practice with your nouns.", needs: "words" },
  { id: "listen", title: "Listening", de: "Hören", blurb: "Hear a word, pick what you heard.", needs: "words" },
  { id: "weak", title: "Tricky words", de: "Schwierige Wörter", blurb: "The flashcards you've missed the most.", needs: "words" },
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
  const weak = useMemo(() => {
    const scored = deck
      .map((w) => ({ w, c: state.cards[w.id] }))
      .filter(({ c }) => c && (c.lapses > 0 || c.ease < 2.4))
      .sort((a, b) => b.c.lapses - a.c.lapses || a.c.ease - b.c.ease)
      .map(({ w }) => w);
    return scored;
  }, [deck, state.cards]);

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

  if (result) {
    const m = MODES.find((x) => x.id === result.mode)!;
    return (
      <div className="page">
        <section className="panel stack done-card">
          <p className="big">
            {result.correct}/{result.total}
          </p>
          <h2>{m.title}: done</h2>
          <p className="muted">You earned {result.xp} XP.</p>
          <div className="stack" style={{ width: "100%" }}>
            <button className="btn block" onClick={() => start(result.mode)}>
              Another round
            </button>
            <button className="btn ghost block" onClick={() => setResult(null)}>
              Pick something else
            </button>
          </div>
        </section>
      </div>
    );
  }

  const hasWords = deck.length >= 4;
  const hasUnits = doneUnits.length > 0;

  return (
    <div className="page">
      <div className="page-head">
        <h1>Practice</h1>
        <p className="sub">Short rounds using what you've already learned. Most of them have you typing, not just tapping.</p>
      </div>

      {!hasWords && !hasUnits && (
        <div className="notice">
          <p>
            Practice draws on lessons you've finished. <Link href="/learn">Do your first lesson</Link> and everything here opens up.
          </p>
        </div>
      )}

      <div className="mode-grid">
        {MODES.map((m) => {
          const available = m.needs === "words" ? hasWords : hasUnits;
          const extra = m.id === "weak" && available ? (weak.length ? `${weak.length} words` : "None yet, so this uses your whole deck") : "";
          return (
            <button key={m.id} className="mode-card" disabled={!available} onClick={() => start(m.id)} style={available ? undefined : { opacity: 0.5 }}>
              <h3>{m.title}</h3>
              <span className="de">{m.de}</span>
              <span className="small muted">{m.blurb}</span>
              {extra && <span className="tiny faint">{extra}</span>}
            </button>
          );
        })}
      </div>

      <section className="panel flat stack">
        <h2>Want to write freely?</h2>
        <p className="muted">Translate sentences, answer questions, keep a short journal, or chat in German, and get your mistakes explained.</p>
        <Link href="/write" className="btn ghost">
          Open Write
        </Link>
      </section>
    </div>
  );
}
