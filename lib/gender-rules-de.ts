import type { CourseWord, Gender } from "@/content/types";
import { ALL_WORDS } from "@/content/course";
import { VERBS } from "@/content/verbs";

/* How German noun genders work: patterns by ending and by meaning, plus exceptions. */

export type Reliability = "always" | "almost always" | "usually" | "often";
export type G3 = "m" | "f" | "n";

export interface GenderRule {
  id: string;
  gender: G3;
  kind: "ending" | "meaning" | "form";
  /** short label: "-ung", "days of the week" */
  label: string;
  reliability: Reliability;
  examples: string[];
  exceptions?: string[];
  note?: string;
  /** for meaning rules: "a word for a woman" and "Words for women" */
  about?: string;
  group?: string;
  /** does this rule apply to the bare noun (no article)? `en` is the English meaning if known */
  test: (bare: string, en?: string) => boolean;
}

export const ARTICLE: Record<G3, string> = { m: "der", f: "die", n: "das" };
export const GENDER_NAME: Record<G3, string> = { m: "masculine", f: "feminine", n: "neuter" };

const ends = (...suffixes: string[]) => (w: string) => suffixes.some((s) => w.toLowerCase().endsWith(s) && w.length > s.length + 1);
const inList = (list: string[]) => (w: string) => list.includes(w.toLowerCase());
const enHas = (re: RegExp) => (_: string, en?: string) => Boolean(en && re.test(en));

const DAYS = ["montag", "dienstag", "mittwoch", "donnerstag", "freitag", "samstag", "sonntag", "sonnabend"];
const MONTHS = ["januar", "februar", "märz", "april", "mai", "juni", "juli", "august", "september", "oktober", "november", "dezember"];
const SEASONS = ["frühling", "sommer", "herbst", "winter"];
const WEATHER = ["regen", "schnee", "wind", "nebel", "sturm", "hagel", "frost", "donner", "blitz", "tau"];
const DIRECTIONS = ["norden", "süden", "osten", "westen"];
const DRINKS = ["wein", "schnaps", "wodka", "whisky", "sekt", "rum", "gin", "likör"];
const PLACES_N = ["hotel", "café", "kino", "restaurant", "theater", "museum", "hostel"];
const METALS = ["gold", "silber", "eisen", "kupfer", "blei", "zinn", "platin"];
const LANGUAGES = ["deutsch", "englisch", "spanisch", "französisch", "italienisch", "japanisch", "chinesisch"];
const COLORS = ["rot", "blau", "grün", "gelb", "schwarz", "weiß", "grau", "braun", "rosa", "lila"];
const INFINITIVES = new Set(VERBS.map((v) => v.inf));

const MALE = /\b(man|men|father|brother|son|boyfriend|husband|grandpa|uncle|king|boy|male|\(man\)|\(male\))\b/i;
const FEMALE = /\b(woman|women|mother|sister|daughter|girlfriend|wife|grandma|aunt|queen|female|\(woman\)|\(female\))\b/i;

