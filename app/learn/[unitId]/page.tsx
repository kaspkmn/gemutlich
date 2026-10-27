"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { getUnit, UNITS } from "@/content/course";
import type { CourseWord } from "@/content/types";
import { useStore } from "@/lib/store";
import { lessonExercises, type Exercise } from "@/lib/exercises";
import ExerciseRunner, { type RunResult } from "@/components/ExerciseRunner";
import Notes from "@/components/Notes";
import SpeakButton from "@/components/SpeakButton";
import GenderTag, { GermanWord } from "@/components/GenderTag";
import { IconArrowLeft, IconArrowRight } from "@/components/Icons";

type Step = "words" | "notes" | "practice";

export default function UnitPage() {
  const params = useParams<{ unitId: string }>();
  const router = useRouter();
  const unit = getUnit(params.unitId);
  const { state, completeUnit } = useStore();
  const [step, setStep] = useState<Step>("words");
  const [run, setRun] = useState<Exercise[] | null>(null);
  const [result, setResult] = useState<(RunResult & { added: number }) | null>(null);

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [step, run, result]);

  if (!unit) {
    return (
      <div className="page">
        <h1>Lesson not found</h1>
        <Link href="/learn" className="btn">
          Back to the course
        </Link>
      </div>
    );
  }

  const nextUnit = UNITS.find((u) => u.n === unit.n + 1);

  if (run) {
    return (
      <div className="page">
        <ExerciseRunner
          exercises={run}
          onExit={() => setRun(null)}
          onDone={(r) => {
            const accuracy = r.total ? r.correct / r.total : 1;
            const bonus = state.units[unit.id]?.completed ? 10 : 20;
            const { added } = completeUnit(unit.id, accuracy);
            setResult({ ...r, xp: r.xp + bonus, added });
            setRun(null);
          }}
        />
      </div>
    );
  }

  if (result) {
    const pct = Math.round((result.correct / Math.max(1, result.total)) * 100);
    return (
      <div className="page">
        <section className="panel stack done-card">
          <p className="big">{pct}%</p>
          <h2>{pct >= 90 ? "Ausgezeichnet!" : pct >= 70 ? "Gut gemacht!" : "Geschafft!"}</h2>
          <p className="muted">
            {pct >= 90 ? "Excellent!" : pct >= 70 ? "Well done!" : "Done!"} You got {result.correct} of {result.total} right on the
            first try and earned {result.xp} XP.
          </p>
          {result.added > 0 && (
            <p>
              {result.added} new words went into your flashcards. They're ready to review today.
            </p>
          )}
          <div className="stack" style={{ width: "100%" }}>
            {nextUnit && (
              <button className="btn block" onClick={() => router.push(`/learn/${nextUnit.id}`)}>
                Next lesson: {nextUnit.title}
              </button>
            )}
            <Link className="btn ghost block" href={`/test/run?id=unit:${unit.id}`}>
              Take the lesson test
            </Link>
            {result.added > 0 && (
              <Link className="btn ghost block" href="/review">
                Review the new cards
              </Link>
            )}
            <button
              className="btn ghost block"
              onClick={() => {
                setResult(null);
                setRun(lessonExercises(unit));
              }}
            >
              Practice this lesson again
            </button>
          </div>
        </section>
      </div>
    );
  }

  const words: CourseWord[] = unit.words.map((w) => ({ ...w, id: w.de, unitId: unit.id }));
  const progress = state.units[unit.id];

  return (
    <div className="page">
      <div className="page-head">
        <Link href="/learn" className="back-link">
          <IconArrowLeft size={15} /> Lesson {unit.n} of {UNITS.length}
        </Link>
        <h1>{unit.title}</h1>
        <p className="sub">{unit.titleDe}</p>
      </div>

      <div className="steps" role="tablist" aria-label="Lesson steps">
        {(
          [
            ["words", "1. Words"],
            ["notes", "2. Notes"],
            ["practice", "3. Practice"],
          ] as [Step, string][]
        ).map(([id, label]) => (
          <button key={id} role="tab" aria-selected={step === id} onClick={() => setStep(id)}>
            {label}
          </button>
        ))}
      </div>

      {step === "words" && <WordsStep words={words} onNext={() => setStep("notes")} />}

      {step === "notes" && (
        <>
          <Notes notes={unit.notes} />
          <button className="btn block" onClick={() => setStep("practice")}>
            On to practice
          </button>
        </>
      )}

      {step === "practice" && (
        <section className="panel stack">
          <h2>Practice</h2>
          <p className="muted">
            About 20 quick exercises: recognizing, listening, matching, picking genders, finishing sentences, and typing words
            yourself. Anything you miss comes back once at the end.
          </p>
          {progress?.completed && (
            <p className="small faint">
              Finished {progress.times} {progress.times === 1 ? "time" : "times"}, best score {Math.round(progress.best * 100)}%.
            </p>
          )}
          <button className="btn block" onClick={() => setRun(lessonExercises(unit))}>
            Start practice
          </button>
          <Link className="btn ghost block" href={`/test/run?id=unit:${unit.id}`}>
            Take the lesson test
          </Link>
        </section>
      )}
    </div>
  );
}

