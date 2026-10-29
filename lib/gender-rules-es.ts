import type { CourseWord } from "@/content/types";
import type { GenderAnalysis, GenderGuess, GenderGuide, GenderRule, G3 } from "./gender-rules-de";

/* How Spanish noun genders work: el or la, by ending and by meaning, plus exceptions. */

export const ARTICLE: Record<G3, string> = { m: "el", f: "la", n: "el" };
export const GENDER_NAME: Record<G3, string> = { m: "masculine", f: "feminine", n: "neuter" };

const ends = (...suffixes: string[]) => (w: string) => suffixes.some((s) => w.toLowerCase().endsWith(s) && w.length > s.length + 1);
const inList = (list: string[]) => (w: string) => list.includes(w.toLowerCase());
const enHas = (re: RegExp) => (_: string, en?: string) => Boolean(en && re.test(en));

const DAYS = ["lunes", "martes", "miércoles", "jueves", "viernes", "sábado", "domingo"];
const MONTHS = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];
const LANGUAGES = ["español", "inglés", "alemán", "francés", "italiano", "japonés", "chino", "portugués", "coreano"];
const COLORS = ["rojo", "azul", "verde", "amarillo", "negro", "blanco", "gris", "morado", "rosa", "naranja", "café"];
/** Greek words in -ma (and a few others) that are masculine even though they end in -a */
const GREEK_MA = ["problema", "sistema", "tema", "programa", "idioma", "clima", "drama", "poema", "diploma", "dilema", "esquema", "síntoma", "trauma", "aroma", "panorama", "cinema"];
/** verb + noun mashups, always el */
const VERB_NOUN = ["paraguas", "cumpleaños", "abrelatas", "lavaplatos", "sacapuntas", "rascacielos", "salvavidas", "parabrisas", "pasatiempo", "limpiaparabrisas", "abrebotellas", "portaaviones"];
/** -a words that are masculine */
const A_EXCEPTIONS = ["día", "mapa", "sofá", "planeta", "papá", "tranvía"];
/** -o words that are feminine (mostly shortened words) */
const O_EXCEPTIONS = ["mano", "foto", "moto", "radio", "disco"];

const MALE = /\b(man|men|father|dad|brother|son|boyfriend|husband|grandpa|grandfather|uncle|king|boy|male|\(man\)|\(male\))\b/i;
const FEMALE = /\b(woman|women|mother|mom|sister|daughter|girlfriend|wife|grandma|grandmother|aunt|queen|girl|female|\(woman\)|\(female\))\b/i;

