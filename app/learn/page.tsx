"use client";

import Link from "next/link";
import { Fragment } from "react";
import { UNITS } from "@/content/course";
import { useStore } from "@/lib/store";
import { bestTest } from "@/lib/state";
import { BOSSES } from "@/lib/tests";
import { PASS_MARK } from "@/lib/level";
import RankBadge from "@/components/RankBadge";
import { IconCheck, IconSkull } from "@/components/Icons";

export default function LearnPage() {
  const { state } = useStore();
  const nextId = UNITS.find((u) => !state.units[u.id]?.completed)?.id;
  const done = UNITS.filter((u) => state.units[u.id]?.completed).length;

  return (
    <div className="page">
      <div className="page-head">
        <h1>Course</h1>
        <p className="sub">
          {done === 0
            ? "16 lessons from your first sounds to finding your way around town, with a boss test after every 4. Go in order, or jump to anything that looks useful."
            : `${done} of ${UNITS.length} lessons finished.`}
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
                    <span>{s === "done" ? <IconCheck size={22} /> : u.n}</span>
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
                    <p className="tiny faint" style={{ marginTop: 4 }}>
                      {u.words.length} words
                      {p?.completed ? `, practice best ${Math.round(p.best * 100)}%` : ""}
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
                      <span>
                        <IconSkull size={22} />
                      </span>
                    </span>
                    <span className="unit-body">
                      <h3>
                        Boss {boss.n}: {boss.title}
                      </h3>
                      <p className="tiny faint" style={{ marginTop: 2 }}>
                        {bossBest !== undefined ? `Best ${Math.round(bossBest * 100)}%` : "25-question test on the last 4 lessons"}
                      </p>
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