function WordsStep({ words, onNext }: { words: CourseWord[]; onNext: () => void }) {
  const [i, setI] = useState(0);
  const [list, setList] = useState(false);
  const w = words[i];
  const last = i === words.length - 1;

  useEffect(() => {
    if (list) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement) return;
      if (e.key === "ArrowRight") setI((x) => Math.min(words.length - 1, x + 1));
      if (e.key === "ArrowLeft") setI((x) => Math.max(0, x - 1));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [list, words.length]);

  const listView = useMemo(
    () => (
      <ul className="word-list">
        {words.map((x) => (
          <li key={x.id} className="word-item">
            <span className={`bar g-${x.gender ?? ""}`} />
            <div className="grow">
              <p className="de">{x.de}</p>
              <p className="small muted">
                {x.en}
                {x.plural ? `  (plural: ${x.plural})` : ""}
              </p>
            </div>
            <SpeakButton text={x.de} />
          </li>
        ))}
      </ul>
    ),
    [words]
  );

  return (
    <div className="stack">
      <div className="row between">
        <p className="small muted">{list ? `${words.length} words` : `Word ${i + 1} of ${words.length}`}</p>
        <button className="link-btn" onClick={() => setList(!list)}>
          {list ? "One at a time" : "See all as a list"}
        </button>
      </div>

      {list ? (
        listView
      ) : (
        <div className={`tile g-${w.gender ?? ""}`}>
          <div className="stack">
            <div className="row">
              <p className="tile-word grow" lang="de">
                <GermanWord de={w.de} gender={w.gender} />
              </p>
              <SpeakButton text={w.de} big />
            </div>
            <p className="tile-en">{w.en}</p>
            <div className="row wrap">
              <GenderTag gender={w.gender} />
              {w.plural && <span className="small muted">plural: {w.plural}</span>}
            </div>
            {w.note && <p className="small">{w.note}</p>}
            {w.ex && (
              <div className="example row">
                <div className="grow">
                  <p className="de" lang="de">
                    {w.ex[0]}
                  </p>
                  <p className="muted small">{w.ex[1]}</p>
                </div>
                <SpeakButton text={w.ex[0]} />
              </div>
            )}
          </div>
        </div>
      )}

      {list ? (
        <button className="btn block" onClick={onNext}>
          Read the notes
        </button>
      ) : (
        <div className="row">
          <button className="btn ghost" onClick={() => setI(Math.max(0, i - 1))} disabled={i === 0} aria-label="Previous word">
            <IconArrowLeft />
          </button>
          {last ? (
            <button className="btn grow" onClick={onNext}>
              Read the notes
            </button>
          ) : (
            <button className="btn grow" onClick={() => setI(i + 1)}>
              Next word <IconArrowRight size={18} />
            </button>
          )}
        </div>
      )}
    </div>
  );
}
