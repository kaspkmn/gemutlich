import { ALL_WORDS, getUnit } from "@/content/course";
import type { CourseWord } from "@/content/types";
import { VERBS, PERSONS, regularForms, type Verb } from "@/content/verbs";
import { WHY } from "@/content/why";
import type { Exercise } from "./exercises";
import { englishVariants, lev, norm, tokens } from "./answers";
import { analyzeNoun, ARTICLE } from "./gender-rules";
import { lookupWord } from "./lexicon";

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

const ROLE: Record<string, string> = {
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
    if (g.toLowerCase() === f.verb.inf) return `${g} is the infinitive (the dictionary form), which is also the wir and sie/Sie form of ${f.verb.inf} (${f.verb.en})`;
    return `${g} is the ${personsText(f.persons)} form of ${f.verb.inf} (${f.verb.en})`;
  }
  const hit = lookupWord(g);
  if (hit) return `${g} means \"${hit.meaning}\"`;
  return null;
}

// ── spelling ───────────────────────────────────────────────────────────────

const plain = (s: string) =>
  s.toLowerCase().replace(/ä/g, "a").replace(/ö/g, "o").replace(/ü/g, "u").replace(/ß/g, "ss").replace(/[^a-z ]/g, "").replace(/\s+/g, " ").trim();
const low = (s: string) => s.toLowerCase().replace(/[.,!?"„“]/g, "").replace(/\s+/g, " ").trim();

const SOUND_SWAPS: [string, string, string][] = [
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

/** Explain a misspelling of `answer` as `given`. Empty if it isn't a near miss. */
export function spellingHints(given: string, answer: string): string[] {
  const g = low(given);
  const a = low(answer);
  if (!g || g === a) return [];
  const hints: string[] = [];
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
    if (g.includes(from) && g.replace(from, to) === a) {
      hints.push(`Spelling: ${why}.`);
      return hints;
    }
  }
  const vowelH = [...g].some((_, i) => /[aeiouäöü]/.test(g[i - 1] ?? "") && g.slice(0, i) + "h" + g.slice(i) === a);
  if (vowelH) {
    hints.push(`There's a silent h in ${answer}. An h after a vowel isn't pronounced, it just makes the vowel long (wohnen, Uhr, sehr).`);
    return hints;
  }
  const undouble = (s: string) => s.replace(/(.)\1/g, "$1");
  if (undouble(plain(g)) === undouble(plain(a))) {
    hints.push(`Close: watch the double letters in ${answer}. A double consonant after a vowel makes that vowel short.`);
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
      return WHY[ex.de];
    case "build":
      return WHY[ex.de];
    case "choice":
      return WHY[ex.q] ?? ex.explain;
    default:
      return undefined;
  }
}

function conjExplanation(ex: Extract<Exercise, { kind: "conj" }>, given: string): Explanation {
  const { verb, person } = ex;
  const right = verb.forms[person];
  const g = given.trim().toLowerCase().replace(/^(ich|du|er|sie|es|wir|ihr|sie|man)\s+/, "");
  const points: string[] = [];
  const persons = verb.forms.map((f, i) => (f.toLowerCase() === g ? i : -1)).filter((i) => i >= 0);
  if (g && g === verb.inf.toLowerCase() && !persons.includes(person)) {
    points.push(`${given.trim()} is the infinitive, the form you'd find in a dictionary. With ${PERSONS[person]} it needs its own ending: ${right}.`);
  } else if (persons.length) {
    points.push(`${given.trim()} is the ${personsText(persons)} form. For ${PERSONS[person]}, it's ${right}.`);
  } else if (g) {
    const hints = spellingHints(g, right);
    if (hints.length) points.push(...hints);
    else {
      const other = VERB_FORM_INDEX.get(g)?.find((x) => x.verb !== verb);
      points.push(
        other
          ? `${given.trim()} ${g === other.verb.inf ? "is" : `comes from`} a different verb, ${other.verb.inf} (${other.verb.en}). This one is ${verb.inf} (${verb.en}), and for ${PERSONS[person]} it's ${right}.`
          : `${given.trim()} isn't a form of ${verb.inf}. For ${PERSONS[person]}, it's ${right}.`
      );
    }
  }
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
  return {
    points,
    letters: g && !persons.length && (spellingHints(g, right).length || lev(plain(g), plain(right)) <= 2) ? { given: g, answer: right } : undefined,
    table: { title: verb.inf, rows: verb.forms.map((f, i) => [PERSONS[i], f]), highlight: person },
  };
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

  if (!extra.length && !missing.length) {
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
            ex.dir === "de-en" ? `You picked "${g}", which is ${other.de} in German.` : `You picked ${g}, which means "${other.en}".`
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
      const m = /^(der|die|das) (.+)$/.exec(w.de);
      const gParts = /^(der|die|das)\s+(.+)$/i.exec(g);
      if (m && norm(g) === norm(m[2])) {
        points.push(`The word is right, but nouns always need their article: ${end(w.de)}`);
        const gp = genderPoint(w);
        if (gp) points.push(gp);
      } else if (m && gParts && norm(gParts[2]) === norm(m[2]) && gParts[1].toLowerCase() !== m[1]) {
        points.push(`You wrote ${gParts[1].toLowerCase()}, which would make it ${{ der: "masculine", die: "feminine (or plural)", das: "neuter" }[gParts[1].toLowerCase() as "der" | "die" | "das"]}. It's ${end(w.de)}`);
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
      const real = /^(der|die|das)/.exec(w.de)?.[1];
      if (picked && picked !== real) points.push(`${picked} would make it ${{ der: "masculine", die: "feminine", das: "neuter" }[picked as "der" | "die" | "das"] ?? picked}. It's ${end(w.de)}`);
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

const SOUNDS: [RegExp, string][] = [
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
