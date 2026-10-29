"use client";

import { UNITS } from "@/content/course";
import type { ChatScenario } from "@/content/course";
import { IS_ES, L } from "@/lib/lang";

/* Free writing feedback: build a tutor prompt and open it in claude.ai. */

function levelLine(doneUnits: string[]) {
  const done = UNITS.filter((u) => doneUnits.includes(u.id));
  if (!done.length) return "I'm a total beginner and have only just started.";
  return `I'm a beginner. I've studied: ${done.map((u) => u.title.toLowerCase()).join(", ")}.`;
}

const RULES = `Please:
1. Tell me if it's correct. If not, show the corrected ${L.name} with as few changes as possible.
2. List each mistake with a short, beginner-friendly explanation in English.
3. Show how a native speaker would most naturally say it, kept simple.
4. Put an English translation in parentheses after any ${L.name} you write.${IS_ES ? "\n5. Use Mexican Spanish (ustedes, not vosotros)." : ""}
Keep it short and don't use em dashes.`;

export function feedbackPrompt(opts: {
  mode: "translate" | "answer" | "journal";
  text: string;
  prompt?: string;
  promptEn?: string;
  reference?: string;
  doneUnits: string[];
}): string {
  const intro = `I'm learning ${L.name} and want feedback on something I wrote. ${levelLine(opts.doneUnits)}`;
  let task = "";
  if (opts.mode === "translate") {
    task = `I translated this English sentence: "${opts.promptEn}"\nMy course's answer is "${opts.reference}", but other correct versions should count too.`;
  } else if (opts.mode === "answer") {
    task = `I answered this question in ${L.name}: "${opts.prompt}" (${opts.promptEn})`;
  } else {
    task = `This is a short journal entry${opts.prompt ? ` about "${opts.prompt}"` : ""}.`;
  }
  return `${intro}\n\n${task}\n\nWhat I wrote:\n${opts.text.trim()}\n\n${RULES}`;
}

export function chatPrompt(s: ChatScenario, doneUnits: string[]): string {
  return `Let's practice ${L.name} with a role-play.${IS_ES ? " Use Mexican Spanish." : ""} ${levelLine(doneUnits)}

The situation: ${s.blurb}
Your role: ${s.role}

Rules for the whole conversation:
- Reply in 1 to 3 short, simple ${L.name} sentences, then the English translation in parentheses.
- Usually end with a simple question so the conversation keeps going.
- After each of my messages, if I made a mistake, first add a short line starting with "Fix:" showing my sentence corrected and why, in English.
- Stay in character. Don't use em dashes.

Start the conversation now by saying: "${s.opener}"`;
}

export async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // older browsers
    try {
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      const ok = document.execCommand("copy");
      ta.remove();
      return ok;
    } catch {
      return false;
    }
  }
}

/** Copy the prompt and open a new claude.ai chat with it. */
export async function openInClaude(text: string): Promise<boolean> {
  // open first so the browser treats it as part of the tap
  const win = window.open(`https://claude.ai/new?q=${encodeURIComponent(text)}`, "_blank", "noopener");
  const copied = await copyText(text);
  return Boolean(win) || copied;
}
