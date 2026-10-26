"use client";

import { useState } from "react";
import type { AiWord, GradeResult } from "@/lib/ai-client";
import { VERDICT_LABEL } from "@/lib/ai-client";
import { useStore } from "@/lib/store";
import SpeakButton from "./SpeakButton";

export function NewWords({ words }: { words: AiWord[] }) {
  const { addCustomWord, state } = useStore();
  const [added, setAdded] = useState<Set<string>>(new Set());
  if (!words.length) return null;
  return (
    <div className="stack tight">
      <p className="small muted">New words worth keeping</p>
      <div className="stack tight">
        {words.map((w) => {
          const have = Boolean(state.cards[w.de]) || added.has(w.de);
          return (
            <div key={w.de} className="row">
              <span className={`gender g-${w.gender === "none" ? "" : w.gender}`} aria-hidden />
              <span className="grow">
                <b lang="de">{w.de}</b> <span className="muted">{w.en}</span>
              </span>
              <SpeakButton text={w.de} />
              <button
                className="btn ghost small"
                disabled={have}
                onClick={() => {
                  addCustomWord({
                    de: w.de,
                    en: w.en,
                    type: w.kind,
                    gender: w.gender === "none" ? undefined : w.gender,
                  });
                  setAdded(new Set(added).add(w.de));
                }}
              >
                {have ? "In your cards" : "Add to cards"}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function Correction({ text, result }: { text: string; result: GradeResult }) {
  const same = result.corrected.trim() === text.trim();
  return (
    <section className="panel correction" aria-live="polite">
      <span className={`verdict-pill ${result.verdict}`}>{VERDICT_LABEL[result.verdict]}</span>
      <p>{result.feedback}</p>

      {!same && (
        <div className="stack tight">
          <p className="small muted">You wrote</p>
          <p lang="de" style={{ color: "var(--ink-2)" }}>
            {text}
          </p>
          <p className="small muted">Corrected</p>
          <div className="row">
            <p className="line grow" lang="de">
              {result.corrected}
            </p>
            <SpeakButton text={result.corrected} />
          </div>
        </div>
      )}

      {result.natural && result.natural.trim() !== result.corrected.trim() && (
        <div className="stack tight">
          <p className="small muted">How a native speaker might say it</p>
          <div className="row">
            <p className="line grow" lang="de">
              {result.natural}
            </p>
            <SpeakButton text={result.natural} />
          </div>
        </div>
      )}

      {same && (
        <div className="row">
          <p className="line grow" lang="de">
            {result.corrected}
          </p>
          <SpeakButton text={result.corrected} />
        </div>
      )}

      {result.mistakes.length > 0 && (
        <div className="stack tight">
          {result.mistakes.map((m, i) => (
            <div key={i} className="mistake">
              <span className="fix">
                <s>{m.wrong}</s> <ins>{m.right}</ins>
              </span>
              <span className="small">{m.why}</span>
            </div>
          ))}
        </div>
      )}

      {result.meaning && (
        <p className="small muted">
          What you wrote means: <i>{result.meaning}</i>
        </p>
      )}

      <NewWords words={result.new_words} />
    </section>
  );
}
