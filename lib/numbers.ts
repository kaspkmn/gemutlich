/** Numbers, prices and clock times for the numbers drill, in German or Spanish. */

import { IS_ES } from "./lang";

const ONES = [
  "null", "eins", "zwei", "drei", "vier", "fünf", "sechs", "sieben", "acht", "neun",
  "zehn", "elf", "zwölf", "dreizehn", "vierzehn", "fünfzehn", "sechzehn", "siebzehn", "achtzehn", "neunzehn",
];
const TENS = ["", "", "zwanzig", "dreißig", "vierzig", "fünfzig", "sechzig", "siebzig", "achtzig", "neunzig"];

function under100(n: number): string {
  if (n < 20) return ONES[n];
  const t = Math.floor(n / 10);
  const o = n % 10;
  if (!o) return TENS[t];
  return `${o === 1 ? "ein" : ONES[o]}und${TENS[t]}`;
}

function under1000(n: number): string {
  if (n < 100) return under100(n);
  const h = Math.floor(n / 100);
  const r = n % 100;
  const head = `${h === 1 ? "ein" : ONES[h]}hundert`;
  return r ? head + under100(r) : head;
}

/** 0 to 999,999 written out in German. */
export function numberToGerman(n: number): string {
  if (n < 1000) return under1000(n);
  const th = Math.floor(n / 1000);
  const r = n % 1000;
  const head = `${th === 1 ? "ein" : under1000(th)}tausend`;
  return r ? head + under1000(r) : head;
}

/** Turn digits inside recognized speech into words: "3 Uhr" → "drei Uhr", "3 perros" → "tres perros". */
export function digitsToWords(text: string): string {
  return text.replace(/\d+/g, (d) => {
    const n = Number(d);
    return n < 1000000 ? (IS_ES ? numberToSpanish(n) : numberToGerman(n)) : d;
  });
}

// ── Spanish ──

const ES_ONES = [
  "cero", "uno", "dos", "tres", "cuatro", "cinco", "seis", "siete", "ocho", "nueve",
  "diez", "once", "doce", "trece", "catorce", "quince", "dieciséis", "diecisiete", "dieciocho", "diecinueve",
  "veinte", "veintiuno", "veintidós", "veintitrés", "veinticuatro", "veinticinco", "veintiséis", "veintisiete", "veintiocho", "veintinueve",
];
const ES_TENS = ["", "", "veinte", "treinta", "cuarenta", "cincuenta", "sesenta", "setenta", "ochenta", "noventa"];
const ES_HUNDREDS = ["", "ciento", "doscientos", "trescientos", "cuatrocientos", "quinientos", "seiscientos", "setecientos", "ochocientos", "novecientos"];

function esUnder100(n: number): string {
  if (n < 30) return ES_ONES[n];
  const t = Math.floor(n / 10);
  const o = n % 10;
  return o ? `${ES_TENS[t]} y ${ES_ONES[o]}` : ES_TENS[t];
}

function esUnder1000(n: number): string {
  if (n < 100) return esUnder100(n);
  if (n === 100) return "cien";
  const h = Math.floor(n / 100);
  const r = n % 100;
  return r ? `${ES_HUNDREDS[h]} ${esUnder100(r)}` : ES_HUNDREDS[h];
}

/** 0 to 999,999 in Spanish. `beforeNoun` turns uno into un (un peso, veintiún pesos). */
export function numberToSpanish(n: number, beforeNoun = false): string {
  let out: string;
  if (n < 1000) out = esUnder1000(n);
  else {
    const th = Math.floor(n / 1000);
    const r = n % 1000;
    const head = th === 1 ? "mil" : `${apocope(esUnder1000(th))} mil`;
    out = r ? `${head} ${esUnder1000(r)}` : head;
  }
  return beforeNoun ? apocope(out) : out;
}

/** uno → un, veintiuno → veintiún, at the end of a number before a noun */
function apocope(s: string): string {
  return s.replace(/veintiuno$/, "veintiún").replace(/uno$/, "un");
}

const ES_HOUR = (h: number) => (h === 1 ? "la una" : `las ${numberToSpanish(h)}`);

function esEverydayTime(h12: number, m: number): string {
  const next = (h12 % 12) + 1;
  if (m === 0) return ES_HOUR(h12);
  if (m === 15) return `${ES_HOUR(h12)} y cuarto`;
  if (m === 30) return `${ES_HOUR(h12)} y media`;
  if (m === 45) return `${ES_HOUR(next)} menos cuarto`;
  if (m < 30) return `${ES_HOUR(h12)} y ${numberToSpanish(m)}`;
  return `${ES_HOUR(next)} menos ${numberToSpanish(60 - m)}`;
}

