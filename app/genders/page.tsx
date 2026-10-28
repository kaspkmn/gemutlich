"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ALL_WORDS } from "@/content/course";
import type { CourseWord, Gender } from "@/content/types";
import { useStore } from "@/lib/store";
import { findWord } from "@/lib/state";
import { genderable, genderExercise, sample, type Exercise } from "@/lib/exercises";
import { ARTICLE, GENDER_NAME, RULES, analyzeNoun, guessGender, type GenderRule } from "@/lib/gender-rules";
import ExerciseRunner, { type RunResult } from "@/components/ExerciseRunner";
import SubNav from "@/components/SubNav";

type G3 = "m" | "f" | "n";

const NOUNS = ALL_WORDS.filter((w) => w.type === "noun" && w.gender && w.gender !== "pl");
const bareOf = (de: string) => de.replace(/^(der|die|das) /, "");

/** Course nouns that each rule correctly predicts, for "from your lessons" examples. */
function courseExamples(): Map<string, CourseWord[]> {
  const m = new Map<string, CourseWord[]>();
  for (const w of NOUNS) {
    const g = guessGender(bareOf(w.de), w.en);
    if (!g?.rule || g.gender !== w.gender) continue;
    const list = m.get(g.rule.id) ?? [];
    list.push(w);
    m.set(g.rule.id, list);
  }
  return m;
}

const SECTIONS: { gender: G3; title: string; intro: string }[] = [
  {
    gender: "f",
    title: "Signs it's die",
    intro: "Feminine has the most reliable endings. If a noun ends in -ung, -heit, -keit, -schaft or -tät, it's die, no exceptions.",
  },
  {
    gender: "n",
    title: "Signs it's das",
    intro: "Neuter is the smallest group. -chen and -lein are always das, and so is any verb turned into a noun.",
  },
  {
    gender: "m",
    title: "Signs it's der",
    intro: "Masculine is the most common gender. Days, months, seasons and male people are der, and -er, -el and -en lean der too.",
  },
];

const SAME_WORD: [string, string, string, string][] = [
  ["der See", "the lake", "die See", "the sea"],
  ["der Leiter", "the leader, manager", "die Leiter", "the ladder"],
  ["das Steuer", "the steering wheel", "die Steuer", "the tax"],
  ["der Teil", "the part", "das Teil", "the piece, the thing"],
];

const COMPOUNDS: [string, string, string][] = [
  ["der Kühlschrank", "fridge", "kühl (cool) + der Schrank (cupboard)"],
  ["die Haustür", "front door", "das Haus (house) + die Tür (door)"],
  ["das Wohnzimmer", "living room", "wohnen (to live) + das Zimmer (room)"],
  ["der Bahnhof", "train station", "die Bahn (railway) + der Hof (yard)"],
  ["die Bushaltestelle", "bus stop", "der Bus + die Haltestelle (stop)"],
];

