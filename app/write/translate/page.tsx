"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { ALL_SENTENCES, UNITS } from "@/content/course";
import { useStore } from "@/lib/store";
import { useDoneUnits } from "@/lib/useDoneUnits";
import { askAi, AiRequestError, GenerateResult, GradeResult, useAiEnabled, VERDICT_XP } from "@/lib/ai-client";
import { sample } from "@/lib/exercises";
import WritingBox from "@/components/WritingBox";
import Correction from "@/components/Correction";
import AiNotice from "@/components/AiNotice";
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
  const [revealed, setRevealed] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [error, setError] = useState("");
  const recent = useRef<string[]>([]);

  const reset = () => {
    setText("");
    setResult(null);
    setRevealed(false);
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

  const check = async () => {
    if (!item) return;
    setBusy(true);
    setError("");
    try {
      const r = await askAi<GradeResult>({
        task: "grade",
        mode: "translate",
        promptEn: item.en,
        reference: item.de,
        text,
        units: done,
      });
      setResult(r);
      logWriting(
        { mode: "translate", prompt: item.en, text, corrected: r.corrected, verdict: r.verdict, note: r.mistakes[0]?.why },
        VERDICT_XP[r.verdict]
      );
    } catch (e) {
      if (e instanceof AiRequestError && e.code === "no_key") setRevealed(true);
      else setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  };

  const hint = item?.hint ?? (item ? `It starts with "${item.de.split(" ")[0]}"` : "");

  return (
    <div className="page">
      <div className="page-head">
        <Link href="/write" className="small muted row" style={{ textDecoration: "none", gap: 4 }}>
          <IconArrowLeft size={16} /> Write
        </Link>
        <h1>Translate</h1>
      </div>

      {enabled === false && <AiNotice />}

      <div className="chips" role="group" aria-label="Where sentences come from">
        <button
          className="chip"
          aria-pressed={source === "lessons"}
          onClick={() => {
            setSource("lessons");
            nextFromLessons();
          }}
        >
          From my lessons
        </button>
        <button
          className="chip"
          aria-pressed={source === "claude"}
          disabled={enabled === false}
          onClick={() => {
            setSource("claude");
            nextFromClaude();
          }}
        >
          Fresh sentences from Claude
        </button>
      </div>

      <section className="panel stack">
        <p className="prompt-label">Write this in German</p>
        <p className="prompt-big">{loadingItem ? "..." : item?.en ?? ""}</p>
        {item && !result && !revealed && (
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
        {!result && !revealed && (
          <WritingBox value={text} onChange={setText} onSubmit={check} busy={busy} disabled={!item || loadingItem} rows={2} />
        )}
        {error && (
          <p role="alert" style={{ color: "var(--bad)" }}>
            {error}
          </p>
        )}
        {revealed && item && (
          <div className="stack tight">
            <p className="small muted">You wrote</p>
            <p lang="de">{text}</p>
            <p className="small muted">One way to say it</p>
            <div className="row">
              <p className="line grow" lang="de" style={{ fontFamily: "var(--font-display)", fontSize: "1.25rem" }}>
                {item.de}
              </p>
              <SpeakButton text={item.de} />
            </div>
          </div>
        )}
      </section>

      {result && <Correction text={text} result={result} />}

      {(result || revealed) && (
        <button className="btn glow block" onClick={next}>
          Next sentence
        </button>
      )}
      {!result && !revealed && item && (
        <button className="link-btn" onClick={next}>
          Skip this one
        </button>
      )}
    </div>
  );
}
