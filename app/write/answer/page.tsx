"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { ALL_PROMPTS } from "@/content/course";
import { useStore } from "@/lib/store";
import { useDoneUnits } from "@/lib/useDoneUnits";
import { askAi, GenerateResult, GradeResult, useAiEnabled, VERDICT_XP } from "@/lib/ai-client";
import { sample } from "@/lib/exercises";
import WritingBox from "@/components/WritingBox";
import Correction from "@/components/Correction";
import AiNotice from "@/components/AiNotice";
import SpeakButton from "@/components/SpeakButton";
import { IconArrowLeft } from "@/components/Icons";

interface Q {
  de: string;
  en: string;
  hint?: string;
}

const STARTER_UNITS = ["greetings", "intro", "numbers"];

export default function AnswerPage() {
  const { logWriting } = useStore();
  const done = useDoneUnits();
  const enabled = useAiEnabled();
  const [q, setQ] = useState<Q | null>(null);
  const [showEn, setShowEn] = useState(false);
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);
  const [loadingQ, setLoadingQ] = useState(false);
  const [result, setResult] = useState<GradeResult | null>(null);
  const [error, setError] = useState("");
  const recent = useRef<string[]>([]);

  const reset = () => {
    setText("");
    setResult(null);
    setShowEn(false);
    setError("");
  };

  const fromLessons = useCallback(() => {
    const units = [...new Set([...STARTER_UNITS, ...done])];
    const pool = ALL_PROMPTS.filter((p) => units.includes(p.unitId) && !recent.current.includes(p.de));
    const pick = sample(pool.length ? pool : ALL_PROMPTS.filter((p) => units.includes(p.unitId)), 1)[0];
    if (!pick) return;
    recent.current = [pick.de, ...recent.current].slice(0, 12);
    reset();
    setQ({ de: pick.de, en: pick.en });
  }, [done]);

  const fromClaude = async () => {
    setLoadingQ(true);
    reset();
    try {
      const r = await askAi<GenerateResult>({ task: "generate", kind: "question", units: done, avoid: recent.current });
      recent.current = [r.de, ...recent.current].slice(0, 20);
      setQ({ de: r.de, en: r.en, hint: r.hint });
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoadingQ(false);
    }
  };

  useEffect(() => {
    fromLessons();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const check = async () => {
    if (!q) return;
    setBusy(true);
    setError("");
    try {
      const r = await askAi<GradeResult>({ task: "grade", mode: "answer", prompt: q.de, promptEn: q.en, text, units: done });
      setResult(r);
      logWriting(
        { mode: "answer", prompt: q.de, text, corrected: r.corrected, verdict: r.verdict, note: r.mistakes[0]?.why },
        VERDICT_XP[r.verdict]
      );
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="page">
      <div className="page-head">
        <Link href="/write" className="small muted row" style={{ textDecoration: "none", gap: 4 }}>
          <IconArrowLeft size={16} /> Write
        </Link>
        <h1>Answer a question</h1>
        <p className="sub">Answer however you like. Made-up answers are fine; the point is writing the German.</p>
      </div>

      {enabled === false && <AiNotice />}

      <section className="panel stack">
        <div className="row">
          <p className="prompt-big grow" lang="de">
            {loadingQ ? "..." : q?.de}
          </p>
          {q && <SpeakButton text={q.de} />}
        </div>
        {q &&
          (showEn ? (
            <p className="muted">
              {q.en}
              {q.hint ? `  Try starting with: ${q.hint}` : ""}
            </p>
          ) : (
            <button className="link-btn small" style={{ alignSelf: "flex-start" }} onClick={() => setShowEn(true)}>
              Show in English
            </button>
          ))}
        {!result && (
          <WritingBox value={text} onChange={setText} onSubmit={check} busy={busy} disabled={!q || loadingQ || enabled === false} />
        )}
        {error && (
          <p role="alert" style={{ color: "var(--bad)" }}>
            {error}
          </p>
        )}
      </section>

      {result && <Correction text={text} result={result} />}

      <div className="row wrap">
        <button className={`btn ${result ? "honey" : "ghost"} grow`} onClick={fromLessons}>
          {result ? "Next question" : "Different question"}
        </button>
        <button className="btn ghost grow" onClick={fromClaude} disabled={enabled === false || loadingQ}>
          New question from Claude
        </button>
      </div>
    </div>
  );
}
