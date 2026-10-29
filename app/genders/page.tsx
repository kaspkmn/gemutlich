"use client";

import Link from "next/link";
import { Fragment, useMemo, useState } from "react";
import { ALL_WORDS } from "@/content/course";
import type { CourseWord } from "@/content/types";
import { useStore } from "@/lib/store";
import { findWord } from "@/lib/state";
import { genderable, genderExercise, sample, type Exercise } from "@/lib/exercises";
import { ARTICLE, EXCEPTIONS, GUIDE, RULES, analyzeNoun, guessGender, type G3, type GenderRule } from "@/lib/gender-rules";
import { IS_ES, L, bareNoun } from "@/lib/lang";
import ExerciseRunner, { type RunResult } from "@/components/ExerciseRunner";
import SubNav from "@/components/SubNav";

const NOUNS = ALL_WORDS.filter((w) => w.type === "noun" && w.gender && w.gender !== "pl");

/** Course nouns that each rule correctly predicts, for "from your lessons" examples. */
function courseExamples(): Map<string, CourseWord[]> {
  const m = new Map<string, CourseWord[]>();
  for (const w of NOUNS) {
    const g = guessGender(bareNoun(w.de), w.en);
    if (!g?.rule || g.gender !== w.gender) continue;
    const list = m.get(g.rule.id) ?? [];
    list.push(w);
    m.set(g.rule.id, list);
  }
  return m;
}

/** "**bold**" → <b> */
function Rich({ text }: { text: string }) {
  const parts = text.split(/\*\*(.+?)\*\*/g);
  return (
    <>
      {parts.map((p, i) =>
        i % 2 ? (
          <b key={i} lang={L.code}>
            {p}
          </b>
        ) : (
          <Fragment key={i}>{p}</Fragment>
        )
      )}
    </>
  );
}

const genderOfArticle = (de: string): G3 => (/^(die|la|las) /.test(de) ? "f" : /^das /.test(de) ? "n" : "m");

