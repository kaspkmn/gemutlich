"use client";

import { L } from "@/lib/lang";
import { useMemo, useState } from "react";
import { useStore } from "@/lib/store";
import { cloneExercise, exerciseAnswer, type Exercise } from "@/lib/exercises";
import { FIX_TARGET, SKILLS, mistakeKey, pickMistakes, skillOf, skillLabel, type Skill } from "@/lib/mistakes";
import ExerciseRunner, { describeExercise, type RunResult } from "@/components/ExerciseRunner";
import SubNav from "@/components/SubNav";
import { IconTrash } from "@/components/Icons";
import WhyBox from "@/components/WhyBox";
import { explain } from "@/lib/explain";

export default function MistakesPage() {
  const { state, removeMistake } = useStore();
  const [filter, setFilter] = useState<Skill | "all">("all");
  const [run, setRun] = useState<Exercise[] | null>(null);
  const [result, setResult] = useState<RunResult | null>(null);

  const entries = useMemo(() => Object.entries(state.mistakes).map(([key, e]) => ({ key, ...e })), [state.mistakes]);
  const bySkill = useMemo(() => {
    const m = new Map<Skill, number>();
    for (const e of entries) m.set(skillOf(e.ex), (m.get(skillOf(e.ex)) ?? 0) + 1);
    return m;
  }, [entries]);
  const shown = entries
    .filter((e) => filter === "all" || skillOf(e.ex) === filter)
    .sort((a, b) => b.misses - a.misses || b.last - a.last);

  const start = () => {
    const picked = pickMistakes(state.mistakes, 12, filter === "all" ? undefined : filter);
    if (picked.length) {
      setResult(null);
      setRun(picked.map((m) => cloneExercise(m.ex)));
      window.scrollTo({ top: 0 });
    }
  };

  if (run) {
    return (
      <div className="page">
        <ExerciseRunner
          exercises={run}
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
        <h1>Mistake notebook</h1>
        <p className="sub">
          Everything you get wrong, anywhere on the site, lands here. Get a question right {FIX_TARGET} times in a row and it's
          cleared.
        </p>
      </div>

      {result && (
        <section className="panel">
          <p>
            {result.correct} of {result.total} right.{" "}
            <span className="muted">Each right answer moves a mistake one step closer to cleared.</span>
          </p>
        </section>
      )}

      <section className="panel stack">
        <div className="row between">
          <div>
            <b style={{ fontSize: "1.6rem", fontWeight: 600 }}>{entries.length}</b>
            <span className="muted"> to fix</span>
          </div>
          <span className="small faint">{state.stats.mastered} cleared so far</span>
        </div>
        <button className="btn block" disabled={!shown.length} onClick={start}>
          {shown.length ? `Fix ${Math.min(12, shown.length)} now` : "Nothing to fix"}
        </button>
      </section>

      {entries.length > 0 && (
        <>
          <div className="chips" role="group" aria-label="Filter by skill">
            <button className="chip" aria-pressed={filter === "all"} onClick={() => setFilter("all")}>
              All ({entries.length})
            </button>
            {SKILLS.filter((s) => bySkill.get(s.id)).map((s) => (
              <button key={s.id} className="chip" aria-pressed={filter === s.id} onClick={() => setFilter(s.id)}>
                {s.label} ({bySkill.get(s.id)})
              </button>
            ))}
          </div>

          <ul className="word-list">
            {shown.map((e) => (
              <li key={e.key} className="word-item" style={{ alignItems: "flex-start" }}>
                <div className="grow stack tight">
                  <p className="small muted">{describeExercise(e.ex)}</p>
                  {e.given && (
                    <p className="small">
                      <span className="faint">You last answered: </span>
                      <span className="review-given" lang={L.code}>
                        {e.given}
                      </span>
                    </p>
                  )}
                  <p lang={L.code} style={{ fontWeight: 500 }}>
                    {e.given && <span className="faint small" style={{ fontWeight: 400 }}>Answer: </span>}
                    {exerciseAnswer(e.ex)}
                  </p>
                  <MistakeWhy ex={e.ex} given={e.given} />
                  <div className="row wrap" style={{ gap: 8 }}>
                    <span className="pill">{skillLabel(skillOf(e.ex))}</span>
                    <span className="tiny faint">
                      missed {e.misses}×, {e.fixed}/{FIX_TARGET} right in a row
                    </span>
                  </div>
                </div>
                <button
                  className="icon-btn"
                  aria-label="Remove from notebook"
                  title="Remove"
                  onClick={() => {
                    const k = mistakeKey(e.ex);
                    if (k) removeMistake(k);
                  }}
                >
                  <IconTrash size={17} />
                </button>
              </li>
            ))}
          </ul>
        </>
      )}

      {entries.length === 0 && (
        <p className="notice">
          Clean slate. As you practice and take tests, anything you miss shows up here so it doesn't slip through.
        </p>
      )}
    </div>
  );
}

function MistakeWhy({ ex, given }: { ex: Exercise; given?: string }) {
  const why = explain(ex, given);
  if (!why || !(why.points.length || why.letters || why.words || why.table)) return null;
  return (
    <details className="why-details">
      <summary>Why?</summary>
      <WhyBox why={why} title={given ? "Why it's wrong" : "Why"} />
    </details>
  );
}
