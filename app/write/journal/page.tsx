"use client";

import Link from "next/link";
import { useState } from "react";
import { useStore } from "@/lib/store";
import { useDoneUnits } from "@/lib/useDoneUnits";
import { askAi, GradeResult, useAiEnabled, VERDICT_XP } from "@/lib/ai-client";
import WritingBox from "@/components/WritingBox";
import Correction from "@/components/Correction";
import AiNotice from "@/components/AiNotice";
import { IconArrowLeft } from "@/components/Icons";

const TOPICS = [
  { de: "Mein Tag", en: "My day", starter: "Heute bin ich ..." },
  { de: "Am Wochenende", en: "On the weekend", starter: "Am Wochenende ..." },
  { de: "Was ich heute esse", en: "What I'm eating today", starter: "Zum Frühstück esse ich ..." },
  { de: "Meine Familie", en: "My family", starter: "Meine Familie ist ..." },
  { de: "Meine Haustiere", en: "My pets", starter: "Ich habe ..." },
  { de: "Freies Thema", en: "Anything you like", starter: "" },
];

export default function JournalPage() {
  const { logWriting } = useStore();
  const done = useDoneUnits();
  const enabled = useAiEnabled();
  const [topic, setTopic] = useState(TOPICS[0]);
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<GradeResult | null>(null);
  const [error, setError] = useState("");

  const check = async () => {
    setBusy(true);
    setError("");
    try {
      const r = await askAi<GradeResult>({
        task: "grade",
        mode: "journal",
        prompt: `${topic.de} (${topic.en})`,
        text,
        units: done,
      });
      setResult(r);
      logWriting(
        { mode: "journal", prompt: topic.de, text, corrected: r.corrected, verdict: r.verdict, note: r.mistakes[0]?.why },
        VERDICT_XP[r.verdict] + Math.min(10, Math.floor(text.split(/\s+/).length / 8))
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
        <h1>Journal</h1>
        <p className="sub">Two or three short sentences is plenty. Simple and correct beats long and tangled.</p>
      </div>

      {enabled === false && <AiNotice />}

      {!result && (
        <div className="chips" role="group" aria-label="Topic">
          {TOPICS.map((t) => (
            <button key={t.de} className="chip" aria-pressed={topic.de === t.de} onClick={() => setTopic(t)}>
              {t.en}
            </button>
          ))}
        </div>
      )}

      <section className="panel stack">
        <div>
          <h2 lang="de">{topic.de}</h2>
          <p className="muted small">
            {topic.en}
            {topic.starter ? `. Try starting with "${topic.starter}"` : ""}
          </p>
        </div>
        {!result ? (
          <WritingBox
            value={text}
            onChange={setText}
            onSubmit={check}
            busy={busy}
            rows={6}
            disabled={enabled === false}
            placeholder={topic.starter || "Schreib hier... (Write here)"}
          />
        ) : (
          <p lang="de" style={{ whiteSpace: "pre-wrap" }}>
            {text}
          </p>
        )}
        {error && (
          <p role="alert" style={{ color: "var(--bad)" }}>
            {error}
          </p>
        )}
      </section>

      {result && (
        <>
          <Correction text={text} result={result} />
          <div className="row wrap">
            <button
              className="btn ghost grow"
              onClick={() => {
                setText(result.corrected);
                setResult(null);
              }}
            >
              Keep writing from the corrected version
            </button>
            <button
              className="btn glow grow"
              onClick={() => {
                setText("");
                setResult(null);
              }}
            >
              New entry
            </button>
          </div>
        </>
      )}
    </div>
  );
}
