import { ALL_SENTENCES, UNITS } from "@/content/course";
import type { CourseWord } from "@/content/types";
import { sample } from "./exercises";
import { tokens } from "./answers";
import type { SpeakItem } from "@/components/SpeakRunner";

export type SpeakMode = "words" | "sentences" | "shadow";

export function speakItemsFor(mode: SpeakMode, deck: CourseWord[], doneUnits: string[], n = 8): SpeakItem[] {
  const units = doneUnits.length ? doneUnits : UNITS.slice(0, 3).map((u) => u.id);
  if (mode === "words") {
    const pool = deck.length ? deck : UNITS.filter((u) => units.includes(u.id)).flatMap((u) => u.words.map((w) => ({ ...w, id: w.de, unitId: u.id })));
    return sample(
      pool.filter((w) => !w.noType),
      n
    ).map((w) => ({ de: w.de, en: w.en }));
  }
  const sentences = ALL_SENTENCES.filter((s) => units.includes(s.unitId) && tokens(s.de).length <= (mode === "shadow" ? 7 : 10));
  return sample(sentences, n).map((s) => ({ de: s.de, en: s.en }));
}

