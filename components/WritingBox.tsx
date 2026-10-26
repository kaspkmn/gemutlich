"use client";

import { useEffect, useRef } from "react";
import UmlautKeys from "./UmlautKeys";

export default function WritingBox({
  value,
  onChange,
  onSubmit,
  busy,
  disabled,
  placeholder = "Schreib hier... (Write here)",
  rows = 3,
  submitLabel = "Check my German",
  enterToSubmit = false,
  autoFocus = true,
}: {
  value: string;
  onChange: (v: string) => void;
  onSubmit: () => void;
  busy?: boolean;
  disabled?: boolean;
  placeholder?: string;
  rows?: number;
  submitLabel?: string;
  enterToSubmit?: boolean;
  autoFocus?: boolean;
}) {
  const ref = useRef<HTMLTextAreaElement>(null);
  useEffect(() => {
    if (autoFocus) ref.current?.focus();
  }, [autoFocus]);
  return (
    <form
      className="stack"
      onSubmit={(e) => {
        e.preventDefault();
        if (!busy && value.trim()) onSubmit();
      }}
    >
      <textarea
        ref={ref}
        className="text-input"
        rows={rows}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          const submitCombo = enterToSubmit ? e.key === "Enter" && !e.shiftKey : e.key === "Enter" && (e.metaKey || e.ctrlKey);
          if (submitCombo) {
            e.preventDefault();
            if (!busy && value.trim()) onSubmit();
          }
        }}
        placeholder={placeholder}
        lang="de"
        spellCheck={false}
        autoCorrect="off"
        autoCapitalize="sentences"
        disabled={disabled}
        aria-label="Your German"
        style={rows <= 2 ? { minHeight: 0 } : undefined}
      />
      <div className="row between wrap">
        <UmlautKeys target={ref} onInsert={onChange} />
        <button className="btn" type="submit" style={{ marginLeft: "auto" }} disabled={busy || disabled || !value.trim()}>
          {busy ? (
            <span className="typing-dots" aria-label="Checking">
              <i />
              <i />
              <i />
            </span>
          ) : (
            submitLabel
          )}
        </button>
      </div>
    </form>
  );
}
