"use client";

import Link from "next/link";
import { Fragment } from "react";
import { UNITS } from "@/content/course";
import { useStore } from "@/lib/store";
import { bestTest } from "@/lib/state";
import { BOSSES } from "@/lib/tests";
import { PASS_MARK } from "@/lib/level";
import RankBadge from "@/components/RankBadge";
import SubNav from "@/components/SubNav";
import { IconCheck, IconExam } from "@/components/Icons";

export default function LearnPage() {
  const { state } = useStore();
  const nextId = UNITS.find((u) => !state.units[u.id]?.completed)?.id;
  const done = UNITS.filter((u) => state.units[u.id]?.completed).length;

  return (
    <div className="page">
      <SubNav group="learn" />
      <div className="page-head">
        <h1>Lessons</h1>
        <p className="sub">
          {done === 0
            ? `${UNITS.length} lessons, from your first sounds to talking about the past, with a review test after every 4.`
            : `${done} of ${UNITS.length} finished.`}
        </p>
      </div>

      <ol className="units">
        {UNITS.map((u) => {
          const p = state.units[u.id];
          const s = p?.completed ? "done" : u.id === nextId ? "next" : "todo";
          const testBest = bestTest(state, `unit:${u.id}`);
          const boss = BOSSES.find((b) => b.units[b.units.length - 1] === u.id);
          const bossBest = boss ? bestTest(state, `boss:${boss.n}`) : undefined;
          return (
            <Fragment key={u.id}>
              <li>
                <Link href={`/learn/${u.id}`} className="unit-row" data-state={s}>
                  <span className="unit-num" aria-hidden>
                    {s === "done" ? <IconCheck size={16} /> : u.n}
                  </span>
                  <span className="unit-body">
                    <h3>
                      {u.title}
                      <span className="next-tag">Next</span>
                    </h3>
                    <span className="de" lang="de">
                      {u.titleDe}
                    </span>
                    <p className="small muted" style={{ marginTop: 4 }}>
                      {u.blurb}
                    </p>
                  </span>
                  {testBest !== undefined && <RankBadge score={testBest} />}
                </Link>
              </li>
              {boss && (
                <li>
                  <Link
                    href={`/test/run?id=boss:${boss.n}`}
                    className="boss-marker"
                    data-cleared={bossBest !== undefined && bossBest >= PASS_MARK ? "1" : undefined}
                  >
                    <span className="unit-num" aria-hidden>
                      <IconExam size={16} />
                    </span>
                    <span className="unit-body">
                      <h3>Review test {boss.n}</h3>
                      <p className="tiny faint">{boss.title}, 25 questions</p>
                    </span>
                    {bossBest !== undefined && <RankBadge score={bossBest} />}
                  </Link>
                </li>
              )}
            </Fragment>
          );
        })}
      </ol>
    </div>
  );
}
