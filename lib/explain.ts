import { ALL_WORDS, getUnit } from "@/content/course";
import type { CourseWord } from "@/content/types";
import { VERBS, PERSONS, regularForms, type Verb } from "@/content/verbs";
import { WHY } from "@/content/why";
import type { Exercise } from "./exercises";
import { englishVariants, lev, norm, tokens } from "./answers";
import { analyzeNoun, ARTICLE } from "./gender-rules";
import { lookupWord } from "./lexicon";
import { IS_ES, L } from "./lang";

/*
 * Explains why an answer was wrong, without any AI:
 * a written reason for every lesson question, plus rules that look at what you
 * actually answered (wrong gender, a missing umlaut, the du form instead of the
 * er form, a word that means something else, the verb in the wrong place...).
 */

export interface Explanation {
  /** short paragraphs, most important first */
  points: string[];
  /** letter-by-letter comparison for near misses */
  letters?: { given: string; answer: string };
  /** word-by-word comparison for sentences */
  words?: { given: string; answer: string };
  /** full conjugation table for verb mistakes */
  table?: { title: string; rows: [string, string][]; highlight: number };
  link?: { href: string; label: string };
}

// ── what small words do ────────────────────────────────────────────────────

const DE_ROLE: Record<string, string> = {
  der: "der is \"the\" for a masculine noun as the subject, or for a feminine noun after mit, bei, von, zu (dative)",
  die: "die is \"the\" for feminine nouns and for all plurals",
  das: "das is \"the\" for neuter nouns",
  den: "den is \"the\" for a masculine noun as the object (Ich sehe den Hund), or for plurals after mit, von, zu",
  dem: "dem is \"the\" for masculine and neuter nouns after mit, bei, von, zu, or when saying where something is",
  des: "des means \"of the\"",
  ein: "ein is \"a\" for masculine nouns as the subject, and for neuter nouns",
  eine: "eine is \"a\" for feminine nouns",
  einen: "einen is \"a\" for a masculine noun as the object (Ich habe einen Hund)",
  einem: "einem is \"a\" for masculine or neuter nouns after mit, bei, von, zu",
  einer: "einer is \"a\" for feminine nouns after mit, bei, von, zu",
  kein: "kein (\"no, not a\") is for masculine nouns as the subject, and neuter nouns",
  keine: "keine (\"no, not a\") is for feminine nouns and plurals",
  keinen: "keinen (\"no, not a\") is for a masculine noun as the object",
  mein: "mein (\"my\") is for masculine nouns as the subject, and neuter nouns",
  meine: "meine (\"my\") is for feminine nouns and plurals",
  meinen: "meinen (\"my\") is for a masculine noun as the object",
  nicht: "nicht negates verbs, describing words and whole sentences, but not nouns (those take kein)",
  nichts: "nichts means \"nothing\"",
  im: "im is in + dem: \"in the\" for masculine or neuter places, and for months and seasons (im Mai)",
  am: "am is an + dem: used for days (am Montag) and \"on the\"",
  um: "um is used for clock times (um acht Uhr)",
  an: "an means \"at\" or \"on\" (a wall)",
  auf: "auf means \"on top of\"",
  unter: "unter means \"under\"",
  neben: "neben means \"next to\"",
  hinter: "hinter means \"behind\"",
  in: "in means \"in\"",
  zum: "zum is zu + dem: \"to the\" for masculine and neuter nouns",
  zur: "zur is zu + der: \"to the\" for feminine nouns",
  zu: "zu means \"to\" (and zu Hause means at home)",
  nach: "nach means \"to\" for cities and countries (and nach Hause means going home)",
  bei: "bei means \"at someone's place\"",
  aus: "aus means \"from\" or \"out of\"",
  von: "von means \"from\" or \"of\"",
  mit: "mit means \"with\" or \"by\" (bus, train)",
  seit: "seit means \"since\" or \"for\" a time that's still going on",
  für: "für means \"for\"",
  vor: "vor means \"before\", \"ago\" or \"in front of\"",
  ich: "ich means \"I\" (the subject)",
  mich: "mich means \"me\" as the object (Er sieht mich)",
  mir: "mir means \"(to) me\", used after helfen, gefallen, mit, and so on (dative)",
  du: "du means \"you\" (the subject)",
  dich: "dich means \"you\" as the object (Ich liebe dich)",
  dir: "dir means \"(to) you\", used after helfen, gefallen, mit, and so on (dative)",
  er: "er means \"he\" (the subject)",
  ihn: "ihn means \"him\" as the object (Ich sehe ihn)",
  ihm: "ihm means \"(to) him\" (dative)",
  wir: "wir means \"we\"",
  uns: "uns means \"us\" or \"to us\"",
  euch: "euch means \"you all\" as the object",
  wo: "wo means \"where\" (where something is)",
  woher: "woher means \"where from\"",
  wohin: "wohin means \"where to\"",
  wer: "wer means \"who\" (it's a false friend: not \"where\")",
  was: "was means \"what\"",
  wie: "wie means \"how\"",
  wann: "wann means \"when\"",
  warum: "warum means \"why\"",
  "wie viel": "wie viel means \"how much\"",
  weil: "weil means \"because\" and sends the verb to the end",
  dass: "dass means \"that\" and sends the verb to the end",
  wenn: "wenn means \"if\" or \"when\" and sends the verb to the end",
  denn: "denn means \"because\" but keeps normal word order (verb second)",
  doch: "doch means \"yes\" in answer to a negative question",
  ja: "ja means \"yes\"",
  nein: "nein means \"no\"",
  gern: "gern after a verb means you like doing it",
  gerne: "gerne after a verb means you like doing it",
  lieber: "lieber means \"rather\" (gern → lieber → am liebsten)",
  besser: "besser means \"better\" (gut → besser → am besten)",
};

