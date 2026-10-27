"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useCallback, useEffect, useMemo, useState } from "react";
import { useStore } from "@/lib/store";
import { bestTest } from "@/lib/state";
import { buildTest, QTYPES, specFromParams, xpForTest, type TestSpec } from "@/lib/tests";
import { cloneExercise, type Exercise } from "@/lib/exercises";
import { speechSupported } from "@/lib/speech";
import { PASS_MARK } from "@/lib/level";
import TestRunner, { type TestAnswer } from "@/components/TestRunner";
import TestResults from "@/components/TestResults";
import ExerciseRunner from "@/components/ExerciseRunner";
import { IconArrowLeft } from "@/components/Icons";

type Phase =
  | { t: "intro" }
  | { t: "running"; exercises: Exercise[] }
  | { t: "results"; answers: TestAnswer[]; seconds: number; xp: number; newBest: boolean }
  | { t: "practice"; exercises: Exercise[]; back: Extract<Phase, { t: "results" }> };

function RunTest() {
  const params = useSearchParams();
  const router = useRouter();
  const { state, ready, logTest, recordAnswers } = useStore();
  const [spec, setSpec] = useState<TestSpec | null | undefined>(undefined);
  const [phase, setPhase] = useState<Phase>({ t: "intro" });
  const [noSound, setNoSound] = useState(false);

  useEffect(() => {
    const s = specFromParams(new URLSearchParams(params.toString()));
    if (s && !speechSupported() && s.types.includes("listening")) {
      setNoSound(true);
      const types = s.types.filter((t) => t !== "listening");
      setSpec(types.length ? { ...s, types } : null);
    } else {
      setSpec(s);
    }
  }, [params]);

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [phase.t]);

  const best = useMemo(() => (spec ? bestTest(state, spec.id) : undefined), [spec, state]);
  const attempts = useMemo(() => (spec ? state.tests.filter((t) => t.id === spec.id).length : 0), [spec, state.tests]);

  const start = useCallback(() => {
    if (!spec) return;
    const exercises = buildTest(spec);
    if (exercises.length) setPhase({ t: "running", exercises });
  }, [spec]);

  const finish = useCallback(
    (answers: TestAnswer[], seconds: number) => {
      if (!spec) return;
      const correct = answers.filter((a) => a.correct).length;
      const total = answers.length;
      const xp = xpForTest(correct, total);
      const prev = bestTest(state, spec.id);
      const newBest = spec.id !== "custom" && prev !== undefined && total > 0 && correct / total > prev;
      logTest({ id: spec.id, title: spec.subtitle ? `${spec.title}: ${spec.subtitle}` : spec.title, correct, total, seconds }, xp);
      recordAnswers(answers.map((a) => ({ ex: a.ex, correct: a.correct })));
      setPhase({ t: "results", answers, seconds, xp, newBest });
    },
    [spec, state, logTest, recordAnswers]
  );

  if (spec === undefined || !ready) return <div className="page" />;

  if (spec === null) {
    return (
      <div className="page">
        <h1>Test not found</h1>
        <p className="muted">
          {noSound
            ? "This test only had listening questions, and this browser can't play German audio."
            : "This link doesn't match any test."}
        </p>
        <Link href="/test" className="btn">
          Back to tests
        </Link>
      </div>
    );
  }

  if (phase.t === "running") {
    return (
      <div className="page">
        <TestRunner
          exercises={phase.exercises}
          title={spec.title}
          showTimer={spec.timed}
          onFinish={finish}
          onQuit={() => setPhase({ t: "intro" })}
        />
      </div>
    );
  }

  if (phase.t === "results") {
    return (
      <TestResults
        title={spec.title}
        subtitle={spec.subtitle}
        answers={phase.answers}
        seconds={phase.seconds}
        xp={phase.xp}
        newBest={phase.newBest}
        onRetry={start}
        onPracticeMissed={() =>
          setPhase({
            t: "practice",
            exercises: phase.answers.filter((a) => !a.correct).map((a) => cloneExercise(a.ex)),
            back: phase,
          })
        }
      />
    );
  }

  if (phase.t === "practice") {
    return (
      <div className="page">
        <p className="small muted">Practice mode: you'll see the answer after each one.</p>
        <ExerciseRunner exercises={phase.exercises} onExit={() => setPhase(phase.back)} onDone={() => setPhase(phase.back)} />
      </div>
    );
  }

  // intro
  const typeLabels = QTYPES.filter((q) => spec.types.includes(q.id)).map((q) => q.label);
  return (
    <div className="page">
      <div className="page-head">
        <button className="back-link" onClick={() => router.push("/test")}>
          <IconArrowLeft size={15} /> All tests
        </button>
        <h1>{spec.title}</h1>
        {spec.subtitle && <p className="sub">{spec.subtitle}</p>}
      </div>

      <section className="panel stack">
        <div className="intro-grid">
          <div>
            <b>{spec.count}</b>
            <span>questions</span>
          </div>
          <div>
            <b>{Math.round(PASS_MARK * 100)}%</b>
            <span>to pass</span>
          </div>
          <div>
            <b>{best !== undefined ? `${Math.round(best * 100)}%` : "None"}</b>
            <span>best score</span>
          </div>
        </div>
        <p className="muted small">Question types: {typeLabels.join(", ")}.</p>
        <ul className="rules">
          <li>No hints, and you won't see right or wrong until the end.</li>
          <li>Each test is a new random set of questions.</li>
          {spec.timed && <li>The clock runs, but there's no time limit.</li>}
          {spec.types.includes("listening") && <li>Turn your sound on for the listening questions.</li>}
          {noSound && <li>Listening questions are off because this browser can't play German audio.</li>}
        </ul>
        <button className="btn block" onClick={start}>
          {attempts ? "Start a new attempt" : "Start test"}
        </button>
      </section>
    </div>
  );
}

export default function RunTestPage() {
  return (
    <Suspense fallback={<div className="page" />}>
      <RunTest />
    </Suspense>
  );
}