/** Ordered from most to least reliable; the first rule that fits wins. */
export const RULES: GenderRule[] = [
  // ── neuter, rock solid ──
  { id: "chen", gender: "n", kind: "ending", label: "-chen, -lein", reliability: "always", examples: ["das Mädchen", "das Brötchen", "das Fräulein"], note: "These endings mean \"little\", and they make any noun neuter. That's why das Mädchen (the girl) is neuter. (Kuchen isn't one: there the chen is just part of the word.)", test: (w) => /[^aeiouäöü]chen$/i.test(w) && w.length >= 7 || ends("lein")(w) },
  { id: "infinitive", gender: "n", kind: "form", label: "verbs used as nouns", reliability: "always", examples: ["das Essen", "das Schwimmen", "das Leben"], note: "Take any verb, capitalize it, and it becomes a das noun: essen (to eat) → das Essen (food, eating).", test: (w) => INFINITIVES.has(w.toLowerCase()) },

  // ── people and their sex ──
  { id: "female-person", gender: "f", kind: "meaning", label: "women and female animals", about: "a word for a woman or girl", group: "Words for women", reliability: "almost always", examples: ["die Frau", "die Mutter", "die Schwester", "die Freundin"], exceptions: ["das Mädchen (because of -chen)"], test: enHas(FEMALE) },
  { id: "male-person", gender: "m", kind: "meaning", label: "men and male animals", about: "a word for a man or boy", group: "Words for men", reliability: "almost always", examples: ["der Mann", "der Vater", "der Bruder", "der Junge"], test: enHas(MALE) },
  { id: "in", gender: "f", kind: "ending", label: "-in (a woman in a role)", reliability: "always", examples: ["die Freundin", "die Ärztin", "die Lehrerin", "die Kollegin"], note: "Adding -in to a masculine person word makes the female version, and it's always die: der Arzt → die Ärztin.", test: (w) => /(erin|istin|antin|entin|ärztin|ollegin|eundin)$/i.test(w) },

  // ── feminine endings ──
  { id: "ung", gender: "f", kind: "ending", label: "-ung", reliability: "always", examples: ["die Wohnung", "die Zeitung", "die Rechnung"], test: ends("ung") },
  { id: "heit", gender: "f", kind: "ending", label: "-heit, -keit", reliability: "always", examples: ["die Freiheit", "die Gesundheit", "die Möglichkeit"], test: ends("heit", "keit") },
  { id: "schaft", gender: "f", kind: "ending", label: "-schaft", reliability: "always", examples: ["die Freundschaft", "die Mannschaft"], test: ends("schaft") },
  { id: "ion", gender: "f", kind: "ending", label: "-ion", reliability: "almost always", examples: ["die Information", "die Station", "die Religion"], exceptions: ["das Stadion", "der Spion"], test: ends("ion") },
  { id: "tät", gender: "f", kind: "ending", label: "-tät", reliability: "always", examples: ["die Universität", "die Qualität"], test: ends("tät") },
  { id: "ei", gender: "f", kind: "ending", label: "-ei", reliability: "almost always", examples: ["die Bäckerei", "die Polizei", "die Türkei"], exceptions: ["das Ei (egg)", "der Papagei"], test: (w) => ends("ei")(w) && w.length > 3 },
  { id: "ie", gender: "f", kind: "ending", label: "-ie", reliability: "almost always", examples: ["die Familie", "die Biologie", "die Fantasie"], exceptions: ["das Genie"], test: ends("ie") },
  { id: "ik", gender: "f", kind: "ending", label: "-ik", reliability: "almost always", examples: ["die Musik", "die Politik", "die Physik"], exceptions: ["der Atlantik"], test: ends("ik") },
  { id: "ur", gender: "f", kind: "ending", label: "-ur", reliability: "usually", examples: ["die Natur", "die Kultur", "die Figur"], exceptions: ["das Abitur"], test: ends("ur") },
  { id: "anz", gender: "f", kind: "ending", label: "-anz, -enz", reliability: "always", examples: ["die Distanz", "die Konferenz"], test: ends("anz", "enz") },

  // ── masculine by meaning ──
  { id: "days", gender: "m", kind: "meaning", label: "days, months, seasons", about: "a day, month or season", group: "Days, months and seasons", reliability: "always", examples: ["der Montag", "der Januar", "der Sommer"], test: (w) => inList([...DAYS, ...MONTHS, ...SEASONS])(w) },
  { id: "weather", gender: "m", kind: "meaning", label: "weather and directions", about: "a weather word", group: "Weather words", reliability: "usually", examples: ["der Regen", "der Schnee", "der Wind", "der Norden"], exceptions: ["das Wetter", "die Sonne", "die Wolke", "das Gewitter"], test: (w) => inList([...WEATHER, ...DIRECTIONS, "wetter"])(w) },
  { id: "drinks", gender: "m", kind: "meaning", label: "alcoholic drinks", about: "an alcoholic drink", group: "Alcoholic drinks", reliability: "usually", examples: ["der Wein", "der Sekt", "der Wodka"], exceptions: ["das Bier"], test: inList([...DRINKS, "bier"]) },

  // ── neuter by meaning ──
  { id: "young", gender: "n", kind: "meaning", label: "babies and young beings", about: "a word for a child or young animal", group: "Words for children and babies", reliability: "usually", examples: ["das Kind", "das Baby", "das Kalb"], test: inList(["kind", "baby", "kalb", "lamm", "ferkel", "küken", "fohlen"]) },
  { id: "places-n", gender: "n", kind: "meaning", label: "hotels, cafés, cinemas, restaurants", about: "a place like a hotel, café or cinema", group: "Places like hotels, cafés and cinemas", reliability: "almost always", examples: ["das Hotel", "das Café", "das Kino", "das Restaurant"], test: inList(PLACES_N) },
  { id: "metals", gender: "n", kind: "meaning", label: "metals and chemical elements", about: "a metal", group: "Metals", reliability: "usually", examples: ["das Gold", "das Silber", "das Eisen"], exceptions: ["der Stahl", "die Bronze"], test: inList(METALS) },
  { id: "languages", gender: "n", kind: "meaning", label: "languages and colors as nouns", about: "a language or color used as a noun", group: "Languages and colors used as nouns", reliability: "always", examples: ["das Deutsch", "das Englisch", "das Rot", "das Blau"], test: inList([...LANGUAGES, ...COLORS]) },

  // ── masculine endings ──
  { id: "ling", gender: "m", kind: "ending", label: "-ling", reliability: "always", examples: ["der Frühling", "der Schmetterling", "der Liebling"], test: ends("ling") },
  { id: "ismus", gender: "m", kind: "ending", label: "-ismus", reliability: "always", examples: ["der Tourismus", "der Optimismus"], test: ends("ismus") },
  { id: "ig", gender: "m", kind: "ending", label: "-ig, -ich", reliability: "almost always", examples: ["der Honig", "der König", "der Teppich"], test: ends("ig", "ich") },
  { id: "or", gender: "m", kind: "ending", label: "-or", reliability: "usually", examples: ["der Motor", "der Doktor", "der Traktor"], exceptions: ["das Labor", "das Tor"], test: ends("or") },

  // ── neuter endings ──
  { id: "um", gender: "n", kind: "ending", label: "-um", reliability: "usually", examples: ["das Museum", "das Zentrum", "das Datum"], exceptions: ["der Irrtum", "der Reichtum"], test: ends("um") },
  { id: "ment", gender: "n", kind: "ending", label: "-ment", reliability: "usually", examples: ["das Dokument", "das Instrument", "das Apartment"], exceptions: ["der Moment"], test: ends("ment") },
  { id: "ma", gender: "n", kind: "ending", label: "-ma", reliability: "usually", examples: ["das Thema", "das Klima", "das Drama"], exceptions: ["die Oma", "die Firma"], test: ends("ma") },
  { id: "ing", gender: "n", kind: "ending", label: "-ing (English words)", reliability: "usually", examples: ["das Meeting", "das Training", "das Shopping"], exceptions: ["der Pudding"], test: (w) => ends("ing")(w) && !ends("ling")(w) },
  { id: "ge", gender: "n", kind: "form", label: "Ge- at the start", reliability: "usually", examples: ["das Geschenk", "das Gesicht", "das Gemüse", "das Getränk"], exceptions: ["der Geschmack", "die Geschichte", "der Gedanke"], test: (w) => /^ge[^aeiouäöü]/i.test(w) && w.length > 5 },
  { id: "nis", gender: "n", kind: "ending", label: "-nis", reliability: "often", examples: ["das Ergebnis", "das Zeugnis", "das Geheimnis"], exceptions: ["die Erlaubnis", "die Kenntnis"], test: ends("nis") },

  // ── the big feminine one ──
  { id: "e", gender: "f", kind: "ending", label: "-e", reliability: "usually", examples: ["die Lampe", "die Katze", "die Tasche", "die Straße"], exceptions: ["der Käse", "der Name", "der Junge (and other male people)", "das Auge", "das Ende"], note: "About 9 in 10 nouns ending in -e are die. The main exceptions are male people and animals (der Junge, der Kollege, der Löwe). Words ending in -ee, like der Kaffee and der Tee, don't count.", test: (w) => ends("e")(w) && !/ee$/i.test(w) },

  // ── weaker masculine hints ──
  { id: "en", gender: "m", kind: "ending", label: "-en", reliability: "usually", examples: ["der Kuchen", "der Garten", "der Boden", "der Wagen"], exceptions: ["das Essen (a verb used as a noun)", "das Kissen", "das Zeichen"], test: ends("en") },
  { id: "el", gender: "m", kind: "ending", label: "-el", reliability: "often", examples: ["der Apfel", "der Vogel", "der Schlüssel", "der Spiegel"], exceptions: ["die Kartoffel", "die Gabel", "das Mittel"], test: ends("el") },
  { id: "er", gender: "m", kind: "ending", label: "-er", reliability: "often", examples: ["der Computer", "der Lehrer", "der Fernseher", "der Koffer"], exceptions: ["das Fenster", "das Zimmer", "das Wasser", "die Butter", "die Mutter"], note: "Especially reliable for people and tools made from verbs (lehren → der Lehrer). Lots of everyday exceptions, though.", test: ends("er") },
];

