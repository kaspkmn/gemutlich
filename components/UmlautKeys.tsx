"use client";

import { IS_ES, L } from "@/lib/lang";

const KEYS = IS_ES ? L.keys : [...L.keys, "Ä", "Ö", "Ü"];

/** Inserts special characters at the cursor of the referenced input. */
export default function UmlautKeys({
  target,
  onInsert,
}: {
  target: React.RefObject<HTMLInputElement | HTMLTextAreaElement | null>;
  onInsert: (value: string) => void;
}) {
  const insert = (ch: string) => {
    const el = target.current;
    if (!el) return;
    const start = el.selectionStart ?? el.value.length;
    const end = el.selectionEnd ?? el.value.length;
    const next = el.value.slice(0, start) + ch + el.value.slice(end);
    onInsert(next);
    requestAnimationFrame(() => {
      el.focus();
      el.setSelectionRange(start + ch.length, start + ch.length);
    });
  };
  return (
    <div className="umlauts" aria-label="Special characters">
      {KEYS.map((k) => (
        <button key={k} type="button" onMouseDown={(e) => e.preventDefault()} onClick={() => insert(k)}>
          {k}
        </button>
      ))}
    </div>
  );
}
