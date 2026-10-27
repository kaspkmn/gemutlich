"use client";

import Link from "next/link";
import { useState } from "react";
import { useStore } from "@/lib/store";
import { exerciseWord } from "@/lib/exercises";
import { PASS_MARK } from "@/lib/level";
import { describeExercise } from "./ExerciseRunner";
import { formatTime, type TestAnswer } from "./TestRunner";
import { IconCheck, IconX } from "./Icons";

export default function TestResults({
  title,
  subtitle,
  answers,
  seconds,
  xp,
  newBest,
  onRetry,
  onPracticeMissed,
}: {
  title: string;
  subtitle?: string;
  answers: TestAnswer[];
  seconds: number;
  xp: number;
  newBest: boolean;
  onRetry: () => void;
  onPracticeMissed: () => void;
}) {
  const { addCards, state } = useStore();
  const [filter, setFilter] = useState<"all" | "missed">("missed");
  const [added, setAdded] = useState<number | null>(null);

  const correct = answers.filter((a) => a.correct).length;
  const total = answers.length;
  const score = total ? correct / total : 0;
  const passed = score >= PASS_MARK;
  const missed = answers.filter((a) => !a.correct);
  const missedWordIds = [...new Set(missed.map((a) => exerciseWord(a.ex)?.id).filter((x): x is string => Boolean(x)))];
  const notInDeck = missedWordIds.filter((id) => !state.cards[id]);
  const shown = filter === "missed" ? missed : answers;

  return (
    <div className="page">
      <section className="panel results">
        <p className="small faint">{subtitle ? `${title}: ${subtitle}` : title}</p>
        <div className="row" style={{ alignItems: "flex-end", gap: 16 }}>
          <span className={`results-big${passed ? " pass" : ""}`}>{Math.round(score * 100)}%</span>
          <div className="stack tight" style={{ paddingBottom: 6 }}>
            <b>{passed ? "Passed" : "Not passed yet"}</b>
            <span className="small muted">
              {correct} of {total} right
            </span>
          </div>
        </div>
        <div className="results-stats">
          <div>
            <b>{Math.round(PASS_MARK * 100)}%</b>
            <span>to pass</span>
          </div>
          <div>
            <b>+{xp}</b>
            <span>XP</span>
          </div>
          <div>
            <b>{formatTime(seconds)}</b>
            <span>time</span>
          </div>
        </div>
        {newBest && <p className="new-best">New best score</p>}
        {missed.length > 0 && <p className="small faint">The {missed.length} you missed are now in your mistake notebook.</p>}
      </section>

      <div className="stack">
        {missed.length > 0 && (
          <button className="btn block" onClick={onPracticeMissed}>
            Practice the {missed.length} you missed
          </button>
        )}
        {notInDeck.length > 0 && added === null && (
          <button className="btn ghost block" onClick={() => setAdded(addCards(notInDeck))}>
            Add {notInDeck.length} missed {notInDeck.length === 1 ? "word" : "words"} to flashcards
          </button>
        )}
        {added !== null && <p className="small muted">Added {added} to your flashcards.</p>}
        <div className="row wrap">
          <button className="btn ghost grow" onClick={onRetry}>
            Retake
          </button>
          <Link href="/test" className="btn ghost grow">
            All tests
          </Link>
        </div>
      </div>

      <section className="stack">
        <div className="row between wrap">
          <h2 className="section-title" style={{ margin: 0 }}>
            Your answers
          </h2>
          <div className="chips">
            <button className="chip" aria-pressed={filter === "missed"} onClick={() => setFilter("missed")}>
              Missed ({missed.length})
            </button>
            <button className="chip" aria-pressed={filter === "all"} onClick={() => setFilter("all")}>
              All ({total})
            </button>
          </div>
        </div>
        {shown.length === 0 ? (
          <p className="notice">Nothing missed. Every answer was right.</p>
        ) : (
          <ol className="review-list">
            {shown.map((a) => (
              <li key={a.ex.id} className={`review-item ${a.correct ? "ok" : "miss"}`}>
                <span className="review-icon" aria-label={a.correct ? "Right" : "Wrong"}>
                  {a.correct ? <IconCheck size={16} /> : <IconX size={16} />}
                </span>
                <div className="grow stack tight">
                  <p className="small muted">{describeExercise(a.ex)}</p>
                  {!a.correct && (
                    <p>
                      <span className="faint">You: </span>
                      <span className="review-given" lang="de">
                        {a.given || "skipped"}
                      </span>
                    </p>
                  )}
                  <p>
                    {!a.correct && <span className="faint">Answer: </span>}
                    <b style={{ fontWeight: 600 }}>{a.answer || a.given}</b>
                  </p>
                  {a.translation && <p className="tiny faint">{a.translation}</p>}
                </div>
              </li>
            ))}
          </ol>
        )}
      </section>
    </div>
  );
}