const ES_ROLE: Record<string, string> = {
  el: "el is \"the\" for masculine nouns",
  la: "la is \"the\" for feminine nouns (and also means \"her\" or \"it\" as an object)",
  los: "los is \"the\" for masculine plurals and mixed groups (and also means \"them\")",
  las: "las is \"the\" for feminine plurals (and also means \"them\" for all-feminine groups)",
  un: "un is \"a\" for masculine nouns",
  una: "una is \"a\" for feminine nouns",
  unos: "unos means \"some\" for masculine plurals",
  unas: "unas means \"some\" for feminine plurals",
  al: "al is a + el: \"to the\" for masculine places (voy al mercado)",
  del: "del is de + el: \"of the\" or \"from the\" for masculine nouns",
  a: "a means \"to\" or \"at\" (and comes before people as objects: veo a María)",
  de: "de means \"of\" or \"from\"",
  en: "en means \"in\", \"on\" or \"at\"",
  con: "con means \"with\"",
  por: "por means \"for\", \"through\" or \"by\" (and por la mañana = in the morning)",
  para: "para means \"for\" or \"in order to\"",
  mi: "mi means \"my\" with one thing",
  mis: "mis means \"my\" with more than one thing",
  tu: "tu (no accent) means \"your\"; tú with an accent means \"you\"",
  tú: "tú (with an accent) means \"you\"; tu without it means \"your\"",
  su: "su means \"his\", \"her\", \"their\" or \"your\" (formal), with one thing",
  sus: "sus is su with more than one thing",
  yo: "yo means \"I\"",
  me: "me means \"me\" or \"to me\", and goes right before the verb",
  te: "te means \"you\" or \"to you\" (informal), and goes right before the verb",
  lo: "lo means \"him\" or \"it\" (masculine) as the object",
  le: "le means \"to him\", \"to her\" or \"to you\" (formal), used with gustar, dar, decir...",
  les: "les means \"to them\" or \"to you all\"",
  nos: "nos means \"us\" or \"to us\"",
  no: "no goes right before the verb to make it negative",
  nada: "nada means \"nothing\" (and still needs no before the verb: no tengo nada)",
  nunca: "nunca means \"never\"",
  nadie: "nadie means \"nobody\"",
  también: "también means \"also, too\" for positive sentences",
  tampoco: "tampoco means \"neither, not either\" for negative sentences",
  qué: "qué means \"what\"",
  quién: "quién means \"who\"",
  dónde: "dónde means \"where\"",
  adónde: "adónde means \"where to\"",
  cuándo: "cuándo means \"when\"",
  cómo: "cómo means \"how\"",
  "por qué": "por qué (two words, accent) means \"why\"; porque (one word) means \"because\"",
  porque: "porque (one word) means \"because\"; por qué means \"why\"",
  cuánto: "cuánto means \"how much\"",
  cuántos: "cuántos means \"how many\" (masculine)",
  cuántas: "cuántas means \"how many\" (feminine)",
  cuál: "cuál means \"which\" or \"what\" when choosing",
  pero: "pero means \"but\"",
  y: "y means \"and\"",
  o: "o means \"or\"",
  que: "que (no accent) means \"that\" or \"than\"",
  si: "si (no accent) means \"if\"; sí means \"yes\"",
  sí: "sí (with an accent) means \"yes\"; si means \"if\"",
  cuando: "cuando (no accent) means \"when\" in the middle of a sentence",
  muy: "muy means \"very\"",
  mucho: "mucho means \"a lot\" or \"much\" (and changes to match: mucha, muchos)",
  más: "más means \"more\" (más ... que = more ... than)",
  menos: "menos means \"less\" (and in clock times, \"to\": las tres menos cuarto)",
  mejor: "mejor means \"better\" or \"best\"",
  peor: "peor means \"worse\" or \"worst\"",
  hay: "hay means \"there is\" or \"there are\"",
  gusta: "gusta is used when one thing is liked (me gusta el café)",
  gustan: "gustan is used when more than one thing is liked (me gustan los perros)",
};

const ROLE: Record<string, string> = IS_ES ? ES_ROLE : DE_ROLE;

const VERB_FORM_INDEX = new Map<string, { verb: Verb; persons: number[] }[]>();
for (const v of VERBS) {
  v.forms.forEach((f, i) => {
    const key = f.toLowerCase();
    const list = VERB_FORM_INDEX.get(key) ?? [];
    const hit = list.find((x) => x.verb === v);
    if (hit) hit.persons.push(i);
    else list.push({ verb: v, persons: [i] });
    VERB_FORM_INDEX.set(key, list);
  });
}

/** Add a full stop unless the text already ends a sentence. */
const end = (s: string) => (/[.!?]$/.test(s.trim()) ? s.trim() : `${s.trim()}.`);

