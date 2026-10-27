"use client";

import { useState } from "react";
import { openInClaude } from "@/lib/claude-handoff";

/** Opens claude.ai with a tutor prompt (also copied, in case it doesn't fill in). Free with a Claude subscription. */
export default function ClaudeHandoff({
  prompt,
  label = "Get feedback in Claude",
  ghost = false,
  onSent,
  disabled,
}: {
  prompt: () => string;
  label?: string;
  ghost?: boolean;
  onSent?: () => void;
  disabled?: boolean;
}) {
  const [sent, setSent] = useState(false);
  return (
    <div className="stack tight">
      <button
        type="button"
        className={`btn block${ghost ? " ghost" : ""}`}
        disabled={disabled}
        onClick={async () => {
          await openInClaude(prompt());
          setSent(true);
          onSent?.();
        }}
      >
        {label}
      </button>
      {sent && (
        <p className="small muted">
          Opened claude.ai in a new tab with your writing filled in. If the message box is empty, it's also copied, so just paste.
        </p>
      )}
    </div>
  );
}
