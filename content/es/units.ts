import type { Unit, Word, Gender } from "../types";

/*
 * Spanish lessons 1 to 12. Mexican Spanish: ustedes (not vosotros), el carro,
 * el jugo, la computadora, and Mexican pronunciation (z and c sound like s).
 * Every fill and build question carries a `why`, shown when it's answered wrong.
 */

type Ex = [string, string];
type Opts = Partial<Word>;

const N = (de: string, en: string, gender: Gender, plural?: string, ex?: Ex, opts: Opts = {}): Word => ({
  de, en, type: "noun", gender, plural, ex, ...opts,
});
const V = (de: string, en: string, ex?: Ex, opts: Opts = {}): Word => ({ de, en, type: "verb", ex, ...opts });
const P = (de: string, en: string, opts: Opts = {}): Word => ({ de, en, type: "phrase", ...opts });
const A = (de: string, en: string, ex?: Ex, opts: Opts = {}): Word => ({ de, en, type: "adj", ex, ...opts });
const W = (de: string, en: string, ex?: Ex, opts: Opts = {}): Word => ({ de, en, type: "word", ex, ...opts });
const NUM = (de: string, en: string, opts: Opts = {}): Word => ({ de, en, type: "number", ...opts });

export const ES_UNITS_1: Unit[] = [
  // ───────────────────────────── 1
  {
    id: "es-sounds",
    n: 1,
    title: "Sounds of Spanish",
    titleDe: "La pronunciación",
    blurb: "Five clean vowels, the silent h, ñ, rolled rr, and what the accent marks do.",
    words: [
      W("hola", "hello", ["¡Hola! ¿Qué tal?", "Hi! How's it going?"], { note: "The h is always silent: OH-lah." }),
      N("la casa", "house, home", "f", "las casas", ["Mi casa es tu casa.", "My house is your house."], { note: "Spanish vowels are short and pure. a is always \"ah\": KAH-sah." }),
      N("el perro", "dog", "m", "los perros", ["El perro es grande.", "The dog is big."], { note: "rr is a rolled r, like a cat purring: PEH-rro." }),
      W("pero", "but", ["Es caro, pero es bueno.", "It's expensive, but it's good."], { note: "A single r between vowels is one quick tap, like the tt in American \"butter\". pero (but) and perro (dog) sound different." }),
      N("el año", "year", "m", "los años", ["Feliz año nuevo.", "Happy new year."], { note: "ñ sounds like the ny in \"canyon\": AH-nyo." }),
      N("la llave", "key", "f", "las llaves", undefined, { note: "ll sounds like English y: YAH-veh." }),
      N("el jugo", "juice", "m", "los jugos", ["Un jugo de naranja, por favor.", "An orange juice, please."], { note: "j is a breathy h, like a strong h in \"hot\": HOO-go." }),
      N("la gente", "people", "f", undefined, ["La gente es muy amable.", "The people are very kind."], { note: "g before e or i sounds like j: HEN-teh. la gente is singular: la gente es, not son." }),
      N("el queso", "cheese", "m", "los quesos", undefined, { note: "qu sounds like k, and the u is silent: KEH-so." }),
      N("la ciudad", "city", "f", "las ciudades", ["Es una ciudad bonita.", "It's a pretty city."], { note: "In Mexico, c before e or i sounds like s: see-oo-DAHD. The final d is very soft." }),
      N("el zapato", "shoe", "m", "los zapatos", undefined, { note: "z sounds like s in Latin America: sah-PAH-to." }),
      N("el vaso", "glass (for drinking)", "m", "los vasos", ["Un vaso de agua, por favor.", "A glass of water, please."], { note: "v sounds just like b. vaso sounds like \"BAH-so\"." }),
      A("bueno", "good", ["Es muy bueno.", "It's very good."], { note: "ue sounds like \"weh\": BWEH-no." }),
      N("la mañana", "morning", "f", "las mañanas", ["Por la mañana tomo café.", "In the morning I drink coffee."], { note: "ñ again: mah-NYAH-nah. Without la, mañana means tomorrow." }),
      W("sí", "yes", undefined, { note: "With an accent, sí means yes. Without it, si means if." }),
      W("no", "no, not"),
    ],
    notes: [
      {
        title: "Five vowels, always the same",
        body: [
          "Spanish has five vowel sounds, and each letter always makes its sound. Keep them short and clean, without the glide English adds (\"no\" is just \"no\", never \"noh-oo\").",
        ],
        table: {
          head: ["Letter", "Sounds like", "Example"],
          rows: [
            ["a", "\"ah\" in \"father\"", "la casa"],
            ["e", "\"eh\" in \"bed\"", "el queso"],
            ["i", "\"ee\" in \"see\"", "sí"],
            ["o", "\"oh\", short", "no"],
            ["u", "\"oo\" in \"food\"", "el jugo"],
          ],
        },
        tip: "Once you know these, you can read any Spanish word aloud. Spelling and sound match almost perfectly.",
      },
      {
        title: "Letters that sound different from English",
        body: ["Most consonants are close to English. These are the ones to watch:"],
        table: {
          head: ["Letter", "Sounds like", "Example"],
          rows: [
            ["h", "silent, always", "hola"],
            ["j", "a breathy h", "el jugo"],
            ["g before e, i", "a breathy h (like j)", "la gente"],
            ["ll", "y in \"yes\"", "la llave"],
            ["ñ", "ny in \"canyon\"", "el año"],
            ["qu", "k (the u is silent)", "el queso"],
            ["z, and c before e, i", "s (in Latin America)", "el zapato, la ciudad"],
            ["v", "b", "el vaso"],
            ["r between vowels", "one quick tap", "pero"],
            ["rr, or r at the start", "a rolled r", "el perro"],
          ],
        },
      },
      {
        title: "Accent marks",
        body: [
          "An accent mark (á, é, í, ó, ú) shows which syllable is stressed: ca-FÉ, a-ZÚ-car. Words without one follow simple rules, so you can always tell where the stress goes.",
          "Sometimes the accent is the only difference between two words: sí (yes) and si (if), tú (you) and tu (your), está (is) and esta (this).",
          "Typing without accents is understandable, but it's a spelling mistake. There are accent buttons under every text box.",
        ],
      },
      {
        title: "Upside-down marks",
        body: [
          "Questions and exclamations start with an upside-down mark and end with a normal one: ¿Cómo estás? ¡Qué bonito!",
          "It tells you from the very first word how to read the sentence.",
        ],
      },
    ],
    drills: [
      { t: "choice", q: "Which letter is always silent in Spanish?", answer: "h", options: ["h", "j", "r", "ñ"], explain: "Spanish h is never pronounced: hola sounds like \"OH-lah\". The breathy h sound is written with j instead." },
      { t: "choice", q: "\"jugo\" starts with a sound like...", answer: "the h in \"hot\"", options: ["the h in \"hot\"", "the j in \"jam\"", "the y in \"yes\"", "the g in \"go\""], explain: "Spanish j is a breathy h sound, made a little further back in the throat: HOO-go." },
      { t: "choice", q: "Which word has the \"ny\" sound?", answer: "año", options: ["año", "llave", "jugo", "casa"], explain: "ñ is its own letter and sounds like the ny in \"canyon\": AH-nyo." },
      { t: "choice", q: "In \"llave\", ll sounds like...", answer: "y", options: ["y", "l", "j", "sh"], explain: "In Mexico and most of Latin America, ll sounds like an English y: YAH-veh." },
      { t: "choice", q: "What's the difference between sí and si?", answer: "sí = yes, si = if", options: ["sí = yes, si = if", "sí = if, si = yes", "No difference", "sí is formal"], explain: "The accent changes the meaning. sí (with an accent) is yes, si (no accent) is if." },
      { t: "choice", q: "Which word has a rolled r?", answer: "perro", options: ["perro", "pero", "para", "caro"], explain: "rr is always rolled. A single r between vowels (pero, para, caro) is one quick tap." },
      { t: "choice", q: "A Spanish question starts with...", answer: "¿", options: ["¿", "?", "¡", "nothing"], explain: "Questions open with an upside-down ¿ and close with ?: ¿Cómo estás?" },
    ],
  },

  // ───────────────────────────── 2
  {
    id: "es-greetings",
    n: 2,
    title: "Hello & goodbye",
    titleDe: "¡Hola!",
    blurb: "Greetings for every time of day, thanks, sorry, and tú vs. usted.",
    words: [
      P("Buenos días", "good morning"),
      P("Buenas tardes", "good afternoon"),
      P("Buenas noches", "good evening, good night"),
      P("Adiós", "goodbye"),
      P("Hasta luego", "see you later"),
      P("Hasta mañana", "see you tomorrow"),
      P("Nos vemos", "see you"),
      P("Gracias", "thank you", { alts: ["Muchas gracias"] }),
      P("De nada", "you're welcome"),
      P("Por favor", "please"),
      P("Perdón", "excuse me, sorry"),
      P("Lo siento.", "I'm sorry."),
      P("¿Cómo estás?", "how are you? (informal)"),
      P("¿Cómo está usted?", "how are you? (formal)"),
      P("Bien, gracias. ¿Y tú?", "fine, thanks. And you?"),
      P("Mucho gusto", "nice to meet you"),
      P("¿Qué tal?", "how's it going?"),
      P("¿Qué onda?", "what's up? (Mexican slang)", { note: "Very casual, very Mexican. Use it with friends, not your boss." }),
      P("Bienvenidos", "welcome"),
    ],
    notes: [
      {
        title: "Greetings by time of day",
        body: ["Hola works any time. These are friendlier, and people use them all day long:"],
        table: {
          head: ["Say", "When"],
          rows: [
            ["Buenos días", "until about noon"],
            ["Buenas tardes", "from noon until it gets dark"],
            ["Buenas noches", "in the evening, both hello and good night"],
          ],
        },
        tip: "Notice buenos días but buenas tardes. día is masculine (an exception to the -a rule), tarde and noche are feminine.",
      },
      {
        title: "tú or usted?",
        body: [
          "Spanish has two ways to say \"you\". tú is for friends, family, kids and people your age. usted is for strangers, older people, customers and your boss.",
          "In Mexico usted is used more than in Spain. When in doubt, start with usted, and switch if they use tú with you.",
          "The question changes with it: ¿Cómo estás? (tú) or ¿Cómo está usted? (usted).",
        ],
      },
      {
        title: "Being polite",
        body: [
          "Gracias (thanks) and De nada (you're welcome). Por favor (please).",
          "Perdón gets someone's attention or apologizes for a small thing. Lo siento is a real \"I'm sorry\".",
          "Mucho gusto is what you say when you meet someone. They often answer Igualmente (likewise).",
        ],
      },
    ],
    drills: [
      { t: "fill", de: "___ días, señora.", en: "Good morning, ma'am.", answer: "Buenos", options: ["Buenos", "Buenas", "Bueno", "Buena"], why: "día is masculine (el día, an exception to the -a rule), so it's buenos días. tarde and noche are feminine: buenas tardes, buenas noches." },
      { t: "fill", de: "Muchas ___.", en: "Thank you very much.", answer: "gracias", options: ["gracias", "nada", "favor", "días"], why: "Muchas gracias is \"many thanks\". gracias is plural and feminine, so mucho becomes muchas." },
      { t: "fill", de: "Lo ___, no entiendo.", en: "I'm sorry, I don't understand.", answer: "siento", options: ["siento", "gusto", "favor", "nada"], why: "Lo siento means \"I'm sorry\", literally \"I feel it\"." },
      { t: "choice", q: "Someone says \"Gracias.\" You answer...", answer: "De nada.", options: ["De nada.", "Por favor.", "Lo siento.", "Adiós."], explain: "De nada (\"of nothing\") is the standard \"you're welcome\"." },
      { t: "choice", q: "It's 9 pm and you arrive at a party. You say...", answer: "Buenas noches.", options: ["Buenas noches.", "Buenos días.", "Buenas tardes.", "Hasta mañana."], explain: "Buenas noches works as both hello and good night once it's dark." },
      { t: "choice", q: "Which one would you say to your boss?", answer: "¿Cómo está usted?", options: ["¿Cómo está usted?", "¿Cómo estás?", "¿Qué onda?", "¿Y tú?"], explain: "usted is the polite \"you\", used with bosses, strangers and older people. Its verb form is está." },
      { t: "build", de: "Bien, gracias. ¿Y tú?", en: "Fine, thanks. And you?", why: "Answer first (Bien, gracias), then bounce the question back with ¿Y tú?, just like in English." },
      { t: "build", de: "Buenas tardes, ¿cómo está usted?", en: "Good afternoon, how are you? (formal)", why: "The greeting comes first. In the question, the verb (está) comes before usted, just like \"how are you\"." },
    ],
    prompts: [
      ["¿Cómo estás?", "How are you?"],
      ["¿Qué tal tu día?", "How's your day going?"],
    ],
  },

  // ───────────────────────────── 3
  {
    id: "es-intro",
    n: 3,
    title: "Introducing yourself",
    titleDe: "Me presento",
    blurb: "Your name, where you're from, where you live, and the languages you speak.",
    skill: "verbs",
    words: [
      P("Me llamo ...", "my name is ...", { noType: true }),
      P("¿Cómo te llamas?", "what's your name?"),
      P("Soy de ...", "I'm from ...", { noType: true }),
      P("¿De dónde eres?", "where are you from?"),
      P("Vivo en ...", "I live in ...", { noType: true }),
      P("¿Dónde vives?", "where do you live?"),
      V("hablar", "to speak", ["Hablo inglés.", "I speak English."]),
      V("vivir", "to live", ["Vivimos en California.", "We live in California."]),
      N("el inglés", "English (the language)", "m", undefined, undefined, { note: "Languages are written in lowercase in Spanish." }),
      N("el español", "Spanish (the language)", "m"),
      W("un poco", "a little", ["Hablo un poco de español.", "I speak a little Spanish."]),
      A("encantado", "nice to meet you (said by a man)"),
      A("encantada", "nice to meet you (said by a woman)"),
      W("también", "also, too", ["Yo también.", "Me too."]),
      P("¿Y tú?", "and you?"),
      N("el nombre", "name", "m", "los nombres", ["¿Cuál es tu nombre?", "What's your name?"]),
      W("y", "and"),
    ],
    notes: [
      {
        title: "The ending says who",
        body: [
          "Spanish verbs change their ending for each person, and the ending is so clear that the word for \"I\" or \"you\" is usually left out. Hablo inglés means \"I speak English\" all by itself.",
        ],
        table: {
          head: ["", "hablar (to speak)", "vivir (to live)"],
          rows: [
            ["yo (I)", "hablo", "vivo"],
            ["tú (you)", "hablas", "vives"],
            ["él, ella, usted", "habla", "vive"],
          ],
        },
        tip: "yo always ends in -o: hablo, vivo, trabajo. That one rule gets you far.",
      },
      {
        title: "Saying your name",
        body: [
          "Me llamo Kas literally means \"I call myself Kas\". You can also say Soy Kas (I'm Kas) or Mi nombre es Kas.",
          "To ask: ¿Cómo te llamas? (informal) or ¿Cómo se llama usted? (formal).",
          "When you meet someone: Mucho gusto, or Encantado (if you're a man) / Encantada (if you're a woman).",
        ],
      },
      {
        title: "Where you're from and where you live",
        body: [
          "Soy de Estados Unidos (I'm from the United States). ¿De dónde eres? (Where are you from?)",
          "Vivo en Tustin (I live in Tustin). ¿Dónde vives? (Where do you live?)",
          "Nationalities and languages are lowercase: Soy estadounidense. Hablo inglés y un poco de español.",
        ],
      },
    ],
    drills: [
      { t: "fill", de: "Yo ___ en California.", en: "I live in California.", answer: "vivo", options: ["vivo", "vives", "vive", "vivir"], why: "With yo (I), the verb ends in -o: vivo. vives is for tú, vive for él, ella and usted." },
      { t: "fill", de: "¿Tú ___ español?", en: "Do you speak Spanish?", answer: "hablas", options: ["hablas", "hablo", "habla", "hablar"], why: "With tú, -ar verbs end in -as: hablas." },
      { t: "fill", de: "Me ___ Kas.", en: "My name is Kas.", answer: "llamo", options: ["llamo", "llamas", "nombre", "soy"], why: "Me llamo means \"I call myself\". The yo form of llamar ends in -o." },
      { t: "fill", de: "Mi amiga ___ en Texas.", en: "My friend lives in Texas.", answer: "vive", options: ["vive", "vivo", "vives", "viven"], why: "Mi amiga is one person (she), so it takes the él/ella form: vive." },
      { t: "choice", q: "\"Encantada\" is said by...", answer: "a woman", options: ["a woman", "a man", "anyone", "only to women"], explain: "Encantada ends in -a because the speaker is a woman. A man says encantado." },
      { t: "choice", q: "\"Hablo inglés.\" Who speaks English?", answer: "I do", options: ["I do", "you do", "he does", "we do"], explain: "The -o ending means yo (I), so the word yo isn't needed." },
      { t: "build", de: "Soy de Estados Unidos.", en: "I'm from the United States.", why: "Soy de + place = I'm from. soy is \"I am\", de is \"from\"." },
      { t: "build", de: "Hablo un poco de español.", en: "I speak a little Spanish.", why: "un poco de means \"a little (of)\". Languages are lowercase: español." },
    ],
    prompts: [
      ["¿Cómo te llamas?", "What's your name?"],
      ["¿De dónde eres?", "Where are you from?"],
      ["¿Dónde vives?", "Where do you live?"],
    ],
  },

  // ───────────────────────────── 4
  {
    id: "es-numbers",
    n: 4,
    title: "Numbers",
    titleDe: "Los números",
    blurb: "0 to 100, how numbers are built, and saying your age.",
    skill: "numbers",
    words: [
      NUM("uno", "1", { note: "Before a noun it shortens: un año, un perro." }),
      NUM("dos", "2"),
      NUM("tres", "3"),
      NUM("cuatro", "4"),
      NUM("cinco", "5"),
      NUM("seis", "6"),
      NUM("siete", "7"),
      NUM("ocho", "8"),
      NUM("nueve", "9"),
      NUM("diez", "10"),
      NUM("once", "11"),
      NUM("doce", "12"),
      NUM("quince", "15"),
      NUM("veinte", "20"),
      NUM("treinta", "30"),
      NUM("cien", "100"),
      P("¿Cuántos años tienes?", "how old are you?"),
      P("Tengo ... años.", "I'm ... years old.", { noType: true }),
    ],
    notes: [
      {
        title: "0 to 20",
        body: ["These have to be learned one by one. 16 to 19 are \"ten and six\" squeezed into one word."],
        table: {
          head: ["", "", "", ""],
          rows: [
            ["0 cero", "1 uno", "2 dos", "3 tres"],
            ["4 cuatro", "5 cinco", "6 seis", "7 siete"],
            ["8 ocho", "9 nueve", "10 diez", "11 once"],
            ["12 doce", "13 trece", "14 catorce", "15 quince"],
            ["16 dieciséis", "17 diecisiete", "18 dieciocho", "19 diecinueve"],
          ],
        },
      },
      {
        title: "21 and up",
        body: [
          "21 to 29 are one word: veintiuno, veintidós, veintitrés, veinticuatro...",
          "From 31 on it's tens + y + ones, as separate words: treinta y uno, cuarenta y siete, noventa y nueve.",
          "Tens: 30 treinta, 40 cuarenta, 50 cincuenta, 60 sesenta, 70 setenta, 80 ochenta, 90 noventa.",
          "100 is cien. 101 and up use ciento: ciento uno, ciento cincuenta. 1,000 is mil.",
        ],
      },
      {
        title: "Your age",
        body: [
          "Spanish uses tener (to have) for age: Tengo treinta años, literally \"I have thirty years\".",
          "Never say \"soy treinta\". To ask: ¿Cuántos años tienes?",
        ],
        tip: "Watch the ñ: años means years. Without the tilde it's a very different (rude) word.",
      },
    ],
    drills: [
      { t: "fill", de: "Tengo treinta ___.", en: "I'm thirty years old.", answer: "años", options: ["años", "anos", "año", "días"], why: "Age is tener + number + años (years). It's plural, and it needs the ñ." },
      { t: "fill", de: "¿Cuántos años ___?", en: "How old are you?", answer: "tienes", options: ["tienes", "eres", "estás", "tengo"], why: "Age uses tener, and with tú the form is tienes. Literally \"how many years do you have?\"" },
      { t: "choice", q: "47 in Spanish is...", answer: "cuarenta y siete", options: ["cuarenta y siete", "cuarentisiete", "siete y cuarenta", "cuatro siete"], explain: "From 31 on, numbers are tens + y + ones as separate words: cuarenta y siete." },
      { t: "choice", q: "\"veintidós\" is...", answer: "22", options: ["22", "12", "20", "32"], explain: "veinti- + dos = 22. 21 to 29 are written as one word." },
      { t: "choice", q: "How do you say \"I'm 25\"?", answer: "Tengo veinticinco años.", options: ["Tengo veinticinco años.", "Soy veinticinco años.", "Estoy veinticinco.", "Tengo veinticinco."], explain: "Spanish says age with tener: \"I have 25 years\". años is usually included." },
      { t: "choice", q: "100 in Spanish is...", answer: "cien", options: ["cien", "ciento", "mil", "diez"], explain: "Exactly 100 is cien. ciento is only used for 101 to 199: ciento uno." },
      { t: "build", de: "Mi hermano tiene veinte años.", en: "My brother is twenty.", why: "Age with tener: tiene (he has) + veinte años." },
    ],
    prompts: [["¿Cuántos años tienes?", "How old are you?"]],
  },

  // ───────────────────────────── 5
  {
    id: "es-ser",
    n: 5,
    title: "I am, you are (ser)",
    titleDe: "El verbo ser",
    blurb: "ser for who and what you are: names, jobs, where you're from, what people are like.",
    skill: "verbs",
    words: [
      V("ser", "to be (who or what)", ["Soy enfermera.", "I'm a nurse."]),
      N("el maestro", "teacher (man)", "m", "los maestros"),
      N("la maestra", "teacher (woman)", "f", "las maestras"),
      N("el doctor", "doctor (man)", "m", "los doctores"),
      N("la doctora", "doctor (woman)", "f", "las doctoras"),
      N("el estudiante", "student (man)", "m", "los estudiantes", undefined, { note: "For a woman it's la estudiante. Only the article changes." }),
      N("el amigo", "friend (man)", "m", "los amigos"),
      N("la amiga", "friend (woman)", "f", "las amigas"),
      A("mexicano", "Mexican", ["Mi abuela es mexicana.", "My grandma is Mexican."]),
      A("estadounidense", "American (from the US)", undefined, { note: "Same form for men and women." }),
      A("alto", "tall"),
      A("bajo", "short (height)"),
      A("simpático", "nice, friendly", ["Tu hermano es muy simpático.", "Your brother is really nice."]),
      A("inteligente", "smart"),
      A("divertido", "fun, funny"),
      W("muy", "very"),
    ],
    notes: [
      {
        title: "ser: to be (who and what)",
        body: ["ser is irregular, so learn the set:"],
        table: {
          head: ["", "ser", ""],
          rows: [
            ["yo", "soy", "I am"],
            ["tú", "eres", "you are"],
            ["él, ella, usted", "es", "he, she is; you (formal) are"],
            ["nosotros", "somos", "we are"],
            ["ellos, ellas, ustedes", "son", "they are; you all are"],
          ],
        },
        tip: "ustedes (you all) always uses the ellos form: Ustedes son muy simpáticos. In Spain there's also vosotros (sois), but you won't need it in Mexico.",
      },
      {
        title: "No \"a\" before jobs",
        body: [
          "Spanish leaves out un or una before a job, religion or nationality: Soy maestra (I'm a teacher), Es doctor (He's a doctor).",
          "Add it back only with a description: Es una doctora muy buena.",
        ],
      },
      {
        title: "Describing words match the person",
        body: [
          "Adjectives ending in -o change to -a for a woman, and add -s for more than one:",
          "Él es alto. Ella es alta. Ellos son altos. Ellas son altas.",
          "Adjectives ending in -e or a consonant don't change for gender: Él es inteligente, ella es inteligente.",
        ],
      },
    ],
    drills: [
      { t: "fill", de: "Nosotros ___ amigos.", en: "We are friends.", answer: "somos", options: ["somos", "son", "soy", "es"], why: "ser with nosotros is somos. son is for ellos and ustedes." },
      { t: "fill", de: "Ella es muy ___.", en: "She's very nice.", answer: "simpática", options: ["simpática", "simpático", "simpáticos", "simpáticas"], why: "Describing words match the person. Ella is one woman, so simpático becomes simpática." },
      { t: "fill", de: "Yo ___ de California.", en: "I'm from California.", answer: "soy", options: ["soy", "es", "eres", "estoy"], why: "Where you're from is part of who you are, so it's ser. With yo: soy." },
      { t: "fill", de: "¿Tú ___ mexicana?", en: "Are you Mexican?", answer: "eres", options: ["eres", "es", "soy", "son"], why: "ser with tú is eres." },
      { t: "choice", q: "\"I'm a teacher\" (said by a woman) is...", answer: "Soy maestra.", options: ["Soy maestra.", "Soy una maestra.", "Estoy maestra.", "Es maestra."], explain: "Jobs use ser, and Spanish drops una before a job: Soy maestra." },
      { t: "build", de: "Mi amiga es muy divertida.", en: "My friend is really fun.", why: "Subject, then es, then the description. divertido becomes divertida to match mi amiga." },
      { t: "build", de: "Ellos son muy altos.", en: "They're very tall.", why: "Ellos takes son, and alto becomes altos to match more than one person." },
    ],
    prompts: [
      ["¿Cómo eres?", "What are you like?"],
      ["¿Cómo es tu mejor amiga?", "What is your best friend like?"],
    ],
  },

  // ───────────────────────────── 6
  {
    id: "es-articles",
    n: 6,
    title: "el, la, los, las",
    titleDe: "Los artículos",
    blurb: "Masculine and feminine, a and the, plurals, and the exceptions worth knowing.",
    skill: "cases",
    words: [
      N("el libro", "book", "m", "los libros", ["El libro es interesante.", "The book is interesting."]),
      N("la mesa", "table", "f", "las mesas"),
      N("el carro", "car", "m", "los carros", ["Mi carro es viejo.", "My car is old."], { note: "In Spain it's el coche, but in Mexico it's el carro." }),
      N("la puerta", "door", "f", "las puertas"),
      N("la ventana", "window", "f", "las ventanas"),
      N("el día", "day", "m", "los días", undefined, { note: "An exception: it ends in -a but it's masculine. Buenos días." }),
      N("la mano", "hand", "f", "las manos", undefined, { note: "An exception: it ends in -o but it's feminine." }),
      N("el problema", "problem", "m", "los problemas", ["No hay problema.", "No problem."], { note: "Words in -ma that came from Greek are masculine: el problema, el sistema, el tema." }),
      N("la canción", "song", "f", "las canciones", undefined, { note: "-ción words are always feminine. The plural drops the accent: canciones." }),
      N("la universidad", "university", "f", "las universidades", undefined, { note: "-dad words are always feminine." }),
      N("el agua", "water", "f", undefined, ["El agua está fría.", "The water is cold."], { note: "Feminine, but it uses el because it starts with a stressed a. Describing words stay feminine: el agua fría." }),
      N("el lápiz", "pencil", "m", "los lápices", undefined, { note: "z becomes c in the plural: lápices." }),
      N("la foto", "photo", "f", "las fotos", undefined, { note: "Short for la fotografía, so it stays feminine." }),
      N("el mapa", "map", "m", "los mapas", undefined, { note: "Another -a word that's masculine." }),
      N("el teléfono", "phone", "m", "los teléfonos"),
      N("la computadora", "computer", "f", "las computadoras", undefined, { note: "In Spain it's el ordenador, but in Mexico it's la computadora." }),
    ],
    notes: [
      {
        title: "Masculine and feminine",
        body: [
          "Every Spanish noun is masculine or feminine. There's no \"it\" gender.",
          "The ending usually tells you: -o is masculine (el libro), -a is feminine (la mesa). -ción, -sión and -dad are feminine too.",
          "Endings in -e or a consonant don't follow a rule (el café, la noche), so learn those with their article.",
        ],
        tip: "The Genders page under Learn has every pattern and the common exceptions.",
      },
      {
        title: "\"the\" and \"a\"",
        body: ["Articles change for gender and for number:"],
        table: {
          head: ["", "masculine", "feminine"],
          rows: [
            ["the (one)", "el libro", "la mesa"],
            ["the (more)", "los libros", "las mesas"],
            ["a, an", "un libro", "una mesa"],
            ["some", "unos libros", "unas mesas"],
          ],
        },
      },
      {
        title: "Plurals",
        body: [
          "After a vowel, add -s: libro → libros, mesa → mesas.",
          "After a consonant, add -es: ciudad → ciudades, canción → canciones.",
          "z becomes c: lápiz → lápices.",
          "A mixed group is masculine: los niños can mean boys, or boys and girls.",
        ],
      },
      {
        title: "el agua",
        body: [
          "A few feminine words start with a stressed a sound. In the singular they use el, so the two a sounds don't run together: el agua, el hambre.",
          "They're still feminine: el agua fría (cold water), las aguas (the waters).",
        ],
      },
    ],
    drills: [
      { t: "fill", de: "___ libro es interesante.", en: "The book is interesting.", answer: "El", options: ["El", "La", "Los", "Las"], why: "libro ends in -o and is masculine and singular, so it's el." },
      { t: "fill", de: "Tengo ___ computadora nueva.", en: "I have a new computer.", answer: "una", options: ["una", "un", "unos", "unas"], why: "computadora is feminine and singular, so \"a\" is una." },
      { t: "fill", de: "___ ventanas están abiertas.", en: "The windows are open.", answer: "Las", options: ["Las", "La", "Los", "El"], why: "ventana is feminine, and here there's more than one (ventanas), so it's las." },
      { t: "fill", de: "Hay ___ problema.", en: "There's a problem.", answer: "un", options: ["un", "una", "el", "unos"], why: "problema ends in -a but it's masculine (a Greek -ma word), so \"a\" is un." },
      { t: "choice", q: "Which one is right?", answer: "el día", options: ["el día", "la día"], explain: "día is one of the few -a words that's masculine. That's why it's buenos días." },
      { t: "choice", q: "The plural of \"la canción\" is...", answer: "las canciones", options: ["las canciones", "las canciónes", "los canciones", "las cancións"], explain: "After a consonant add -es. The accent disappears because the stress now falls naturally on -o-: can-cio-nes." },
      { t: "build", de: "La computadora es nueva.", en: "The computer is new.", why: "la with a feminine noun, and nuevo becomes nueva to match it." },
      { t: "build", de: "Los carros son caros.", en: "The cars are expensive.", why: "Masculine plural: los carros, and caro becomes caros to match." },
    ],
  },

  // ───────────────────────────── 7
  {
    id: "es-family",
    n: 7,
    title: "Family",
    titleDe: "La familia",
    blurb: "Family words, tener (to have), and my, your, his, our.",
    skill: "verbs",
    words: [
      N("la familia", "family", "f", "las familias"),
      N("la madre", "mother", "f", "las madres"),
      N("el padre", "father", "m", "los padres"),
      N("los padres", "parents", "pl", undefined, ["Mis padres viven en Texas.", "My parents live in Texas."]),
      N("la mamá", "mom", "f", "las mamás", undefined, { note: "Very common in Mexico, at any age." }),
      N("el papá", "dad", "m", "los papás"),
      N("el hermano", "brother", "m", "los hermanos", undefined, { note: "los hermanos can mean brothers, or brothers and sisters." }),
      N("la hermana", "sister", "f", "las hermanas"),
      N("el hijo", "son", "m", "los hijos", undefined, { note: "los hijos can mean sons, or children in general." }),
      N("la hija", "daughter", "f", "las hijas"),
      N("el abuelo", "grandfather", "m", "los abuelos"),
      N("la abuela", "grandmother", "f", "las abuelas"),
      N("el tío", "uncle", "m", "los tíos"),
      N("la tía", "aunt", "f", "las tías"),
      N("el primo", "cousin (man)", "m", "los primos"),
      N("la prima", "cousin (woman)", "f", "las primas"),
      N("el esposo", "husband", "m", "los esposos"),
      N("la esposa", "wife", "f", "las esposas"),
      N("el niño", "boy, child", "m", "los niños", undefined, { note: "los niños can mean boys, or children in general." }),
      N("la niña", "girl", "f", "las niñas"),
      N("el gato", "cat", "m", "los gatos", ["Mi gato es negro.", "My cat is black."]),
      N("la mascota", "pet", "f", "las mascotas"),
      V("tener", "to have", ["Tengo dos hermanos.", "I have two brothers."]),
    ],
    notes: [
      {
        title: "tener (to have)",
        body: ["tener is irregular: the yo form is tengo, and the e changes to ie in most forms."],
        table: {
          head: ["", "tener"],
          rows: [
            ["yo", "tengo"],
            ["tú", "tienes"],
            ["él, ella, usted", "tiene"],
            ["nosotros", "tenemos"],
            ["ellos, ellas, ustedes", "tienen"],
          ],
        },
        tip: "You already know it from age: Tengo treinta años.",
      },
      {
        title: "my, your, his, our",
        body: ["These match the thing owned, not the owner. They add -s for more than one thing:"],
        table: {
          head: ["", "one thing", "more than one"],
          rows: [
            ["my", "mi hermano", "mis hermanos"],
            ["your (tú)", "tu hermano", "tus hermanos"],
            ["his, her, their, your (usted)", "su hermano", "sus hermanos"],
            ["our", "nuestro hermano, nuestra hermana", "nuestros, nuestras"],
          ],
        },
        tip: "tu (your) has no accent. tú with an accent means \"you\".",
      },
      {
        title: "Mixed groups are masculine",
        body: [
          "los padres = parents, los hermanos = siblings, los abuelos = grandparents, los tíos = aunts and uncles.",
          "Use the feminine plural only when everyone is female: mis hermanas (my sisters).",
        ],
      },
    ],
    drills: [
      { t: "fill", de: "Yo ___ una hermana.", en: "I have a sister.", answer: "tengo", options: ["tengo", "tienes", "tiene", "tener"], why: "tener with yo is tengo, which is irregular (not \"teno\")." },
      { t: "fill", de: "¿Tú ___ hijos?", en: "Do you have kids?", answer: "tienes", options: ["tienes", "tenes", "tiene", "tengo"], why: "tener with tú is tienes. The e changes to ie." },
      { t: "fill", de: "___ padres viven en Texas.", en: "My parents live in Texas.", answer: "Mis", options: ["Mis", "Mi", "Tu", "Su"], why: "padres is plural, so \"my\" is mis (with an -s)." },
      { t: "fill", de: "Mi hermano ___ dos perros.", en: "My brother has two dogs.", answer: "tiene", options: ["tiene", "tengo", "tienen", "tienes"], why: "Mi hermano is one person (he), so tener becomes tiene." },
      { t: "choice", q: "\"los hermanos\" can mean...", answer: "brothers, or brothers and sisters", options: ["brothers, or brothers and sisters", "only sisters", "cousins", "parents"], explain: "A mixed group of men and women uses the masculine plural." },
      { t: "build", de: "Tengo un perro y un gato.", en: "I have a dog and a cat.", why: "tengo (I have), then each animal with un, since perro and gato are masculine." },
      { t: "build", de: "Mis abuelos viven en México.", en: "My grandparents live in Mexico.", why: "mis because abuelos is plural, and vivir with ellos is viven." },
    ],
    prompts: [
      ["¿Tienes hermanos?", "Do you have siblings?"],
      ["¿Cómo es tu familia?", "What is your family like?"],
      ["¿Tienes mascotas?", "Do you have pets?"],
    ],
  },

  // ───────────────────────────── 8
  {
    id: "es-verbs",
    n: 8,
    title: "Everyday verbs",
    titleDe: "Los verbos regulares",
    blurb: "The three verb families (-ar, -er, -ir) and the endings for every person.",
    skill: "verbs",
    words: [
      V("trabajar", "to work", ["Trabajo en un hospital.", "I work in a hospital."]),
      V("estudiar", "to study"),
      V("comer", "to eat", ["¿Comemos juntos?", "Shall we eat together?"]),
      V("beber", "to drink"),
      V("escribir", "to write"),
      V("leer", "to read"),
      V("cocinar", "to cook"),
      V("escuchar", "to listen to", ["Escucho música en el carro.", "I listen to music in the car."]),
      V("comprar", "to buy"),
      V("aprender", "to learn", ["Aprendo español.", "I'm learning Spanish."]),
      V("caminar", "to walk"),
      V("abrir", "to open"),
      N("la música", "music", "f"),
      N("el trabajo", "work, job", "m", "los trabajos"),
      N("la escuela", "school", "f", "las escuelas"),
      W("mucho", "a lot"),
      W("todos los días", "every day"),
    ],
    notes: [
      {
        title: "Three verb families",
        body: [
          "Every Spanish verb ends in -ar, -er or -ir. Drop that ending and add the one for the person:",
        ],
        table: {
          head: ["", "hablar", "comer", "vivir"],
          rows: [
            ["yo", "hablo", "como", "vivo"],
            ["tú", "hablas", "comes", "vives"],
            ["él, ella, usted", "habla", "come", "vive"],
            ["nosotros", "hablamos", "comemos", "vivimos"],
            ["ellos, ustedes", "hablan", "comen", "viven"],
          ],
        },
        tip: "-er and -ir are the same except for nosotros: comemos, vivimos.",
      },
      {
        title: "One tense, two meanings",
        body: [
          "Trabajo means both \"I work\" and \"I'm working\". Spanish uses this simple present for most things happening now or in general.",
          "Questions are made with your voice alone: ¿Trabajas hoy? (Are you working today?)",
        ],
      },
    ],
    drills: [
      { t: "fill", de: "Nosotros ___ en un hospital.", en: "We work in a hospital.", answer: "trabajamos", options: ["trabajamos", "trabajo", "trabajan", "trabajas"], why: "nosotros takes -amos with -ar verbs: trabajamos." },
      { t: "fill", de: "Ella ___ mucho.", en: "She reads a lot.", answer: "lee", options: ["lee", "leo", "lees", "leen"], why: "leer is an -er verb. For ella, drop -er and add -e: lee." },
      { t: "fill", de: "¿Ustedes ___ carne?", en: "Do you all eat meat?", answer: "comen", options: ["comen", "come", "comes", "comemos"], why: "ustedes (you all) always uses the ellos form: comen." },
      { t: "fill", de: "Yo ___ música todos los días.", en: "I listen to music every day.", answer: "escucho", options: ["escucho", "escuchas", "escucha", "escuchar"], why: "yo always ends in -o: escucho." },
      { t: "fill", de: "Tú ___ muy bien.", en: "You cook really well.", answer: "cocinas", options: ["cocinas", "cocina", "cocino", "cocinan"], why: "-ar verbs end in -as with tú: cocinas." },
      { t: "build", de: "Mi hermana estudia en la universidad.", en: "My sister studies at the university.", why: "Subject, verb (estudia, the ella form), then where." },
      { t: "build", de: "Escribimos muchos correos.", en: "We write a lot of emails.", why: "escribir with nosotros is escribimos (-ir verbs use -imos). muchos matches correos." },
    ],
    prompts: [
      ["¿Dónde trabajas?", "Where do you work?"],
      ["¿Qué haces todos los días?", "What do you do every day?"],
    ],
  },

  // ───────────────────────────── 9
  {
    id: "es-food",
    n: 9,
    title: "Food & drink",
    titleDe: "La comida",
    blurb: "Ordering, meals, I'm hungry, and asking for the check.",
    words: [
      N("la comida", "food; the main midday meal", "f", "las comidas", undefined, { note: "In Mexico la comida is also the big meal of the day, eaten around 2 or 3 pm." }),
      N("el desayuno", "breakfast", "m"),
      N("la cena", "dinner", "f"),
      N("el pan", "bread", "m"),
      N("el pollo", "chicken", "m", undefined, ["Quiero pollo con arroz.", "I want chicken with rice."]),
      N("el arroz", "rice", "m"),
      N("los frijoles", "beans", "pl"),
      N("la tortilla", "tortilla", "f", "las tortillas", undefined, { note: "In Mexico, a corn or flour tortilla. In Spain the same word means a potato omelet." }),
      N("el café", "coffee", "m"),
      N("la leche", "milk", "f"),
      N("la fruta", "fruit", "f", "las frutas"),
      N("la cuenta", "the check, the bill", "f"),
      P("Quiero ...", "I want ...", { noType: true }),
      P("Me gustaría ...", "I would like ...", { noType: true }),
      P("La cuenta, por favor.", "the check, please."),
      V("tomar", "to take, to drink", ["¿Qué quieres tomar?", "What do you want to drink?"]),
      V("pagar", "to pay"),
      A("rico", "delicious, tasty", ["¡Qué rico!", "How delicious!"]),
      P("Tengo hambre.", "I'm hungry."),
      P("Tengo sed.", "I'm thirsty."),
    ],
    notes: [
      {
        title: "Ordering",
        body: [
          "Quiero un café (I want a coffee) is normal and not rude in Mexico, especially with por favor.",
          "Me gustaría un café (I would like a coffee) is extra polite.",
          "At a counter you can also just say the thing: Un café, por favor.",
          "To get the check: La cuenta, por favor.",
        ],
      },
      {
        title: "Hungry and thirsty",
        body: [
          "Spanish says you have hunger: Tengo hambre (I'm hungry), Tengo sed (I'm thirsty).",
          "Very hungry is Tengo mucha hambre, since hambre is feminine (it takes el only because of the stressed a).",
        ],
      },
      {
        title: "tomar",
        body: [
          "tomar means \"to take\", and with drinks it means \"to drink\": ¿Qué vas a tomar? (What are you having?)",
          "beber also means to drink, but tomar is what you'll hear most in Mexico.",
        ],
      },
    ],
    drills: [
      { t: "fill", de: "Tengo ___, quiero comer.", en: "I'm hungry, I want to eat.", answer: "hambre", options: ["hambre", "sed", "frío", "años"], why: "Hunger uses tener + hambre: Tengo hambre. sed is thirst." },
      { t: "fill", de: "Me ___ un café, por favor.", en: "I'd like a coffee, please.", answer: "gustaría", options: ["gustaría", "gusta", "quiero", "tomo"], why: "Me gustaría means \"I would like\", the polite way to order." },
      { t: "fill", de: "¿Qué ___ ustedes?", en: "What are you all having (to drink)?", answer: "toman", options: ["toman", "tomas", "tomamos", "tomo"], why: "ustedes uses the ellos form: toman." },
      { t: "choice", q: "\"¡Qué rico!\" means...", answer: "How delicious!", options: ["How delicious!", "How rich!", "What a price!", "What's this?"], explain: "With food, rico means tasty. ¡Qué rico! is something you'll hear at every Mexican table." },
      { t: "build", de: "La cuenta, por favor.", en: "The check, please.", why: "The thing you want, then por favor." },
      { t: "build", de: "Quiero pollo con arroz.", en: "I want chicken with rice.", why: "Quiero (I want) + what you want. con means with." },
      { t: "build", de: "Tengo mucha sed.", en: "I'm really thirsty.", why: "tener + sed. sed is feminine, so mucho becomes mucha." },
    ],
    prompts: [
      ["¿Qué comes en el desayuno?", "What do you eat for breakfast?"],
      ["¿Cuál es tu comida favorita?", "What's your favorite food?"],
    ],
  },

  // ───────────────────────────── 10
  {
    id: "es-time",
    n: 10,
    title: "Days & time",
    titleDe: "El tiempo y los días",
    blurb: "Days of the week, telling time, and on Monday vs. on Mondays.",
    skill: "numbers",
    words: [
      N("el lunes", "Monday", "m"),
      N("el martes", "Tuesday", "m"),
      N("el miércoles", "Wednesday", "m"),
      N("el jueves", "Thursday", "m"),
      N("el viernes", "Friday", "m"),
      N("el sábado", "Saturday", "m"),
      N("el domingo", "Sunday", "m"),
      N("la noche", "night", "f", "las noches", ["Trabajo por la noche.", "I work at night."]),
      N("la semana", "week", "f", "las semanas"),
      N("el fin de semana", "weekend", "m"),
      N("la hora", "hour, time (on the clock)", "f", "las horas"),
      P("¿Qué hora es?", "what time is it?"),
      P("Es la una.", "it's one o'clock."),
      P("Son las tres.", "it's three o'clock."),
      W("y media", "thirty (half past)", undefined, { noType: true }),
      W("y cuarto", "fifteen (quarter past)", undefined, { noType: true }),
      W("menos cuarto", "quarter to", undefined, { noType: true }),
      W("hoy", "today"),
      W("mañana", "tomorrow"),
      W("ayer", "yesterday"),
      W("temprano", "early"),
      W("tarde", "late"),
      V("terminar", "to finish"),
    ],
    notes: [
      {
        title: "Days of the week",
        body: [
          "Days are lowercase and masculine. Most end in -es: lunes, martes, miércoles, jueves, viernes. Then sábado and domingo.",
          "el lunes means \"on Monday\" (no extra word needed): Trabajo el lunes.",
          "los lunes means \"on Mondays\", every week: Trabajo los lunes.",
        ],
      },
      {
        title: "Telling time",
        body: ["Use es for one o'clock and son for everything else, because it's \"they are the three (hours)\":"],
        table: {
          head: ["Time", "Spanish"],
          rows: [
            ["1:00", "Es la una."],
            ["3:00", "Son las tres."],
            ["3:15", "Son las tres y cuarto."],
            ["3:30", "Son las tres y media."],
            ["3:45", "Son las cuatro menos cuarto."],
            ["3:50", "Son las cuatro menos diez."],
          ],
        },
        tip: "In Mexico you'll also hear cuarto para las cuatro (a quarter to four).",
      },
      {
        title: "At what time?",
        body: [
          "\"At\" a time is a: a las ocho (at eight), a la una (at one).",
          "¿A qué hora...? asks at what time: ¿A qué hora empieza? (What time does it start?)",
          "de la mañana, de la tarde, de la noche work like am and pm: a las ocho de la noche.",
        ],
      },
    ],
    drills: [
      { t: "fill", de: "___ la una.", en: "It's one o'clock.", answer: "Es", options: ["Es", "Son", "Está", "Hay"], why: "One o'clock is singular: Es la una. Every other hour is plural: Son las dos, son las tres." },
      { t: "fill", de: "Son las tres y ___.", en: "It's 3:30.", answer: "media", options: ["media", "medio", "cuarto", "treinta"], why: "Half past is y media (half). y treinta also exists, but y media is what people say." },
      { t: "fill", de: "Trabajo ___ lunes.", en: "I work on Mondays.", answer: "los", options: ["los", "el", "en", "a"], why: "Every Monday is los lunes. el lunes would be one specific Monday. Spanish doesn't use en with days." },
      { t: "fill", de: "La clase empieza ___ las ocho.", en: "The class starts at eight.", answer: "a", options: ["a", "en", "de", "por"], why: "\"At\" a time is a: a las ocho." },
      { t: "choice", q: "Days of the week in Spanish are written...", answer: "in lowercase", options: ["in lowercase", "with a capital letter", "with an accent", "in the plural"], explain: "Days and months are lowercase in Spanish: lunes, enero." },
      { t: "build", de: "Hoy es viernes.", en: "Today is Friday.", why: "Hoy (today) + es + the day, with no article." },
      { t: "build", de: "¿A qué hora es la fiesta?", en: "What time is the party?", why: "¿A qué hora...? (at what time) comes first, then the verb and the event." },
    ],
    prompts: [
      ["¿Qué haces los sábados?", "What do you do on Saturdays?"],
      ["¿A qué hora empiezas a trabajar?", "What time do you start work?"],
    ],
  },

  // ───────────────────────────── 11
  {
    id: "es-estar",
    n: 11,
    title: "How & where (estar)",
    titleDe: "El verbo estar",
    blurb: "estar for feelings and locations, and when to use ser or estar.",
    skill: "verbs",
    words: [
      V("estar", "to be (how or where)", ["Estoy cansada.", "I'm tired."]),
      A("cansado", "tired"),
      A("feliz", "happy", undefined, { note: "Same for men and women. Plural: felices." }),
      A("triste", "sad"),
      A("enfermo", "sick"),
      A("ocupado", "busy"),
      A("contento", "glad, happy"),
      A("nervioso", "nervous"),
      A("aburrido", "bored"),
      W("aquí", "here"),
      W("allí", "there"),
      P("¿Dónde está ...?", "where is ...?", { noType: true }),
      N("el baño", "bathroom", "m", "los baños", ["¿Dónde está el baño?", "Where's the bathroom?"]),
      N("la oficina", "office", "f", "las oficinas"),
      N("el hospital", "hospital", "m", "los hospitales"),
      N("el centro", "downtown, center", "m"),
      W("lejos", "far"),
      W("cerca", "near, close by"),
    ],
    notes: [
      {
        title: "estar",
        body: ["The second \"to be\". Notice the accents:"],
        table: {
          head: ["", "estar"],
          rows: [
            ["yo", "estoy"],
            ["tú", "estás"],
            ["él, ella, usted", "está"],
            ["nosotros", "estamos"],
            ["ellos, ellas, ustedes", "están"],
          ],
        },
      },
      {
        title: "ser or estar?",
        body: ["A rule of thumb that covers most cases: how you feel and where you are use estar. Who or what you are uses ser."],
        table: {
          head: ["estar", "ser"],
          rows: [
            ["feelings: Estoy cansada.", "identity: Soy Kas."],
            ["location: Estoy en el trabajo.", "jobs: Soy enfermera."],
            ["right now: Está ocupado.", "origin: Soy de California."],
            ["", "what someone is like: Es simpática."],
          ],
        },
        tip: "Events are the exception: where a party takes place uses ser. La fiesta es en mi casa.",
      },
      {
        title: "Feelings match the person",
        body: ["Estoy cansado (a man), estoy cansada (a woman), estamos cansados (a group)."],
      },
    ],
    drills: [
      { t: "fill", de: "Yo ___ muy cansada hoy.", en: "I'm really tired today.", answer: "estoy", options: ["estoy", "soy", "es", "está"], why: "Being tired is a feeling right now, so it's estar. With yo: estoy." },
      { t: "fill", de: "¿Dónde ___ el baño?", en: "Where's the bathroom?", answer: "está", options: ["está", "es", "están", "hay"], why: "Location uses estar, and el baño is one thing: está." },
      { t: "fill", de: "Mi papá ___ doctor.", en: "My dad is a doctor.", answer: "es", options: ["es", "está", "son", "estoy"], why: "A job is part of who someone is, so it's ser: es." },
      { t: "fill", de: "Nosotros ___ en la oficina.", en: "We're at the office.", answer: "estamos", options: ["estamos", "somos", "están", "estoy"], why: "Where you are uses estar. With nosotros: estamos." },
      { t: "fill", de: "Ellos están muy ___.", en: "They're very busy.", answer: "ocupados", options: ["ocupados", "ocupado", "ocupada", "ocupadas"], why: "ellos is a masculine or mixed group, so the describing word ends in -os." },
      { t: "choice", q: "\"She's sick\" is...", answer: "Está enferma.", options: ["Está enferma.", "Es enferma.", "Está enfermo.", "Es enfermo."], explain: "Being sick is a condition, so it's estar. ella makes it enferma." },
      { t: "build", de: "El hospital está cerca.", en: "The hospital is close by.", why: "Location takes estar: está. cerca (near) comes after." },
      { t: "build", de: "Estoy un poco nerviosa.", en: "I'm a little nervous.", why: "A feeling, so estar. un poco (a little) goes before the describing word." },
    ],
    prompts: [
      ["¿Cómo estás hoy?", "How are you today?"],
      ["¿Dónde estás ahora?", "Where are you right now?"],
    ],
  },

  // ───────────────────────────── 12
  {
    id: "es-describe",
    n: 12,
    title: "Colors & describing",
    titleDe: "Los colores",
    blurb: "Colors, describing things, and why the adjective comes after the noun.",
    skill: "cases",
    words: [
      A("rojo", "red"),
      A("azul", "blue", undefined, { note: "Ends in a consonant, so it doesn't change for gender. Plural: azules." }),
      A("verde", "green"),
      A("amarillo", "yellow"),
      A("negro", "black"),
      A("blanco", "white"),
      A("gris", "gray"),
      A("morado", "purple"),
      A("grande", "big"),
      A("pequeño", "small"),
      A("nuevo", "new"),
      A("viejo", "old"),
      A("bonito", "pretty, nice"),
      A("caro", "expensive"),
      A("barato", "cheap"),
      V("llevar", "to wear, to carry", ["Llevo una camisa azul.", "I'm wearing a blue shirt."]),
      N("la camisa", "shirt", "f", "las camisas"),
      N("el vestido", "dress", "m", "los vestidos"),
      N("la ropa", "clothes", "f", undefined, undefined, { note: "Singular in Spanish: La ropa es nueva (The clothes are new)." }),
    ],
    notes: [
      {
        title: "After the noun",
        body: [
          "Describing words usually come after the noun in Spanish, the opposite of English: un carro rojo (a red car), una casa grande (a big house).",
          "Words for amount and number come before: mucha gente, dos perros.",
        ],
      },
      {
        title: "Four forms",
        body: ["Most describing words match the noun's gender and number:"],
        table: {
          head: ["", "one", "more than one"],
          rows: [
            ["masculine", "el carro rojo", "los carros rojos"],
            ["feminine", "la camisa roja", "las camisas rojas"],
          ],
        },
        tip: "Words ending in -e (verde, grande) or a consonant (azul, gris) only change for number: verdes, azules.",
      },
      {
        title: "Mexican colors",
        body: [
          "In Mexico, brown is usually café: unos zapatos café. You'll also hear marrón in other countries.",
          "rosa (pink) and naranja (orange) don't change at all: unos zapatos rosa.",
        ],
      },
    ],
    drills: [
      { t: "fill", de: "Tengo un carro ___.", en: "I have a red car.", answer: "rojo", options: ["rojo", "roja", "rojos", "rojas"], why: "carro is masculine and singular, so rojo stays as it is." },
      { t: "fill", de: "Las camisas son ___.", en: "The shirts are white.", answer: "blancas", options: ["blancas", "blanco", "blanca", "blancos"], why: "camisas is feminine and plural, so blanco becomes blancas." },
      { t: "fill", de: "Es una casa muy ___.", en: "It's a very pretty house.", answer: "bonita", options: ["bonita", "bonito", "bonitas", "bonitos"], why: "casa is feminine and singular: bonita." },
      { t: "fill", de: "Los zapatos son muy ___.", en: "The shoes are very expensive.", answer: "caros", options: ["caros", "caro", "cara", "caras"], why: "zapatos is masculine and plural: caros." },
      { t: "choice", q: "\"a big house\" is...", answer: "una casa grande", options: ["una casa grande", "una grande casa", "un casa grande", "una casa granda"], explain: "The describing word goes after the noun. grande ends in -e, so it's the same for masculine and feminine." },
      { t: "build", de: "Quiero una camisa azul.", en: "I want a blue shirt.", why: "The color goes after the noun: camisa azul. azul doesn't change for gender." },
      { t: "build", de: "Mi carro es viejo pero bonito.", en: "My car is old but nice.", why: "After es, both describing words match carro (masculine): viejo, bonito." },
    ],
    prompts: [
      ["¿Cuál es tu color favorito?", "What's your favorite color?"],
      ["¿Qué ropa llevas hoy?", "What are you wearing today?"],
    ],
  },
];