/** Ordered from most to least reliable; the first rule that fits wins. */
export const RULES: GenderRule[] = [
  // ── people ──
  { id: "female-person", gender: "f", kind: "meaning", label: "women and girls", about: "a word for a woman or girl", group: "Words for women", reliability: "always", examples: ["la mujer", "la madre", "la hermana", "la niña"], note: "Words for people usually come in pairs: el hermano / la hermana, el profesor / la profesora.", test: enHas(FEMALE) },
  { id: "male-person", gender: "m", kind: "meaning", label: "men and boys", about: "a word for a man or boy", group: "Words for men", reliability: "always", examples: ["el hombre", "el padre", "el hermano", "el niño"], test: enHas(MALE) },

  // ── feminine endings ──
  { id: "ion", gender: "f", kind: "ending", label: "-ción, -sión, -ión", reliability: "almost always", examples: ["la canción", "la televisión", "la estación", "la región"], exceptions: ["el avión", "el camión"], note: "There are hundreds of these, and they're usually easy to guess from English: -tion becomes -ción (la nación, la información).", test: ends("ión") },
  { id: "dad", gender: "f", kind: "ending", label: "-dad, -tad", reliability: "always", examples: ["la ciudad", "la universidad", "la verdad", "la libertad"], note: "Like English -ty: city = ciudad, liberty = libertad.", test: ends("dad", "tad") },
  { id: "tud", gender: "f", kind: "ending", label: "-tud, -ud", reliability: "always", examples: ["la salud", "la actitud", "la juventud"], test: ends("tud", "ud") },
  { id: "umbre", gender: "f", kind: "ending", label: "-umbre", reliability: "always", examples: ["la costumbre", "la cumbre", "la legumbre"], test: ends("umbre") },
  { id: "sis", gender: "f", kind: "ending", label: "-sis, -itis", reliability: "usually", examples: ["la crisis", "la tesis", "la apendicitis"], exceptions: ["el análisis", "el énfasis"], test: ends("sis", "itis") },
  { id: "ie", gender: "f", kind: "ending", label: "-ie", reliability: "usually", examples: ["la serie", "la especie", "la superficie"], exceptions: ["el pie"], test: ends("ie") },

  // ── masculine by meaning ──
  { id: "days", gender: "m", kind: "meaning", label: "days and months", about: "a day or month", group: "Days and months", reliability: "always", examples: ["el lunes", "el sábado", "el enero pasado"], note: "With days, el means \"on\": el lunes = on Monday, los lunes = on Mondays.", test: inList([...DAYS, ...MONTHS]) },
  { id: "languages", gender: "m", kind: "meaning", label: "languages and colors", about: "a language or color used as a noun", group: "Languages and colors used as nouns", reliability: "always", examples: ["el español", "el inglés", "el rojo", "el azul"], test: inList([...LANGUAGES, ...COLORS]) },
  { id: "verb-noun", gender: "m", kind: "form", label: "verb + noun mashups", reliability: "always", examples: ["el paraguas", "el cumpleaños", "el abrelatas"], note: "Words made of a verb and a noun are always el: para (stops) + aguas (waters) = el paraguas, umbrella.", test: inList(VERB_NOUN) },
  { id: "greek-ma", gender: "m", kind: "form", label: "-ma words from Greek", reliability: "always", examples: ["el problema", "el sistema", "el tema", "el idioma", "el clima"], note: "These look feminine but are el. Most have an English twin ending in -m: problem, system, theme, program. Everyday -ma words like la cama (bed) and la mamá are still la.", test: inList(GREEK_MA) },
  { id: "aje", gender: "m", kind: "ending", label: "-aje", reliability: "always", examples: ["el viaje", "el mensaje", "el garaje", "el paisaje"], note: "Often the same as English -age: message = mensaje, garage = garaje.", test: ends("aje") },
  { id: "or", gender: "m", kind: "ending", label: "-or", reliability: "almost always", examples: ["el amor", "el color", "el calor", "el doctor"], exceptions: ["la flor", "la labor"], test: ends("or") },

  // ── the big two ──
  { id: "o", gender: "m", kind: "ending", label: "-o", reliability: "almost always", examples: ["el libro", "el perro", "el carro", "el vaso"], exceptions: ["la mano", "la foto (short for fotografía)", "la moto", "la radio"], note: "The most reliable everyday rule. The famous exception is la mano (hand). Foto and moto are short for longer feminine words.", test: ends("o") },
  { id: "a", gender: "f", kind: "ending", label: "-a", reliability: "almost always", examples: ["la casa", "la mesa", "la comida", "la ventana"], exceptions: ["el día", "el mapa", "el sofá", "el planeta", "the Greek -ma words"], note: "The famous exception is el día (day). Buenos días, not buenas días.", test: ends("a", "á") },

  // ── weaker hints ──
  { id: "l", gender: "m", kind: "ending", label: "-l", reliability: "usually", examples: ["el papel", "el hotel", "el árbol", "el sol"], exceptions: ["la sal", "la piel", "la miel", "la señal"], test: ends("l") },
  { id: "n", gender: "m", kind: "ending", label: "-n (not -ión)", reliability: "usually", examples: ["el pan", "el tren", "el jardín", "el corazón"], exceptions: ["la imagen", "la razón", "la sartén"], test: (w) => ends("n")(w) && !ends("ión")(w) },
  { id: "z", gender: "f", kind: "ending", label: "-z", reliability: "often", examples: ["la luz", "la voz", "la vez", "la paz", "la nariz"], exceptions: ["el lápiz", "el pez", "el arroz", "el maíz"], test: ends("z") },
];

