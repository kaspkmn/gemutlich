"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { ALL_SENTENCES, UNITS } from "@/content/course";
import { useStore } from "@/lib/store";
import { useDoneUnits } from "@/lib/useDoneUnits";
import { askAi, AiRequestError, GenerateResult, GradeResult, useAiEnabled, VERDICT_XP } from "@/lib/ai-client";
import { feedbackPrompt } from "@/lib/claude-handoff";
import { checkText } from "@/lib/answers";
import { sample } from "@/lib/exercises";
import WritingBox from "@/components/WritingBox";
import Correction from "@/components/Correction";
import ClaudeHandoff from "@/components/ClaudeHandoff";
import SpeakButton from "@/components/SpeakButton";
import { IconArrowLeft } from "@/components/Icons";

interface Item {
  en: string;
  de: string;
  hint?: string;
}

export default function TranslatePage() {
  const { logWriting } = useStore();
  const done = useDoneUnits();
  const enabled = useAiEnabled();
  const [source, setSource] = useState<"lessons" | "claude">("lessons");
  const [item, setItem] = useState<Item | null>(null);
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);
  const [loadingItem, setLoadingItem] = useState(false);
  const [result, setResult] = useState<GradeResult | null>(null);
  const [local, setLocal] = useState<"match" | "different" | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [error, setError] = useState("");
  const recent = useRef<string[]>([]);

  const reset = () => {
    setText("");
    setResult(null);
    setLocal(null);
    setShowHint(false);
    setError("");
  };

  const nextFromLessons = useCallback(() => {
    const units = done.length ? done : UNITS.slice(1, 3).map((u) => u.id);
    const pool = ALL_SENTENCES.filter((s) => units.includes(s.unitId) && !recent.current.includes(s.en));
    const pick = sample(pool.length ? pool : ALL_SENTENCES.filter((s) => units.includes(s.unitId)), 1)[0];
    if (!pick) return;
    recent.current = [pick.en, ...recent.current].slice(0, 20);
    reset();
    setItem({ en: pick.en, de: pick.de });
  }, [done]);

  const nextFromClaude = useCallback(async () => {
    setLoadingItem(true);
    reset();
    try {
      const r = await askAi<GenerateResult>({ task: "generate", kind: "translate", units: done, avoid: recent.current });
      recent.current = [r.en, ...recent.current].slice(0, 20);
      setItem({ en: r.en, de: r.de, hint: r.hint });
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoadingItem(false);
    }
  }, [done]);

  const next = () => (source === "claude" ? nextFromClaude() : nextFromLessons());

  useEffect(() => {
    if (!item) nextFromLessons();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Built-in grading when an API key is set up; otherwise compare to the lesson's answer.
  const check = async () => {
    if (!item) return;
    if (!enabled) {
      const r = checkText(text, [item.de]);
      if (r.status !== "wrong") {
        setLocal("match");
        logWriting({ mode: "translate", prompt: item.en, text, corrected: item.de, verdict: "good" }, 8);
      } else {
        setLocal("different");
      }
      return;
    }
    setBusy(true);
    setError("");
    try {
      const r = await askAi<GradeResult>({ task: "grade", mode: "translate", promptEn: item.en, reference: item.de, text, units: done });
      setResult(r);
      logWriting(
        { mode: "translate", prompt: item.en, text, corrected: r.corrected, verdict: r.verdict, note: r.mistakes[0]?.why },
        VERDICT_XP[r.verdict]
      );
    } catch (e) {
      if (e instanceof AiRequestError && e.code === "no_key") setLocal(checkText(text, [item.de]).status !== "wrong" ? "match" : "different");
      else setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  };

  const hint = item?.hint ?? (item ? `It starts with "${item.de.split(" ")[0]}"` : "");
  const answered = Boolean(result || local);

  return (
    <div className="page">
      <div className="page-head">
        <Link href="/write" className="back-link">
          <IconArrowLeft size={15} /> Write
        </Link>
        <h1>Translate</h1>
      </div>

      {enabled && (
        <div className="chips" role="group" aria-label="Where sentences come from">
          <button className="chip" aria-pressed={source === "lessons"} onClick={() => { setSource("lessons"); nextFromLessons(); }}>
            From my lessons
          </button>
          <button className="chip" aria-pressed={source === "claude"} onClick={() => { setSource("claude"); nextFromClaude(); }}>
            New sentences from Claude
          </button>
        </div>
      )}

      <section className="panel stack">
        <p className="prompt-label">Write this in German</p>
        <p className="prompt-big">{loadingItem ? "..." : item?.en ?? ""}</p>
        {item && !answered && (
          <div>
            {showHint ? (
              <p className="small muted">{hint}</p>
            ) : (
              <button className="link-btn small" onClick={() => setShowHint(true)}>
                Show a hint
              </button>
            )}
          </div>
        )}
        {!answered && (
          <WritingBox value={text} onChange={setText} onSubmit={check} busy={busy} disabled={!item || loadingItem} rows={2} submitLabel="Check" />
        )}
        {error && (
          <p role="alert" style={{ color: "var(--bad)" }}>
            {error}
          </p>
        )}
      </section>

      {result && <Correction text={text} result={result} />}

      {local && item && (
        <section className="panel stack">
          <span className={`verdict-pill ${local === "match" ? "good" : "almost"}`}>
            {local === "match" ? "Richtig! Matches the lesson's answer" : "Different from the lesson's answer"}
          </span>
          <div className="stack tight">
            <p className="small faint">You wrote</p>
            <p lang="de">{text}</p>
          </div>
          <div className="stack tight">
            <p className="small faint">Lesson's answer</p>
            <div className="row">
              <p className="grow" lang="de" style={{ fontSize: "1.15rem", fontWeight: 500 }}>
                {item.de}
              </p>
              <SpeakButton text={item.de} />
            </div>
          </div>
          {local === "different" && (
            <>
              <p className="small muted">
                Yours might still be right, since German often has more than one way to say something. Claude can tell you for sure and
                explain any mistakes.
              </p>
              <ClaudeHandoff
                ghost
                prompt={() => feedbackPrompt({ mode: "translate", text, promptEn: item.en, reference: item.de, doneUnits: done })}
                onSent={() => logWriting({ mode: "translate", prompt: item.en, text, corrected: item.de, verdict: "sent" }, 5)}
              />
            </>
          )}
        </section>
      )}

      {answered ? (
        <button className="btn block" onClick={next}>
          Next sentence
        </button>
      ) : (
        item && (
          <button className="link-btn" style={{ alignSelf: "center" }} onClick={next}>
            Skip this one
          </button>
        )
      )}
    </div>
  );
}