const RELIABILITY_TEXT: Record<string, string> = {
  always: "always",
  "almost always": "almost always",
  usually: "usually",
  often: "often",
};

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
    const byDe = (x: { w: CourseWord }, y: { w: CourseWord }) => bareOf(x.w.de).localeCompare(bareOf(y.w.de), "de");
    return { follows: follows.sort(byDe), exceptions: exceptions.sort(byDe), memorize: memorize.sort(byDe) };
  }, [pool]);

  const check = useMemo(() => checkNoun(q, myNouns), [q, myNouns]);

  const startPractice = () => {
    const src = (myNouns.length >= 5 ? myNouns : NOUNS).filter(genderable);
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

  return (
    <div className="page">
      <SubNav group="learn" />
      <div className="page-head">
        <h1>Noun genders</h1>
        <p className="sub">
          Every German noun is der, die or das. For a lot of nouns you just have to learn it, but the ending or meaning often gives it
          away. These are the patterns that actually work.
        </p>
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
          {(["m", "f", "n"] as G3[]).map((g) => (
            <div key={g} className={`gender-card g-${g}`}>
              <b className="gtext">{ARTICLE[g]}</b>
              <span>{GENDER_NAME[g]}</span>
              <span className="tiny faint" lang="de">
                {g === "m" ? "der Tisch, der Mann" : g === "f" ? "die Lampe, die Frau" : "das Buch, das Kind"}
              </span>
            </div>
          ))}
          <div className="gender-card g-pl">
            <b className="gtext">die</b>
            <span>every plural</span>
            <span className="tiny faint" lang="de">
              die Tische, die Bücher
            </span>
          </div>
        </div>
        <ul className="plain-list">
          <li>
            Gender belongs to the <i>word</i>, not the thing. A table isn't male, it's just <b lang="de">der Tisch</b>. And das Mädchen
            (the girl) is neuter because of its -chen ending.
          </li>
          <li>
            All plurals use <b lang="de">die</b>, whatever the gender. That's one less thing to learn.
          </li>
          <li>
            The article changes with its job in the sentence (der becomes den or dem), but you always start from the gender. Get that
            right and the rest follows.
          </li>
          <li>
            Learn every noun together with its article, as one unit: not &quot;Tisch&quot; but &quot;der Tisch&quot;. Throughout this
            site, der is <span className="g-m gtext">blue</span>, die is <span className="g-f gtext">pink</span> and das is{" "}
            <span className="g-n gtext">green</span>, to help them stick.
          </li>
        </ul>
        <button className="btn block" onClick={startPractice}>
          Practice der, die, das
        </button>
      </section>

      {/* ── checker ── */}
      <section className="panel stack">
        <h2 className="section-title" style={{ margin: 0 }}>
          Guess a noun&apos;s gender
        </h2>
        <p className="small muted">Type any German noun and see which pattern it follows.</p>
        <input
          className="text-input"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="e.g. Zeitung, Brötchen, Kühlschrank"
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck={false}
          lang="de"
          aria-label="A German noun"
        />
        {check && (
          <div className={`gender-answer g-${check.gender ?? "x"}`} role="status">
            {check.gender ? (
              <p className="gender-answer-word" lang="de">
                <span className="gtext">{ARTICLE[check.gender]}</span> {check.bare}
                <span className="tiny faint"> {check.known ? "from your words" : `best guess, ${check.reliability}`}</span>
              </p>
            ) : (
              <p className="gender-answer-word" lang="de">
                ??? {check.bare}
              </p>
            )}
            <p className="small">{check.reason}</p>
          </div>
        )}
      </section>

      {/* ── rules ── */}
      {SECTIONS.map((s) => (
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

      {/* ── compounds ── */}
      <section className="stack">
        <h2 className="section-title">Compound nouns: the last part decides</h2>
        <p className="small muted">
          German glues words together. The gender always comes from the last word, so once you know that one, you know them all.
        </p>
        <ul className="word-list">
          {COMPOUNDS.map(([de, en, parts]) => (
            <li key={de} className="word-item">
              <span className={`bar g-${genderOf(de)}`} />
              <div className="grow stack tight">
                <span className="de" lang="de">
                  {de} <span className="faint small">({en})</span>
                </span>
                <span className="tiny faint">{parts}</span>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* ── same word, different gender ── */}
      <section className="stack">
        <h2 className="section-title">Same word, different gender</h2>
        <p className="small muted">A few nouns change meaning with their article. You won&apos;t need these soon, but they show why the article matters.</p>
        <ul className="word-list">
          {SAME_WORD.map(([a, ae, b, be]) => (
            <li key={a} className="word-item">
              <div className="grow stack tight">
                <span lang="de">
                  <b style={{ fontWeight: 500 }}>{a}</b> <span className="faint small">{ae}</span>
                </span>
                <span lang="de">
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
        <Link href="/learn/articles" className="why-link">
          Lesson 6: der, die, das
        </Link>{" "}
        covers articles, and the{" "}
        <Link href="/grammar" className="why-link">
          grammar page
        </Link>{" "}
        has the full tables for den, dem and the rest.
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
        <span className={`pill${r.reliability === "always" ? " red" : ""}`}>{RELIABILITY_TEXT[r.reliability]}</span>
      </div>
      <p className="small" lang="de">
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
          <span lang="de">{r.exceptions.join(", ")}</span>
        </p>
      ) : null}
      {extra.length > 0 && (
        <p className="tiny faint">
          From your lessons: <span lang="de">{extra.map((w) => w.de).join(", ")}</span>
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
              <span className="de" lang="de">
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

function genderOf(de: string): Gender {
  return de.startsWith("der ") ? "m" : de.startsWith("die ") ? "f" : "n";
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
  let bare = input.trim().replace(/^(der|die|das)\s+/i, "").replace(/[.,!?]/g, "");
  if (bare.length < 2) return null;
  bare = bare[0].toUpperCase() + bare.slice(1);
  const lower = bare.toLowerCase();
  const known = [...mine, ...NOUNS].find((w) => w.gender && w.gender !== "pl" && bareOf(w.de).toLowerCase() === lower);
  if (known) {
    const a = analyzeNoun(known);
    return { bare: bareOf(known.de), gender: known.gender as G3, known: true, reason: a ? a.explanation : "" };
  }
  const g = guessGender(bare);
  if (!g) {
    return {
      bare,
      known: false,
      reason:
        "No pattern fits this one, so there's no reliable way to guess. Look it up and learn it with its article. If you had to bet, der is the most common gender.",
    };
  }
  return { bare, gender: g.gender, known: false, reliability: RELIABILITY_TEXT[g.reliability], reason: g.reason };
}
