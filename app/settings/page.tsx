"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/lib/store";
import { germanVoices, onVoicesReady, speak, speechSupported } from "@/lib/speech";
import { hydrate } from "@/lib/state";
import { dayKey } from "@/lib/dates";

const GOALS = [
  { v: 20, l: "Light", d: "20 XP, about 5 minutes" },
  { v: 50, l: "Regular", d: "50 XP, about 10 minutes" },
  { v: 100, l: "Serious", d: "100 XP, about 20 minutes" },
  { v: 150, l: "Intense", d: "150 XP, 30 minutes or more" },
];

export default function SettingsPage() {
  const { state, updateSettings, resetAll, replaceState, signOut, sync } = useStore();
  const s = state.settings;
  const router = useRouter();
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [speechOk, setSpeechOk] = useState(true);
  const [confirm, setConfirm] = useState("");
  const [msg, setMsg] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setSpeechOk(speechSupported());
    return onVoicesReady(() => setVoices(germanVoices()));
  }, []);

  const exportData = () => {
    const blob = new Blob([JSON.stringify(state, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `deutsch-backup-${dayKey()}.json`;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  const importData = async (f: File) => {
    try {
      const parsed = JSON.parse(await f.text());
      if (!parsed || typeof parsed !== "object" || !("cards" in parsed)) throw new Error();
      replaceState(hydrate(parsed));
      setMsg("Backup restored.");
    } catch {
      setMsg("That file isn't a backup from this site.");
    }
  };

  return (
    <div className="page">
      <div className="page-head">
        <h1>Settings</h1>
      </div>

      <section className="panel stack">
        <h2>Daily goal</h2>
        <div className="stack tight" role="radiogroup" aria-label="Daily goal">
          {GOALS.map((g) => (
            <label key={g.v} className="toggle" style={{ cursor: "pointer" }}>
              <span>
                <b>{g.l}</b>
                <span className="small muted" style={{ display: "block" }}>
                  {g.d}
                </span>
              </span>
              <input type="radio" name="goal" checked={s.dailyGoal === g.v} onChange={() => updateSettings({ dailyGoal: g.v })} />
            </label>
          ))}
        </div>
      </section>

      <section className="panel stack">
        <h2>Listening</h2>
        {!speechOk ? (
          <p className="muted">This browser can't read text aloud, so audio buttons are hidden.</p>
        ) : (
          <>
            <div className="field">
              <label htmlFor="voice">German voice</label>
              <select
                id="voice"
                className="text-input"
                value={s.voiceURI}
                onChange={(e) => updateSettings({ voiceURI: e.target.value })}
              >
                <option value="">Best available</option>
                {voices.map((v) => (
                  <option key={v.voiceURI} value={v.voiceURI}>
                    {v.name} ({v.lang})
                  </option>
                ))}
              </select>
              {voices.length === 0 && (
                <p className="small muted">
                  No German voice found on this device. On iPhone, add one in Settings, Accessibility, Spoken Content, Voices,
                  German. On Windows, add the German speech pack.
                </p>
              )}
            </div>
            <div className="field">
              <label htmlFor="rate">Speed: {s.rate.toFixed(2)}x</label>
              <input
                id="rate"
                type="range"
                min={0.5}
                max={1.2}
                step={0.05}
                value={s.rate}
                onChange={(e) => updateSettings({ rate: Number(e.target.value) })}
              />
            </div>
            <button className="btn ghost" onClick={() => speak("Guten Morgen! Wie geht es dir heute?", { rate: s.rate, voiceURI: s.voiceURI })}>
              Test the voice
            </button>
            <label className="toggle">
              <span>Play German automatically</span>
              <input type="checkbox" checked={s.autoplay} onChange={(e) => updateSettings({ autoplay: e.target.checked })} />
            </label>
          </>
        )}
      </section>

      <section className="panel stack">
        <h2>Flashcards</h2>
        <div className="field">
          <span className="label">Show on the front</span>
          <div className="chips">
            {(
              [
                ["de-en", "German"],
                ["en-de", "English"],
                ["mixed", "Mix both"],
              ] as const
            ).map(([v, l]) => (
              <button key={v} className="chip" aria-pressed={s.direction === v} onClick={() => updateSettings({ direction: v })}>
                {l}
              </button>
            ))}
          </div>
          <p className="small muted">English on the front is harder: you have to come up with the German yourself.</p>
        </div>
      </section>

      <section className="panel stack">
        <h2>Profile</h2>
        <div className="field">
          <label htmlFor="name">Your name (for the greeting)</label>
          <input id="name" className="text-input" value={s.name} maxLength={30} onChange={(e) => updateSettings({ name: e.target.value })} />
        </div>
      </section>

      <section className="panel stack">
        <h2>Your data</h2>
        <p className="small muted">
          {sync === "offline"
            ? "You're offline. Progress is saved on this device and syncs when you're back."
            : "Progress syncs to your database, so it's the same on your phone and computer."}
        </p>
        <div className="row wrap">
          <button className="btn ghost small" onClick={exportData}>
            Download a backup
          </button>
          <button className="btn ghost small" onClick={() => fileRef.current?.click()}>
            Restore a backup
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="application/json"
            hidden
            onChange={(e) => e.target.files?.[0] && importData(e.target.files[0])}
          />
        </div>
        {msg && <p className="small">{msg}</p>}
        <hr />
        <div className="field">
          <label htmlFor="reset">Start over</label>
          <p className="small muted">Erases all lessons, flashcards, XP and writing history. Type RESET to confirm.</p>
          <div className="row">
            <input id="reset" className="text-input grow" value={confirm} onChange={(e) => setConfirm(e.target.value)} />
            <button
              className="btn danger"
              disabled={confirm !== "RESET"}
              onClick={() => {
                resetAll();
                setConfirm("");
                setMsg("Everything has been reset.");
              }}
            >
              Erase
            </button>
          </div>
        </div>
        <hr />
        <button
          className="btn ghost"
          onClick={async () => {
            await signOut();
            router.replace("/login");
          }}
        >
          Sign out on this device
        </button>
      </section>
    </div>
  );
}
