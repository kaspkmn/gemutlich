"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { SCENARIOS, type ChatScenario } from "@/content/course";
import { useStore } from "@/lib/store";
import { useDoneUnits } from "@/lib/useDoneUnits";
import { askAi, AiWord, ChatResult, useAiEnabled } from "@/lib/ai-client";
import WritingBox from "@/components/WritingBox";
import { chatPrompt, openInClaude } from "@/lib/claude-handoff";
import AiNotice from "@/components/AiNotice";
import SpeakButton, { useSpeak } from "@/components/SpeakButton";
import { NewWords } from "@/components/Correction";
import { IconArrowLeft } from "@/components/Icons";

type Msg =
  | { role: "assistant"; text: string; en: string; words?: AiWord[] }
  | { role: "user"; text: string; fix?: { corrected: string; explanation: string } };

const storeKey = (id: string) => `gemutlich-chat-${id}`;

function loadChat(s: ChatScenario): Msg[] {
  try {
    const raw = localStorage.getItem(storeKey(s.id));
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length) return parsed;
    }
  } catch {}
  return [{ role: "assistant", text: s.opener, en: s.openerEn }];
}

function saveChat(id: string, msgs: Msg[]) {
  try {
    localStorage.setItem(storeKey(id), JSON.stringify(msgs.slice(-60)));
  } catch {}
}

export default function ChatPage() {
  const enabled = useAiEnabled();
  const done = useDoneUnits();
  const [scenario, setScenario] = useState<ChatScenario | null>(null);
  const [opened, setOpened] = useState<string | null>(null);

  if (scenario) return <Conversation scenario={scenario} onBack={() => setScenario(null)} disabled={false} />;

  return (
    <div className="page">
      <div className="page-head">
        <Link href="/write" className="back-link">
          <IconArrowLeft size={15} /> Write
        </Link>
        <h1>Chat</h1>
        <p className="sub">
          {enabled
            ? "Pick a situation and talk. Replies stay simple, you can play any message, and your mistakes get fixed right under what you wrote."
            : "Pick a situation and the conversation opens in claude.ai, set up as a German role-play at your level. It replies in simple German with translations and fixes your mistakes as you go."}
        </p>
      </div>
      {enabled === false && opened && (
        <p className="notice small">
          Opened claude.ai in a new tab with the role-play set up. If the message box is empty, it's also copied, so just paste and send.
        </p>
      )}
      <div className="mode-grid">
        {SCENARIOS.map((s) => (
          <button
            key={s.id}
            className="mode-card"
            disabled={enabled === null}
            onClick={() => {
              if (enabled) setScenario(s);
              else {
                openInClaude(chatPrompt(s, done));
                setOpened(s.id);
              }
            }}
          >
            <b>{s.title}</b>
            <span className="de" lang="de">
              {s.titleDe}
            </span>
            <span className="small muted">{s.blurb}</span>
            {enabled === false && <span className="tiny red">Opens in claude.ai</span>}
          </button>
        ))}
      </div>
    </div>
  );
}

function Conversation({ scenario, onBack, disabled }: { scenario: ChatScenario; onBack: () => void; disabled: boolean }) {
  const { logWriting, state } = useStore();
  const done = useDoneUnits();
  const say = useSpeak();
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [showEn, setShowEn] = useState<Set<number>>(new Set());
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMsgs(loadChat(scenario));
  }, [scenario]);

  useEffect(() => {
    if (msgs.length) saveChat(scenario.id, msgs);
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [msgs, scenario.id]);

  const send = async () => {
    const mine = text.trim();
    if (!mine) return;
    const withMine: Msg[] = [...msgs, { role: "user", text: mine }];
    setMsgs(withMine);
    setText("");
    setBusy(true);
    setError("");
    try {
      const r = await askAi<ChatResult>({
        task: "chat",
        scenarioId: scenario.id,
        units: done,
        history: withMine.map((m) => ({ role: m.role, text: m.text })),
      });
      const fixed = withMine.map((m, i) =>
        i === withMine.length - 1 && m.role === "user" && r.correction.has_mistakes
          ? { ...m, fix: { corrected: r.correction.corrected, explanation: r.correction.explanation } }
          : m
      );
      setMsgs([...fixed, { role: "assistant", text: r.reply, en: r.reply_en, words: r.new_words }]);
      if (state.settings.autoplay) say(r.reply);
      const lastThem = [...msgs].reverse().find((m) => m.role === "assistant");
      logWriting(
        {
          mode: "chat",
          prompt: lastThem?.text ?? scenario.opener,
          text: mine,
          corrected: r.correction.has_mistakes ? r.correction.corrected : mine,
          verdict: r.correction.has_mistakes ? "almost" : "good",
          note: r.correction.has_mistakes ? r.correction.explanation : undefined,
        },
        4
      );
    } catch (e) {
      setError((e as Error).message);
      // give the message back so nothing is lost
      setMsgs(msgs);
      setText(mine);
    } finally {
      setBusy(false);
    }
  };

  const restart = () => {
    const fresh: Msg[] = [{ role: "assistant", text: scenario.opener, en: scenario.openerEn }];
    setMsgs(fresh);
    setShowEn(new Set());
  };

  return (
    <div className="page">
      <div className="page-head">
        <div className="row between">
          <button className="back-link" onClick={onBack}>
            <IconArrowLeft size={15} /> All chats
          </button>
          <button className="link-btn small" onClick={restart}>
            Start over
          </button>
        </div>
        <h1>{scenario.title}</h1>
        <p className="sub">{scenario.titleDe}</p>
      </div>

      {disabled && <AiNotice />}

      <div className="chat" aria-live="polite">
        {msgs.map((m, i) =>
          m.role === "assistant" ? (
            <div key={i} className="bubble them">
              <div className="row" style={{ alignItems: "flex-start" }}>
                <p className="grow" lang="de">
                  {m.text}
                </p>
                <SpeakButton text={m.text} />
              </div>
              {showEn.has(i) ? (
                <p className="trans">{m.en}</p>
              ) : (
                <button
                  className="link-btn tiny"
                  style={{ alignSelf: "flex-start", padding: 0 }}
                  onClick={() => setShowEn(new Set(showEn).add(i))}
                >
                  Show English
                </button>
              )}
              {m.words && m.words.length > 0 && <NewWords words={m.words} />}
            </div>
          ) : (
            <div key={i} className="stack tight" style={{ alignItems: "flex-end" }}>
              <div className="bubble me">
                <p lang="de">{m.text}</p>
              </div>
              {m.fix && (
                <div className="bubble-fix">
                  <p>
                    <b lang="de">{m.fix.corrected}</b>
                  </p>
                  <p className="small">{m.fix.explanation}</p>
                </div>
              )}
            </div>
          )
        )}
        {busy && (
          <div className="bubble them" aria-label="Typing">
            <span className="typing-dots">
              <i />
              <i />
              <i />
            </span>
          </div>
        )}
        <div ref={endRef} />
      </div>

      {error && (
        <p role="alert" style={{ color: "var(--bad)" }}>
          {error}
        </p>
      )}

      <div className="chat-input">
        <WritingBox
          value={text}
          onChange={setText}
          onSubmit={send}
          busy={busy}
          disabled={disabled}
          rows={2}
          submitLabel="Send"
          enterToSubmit
          placeholder="Antworte auf Deutsch... (Reply in German)"
        />
      </div>
    </div>
  );
}
