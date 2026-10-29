"use client";

import { useEffect, useState } from "react";
import type { Verdict } from "./state";

export interface AiWord {
  de: string;
  en: string;
  kind: "noun" | "verb" | "adj" | "word" | "phrase";
  gender: "m" | "f" | "n" | "pl" | "none";
}

export interface GradeResult {
  verdict: Verdict;
  corrected: string;
  natural: string;
  meaning: string;
  feedback: string;
  mistakes: { wrong: string; right: string; why: string }[];
  new_words: AiWord[];
}

export interface ChatResult {
  reply: string;
  reply_en: string;
  correction: { has_mistakes: boolean; corrected: string; explanation: string };
  new_words: AiWord[];
}

export interface GenerateResult {
  en: string;
  de: string;
  hint: string;
}

import { LANG } from "./lang";

export class AiRequestError extends Error {
  constructor(message: string, public code?: string) {
    super(message);
  }
}

export async function askAi<T>(body: Record<string, unknown>): Promise<T> {
  let res: Response;
  try {
    res = await fetch("/api/ai", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ lang: LANG, ...body }),
    });
  } catch {
    throw new AiRequestError("Can't reach the server. Check your connection and try again.");
  }
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    if (data.error === "no_key") throw new AiRequestError("Claude isn't connected yet.", "no_key");
    throw new AiRequestError(data.error ?? "Something went wrong. Try again.");
  }
  return data as T;
}

/** null while checking, then whether the server has an API key. */
export function useAiEnabled(): boolean | null {
  const [enabled, setEnabled] = useState<boolean | null>(null);
  useEffect(() => {
    fetch("/api/ai")
      .then((r) => (r.ok ? r.json() : { enabled: false }))
      .then((d) => setEnabled(Boolean(d.enabled)))
      .catch(() => setEnabled(false));
  }, []);
  return enabled;
}

export const VERDICT_LABEL: Record<Verdict, string> = {
  perfect: "Perfekt!",
  good: "Gut!",
  almost: "Fast!",
  needs_work: "Noch nicht ganz",
  sent: "Sent to Claude",
};

export const VERDICT_XP: Record<Verdict, number> = { perfect: 12, good: 10, almost: 6, needs_work: 3, sent: 5 };