/** "to be (who or what)" → "to be", so it reads well inside parentheses */
const verbEn = (v: Verb) => v.en.replace(/\s*\([^)]*\)/g, "");

const personName = (i: number) => PERSONS[i];
const personsText = (ps: number[]) => ps.map(personName).join(" and ");

/** A sentence about what a word the learner chose actually is. */
export function describeWord(given: string): string | null {
  const g = given.trim();
  if (!g) return null;
  const low = g.toLowerCase();
  if (ROLE[low]) return ROLE[low];
  const forms = VERB_FORM_INDEX.get(low);
  if (forms?.length) {
    const f = forms[0];
    if (g.toLowerCase() === f.verb.inf)
      return IS_ES
        ? `${g} is the infinitive (the dictionary form) of ${f.verb.inf} (${verbEn(f.verb)}). After a person it needs an ending`
        : `${g} is the infinitive (the dictionary form), which is also the wir and sie/Sie form of ${f.verb.inf} (${verbEn(f.verb)})`;
    return `${g} is the ${personsText(f.persons)} form of ${f.verb.inf} (${verbEn(f.verb)})`;
  }
  const hit = lookupWord(g);
  if (hit) return `${g} means \"${hit.meaning}\"`;
  return null;
}

// ── spelling ───────────────────────────────────────────────────────────────

/** letters only, no umlauts or accents */
const plain = (s: string) =>
  s
    .toLowerCase()
    .replace(/ß/g, "ss")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z ]/g, "")
    .replace(/\s+/g, " ")
    .trim();
