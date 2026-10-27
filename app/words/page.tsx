"use client";

import { useMemo, useRef, useState } from "react";
import { useStore } from "@/lib/store";
import { ALL_WORDS, getUnit } from "@/content/course";
import type { CourseWord, Gender, WordType } from "@/content/types";
import { norm } from "@/lib/answers";
import { strength, type Strength } from "@/lib/srs";
import SpeakButton from "@/components/SpeakButton";
import UmlautKeys from "@/components/UmlautKeys";
import { IconTrash } from "@/components/Icons";

const TYPES = [
  { id: "all", label: "All" },
  { id: "mine", label: "My phrases" },
  { id: "noun", label: "Nouns" },
  { id: "verb", label: "Verbs" },
  { id: "adj", label: "Describing" },
  { id: "phrase", label: "Phrases" },
] as const;

const LEVEL: Record<Strength, number> = { new: 0, learning: 1, familiar: 2, strong: 3 };

export default function WordsPage() {
  const { state, addCustomWord, removeCustomWord } = useStore();
  const [q, setQ] = useState("");
  const [type, setType] = useState<(typeof TYPES)[number]["id"]>("all");
  const [scope, setScope] = useState<"deck" | "course">("deck");

  // add-your-own form
  const [de, setDe] = useState("");
  const [en, setEn] = useState("");
  const [kind, setKind] = useState<"phrase" | "noun" | "word">("phrase");
  const [gender, setGender] = useState<Gender>("m");
  const [msg, setMsg] = useState("");
  const deRef = useRef<HTMLInputElement>(null);

  const custom: CourseWord[] = useMemo(
    () => Object.entries(state.custom).map(([id, w]) => ({ ...w, id, unitId: "custom", custom: true })),
    [state.custom]
  );

  const list = useMemo(() => {
    const base =
      type === "mine" ? custom : scope === "deck" ? [...ALL_WORDS.filter((w) => state.cards[w.id]), ...custom] : [...ALL_WORDS, ...custom];
    const nq = norm(q);
    return base.filter((w) => {
      if (type !== "all" && type !== "mine" && w.type !== type) return false;
      if (!nq) return true;
      return norm(w.de).includes(nq) || w.en.toLowerCase().includes(q.toLowerCase().trim());
    });
  }, [scope, q, type, state.cards, custom]);

  const add = (e: React.FormEvent) => {
    e.preventDefault();
    const g = de.trim();
    const m = en.trim();
    if (!g || !m) return;
    let word = g;
    if (kind === "noun" && !/^(der|die|das) /i.test(g)) word = `${{ m: "der", f: "die", n: "das", pl: "die" }[gender]} ${g}`;
    const ok = addCustomWord({ de: word, en: m, type: kind as WordType, gender: kind === "noun" ? gender : undefined });
    setMsg(ok ? `Added "${word}" to your flashcards.` : `"${word}" is already in your flashcards.`);
    if (ok) {
      setDe("");
      setEn("");
    }
  };

  const deckSize = Object.keys(state.cards).length;

  return (
    <div className="page">
      <div className="page-head">
        <h1>Words & phrases</h1>
        <p className="sub">{deckSize ? `${deckSize} in your flashcards.` : "Words land here as you finish lessons."}</p>
      </div>

      <form className="panel stack" onSubmit={add}>
        <div>
          <h2>Add your own</h2>
          <p className="small muted">
            German you'll actually use: things about your job, your pets, your routine. Each one becomes a flashcard.
          </p>
        </div>
        <div className="chips" role="group" aria-label="Kind">
          {(
            [
              ["phrase", "Phrase or sentence"],
              ["noun", "Noun"],
              ["word", "Other word"],
            ] as const
          ).map(([k, l]) => (
            <button type="button" key={k} className="chip" aria-pressed={kind === k} onClick={() => setKind(k)}>
              {l}
            </button>
          ))}
        </div>
        <div className="form-row">
          <input
            ref={deRef}
            className="text-input"
            placeholder={kind === "noun" ? "German, like Hund" : "German, like Ich habe einen Hund."}
            value={de}
            onChange={(e) => setDe(e.target.value)}
            lang="de"
            aria-label="German"
          />
          <input className="text-input" placeholder="English meaning" value={en} onChange={(e) => setEn(e.target.value)} aria-label="English" />
        </div>
        {kind === "noun" && (
          <div className="chips" role="group" aria-label="Gender">
            {(
              [
                ["m", "der"],
                ["f", "die"],
                ["n", "das"],
                ["pl", "plural"],
              ] as const
            ).map(([g, l]) => (
              <button type="button" key={g} className="chip" aria-pressed={gender === g} onClick={() => setGender(g)}>
                {l}
              </button>
            ))}
          </div>
        )}
        <div className="row between wrap">
          <UmlautKeys target={deRef} onInsert={setDe} />
          <button className="btn" type="submit" disabled={!de.trim() || !en.trim()}>
            Add
          </button>
        </div>
        {msg && <p className="small muted">{msg}</p>}
      </form>

      <input className="text-input" type="search" placeholder="Search German or English" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Search words" />

      <div className="chips" role="group" aria-label="Which words">
        <button className="chip" aria-pressed={scope === "deck"} onClick={() => setScope("deck")}>
          My flashcards
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
        <p className="notice">{q ? `Nothing matches "${q}".` : type === "mine" ? "Nothing added yet. Use the form above." : "No words here yet."}</p>
      ) : (
        <ul className="word-list">
          {list.map((w) => {
            const c = state.cards[w.id];
            const lvl = c ? LEVEL[strength(c)] : -1;
            const source = w.custom ? "Added by you" : getUnit(w.unitId)?.title;
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
                  <p className="tiny faint">{source}</p>
                </div>
                {lvl >= 0 && (
                  <span className="strength" aria-label={`Strength: ${strength(c)}`}>
                    {[1, 2, 3].map((n) => (
                      <i key={n} className={lvl >= n ? "on" : ""} />
                    ))}
                  </span>
                )}
                <SpeakButton text={w.de} />
                {w.custom && (
                  <button className="icon-btn" aria-label={`Delete ${w.de}`} title="Delete" onClick={() => removeCustomWord(w.id)}>
                    <IconTrash size={17} />
                  </button>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
