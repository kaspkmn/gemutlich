"use client";

let cachedVoices: SpeechSynthesisVoice[] = [];

export function speechSupported(): boolean {
  return typeof window !== "undefined" && "speechSynthesis" in window;
}

export function germanVoices(): SpeechSynthesisVoice[] {
  if (!speechSupported()) return [];
  const all = window.speechSynthesis.getVoices();
  if (all.length) cachedVoices = all;
  return cachedVoices.filter((v) => v.lang.toLowerCase().startsWith("de"));
}

/** Call fn when the browser finishes loading its voice list. */
export function onVoicesReady(fn: () => void): () => void {
  if (!speechSupported()) return () => {};
  const handler = () => fn();
  window.speechSynthesis.addEventListener("voiceschanged", handler);
  fn();
  return () => window.speechSynthesis.removeEventListener("voiceschanged", handler);
}

const QUALITY_HINTS = ["premium", "enhanced", "natural", "neural", "google", "anna", "petra", "helena", "katja"];

function pickVoice(preferred?: string): SpeechSynthesisVoice | undefined {
  const voices = germanVoices();
  if (!voices.length) return undefined;
  if (preferred) {
    const v = voices.find((x) => x.voiceURI === preferred);
    if (v) return v;
  }
  const scored = voices
    .map((v) => {
      const name = v.name.toLowerCase();
      let s = QUALITY_HINTS.reduce((acc, h) => (name.includes(h) ? acc + 1 : acc), 0);
      if (v.lang === "de-DE") s += 1;
      return { v, s };
    })
    .sort((a, b) => b.s - a.s);
  return scored[0].v;
}

export function speak(text: string, opts: { rate?: number; voiceURI?: string } = {}) {
  if (!speechSupported()) return;
  const clean = text.replace(/\.\.\.|…|___/g, " ").trim();
  if (!clean) return;
  const synth = window.speechSynthesis;
  synth.cancel();
  const u = new SpeechSynthesisUtterance(clean);
  u.lang = "de-DE";
  const v = pickVoice(opts.voiceURI);
  if (v) u.voice = v;
  u.rate = opts.rate ?? 0.9;
  synth.speak(u);
}
