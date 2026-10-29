import { UNITS as UNITS_1 } from "./units";
import { UNITS_2 } from "./units2";
import { ES_UNITS_1 } from "./es/units";
import { ES_UNITS_2 } from "./es/units2";
import { ES_SCENARIOS } from "./es/scenarios";
import type { ChatScenario, CourseWord, Unit } from "./types";
import { IS_ES, type Lang } from "@/lib/lang";

export type { ChatScenario } from "./types";

/** Lessons for the language being studied. */
export const UNITS: Unit[] = IS_ES ? [...ES_UNITS_1, ...ES_UNITS_2] : [...UNITS_1, ...UNITS_2];

export const ALL_WORDS: CourseWord[] = UNITS.flatMap((u) =>
  u.words.map((w) => ({ ...w, id: w.de, unitId: u.id }))
);

const WORD_MAP = new Map(ALL_WORDS.map((w) => [w.id, w]));
const UNIT_MAP = new Map(UNITS.map((u) => [u.id, u]));

export const getCourseWord = (id: string) => WORD_MAP.get(id);
export const getUnit = (id: string): Unit | undefined => UNIT_MAP.get(id);

/** Sentences with an English meaning, used for translation writing practice. */
export interface PracticeSentence {
  de: string;
  en: string;
  unitId: string;
}

export const ALL_SENTENCES: PracticeSentence[] = UNITS.flatMap((u) => {
  const out: PracticeSentence[] = [];
  for (const d of u.drills) {
    if (d.t === "build") out.push({ de: d.de, en: d.en, unitId: u.id });
    if (d.t === "fill") out.push({ de: d.de.replace("___", d.answer), en: d.en, unitId: u.id });
  }
  for (const w of u.words) {
    if (w.ex) out.push({ de: w.ex[0], en: w.ex[1], unitId: u.id });
  }
  return out;
});

export const ALL_PROMPTS = UNITS.flatMap((u) =>
  (u.prompts ?? []).map(([de, en]) => ({ de, en, unitId: u.id }))
);

export const DE_SCENARIOS: ChatScenario[] = [
  {
    id: "cafe",
    title: "At the café",
    titleDe: "Im Café",
    blurb: "Order a drink and something to eat, then pay.",
    opener: "Hallo! Was möchten Sie trinken?",
    openerEn: "Hello! What would you like to drink?",
    role: "You are Lena, a friendly server at a small café in Munich. The learner is a customer. Take their order, suggest something from the cake counter, and eventually help them pay. Use Sie with the customer.",
  },
  {
    id: "meet",
    title: "Meeting someone new",
    titleDe: "Kennenlernen",
    blurb: "Small talk: names, where you're from, what you like.",
    opener: "Hallo! Ich bin Jonas. Wie heißt du?",
    openerEn: "Hi! I'm Jonas. What's your name?",
    role: "You are Jonas, a relaxed guy in his late twenties meeting the learner at a friend's party in Munich. Make small talk: names, where they're from, work, hobbies, food, weekends. Use du.",
  },
  {
    id: "bakery",
    title: "At the bakery",
    titleDe: "In der Bäckerei",
    blurb: "Buy bread and pastries, ask what things cost.",
    opener: "Guten Morgen! Was darf es sein?",
    openerEn: "Good morning! What can I get you?",
    role: "You are Frau Huber, a warm older woman who runs a Bavarian bakery. The learner wants to buy something. Offer Brezen (pretzels), Semmeln (rolls), Brot and Kuchen, say prices in euros, and use Sie.",
  },
  {
    id: "directions",
    title: "Asking for directions",
    titleDe: "Nach dem Weg fragen",
    blurb: "Find the train station, a pharmacy, or a café.",
    opener: "Ja, bitte? Kann ich Ihnen helfen?",
    openerEn: "Yes? Can I help you?",
    role: "You are a helpful local on a street in Munich. The learner is lost and asks for directions. Give simple directions with links, rechts, geradeaus, and mention how far it is. Use Sie.",
  },
  {
    id: "free",
    title: "Free chat",
    titleDe: "Freies Gespräch",
    blurb: "Talk about anything: your day, plans, what you like.",
    opener: "Hallo! Wie geht's dir heute?",
    openerEn: "Hi! How are you today?",
    role: "You are Mia, a friendly German pen pal. Chat about whatever the learner brings up: their day, plans, food, hobbies, weekends. Use du.",
  },
];

/** Lessons and scenarios for a specific language, for the server (which can't know the browser's choice). */
export function unitsFor(lang: Lang): Unit[] {
  return lang === "es" ? [...ES_UNITS_1, ...ES_UNITS_2] : [...UNITS_1, ...UNITS_2];
}
export function scenariosFor(lang: Lang): ChatScenario[] {
  return lang === "es" ? ES_SCENARIOS : DE_SCENARIOS;
}

/** Role-play situations for the Write tab. */
export const SCENARIOS: ChatScenario[] = IS_ES ? ES_SCENARIOS : DE_SCENARIOS;
