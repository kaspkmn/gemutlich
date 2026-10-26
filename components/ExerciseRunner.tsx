"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { Exercise } from "@/lib/exercises";
import { shuffle } from "@/lib/exercises";
import { checkText, checkWord, tokens } from "@/lib/answers";
import { useStore } from "@/lib/store";
import SpeakButton, { useSpeak } from "./SpeakButton";
import UmlautKeys from "./UmlautKeys";
import { GermanWord } from "./GenderTag";
import { IconX } from "./Icons";

export interface RunResult {
  correct: number;
  total: number;
  xp: number;
}

interface Answer {
  correct: boolean;
  /** shown as a yellow "almost": counts as wrong but gently */
  almost?: boolean;
  message?: string;
  answer?: string;
  translation?: string;
  speak?: string;
}

const PRAISE = ["Richtig!", "Genau!", "Super!", "Sehr gut!", "Prima!", "Toll!"];

export default function ExerciseRunner({
  exercises,
  onDone,
  onExit,
}: {
  exercises: Exercise[];
  onDone: (r: RunResult) => void;
  onExit: () => void;
}) {
  const { recordExercise, state } = useStore();
  const say = useSpeak();
  const [queue, setQueue] = useState<Exercise[]>(exercises);
  const [i, setI] = useState(0);
  const [fb, setFb] = useState<Answer | null>(null);
  const [praise, setPraise] = useState(PRAISE[0]);
  const retried = useRef(new Set<string>());
  const tally = useRef({ correct: 0, xp: 0 });
  const total = exercises.length;

  const ex = queue[i];
  const isRetry = ex ? ex.id.endsWith("~r") : false;

  const answer = useCallback(
    (a: Answer) => {
      if (!ex || fb) return;
      setFb(a);
      setPraise(PRAISE[Math.floor(Math.random() * PRAISE.length)]);
      const xp = a.correct ? (isRetry ? 2 : 5) : 0;
      if (a.correct && !isRetry) tally.current.correct += 1;
      tally.current.xp += xp;
      recordExercise(a.correct, xp);
      if (!a.correct && !retried.current.has(ex.id) && !isRetry) {
        retried.current.add(ex.id);
        setQueue((q) => [...q, { ...ex, id: `${ex.id}~r` } as Exercise]);
      }
      if (a.speak && state.settings.autoplay) say(a.speak);
    },
    [ex, fb, isRetry, recordExercise, say, state.settings.autoplay]
  );

  const next = useCallback(() => {
    setFb(null);
    if (i + 1 >= queue.length) {
      onDone({ correct: tally.current.correct, total, xp: tally.current.xp });
    } else {
      setI(i + 1);
    }
  }, [i, queue.length, onDone, total]);

  // Enter continues after feedback.
  useEffect(() => {
    if (!fb) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        e.preventDefault();
        next();
      }
    };
    const t = setTimeout(() => window.addEventListener("keydown", onKey), 150);
    return () => {
      clearTimeout(t);
      window.removeEventListener("keydown", onKey);
    };
  }, [fb, next]);

  if (!ex) return null;
  const pct = Math.min(100, (Math.min(i, total) / total) * 100);

  return (
    <div className="runner">
      <div className="runner-top">
        <button className="close-btn" onClick={onExit} aria-label="Stop practicing">
          <IconX />
        </button>
        <div className="progress" role="progressbar" aria-valuenow={Math.round(pct)} aria-valuemin={0} aria-valuemax={100}>
          <div style={{ width: `${pct}%` }} />
        </div>
      </div>

      {isRetry && <p className="tiny faint">Second try</p>}

      <ExerciseView key={ex.id} ex={ex} locked={!!fb} onAnswer={answer} />

      {fb && (
        <div className={`feedback ${fb.correct ? "good" : fb.almost ? "warn" : "bad"}`} role="status">
          <div className="row between">
            <span className="verdict">{fb.correct ? praise : fb.almost ? "Fast! (Almost!)" : "Nicht ganz. (Not quite.)"}</span>
            {fb.speak && <SpeakButton text={fb.speak} />}
          </div>
          {fb.message && <p>{fb.message}</p>}
          {fb.answer && (!fb.correct || fb.message) && (
            <p>
              <span className="muted">Answer: </span>
              <b>{fb.answer}</b>
            </p>
          )}
          {fb.translation && <p className="muted small">{fb.translation}</p>}
          <button className="btn block" onClick={next} autoFocus>
            Continue
          </button>
        </div>
      )}
    </div>
  );
}

