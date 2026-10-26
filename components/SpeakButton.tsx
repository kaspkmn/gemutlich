"use client";

import { speak, speechSupported } from "@/lib/speech";
import { useStore } from "@/lib/store";
import { IconSpeaker } from "./Icons";
import { useEffect, useState } from "react";

export function useSpeak() {
  const { state } = useStore();
  return (text: string, slow = false) =>
    speak(text, { rate: slow ? Math.max(0.5, state.settings.rate - 0.3) : state.settings.rate, voiceURI: state.settings.voiceURI });
}

export default function SpeakButton({ text, big = false, label }: { text: string; big?: boolean; label?: string }) {
  const say = useSpeak();
  const [ok, setOk] = useState(true);
  useEffect(() => setOk(speechSupported()), []);
  if (!ok) return null;
  return (
    <button
      type="button"
      className={`speak${big ? " big" : ""}`}
      onClick={(e) => {
        e.stopPropagation();
        say(text);
      }}
      aria-label={label ?? `Listen: ${text}`}
      title="Listen"
    >
      <IconSpeaker size={big ? 30 : 20} />
    </button>
  );
}
