"use client";

import Link from "next/link";
import { UNITS } from "@/content/course";
import { useStore } from "@/lib/store";
import { IconCheck } from "@/components/Icons";

export default function LearnPage() {
  const { state } = useStore();
  const nextId = UNITS.find((u) => !state.units[u.id]?.completed)?.id;
  const done = UNITS.filter((u) => state.units[u.id]?.completed).length;

  return (
    <div className="page">
      <div className="page-head">
        <h1>Your course</h1>
        <p className="sub">
          {done === 0
            ? "Sixteen short lessons from your first sounds to finding your way around town. Go in order, or jump to anything that looks useful."
            : `${done} of ${UNITS.length} lessons finished.`}
        </p>
      </div>

      <ol className="units">
        {UNITS.map((u) => {
          const p = state.units[u.id];
          const s = p?.completed ? "done" : u.id === nextId ? "next" : "todo";
          return (
            <li key={u.id}>
              <Link href={`/learn/${u.id}`} className="unit-row" data-state={s}>
                <span className="unit-num" aria-hidden>
                  {s === "done" ? <IconCheck size={22} /> : u.n}
                </span>
                <span className="unit-body">
                  <h3>{u.title}</h3>
                  <span className="de">{u.titleDe}</span>
                  <p className="small muted" style={{ marginTop: 4 }}>
                    {u.blurb}
                  </p>
                  <p className="tiny faint" style={{ marginTop: 4 }}>
                    {u.words.length} words
                    {p?.completed ? `, best score ${Math.round(p.best * 100)}%` : ""}
                  </p>
                </span>
              </Link>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
