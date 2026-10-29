/** Present-tense conjugations for the verbs taught in the course. */

import type { Verb } from "./types";
import { IS_ES } from "@/lib/lang";
import { ES_PERSONS, ES_VERBS, esRegularForms } from "./es/verbs";

export type { Verb } from "./types";

const DE_PERSONS: readonly string[] = ["ich", "du", "er / sie / es", "wir", "ihr", "sie / Sie"];

function reg(inf: string): Verb["forms"] {
  const stem = inf.replace(/e?n$/, "");
  const needsE = /[td]$/.test(stem); // arbeiten → arbeitest
  const sibilant = /(s|ß|z|x)$/.test(stem); // tanzen → du tanzt
  const e = needsE ? "e" : "";
  return [
    `${stem}e`,
    sibilant ? `${stem}t` : `${stem}${e}st`,
    `${stem}${e}t`,
    inf,
    `${stem}${e}t`,
    inf,
  ];
}

const v = (inf: string, en: string, unitId: string, forms?: Verb["forms"]): Verb => ({
  inf,
  en,
  unitId,
  forms: forms ?? reg(inf),
});

const DE_VERBS: Verb[] = [
  v("heißen", "to be called", "intro", ["heiße", "heißt", "heißt", "heißen", "heißt", "heißen"]),
  v("kommen", "to come", "intro"),
  v("wohnen", "to live", "intro"),
  v("sein", "to be", "sein", ["bin", "bist", "ist", "sind", "seid", "sind"]),
  v("haben", "to have", "family", ["habe", "hast", "hat", "haben", "habt", "haben"]),
  v("machen", "to do, to make", "verbs"),
  v("lernen", "to learn", "verbs"),
  v("spielen", "to play", "verbs"),
  v("arbeiten", "to work", "verbs"),
  v("kaufen", "to buy", "verbs"),
  v("trinken", "to drink", "verbs"),
  v("essen", "to eat", "verbs", ["esse", "isst", "isst", "essen", "esst", "essen"]),
  v("gehen", "to go", "verbs"),
  v("schlafen", "to sleep", "verbs", ["schlafe", "schläfst", "schläft", "schlafen", "schlaft", "schlafen"]),
  v("lesen", "to read", "verbs", ["lese", "liest", "liest", "lesen", "lest", "lesen"]),
  v("schreiben", "to write", "verbs"),
  v("hören", "to hear", "verbs"),
  v("sehen", "to see", "verbs", ["sehe", "siehst", "sieht", "sehen", "seht", "sehen"]),
  v("kochen", "to cook", "verbs"),
  v("fahren", "to drive", "verbs", ["fahre", "fährst", "fährt", "fahren", "fahrt", "fahren"]),
  v("sprechen", "to speak", "verbs", ["spreche", "sprichst", "spricht", "sprechen", "sprecht", "sprechen"]),
  v("möchten", "would like", "food", ["möchte", "möchtest", "möchte", "möchten", "möchtet", "möchten"]),
  v("brauchen", "to need", "accusative"),
  v("nehmen", "to take", "accusative", ["nehme", "nimmst", "nimmt", "nehmen", "nehmt", "nehmen"]),
  v("suchen", "to look for", "accusative"),
  v("finden", "to find", "accusative", ["finde", "findest", "findet", "finden", "findet", "finden"]),
  v("mögen", "to like", "accusative", ["mag", "magst", "mag", "mögen", "mögt", "mögen"]),
  v("besuchen", "to visit", "accusative"),
  v("lieben", "to love", "accusative"),
  v("können", "can", "modals", ["kann", "kannst", "kann", "können", "könnt", "können"]),
  v("müssen", "must", "modals", ["muss", "musst", "muss", "müssen", "müsst", "müssen"]),
  v("wollen", "to want", "modals", ["will", "willst", "will", "wollen", "wollt", "wollen"]),
  v("dürfen", "may", "modals", ["darf", "darfst", "darf", "dürfen", "dürft", "dürfen"]),
  v("sollen", "should", "modals", ["soll", "sollst", "soll", "sollen", "sollt", "sollen"]),
  v("helfen", "to help", "modals", ["helfe", "hilfst", "hilft", "helfen", "helft", "helfen"]),
  v("schwimmen", "to swim", "modals"),
  v("tanzen", "to dance", "modals"),
  v("singen", "to sing", "modals"),
  v("warten", "to wait", "modals"),
  v("bleiben", "to stay", "modals"),
  v("duschen", "to shower", "separable"),
  v("frühstücken", "to have breakfast", "separable"),
  v("fliegen", "to fly", "perfekt-sein"),
  v("laufen", "to run, to walk", "perfekt-sein", ["laufe", "läufst", "läuft", "laufen", "lauft", "laufen"]),
  v("gefallen", "to please", "dative-pronouns", ["gefalle", "gefällst", "gefällt", "gefallen", "gefallt", "gefallen"]),
  v("schmecken", "to taste", "dative-pronouns"),
  v("gehören", "to belong to", "dative-pronouns"),
  v("danken", "to thank", "dative-pronouns"),
  v("antworten", "to answer", "dative-pronouns"),
  v("passen", "to fit", "dative-pronouns"),
  v("liegen", "to lie (flat)", "at-home"),
  v("stehen", "to stand", "at-home"),
  v("hängen", "to hang", "at-home"),
  v("glauben", "to believe", "because"),
  v("denken", "to think", "because"),
  v("hoffen", "to hope", "because"),
  v("wissen", "to know", "because", ["weiß", "weißt", "weiß", "wissen", "wisst", "wissen"]),
];

/** The six persons, in table order. */
export const PERSONS: readonly string[] = IS_ES ? ES_PERSONS : DE_PERSONS;
/** Verbs for the language being studied. */
export const VERBS: Verb[] = IS_ES ? ES_VERBS : DE_VERBS;
/** What a verb's forms would be if it were completely regular. */
export function regularForms(inf: string): Verb["forms"] {
  return IS_ES ? esRegularForms(inf) : reg(inf);
}