/** Common last parts of compound nouns, so Kühlschrank is recognized as ... + der Schrank. */
const COMPOUND_PARTS: Record<string, G3> = {
  hof: "m", markt: "m", hafen: "m", schirm: "m", platz: "m", laden: "m", saft: "m", tag: "m", schrank: "m", kuchen: "m",
  stelle: "f", bahn: "f", tür: "f", zeit: "f", karte: "f", straße: "f", stunde: "f",
  haus: "n", zimmer: "n", essen: "n", ende: "n", stück: "n", spiel: "n", buch: "n", bild: "n", geld: "n", wasser: "n",
};

function courseBareNouns(): Map<string, G3> {
  const m = new Map<string, G3>();
  for (const w of ALL_WORDS) {
    if (w.type !== "noun" || !w.gender || w.gender === "pl") continue;
    const bare = w.de.replace(/^(der|die|das) /, "");
    if (!bare.includes(" ")) m.set(bare.toLowerCase(), w.gender);
  }
  return m;
}
const KNOWN = courseBareNouns();

export interface GenderGuess {
  gender: G3;
  rule?: GenderRule;
  /** for compounds: the last part that decides */
  head?: string;
  reason: string;
  reliability: Reliability;
}

/** Find the last part of a compound noun that we know the gender of. */
function compoundHead(bare: string): { head: string; gender: G3 } | null {
  // hyphenated: U-Bahn → Bahn
  if (bare.includes("-")) {
    const last = bare.split("-").pop()!.toLowerCase();
    const g = KNOWN.get(last) ?? COMPOUND_PARTS[last];
    if (g) return { head: last, gender: g };
  }
  const low = bare.toLowerCase();
  let best: { head: string; gender: G3 } | null = null;
  const consider = (part: string, g: G3) => {
    if (low.length > part.length + 2 && low.endsWith(part) && (!best || part.length > best.head.length)) best = { head: part, gender: g };
  };
  for (const [part, g] of Object.entries(COMPOUND_PARTS)) consider(part, g);
  for (const [part, g] of KNOWN) if (part.length >= 3) consider(part, g);
  return best;
}

