/*
 * Which language the site is teaching right now.
 *
 * The choice lives in localStorage and is read once when the page loads, so every
 * module (lessons, rules, explanations) can pick its language at load time.
 * Switching languages saves progress and reloads the page.
 * On the server it's always German, which is why the app waits until it's
 * mounted in the browser before showing anything (see AppShell).
 */

export type Lang = "de" | "es";
export const LANGS: Lang[] = ["de", "es"];
export const LANG_KEY = "course-lang";

function readLang(): Lang {
  if (typeof window === "undefined") return "de";
  try {
    return localStorage.getItem(LANG_KEY) === "es" ? "es" : "de";
  } catch {
    return "de";
  }
}

export const LANG: Lang = readLang();
export const IS_ES = LANG === "es";

export interface LangInfo {
  code: Lang;
  /** in English: "German" */
  name: string;
  /** in the language itself: "Deutsch" */
  native: string;
  /** letter on the logo */
  mark: string;
  /** speech synthesis and recognition */
  bcp: string;
  /** other voices that are fine to use */
  bcpAlt: string[];
  /** extra letters under text boxes */
  keys: string[];
  /** "Richtig!" etc. */
  praise: string[];
  almost: string;
  wrong: string;
  /** gender choices in der/die/das questions */
  genderOptions: string[];
  /** the gender question, "der, die or das?" */
  genderQuestion: string;
  /** noun articles, for splitting "der Hund" into article and noun */
  articleRe: RegExp;
  /** article for each gender */
  articleOf: Record<"m" | "f" | "n" | "pl", string>;
  /** lesson about articles, linked to the gender guide */
  articlesUnit: string;
  /** first lessons, for the starter writing questions */
  starterUnits: string[];
  /** placeholder examples */
  exampleNoun: string;
  exampleSentence: string;
  /** reply placeholder in the chat */
  replyHint: string;
  /** placeholder in writing boxes */
  writeHint: string;
  /** units for the AI level description */
  level: string;
}

export const LANG_INFO: Record<Lang, LangInfo> = {
  de: {
    code: "de",
    name: "German",
    native: "Deutsch",
    mark: "D",
    bcp: "de-DE",
    bcpAlt: ["de-AT", "de-CH"],
    keys: ["ä", "ö", "ü", "ß"],
    praise: ["Richtig!", "Genau!", "Super!", "Sehr gut!", "Prima!", "Toll!"],
    almost: "Fast! (Almost!)",
    wrong: "Nicht ganz. (Not quite.)",
    genderOptions: ["der", "die", "das"],
    genderQuestion: "der, die or das?",
    articleRe: /^(der|die|das) (.+)$/,
    articleOf: { m: "der", f: "die", n: "das", pl: "die" },
    articlesUnit: "articles",
    starterUnits: ["greetings", "intro", "numbers"],
    exampleNoun: "Hund",
    exampleSentence: "Ich habe einen Hund.",
    replyHint: "Antworte auf Deutsch... (Reply in German)",
    writeHint: "Schreib hier... (Write here)",
    level: "A1",
  },
  es: {
    code: "es",
    name: "Spanish",
    native: "Español",
    mark: "E",
    bcp: "es-MX",
    bcpAlt: ["es-US", "es-419", "es-ES"],
    keys: ["á", "é", "í", "ó", "ú", "ñ", "ü", "¿", "¡"],
    praise: ["¡Muy bien!", "¡Exacto!", "¡Perfecto!", "¡Eso es!", "¡Genial!", "¡Excelente!"],
    almost: "¡Casi! (Almost!)",
    wrong: "No exactamente. (Not quite.)",
    genderOptions: ["el", "la"],
    genderQuestion: "el or la?",
    articleRe: /^(el|la|los|las) (.+)$/,
    articleOf: { m: "el", f: "la", n: "el", pl: "los" },
    articlesUnit: "es-articles",
    starterUnits: ["es-greetings", "es-intro", "es-numbers"],
    exampleNoun: "perro",
    exampleSentence: "Tengo un perro.",
    replyHint: "Responde en español... (Reply in Spanish)",
    writeHint: "Escribe aquí... (Write here)",
    level: "A1",
  },
};

/** The active language. */
export const L: LangInfo = LANG_INFO[LANG];

/** Split "der Hund" / "el perro" into article and noun. */
export function splitArticle(de: string): { article: string; bare: string } | null {
  const m = L.articleRe.exec(de);
  return m ? { article: m[1], bare: m[2] } : null;
}

/** The noun without its article. */
export const bareNoun = (de: string) => splitArticle(de)?.bare ?? de;

/** Remember a language for the next page load. */
export function rememberLang(l: Lang) {
  try {
    localStorage.setItem(LANG_KEY, l);
  } catch {
    /* blocked storage: stays on the default */
  }
}
