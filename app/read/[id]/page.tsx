"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { STORIES } from "@/content/stories";
import { getUnit } from "@/content/course";
import { useStore } from "@/lib/store";
import { lookupWord, splitWords, type Lookup } from "@/lib/lexicon";
import { speakLines, stopSpeaking } from "@/lib/speech";
import { shuffle } from "@/lib/exercises";
import SpeakButton from "@/components/SpeakButton";
import { IconArrowLeft, IconPlay, IconStop, IconX } from "@/components/Icons";

export default function StoryPage() {
  const { id } = useParams<{ id: string }>();
  const story = STORIES.find((s) => s.id === id);
  const { state, addCards, addCustomWord, markRead } = useStore();
  const [showEn, setShowEn] = useState(false);
  const [sel, setSel] = useState<{ key: string; hit: Lookup } | null>(null);
  const [playing, setPlaying] = useState<number | null>(null);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [done, setDone] = useState(false);

  const sentences = useMemo(() => (story ? story.lines.filter((l): l is [string, string] => Boolean(l)) : []), [story]);
  // shuffle answer order in the browser only, so server and browser render the same first
  const [questions, setQuestions] = useState(() => story?.questions ?? []);
  useEffect(() => {
    if (story) setQuestions(story.questions.map((q) => ({ ...q, options: shuffle(q.options) })));
  }, [story]);

  useEffect(() => () => stopSpeaking(), []);

  if (!story) {
    return (
      <div className="page">
        <h1>Story not found</h1>
        <Link href="/read" className="btn">
          All stories
        </Link>
      </div>
    );
  }

  const unit = getUnit(story.after)!;
  const allAnswered = questions.every((_, i) => answers[i]);
  const right = questions.filter((q, i) => answers[i] === q.answer).length;

  const play = () => {
    if (playing !== null) {
      stopSpeaking();
      setPlaying(null);
      return;
    }
    speakLines(
      sentences.map(([de]) => ({ text: de, who: 0 })),
      {
        rate: state.settings.rate,
        voiceURI: state.settings.voiceURI,
        onLine: (i) => setPlaying(i),
        onDone: () => setPlaying(null),
      }
    );
    setPlaying(0);
  };

  const inDeck = (hit: Lookup) => Boolean(state.cards[hit.courseId ?? hit.base]);
  const save = (hit: Lookup) => {
    if (hit.courseId) addCards([hit.courseId]);
    else addCustomWord({ de: hit.base, en: hit.meaning, type: "word" });
  };

  let sentenceIndex = -1;
  const paragraphs: [string, string][][] = [[]];
  for (const l of story.lines) {
    if (l === null) paragraphs.push([]);
    else paragraphs[paragraphs.length - 1].push(l);
  }

  return (
    <div className="page">
      <div className="page-head">
        <Link href="/read" className="back-link">
          <IconArrowLeft size={15} /> Stories
        </Link>
        <h1 lang="de">{story.title}</h1>
        <p className="sub">{story.titleEn}</p>
      </div>

      {!state.units[story.after]?.completed && (
        <p className="notice small">
          This story uses words from lesson {unit.n} ({unit.title}). You can read it now, but it'll be easier after that lesson.
        </p>
      )}

      <div className="row wrap">
        <button className="btn small" onClick={play}>
          {playing !== null ? <IconStop size={16} /> : <IconPlay size={16} />}
          {playing !== null ? "Stop" : "Listen"}
        </button>
        <button className="chip" aria-pressed={showEn} onClick={() => setShowEn(!showEn)}>
          Show English
        </button>
      </div>

      <article className="story-text" lang="de" onClick={(e) => e.target === e.currentTarget && setSel(null)}>
        {paragraphs.map((para, pi) => (
          <p key={pi}>
            {para.map(([de, en]) => {
              sentenceIndex++;
              const si = sentenceIndex;
              return (
                <span key={si} style={playing === si ? { background: "var(--red-tint)", borderRadius: 4 } : undefined}>
                  {splitWords(de).map((t, ti) => {
                    if (!t.word) return <span key={ti}>{t.text}</span>;
                    const key = `${si}-${ti}`;
                    const hit = lookupWord(t.text, story);
                    return (
                      <button
                        key={ti}
                        className="tw"
                        aria-expanded={sel?.key === key}
                        onClick={() => (hit ? setSel(sel?.key === key ? null : { key, hit }) : setSel(null))}
                      >
                        {t.text}
                      </button>
                    );
                  })}{" "}
                  {showEn && (
                    <span className="sentence-en" lang="en">
                      {en}
                    </span>
                  )}
                </span>
              );
            })}
          </p>
        ))}
      </article>

      {sel && (
        <div className="word-sheet" role="dialog" aria-label={`Meaning of ${sel.hit.word}`}>
          <div className="row between">
            <span className="w" lang="de">
              {sel.hit.word}
            </span>
            <div className="row" style={{ gap: 6 }}>
              <SpeakButton text={sel.hit.word} />
              <button className="close-btn" onClick={() => setSel(null)} aria-label="Close">
                <IconX size={18} />
              </button>
            </div>
          </div>
          <p>{sel.hit.meaning}</p>
          {sel.hit.base !== sel.hit.word && (
            <p className="small faint">
              Dictionary form: <span lang="de">{sel.hit.base}</span>
            </p>
          )}
          <button className="btn small ghost" disabled={inDeck(sel.hit)} onClick={() => save(sel.hit)}>
            {inDeck(sel.hit) ? "In your flashcards" : "Add to flashcards"}
          </button>
        </div>
      )}

      <section className="panel stack">
        <h2>Did you get it?</h2>
        {questions.map((q, i) => (
          <div key={i} className="quiz-q">
            <p style={{ fontWeight: 500 }}>{q.q}</p>
            <div className="options">
              {q.options.map((o) => {
                const picked = answers[i];
                const st = picked ? (o === q.answer ? "right" : o === picked ? "wrong" : "dim") : undefined;
                return (
                  <button key={o} className="option" data-state={st} disabled={Boolean(picked)} onClick={() => setAnswers({ ...answers, [i]: o })}>
                    {o}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
        {allAnswered && !done && (
          <button
            className="btn block"
            onClick={() => {
              markRead(`story:${story.id}`, 10 + right * 3);
              setDone(true);
            }}
          >
            Finish story
          </button>
        )}
        {done && (
          <p className="muted">
            {right} of {questions.length} right. Saved as read.{" "}
            <Link href="/read" className="link-btn">
              Next story
            </Link>
          </p>
        )}
      </section>
    </div>
  );
}
