"use client";

import { useEffect, useRef, useState } from "react";
import { useStore } from "@/lib/store";
import { RECOGNITION_MESSAGES, RecognitionError, listenOnce, recognitionSupported, scoreSpeech, type SpeechScore } from "@/lib/recognize";
import { useSpeak } from "./SpeakButton";
import { IconMic, IconSpeaker, IconStop, IconX } from "./Icons";

export interface SpeakItem {
  de: string;
  en: string;
}

const PASS = 0.8;

/**
 * Say each item out loud. Uses the browser's speech recognition when it's there,
 * otherwise falls back to saying it and grading yourself.
 */
export default function SpeakRunner({
  items,
  shadow = false,
  onDone,
  onExit,
}: {
  items: SpeakItem[];
  /** hide the text until you've tried, so you repeat from listening */
  shadow?: boolean;
  onDone: (r: { correct: number; total: number }) => void;
  onExit: () => void;
}) {
  const { recordSkill } = useStore();
  const say = useSpeak();
  const [i, setI] = useState(0);
  const [listening, setListening] = useState(false);
  const [result, setResult] = useState<SpeechScore | null>(null);
  const [error, setError] = useState("");
  const [tries, setTries] = useState(0);
  const [revealed, setRevealed] = useState(!shadow);
  const [supported, setSupported] = useState(true);
  const [selfGraded, setSelfGraded] = useState(false);
  const counted = useRef(false);
  const score = useRef(0);
  const stopRef = useRef<() => void>(() => {});

  const item = items[i];

  useEffect(() => setSupported(recognitionSupported()), []);

  useEffect(() => {
    if (!item) return;
    setResult(null);
    setError("");
    setTries(0);
    setRevealed(!shadow);
    setSelfGraded(false);
    counted.current = false;
    if (shadow) {
      const t = setTimeout(() => say(item.de), 300);
      return () => clearTimeout(t);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i]);

  useEffect(() => () => stopRef.current(), []);

  const count = (ok: boolean) => {
    if (counted.current) return;
    counted.current = true;
    if (ok) score.current += 1;
    recordSkill("speaking", ok, ok ? 4 : 1);
  };

  const listen = async () => {
    if (listening) {
      stopRef.current();
      return;
    }
    setError("");
    setResult(null);
    setListening(true);
    const { result: p, stop } = listenOnce("de-DE");
    stopRef.current = stop;
    try {
      const heard = await p;
      const r = scoreSpeech(item.de, heard);
      setResult(r);
      setTries((t) => t + 1);
      setRevealed(true);
      // the first attempt is what counts toward your stats
      count(r.score >= PASS);
    } catch (e) {
      const code = e instanceof RecognitionError ? e.code : "error";
      setError(RECOGNITION_MESSAGES[code] ?? "Something went wrong with the microphone. Try again.");
      if (code === "service-not-allowed" || code === "not-allowed") setSupported(false);
    } finally {
      setListening(false);
    }
  };

  const next = () => {
    stopRef.current();
    if (i + 1 >= items.length) onDone({ correct: score.current, total: items.length });
    else setI(i + 1);
  };

  if (!item) return null;
  const passed = result && result.score >= PASS;

  return (
    <div className="runner">
      <div className="runner-top">
        <button className="close-btn" onClick={onExit} aria-label="Stop">
          <IconX />
        </button>
        <div className="progress grow">
          <div style={{ width: `${(i / items.length) * 100}%` }} />
        </div>
        <span className="small faint">
          {i + 1}/{items.length}
        </span>
      </div>

      <p className="prompt-label">{shadow ? "Listen, then repeat it" : "Say this out loud"}</p>

      <div className="stack tight">
        <p className={`prompt-big${revealed ? "" : " hidden-text"}`} lang="de" aria-hidden={!revealed}>
          {result ? (
            <span className="heard">
              {result.words.map((w, k) => (
                <span key={k} className={w.ok ? "ok" : "miss"}>
                  {w.text}{" "}
                </span>
              ))}
            </span>
          ) : (
            item.de
          )}
        </p>
        <p className="muted">{item.en}</p>
      </div>

      <div className="row">
        <button className="speak" onClick={() => say(item.de)} aria-label="Listen">
          <IconSpeaker size={18} />
        </button>
        <button className="link-btn small" onClick={() => say(item.de, true)}>
          Listen slowly
        </button>
        {!revealed && (
          <button className="link-btn small" onClick={() => setRevealed(true)}>
            Show the text
          </button>
        )}
      </div>

      {supported ? (
        <div className="stack" style={{ alignItems: "center", textAlign: "center" }}>
          <button className={`mic${listening ? " on" : ""}`} onClick={listen} aria-label={listening ? "Stop listening" : "Tap and speak"}>
            {listening ? <IconStop size={30} /> : <IconMic size={32} />}
          </button>
          <p className="small faint">{listening ? "Listening... speak now" : tries ? "Tap to try again" : "Tap, then speak"}</p>
          {error && (
            <p className="small" role="alert" style={{ color: "var(--bad)" }}>
              {error}
            </p>
          )}
          {result && (
            <div className={`feedback ${passed ? "good" : result.score >= 0.5 ? "warn" : "bad"}`} style={{ position: "static", width: "100%", textAlign: "left" }}>
              <span className="verdict">{passed ? "Sehr gut!" : result.score >= 0.5 ? "Fast! (Almost!)" : "Nochmal? (Again?)"}</span>
              <p className="small">
                <span className="muted">Heard: </span>
                <span lang="de">{result.heard || "nothing"}</span>
              </p>
              {!passed && <p className="small muted">Words in red weren't recognized. Listen again and copy the sounds.</p>}
              <button className="btn block" onClick={next}>
                {i + 1 >= items.length ? "Finish" : "Next"}
              </button>
            </div>
          )}
          {!result && (
            <button className="link-btn small" onClick={() => { count(false); next(); }}>
              Skip
            </button>
          )}
        </div>
      ) : (
        <div className="stack">
          <p className="notice small">
            Your browser can't check speech here, so say it out loud and grade yourself. On iPhone, speech checking works in Safari
            (not from the home screen icon). On a computer, Chrome or Edge work best.
          </p>
          {!selfGraded ? (
            <div className="row">
              <button className="btn grow" onClick={() => { setRevealed(true); count(true); setSelfGraded(true); }}>
                I said it well
              </button>
              <button className="btn ghost grow" onClick={() => { setRevealed(true); count(false); setSelfGraded(true); }}>
                Needs work
              </button>
            </div>
          ) : (
            <button className="btn block" onClick={next}>
              {i + 1 >= items.length ? "Finish" : "Next"}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