// ── individual exercise views ──────────────────────────────────────────────

type ViewProps = { ex: Exercise; locked: boolean; onAnswer: (a: Answer) => void };

function ExerciseView({ ex, locked, onAnswer }: ViewProps) {
  switch (ex.kind) {
    case "mc":
      return <MultipleChoice ex={ex} locked={locked} onAnswer={onAnswer} />;
    case "listen":
      return <Listen ex={ex} locked={locked} onAnswer={onAnswer} />;
    case "type":
      return <TypeWord ex={ex} locked={locked} onAnswer={onAnswer} />;
    case "gender":
      return <GenderPick ex={ex} locked={locked} onAnswer={onAnswer} />;
    case "match":
      return <Match ex={ex} locked={locked} onAnswer={onAnswer} />;
    case "fill":
      return <Fill ex={ex} locked={locked} onAnswer={onAnswer} />;
    case "build":
      return <Build ex={ex} locked={locked} onAnswer={onAnswer} />;
    case "choice":
      return <Choice ex={ex} locked={locked} onAnswer={onAnswer} />;
    case "dictation":
      return <Dictation ex={ex} locked={locked} onAnswer={onAnswer} />;
    case "conj":
      return <Conjugate ex={ex} locked={locked} onAnswer={onAnswer} />;
  }
}