/** Common exceptions, so the checker gets them right instead of following the rule. */
export const EXCEPTIONS: Record<string, G3> = {
  ...Object.fromEntries(A_EXCEPTIONS.map((w) => [w, "m" as G3])),
  ...Object.fromEntries(O_EXCEPTIONS.map((w) => [w, "f" as G3])),
  avión: "m",
  camión: "m",
  flor: "f",
  labor: "f",
  pie: "m",
  análisis: "m",
  sal: "f",
  piel: "f",
  miel: "f",
  imagen: "f",
  razón: "f",
  lápiz: "m",
  pez: "m",
  arroz: "m",
  maíz: "m",
};

const STRONG = ["female-person", "male-person", "days", "languages", "verb-noun", "greek-ma"];

/** Predict a noun's gender from its form and meaning, with the reason. */
export function guessGender(bare: string, en?: string): GenderGuess | null {
  const word = bare.trim().toLowerCase();
  if (!word) return null;
  const ordered = [...RULES.filter((r) => STRONG.includes(r.id)), ...RULES.filter((r) => !STRONG.includes(r.id))];
  for (const r of ordered) {
    if (r.test(word, en)) return { gender: r.gender, rule: r, reason: ruleReason(r, word), reliability: r.reliability };
  }
  return null;
}

/** The actual ending a word matched: "-tad" rather than the label "-dad, -tad". */
export function matchedEnding(r: GenderRule, word: string): string {
  const options = r.label.split(" (")[0].split(", ").map((x) => x.replace(/^-/, ""));
  const hit = options.find((o) => word.toLowerCase().endsWith(o.replace("á", "a")) || word.toLowerCase().endsWith(o));
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
      return r.id === "verb-noun"
        ? `${word} is made of a verb and a noun, and those are always el.`
        : `${word} is one of the -ma words that came from Greek, and those are el even though they end in -a.`;
  }
}

const cap = (s: string) => s[0].toUpperCase() + s.slice(1);

/** Explain a known noun's gender: which pattern it follows, or that it's an exception. */
export function analyzeNoun(w: Pick<CourseWord, "de" | "en" | "gender">): GenderAnalysis | null {
  if (!w.gender) return null;
  const m = /^(el|la|los|las) (.+)$/.exec(w.de);
  const article = m?.[1];
  const bare = m ? m[2] : w.de;
  if (w.gender === "pl") {
    return {
      gender: "pl",
      guess: null,
      follows: true,
      explanation: `${bare} is plural. Plurals use los for masculine words or mixed groups, and las when everything is feminine.`,
    };
  }
  // el agua: feminine, but el before a stressed a sound
  if (w.gender === "f" && article === "el") {
    return {
      gender: "f",
      guess: null,
      follows: false,
      explanation: `${bare} is feminine, but it starts with a stressed a sound, so the singular uses el to keep two a's from running together: el ${bare}. Describing words stay feminine (el agua fría), and the plural goes back to las.`,
    };
  }
  const real = ARTICLE[w.gender];
  // multi-word nouns (el fin de semana) take their gender from the first word
  if (bare.includes(" ")) {
    const head = bare.split(" ")[0];
    const g = guessGender(head);
    return {
      gender: w.gender,
      guess: g,
      follows: true,
      explanation:
        g && g.gender === w.gender
          ? `${bare} takes its gender from its first word, ${head}: ${real} ${head}, so ${real} ${bare}.`
          : `${bare} takes its gender from its first word: ${real} ${head}, so ${real} ${bare}.`,
    };
  }
  const guess = guessGender(bare, w.en);
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
  const group = !r ? "Words like this" : r.kind === "ending" ? `Words ending in ${matchedEnding(r, bare)}` : r.group ?? cap(r.label);
  return {
    gender: w.gender,
    guess,
    follows: false,
    explanation: `${bare} is an exception. ${group} are ${guess.reliability} ${ARTICLE[guess.gender]}, but this one is ${real} ${bare}. Worth memorizing.`,
  };
}