const rand = (min: number, max: number) => min + Math.floor(Math.random() * (max - min + 1));
const pick = <T,>(a: T[]): T => a[Math.floor(Math.random() * a.length)];

export type NumberMode = "small" | "hundred" | "big" | "prices" | "clock" | "time" | "phone";

export interface NumberModeInfo {
  id: NumberMode;
  label: string;
  hint: string;
  example: string;
  tip?: string;
}

const DE_MODES: NumberModeInfo[] = [
  { id: "small", label: "0 to 20", hint: "Type the number", example: "siebzehn = 17" },
  { id: "hundred", label: "Up to 100", hint: "Type the number", example: "siebenundvierzig = 47" },
  { id: "big", label: "Big numbers", hint: "Type the number", example: "dreihundertzwölf = 312" },
  { id: "prices", label: "Prices", hint: "Type the price, like 3,50", example: "drei Euro fünfzig = 3,50" },
  { id: "clock", label: "Clock times (official)", hint: "Type the time, like 15:30", example: "fünfzehn Uhr dreißig = 15:30" },
  {
    id: "time",
    label: "Clock times (everyday)",
    hint: "Type the time, like 3:30",
    example: "halb vier = 3:30",
    tip: "Everyday times: halb vier is 3:30 (half way to four). Viertel nach drei is 3:15, Viertel vor vier is 3:45. Either 3:30 or 15:30 counts.",
  },
  { id: "phone", label: "Phone numbers", hint: "Type the digits", example: "null eins fünf ... = 015..." },
];

const ES_MODES: NumberModeInfo[] = [
  { id: "small", label: "0 to 20", hint: "Type the number", example: "diecisiete = 17" },
  { id: "hundred", label: "Up to 100", hint: "Type the number", example: "cuarenta y siete = 47" },
  { id: "big", label: "Big numbers", hint: "Type the number", example: "trescientos doce = 312" },
  {
    id: "prices",
    label: "Prices",
    hint: "Type the price, like 3.50",
    example: "tres pesos con cincuenta = 3.50",
    tip: "Prices are in Mexican pesos. \"con cincuenta\" adds the centavos: veinte pesos con cincuenta is $20.50.",
  },
  {
    id: "time",
    label: "Clock times",
    hint: "Type the time, like 3:30",
    example: "las tres y media = 3:30",
    tip: "y adds minutes, menos takes them away from the next hour: las cuatro menos cuarto is 3:45. In Mexico you'll also hear cuarto para las cuatro. Either 3:30 or 15:30 counts.",
  },
  { id: "phone", label: "Phone numbers", hint: "Type the digits", example: "cinco cinco dos ... = 552..." },
];

export const NUMBER_MODES: NumberModeInfo[] = IS_ES ? ES_MODES : DE_MODES;

export interface NumberItem {
  /** what is said or shown in German */
  de: string;
  /** what to display as the answer */
  answer: string;
  /** every accepted answer, normalized */
  accept: string[];
}

const hourWord = (h: number) => (h === 1 ? "eins" : numberToGerman(h));

function everydayTime(h24: number, m: number): string {
  const h12 = h24 % 12 || 12;
  const next = (h12 % 12) + 1;
  if (m === 0) return `${h12 === 1 ? "ein" : numberToGerman(h12)} Uhr`;
  if (m === 15) return `Viertel nach ${hourWord(h12)}`;
  if (m === 30) return `halb ${hourWord(next)}`;
  if (m === 45) return `Viertel vor ${hourWord(next)}`;
  if (m === 25) return `fünf vor halb ${hourWord(next)}`;
  if (m === 35) return `fünf nach halb ${hourWord(next)}`;
  if (m < 25) return `${numberToGerman(m)} nach ${hourWord(h12)}`;
  return `${numberToGerman(60 - m)} vor ${hourWord(next)}`;
}

const pad = (n: number) => String(n).padStart(2, "0");