function Options({
  options,
  answer,
  locked,
  onPick,
  render,
}: {
  options: string[];
  answer: string;
  locked: boolean;
  onPick: (opt: string) => void;
  render?: (opt: string) => React.ReactNode;
}) {
  const [picked, setPicked] = useState<string | null>(null);
  const pick = useCallback(
    (o: string) => {
      if (locked || picked) return;
      setPicked(o);
      onPick(o);
    },
    [locked, picked, onPick]
  );

  useEffect(() => {
    if (locked) return;
    const onKey = (e: KeyboardEvent) => {
      const n = Number(e.key);
      if (n >= 1 && n <= options.length) pick(options[n - 1]);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [locked, options, pick]);

  return (
    <div className="options">
      {options.map((o, idx) => {
        let s: string | undefined;
        if (picked) s = o === answer ? "right" : o === picked ? "wrong" : "dim";
        return (
          <button key={o} className="option" data-state={s} disabled={locked || !!picked} onClick={() => pick(o)}>
            <span className="key">{idx + 1}</span>
            <span>{render ? render(o) : o}</span>
          </button>
        );
      })}
    </div>
  );
}

function useAutoSpeak(text: string | undefined, enabled: boolean) {
  const say = useSpeak();
  const { state } = useStore();
  useEffect(() => {
    if (!text || !enabled || !state.settings.autoplay) return;
    const t = setTimeout(() => say(text), 250);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}

function MultipleChoice({ ex, locked, onAnswer }: ViewProps & { ex: Extract<Exercise, { kind: "mc" }> }) {
  const w = ex.word;
  useAutoSpeak(w.de, ex.dir === "de-en");
  return (
    <div className="stack">
      <p className="prompt-label">{ex.dir === "de-en" ? "What does this mean?" : "How do you say this in German?"}</p>
      <div className="row">
        <p className="prompt-big grow">{ex.dir === "de-en" ? w.de : w.en}</p>
        {ex.dir === "de-en" && <SpeakButton text={w.de} />}
      </div>
      <Options
        options={ex.options}
        answer={ex.answer}
        locked={locked}
        onPick={(o) =>
          onAnswer({
            correct: o === ex.answer,
            answer: ex.answer,
            translation: ex.dir === "de-en" ? undefined : w.en,
            speak: w.de,
          })
        }
      />
    </div>
  );
}

function Listen({ ex, locked, onAnswer }: ViewProps & { ex: Extract<Exercise, { kind: "listen" }> }) {
  const say = useSpeak();
  const w = ex.word;
  useAutoSpeak(w.de, true);
  return (
    <div className="stack">
      <p className="prompt-label">What did you hear?</p>
      <div className="row">
        <SpeakButton text={w.de} big label="Play again" />
        <button className="link-btn" onClick={() => say(w.de, true)}>
          Play slowly
        </button>
      </div>
      <Options
        options={ex.options}
        answer={w.de}
        locked={locked}
        onPick={(o) => onAnswer({ correct: o === w.de, answer: w.de, translation: w.en })}
      />
    </div>
  );
}

function TextAnswer({
  locked,
  onSubmit,
  placeholder = "Type in German",
}: {
  locked: boolean;
  onSubmit: (v: string) => void;
  placeholder?: string;
}) {
  const [v, setV] = useState("");
  const ref = useRef<HTMLInputElement>(null);
  useEffect(() => {
    ref.current?.focus();
  }, []);
  return (
    <form
      className="stack"
      onSubmit={(e) => {
        e.preventDefault();
        if (!locked && v.trim()) onSubmit(v);
      }}
    >
      <input
        ref={ref}
        className="text-input"
        value={v}
        onChange={(e) => setV(e.target.value)}
        placeholder={placeholder}
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck={false}
        lang="de"
        disabled={locked}
        aria-label={placeholder}
      />
      {!locked && (
        <>
          <UmlautKeys target={ref} onInsert={setV} />
          <button className="btn block" type="submit" disabled={!v.trim()}>
            Check
          </button>
        </>
      )}
    </form>
  );
}

function TypeWord({ ex, locked, onAnswer }: ViewProps & { ex: Extract<Exercise, { kind: "type" }> }) {
  const w = ex.word;
  return (
    <div className="stack">
      <p className="prompt-label">Write this in German</p>
      <p className="prompt-big">{w.en}</p>
      {w.type === "noun" && <p className="small faint">Include the article: der, die or das.</p>}
      <TextAnswer
        locked={locked}
        onSubmit={(v) => {
          const r = checkWord(v, w);
          onAnswer({
            correct: r.status === "correct" || r.status === "typo",
            almost: r.status === "almost",
            message: r.message,
            answer: w.de,
            speak: w.de,
          });
        }}
      />
    </div>
  );
}

function GenderPick({ ex, locked, onAnswer }: ViewProps & { ex: Extract<Exercise, { kind: "gender" }> }) {
  const w = ex.word;
  const [article, ...rest] = w.de.split(" ");
  const bare = rest.join(" ");
  return (
    <div className="stack">
      <p className="prompt-label">der, die or das?</p>
      <div className="row">
        <p className="prompt-big grow">
          ___ {bare}
          <span className="tile-en" style={{ display: "block", fontFamily: "var(--font-body)" }}>
            {w.en}
          </span>
        </p>
      </div>
      <div className="gender-options">
        <Options
          options={["der", "die", "das"]}
          answer={article}
          locked={locked}
          onPick={(o) => onAnswer({ correct: o === article, answer: w.de, speak: w.de })}
        />
      </div>
    </div>
  );
}

function Match({ ex, locked, onAnswer }: ViewProps & { ex: Extract<Exercise, { kind: "match" }> }) {
  const left = useMemo(() => shuffle(ex.words), [ex.words]);
  const right = useMemo(() => shuffle(ex.words), [ex.words]);
  const [l, setL] = useState<string | null>(null);
  const [r, setR] = useState<string | null>(null);
  const [gone, setGone] = useState<Set<string>>(new Set());
  const [shake, setShake] = useState<string | null>(null);
  const mistakes = useRef(0);
  const say = useSpeak();

  useEffect(() => {
    if (!l || !r) return;
    if (l === r) {
      const g = new Set(gone).add(l);
      setGone(g);
      setL(null);
      setR(null);
      if (g.size === ex.words.length) {
        const ok = mistakes.current <= 1;
        onAnswer({
          correct: ok,
          message: ok ? undefined : `${mistakes.current} mismatches this time. These pairs will come back.`,
        });
      }
    } else {
      mistakes.current++;
      setShake(`${l}|${r}`);
      const t = setTimeout(() => {
        setShake(null);
        setL(null);
        setR(null);
      }, 400);
      return () => clearTimeout(t);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [l, r]);

  const state = (id: string, side: "l" | "r") => {
    if (gone.has(id)) return "gone";
    if ((side === "l" ? l : r) === id) return "picked";
    return undefined;
  };

  return (
    <div className="stack">
      <p className="prompt-label">Match the pairs</p>
      <div className="match-grid">
        <div className="stack">
          {left.map((w) => (
            <button
              key={w.id}
              className={`option${shake && shake.startsWith(`${w.id}|`) ? " shake" : ""}`}
              data-state={state(w.id, "l")}
              disabled={locked}
              onClick={() => {
                setL(w.id);
                say(w.de);
              }}
            >
              {w.de}
            </button>
          ))}
        </div>
        <div className="stack">
          {right.map((w) => (
            <button
              key={w.id}
              className={`option${shake && shake.endsWith(`|${w.id}`) ? " shake" : ""}`}
              data-state={state(w.id, "r")}
              disabled={locked}
              onClick={() => setR(w.id)}
            >
              {w.en}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function Fill({ ex, locked, onAnswer }: ViewProps & { ex: Extract<Exercise, { kind: "fill" }> }) {
  const [chosen, setChosen] = useState<string | null>(null);
  const full = ex.de.replace("___", ex.answer);
  const [before, after] = ex.de.split("___");
  return (
    <div className="stack">
      <p className="prompt-label">Fill in the blank</p>
      <p className="sentence">
        {before}
        <span className="blank">{chosen ?? " "}</span>
        {after}
      </p>
      <p className="muted">{ex.en}</p>
      <Options
        options={ex.options}
        answer={ex.answer}
        locked={locked}
        onPick={(o) => {
          setChosen(o);
          onAnswer({ correct: o === ex.answer, answer: full, speak: full });
        }}
      />
    </div>
  );
}

function Build({ ex, locked, onAnswer }: ViewProps & { ex: Extract<Exercise, { kind: "build" }> }) {
  const [picked, setPicked] = useState<number[]>([]);
  const target = tokens(ex.de);
  const built = picked.map((p) => ex.tiles[p]);
  return (
    <div className="stack">
      <p className="prompt-label">Build the sentence in German</p>
      <p className="prompt-big">{ex.en}</p>
      <div className="build-answer" aria-label="Your sentence">
        {picked.map((p, idx) => (
          <button
            key={`${p}-${idx}`}
            className="word-chip"
            disabled={locked}
            style={{ visibility: "visible" }}
            onClick={() => setPicked(picked.filter((_, j) => j !== idx))}
          >
            {ex.tiles[p]}
          </button>
        ))}
      </div>
      <div className="build-bank">
        {ex.tiles.map((t, idx) => (
          <button
            key={idx}
            className="word-chip"
            disabled={locked || picked.includes(idx)}
            onClick={() => setPicked([...picked, idx])}
          >
            {t}
          </button>
        ))}
      </div>
      {!locked && (
        <button
          className="btn block"
          disabled={!picked.length}
          onClick={() => {
            const ok = built.join(" ") === target.join(" ");
            onAnswer({ correct: ok, answer: ex.de, speak: ex.de });
          }}
        >
          Check
        </button>
      )}
    </div>
  );
}

function Choice({ ex, locked, onAnswer }: ViewProps & { ex: Extract<Exercise, { kind: "choice" }> }) {
  return (
    <div className="stack">
      <p className="prompt-big" style={{ fontSize: "1.5rem" }}>
        {ex.q}
      </p>
      <Options
        options={ex.options}
        answer={ex.answer}
        locked={locked}
        onPick={(o) => onAnswer({ correct: o === ex.answer, answer: ex.answer, message: ex.explain })}
      />
    </div>
  );
}

function Dictation({ ex, locked, onAnswer }: ViewProps & { ex: Extract<Exercise, { kind: "dictation" }> }) {
  const say = useSpeak();
  useAutoSpeak(ex.de, true);
  return (
    <div className="stack">
      <p className="prompt-label">Type what you hear</p>
      <div className="row">
        <SpeakButton text={ex.de} big label="Play again" />
        <button className="link-btn" onClick={() => say(ex.de, true)}>
          Play slowly
        </button>
      </div>
      <TextAnswer
        locked={locked}
        placeholder="Type the German you hear"
        onSubmit={(v) => {
          const r = checkText(v, [ex.de]);
          onAnswer({
            correct: r.status !== "wrong",
            message: r.message,
            answer: ex.de,
            translation: ex.en,
          });
        }}
      />
    </div>
  );
}

function Conjugate({ ex, locked, onAnswer }: ViewProps & { ex: Extract<Exercise, { kind: "conj" }> }) {
  const form = ex.verb.forms[ex.person];
  const pronoun = ex.pronoun.replace(" (they)", "");
  return (
    <div className="stack">
      <p className="prompt-label">Conjugate the verb</p>
      <p className="prompt-big">
        {ex.pronoun} <span className="blank">&nbsp;</span>
      </p>
      <p className="muted">
        <b>{ex.verb.inf}</b> ({ex.verb.en})
      </p>
      <TextAnswer
        locked={locked}
        placeholder={`${pronoun} ...`}
        onSubmit={(v) => {
          // accept "spricht" or "er spricht"
          const r = checkText(v, [form, `${pronoun} ${form}`]);
          onAnswer({
            correct: r.status !== "wrong",
            message: r.message,
            answer: `${pronoun} ${form}`,
            speak: `${pronoun} ${form}`,
          });
        }}
      />
    </div>
  );
}

export { GermanWord };
