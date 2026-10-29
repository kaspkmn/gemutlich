import type { Unit, Word, Gender } from "../types";

/* Spanish lessons 13 to 24: questions, gustar, irregular verbs, plans, the past, and connecting ideas. */

type Ex = [string, string];
type Opts = Partial<Word>;

const N = (de: string, en: string, gender: Gender, plural?: string, ex?: Ex, opts: Opts = {}): Word => ({
  de, en, type: "noun", gender, plural, ex, ...opts,
});
const V = (de: string, en: string, ex?: Ex, opts: Opts = {}): Word => ({ de, en, type: "verb", ex, ...opts });
const P = (de: string, en: string, opts: Opts = {}): Word => ({ de, en, type: "phrase", ...opts });
const A = (de: string, en: string, ex?: Ex, opts: Opts = {}): Word => ({ de, en, type: "adj", ex, ...opts });
const W = (de: string, en: string, ex?: Ex, opts: Opts = {}): Word => ({ de, en, type: "word", ex, ...opts });

export const ES_UNITS_2: Unit[] = [
  // ───────────────────────────── 13
  {
    id: "es-questions",
    n: 13,
    title: "Asking questions",
    titleDe: "Las preguntas",
    blurb: "what, who, where, when, how, why, how much, which.",
    words: [
      W("qué", "what", ["¿Qué es esto?", "What's this?"]),
      W("quién", "who", ["¿Quién es?", "Who is it?"]),
      W("dónde", "where", ["¿Dónde vives?", "Where do you live?"]),
      W("adónde", "where to", ["¿Adónde vas?", "Where are you going?"]),
      W("cuándo", "when", ["¿Cuándo es tu cumpleaños?", "When is your birthday?"]),
      W("cómo", "how", ["¿Cómo estás?", "How are you?"]),
      W("por qué", "why", ["¿Por qué estás triste?", "Why are you sad?"], { note: "Two words with an accent. porque (one word) means because." }),
      W("cuánto", "how much", ["¿Cuánto cuesta?", "How much does it cost?"]),
      W("cuántos", "how many", ["¿Cuántos hijos tienes?", "How many kids do you have?"]),
      W("cuál", "which, what (choosing)", ["¿Cuál es tu número?", "What's your number?"]),
      V("buscar", "to look for", ["Busco el baño.", "I'm looking for the bathroom."]),
      V("preguntar", "to ask"),
      V("necesitar", "to need", ["¿Qué necesitas?", "What do you need?"]),
      V("costar", "to cost", ["¿Cuánto cuesta?", "How much does it cost?"], { note: "o changes to ue: cuesta, cuestan." }),
      N("la pregunta", "question", "f", "las preguntas"),
      N("el cumpleaños", "birthday", "m", "los cumpleaños", undefined, { note: "cumple (completes) + años (years). Words made from a verb and a noun are always masculine." }),
    ],
    notes: [
      {
        title: "Question words",
        body: ["Every question word has an accent. Without it, the same word means something else (que = that, como = like)."],
        table: {
          head: ["Spanish", "English"],
          rows: [
            ["¿qué?", "what?"],
            ["¿quién?", "who?"],
            ["¿dónde? ¿adónde? ¿de dónde?", "where? where to? where from?"],
            ["¿cuándo?", "when?"],
            ["¿cómo?", "how?"],
            ["¿por qué?", "why?"],
            ["¿cuánto? ¿cuántos?", "how much? how many?"],
            ["¿cuál?", "which? what?"],
          ],
        },
      },
      {
        title: "¿Por qué? and porque",
        body: [
          "¿Por qué? (two words, accent) asks why. porque (one word, no accent) answers: because.",
          "¿Por qué estudias español? Porque quiero viajar.",
        ],
      },
      {
        title: "¿Qué? or ¿Cuál?",
        body: [
          "Before es and son, \"what\" is usually cuál: ¿Cuál es tu nombre? ¿Cuál es tu número?",
          "¿Qué es...? asks for a definition: ¿Qué es una tortilla?",
          "Before a noun, use qué: ¿Qué color te gusta?",
        ],
      },
      {
        title: "Yes/no questions",
        body: [
          "You don't need to change the word order. Just raise your voice at the end: ¿Tienes hijos? ¿Hablas inglés?",
        ],
      },
    ],
    drills: [
      { t: "fill", de: "¿___ te llamas?", en: "What's your name?", answer: "Cómo", options: ["Cómo", "Qué", "Cuál", "Dónde"], why: "Spanish asks \"how do you call yourself?\": ¿Cómo te llamas?" },
      { t: "fill", de: "¿___ cuesta?", en: "How much does it cost?", answer: "Cuánto", options: ["Cuánto", "Cuántos", "Qué", "Cómo"], why: "How much is cuánto. cuántos (how many) is for things you count." },
      { t: "fill", de: "¿___ vives?", en: "Where do you live?", answer: "Dónde", options: ["Dónde", "Adónde", "Cuándo", "Quién"], why: "Where someone or something is: dónde. adónde is \"where to\", for movement." },
      { t: "fill", de: "¿___ es tu cumpleaños?", en: "When is your birthday?", answer: "Cuándo", options: ["Cuándo", "Cuál", "Qué", "Dónde"], why: "When is cuándo." },
      { t: "fill", de: "¿___ es tu color favorito?", en: "What's your favorite color?", answer: "Cuál", options: ["Cuál", "Qué", "Cómo", "Quién"], why: "Before es, \"what\" is usually cuál, since you're picking one from a set." },
      { t: "choice", q: "\"Why?\" in Spanish is...", answer: "¿Por qué?", options: ["¿Por qué?", "¿Porque?", "¿Para qué?", "¿Qué?"], explain: "The question is two words with an accent: ¿Por qué? The answer porque (because) is one word." },
      { t: "build", de: "¿Qué necesitas?", en: "What do you need?", why: "Question word first, then the verb. necesitas is the tú form." },
      { t: "build", de: "¿Por qué estás triste?", en: "Why are you sad?", why: "¿Por qué? first. estás because sadness is a feeling (estar)." },
    ],
    prompts: [
      ["¿Qué haces los fines de semana?", "What do you do on weekends?"],
      ["¿Por qué estudias español?", "Why are you studying Spanish?"],
    ],
  },

  // ───────────────────────────── 14
  {
    id: "es-gustar",
    n: 14,
    title: "Likes & loves",
    titleDe: "Me gusta",
    blurb: "me gusta, me gustan, me encanta, and me too / me neither.",
    skill: "cases",
    words: [
      P("Me gusta ...", "I like ...", { noType: true }),
      P("Me gustan ...", "I like ... (more than one)", { noType: true }),
      P("¿Te gusta ...?", "do you like ...?", { noType: true }),
      P("Me encanta ...", "I love ...", { noType: true }),
      P("No me gusta.", "I don't like it."),
      P("A mí también.", "me too."),
      P("A mí tampoco.", "me neither."),
      N("el deporte", "sport", "m", "los deportes"),
      N("la película", "movie", "f", "las películas", ["Me gustan las películas de terror.", "I like horror movies."]),
      N("el videojuego", "video game", "m", "los videojuegos"),
      N("el fútbol", "soccer", "m"),
      N("la playa", "beach", "f", "las playas"),
      N("el gimnasio", "gym", "m"),
      V("bailar", "to dance"),
      V("cantar", "to sing"),
      V("nadar", "to swim"),
      A("favorito", "favorite"),
    ],
    notes: [
      {
        title: "How gustar works",
        body: [
          "Spanish says \"it pleases me\" instead of \"I like it\". The thing you like is the subject, so the verb matches the thing, not you:",
          "Me gusta el café. (Coffee pleases me.) Me gustan los perros. (Dogs please me.)",
          "With an activity (an infinitive) it's always gusta: Me gusta bailar.",
        ],
      },
      {
        title: "Who likes it",
        body: ["The little word in front shows who:"],
        table: {
          head: ["", "", ""],
          rows: [
            ["me gusta", "I like", "a mí"],
            ["te gusta", "you like", "a ti"],
            ["le gusta", "he, she likes; you (usted) like", "a él, a ella, a usted"],
            ["nos gusta", "we like", "a nosotros"],
            ["les gusta", "they like; you all like", "a ellos, a ustedes"],
          ],
        },
        tip: "le can be he, she or you, so people add a name to be clear: A mi mamá le gusta cocinar.",
      },
      {
        title: "Me too, me neither",
        body: [
          "Agreeing with a like: Me gusta el café. A mí también.",
          "Agreeing with a dislike: No me gusta el café. A mí tampoco.",
          "Me encanta (I love it) works the same way: Me encantan los gatos.",
        ],
      },
    ],
    drills: [
      { t: "fill", de: "Me ___ los perros.", en: "I like dogs.", answer: "gustan", options: ["gustan", "gusta", "gusto", "gustas"], why: "The verb matches the thing liked. los perros is plural, so it's gustan." },
      { t: "fill", de: "¿Te ___ bailar?", en: "Do you like to dance?", answer: "gusta", options: ["gusta", "gustan", "gustas", "gusto"], why: "With an activity (an infinitive like bailar), it's always gusta." },
      { t: "fill", de: "A mi mamá ___ gusta cocinar.", en: "My mom likes to cook.", answer: "le", options: ["le", "me", "te", "les"], why: "For he, she or one other person, the little word is le." },
      { t: "fill", de: "Nos ___ la playa.", en: "We love the beach.", answer: "encanta", options: ["encanta", "encantan", "encantamos", "encanto"], why: "encantar works like gustar: it matches the thing loved. la playa is one thing, so encanta." },
      { t: "choice", q: "Your friend says \"No me gusta el café.\" You don't either. You say...", answer: "A mí tampoco.", options: ["A mí tampoco.", "A mí también.", "Yo no.", "Me gusta."], explain: "tampoco agrees with a negative: me neither. también agrees with a positive: me too." },
      { t: "build", de: "Me encanta la playa.", en: "I love the beach.", why: "Me + encanta + the thing loved. Unlike English, the thing comes after with its article." },
      { t: "build", de: "¿Te gustan las películas de terror?", en: "Do you like horror movies?", why: "películas is plural, so gustan. de terror (of horror) comes after the noun." },
    ],
    prompts: [
      ["¿Qué te gusta hacer los fines de semana?", "What do you like to do on weekends?"],
      ["¿Qué música te gusta?", "What music do you like?"],
    ],
  },

  // ───────────────────────────── 15
  {
    id: "es-negation",
    n: 15,
    title: "No, never, nothing",
    titleDe: "La negación",
    blurb: "no, nada, nunca, nadie, and why double negatives are correct in Spanish.",
    skill: "wordorder",
    words: [
      W("nada", "nothing"),
      W("nunca", "never"),
      W("nadie", "nobody"),
      W("tampoco", "neither, not either"),
      W("algo", "something"),
      W("alguien", "someone"),
      W("siempre", "always"),
      W("a veces", "sometimes"),
      W("todavía", "still, yet"),
      W("ya", "already"),
      P("Ya no.", "not anymore."),
      P("Todavía no.", "not yet."),
      P("No pasa nada.", "it's fine, no problem."),
    ],
    notes: [
      {
        title: "no goes before the verb",
        body: [
          "Put no right in front of the verb: No hablo alemán. No tengo tiempo.",
          "If there's a little word like me, te or lo, no goes before that: No me gusta. No lo sé.",
        ],
      },
      {
        title: "Double negatives are correct",
        body: [
          "Spanish says \"I don't have nothing\" and means \"I don't have anything\": No tengo nada.",
          "No veo a nadie (I don't see anyone). No voy nunca (I never go).",
          "If nunca or nadie comes first, drop the no: Nunca voy. Nadie sabe.",
        ],
      },
      {
        title: "Opposites",
        body: [],
        table: {
          head: ["positive", "negative"],
          rows: [
            ["algo (something)", "nada (nothing)"],
            ["alguien (someone)", "nadie (nobody)"],
            ["siempre (always)", "nunca (never)"],
            ["también (also)", "tampoco (neither)"],
          ],
        },
      },
    ],
    drills: [
      { t: "fill", de: "Yo ___ hablo alemán.", en: "I don't speak German.", answer: "no", options: ["no", "nada", "nunca", "ni"], why: "no goes right before the verb to make it negative." },
      { t: "fill", de: "No tengo ___.", en: "I don't have anything.", answer: "nada", options: ["nada", "algo", "nadie", "nunca"], why: "Spanish uses a double negative: no + nada (nothing). Saying algo here would be wrong." },
      { t: "fill", de: "No hay ___ en la casa.", en: "There's nobody in the house.", answer: "nadie", options: ["nadie", "nada", "alguien", "nunca"], why: "nadie means nobody, and it pairs with no in the same sentence." },
      { t: "fill", de: "¿Ya comiste? Todavía ___.", en: "Did you eat already? Not yet.", answer: "no", options: ["no", "nada", "nunca", "sí"], why: "Todavía no means \"not yet\"." },
      { t: "choice", q: "\"No veo a nadie\" means...", answer: "I don't see anyone.", options: ["I don't see anyone.", "I see someone.", "I see nobody, never.", "Nobody sees me."], explain: "The double negative (no + nadie) is normal Spanish and means a single \"not anyone\"." },
      { t: "build", de: "Nunca bebo café.", en: "I never drink coffee.", why: "When nunca comes first, you don't need no." },
      { t: "build", de: "No quiero nada.", en: "I don't want anything.", why: "no before the verb, then nada. Two negatives, one meaning." },
      { t: "build", de: "No me gusta.", en: "I don't like it.", why: "no goes before the little word me, not between me and gusta." },
    ],
    prompts: [["¿Qué no te gusta hacer?", "What don't you like doing?"]],
  },

  // ───────────────────────────── 16
  {
    id: "es-stem",
    n: 16,
    title: "Stem-changing verbs",
    titleDe: "Verbos con cambio",
    blurb: "quiero, puedo, duermo, pido: the boot verbs and how they change.",
    skill: "verbs",
    words: [
      V("querer", "to want, to love", ["Quiero un café.", "I want a coffee."]),
      V("preferir", "to prefer"),
      V("pensar", "to think"),
      V("empezar", "to start, to begin"),
      V("entender", "to understand", ["No entiendo.", "I don't understand."]),
      V("dormir", "to sleep"),
      V("volver", "to come back"),
      V("jugar", "to play (games, sports)", ["Juego videojuegos.", "I play video games."]),
      V("pedir", "to order, to ask for", ["Siempre pido tacos de pollo.", "I always order chicken tacos."]),
      V("encontrar", "to find"),
      N("la clase", "class", "f", "las clases"),
      N("el taco", "taco", "m", "los tacos"),
      N("el té", "tea", "m"),
      P("Te quiero.", "I love you."),
    ],
    notes: [
      {
        title: "Boot verbs",
        body: [
          "Some verbs change a vowel in their stem in every form except nosotros. In a table, the changing forms make a boot shape:",
        ],
        table: {
          head: ["", "e → ie: querer", "o → ue: dormir", "e → i: pedir"],
          rows: [
            ["yo", "quiero", "duermo", "pido"],
            ["tú", "quieres", "duermes", "pides"],
            ["él, ella, usted", "quiere", "duerme", "pide"],
            ["nosotros", "queremos", "dormimos", "pedimos"],
            ["ellos, ustedes", "quieren", "duermen", "piden"],
          ],
        },
        tip: "The endings stay regular. Only the stem changes, and only inside the boot.",
      },
      {
        title: "Which ones change?",
        body: [
          "There's no way to tell from the infinitive, so dictionaries mark them: querer (ie), dormir (ue), pedir (i).",
          "jugar is the only u → ue verb: juego, juegas, jugamos.",
          "tener and venir change e → ie and also have a special yo form: tengo, vengo.",
        ],
      },
    ],
    drills: [
      { t: "fill", de: "Yo ___ un café.", en: "I want a coffee.", answer: "quiero", options: ["quiero", "quero", "queremos", "quieres"], why: "querer changes e → ie inside the boot: quiero." },
      { t: "fill", de: "Nosotros ___ a las ocho.", en: "We start at eight.", answer: "empezamos", options: ["empezamos", "empiezamos", "empiezan", "empiezo"], why: "nosotros is outside the boot, so empezar keeps its e: empezamos." },
      { t: "fill", de: "¿Tú ___ español?", en: "Do you understand Spanish?", answer: "entiendes", options: ["entiendes", "entendes", "entiende", "entendemos"], why: "entender changes e → ie with tú: entiendes." },
      { t: "fill", de: "Ella ___ ocho horas.", en: "She sleeps eight hours.", answer: "duerme", options: ["duerme", "dorme", "duermo", "dormimos"], why: "dormir changes o → ue inside the boot: duerme." },
      { t: "fill", de: "Ellos ___ fútbol los sábados.", en: "They play soccer on Saturdays.", answer: "juegan", options: ["juegan", "jugan", "juega", "jugamos"], why: "jugar is the one u → ue verb: juegan." },
      { t: "fill", de: "Siempre ___ tacos de pollo.", en: "I always order chicken tacos.", answer: "pido", options: ["pido", "pedo", "pide", "pedimos"], why: "pedir changes e → i: pido. (Never say \"pedo\", which is slang for a fart.)" },
      { t: "build", de: "Prefiero el té.", en: "I prefer tea.", why: "preferir changes e → ie: prefiero. Spanish keeps the article: el té." },
      { t: "build", de: "¿A qué hora vuelves?", en: "What time are you coming back?", why: "volver changes o → ue: vuelves." },
    ],
    prompts: [
      ["¿Cuántas horas duermes?", "How many hours do you sleep?"],
      ["¿Qué pides en un restaurante mexicano?", "What do you order at a Mexican restaurant?"],
    ],
  },

  // ───────────────────────────── 17
  {
    id: "es-going",
    n: 17,
    title: "Going places",
    titleDe: "Vamos",
    blurb: "ir and ir a (going to), al and del, places in town and directions.",
    words: [
      V("ir", "to go", ["Voy al trabajo.", "I'm going to work."]),
      V("venir", "to come"),
      V("salir", "to go out, to leave"),
      V("llegar", "to arrive"),
      N("el mercado", "market", "m", "los mercados"),
      N("el supermercado", "supermarket", "m"),
      N("el banco", "bank", "m", "los bancos"),
      N("la tienda", "store", "f", "las tiendas"),
      N("el parque", "park", "m", "los parques"),
      N("el restaurante", "restaurant", "m", "los restaurantes"),
      N("la farmacia", "pharmacy", "f", "las farmacias"),
      N("la calle", "street", "f", "las calles"),
      N("el camión", "bus (in Mexico)", "m", "los camiones", undefined, { note: "In Mexico a city bus is el camión. In other countries it's el autobús, and camión means truck." }),
      N("el metro", "subway", "m"),
      W("a la derecha", "to the right"),
      W("a la izquierda", "to the left"),
      W("derecho", "straight ahead"),
      P("Voy a ...", "I'm going to ...", { noType: true }),
    ],
    notes: [
      {
        title: "ir (to go)",
        body: ["Completely irregular:"],
        table: {
          head: ["", "ir"],
          rows: [
            ["yo", "voy"],
            ["tú", "vas"],
            ["él, ella, usted", "va"],
            ["nosotros", "vamos"],
            ["ellos, ustedes", "van"],
          ],
        },
        tip: "¡Vamos! on its own means \"Let's go!\"",
      },
      {
        title: "al and del",
        body: [
          "a + el always squeezes into al: Voy al parque (not a el parque).",
          "de + el becomes del: Vengo del trabajo.",
          "la doesn't change: Voy a la farmacia.",
        ],
      },
      {
        title: "Going to (the near future)",
        body: [
          "ir + a + infinitive talks about plans, exactly like English \"going to\":",
          "Voy a comer. (I'm going to eat.) Vamos a ver una película. (We're going to watch a movie.)",
        ],
      },
      {
        title: "Directions",
        body: [
          "a la derecha (to the right), a la izquierda (to the left), derecho (straight ahead).",
          "Dé vuelta a la derecha = Turn right (usted). In Mexico you'll hear dé vuelta a lot.",
        ],
      },
    ],
    drills: [
      { t: "fill", de: "Voy ___ supermercado.", en: "I'm going to the supermarket.", answer: "al", options: ["al", "a el", "a la", "del"], why: "a + el always becomes al. supermercado is masculine." },
      { t: "fill", de: "Nosotros ___ al parque.", en: "We're going to the park.", answer: "vamos", options: ["vamos", "vemos", "van", "voy"], why: "ir with nosotros is vamos." },
      { t: "fill", de: "Mañana voy ___ trabajar.", en: "Tomorrow I'm going to work.", answer: "a", options: ["a", "de", "en", "para"], why: "Plans use ir + a + infinitive: voy a trabajar." },
      { t: "fill", de: "¿A qué hora ___ el camión?", en: "What time does the bus arrive?", answer: "llega", options: ["llega", "llegas", "llegan", "llego"], why: "el camión is one thing (it), so llegar becomes llega." },
      { t: "fill", de: "Yo ___ de la casa a las siete.", en: "I leave the house at seven.", answer: "salgo", options: ["salgo", "salo", "sale", "salimos"], why: "salir has an irregular yo form: salgo. The rest are regular: sales, sale." },
      { t: "choice", q: "\"Voy a estudiar\" means...", answer: "I'm going to study.", options: ["I'm going to study.", "I go to study.", "I studied.", "I want to study."], explain: "ir + a + infinitive is the near future, just like \"going to\"." },
      { t: "build", de: "Voy a la farmacia.", en: "I'm going to the pharmacy.", why: "voy a + la farmacia. a la doesn't shorten, only a el does." },
      { t: "build", de: "Vamos a comer tacos.", en: "We're going to eat tacos.", why: "vamos a + infinitive (comer) for a plan." },
    ],
    prompts: [
      ["¿Qué vas a hacer este fin de semana?", "What are you going to do this weekend?"],
      ["¿Adónde vas después del trabajo?", "Where do you go after work?"],
    ],
  },

  // ───────────────────────────── 18
  {
    id: "es-modals",
    n: 18,
    title: "Can, must, know",
    titleDe: "Poder y deber",
    blurb: "poder, tener que, deber, and the two ways to know: saber and conocer.",
    skill: "verbs",
    words: [
      V("poder", "can, to be able to", ["¿Puedo pagar con tarjeta?", "Can I pay by card?"]),
      V("deber", "should, must"),
      V("saber", "to know (facts, how to)", ["No sé.", "I don't know."]),
      V("conocer", "to know (people, places)", ["¿Conoces a mi hermana?", "Do you know my sister?"]),
      V("manejar", "to drive", undefined, { note: "In Mexico it's manejar. In Spain it's conducir." }),
      P("tener que ...", "to have to ...", { noType: true }),
      P("hay que ...", "you have to ..., one must ...", { noType: true }),
      P("¿Puedo ...?", "can I ...?", { noType: true }),
      P("¿Me puedes ayudar?", "can you help me?"),
      P("No sé.", "I don't know."),
      N("la tarjeta", "card", "f", "las tarjetas"),
      N("el dinero", "money", "m"),
    ],
    notes: [
      {
        title: "Verb + infinitive",
        body: [
          "Like English, these are followed by a second verb in its dictionary form:",
          "Puedo nadar (I can swim). Debes dormir (You should sleep). Tengo que trabajar (I have to work).",
        ],
      },
      {
        title: "poder",
        body: ["poder is a boot verb, o → ue:"],
        table: {
          head: ["", "poder"],
          rows: [
            ["yo", "puedo"],
            ["tú", "puedes"],
            ["él, ella, usted", "puede"],
            ["nosotros", "podemos"],
            ["ellos, ustedes", "pueden"],
          ],
        },
      },
      {
        title: "Have to",
        body: [
          "tener que + infinitive: Tengo que ir al banco (I have to go to the bank).",
          "hay que + infinitive is general, for everyone: Hay que pagar aquí (You have to pay here).",
          "deber is softer, \"should\": Debes descansar (You should rest).",
        ],
      },
      {
        title: "saber or conocer?",
        body: [
          "saber is knowing facts and knowing how: Sé su número. Sé manejar (I know how to drive). The yo form is sé.",
          "conocer is being familiar with a person or place: Conozco a su hermano. Conozco la Ciudad de México. The yo form is conozco.",
          "People take an extra a: Conozco a Kas.",
        ],
      },
    ],
    drills: [
      { t: "fill", de: "¿___ abrir la ventana?", en: "Can I open the window?", answer: "Puedo", options: ["Puedo", "Podo", "Puede", "Pueden"], why: "poder changes o → ue: puedo. Then the second verb stays in its infinitive form." },
      { t: "fill", de: "Tengo ___ trabajar mañana.", en: "I have to work tomorrow.", answer: "que", options: ["que", "de", "a", "por"], why: "\"Have to\" is always tener que + infinitive." },
      { t: "fill", de: "Yo no ___ manejar.", en: "I don't know how to drive.", answer: "sé", options: ["sé", "conozco", "puedo", "se"], why: "Knowing how to do something is saber. The yo form is sé, with an accent." },
      { t: "fill", de: "¿___ a mi hermana?", en: "Do you know my sister?", answer: "Conoces", options: ["Conoces", "Sabes", "Puedes", "Tienes"], why: "Knowing a person is conocer, and people take an a after it: conoces a." },
      { t: "fill", de: "Ustedes ___ descansar.", en: "You all should rest.", answer: "deben", options: ["deben", "debe", "debemos", "debes"], why: "ustedes uses the ellos form: deben." },
      { t: "build", de: "Debes dormir más.", en: "You should sleep more.", why: "deber + infinitive (dormir) for advice. más (more) comes after." },
      { t: "build", de: "No puedo ir hoy.", en: "I can't go today.", why: "no before the verb puedo, then the infinitive ir." },
    ],
    prompts: [
      ["¿Qué tienes que hacer mañana?", "What do you have to do tomorrow?"],
      ["¿Sabes cocinar?", "Do you know how to cook?"],
    ],
  },

  // ───────────────────────────── 19
  {
    id: "es-routine",
    n: 19,
    title: "Daily routine",
    titleDe: "La rutina",
    blurb: "Reflexive verbs (me levanto, me ducho) and the irregular yo forms hago, pongo, veo, digo.",
    skill: "verbs",
    words: [
      V("levantarse", "to get up", ["Me levanto a las seis.", "I get up at six."]),
      V("despertarse", "to wake up", undefined, { note: "e → ie: me despierto." }),
      V("ducharse", "to shower"),
      V("bañarse", "to take a bath, to shower", undefined, { note: "In Mexico bañarse is often used for showering too." }),
      V("vestirse", "to get dressed", undefined, { note: "e → i: me visto." }),
      V("acostarse", "to go to bed", undefined, { note: "o → ue: me acuesto." }),
      V("hacer", "to do, to make", ["Hago ejercicio por la mañana.", "I work out in the morning."]),
      V("poner", "to put"),
      V("ver", "to see, to watch", ["Veo la tele por la noche.", "I watch TV at night."]),
      V("decir", "to say, to tell"),
      W("primero", "first"),
      W("después", "afterwards, later"),
      W("luego", "then, later"),
      W("por la mañana", "in the morning"),
      W("por la tarde", "in the afternoon"),
      W("por la noche", "at night"),
    ],
    notes: [
      {
        title: "Reflexive verbs",
        body: [
          "Many routine verbs are \"done to yourself\". In the dictionary they end in -se: levantarse (to get yourself up).",
          "When you use them, the -se becomes a little word before the verb that matches the person:",
        ],
        table: {
          head: ["", "levantarse"],
          rows: [
            ["yo", "me levanto"],
            ["tú", "te levantas"],
            ["él, ella, usted", "se levanta"],
            ["nosotros", "nos levantamos"],
            ["ellos, ustedes", "se levantan"],
          ],
        },
        tip: "Some are also boot verbs: me acuesto, me despierto, me visto.",
      },
      {
        title: "Irregular yo forms",
        body: ["These are regular except for yo, which adds a g or loses a letter:"],
        table: {
          head: ["verb", "yo", "tú"],
          rows: [
            ["hacer", "hago", "haces"],
            ["poner", "pongo", "pones"],
            ["salir", "salgo", "sales"],
            ["ver", "veo", "ves"],
            ["decir", "digo", "dices (also e → i)"],
          ],
        },
      },
      {
        title: "Telling it in order",
        body: ["primero (first), luego (then), después (afterwards): Primero me ducho, luego desayuno y después voy al trabajo."],
      },
    ],
    drills: [
      { t: "fill", de: "Yo ___ levanto a las seis.", en: "I get up at six.", answer: "me", options: ["me", "te", "se", "nos"], why: "Reflexive verbs need the little word that matches the person. For yo it's me." },
      { t: "fill", de: "Ella se ___ por la noche.", en: "She takes a bath at night.", answer: "baña", options: ["baña", "baño", "bañas", "bañan"], why: "Ella takes the él/ella form: se baña." },
      { t: "fill", de: "¿A qué hora te ___?", en: "What time do you go to bed?", answer: "acuestas", options: ["acuestas", "acostas", "acuesto", "acuesta"], why: "acostarse is a boot verb (o → ue), and with tú it's te acuestas." },
      { t: "fill", de: "Yo ___ la tarea por la noche.", en: "I do the homework at night.", answer: "hago", options: ["hago", "haco", "hace", "hacemos"], why: "hacer has an irregular yo form: hago." },
      { t: "fill", de: "Primero me ducho y ___ desayuno.", en: "First I shower and then I have breakfast.", answer: "luego", options: ["luego", "antes", "nunca", "ya"], why: "luego (then) puts the second step in order after primero." },
      { t: "build", de: "Me ducho por la mañana.", en: "I shower in the morning.", why: "The little word me comes right before the verb: me ducho." },
      { t: "build", de: "Mis hijos se acuestan tarde.", en: "My kids go to bed late.", why: "ellos takes se, and acostarse changes o → ue: se acuestan." },
    ],
    prompts: [
      ["¿A qué hora te levantas?", "What time do you get up?"],
      ["¿Qué haces por la noche?", "What do you do in the evening?"],
    ],
  },

  // ───────────────────────────── 20
  {
    id: "es-past-1",
    n: 20,
    title: "The past, part 1",
    titleDe: "El pretérito (-ar)",
    blurb: "What you did yesterday: hablé, trabajé, compré, and time words for the past.",
    skill: "verbs",
    words: [
      W("anoche", "last night"),
      W("la semana pasada", "last week", undefined, { noType: true }),
      W("el año pasado", "last year", undefined, { noType: true }),
      W("hace dos días", "two days ago", undefined, { noType: true }),
      W("hablé", "I spoke, I talked"),
      W("trabajé", "I worked"),
      W("compré", "I bought"),
      W("llegué", "I arrived", undefined, { note: "g becomes gu before é to keep the hard g sound." }),
      W("empecé", "I started", undefined, { note: "z becomes c before e." }),
      W("busqué", "I looked for", undefined, { note: "c becomes qu before e to keep the k sound." }),
      W("cocinaste", "you cooked"),
      W("cocinó", "he/she cooked"),
      W("caminamos", "we walked (also: we walk)"),
      W("llegaron", "they arrived"),
      V("cenar", "to have dinner"),
      V("desayunar", "to have breakfast"),
    ],
    notes: [
      {
        title: "The preterite: finished actions",
        body: ["For things that happened and finished (yesterday, last week), -ar verbs take these endings:"],
        table: {
          head: ["", "hablar", "trabajar"],
          rows: [
            ["yo", "hablé", "trabajé"],
            ["tú", "hablaste", "trabajaste"],
            ["él, ella, usted", "habló", "trabajó"],
            ["nosotros", "hablamos", "trabajamos"],
            ["ellos, ustedes", "hablaron", "trabajaron"],
          ],
        },
        tip: "The accent matters: hablo is \"I speak\", habló is \"he spoke\".",
      },
      {
        title: "Spelling changes in yo",
        body: [
          "Three yo forms change their spelling to keep the sound:",
          "-gar → -gué: llegar → llegué, pagar → pagué.",
          "-car → -qué: buscar → busqué, tocar → toqué.",
          "-zar → -cé: empezar → empecé.",
        ],
      },
      {
        title: "Time words",
        body: [
          "ayer (yesterday), anoche (last night), la semana pasada (last week), el año pasado (last year), hace dos días (two days ago).",
          "nosotros looks the same in present and past (hablamos), so these words make it clear.",
        ],
      },
    ],
    drills: [
      { t: "fill", de: "Ayer ___ ocho horas.", en: "Yesterday I worked eight hours.", answer: "trabajé", options: ["trabajé", "trabajo", "trabajó", "trabajaste"], why: "A finished action in the past, with yo: trabajé (accent on the é). trabajó is he/she worked." },
      { t: "fill", de: "Anoche mi esposo ___ la cena.", en: "Last night my husband cooked dinner.", answer: "cocinó", options: ["cocinó", "cocino", "cociné", "cocinaron"], why: "One person (he) in the past: cocinó. Without the accent, cocino means \"I cook\"." },
      { t: "fill", de: "¿Qué ___ en la tienda?", en: "What did you buy at the store?", answer: "compraste", options: ["compraste", "compré", "compró", "compras"], why: "tú in the preterite ends in -aste: compraste." },
      { t: "fill", de: "Ellos ___ tarde.", en: "They arrived late.", answer: "llegaron", options: ["llegaron", "llegan", "llegó", "llegamos"], why: "ellos in the preterite ends in -aron: llegaron." },
      { t: "fill", de: "Yo ___ a las nueve.", en: "I arrived at nine.", answer: "llegué", options: ["llegué", "llegé", "llego", "llegó"], why: "llegar adds a u in the yo form (llegué) so the g stays hard, like in \"go\"." },
      { t: "choice", q: "\"habló\" means...", answer: "he spoke", options: ["he spoke", "I speak", "I spoke", "you spoke"], explain: "The accent on the final ó marks the past tense for él/ella. hablo (no accent) is \"I speak\"." },
      { t: "build", de: "Ayer hablé con mi mamá.", en: "Yesterday I talked to my mom.", why: "Time word first is common. hablé is the yo form, and \"talk to\" is hablar con." },
      { t: "build", de: "La semana pasada compramos un carro.", en: "Last week we bought a car.", why: "compramos is the same in present and past. La semana pasada makes it past." },
    ],
    prompts: [
      ["¿Qué cenaste anoche?", "What did you have for dinner last night?"],
      ["¿Con quién hablaste ayer?", "Who did you talk to yesterday?"],
    ],
  },

  // ───────────────────────────── 21
  {
    id: "es-past-2",
    n: 21,
    title: "The past, part 2",
    titleDe: "El pretérito (-er, -ir)",
    blurb: "comí, salí, and the irregulars you'll use daily: fui, hice, tuve, estuve.",
    skill: "verbs",
    words: [
      W("comí", "I ate"),
      W("bebí", "I drank"),
      W("escribí", "I wrote"),
      W("salí", "I went out, I left"),
      W("viví", "I lived"),
      W("fui", "I went; I was", undefined, { note: "ir and ser share the same past tense. Context tells you which." }),
      W("fue", "he/she went; it was"),
      W("hice", "I did, I made"),
      W("hizo", "he/she did, made", undefined, { note: "z instead of c, to keep the s sound." }),
      W("tuve", "I had"),
      W("estuve", "I was (estar)"),
      W("vi", "I saw"),
      W("dije", "I said"),
      P("¿Qué hiciste?", "what did you do?"),
      P("¿Cómo te fue?", "how did it go?"),
      P("Me fue bien.", "it went well."),
    ],
    notes: [
      {
        title: "-er and -ir verbs",
        body: ["-er and -ir share the same past endings:"],
        table: {
          head: ["", "comer", "salir"],
          rows: [
            ["yo", "comí", "salí"],
            ["tú", "comiste", "saliste"],
            ["él, ella, usted", "comió", "salió"],
            ["nosotros", "comimos", "salimos"],
            ["ellos, ustedes", "comieron", "salieron"],
          ],
        },
      },
      {
        title: "The everyday irregulars",
        body: ["These don't follow the pattern, and they don't take accents:"],
        table: {
          head: ["", "ir / ser", "hacer", "tener", "estar"],
          rows: [
            ["yo", "fui", "hice", "tuve", "estuve"],
            ["tú", "fuiste", "hiciste", "tuviste", "estuviste"],
            ["él, ella, usted", "fue", "hizo", "tuvo", "estuvo"],
            ["nosotros", "fuimos", "hicimos", "tuvimos", "estuvimos"],
            ["ellos, ustedes", "fueron", "hicieron", "tuvieron", "estuvieron"],
          ],
        },
        tip: "Fui al cine (I went to the movies) and Fue increíble (It was amazing) use the same verb form for different verbs.",
      },
      {
        title: "How did it go?",
        body: ["¿Cómo te fue? (How did it go for you?) Me fue bien / Me fue mal (It went well / badly)."],
      },
    ],
    drills: [
      { t: "fill", de: "Anoche yo ___ tacos.", en: "Last night I ate tacos.", answer: "comí", options: ["comí", "como", "comió", "comimos"], why: "A finished action with yo: comí, with the accent on í." },
      { t: "fill", de: "El sábado ___ al cine.", en: "On Saturday I went to the movies.", answer: "fui", options: ["fui", "fue", "voy", "fuimos"], why: "ir in the past with yo is fui (no accent). fue is he/she went." },
      { t: "fill", de: "¿Qué ___ el fin de semana?", en: "What did you do on the weekend?", answer: "hiciste", options: ["hiciste", "haces", "hizo", "hice"], why: "hacer is irregular in the past. With tú: hiciste." },
      { t: "fill", de: "Ayer ___ que trabajar.", en: "Yesterday I had to work.", answer: "tuve", options: ["tuve", "tengo", "tuvo", "tení"], why: "tener in the past is irregular: tuve (yo). tener que still means \"have to\"." },
      { t: "fill", de: "¿Cómo te ___ en el examen?", en: "How did the exam go?", answer: "fue", options: ["fue", "fui", "va", "fuiste"], why: "¿Cómo te fue? is a fixed phrase: literally \"how did it go to you?\", so it's fue (it went)." },
      { t: "choice", q: "\"fui\" can mean...", answer: "I went, or I was", options: ["I went, or I was", "only I went", "he went", "I go"], explain: "ir and ser share the same past forms, so fui is \"I went\" or \"I was\" depending on context." },
      { t: "build", de: "Mi hermana vivió en Texas.", en: "My sister lived in Texas.", why: "vivir in the past with ella: vivió, accent on the ó." },
      { t: "build", de: "Vi una película de terror.", en: "I watched a horror movie.", why: "vi is \"I saw / watched\" (ver), one syllable, no accent." },
    ],
    prompts: [
      ["¿Qué hiciste el fin de semana?", "What did you do on the weekend?"],
      ["¿Cómo te fue en el trabajo hoy?", "How did work go today?"],
    ],
  },

  // ───────────────────────────── 22
  {
    id: "es-pronouns",
    n: 22,
    title: "It, him, me, you",
    titleDe: "Los pronombres",
    blurb: "lo, la, me, te, le: replacing nouns, and where the little words go.",
    skill: "cases",
    words: [
      V("ayudar", "to help", ["¿Me ayudas?", "Will you help me?"]),
      V("llamar", "to call"),
      V("dar", "to give"),
      V("traer", "to bring"),
      P("Te llamo mañana.", "I'll call you tomorrow."),
      P("Te extraño.", "I miss you."),
      P("Lo tengo.", "I have it."),
      P("No lo sé.", "I don't know."),
      P("¿Me ayudas?", "will you help me?"),
      N("el regalo", "gift, present", "m", "los regalos"),
      N("el mensaje", "message", "m", "los mensajes"),
      N("el correo", "email, mail", "m", "los correos"),
    ],
    notes: [
      {
        title: "Replacing a noun",
        body: ["To say \"it\" or \"him/her/them\" as the object, use these. They match the noun they replace:"],
        table: {
          head: ["", "masculine", "feminine"],
          rows: [
            ["it, him, her", "lo", "la"],
            ["them", "los", "las"],
          ],
        },
        tip: "¿El libro? Lo tengo. ¿La llave? La tengo. ¿Los boletos? Los tengo.",
      },
      {
        title: "me, te, nos",
        body: [
          "me (me), te (you), nos (us) work for both \"me\" and \"to me\": Me llama (She calls me). Me da un regalo (She gives me a gift).",
          "Te quiero (I love you). Te extraño (I miss you).",
        ],
      },
      {
        title: "le and les: to someone",
        body: [
          "le is \"to him, to her, to you (usted)\", les is \"to them\". You saw it with gustar: le gusta.",
          "Le doy un regalo a mi hermana (I give my sister a gift). Spanish often uses le and the name together.",
        ],
      },
      {
        title: "Where they go",
        body: [
          "Before the conjugated verb: Lo compré. No te entiendo.",
          "Or attached to the end of an infinitive: Voy a llamarte = Te voy a llamar (both mean I'm going to call you).",
        ],
      },
    ],
    drills: [
      { t: "fill", de: "¿El libro? Ya ___ compré.", en: "The book? I already bought it.", answer: "lo", options: ["lo", "la", "los", "las"], why: "libro is masculine and singular, so \"it\" is lo." },
      { t: "fill", de: "¿Las llaves? No ___ tengo.", en: "The keys? I don't have them.", answer: "las", options: ["las", "los", "la", "lo"], why: "llaves is feminine and plural, so \"them\" is las." },
      { t: "fill", de: "Mi mamá ___ llama todos los días.", en: "My mom calls me every day.", answer: "me", options: ["me", "mi", "yo", "mí"], why: "\"me\" as an object is me, placed before the verb. mi means \"my\"." },
      { t: "fill", de: "___ doy un regalo a mi hermana.", en: "I give my sister a gift.", answer: "Le", options: ["Le", "La", "Lo", "Les"], why: "\"To her\" is le. la would mean \"her\" as the thing being given." },
      { t: "fill", de: "Voy a ___ mañana.", en: "I'm going to call you tomorrow.", answer: "llamarte", options: ["llamarte", "te llamar", "llamar te", "llamarle te"], why: "With an infinitive, the little word can attach to the end: llamarte. Te voy a llamar also works." },
      { t: "build", de: "Te llamo mañana.", en: "I'll call you tomorrow.", why: "te goes right before the verb llamo. Spanish often uses the present for a near plan." },
      { t: "build", de: "No lo sé.", en: "I don't know (it).", why: "no first, then the little word lo, then the verb sé." },
    ],
    prompts: [["¿A quién llamas cuando tienes un problema?", "Who do you call when you have a problem?"]],
  },

  // ───────────────────────────── 23
  {
    id: "es-because",
    n: 23,
    title: "Because & connecting",
    titleDe: "Porque y pero",
    blurb: "porque, pero, cuando, si, que: joining ideas into longer sentences.",
    skill: "wordorder",
    words: [
      W("porque", "because"),
      W("cuando", "when (not a question)"),
      W("si", "if", undefined, { note: "No accent. sí with an accent means yes." }),
      W("que", "that"),
      W("entonces", "so, then"),
      W("aunque", "although, even though"),
      W("por eso", "that's why"),
      P("Creo que ...", "I think that ...", { noType: true }),
      P("Espero que sí.", "I hope so."),
      V("creer", "to believe, to think"),
      V("esperar", "to hope, to wait for"),
      V("viajar", "to travel", ["Me gustaría viajar a México.", "I'd like to travel to Mexico."]),
      N("el viaje", "trip", "m", "los viajes", ["¡Buen viaje!", "Have a good trip!"]),
      N("las vacaciones", "vacation", "pl", undefined, undefined, { note: "Always plural: las vacaciones." }),
    ],
    notes: [
      {
        title: "Joining words",
        body: ["Good news: in Spanish these don't change the word order. Just put them between the two ideas."],
        table: {
          head: ["", ""],
          rows: [
            ["porque", "because: Estudio porque quiero viajar."],
            ["pero", "but: Quiero ir, pero no puedo."],
            ["cuando", "when: Cuando tengo tiempo, leo."],
            ["si", "if: Si llueve, no salgo."],
            ["que", "that: Creo que es buena idea."],
            ["entonces / por eso", "so / that's why: Estoy cansada, por eso no salgo."],
            ["aunque", "although: Voy, aunque estoy cansada."],
          ],
        },
      },
      {
        title: "que is never left out",
        body: [
          "English can drop \"that\" (I think it's good). Spanish can't: Creo que es bueno.",
          "Dice que viene mañana (She says that she's coming tomorrow).",
        ],
      },
      {
        title: "No accent here",
        body: [
          "Question words lose their accent when they aren't asking: ¿Cuándo? (when?) but cuando tengo tiempo (when I have time). ¿Por qué? (why?) but porque (because).",
        ],
      },
    ],
    drills: [
      { t: "fill", de: "No voy a la fiesta ___ estoy cansada.", en: "I'm not going to the party because I'm tired.", answer: "porque", options: ["porque", "por qué", "pero", "cuando"], why: "\"Because\" is porque: one word, no accent. por qué asks why." },
      { t: "fill", de: "Quiero ir, ___ no tengo dinero.", en: "I want to go, but I don't have money.", answer: "pero", options: ["pero", "porque", "perro", "si"], why: "pero (one r) means but. perro with two r's is a dog." },
      { t: "fill", de: "___ llueve, no salgo.", en: "If it rains, I don't go out.", answer: "Si", options: ["Si", "Sí", "Que", "Porque"], why: "\"If\" is si, without an accent. Sí with an accent means yes." },
      { t: "fill", de: "Creo ___ es buena idea.", en: "I think it's a good idea.", answer: "que", options: ["que", "qué", "si", "porque"], why: "Spanish never leaves out \"that\": creo que. No accent, since it's not a question." },
      { t: "choice", q: "\"¿Por qué?\" and \"porque\" mean...", answer: "why? / because", options: ["why? / because", "because / why?", "the same thing", "for what / for"], explain: "Two words with an accent ask the question. One word without an accent gives the reason." },
      { t: "build", de: "Estudio español porque quiero viajar.", en: "I'm studying Spanish because I want to travel.", why: "Two ideas joined by porque. The word order stays normal on both sides." },
      { t: "build", de: "Cuando tengo tiempo, leo.", en: "When I have time, I read.", why: "cuando (no accent) starts the first part. Unlike German, the verb doesn't move." },
    ],
    prompts: [
      ["¿Por qué estudias español?", "Why are you studying Spanish?"],
      ["¿Adónde te gustaría viajar? ¿Por qué?", "Where would you like to travel? Why?"],
    ],
  },

  // ───────────────────────────── 24
  {
    id: "es-weather",
    n: 24,
    title: "Weather & comparing",
    titleDe: "El clima",
    blurb: "hace calor, llueve, and more ... than, better, the best.",
    words: [
      P("Hace calor.", "it's hot."),
      P("Hace frío.", "it's cold."),
      P("Hace sol.", "it's sunny."),
      P("Hace viento.", "it's windy."),
      P("Llueve.", "it's raining."),
      P("Está nublado.", "it's cloudy."),
      N("el clima", "weather, climate", "m", undefined, ["Me gusta el clima de California.", "I like California's weather."], { note: "A Greek -ma word, so it's masculine." }),
      N("la lluvia", "rain", "f"),
      N("el sol", "sun", "m"),
      N("el verano", "summer", "m"),
      N("el invierno", "winter", "m"),
      W("más ... que", "more ... than", undefined, { noType: true }),
      W("menos ... que", "less ... than", undefined, { noType: true }),
      W("tan ... como", "as ... as", undefined, { noType: true }),
      A("mejor", "better, best"),
      A("peor", "worse, worst"),
      A("mayor", "older"),
      A("menor", "younger"),
    ],
    notes: [
      {
        title: "Weather with hacer",
        body: [
          "Most weather uses hace (it makes): hace calor, hace frío, hace sol, hace viento.",
          "Rain and snow are their own verbs: llueve (it's raining), nieva (it's snowing).",
          "Some use estar: está nublado (it's cloudy).",
        ],
        tip: "For people, it's tener: Tengo calor (I'm hot), Tengo frío (I'm cold). Estoy caliente means something very different, so avoid it!",
      },
      {
        title: "Comparing",
        body: [],
        table: {
          head: ["", "Spanish", "Example"],
          rows: [
            ["more ... than", "más ... que", "Mi hermano es más alto que yo."],
            ["less ... than", "menos ... que", "El café es menos caro que el té."],
            ["as ... as", "tan ... como", "Ella es tan alta como su papá."],
          ],
        },
      },
      {
        title: "Irregular ones",
        body: [
          "bueno → mejor (better), malo → peor (worse). Never \"más bueno\".",
          "For people's ages: mayor (older), menor (younger). Mi hermana es mayor que yo.",
          "The best: el mejor, la mejor. The most: el más, la más. Es la ciudad más bonita.",
        ],
      },
    ],
    drills: [
      { t: "fill", de: "Hoy ___ mucho calor.", en: "It's really hot today.", answer: "hace", options: ["hace", "es", "está", "tiene"], why: "Weather uses hacer: hace calor (literally \"it makes heat\")." },
      { t: "fill", de: "Tengo ___, quiero un suéter.", en: "I'm cold, I want a sweater.", answer: "frío", options: ["frío", "calor", "fría", "sol"], why: "For people it's tener + frío. frío is a noun here, so it doesn't change to fría." },
      { t: "fill", de: "Mi hermano es ___ alto que yo.", en: "My brother is taller than me.", answer: "más", options: ["más", "mas", "muy", "tan"], why: "More ... than is más ... que. más with an accent means more." },
      { t: "fill", de: "Este café es ___ que el otro.", en: "This coffee is better than the other one.", answer: "mejor", options: ["mejor", "más bueno", "bueno", "más mejor"], why: "bueno has its own comparative: mejor. Spanish doesn't say más bueno." },
      { t: "fill", de: "Ella es tan alta ___ su papá.", en: "She's as tall as her dad.", answer: "como", options: ["como", "que", "cómo", "tan"], why: "As ... as is tan ... como. que goes with más and menos." },
      { t: "build", de: "Está nublado y hace viento.", en: "It's cloudy and windy.", why: "Cloudy uses estar, windy uses hacer. Join them with y." },
      { t: "build", de: "Mi hermana es mayor que yo.", en: "My sister is older than me.", why: "Older for people is mayor, with que before the other person." },
    ],
    prompts: [
      ["¿Qué tiempo hace hoy?", "What's the weather like today?"],
      ["¿Prefieres el verano o el invierno? ¿Por qué?", "Do you prefer summer or winter? Why?"],
    ],
  },
];
