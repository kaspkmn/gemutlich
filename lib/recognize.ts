"use client";

import { lev, norm } from "./answers";
import { digitsToWords } from "./numbers";

/* Speech recognition built into Chrome, Edge and Safari. Free, no key needed. */

type RecognitionCtor = new () => {
  lang: string;
  interimResults: boolean;
  maxAlternatives: number;
  continuous: boolean;
  onresult: ((e: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void) | null;
  onerror: ((e: { error: string }) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
  abort: () => void;
};

function ctor(): RecognitionCtor | null {
  if (typeof window === "undefined") return null;
  const w = window as unknown as { SpeechRecognition?: RecognitionCtor; webkitSpeechRecognition?: RecognitionCtor };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
}

export function recognitionSupported(): boolean {
  return ctor() !== null;
}

export class RecognitionError extends Error {
  constructor(public code: string) {
    super(code);
  }
}

export const RECOGNITION_MESSAGES: Record<string, string> = {
  "not-allowed": "Microphone access is blocked. Allow the microphone for this site in your browser settings, then try again.",
  "service-not-allowed": "Speech recognition isn't available here. On iPhone, open the site in Safari instead of from the home screen icon.",
  "no-speech": "Didn't hear anything. Tap the mic and speak right away.",
  "audio-capture": "No microphone found.",
  network: "Speech recognition needs an internet connection.",
  aborted: "Stopped.",
};

/** Listen once. Resolves with what was heard (several guesses, best first). */
export function listenOnce(lang = "de-DE"): { result: Promise<string[]>; stop: () => void } {
  const C = ctor();
  if (!C) return { result: Promise.reject(new RecognitionError("unsupported")), stop: () => {} };
  const rec = new C();
  rec.lang = lang;
  rec.interimResults = false;
  rec.maxAlternatives = 5;
  rec.continuous = false;
  let heard: string[] = [];
  let failed: string | null = null;
  const result = new Promise<string[]>((resolve, reject) => {
    rec.onresult = (e) => {
      const first = e.results[0];
      heard = Array.from({ length: first.length }, (_, i) => first[i].transcript);
    };
    rec.onerror = (e) => {
      failed = e.error;
    };
    rec.onend = () => {
      if (heard.length) resolve(heard);
      else reject(new RecognitionError(failed ?? "no-speech"));
    };
  });
  try {
    rec.start();
  } catch {
    return { result: Promise.reject(new RecognitionError("service-not-allowed")), stop: () => {} };
  }
  return { result, stop: () => rec.stop() };
}

export interface SpeechScore {
  score: number;
  heard: string;
  /** each target word and whether it was heard */
  words: { text: string; ok: boolean }[];
}

const words = (s: string) => norm(digitsToWords(s)).split(" ").filter(Boolean);

function close(a: string, b: string) {
  if (a === b) return true;
  return Math.max(a.length, b.length) >= 4 && lev(a, b) <= 1;
}

/** Compare what was heard to the target, word by word, in order. */
export function scoreSpeech(target: string, heardOptions: string[]): SpeechScore {
  const shown = target.replace(/[„“"]/g, "").split(/\s+/).filter(Boolean);
  const t = shown.map((w) => norm(w));
  let best: SpeechScore = { score: 0, heard: heardOptions[0] ?? "", words: shown.map((text) => ({ text, ok: false })) };
  for (const h of heardOptions) {
    const hw = words(h);
    // longest common subsequence with fuzzy matching
    const dp: number[][] = Array.from({ length: t.length + 1 }, () => Array(hw.length + 1).fill(0));
    for (let i = 1; i <= t.length; i++)
      for (let j = 1; j <= hw.length; j++)
        dp[i][j] = close(t[i - 1], hw[j - 1]) ? dp[i - 1][j - 1] + 1 : Math.max(dp[i - 1][j], dp[i][j - 1]);
    const ok = Array(t.length).fill(false);
    for (let i = t.length, j = hw.length; i > 0 && j > 0; ) {
      if (close(t[i - 1], hw[j - 1])) {
        ok[i - 1] = true;
        i--;
        j--;
      } else if (dp[i - 1][j] >= dp[i][j - 1]) i--;
      else j--;
    }
    const counted = t.filter((w) => w).length || 1;
    const score = ok.filter((x, i) => x && t[i]).length / counted;
    if (score > best.score) best = { score, heard: h, words: shown.map((text, i) => ({ text, ok: ok[i] || !t[i] })) };
  }
  return best;
}
