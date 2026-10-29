"use client";

import { L, IS_ES } from "@/lib/lang";
import Link from "next/link";
import { useState } from "react";
import { useStore } from "@/lib/store";
import { useAiEnabled, VERDICT_LABEL } from "@/lib/ai-client";
import AiNotice from "@/components/AiNotice";

const MODES = [
  {
    href: "/write/translate",
    title: "Translate",
    de: IS_ES ? "Traducir" : "Übersetzen",
    blurb: `Turn an English sentence into ${L.name}. Any correct version counts, not just one answer.`,
  },
  {
    href: "/write/answer",
    title: "Answer a question",
    de: IS_ES ? "Responder" : "Antworten",
    blurb: "Answer simple questions about your life in your own words.",
  },
  {
    href: "/write/journal",
    title: "Journal",
    de: IS_ES ? "Diario" : "Tagebuch",
    blurb: "Write a few sentences about your day and get them corrected.",
  },
  {
    href: "/write/chat",
    title: "Chat",
    de: IS_ES ? "Conversación" : "Unterhaltung",
    blurb: `Have a real conversation at a café, ${IS_ES ? "a taco stand" : "a bakery"}, or anywhere. Mistakes get fixed as you go.`,
  },
];

const MODE_NAME: Record<string, string> = { translate: "Translate", answer: "Answer", journal: "Journal", chat: "Chat" };

export default function WriteHub() {
  const { state } = useStore();
  const enabled = useAiEnabled();
  const [showAll, setShowAll] = useState(false);
  const history = showAll ? state.writing.slice(0, 50) : state.writing.slice(0, 6);

  return (
    <div className="page">
      <div className="page-head">
        <h1>Write in {L.name}</h1>
        <p className="sub">
          Writing {L.name} from scratch is where it really sticks. Translate, answer questions, keep a journal or chat, and get
          each mistake explained.
        </p>
      </div>

      {enabled === false && <AiNotice />}

      <div className="mode-grid">
        {MODES.map((m) => (
          <Link key={m.href} href={m.href} className="mode-card">
            <h3>{m.title}</h3>
            <span className="de">{m.de}</span>
            <span className="small muted">{m.blurb}</span>
          </Link>
        ))}
      </div>

      <section className="panel stack">
        <h2>Your recent writing</h2>
        {state.writing.length === 0 ? (
          <p className="muted">Nothing yet. Corrections you get will collect here so you can look back at them.</p>
        ) : (
          <>
            <div>
              {history.map((h) => (
                <div key={h.at} className="history-item stack tight">
                  <div className="row between">
                    <span className="tiny faint">
                      {MODE_NAME[h.mode]}, {new Date(h.at).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
                    </span>
                    <span className={`verdict-pill ${h.verdict}`} style={{ fontSize: "0.75rem", padding: "2px 10px" }}>
                      {VERDICT_LABEL[h.verdict]}
                    </span>
                  </div>
                  {h.prompt && <p className="small muted">{h.prompt}</p>}
                  {h.text.trim() !== h.corrected.trim() ? (
                    <>
                      <p className="small" lang={L.code}>
                        <s style={{ color: "var(--bad)" }}>{h.text}</s>
                      </p>
                      <p lang={L.code}>
                        <b>{h.corrected}</b>
                      </p>
                    </>
                  ) : (
                    <p lang={L.code}>
                      <b>{h.text}</b>
                    </p>
                  )}
                  {h.note && <p className="small muted">{h.note}</p>}
                </div>
              ))}
            </div>
            {state.writing.length > 6 && (
              <button className="link-btn" onClick={() => setShowAll(!showAll)}>
                {showAll ? "Show less" : "Show more"}
              </button>
            )}
          </>
        )}
      </section>
    </div>
  );
}
