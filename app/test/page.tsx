"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { UNITS, getUnit } from "@/content/course";
import { useStore } from "@/lib/store";
import { bestTest } from "@/lib/state";
import { BOSSES, FINAL_ID, QTYPES, customHref, type QType } from "@/lib/tests";
import { PASS_MARK } from "@/lib/level";
import RankBadge from "@/components/RankBadge";
import { IconCheck, IconSkull, IconTrophy } from "@/components/Icons";

const COUNTS = [10, 20, 30, 50];

export default function TestsPage() {
  const { state, ready } = useStore();
  const router = useRouter();
  const done = useMemo(() => UNITS.filter((u) => state.units[u.id]?.completed).map((u) => u.id), [state.units]);

  // custom test builder
  const [units, setUnits] = useState<string[]>([]);
  const [count, setCount] = useState(20);
  const [types, setTypes] = useState<QType[]>(["choice", "written", "listening", "build"]);
  const [timed, setTimed] = useState(false);
  const [touched, setTouched] = useState(false);

  useEffect(() => {
    if (ready && !touched) setUnits(done.length ? done : [UNITS[0].id]);
  }, [ready, done, touched]);

  const toggleUnit = (id: string) => {
    setTouched(true);
    setUnits((u) => (u.includes(id) ? u.filter((x) => x !== id) : [...u, id]));
  };
  const toggleType = (t: QType) => setTypes((ts) => (ts.includes(t) ? ts.filter((x) => x !== t) : [...ts, t]));

  const finalBest = bestTest(state, FINAL_ID);
  const recent = state.tests.slice(0, 8);

  return (
    <div className="page">
      <div className="page-head">
        <h1>Tests</h1>
        <p className="sub">
          No hints and no instant feedback. You get a score, a rank, and every answer at the end. Score{" "}
          {Math.round(PASS_MARK * 100)}% or more to pass.
        </p>
      </div>

      <section className="stack">
        <h2 className="section-title">Boss tests</h2>
        <div className="boss-grid">
          {BOSSES.map((b) => {
            const best = bestTest(state, `boss:${b.n}`);
            const ready4 = b.units.every((u) => done.includes(u));
            const first = getUnit(b.units[0])!.n;
            const last = getUnit(b.units[b.units.length - 1])!.n;
            return (
              <Link key={b.n} href={`/test/run?id=boss:${b.n}`} className="boss-card" data-cleared={best !== undefined && best >= PASS_MARK ? "1" : undefined}>
                <span className="boss-num">
                  <IconSkull size={20} />
                  Boss {b.n}
                </span>
                <h3>{b.title}</h3>
                <span className="small faint" lang="de">
                  {b.titleDe}
                </span>
                <span className="small muted">
                  Lessons {first} to {last}, 25 questions
                </span>
                <span className="boss-foot">
                  {best !== undefined ? (
                    <>
                      <RankBadge score={best} /> <span className="small muted">best {Math.round(best * 100)}%</span>
                    </>
                  ) : (
                    <span className="small faint">{ready4 ? "Ready when you are" : "Best after these lessons"}</span>
                  )}
                </span>
              </Link>
            );
          })}
          <Link href={`/test/run?id=${FINAL_ID}`} className="boss-card final" data-cleared={finalBest !== undefined && finalBest >= PASS_MARK ? "1" : undefined}>
            <span className="boss-num">
              <IconTrophy size={20} />
              Final
            </span>
            <h3>Final exam</h3>
            <span className="small muted">All {UNITS.length} lessons, 40 questions</span>
            <span className="boss-foot">
              {finalBest !== undefined ? (
                <>
                  <RankBadge score={finalBest} /> <span className="small muted">best {Math.round(finalBest * 100)}%</span>
                </>
              ) : (
                <span className="small faint">The whole course in one go</span>
              )}
            </span>
          </Link>
        </div>
      </section>

      <section className="stack">
        <h2 className="section-title">Lesson tests</h2>
        <p className="small muted" style={{ marginTop: -6 }}>
          15 questions from one lesson.
        </p>
        <ul className="word-list">
          {UNITS.map((u) => {
            const best = bestTest(state, `unit:${u.id}`);
            const finished = done.includes(u.id);
            return (
              <li key={u.id}>
                <Link href={`/test/run?id=unit:${u.id}`} className="word-item test-row">
                  <span className="test-num">{u.n}</span>
                  <span className="grow">
                    <span className="de" style={{ display: "block" }}>
                      {u.title}
                    </span>
                    <span className="tiny faint">
                      {best !== undefined ? `Best ${Math.round(best * 100)}%` : finished ? "Not taken yet" : "Lesson not finished"}
                    </span>
                  </span>
                  {best !== undefined ? <RankBadge score={best} /> : finished ? <IconCheck size={18} className="faint" /> : null}
                </Link>
              </li>
            );
          })}
        </ul>
      </section>

      <section className="panel hud stack">
        <h2>Build your own</h2>

        <div className="field">
          <div className="row between">
            <span className="label">Lessons</span>
            <span className="row" style={{ gap: 4 }}>
              <button
                className="link-btn small"
                onClick={() => {
                  setTouched(true);
                  setUnits(UNITS.map((u) => u.id));
                }}
              >
                All
              </button>
              {done.length > 0 && (
                <button
                  className="link-btn small"
                  onClick={() => {
                    setTouched(true);
                    setUnits(done);
                  }}
                >
                  Finished
                </button>
              )}
              <button
                className="link-btn small"
                onClick={() => {
                  setTouched(true);
                  setUnits([]);
                }}
              >
                None
              </button>
            </span>
          </div>
          <div className="chips">
            {UNITS.map((u) => (
              <button key={u.id} className="chip" aria-pressed={units.includes(u.id)} onClick={() => toggleUnit(u.id)} title={u.title}>
                {u.n}. {u.title}
              </button>
            ))}
          </div>
        </div>

        <div className="field">
          <span className="label">Question types</span>
          <div className="type-grid">
            {QTYPES.map((q) => (
              <label key={q.id} className="type-option">
                <input type="checkbox" checked={types.includes(q.id)} onChange={() => toggleType(q.id)} />
                <span>
                  <b>{q.label}</b>
                  <span className="small muted" style={{ display: "block" }}>
                    {q.blurb}
                  </span>
                </span>
              </label>
            ))}
          </div>
        </div>

        <div className="field">
          <span className="label">Number of questions</span>
          <div className="chips">
            {COUNTS.map((n) => (
              <button key={n} className="chip" aria-pressed={count === n} onClick={() => setCount(n)}>
                {n}
              </button>
            ))}
          </div>
        </div>

        <label className="toggle">
          <span>Show a timer</span>
          <input type="checkbox" checked={timed} onChange={(e) => setTimed(e.target.checked)} />
        </label>

        <button
          className="btn block glow"
          disabled={!units.length || !types.length}
          onClick={() => router.push(customHref(units, count, types, timed))}
        >
          {!units.length ? "Pick at least one lesson" : !types.length ? "Pick at least one question type" : "Start custom test"}
        </button>
      </section>

      {recent.length > 0 && (
        <section className="panel stack">
          <h2>Recent results</h2>
          <ul className="recent-list">
            {recent.map((t) => (
              <li key={t.at} className="row">
                <RankBadge score={t.total ? t.correct / t.total : 0} />
                <span className="grow">
                  <span style={{ display: "block", fontWeight: 600 }}>{t.title}</span>
                  <span className="tiny faint">
                    {t.correct}/{t.total} on {new Date(t.at).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
                  </span>
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