export default function GendersPage() {
  const { state } = useStore();
  const [q, setQ] = useState("");
  const [scope, setScope] = useState<"mine" | "all" | null>(null);
  const [run, setRun] = useState<Exercise[] | null>(null);
  const [result, setResult] = useState<RunResult | null>(null);

  const examples = useMemo(courseExamples, []);

  const myNouns = useMemo(
    () =>
      Object.keys(state.cards)
        .map((id) => findWord(state, id))
        .filter((w): w is CourseWord => Boolean(w && w.type === "noun" && w.gender)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [state.cards, state.custom]
  );
  const activeScope = scope ?? (myNouns.length >= 5 ? "mine" : "all");
  const pool = activeScope === "mine" ? myNouns : NOUNS;

  const groups = useMemo(() => {
    const follows: { w: CourseWord; why: string }[] = [];
    const exceptions: { w: CourseWord; why: string }[] = [];
    const memorize: { w: CourseWord; why: string }[] = [];
    for (const w of pool) {
      const a = analyzeNoun(w);
      if (!a || a.gender === "pl") continue;
      if (a.follows) follows.push({ w, why: a.explanation });
      else if (a.guess) exceptions.push({ w, why: a.explanation });
      else memorize.push({ w, why: a.explanation });
    }
    const byDe = (x: { w: CourseWord }, y: { w: CourseWord }) => bareNoun(x.w.de).localeCompare(bareNoun(y.w.de), L.code);
    return { follows: follows.sort(byDe), exceptions: exceptions.sort(byDe), memorize: memorize.sort(byDe) };
  }, [pool]);

  const check = useMemo(() => checkNoun(q, myNouns), [q, myNouns]);

  const startPractice = () => {
    const src = (myNouns.filter(genderable).length >= 5 ? myNouns : NOUNS).filter(genderable);
    const picked = sample(src, Math.min(15, src.length)).map(genderExercise);
    if (picked.length) {
      setResult(null);
      setRun(picked);
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

  const genders: G3[] = IS_ES ? ["m", "f"] : ["m", "f", "n"];

  return (
    <div className="page">
      <SubNav group="learn" />
      <div className="page-head">
        <h1>Noun genders</h1>
        <p className="sub">{GUIDE.intro}</p>
      </div>

      {result && (
        <section className="panel">
          <p>
            {result.correct} of {result.total} right.{" "}
            <span className="muted">Anything you missed is in your mistake notebook, with the reason.</span>
          </p>
        </section>
      )}

      {/* ── the basics ── */}
      <section className="stack">
        <h2 className="section-title">The basics</h2>
        <div className="gender-trio">
          {GUIDE.basics.map((b) => (
            <div key={b.article + b.label} className={`gender-card g-${b.cls}`}>
              <b className="gtext" lang={L.code}>
                {b.article}
              </b>
              <span>{b.label}</span>
              <span className="tiny faint" lang={L.code}>
                {b.examples}
              </span>
            </div>
          ))}
        </div>
        <ul className="plain-list">
          {GUIDE.bullets.map((b) => (
            <li key={b}>
              <Rich text={b} />
            </li>
          ))}
          <li>
            Throughout this site,{" "}
            {genders.map((g, i) => (
              <Fragment key={g}>
                {i > 0 && (i === genders.length - 1 ? " and " : ", ")}
                {ARTICLE[g]} is <span className={`g-${g} gtext`}>{{ m: "blue", f: "pink", n: "green" }[g]}</span>
              </Fragment>
            ))}
            , to help them stick.
          </li>
        </ul>
        <button className="btn block" onClick={startPractice}>
          Practice {L.genderOptions.join(", ").replace(/, ([^,]*)$/, IS_ES ? " or $1" : ", $1")}
        </button>
      </section>

      {/* ── checker ── */}
      <section className="panel stack">
        <h2 className="section-title" style={{ margin: 0 }}>
          Guess a noun&apos;s gender
        </h2>
        <p className="small muted">Type any {L.name} noun and see which pattern it follows.</p>
        <input
          className="text-input"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={GUIDE.checkerPlaceholder}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck={false}
          lang={L.code}
          aria-label={`A ${L.name} noun`}
        />
        {check && (
          <div className={`gender-answer g-${check.gender ?? "x"}`} role="status">
            {check.gender ? (
              <p className="gender-answer-word" lang={L.code}>
                <span className="gtext">{ARTICLE[check.gender]}</span> {check.bare}
                <span className="tiny faint"> {check.known ? "known word" : `best guess, ${check.reliability}`}</span>
              </p>
            ) : (
              <p className="gender-answer-word" lang={L.code}>
                ??? {check.bare}
              </p>
            )}
            <p className="small">{check.reason}</p>
          </div>
        )}
      </section>

      {/* ── rules ── */}
      {GUIDE.sections.map((s) => (
        <section key={s.gender} className="stack">
          <h2 className={`section-title g-${s.gender}`}>
            <span className="gtext">{s.title}</span>
          </h2>
          <p className="small muted">{s.intro}</p>
          <div className="rule-list">
            {RULES.filter((r) => r.gender === s.gender).map((r) => (
              <RuleCard key={r.id} r={r} from={examples.get(r.id) ?? []} />
            ))}
          </div>
        </section>
      ))}

      {/* ── extra sections: compounds, el agua, people ── */}
      {GUIDE.extras.map((x) => (
        <section key={x.title} className="stack">
          <h2 className="section-title">{x.title}</h2>
          <p className="small muted">{x.intro}</p>
          <ul className="word-list">
            {x.items.map((it) => (
              <li key={it.de} className="word-item">
                <span className={`bar g-${it.gender ?? genderOfArticle(it.de)}`} />
                <div className="grow stack tight">
                  <span className="de" lang={L.code}>
                    {it.de} <span className="faint small">({it.en})</span>
                  </span>
                  {it.note && <span className="tiny faint">{it.note}</span>}
                </div>
              </li>
            ))}
          </ul>
        </section>
      ))}

      {/* ── same word, different gender ── */}
      <section className="stack">
        <h2 className="section-title">Same word, different gender</h2>
        <p className="small muted">{GUIDE.sameWordIntro}</p>
        <ul className="word-list">
          {GUIDE.sameWord.map(([a, ae, b, be]) => (
            <li key={a} className="word-item">
              <div className="grow stack tight">
                <span lang={L.code}>
                  <b style={{ fontWeight: 500 }}>{a}</b> <span className="faint small">{ae}</span>
                </span>
                <span lang={L.code}>
                  <b style={{ fontWeight: 500 }}>{b}</b> <span className="faint small">{be}</span>
                </span>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* ── your words ── */}
      <section className="stack">
        <div className="row between wrap">
          <h2 className="section-title" style={{ margin: 0 }}>
            {activeScope === "mine" ? "Your nouns" : "Nouns in the course"}
          </h2>
          <div className="chips">
            <button className="chip" aria-pressed={activeScope === "mine"} onClick={() => setScope("mine")} disabled={!myNouns.length}>
              My flashcards ({myNouns.length})
            </button>
            <button className="chip" aria-pressed={activeScope === "all"} onClick={() => setScope("all")}>
              Whole course
            </button>
          </div>
        </div>
        <p className="small muted">
          Of {groups.follows.length + groups.exceptions.length + groups.memorize.length} nouns, {groups.follows.length} follow a
          pattern, {groups.exceptions.length} break one, and {groups.memorize.length} you just have to memorize. Focus your effort on
          the last two groups.
        </p>
        <NounGroup title="Exceptions to learn" items={groups.exceptions} open />
        <NounGroup title="No pattern, memorize these" items={groups.memorize} />
        <NounGroup title="Follow a pattern" items={groups.follows} />
      </section>

      <p className="small faint">
        <Link href={GUIDE.footer.href} className="why-link">
          {GUIDE.footer.label}
        </Link>{" "}
        covers articles, and the{" "}
        <Link href="/grammar" className="why-link">
          grammar page
        </Link>{" "}
        has every table from the lessons.
      </p>
    </div>
  );
}

function RuleCard({ r, from }: { r: GenderRule; from: CourseWord[] }) {
  const exampleSet = new Set(r.examples);
  const extra = from.filter((w) => !exampleSet.has(w.de)).slice(0, 6);
  return (
    <div className={`rule-card g-${r.gender}`}>
      <div className="row between" style={{ alignItems: "baseline" }}>
        <b className="rule-label">{r.label}</b>
        <span className={`pill${r.reliability === "always" ? " red" : ""}`}>{r.reliability}</span>
      </div>
      <p className="small" lang={L.code}>
        {r.examples.map((e, i) => (
          <span key={e}>
            {i > 0 && ", "}
            <span className="gtext">{e.split(" ")[0]}</span> {e.split(" ").slice(1).join(" ")}
          </span>
        ))}
      </p>
      {r.note && <p className="small muted">{r.note}</p>}
      {r.exceptions?.length ? (
        <p className="small">
          <span className="faint">Exceptions: </span>
          <span lang={L.code}>{r.exceptions.join(", ")}</span>
        </p>
      ) : null}
      {extra.length > 0 && (
        <p className="tiny faint">
          From your lessons: <span lang={L.code}>{extra.map((w) => w.de).join(", ")}</span>
        </p>
      )}
    </div>
  );
}

function NounGroup({ title, items, open }: { title: string; items: { w: CourseWord; why: string }[]; open?: boolean }) {
  if (!items.length) return null;
  return (
    <details className="grammar-unit" open={open}>
      <summary>
        <b style={{ fontWeight: 500 }}>{title}</b>
        <span className="faint small">{items.length}</span>
      </summary>
      <ul className="word-list" style={{ marginBottom: 14 }}>
        {items.map(({ w, why }) => (
          <li key={w.id} className="word-item" style={{ alignItems: "flex-start" }}>
            <span className={`bar g-${w.gender}`} />
            <div className="grow stack tight">
              <span className="de" lang={L.code}>
                {w.de} <span className="faint small">({w.en})</span>
              </span>
              <span className="tiny muted">{why}</span>
            </div>
          </li>
        ))}
      </ul>
    </details>
  );
}

interface CheckResult {
  bare: string;
  gender?: G3;
  known: boolean;
  reliability?: string;
  reason: string;
}

/** Look up a typed noun: a known word first, otherwise a pattern guess. */
function checkNoun(input: string, mine: CourseWord[]): CheckResult | null {
  let bare = input
    .trim()
    .replace(IS_ES ? /^(el|la|los|las)\s+/i : /^(der|die|das)\s+/i, "")
    .replace(/[.,!?¿¡]/g, "");
  if (bare.length < 2) return null;
  // German nouns are capitalized, Spanish ones aren't
  bare = IS_ES ? bare.toLowerCase() : bare[0].toUpperCase() + bare.slice(1);
  const lower = bare.toLowerCase();
  const known = [...mine, ...NOUNS].find((w) => w.gender && w.gender !== "pl" && bareNoun(w.de).toLowerCase() === lower);
  if (known) {
    const a = analyzeNoun(known);
    return { bare: bareNoun(known.de), gender: known.gender as G3, known: true, reason: a ? a.explanation : "" };
  }
  const exc = EXCEPTIONS[lower];
  if (exc) {
    const a = analyzeNoun({ de: `${ARTICLE[exc]} ${bare}`, en: "", gender: exc });
    return { bare, gender: exc, known: true, reason: a ? a.explanation : `${bare} is an exception: ${ARTICLE[exc]} ${bare}.` };
  }
  const g = guessGender(bare);
  if (!g) return { bare, known: false, reason: GUIDE.noPattern };
  return { bare, gender: g.gender, known: false, reliability: g.reliability, reason: g.reason };
}