const low = (s: string) => s.toLowerCase().replace(/[.,!?"„“¿¡]/g, "").replace(/\s+/g, " ").trim();

const ES_SOUND_SWAPS: [string, string, string][] = [
  ["b", "v", "b and v sound exactly the same in Spanish, so the spelling just has to be learned (vaso, vivir)"],
  ["v", "b", "b and v sound exactly the same in Spanish, so the spelling just has to be learned (bueno, beber)"],
  ["y", "ll", "ll and y sound the same in Mexico, so the spelling just has to be learned (llamar, calle)"],
  ["ll", "y", "ll and y sound the same in Mexico, so the spelling just has to be learned (yo, playa)"],
  ["s", "z", "in Latin America z sounds like s, so the spelling just has to be learned (zapato, azul)"],
  ["s", "c", "in Latin America c before e or i sounds like s (cena, cinco)"],
  ["z", "s", "z and s sound the same in Latin America; this one is spelled with s"],
  ["c", "s", "c before e or i and s sound the same in Latin America; this one is spelled with s"],
  ["k", "qu", "the k sound before e or i is spelled qu, and the u is silent (queso, quiero)"],
  ["k", "c", "the k sound before a, o or u is spelled c (casa, comer)"],
  ["ny", "ñ", "the \"ny\" sound is spelled ñ (año, mañana)"],
  ["nn", "ñ", "the \"ny\" sound is spelled ñ (año, mañana)"],
  ["h", "j", "the breathy h sound is spelled j (or g before e and i): jugar, gente"],
  ["j", "g", "j and g before e or i make the same sound, so the spelling just has to be learned (gente, general)"],
  ["g", "j", "j and g before e or i make the same sound, so the spelling just has to be learned (jefe, jugo)"],
  ["w", "gu", "the w sound is spelled gu or hu (agua, huevo)"],
  ["r", "rr", "between vowels a rolled r is written rr (perro); a single r is a quick tap (pero)"],
  ["rr", "r", "a single r between vowels is a quick tap (pero); rr is the long rolled r (perro)"],
];

const DE_SOUND_SWAPS: [string, string, string][] = [
  ["ei", "ie", "ei sounds like \"eye\" and ie sounds like \"ee\": write the second letter you hear (Wein = vine, Liebe = lee-buh)"],
  ["ie", "ei", "ie sounds like \"ee\" and ei sounds like \"eye\": write the second letter you hear (Liebe = lee-buh, Wein = vine)"],
  ["v", "w", "German w is said like an English v, so the v sound is usually spelled w"],
  ["f", "v", "German v is usually said like f (Vogel), so some f sounds are spelled v"],
  ["ts", "z", "German z is said ts, so the ts sound is spelled z"],
  ["sh", "sch", "the sh sound is spelled sch in German"],
  ["ai", "ei", "the \"eye\" sound is spelled ei"],
  ["oi", "eu", "the \"oy\" sound is spelled eu (or äu)"],
  ["k", "ck", "after a short vowel, k is doubled as ck"],
  ["z", "tz", "after a short vowel, z becomes tz"],
];

const SOUND_SWAPS = IS_ES ? ES_SOUND_SWAPS : DE_SOUND_SWAPS;

/** Explain a misspelling of `answer` as `given`. Empty if it isn't a near miss. */
export function spellingHints(given: string, answer: string): string[] {
  const g = low(given);
  const a = low(answer);
  if (!g || g === a) return [];
  const hints: string[] = [];
  if (IS_ES && plain(g) === plain(a)) {
    const marks = [...new Set([...a].filter((c) => "áéíóúñü".includes(c)))];
    hints.push(
      marks.length
        ? marks.length === 1 && marks[0] === "ñ"
          ? `Watch the ñ: it's ${answer}. ñ is its own letter, said \"ny\", so n and ñ make different words (ano and año). There's a button for it under each text box.`
          : `Watch the accent: it's ${answer}, with ${marks.join(", ")}. Accents show which syllable is stressed, and sometimes change the meaning (esta = this, está = is; si = if, sí = yes). There are buttons for them under each text box.`
        : `Check the accents: ${answer} doesn't have any.`
    );
    return hints;
  }
  if (plain(g) === plain(a)) {
    const um = [...a].filter((c) => "äöüß".includes(c));
    const which = [...new Set(um)].join(", ");
    hints.push(
      um.length
        ? `Watch the ${um.some((c) => c !== "ß") ? "umlaut" : "ß"}: it's ${answer}, with ${which}. Umlauts change the sound, and sometimes the meaning (schon = already, schön = nice). If you can't type them, ae, oe, ue and ss count.`
        : `Check the umlauts: ${answer} has none.`
    );
    return hints;
  }
  for (const [from, to, why] of SOUND_SWAPS) {
    if (g.includes(from) && (g.replace(from, to) === a || g.split(from).join(to) === a)) {
      hints.push(`Spelling: ${why}.`);
      return hints;
    }
  }
  if (IS_ES && [...g, ""].some((_, i) => g.slice(0, i) + "h" + g.slice(i) === a)) {
    hints.push(`There's a silent h in ${answer}. Spanish h is never pronounced, so it's easy to leave out (hola, hablar, ahora).`);
    return hints;
  }
  const vowelH = !IS_ES && [...g].some((_, i) => /[aeiouäöü]/.test(g[i - 1] ?? "") && g.slice(0, i) + "h" + g.slice(i) === a);
  if (vowelH) {
    hints.push(`There's a silent h in ${answer}. An h after a vowel isn't pronounced, it just makes the vowel long (wohnen, Uhr, sehr).`);
    return hints;
  }
  const undouble = (s: string) => s.replace(/(.)\1/g, "$1");
  if (undouble(plain(g)) === undouble(plain(a))) {
    hints.push(
      IS_ES
        ? `Close: watch the double letters in ${answer}. Spanish only doubles a few letters: rr, ll, cc and nn.`
        : `Close: watch the double letters in ${answer}. A double consonant after a vowel makes that vowel short.`
    );
    return hints;
  }
  if (a.length >= 4 && lev(plain(g), plain(a)) <= 2) hints.push(`Close, just a spelling slip. Compare the letters below.`);
  return hints;
}

// ── sentence and word comparison ───────────────────────────────────────────

export type DiffOp = { op: "same" | "add" | "del"; text: string };

/** Longest-common-subsequence diff of two token lists. "del" = in yours only, "add" = missing from yours. */
export function diffTokens(given: string[], answer: string[], eq: (a: string, b: string) => boolean = (x, y) => x === y): DiffOp[] {
  const n = given.length;
  const m = answer.length;
  const dp: number[][] = Array.from({ length: n + 1 }, () => Array(m + 1).fill(0));
  for (let i = n - 1; i >= 0; i--)
    for (let j = m - 1; j >= 0; j--) dp[i][j] = eq(given[i], answer[j]) ? dp[i + 1][j + 1] + 1 : Math.max(dp[i + 1][j], dp[i][j + 1]);
  const out: DiffOp[] = [];
  let i = 0;
  let j = 0;
  while (i < n && j < m) {
    if (eq(given[i], answer[j])) {
      out.push({ op: "same", text: answer[j] });
      i++;
      j++;
    } else if (dp[i + 1][j] >= dp[i][j + 1]) out.push({ op: "del", text: given[i++] });
    else out.push({ op: "add", text: answer[j++] });
  }
  while (i < n) out.push({ op: "del", text: given[i++] });
  while (j < m) out.push({ op: "add", text: answer[j++] });
  return out;
}

const wordEq = (a: string, b: string) => norm(a) === norm(b);

// ── per-exercise explanations ──────────────────────────────────────────────

const ARTICLE_MEANS: Record<string, string> = IS_ES
  ? { el: "masculine", la: "feminine", los: "masculine plural", las: "feminine plural" }
  : { der: "masculine", die: "feminine (or plural)", das: "neuter" };

const findByEn = (en: string): CourseWord | undefined => ALL_WORDS.find((w) => w.en === en);
const findByDe = (de: string): CourseWord | undefined => ALL_WORDS.find((w) => w.de === de);

function exampleLine(w: CourseWord): string | null {
  return w.ex ? `Example: ${w.ex[0]} (${w.ex[1]})` : null;
}

function genderPoint(w: CourseWord): string | null {
  const a = analyzeNoun(w);
  return a ? a.explanation : null;
}

function unitLink(unitId?: string) {
  const u = unitId ? getUnit(unitId) : undefined;
  return u ? { href: `/learn/${u.id}`, label: `Lesson ${u.n} notes: ${u.title}` } : undefined;
}

/** The written reason for a lesson question, if it has one. */
export function lessonWhy(ex: Exercise): string | undefined {
  switch (ex.kind) {
    case "fill":
    case "fillType":
    case "build":
      return ex.why ?? WHY[ex.de];
    case "choice":
      return WHY[ex.q] ?? ex.explain;
    default:
      return undefined;
  }
}

function conjExplanation(ex: Extract<Exercise, { kind: "conj" }>, given: string): Explanation {
  const { verb, person } = ex;
  const right = verb.forms[person];
  const g = given
    .trim()
    .toLowerCase()
    .replace(IS_ES ? /^(yo|tú|tu|él|el|ella|usted|nosotros|nosotras|vosotros|ellos|ellas|ustedes)\s+/ : /^(ich|du|er|sie|es|wir|ihr|sie|man)\s+/, "");
  const points: string[] = [];
  const persons = verb.forms.map((f, i) => (f.toLowerCase() === g ? i : -1)).filter((i) => i >= 0);
  if (g && g === verb.inf.toLowerCase() && !persons.includes(person)) {
    points.push(`${given.trim()} is the infinitive, the form you'd find in a dictionary. With ${PERSONS[person]} it needs its own ending: ${right}.`);
  } else if (persons.length) {
    points.push(`${given.trim()} is the ${personsText(persons)} form. For ${PERSONS[person]}, it's ${right}.`);
  } else if (g && g === regularForms(verb.inf)[person].toLowerCase() && g !== right.toLowerCase()) {
    points.push(`${given.trim()} is what a regular verb would do, but ${verb.inf} doesn't follow the regular pattern here. For ${PERSONS[person]}, it's ${right}.`);
  } else if (g) {
    const hints = spellingHints(g, right);
    if (hints.length) points.push(...hints);
    else {
      const other = VERB_FORM_INDEX.get(g)?.find((x) => x.verb !== verb);
      points.push(
        other
          ? `${given.trim()} ${g === other.verb.inf ? "is" : `comes from`} a different verb, ${other.verb.inf} (${verbEn(other.verb)}). This one is ${verb.inf} (${verbEn(verb)}), and for ${PERSONS[person]} it's ${right}.`
          : `${given.trim()} isn't a form of ${verb.inf}. For ${PERSONS[person]}, it's ${right}.`
      );
    }
  }
  if (IS_ES) points.push(esVerbPattern(verb, person));
  else {
    const regular = regularForms(verb.inf);
    const irregular = regular[person] !== right;
    const modal = ["können", "müssen", "wollen", "dürfen", "sollen", "mögen", "möchten"].includes(verb.inf);
    if (verb.inf === "sein" || verb.inf === "haben" || verb.inf === "wissen") {
      points.push(`${verb.inf} is irregular, so its forms have to be learned as a set.`);
    } else if (modal) {
      points.push(`${verb.inf} is a modal verb: ich and er/sie/es have the same form with no ending (ich ${verb.forms[0]}, er ${verb.forms[2]}), and the singular often changes its vowel.`);
    } else if (irregular && (person === 1 || person === 2)) {
      points.push(`${verb.inf} changes its vowel, but only for du and er/sie/es: du ${verb.forms[1]}, er ${verb.forms[2]}. All the other forms are regular.`);
    } else {
      const endings = ["\u2011e", "\u2011st", "\u2011t", "\u2011en", "\u2011t", "\u2011en"];
      points.push(`Regular pattern: take ${verb.inf}, drop the \u2011en, and add the ${PERSONS[person]} ending, ${endings[person]}.${/[td]en$/.test(verb.inf) && (person === 1 || person === 2 || person === 4) ? " The stem ends in t or d, so an extra e is added to make it sayable." : ""}`);
    }
  }
  return {
    points,
    letters: g && !persons.length && (spellingHints(g, right).length || lev(plain(g), plain(right)) <= 2) ? { given: g, answer: right } : undefined,
    table: { title: verb.inf, rows: verb.forms.map((f, i) => [IS_ES && i === 4 ? `${PERSONS[i]} (Spain only)` : PERSONS[i], f]), highlight: person },
  };
}

/** What kind of Spanish verb this is, and how this person's form is made. */
function esVerbPattern(verb: Verb, person: number): string {
  const right = verb.forms[person];
  const regular = regularForms(verb.inf);
  // vosotros (Spain only) is left out of the comparison
  const diffs = verb.forms.map((f, i) => (f !== regular[i] && i !== 4 ? i : -1)).filter((i) => i >= 0);
  const ending = verb.inf.slice(-2);
  const ENDINGS: Record<string, string[]> = {
    ar: ["o", "as", "a", "amos", "áis", "an"],
    er: ["o", "es", "e", "emos", "éis", "en"],
    ir: ["o", "es", "e", "imos", "ís", "en"],
  };
  const endingOf = (i: number) => `\u2011${(ENDINGS[ending] ?? ENDINGS.ar)[i]}`;
  if (["ser", "estar", "ir", "haber"].includes(verb.inf)) {
    return `${verb.inf} is irregular, so its forms have to be learned as a set.${verb.inf === "estar" ? " Notice the accents: estás, está, están." : ""}`;
  }
  if (!diffs.length) {
    return `Regular pattern: take ${verb.inf}, drop the \u2011${ending}, and add the ${PERSONS[person].split(" / ")[0]} ending, ${endingOf(person)}.`;
  }
  const boot = [1, 2, 5].every((i) => diffs.includes(i)) && !diffs.includes(3);
  if (boot) {
    // which vowel change: e → ie, o → ue, u → ue (jugar) or e → i
    const plainStem = regular[1].slice(0, -2);
    const bootStem = verb.forms[1].slice(0, -2);
    const [from, to] =
      bootStem.includes("ie") && !plainStem.includes("ie")
        ? ["e", "ie"]
        : bootStem.includes("ue") && !plainStem.includes("ue")
          ? [plainStem.includes("o") ? "o" : "u", "ue"]
          : ["e", "i"];
    const yoExtra = verb.forms[0] !== `${bootStem}o`;
    return `${verb.inf} is a stem-changing verb: ${from} becomes ${to} in every form except nosotros (and vosotros). Think of it as a boot: yo, tú, él and ellos are inside it, nosotros is outside. ${verb.forms[1]}, ${verb.forms[2]}, but ${verb.forms[3]}.${
      yoExtra ? ` On top of that, the yo form is irregular: ${verb.forms[0]}.` : ""
    } The endings are the regular ${ending} ones.`;
  }
  if (diffs.length === 1 && diffs[0] === 0) {
    return `${verb.inf} is regular except for yo: ${verb.forms[0]}. Every other form follows the normal pattern${person !== 0 ? `, so for ${PERSONS[person].split(" / ")[0]} it's ${right}` : ""}.`;
  }
  return `${verb.inf} is irregular, so its forms have to be learned as a set.`;
}

const ES_OBJ = /^(me|te|lo|la|le|nos|los|las|les|se)$/i;

/** Spanish word-order rules that a wrongly ordered sentence breaks. */
function esOrderHints(target: string[], mine: string[]): string[] {
  const t = target.map((x) => x.toLowerCase());
  const m = mine.map((x) => x.toLowerCase());
  const pos = (arr: string[], w: string) => arr.indexOf(w);
  const isVerb = (w: string) => VERB_FORM_INDEX.has(w);
  const hints: string[] = [];
  // no right before the verb (and its pronouns)
  const ni = pos(t, "no");
  if (ni >= 0 && ni + 1 < t.length && m[pos(m, "no") + 1] !== t[ni + 1]) {
    hints.push(`no goes right in front of the verb, and in front of little words like me, te or lo: ${target.slice(ni, ni + 3).join(" ")}${ni + 3 < target.length ? "..." : "."}`);
  }
  // object pronoun right before the conjugated verb
  const oi = t.findIndex((w, i) => ES_OBJ.test(w) && isVerb(t[i + 1] ?? ""));
  if (!hints.length && oi >= 0) {
    const mi = pos(m, t[oi]);
    if (mi < 0 || m[mi + 1] !== t[oi + 1]) {
      hints.push(`Words like me, te, lo, la and le go right before the conjugated verb, not after it: ${target[oi]} ${target[oi + 1]}.`);
    }
  }
  // describing word after the noun
  if (!hints.length) {
    for (let i = 0; i + 1 < t.length; i++) {
      const a = t[i];
      const b = t[i + 1];
      const mi = pos(m, b);
      if (mi >= 0 && m[mi + 1] === a && !isVerb(a) && !isVerb(b) && !ES_ROLE[a] && !ES_ROLE[b]) {
        hints.push(`Describing words usually come after the noun in Spanish: ${target[i]} ${target[i + 1]}, the opposite of English.`);
        break;
      }
    }
  }
  return hints;
}

function buildExplanation(ex: Extract<Exercise, { kind: "build" }>, given: string): Explanation {
  const points: string[] = [];
  const target = tokens(ex.de);
  const mine = tokens(given);
  if (target.join(" ").toLowerCase() === mine.join(" ").toLowerCase()) {
    const why = lessonWhy(ex);
    return { points: why ? [why] : [], link: unitLink(ex.unitId) };
  }
  const extra = mine.filter((t) => !target.some((x) => x.toLowerCase() === t.toLowerCase()));
  const missing = target.filter((t) => !mine.some((x) => x.toLowerCase() === t.toLowerCase()));
  if (extra.length) {
    points.push(`${extra.map((e) => `"${e}"`).join(", ")} ${extra.length === 1 ? "isn't" : "aren't"} part of this sentence.${extra.length === 1 && describeWord(extra[0]) ? ` (${describeWord(extra[0])}.)` : ""}`);
  }
  if (missing.length && !extra.length) points.push(`You left out ${missing.map((m) => `"${m}"`).join(", ")}.`);

  if (!extra.length && !missing.length && IS_ES) {
    points.push(...esOrderHints(target, mine));
    if (!points.length) points.push("All the right words, just in a different order. Compare the two below.");
  } else if (!extra.length && !missing.length) {
    // right words, wrong order: find the verb and check its place
    const isVerb = (t: string) => VERB_FORM_INDEX.has(t.toLowerCase());
    const vt = target.findIndex(isVerb);
    const vm = vt >= 0 ? mine.findIndex((t) => t.toLowerCase() === target[vt].toLowerCase()) : -1;
    const sub = target.findIndex((t) => /^(weil|dass|wenn)$/i.test(t));
    if (vt >= 0 && vm !== vt) {
      if (vt === 0) points.push(`In a yes/no question or an instruction, the verb (${target[vt]}) comes first.`);
      else if (vt === 1) points.push(`In a German statement the verb (${target[vt]}) always takes second place, even when something other than the subject comes first.`);
      else if (sub >= 0) points.push(`After weil, dass or wenn, the verb goes to the end of that part of the sentence.`);
    }
    const lastT = target[target.length - 1];
    const lastM = mine[mine.length - 1];
    if (lastT && lastT !== lastM && !points.length) {
      const d = describeWord(lastT);
      if (/^ge\w+(t|en)$/i.test(lastT)) points.push(`The past participle (${lastT}) goes at the very end.`);
      else if (/^(an|auf|aus|ein|mit|fern|ab|zu)$/i.test(lastT)) points.push(`${lastT} is the prefix of a separable verb, and it goes at the very end.`);
      else if (/en$/.test(lastT) && VERBS.some((v) => v.inf === lastT.toLowerCase())) points.push(`With can, must, want and similar verbs, the second verb (${lastT}) goes at the very end.`);
      else if (lastT.toLowerCase() === "nicht") points.push(`nicht goes at the end when it negates the whole sentence.`);
      else if (d) points.push(`The sentence ends with ${lastT}.`);
    }
    if (!points.length) points.push("All the right words, just in a different order. Compare the two below.");
  }
  const why = lessonWhy(ex);
  if (why) points.unshift(why);
  return { points, words: { given, answer: ex.de }, link: unitLink(ex.unitId) };
}

/**
 * Explain an answer. `given` is what the learner picked or typed.
 * Returns null when there's nothing useful to add.
 */
export function explain(ex: Exercise, given: string | undefined): Explanation | null {
  const g = (given ?? "").trim();
  switch (ex.kind) {
    case "mc": {
      const w = ex.word;
      const points: string[] = [];
      if (g && g !== ex.answer) {
        const other = ex.dir === "de-en" ? findByEn(g) : findByDe(g);
        if (other) {
          points.push(
            ex.dir === "de-en" ? `You picked "${g}", which is ${other.de} in ${L.name}.` : `You picked ${g}, which means "${other.en}".`
          );
        }
      }
      points.push(`${w.de} means "${w.en}".`);
      if (w.note) points.push(w.note);
      const exl = exampleLine(w);
      if (exl) points.push(exl);
      return { points };
    }

    case "listen": {
      const w = ex.word;
      const points: string[] = [];
      const other = g ? findByDe(g) : undefined;
      if (g && g !== w.de) points.push(`You picked ${g}${other ? ` (${other.en})` : ""}, but the word was ${w.de} (${w.en}).`);
      points.push(...soundTips(w.de, g));
      if (w.note) points.push(w.note);
      return { points };
    }

    case "type": {
      const w = ex.word;
      const points: string[] = [];
      let letters: Explanation["letters"];
      const m = L.articleRe.exec(w.de);
      const gParts = (IS_ES ? /^(el|la|los|las)\s+(.+)$/i : /^(der|die|das)\s+(.+)$/i).exec(g);
      if (m && norm(g) === norm(m[2])) {
        points.push(`The word is right, but nouns always need their article: ${end(w.de)}`);
        const gp = genderPoint(w);
        if (gp) points.push(gp);
      } else if (m && gParts && norm(gParts[2]) === norm(m[2]) && gParts[1].toLowerCase() !== m[1]) {
        points.push(`You wrote ${gParts[1].toLowerCase()}, which would make it ${ARTICLE_MEANS[gParts[1].toLowerCase()] ?? gParts[1]}. It's ${end(w.de)}`);
        const gp = genderPoint(w);
        if (gp) points.push(gp);
      } else if (g) {
        const target = m ? m[2] : w.de;
        const mine = gParts ? gParts[2] : g;
        const hit = mine.includes(" ") ? null : lookupWord(mine);
        const otherWord = hit && norm(hit.base) !== norm(w.de) && norm(hit.base) !== norm(target) && plain(mine) !== plain(target);
        const hints = otherWord ? [] : spellingHints(mine, target);
        if (otherWord) points.push(`${mine} means "${hit!.meaning}". "${w.en}" is ${end(w.de)}`);
        else if (hints.length) {
          points.push(...hints);
          letters = { given: mine, answer: target };
        } else points.push(`"${w.en}" is ${end(w.de)}`);
      }
      if (w.note) points.push(w.note);
      const exl = exampleLine(w);
      if (exl) points.push(exl);
      return { points, letters, link: m ? { href: "/genders", label: "How noun genders work" } : undefined };
    }

    case "typeEn": {
      const w = ex.word;
      const points: string[] = [];
      if (g) {
        const ng = g.toLowerCase().replace(/^(to|a|an|the) /, "");
        const other = ALL_WORDS.find((x) => x.id !== w.id && englishVariants(x.en).includes(ng));
        if (other) points.push(`"${g}" is ${end(other.de)}`);
      }
      points.push(`${w.de} means "${w.en}".`);
      const exl = exampleLine(w);
      if (exl) points.push(exl);
      return { points };
    }

    case "gender": {
      const w = ex.word;
      const points: string[] = [];
      const picked = g.split(" ")[0]?.toLowerCase();
      const real = L.articleRe.exec(w.de)?.[1];
      if (picked && picked !== real) points.push(`${picked} would make it ${ARTICLE_MEANS[picked] ?? picked}. It's ${end(w.de)}`);
      const gp = genderPoint(w);
      if (gp) points.push(gp);
      return { points, link: { href: "/genders", label: "How noun genders work" } };
    }

    case "fill":
    case "fillType": {
      const points: string[] = [];
      const why = lessonWhy(ex);
      if (why) points.push(why);
      const typed = g.replace(ex.de.split("___")[0], "").replace(ex.de.split("___")[1] ?? "", "").trim();
      const mine = ex.kind === "fill" ? (g ? typed || g : "") : typed || g;
      let letters: Explanation["letters"];
      if (mine && norm(mine) !== norm(ex.answer)) {
        // a real word or form first: "habe" for "haben" is a different form, not a typo
        const d = describeWord(mine);
        if (d) points.push(`What you ${ex.kind === "fill" ? "chose" : "wrote"}: ${d}.`);
        else if (ex.kind === "fillType") {
          const hints = spellingHints(mine, ex.answer);
          if (hints.length) {
            points.push(...hints);
            letters = { given: mine, answer: ex.answer };
          }
        }
      }
      return { points, letters, link: unitLink(ex.unitId) };
    }

    case "choice": {
      const points: string[] = [];
      const why = lessonWhy(ex);
      if (why) points.push(why);
      else points.push(`The answer is ${end(ex.answer)}`);
      return { points, link: unitLink(ex.unitId) };
    }

    case "build":
      return buildExplanation(ex, g);

    case "dictation": {
      const points: string[] = [];
      const diff = diffTokens(tokens(g), tokens(ex.de), wordEq);
      const dels = diff.filter((d) => d.op === "del").map((d) => d.text);
      const adds = diff.filter((d) => d.op === "add").map((d) => d.text);
      // pair up near misses (a wrong word where a right one should be)
      let explained = 0;
      for (let i = 0; i < Math.min(dels.length, adds.length) && explained < 3; i++) {
        const hints = spellingHints(dels[i], adds[i]);
        if (hints.length) {
          points.push(`${dels[i]} → ${adds[i]}: ${hints[0]}`);
          explained++;
        }
      }
      if (!explained && adds.length) points.push(`Words you missed or misheard: ${adds.join(", ")}.`);
      if (!g) points.push(`Play it slowly and write it a word at a time.`);
      points.push(`It means: ${ex.en}`);
      return { points, words: { given: g, answer: ex.de } };
    }

    case "conj":
      return conjExplanation(ex, g);

    case "match":
      return null;
  }
}

/**
 * The reasoning behind a right answer, for a "Why?" button.
 * Only for questions where there's a rule worth knowing.
 */
export function explainCorrect(ex: Exercise): Explanation | null {
  switch (ex.kind) {
    case "fill":
    case "fillType":
    case "choice":
    case "build": {
      const why = lessonWhy(ex);
      return why ? { points: [why], link: unitLink(ex.unitId) } : null;
    }
    case "gender":
    case "type": {
      const gp = genderPoint(ex.word);
      return gp ? { points: [gp], link: { href: "/genders", label: "How noun genders work" } } : null;
    }
    case "conj": {
      const full = conjExplanation(ex, "");
      return { ...full, points: full.points };
    }
    default:
      return null;
  }
}

// ── listening ──────────────────────────────────────────────────────────────

const ES_SOUNDS: [RegExp, string][] = [
  [/ñ/i, "ñ sounds like the ny in \"canyon\""],
  [/ll/i, "ll sounds like the English y"],
  [/rr/i, "rr is a long rolled r"],
  [/j|g[ei]/i, "j (and g before e or i) is a breathy h sound"],
  [/qu/i, "qu sounds like k, and the u is silent"],
  [/(^|[^c])h/i, "h is always silent"],
  [/z|c[ei]/i, "z, and c before e or i, sound like s"],
  [/v/i, "v sounds the same as b"],
  [/[áéíóú]/i, "the accent mark shows which syllable is stressed"],
];

const DE_SOUNDS: [RegExp, string][] = [
  [/ei/i, "ei sounds like \"eye\""],
  [/ie/i, "ie sounds like \"ee\""],
  [/eu|äu/i, "eu and äu sound like \"oy\""],
  [/au/i, "au sounds like \"ow\""],
  [/ä/i, "ä sounds like the e in \"bed\""],
  [/ö/i, "ö is \"ay\" said with rounded lips"],
  [/ü/i, "ü is \"ee\" said with rounded lips"],
  [/sch/i, "sch sounds like \"sh\""],
  [/ch/i, "ch is a soft hiss after e, i, ä, ö, ü and a throaty sound after a, o, u"],
  [/z/i, "z sounds like \"ts\""],
  [/w/i, "w sounds like an English v"],
  [/^v|[^a-z]v/i, "v usually sounds like f"],
  [/^s[pt]/i, "sp and st at the start sound like \"shp\" and \"sht\""],
];

const SOUNDS = IS_ES ? ES_SOUNDS : DE_SOUNDS;

/** Point out sounds that differ between what was said and what was picked. */
function soundTips(target: string, picked: string): string[] {
  const tips: string[] = [];
  for (const [re, tip] of SOUNDS) {
    const inT = re.test(target);
    const inP = picked ? re.test(picked) : false;
    if (inT && !inP) tips.push(`Listen for it: ${tip}, and it's in ${target}.`);
    if (tips.length >= 2) break;
  }
  return tips;
}

export { ARTICLE };
