"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useStore } from "@/lib/store";
import { findWord } from "@/lib/state";
import type { CourseWord } from "@/content/types";
import type { Exercise } from "@/lib/exercises";
import { SKILLS, skillAccuracy, skillOf, type Skill } from "@/lib/mistakes";
import { practiceForSkill } from "@/lib/skill-practice";
import ExerciseRunner, { type RunResult } from "@/components/ExerciseRunner";
import SubNav from "@/components/SubNav";

const OWN_PAGE: Partial<Record<Skill, string>> = { numbers: "/numbers", speaking: "/speak" };

export default function WeakSpotsPage() {
  const { state } = useStore();
  const [run, setRun] = useState<{ skill: Skill; ex: Exercise[] } | null>(null);
  const [result, setResult] = useState<(RunResult & { skill: Skill }) | null>(null);

  const doneUnits = useMemo(() => Object.keys(state.units).filter((id) => state.units[id].completed), [state.units]);
  const deck = useMemo(
    () => Object.keys(state.cards).map((id) => findWord(state, id)).filter(Boolean) as CourseWord[],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [state.cards, state.custom]
  );

  const rows = useMemo(() => {
    const notebook = new Map<Skill, number>();
    for (const e of Object.values(state.mistakes)) notebook.set(skillOf(e.ex), (notebook.get(skillOf(e.ex)) ?? 0) + 1);
    return SKILLS.map((s) => {
      const stat = state.skills[s.id];
      return { ...s, acc: skillAccuracy(stat), answered: stat?.n ?? 0, open: notebook.get(s.id) ?? 0 };
    }).sort((a, b) => {
      // weakest first; skills without enough data go last
      if (a.acc === undefined && b.acc === undefined) return b.answered - a.answered;
      if (a.acc === undefined) return 1;
      if (b.acc === undefined) return -1;
      return a.acc - b.acc;
    });
  }, [state.skills, state.mistakes]);

  const start = (skill: Skill) => {
    const ex = practiceForSkill(skill, deck, doneUnits, state.mistakes);
    if (ex.length) {
      setResult(null);
      setRun({ skill, ex });
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
            setResult({ ...r, skill: run.skill });
            setRun(null);
          }}
        />
      </div>
    );
  }

  const enough = rows.filter((r) => r.acc !== undefined);

  return (
    <div className="page">
      <SubNav group="practice" />
      <div className="page-head">
        <h1>Weak spots</h1>
        <p className="sub">
          How you've done lately in each area, weakest first. It's based on your last 40 answers in each, so it keeps up as you
          improve.
        </p>
      </div>

      {result && (
        <section className="panel">
          <p>
            {SKILLS.find((s) => s.id === result.skill)?.label}: {result.correct} of {result.total} right.
          </p>
        </section>
      )}

      {enough.length === 0 && (
        <p className="notice">
          Not enough answers yet. After a few lessons, practice rounds and tests, your weak spots show up here.
        </p>
      )}

      <section className="panel" style={{ paddingTop: 4, paddingBottom: 4 }}>
        {rows.map((r) => {
          const pct = r.acc === undefined ? undefined : Math.round(r.acc * 100);
          const ownPage = OWN_PAGE[r.id];
          const canPractice = ownPage || doneUnits.length > 0;
          return (
            <div key={r.id} className="skill-row">
              <div className="row between">
                <div>
                  <b style={{ fontWeight: 600 }}>{r.label}</b>
                  <p className="tiny faint">{r.blurb}</p>
                </div>
                <span className={`skill-pct${pct !== undefined && pct < 75 ? " low" : ""}`}>
                  {pct === undefined ? <span className="faint small">not enough yet</span> : `${pct}%`}
                </span>
              </div>
              {pct !== undefined && (
                <div className="bar-track">
                  <div style={{ width: `${pct}%` }} />
                </div>
              )}
              <div className="row between">
                <span className="tiny faint">
                  {r.answered} answered{r.open ? `, ${r.open} in your notebook` : ""}
                </span>
                {canPractice &&
                  (ownPage ? (
                    <Link href={ownPage} className="btn small ghost">
                      Practice
                    </Link>
                  ) : (
                    <button className="btn small ghost" onClick={() => start(r.id)}>
                      Practice
                    </button>
                  ))}
              </div>
            </div>
          );
        })}
      </section>
    </div>
  );
}
