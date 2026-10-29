"use client";

import { IS_ES } from "@/lib/lang";
import { useEffect, useMemo, useState } from "react";
import { useStore } from "@/lib/store";
import { findWord } from "@/lib/state";
import type { CourseWord } from "@/content/types";
import { recognitionSupported } from "@/lib/recognize";
import SpeakRunner, { type SpeakItem } from "@/components/SpeakRunner";
import { speakItemsFor, type SpeakMode as Mode } from "@/lib/speak-items";
import SubNav from "@/components/SubNav";
import { skillAccuracy } from "@/lib/mistakes";


const MODES: { id: Mode; title: string; blurb: string }[] = [
  { id: "words", title: "Words & phrases", blurb: `From your flashcards. Good for single sounds like ${IS_ES ? "rr, ñ and j" : "ü, ch and r"}.` },
  { id: "sentences", title: "Sentences", blurb: "Whole sentences from your lessons, read and said." },
  { id: "shadow", title: "Shadowing", blurb: "Hear it first with the text hidden, then repeat it. Trains your ear and mouth together." },
];

export default function SpeakPage() {
  const { state } = useStore();
  const [run, setRun] = useState<{ mode: Mode; items: SpeakItem[] } | null>(null);
  const [result, setResult] = useState<{ correct: number; total: number } | null>(null);
  const [supported, setSupported] = useState(true);

  useEffect(() => setSupported(recognitionSupported()), []);

  const doneUnits = useMemo(() => Object.keys(state.units).filter((id) => state.units[id].completed), [state.units]);
  const deck = useMemo(
    () => Object.keys(state.cards).map((id) => findWord(state, id)).filter(Boolean) as CourseWord[],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [state.cards, state.custom]
  );
  const acc = skillAccuracy(state.skills.speaking);

  if (run) {
    return (
      <div className="page">
        <SpeakRunner
          items={run.items}
          shadow={run.mode === "shadow"}
          onExit={() => setRun(null)}
          onDone={(r) => {
            setResult(r);
            setRun(null);
          }}
        />
      </div>
    );
  }

  return (
    <div className="page">
      <SubNav group="practice" />
      <div className="page-head">
        <h1>Speaking</h1>
        <p className="sub">
          Say it out loud and the site checks what it heard. Words it couldn't make out turn red, so you know which sounds to work on.
        </p>
      </div>

      {!supported && (
        <p className="notice small">
          This browser can't check speech, so you'll grade yourself. For automatic checking, use Chrome or Edge on a computer, or Safari
          on iPhone (opened in Safari itself, not from the home screen icon).
        </p>
      )}

      {result && (
        <section className="panel">
          <p>
            <b>
              {result.correct} of {result.total}
            </b>{" "}
            <span className="muted">said clearly enough to be understood.</span>
          </p>
        </section>
      )}

      <div className="mode-grid">
        {MODES.map((m) => (
          <button
            key={m.id}
            className="mode-card"
            onClick={() => {
              setResult(null);
              setRun({ mode: m.id, items: speakItemsFor(m.id, deck, doneUnits) });
            }}
          >
            <b>{m.title}</b>
            <span className="small muted">{m.blurb}</span>
          </button>
        ))}
      </div>

      <p className="small faint">
        {acc !== undefined ? `Recently understood: ${Math.round(acc * 100)}% of the time. ` : ""}
        Speak at a normal pace in a quiet spot. The first time, your browser will ask to use the microphone.
      </p>
    </div>
  );
}
