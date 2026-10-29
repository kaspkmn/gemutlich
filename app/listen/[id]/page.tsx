"use client";

import { L } from "@/lib/lang";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { DIALOGUES } from "@/content/dialogues";
import { useStore } from "@/lib/store";
import { speak, speakLines, speechSupported, stopSpeaking } from "@/lib/speech";
import { shuffle } from "@/lib/exercises";
import { IconArrowLeft, IconPlay, IconSpeaker, IconStop } from "@/components/Icons";

export default function DialoguePage() {
  const { id } = useParams<{ id: string }>();
  const d = DIALOGUES.find((x) => x.id === id);
  const { state, markRead, recordSkill } = useStore();
  const [playing, setPlaying] = useState<number | null>(null);
  const [slow, setSlow] = useState(false);
  const [plays, setPlays] = useState(0);
  const [showText, setShowText] = useState(false);
  const [showEn, setShowEn] = useState(false);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [done, setDone] = useState(false);
  const [canSpeak, setCanSpeak] = useState(true);
  const stopRef = useRef<() => void>(() => {});

  // shuffle answer order in the browser only, so server and browser render the same first
  const [questions, setQuestions] = useState(() => d?.questions ?? []);
  useEffect(() => {
    if (d) setQuestions(d.questions.map((q) => ({ ...q, options: shuffle(q.options) })));
  }, [d]);

  useEffect(() => {
    setCanSpeak(speechSupported());
    return () => stopSpeaking();
  }, []);

  if (!d) {
    return (
      <div className="page">
        <h1>Conversation not found</h1>
        <Link href="/listen" className="btn">
          All conversations
        </Link>
      </div>
    );
  }

  const rate = slow ? Math.max(0.5, state.settings.rate - 0.3) : state.settings.rate;

  const toggle = () => {
    if (playing !== null) {
      stopRef.current();
      setPlaying(null);
      return;
    }
    setPlays((n) => n + 1);
    setPlaying(0);
    stopRef.current = speakLines(
      d.lines.map((l) => ({ text: l.de, who: l.who })),
      { rate, voiceURI: state.settings.voiceURI, onLine: setPlaying, onDone: () => setPlaying(null) }
    );
  };

  const allAnswered = questions.every((_, i) => answers[i]);
  const right = questions.filter((q, i) => answers[i] === q.answer).length;

  return (
    <div className="page">
      <div className="page-head">
        <Link href="/listen" className="back-link">
          <IconArrowLeft size={15} /> Listening
        </Link>
        <h1>{d.title}</h1>
        <p className="sub">{d.setting}</p>
      </div>

      {!canSpeak && <p className="notice small">This browser can't play {L.name} audio. You can still read the transcript.</p>}

      <section className="panel stack">
        <div className="player">
          <button className="speak big" onClick={toggle} aria-label={playing !== null ? "Stop" : "Play the conversation"} disabled={!canSpeak}>
            {playing !== null ? <IconStop size={26} /> : <IconPlay size={26} />}
          </button>
          <div className="grow stack tight">
            <b>{playing !== null ? `Playing line ${playing + 1} of ${d.lines.length}` : plays ? "Play it again" : "Play the conversation"}</b>
            <span className="small faint">
              {d.speakers[0]} and {d.speakers[1]}
            </span>
          </div>
        </div>
        <div className="row wrap">
          <button className="chip" aria-pressed={slow} onClick={() => setSlow(!slow)}>
            Slower
          </button>
          <button className="chip" aria-pressed={showText} onClick={() => setShowText(!showText)}>
            Show transcript
          </button>
          {showText && (
            <button className="chip" aria-pressed={showEn} onClick={() => setShowEn(!showEn)}>
              Show English
            </button>
          )}
        </div>
      </section>

      {showText && (
        <section className="dialogue" aria-label="Transcript">
          {d.lines.map((l, i) => (
            <div key={i} className={`dline${l.who === 1 ? " b" : ""}${playing === i ? " now" : ""}`}>
              <span className="who">{d.speakers[l.who]}</span>
              <div className="grow">
                <p lang={L.code}>{l.de}</p>
                {showEn && <p className="small faint">{l.en}</p>}
              </div>
              {canSpeak && (
                <button
                  className="icon-btn"
                  aria-label="Play this line"
                  onClick={() => speak(l.de, { rate, voiceURI: state.settings.voiceURI })}
                  style={{ color: "var(--ink-2)" }}
                >
                  <IconSpeaker size={18} />
                </button>
              )}
            </div>
          ))}
        </section>
      )}

      <section className="panel stack">
        <h2>Questions</h2>
        {!plays && !showText && <p className="small faint">Listen first, then answer.</p>}
        {questions.map((q, i) => (
          <div key={i} className="quiz-q">
            <p style={{ fontWeight: 500 }}>{q.q}</p>
            <div className="options">
              {q.options.map((o) => {
                const picked = answers[i];
                const st = picked ? (o === q.answer ? "right" : o === picked ? "wrong" : "dim") : undefined;
                return (
                  <button
                    key={o}
                    className="option"
                    data-state={st}
                    disabled={Boolean(picked)}
                    onClick={() => {
                      setAnswers({ ...answers, [i]: o });
                      recordSkill("listening", o === q.answer, o === q.answer ? 3 : 0);
                    }}
                  >
                    {o}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
        {allAnswered && !done && (
          <button
            className="btn block"
            onClick={() => {
              markRead(`dialogue:${d.id}`, 10);
              setDone(true);
              setShowText(true);
            }}
          >
            Finish
          </button>
        )}
        {done && (
          <p className="muted">
            {right} of {questions.length} right. Read through the transcript above to catch anything you missed.
          </p>
        )}
      </section>
    </div>
  );
}
