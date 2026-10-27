"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { UNITS } from "@/content/course";
import type { GrammarSection } from "@/content/types";
import { norm } from "@/lib/answers";
import Notes from "@/components/Notes";
import SubNav from "@/components/SubNav";

const sectionText = (n: GrammarSection) =>
  [n.title, ...n.body, n.tip ?? "", ...(n.table ? [...n.table.head, ...n.table.rows.flat()] : [])].join(" ");

export default function GrammarPage() {
  const [q, setQ] = useState("");
  const nq = norm(q);

  const results = useMemo(() => {
    if (!nq) return null;
    return UNITS.map((u) => ({ u, notes: u.notes.filter((n) => norm(sectionText(n)).includes(nq)) })).filter((x) => x.notes.length);
  }, [nq]);

  return (
    <div className="page">
      <SubNav group="learn" />
      <div className="page-head">
        <h1>Grammar</h1>
        <p className="sub">Every table and explanation from the lessons in one place. Search for a word like dem, weil or Perfekt.</p>
      </div>

      <input
        className="text-input"
        type="search"
        placeholder="Search grammar"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        aria-label="Search grammar"
      />

      {results ? (
        results.length === 0 ? (
          <p className="notice">Nothing matches "{q}". Try a shorter word.</p>
        ) : (
          <div className="stack">
            {results.map(({ u, notes }) => (
              <section key={u.id} className="stack tight">
                <Link href={`/learn/${u.id}`} className="small faint" style={{ textDecoration: "none" }}>
                  Lesson {u.n}: {u.title}
                </Link>
                <Notes notes={notes} />
              </section>
            ))}
          </div>
        )
      ) : (
        <div>
          {UNITS.map((u) => (
            <details key={u.id} className="grammar-unit">
              <summary>
                <span className="test-num">{u.n}</span>
                <span className="grow">
                  <b style={{ display: "block", fontWeight: 600 }}>{u.title}</b>
                  <span className="tiny faint">{u.notes.map((n) => n.title).join(", ")}</span>
                </span>
              </summary>
              <Notes notes={u.notes} />
            </details>
          ))}
        </div>
      )}
    </div>
  );
}