const cap = (s: string) => s[0].toUpperCase() + s.slice(1);

/** Predict a noun's gender from its form and meaning, with the reason. */
export function guessGender(bare: string, en?: string): GenderGuess | null {
  const word = bare.trim();
  if (!word) return null;
  // the strongest rules come before compounds (das Mädchen, das Essen, people)
  const strong = RULES.filter((r) => ["chen", "infinitive", "female-person", "male-person", "in", "days"].includes(r.id));
  for (const r of strong) {
    if (r.test(word, en)) return { gender: r.gender, rule: r, reason: ruleReason(r, word), reliability: r.reliability };
  }
  const comp = compoundHead(word);
  if (comp) {
    const head = cap(comp.head);
    return {
      gender: comp.gender,
      head,
      reason: `${word} is a compound ending in ${head}, and the last part decides the gender: ${ARTICLE[comp.gender]} ${head}, so ${ARTICLE[comp.gender]} ${word}.`,
      reliability: "always",
    };
  }
  for (const r of RULES) {
    if (strong.includes(r)) continue;
    if (r.test(word, en)) return { gender: r.gender, rule: r, reason: ruleReason(r, word), reliability: r.reliability };
  }
  return null;
}

/** The actual ending a word matched: "-keit" rather than the label "-heit, -keit". */
export function matchedEnding(r: GenderRule, word: string): string {
  const options = r.label.split(" (")[0].split(", ").map((x) => x.replace(/^-/, ""));
  const hit = options.find((o) => word.toLowerCase().endsWith(o));
  return `-${hit ?? options[0]}`;
}

function ruleReason(r: GenderRule, word: string): string {
  const art = ARTICLE[r.gender];
  switch (r.kind) {
    case "ending":
      return `${word} ends in ${matchedEnding(r, word)}, and nouns with that ending are ${r.reliability} ${art}.`;
    case "meaning":
      return `${word} is ${r.about}, and those are ${r.reliability} ${art}.`;
    default:
      return r.id === "infinitive"
        ? `${word} is a verb used as a noun, and those are always das.`
        : `${word} starts with Ge-, and those nouns are ${r.reliability} das.`;
  }
}

export interface GenderAnalysis {
  gender: Gender;
  guess: GenderGuess | null;
  /** true if the guess matches the real gender */
  follows: boolean;
  /** one or two sentences explaining this noun's gender */
  explanation: string;
}

