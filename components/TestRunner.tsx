"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Exercise } from "@/lib/exercises";
import { ExerciseView, type Answer } from "./ExerciseRunner";
import { IconX } from "./Icons";

export interface TestAnswer {
  ex: Exercise;
  correct: boolean;
  given: string;
  answer: string;
  translation?: string;
}

export function formatTime(sec: number): string {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

/** Test mode: no hints, no right/wrong until the end, no retries. */
export default function TestRunner({
  exercises,
  title,
  showTimer,
  onFinish,
  onQuit,
}: {
  exercises: Exercise[];
  title: string;
  showTimer: boolean;
  onFinish: (answers: TestAnswer[], seconds: number) => void;
  onQuit: () => void;
}) {
  const [i, setI] = useState(0);
  const [locked, setLocked] = useState(false);
  const [confirmQuit, setConfirmQuit] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const answers = useRef<TestAnswer[]>([]);
  const started = useRef(Date.now());
  const total = exercises.length;
  const ex = exercises[i];

  useEffect(() => {
    const t = setInterval(() => setElapsed(Math.floor((Date.now() - started.current) / 1000)), 1000);
    return () => clearInterval(t);
  }, []);

  const record = useCallback(
    (a: Answer | null) => {
      if (!ex || locked) return;
      setLocked(true);
      answers.current.push({
        ex,
        correct: a ? a.correct : false,
        given: a?.given ?? "",
        answer: a?.answer ?? "",
        translation: a?.translation,
      });
      // a short pause so a tapped answer visibly registers
      setTimeout(
        () => {
          if (i + 1 >= total) {
            onFinish(answers.current, Math.round((Date.now() - started.current) / 1000));
          } else {
            setI(i + 1);
            setLocked(false);
          }
        },
        a ? 320 : 0
      );
    },
    [ex, locked, i, total, onFinish]
  );

  if (!ex) return null;

  return (
    <div className="runner">
      <div className="runner-top">
        <button className="close-btn" onClick={() => setConfirmQuit(true)} aria-label="Quit test">
          <IconX />
        </button>
        <div className="segbar grow" role="progressbar" aria-valuenow={i} aria-valuemin={0} aria-valuemax={total}>
          <div style={{ width: `${(i / total) * 100}%` }} />
        </div>
      </div>

      <div className="test-hud">
        <span className="hud-tag">{title}</span>
        <span className="hud-count">
          {i + 1}
          <span className="faint"> / {total}</span>
        </span>
        {showTimer && <span className="hud-time">{formatTime(elapsed)}</span>}
      </div>

      {confirmQuit ? (
        <section className="panel stack">
          <h2>Quit this test?</h2>
          <p className="muted">Your answers so far won't be saved.</p>
          <div className="row wrap">
            <button className="btn danger grow" onClick={onQuit}>
              Quit
            </button>
            <button className="btn ghost grow" onClick={() => setConfirmQuit(false)}>
              Keep going
            </button>
          </div>
        </section>
      ) : (
        <>
          <ExerciseView key={ex.id} ex={ex} locked={locked} reveal={false} onAnswer={(a) => record(a)} />
          <button className="link-btn small" style={{ alignSelf: "center" }} onClick={() => record(null)} disabled={locked}>
            Skip this question
          </button>
        </>
      )}
    </div>
  );
}