function makeSpanishItem(mode: NumberMode): NumberItem {
  switch (mode) {
    case "small":
    case "hundred":
    case "big": {
      const n = mode === "small" ? rand(0, 20) : mode === "hundred" ? rand(21, 99) : pick([rand(100, 999), rand(100, 999), rand(1000, 9999)]);
      return { de: numberToSpanish(n), answer: String(n), accept: [String(n)] };
    }
    case "prices": {
      const p = pick([rand(1, 99), rand(1, 99), rand(100, 999)]);
      const c = pick([0, 0, 50, 90, 25, rand(1, 99)]);
      const de = `${numberToSpanish(p, true)} ${p === 1 ? "peso" : "pesos"}${c ? ` con ${numberToSpanish(c)}` : ""}`;
      return { de, answer: `$${p}.${pad(c)}`, accept: [`${p}.${pad(c)}`, ...(c ? [] : [`${p}`])] };
    }
    case "clock":
    case "time": {
      const h = rand(1, 12);
      const m = pick([0, 15, 30, 45, 5, 10, 20, 25, 35, 40, 50, 55]);
      const h24 = h === 12 ? 0 : h + 12;
      return {
        de: esEverydayTime(h, m),
        answer: `${h}:${pad(m)}`,
        accept: [`${h}:${pad(m)}`, `${h24}:${pad(m)}`, ...(h === 12 ? ["0:" + pad(m), "00:" + pad(m)] : [])],
      };
    }
    case "phone": {
      const digits = "55" + Array.from({ length: 8 }, () => rand(0, 9)).join("");
      return { de: [...digits].map((d) => ES_ONES[Number(d)]).join(" "), answer: digits, accept: [digits] };
    }
  }
}

export function makeNumberItem(mode: NumberMode): NumberItem {
  if (IS_ES) return makeSpanishItem(mode);
  switch (mode) {
    case "small":
    case "hundred":
    case "big": {
      const n = mode === "small" ? rand(0, 20) : mode === "hundred" ? rand(21, 99) : pick([rand(100, 999), rand(100, 999), rand(1000, 9999)]);
      return { de: numberToGerman(n), answer: String(n), accept: [String(n)] };
    }
    case "prices": {
      const e = pick([rand(1, 9), rand(1, 9), rand(10, 99)]);
      const c = pick([0, 50, 99, 20, 90, rand(1, 99)]);
      const de = `${e === 1 ? "ein" : numberToGerman(e)} Euro${c ? ` ${numberToGerman(c)}` : ""}`;
      return { de, answer: `${e},${pad(c)} €`, accept: [`${e}.${pad(c)}`, ...(c ? [] : [`${e}`])] };
    }
    case "clock": {
      const h = rand(0, 23);
      const m = pick([0, 15, 30, 45, rand(1, 59)]);
      const de = `${h === 1 ? "ein" : numberToGerman(h)} Uhr${m ? ` ${numberToGerman(m)}` : ""}`;
      return { de, answer: `${h}:${pad(m)}`, accept: [`${h}:${pad(m)}`] };
    }
    case "time": {
      const h = rand(1, 12);
      const m = pick([0, 15, 30, 45, 5, 10, 20, 25, 35, 40, 50, 55]);
      const h24 = h === 12 ? 0 : h + 12;
      return {
        de: everydayTime(h, m),
        answer: `${h}:${pad(m)}`,
        accept: [`${h}:${pad(m)}`, `${h24}:${pad(m)}`, ...(h === 12 ? ["0:" + pad(m), "00:" + pad(m)] : [])],
      };
    }
    case "phone": {
      const digits = "0" + Array.from({ length: rand(6, 8) }, () => rand(0, 9)).join("");
      const de = [...digits].map((d) => ONES[Number(d)]).join(" ");
      return { de, answer: digits, accept: [digits] };
    }
  }
}

/** Clean a typed answer so "3.50", "3,50 €", "03:30" and "3 30" compare equal. */
export function normalizeNumberAnswer(input: string, mode: NumberMode): string {
  let s = input.trim().replace(/€|eur(o)?|\$|pesos?|mxn/gi, "").replace(/\s+/g, "");
  if (mode === "phone") return s.replace(/\D/g, "");
  if (mode === "prices") {
    s = s.replace(",", ".");
    if (!s.includes(".")) return String(Number(s));
    const [e, c = ""] = s.split(".");
    return `${Number(e || 0)}.${(c + "00").slice(0, 2)}`;
  }
  if (mode === "clock" || mode === "time") {
    s = s.replace(/uhr|am|pm/gi, "").replace(/[.h]/gi, ":");
    if (!s.includes(":")) return s.length >= 3 ? `${Number(s.slice(0, -2))}:${s.slice(-2)}` : `${Number(s)}:00`;
    const [h, m = "0"] = s.split(":");
    return `${Number(h)}:${pad(Number(m))}`;
  }
  return String(Number(s.replace(/[.,]/g, "")));
}

export function checkNumber(input: string, item: NumberItem, mode: NumberMode): boolean {
  const n = normalizeNumberAnswer(input, mode);
  return item.accept.some((a) => normalizeNumberAnswer(a, mode) === n);
}
