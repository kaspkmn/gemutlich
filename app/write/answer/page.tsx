"use client";

import { L } from "@/lib/lang";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { ALL_PROMPTS } from "@/content/course";
import { useStore } from "@/lib/store";
import { useDoneUnits } from "@/lib/useDoneUnits";
import { askAi, GenerateResult, GradeResult, useAiEnabled, VERDICT_XP } from "@/lib/ai-client";
import { feedbackPrompt, openInClaude } from "@/lib/claude-handoff";
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

const STARTER_UNITS = L.starterUnits;

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
  const [sent, setSent] = useState(false);
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
    if (!enabled) {
      // free path: open claude.ai with the writing and tutor instructions
      openInClaude(feedbackPrompt({ mode: "answer", text, prompt: q.de, promptEn: q.en, doneUnits: done }));
      logWriting({ mode: "answer", prompt: q.de, text, corrected: text, verdict: "sent" }, 5);
      setSent(true);
      return;
    }
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
        <Link href="/write" className="back-link">
          <IconArrowLeft size={15} /> Write
        </Link>
        <h1>Answer a question</h1>
        <p className="sub">Answer however you like. Made-up answers are fine; the point is writing the {L.name}.</p>
      </div>

      {enabled === false && <AiNotice />}

      <section className="panel stack">
        <div className="row">
          <p className="prompt-big grow" lang={L.code}>
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
          <WritingBox
            value={text}
            onChange={setText}
            onSubmit={check}
            busy={busy}
            disabled={!q || loadingQ || enabled === null}
            submitLabel={enabled ? `Check my ${L.name}` : "Get feedback in Claude"}
          />
        )}
        {sent && (
          <p className="small muted">
            Opened claude.ai in a new tab with your answer filled in. If the message box is empty, it's also copied, so just paste.
          </p>
        )}
        {error && (
          <p role="alert" style={{ color: "var(--bad)" }}>
            {error}
          </p>
        )}
      </section>

      {result && <Correction text={text} result={result} />}

      <div className="row wrap">
        <button
          className={`btn ${result || sent ? "" : "ghost"} grow`}
          onClick={() => {
            setSent(false);
            fromLessons();
          }}
        >
          {result || sent ? "Next question" : "Different question"}
        </button>
        {enabled && (
          <button className="btn ghost grow" onClick={fromClaude} disabled={loadingQ}>
            New question from Claude
          </button>
        )}
      </div>
    </div>
  );
}
