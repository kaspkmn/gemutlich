"use client";

import { L } from "@/lib/lang";
import { useEffect, useRef, useState } from "react";
import { useStore } from "@/lib/store";
import { NUMBER_MODES, checkNumber, makeNumberItem, type NumberItem, type NumberMode } from "@/lib/numbers";
import { speechSupported } from "@/lib/speech";
import { useSpeak } from "@/components/SpeakButton";
import SubNav from "@/components/SubNav";
import { IconSpeaker, IconX } from "@/components/Icons";

const ROUND = 10;

export default function NumbersPage() {
  const { recordSkill } = useStore();
  const say = useSpeak();
  const [mode, setMode] = useState<NumberMode>("hundred");
  const [how, setHow] = useState<"listen" | "read">("listen");
  const [canSpeak, setCanSpeak] = useState(true);
  const [round, setRound] = useState<NumberItem[] | null>(null);
  const [i, setI] = useState(0);
  const [value, setValue] = useState("");
  const [checked, setChecked] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const ok = speechSupported();
    setCanSpeak(ok);
    if (!ok) setHow("read");
  }, []);

  const item = round?.[i];

  useEffect(() => {
    if (!item) return;
    inputRef.current?.focus();
    if (how === "listen") {
      const t = setTimeout(() => say(item.de), 250);
      return () => clearTimeout(t);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [item, how]);

  const start = () => {
    setRound(Array.from({ length: ROUND }, () => makeNumberItem(mode)));
    setI(0);
    setValue("");
    setChecked(null);
    setScore(0);
    setFinished(false);
  };

  const check = () => {
    if (!item || checked !== null || !value.trim()) return;
    const ok = checkNumber(value, item, mode);
    setChecked(ok);
    if (ok) setScore((s) => s + 1);
    recordSkill("numbers", ok, ok ? 3 : 0);
    if (how === "listen" && !ok) say(item.de);
  };

  const next = () => {
    if (i + 1 >= ROUND) {
      setFinished(true);
      return;
    }
    setI(i + 1);
    setValue("");
    setChecked(null);
  };

  const info = NUMBER_MODES.find((m) => m.id === mode)!;

  if (round && !finished && item) {
    return (
      <div className="page">
        <div className="runner">
          <div className="runner-top">
            <button className="close-btn" onClick={() => setRound(null)} aria-label="Stop">
              <IconX />
            </button>
            <div className="progress grow">
              <div style={{ width: `${(i / ROUND) * 100}%` }} />
            </div>
            <span className="small faint">
              {i + 1}/{ROUND}
            </span>
          </div>

          <p className="prompt-label">{info.label}</p>

          {how === "listen" ? (
            <div className="row">
              <button className="speak big" onClick={() => say(item.de)} aria-label="Play again">
                <IconSpeaker size={28} />
              </button>
              <button className="link-btn" onClick={() => say(item.de, true)}>
                Play slowly
              </button>
            </div>
          ) : (
            <p className="number-said" lang={L.code}>
              {item.de}
            </p>
          )}

          <form
            className="stack"
            onSubmit={(e) => {
              e.preventDefault();
              if (checked === null) check();
              else next();
            }}
          >
            <input
              ref={inputRef}
              className="text-input"
              inputMode={mode === "prices" || mode === "clock" || mode === "time" ? "decimal" : "numeric"}
              autoComplete="off"
              placeholder={info.hint}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              disabled={checked !== null}
              aria-label={info.hint}
            />
            {checked === null ? (
              <button className="btn block" type="submit" disabled={!value.trim()}>
                Check
              </button>
            ) : (
              <div className={`feedback ${checked ? "good" : "bad"}`} style={{ position: "static" }}>
                <span className="verdict">{checked ? L.praise[0] : L.wrong}</span>
                <p>
                  <span className="muted">Answer: </span>
                  <b>{item.answer}</b>
                </p>
                <p className="small muted" lang={L.code}>
                  {item.de}
                </p>
                <button className="btn block" type="submit" autoFocus>
                  {i + 1 >= ROUND ? "See results" : "Next"}
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <SubNav group="practice" />
      <div className="page-head">
        <h1>Numbers & time</h1>
        <p className="sub">
          Prices, clock times and phone numbers come up constantly and go by fast. Hear them (or read them) and type the digits.
        </p>
      </div>

      {finished && round && (
        <section className="panel">
          <p>
            <b>
              {score} of {ROUND}
            </b>{" "}
            <span className="muted">right. +{score * 3} XP.</span>
          </p>
        </section>
      )}

      <section className="panel stack">
        <div className="field">
          <span className="label">What to practice</span>
          <div className="chips">
            {NUMBER_MODES.map((m) => (
              <button key={m.id} className="chip" aria-pressed={mode === m.id} onClick={() => setMode(m.id)}>
                {m.label}
              </button>
            ))}
          </div>
          <p className="small faint">
            Example: {info.example}
          </p>
        </div>
        <div className="field">
          <span className="label">How</span>
          <div className="chips">
            <button className="chip" aria-pressed={how === "listen"} disabled={!canSpeak} onClick={() => setHow("listen")}>
              Listen
            </button>
            <button className="chip" aria-pressed={how === "read"} onClick={() => setHow("read")}>
              Read
            </button>
          </div>
        </div>
        {info.tip && <p className="tip">{info.tip}</p>}
        <button className="btn block" onClick={start}>
          Start {ROUND} questions
        </button>
      </section>
    </div>
  );
}
