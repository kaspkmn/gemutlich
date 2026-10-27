"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useStore } from "@/lib/store";
import { nextStep, planSession, type Stage } from "@/lib/session";
import FlashcardDeck from "@/components/FlashcardDeck";
import ExerciseRunner from "@/components/ExerciseRunner";
import SpeakRunner from "@/components/SpeakRunner";

export default function SessionPage() {
  const { state, ready } = useStore();
  const [stages, setStages] = useState<Stage[] | null>(null);
  const [step, setStep] = useState(0);
  const [startXp, setStartXp] = useState(0);

  // build the plan once, after progress has loaded
  useEffect(() => {
    if (ready && stages === null) {
      setStages(planSession(state));
      setStartXp(state.xp);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready]);

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [step]);

  if (!stages) return <div className="page" />;

  const nxt = nextStep(state);

  if (!stages.length) {
    return (
      <div className="page">
        <div className="page-head">
          <h1>Today's session</h1>
          <p className="sub">Nothing to review yet. Your sessions fill up with flashcards, mistakes and practice as you finish lessons.</p>
        </div>
        <Link href={nxt.href} className="btn block">
          {nxt.label}
        </Link>
      </div>
    );
  }

  const advance = () => setStep((s) => s + 1);
  const exit = () => setStep(stages.length);
  const stage = stages[step];

  const header = (
    <div className="stack tight">
      <div className="session-steps" aria-label={`Part ${Math.min(step + 1, stages.length)} of ${stages.length}`}>
        {stages.map((_, k) => (
          <span key={k} className={k < step ? "done" : k === step ? "now" : ""} />
        ))}
      </div>
      {stage && (
        <p className="tiny faint">
          Part {step + 1} of {stages.length}: {stage.label}
        </p>
      )}
    </div>
  );

  if (!stage) {
    return (
      <div className="page">
        {header}
        <section className="panel stack done-card">
          <p className="big red">Fertig!</p>
          <p className="muted">Done for today. +{state.xp - startXp} XP.</p>
          <div className="stack" style={{ width: "100%" }}>
            <Link href={nxt.href} className="btn block">
              Keep going: {nxt.label}
            </Link>
            <Link href="/" className="btn ghost block">
              Back home
            </Link>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="page">
      {header}
      {stage.kind === "cards" && <FlashcardDeck key={step} ids={stage.ids} onDone={advance} onExit={exit} />}
      {(stage.kind === "mistakes" || stage.kind === "focus") && (
        <ExerciseRunner key={step} exercises={stage.ex} onDone={advance} onExit={exit} />
      )}
      {stage.kind === "speak" && <SpeakRunner key={step} items={stage.items} onDone={advance} onExit={exit} />}
    </div>
  );
}