/** Explain a known noun's gender: which pattern it follows, or that it's an exception. */
export function analyzeNoun(w: Pick<CourseWord, "de" | "en" | "gender">): GenderAnalysis | null {
  if (!w.gender) return null;
  const bare = w.de.replace(/^(der|die|das) /, "");
  if (w.gender === "pl") {
    return { gender: "pl", guess: null, follows: true, explanation: `${bare} is plural (or only used in the plural), and the plural article is always die.` };
  }
  const guess = guessGender(bare, w.en);
  const real = ARTICLE[w.gender];
  if (!guess) {
    return {
      gender: w.gender,
      guess,
      follows: false,
      explanation: `There's no reliable pattern for ${bare}, so it has to be memorized: ${real} ${bare} (${GENDER_NAME[w.gender]}).`,
    };
  }
  if (guess.gender === w.gender) return { gender: w.gender, guess, follows: true, explanation: guess.reason };
  const r = guess.rule;
  const group = !r ? `Compounds ending in ${guess.head}` : r.kind === "ending" ? `Words ending in ${matchedEnding(r, bare)}` : r.group ?? cap(r.label);
  return {
    gender: w.gender,
    guess,
    follows: false,
    explanation: `${bare} is an exception. ${group} are ${guess.reliability} ${ARTICLE[guess.gender]}, but this one is ${real} ${bare}. Worth memorizing.`,
  };
}

// ── the guide page ─────────────────────────────────────────────────────────

export interface GuideItem {
  de: string;
  en: string;
  note?: string;
  /** colors the bar; defaults to the article's gender */
  gender?: G3;
}

export interface GenderGuide {
  intro: string;
  basics: { article: string; label: string; examples: string; cls: "m" | "f" | "n" | "pl" }[];
  /** short points; **bold** is supported */
  bullets: string[];
  checkerPlaceholder: string;
  /** what the checker says when no pattern fits */
  noPattern: string;
  sections: { gender: G3; title: string; intro: string }[];
  extras: { title: string; intro: string; items: GuideItem[] }[];
  sameWordIntro: string;
  sameWord: [string, string, string, string][];
  footer: { href: string; label: string };
}

export const GUIDE: GenderGuide = {
  intro:
    "Every German noun is der, die or das. For a lot of nouns you just have to learn it, but the ending or meaning often gives it away. These are the patterns that actually work.",
  basics: [
    { article: "der", label: "masculine", examples: "der Tisch, der Mann", cls: "m" },
    { article: "die", label: "feminine", examples: "die Lampe, die Frau", cls: "f" },
    { article: "das", label: "neuter", examples: "das Buch, das Kind", cls: "n" },
    { article: "die", label: "every plural", examples: "die Tische, die Bücher", cls: "pl" },
  ],
  bullets: [
    "Gender belongs to the word, not the thing. A table isn't male, it's just **der Tisch**. And das Mädchen (the girl) is neuter because of its -chen ending.",
    "All plurals use **die**, whatever the gender. That's one less thing to learn.",
    "The article changes with its job in the sentence (der becomes den or dem), but you always start from the gender. Get that right and the rest follows.",
    "Learn every noun together with its article, as one unit: not \"Tisch\" but \"der Tisch\".",
  ],
  checkerPlaceholder: "e.g. Zeitung, Brötchen, Kühlschrank",
  noPattern:
    "No pattern fits this one, so there's no reliable way to guess. Look it up and learn it with its article. If you had to bet, der is the most common gender.",
  sections: [
    {
      gender: "f",
      title: "Signs it's die",
      intro: "Feminine has the most reliable endings. If a noun ends in -ung, -heit, -keit, -schaft or -tät, it's die, no exceptions.",
    },
    {
      gender: "n",
      title: "Signs it's das",
      intro: "Neuter is the smallest group. -chen and -lein are always das, and so is any verb turned into a noun.",
    },
    {
      gender: "m",
      title: "Signs it's der",
      intro: "Masculine is the most common gender. Days, months, seasons and male people are der, and -er, -el and -en lean der too.",
    },
  ],
  extras: [
    {
      title: "Compound nouns: the last part decides",
      intro: "German glues words together. The gender always comes from the last word, so once you know that one, you know them all.",
      items: [
        { de: "der Kühlschrank", en: "fridge", note: "kühl (cool) + der Schrank (cupboard)" },
        { de: "die Haustür", en: "front door", note: "das Haus (house) + die Tür (door)" },
        { de: "das Wohnzimmer", en: "living room", note: "wohnen (to live) + das Zimmer (room)" },
        { de: "der Bahnhof", en: "train station", note: "die Bahn (railway) + der Hof (yard)" },
        { de: "die Bushaltestelle", en: "bus stop", note: "der Bus + die Haltestelle (stop)" },
      ],
    },
  ],
  sameWordIntro: "A few nouns change meaning with their article. You won't need these soon, but they show why the article matters.",
  sameWord: [
    ["der See", "the lake", "die See", "the sea"],
    ["der Leiter", "the leader, manager", "die Leiter", "the ladder"],
    ["das Steuer", "the steering wheel", "die Steuer", "the tax"],
    ["der Teil", "the part", "das Teil", "the piece, the thing"],
  ],
  footer: { href: "/learn/articles", label: "Lesson 6: der, die, das" },
};
