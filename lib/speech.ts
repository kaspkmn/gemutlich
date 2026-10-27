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

const QUALITY_HINTS = ["premium", "enhanced", "natural", "neural", "google", "anna", "petra", "helena", "katja", "markus", "yannick"];

function rankedVoices(): SpeechSynthesisVoice[] {
  return germanVoices()
    .map((v) => {
      const name = v.name.toLowerCase();
      let s = QUALITY_HINTS.reduce((acc, h) => (name.includes(h) ? acc + 1 : acc), 0);
      if (v.lang === "de-DE") s += 1;
      return { v, s };
    })
    .sort((a, b) => b.s - a.s)
    .map((x) => x.v);
}

function pickVoice(preferred?: string): SpeechSynthesisVoice | undefined {
  const voices = rankedVoices();
  if (preferred) {
    const v = voices.find((x) => x.voiceURI === preferred);
    if (v) return v;
  }
  return voices[0];
}

const clean = (text: string) => text.replace(/\.\.\.|…|___/g, " ").replace(/[„“]/g, "").trim();

function utter(text: string, opts: { rate?: number; voice?: SpeechSynthesisVoice; pitch?: number }) {
  const u = new SpeechSynthesisUtterance(clean(text));
  u.lang = "de-DE";
  if (opts.voice) u.voice = opts.voice;
  u.rate = opts.rate ?? 0.9;
  u.pitch = opts.pitch ?? 1;
  return u;
}

export function speak(text: string, opts: { rate?: number; voiceURI?: string; onEnd?: () => void } = {}) {
  if (!speechSupported() || !clean(text)) return;
  const synth = window.speechSynthesis;
  synth.cancel();
  const u = utter(text, { rate: opts.rate, voice: pickVoice(opts.voiceURI) });
  if (opts.onEnd) {
    u.onend = opts.onEnd;
    u.onerror = opts.onEnd;
  }
  synth.speak(u);
}

export function stopSpeaking() {
  if (speechSupported()) window.speechSynthesis.cancel();
}

/**
 * Read a conversation aloud, one line after another. Two speakers get two
 * different German voices when the device has them, otherwise two pitches.
 * Returns a function that stops playback.
 */
export function speakLines(
  lines: { text: string; who: 0 | 1 }[],
  opts: { rate?: number; voiceURI?: string; onLine?: (i: number) => void; onDone?: () => void } = {}
): () => void {
  if (!speechSupported() || !lines.length) {
    opts.onDone?.();
    return () => {};
  }
  const synth = window.speechSynthesis;
  synth.cancel();
  const ranked = rankedVoices();
  const first = pickVoice(opts.voiceURI);
  const second = ranked.find((v) => v !== first);
  let stopped = false;
  let i = 0;

  const next = () => {
    if (stopped) return;
    if (i >= lines.length) {
      opts.onDone?.();
      return;
    }
    const line = lines[i];
    const voice = line.who === 0 ? first : (second ?? first);
    const pitch = line.who === 1 && !second ? 0.75 : 1;
    const u = utter(line.text, { rate: opts.rate, voice, pitch });
    const idx = i;
    u.onstart = () => opts.onLine?.(idx);
    u.onend = () => {
      i++;
      setTimeout(next, 350);
    };
    u.onerror = u.onend;
    synth.speak(u);
  };
  next();

  return () => {
    stopped = true;
    synth.cancel();
  };
}
