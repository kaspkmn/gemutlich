import type { Verb } from "../types";

/** Present-tense conjugations for the Spanish verbs in the course. */

/** vosotros is only used in Spain. It's shown in tables but never quizzed. */
export const ES_PERSONS: readonly string[] = ["yo", "tú", "él / ella / usted", "nosotros", "vosotros", "ellos / ellas / ustedes"];

/** Regular present tense: drop -ar/-er/-ir and add the ending. */
export function esRegularForms(inf: string): Verb["forms"] {
  const stem = inf.slice(0, -2);
  const end = inf.slice(-2);
  if (end === "ar") return [`${stem}o`, `${stem}as`, `${stem}a`, `${stem}amos`, `${stem}áis`, `${stem}an`];
  if (end === "er") return [`${stem}o`, `${stem}es`, `${stem}e`, `${stem}emos`, `${stem}éis`, `${stem}en`];
  return [`${stem}o`, `${stem}es`, `${stem}e`, `${stem}imos`, `${stem}ís`, `${stem}en`];
}

const v = (inf: string, en: string, unitId: string, forms?: Verb["forms"]): Verb => ({
  inf,
  en,
  unitId,
  forms: forms ?? esRegularForms(inf),
});

export const ES_VERBS: Verb[] = [
  // introducing yourself
  v("hablar", "to speak", "es-intro"),
  v("vivir", "to live", "es-intro"),
  // ser and tener
  v("ser", "to be (who or what)", "es-ser", ["soy", "eres", "es", "somos", "sois", "son"]),
  v("tener", "to have", "es-family", ["tengo", "tienes", "tiene", "tenemos", "tenéis", "tienen"]),
  // everyday verbs
  v("trabajar", "to work", "es-verbs"),
  v("estudiar", "to study", "es-verbs"),
  v("comer", "to eat", "es-verbs"),
  v("beber", "to drink", "es-verbs"),
  v("escribir", "to write", "es-verbs"),
  v("leer", "to read", "es-verbs"),
  v("cocinar", "to cook", "es-verbs"),
  v("escuchar", "to listen to", "es-verbs"),
  v("comprar", "to buy", "es-verbs"),
  v("aprender", "to learn", "es-verbs"),
  v("caminar", "to walk", "es-verbs"),
  v("abrir", "to open", "es-verbs"),
  // food
  v("tomar", "to take, to drink", "es-food"),
  v("pagar", "to pay", "es-food"),
  // time
  v("terminar", "to finish", "es-time"),
  // estar
  v("estar", "to be (how or where)", "es-estar", ["estoy", "estás", "está", "estamos", "estáis", "están"]),
  // describing
  v("llevar", "to wear, to carry", "es-describe"),
  v("mirar", "to look at, to watch", "es-describe"),
  // questions
  v("buscar", "to look for", "es-questions"),
  v("preguntar", "to ask", "es-questions"),
  v("necesitar", "to need", "es-questions"),
  v("costar", "to cost", "es-questions", ["cuesto", "cuestas", "cuesta", "costamos", "costáis", "cuestan"]),
  // likes
  v("bailar", "to dance", "es-gustar"),
  v("cantar", "to sing", "es-gustar"),
  v("nadar", "to swim", "es-gustar"),
  // stem-changing verbs
  v("querer", "to want, to love", "es-stem", ["quiero", "quieres", "quiere", "queremos", "queréis", "quieren"]),
  v("preferir", "to prefer", "es-stem", ["prefiero", "prefieres", "prefiere", "preferimos", "preferís", "prefieren"]),
  v("pensar", "to think", "es-stem", ["pienso", "piensas", "piensa", "pensamos", "pensáis", "piensan"]),
  v("empezar", "to start", "es-stem", ["empiezo", "empiezas", "empieza", "empezamos", "empezáis", "empiezan"]),
  v("entender", "to understand", "es-stem", ["entiendo", "entiendes", "entiende", "entendemos", "entendéis", "entienden"]),
  v("dormir", "to sleep", "es-stem", ["duermo", "duermes", "duerme", "dormimos", "dormís", "duermen"]),
  v("volver", "to come back", "es-stem", ["vuelvo", "vuelves", "vuelve", "volvemos", "volvéis", "vuelven"]),
  v("jugar", "to play (a game)", "es-stem", ["juego", "juegas", "juega", "jugamos", "jugáis", "juegan"]),
  v("pedir", "to order, to ask for", "es-stem", ["pido", "pides", "pide", "pedimos", "pedís", "piden"]),
  v("encontrar", "to find", "es-stem", ["encuentro", "encuentras", "encuentra", "encontramos", "encontráis", "encuentran"]),
  // going places
  v("ir", "to go", "es-going", ["voy", "vas", "va", "vamos", "vais", "van"]),
  v("venir", "to come", "es-going", ["vengo", "vienes", "viene", "venimos", "venís", "vienen"]),
  v("salir", "to go out, to leave", "es-going", ["salgo", "sales", "sale", "salimos", "salís", "salen"]),
  v("llegar", "to arrive", "es-going"),
  v("tomar", "to take (the bus)", "es-going"),
  // can, must, know
  v("poder", "can, to be able to", "es-modals", ["puedo", "puedes", "puede", "podemos", "podéis", "pueden"]),
  v("deber", "should, must", "es-modals"),
  v("saber", "to know (facts, how to)", "es-modals", ["sé", "sabes", "sabe", "sabemos", "sabéis", "saben"]),
  v("conocer", "to know (people, places)", "es-modals", ["conozco", "conoces", "conoce", "conocemos", "conocéis", "conocen"]),
  v("manejar", "to drive", "es-modals"),
  // routine
  v("hacer", "to do, to make", "es-routine", ["hago", "haces", "hace", "hacemos", "hacéis", "hacen"]),
  v("poner", "to put", "es-routine", ["pongo", "pones", "pone", "ponemos", "ponéis", "ponen"]),
  v("ver", "to see, to watch", "es-routine", ["veo", "ves", "ve", "vemos", "veis", "ven"]),
  v("decir", "to say, to tell", "es-routine", ["digo", "dices", "dice", "decimos", "decís", "dicen"]),
  // the past (present forms)
  v("cenar", "to have dinner", "es-past-1"),
  v("desayunar", "to have breakfast", "es-past-1"),
  // object pronouns
  v("ayudar", "to help", "es-pronouns"),
  v("llamar", "to call", "es-pronouns"),
  v("dar", "to give", "es-pronouns", ["doy", "das", "da", "damos", "dais", "dan"]),
  v("traer", "to bring", "es-pronouns", ["traigo", "traes", "trae", "traemos", "traéis", "traen"]),
  // because
  v("creer", "to believe, to think", "es-because"),
  v("esperar", "to hope, to wait", "es-because"),
  v("viajar", "to travel", "es-because"),
].filter((verb, i, all) => all.findIndex((x) => x.inf === verb.inf) === i);
