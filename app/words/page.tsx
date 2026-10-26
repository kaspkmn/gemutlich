"use client";

import { useMemo, useState } from "react";
import { useStore } from "@/lib/store";
import { ALL_WORDS, getUnit } from "@/content/course";
import type { CourseWord } from "@/content/types";
import { norm } from "@/lib/answers";
import { strength, type Strength } from "@/lib/srs";
import SpeakButton from "@/components/SpeakButton";

const TYPES = [
  { id: "all", label: "All" },
  { id: "noun", label: "Nouns" },
  { id: "verb", label: "Verbs" },
  { id: "adj", label: "Describing" },
  { id: "phrase", label: "Phrases" },
  { id: "other", label: "Other" },
] as const;

const LEVEL: Record<Strength, number> = { new: 0, learning: 1, familiar: 2, strong: 3 };

export default function WordsPage() {
  const { state } = useStore();
  const [q, setQ] = useState("");
  const [type, setType] = useState<(typeof TYPES)[number]["id"]>("all");
  const [scope, setScope] = useState<"deck" | "course">("deck");

  const custom: CourseWord[] = useMemo(
    () => Object.entries(state.custom).map(([id, w]) => ({ ...w, id, unitId: "custom", custom: true })),
    [state.custom]
  );

  const list = useMemo(() => {
    const base = scope === "deck" ? [...ALL_WORDS.filter((w) => state.cards[w.id]), ...custom] : [...ALL_WORDS, ...custom];
    const nq = norm(q);
    return base.filter((w) => {
      if (type !== "all") {
        if (type === "other" ? !["word", "number"].includes(w.type) : w.type !== type) return false;
      }
      if (!nq) return true;
      return norm(w.de).includes(nq) || w.en.toLowerCase().includes(q.toLowerCase().trim());
    });
  }, [scope, q, type, state.cards, custom]);

  const deckSize = Object.keys(state.cards).length;

  return (
    <div className="page">
      <div className="page-head">
        <h1>Word bank</h1>
        <p className="sub">
          {deckSize
            ? `${deckSize} words in your deck. The bars show how well each one has stuck.`
            : "Words show up here as you finish lessons."}
        </p>
      </div>

      <input
        className="text-input"
        type="search"
        placeholder="Search German or English"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        aria-label="Search words"
      />

      <div className="chips" role="group" aria-label="Which words">
        <button className="chip" aria-pressed={scope === "deck"} onClick={() => setScope("deck")}>
          My deck
        </button>
        <button className="chip" aria-pressed={scope === "course"} onClick={() => setScope("course")}>
          Whole course
        </button>
      </div>
      <div className="chips" role="group" aria-label="Word type">
        {TYPES.map((t) => (
          <button key={t.id} className="chip" aria-pressed={type === t.id} onClick={() => setType(t.id)}>
            {t.label}
          </button>
        ))}
      </div>

      {list.length === 0 ? (
        <p className="notice">{q ? `Nothing matches "${q}".` : "No words here yet."}</p>
      ) : (
        <ul className="word-list">
          {list.map((w) => {
            const c = state.cards[w.id];
            const lvl = c ? LEVEL[strength(c)] : -1;
            const unit = w.custom ? "Saved from writing" : getUnit(w.unitId)?.title;
            return (
              <li key={w.id} className="word-item">
                <span className={`bar g-${w.gender ?? ""}`} />
                <div className="grow">
                  <p className="de" lang="de">
                    {w.de}
                  </p>
                  <p className="small muted">
                    {w.en}
                    {w.plural ? `, plural ${w.plural}` : ""}
                  </p>
                  <p className="tiny faint">{unit}</p>
                </div>
                {lvl >= 0 && (
                  <span className="strength" title={strength(c)} aria-label={`Strength: ${strength(c)}`}>
                    {[1, 2, 3].map((n) => (
                      <i key={n} className={lvl >= n ? "on" : ""} />
                    ))}
                  </span>
                )}
                <SpeakButton text={w.de} />
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