export const GUIDE: GenderGuide = {
  intro:
    "Every Spanish noun is masculine (el) or feminine (la). There's no neuter, and most of the time the ending tells you which: -o is el, -a is la. These are the patterns that work, and the exceptions worth knowing.",
  basics: [
    { article: "el", label: "masculine", examples: "el libro, el hombre", cls: "m" },
    { article: "la", label: "feminine", examples: "la casa, la mujer", cls: "f" },
    { article: "los", label: "masculine plural", examples: "los libros, los padres", cls: "pl" },
    { article: "las", label: "feminine plural", examples: "las casas, las mesas", cls: "pl" },
  ],
  bullets: [
    "Gender belongs to the word, not the thing. A table isn't female, it's just **la mesa**. A car is **el carro**.",
    "Most nouns ending in **-o** are el and most ending in **-a** are la. That one rule covers a huge share of everyday words.",
    "Describing words match the noun: el carro **blanco**, la casa **blanca**. So the gender shows up again and again, which is why it's worth getting right.",
    "A group of men, or of men and women together, is masculine: **los padres** means \"the parents\", **los niños** can mean \"the children\".",
    "Learn every noun together with its article: not \"mesa\" but \"la mesa\".",
  ],
  checkerPlaceholder: "e.g. canción, problema, ciudad",
  noPattern:
    "No pattern fits this one (words ending in -e or a consonant often don't), so there's no reliable way to guess. Look it up and learn it with its article. If you had to bet, el is a little more common.",
  sections: [
    {
      gender: "f",
      title: "Signs it's la",
      intro: "Besides -a, feminine has some rock-solid endings: -ción, -sión, -dad, -tad and -tud are la, almost without exception.",
    },
    {
      gender: "m",
      title: "Signs it's el",
      intro: "Besides -o, watch for -aje, -or and the -ma words from Greek. Days, months, languages and colors are always el.",
    },
  ],
  extras: [
    {
      title: "Feminine words that take el",
      intro:
        "When a feminine word starts with a stressed a sound, the singular uses el so the two a's don't run together. The word is still feminine: describing words stay feminine and the plural is las.",
      items: [
        { de: "el agua", en: "water", note: "el agua fría (cold water), las aguas", gender: "f" },
        { de: "el hambre", en: "hunger", note: "tengo mucha hambre (I'm very hungry)", gender: "f" },
        { de: "el águila", en: "eagle", note: "las águilas", gender: "f" },
        { de: "el alma", en: "soul", note: "las almas", gender: "f" },
      ],
    },
    {
      title: "People: often just the article changes",
      intro: "Words for people that end in -ista, -ante or -ente stay the same for men and women. Only the article changes.",
      items: [
        { de: "el / la estudiante", en: "student", gender: "m" },
        { de: "el / la turista", en: "tourist", gender: "m" },
        { de: "el / la artista", en: "artist", gender: "m" },
        { de: "el / la cantante", en: "singer", gender: "m" },
      ],
    },
  ],
  sameWordIntro: "A few nouns change meaning with their article. One of them comes up a lot in Mexico.",
  sameWord: [
    ["el papa", "the Pope", "la papa", "the potato (in Mexico and Latin America)"],
    ["el capital", "the money, capital", "la capital", "the capital city"],
    ["el orden", "the order, tidiness", "la orden", "the order, command"],
    ["el cura", "the priest", "la cura", "the cure"],
  ],
  footer: { href: "/learn/es-articles", label: "Lesson 6: el, la, los, las" },
};
