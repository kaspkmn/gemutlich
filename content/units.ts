import type { Unit, Word, Gender } from "./types";

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

export const UNITS: Unit[] = [
  // ───────────────────────────── 1
  {
    id: "sounds",
    n: 1,
    title: "Sounds of German",
    titleDe: "Die Aussprache",
    blurb: "Umlauts, ei vs. ie, and the letters that don't sound like English.",
    words: [
      W("ja", "yes", ["Ja, bitte.", "Yes, please."], { note: "j sounds like the English y." }),
      W("nein", "no", ["Nein, danke.", "No, thank you."], { note: "ei sounds like the word \"eye\"." }),
      N("die Liebe", "love", "f", undefined, ["Liebe ist schön.", "Love is beautiful."], { note: "ie sounds like \"ee\". Two syllables: LEE-buh." }),
      N("der Wein", "wine", "m", "die Weine", ["Der Wein ist gut.", "The wine is good."], { note: "w sounds like English v, so this rhymes with \"fine\"." }),
      N("der Vogel", "bird", "m", "die Vögel", undefined, { note: "v usually sounds like f: FOH-gel." }),
      N("die Zeit", "time", "f", "die Zeiten", ["Ich habe keine Zeit.", "I don't have time."], { note: "z sounds like ts, as in \"cats\"." }),
      A("schön", "beautiful, nice", ["Das ist schön!", "That's nice!"], { note: "sch sounds like sh. For ö, say \"ay\" while rounding your lips." }),
      N("die Tür", "door", "f", "die Türen", undefined, { note: "For ü, say \"ee\" while rounding your lips like a whistle." }),
      N("der Käse", "cheese", "m", undefined, undefined, { note: "ä sounds like the e in \"bed\": KEH-zuh." }),
      N("das Mädchen", "girl", "n", "die Mädchen", undefined, { note: "ch after e, i, ä, ö, ü is a soft hiss, like the h in \"huge\" said firmly." }),
      N("das Buch", "book", "n", "die Bücher", ["Das Buch ist gut.", "The book is good."], { note: "ch after a, o, u is the throaty sound in Scottish \"loch\"." }),
      N("die Straße", "street", "f", "die Straßen", undefined, { note: "ß is just a sharp ss. You can type ss instead.", alts: ["die Strasse"] }),
      N("das Haus", "house", "n", "die Häuser", ["Das Haus ist alt.", "The house is old."], { note: "au sounds like \"ow\", so Haus sounds like \"house\"." }),
      N("die Leute", "people", "pl", undefined, ["Die Leute sind nett.", "The people are nice."], { note: "eu sounds like \"oy\": LOY-tuh." }),
      N("die Stadt", "city, town", "f", "die Städte", undefined, { note: "st at the start of a word sounds like \"sht\": SHTAHT." }),
    ],
    notes: [
      {
        title: "Umlauts: the dotted vowels",
        body: [
          "German vowels are clean and steady. They don't glide the way English vowels do, so \"o\" is just o, never \"oh-oo\".",
          "The two dots (an umlaut) change the vowel. These three show up constantly:",
        ],
        table: {
          head: ["Letter", "Sounds like", "Example"],
          rows: [
            ["ä", "the e in \"bed\"", "der Käse"],
            ["ö", "\"ay\" with rounded lips", "schön"],
            ["ü", "\"ee\" with rounded lips", "die Tür"],
          ],
        },
        tip: "No umlaut keys? Type ae, oe, ue and ss instead. Every typing exercise here accepts both, and there are umlaut buttons under each text box.",
      },
      {
        title: "Letter pairs",
        body: ["Some pairs of letters always make the same sound. Learn these and you can read almost anything aloud."],
        table: {
          head: ["Pair", "Sounds like", "Example"],
          rows: [
            ["ei", "\"eye\"", "nein, der Wein"],
            ["ie", "\"ee\"", "die Liebe"],
            ["au", "\"ow\"", "das Haus"],
            ["eu / äu", "\"oy\"", "die Leute"],
            ["sch", "\"sh\"", "schön"],
            ["sp / st (at the start)", "\"shp\" / \"sht\"", "die Stadt"],
          ],
        },
        tip: "ei and ie are the classic mix-up. Say the second letter: Wein sounds like \"vine\", Liebe sounds like \"lee-buh\".",
      },
      {
        title: "Consonants that switch",
        body: [
          "w sounds like v (der Wein), and v usually sounds like f (der Vogel).",
          "z is always ts (die Zeit). j is always y (ja).",
          "s before a vowel is buzzy like z: sehr sounds like \"zair\".",
          "At the end of a word, b, d and g go hard: und sounds like \"unt\", Tag like \"tahk\".",
          "The German r is made in the back of the throat, a light gargle. At the end of a word it softens almost into \"uh\": Vater sounds like \"FAH-tuh\".",
        ],
      },
      {
        title: "Two habits that help right away",
        body: [
          "Every noun is capitalized, in the middle of a sentence too: Das Buch ist gut.",
          "Every letter is pronounced, including a final e. Liebe has two syllables, Käse has two syllables.",
          "Stress usually lands on the first syllable.",
        ],
      },
    ],
    drills: [
      { t: "choice", q: "Which word has the \"ts\" sound?", answer: "Zeit", options: ["Zeit", "Wein", "Haus", "Buch"], explain: "z is always pronounced ts." },
      { t: "choice", q: "\"Wein\" sounds most like...", answer: "vine", options: ["vine", "wine", "ween", "wane"], explain: "w sounds like v, and ei sounds like \"eye\"." },
      { t: "choice", q: "Which pair sounds like \"ee\"?", answer: "ie", options: ["ie", "ei", "eu", "au"], explain: "Say the second letter: ie = ee." },
      { t: "choice", q: "Which word has the \"oy\" sound?", answer: "Leute", options: ["Leute", "Liebe", "Zeit", "Tür"] },
      { t: "choice", q: "In \"Vogel\", the v sounds like...", answer: "f", options: ["f", "v", "w", "b"] },
      { t: "choice", q: "If you can't type ß, you can write...", answer: "ss", options: ["ss", "b", "sz", "s"] },
    ],
  },

  // ───────────────────────────── 2
  {
    id: "greetings",
    n: 2,
    title: "Hello & goodbye",
    titleDe: "Hallo!",
    blurb: "Greetings for every time of day, thanks, sorry, and du vs. Sie.",
    words: [
      P("Hallo", "hello"),
      P("Guten Morgen", "good morning"),
      P("Guten Tag", "hello (good day)"),
      P("Guten Abend", "good evening"),
      P("Gute Nacht", "good night"),
      P("Tschüss", "bye", { alts: ["Tschüs"] }),
      P("Auf Wiedersehen", "goodbye (formal)"),
      P("Danke", "thank you", { alts: ["Danke schön", "Dankeschön"] }),
      P("Bitte", "please, you're welcome"),
      P("Wie geht's?", "how's it going?", { alts: ["Wie geht es?", "Wie gehts"] }),
      P("Wie geht es Ihnen?", "how are you? (formal)"),
      P("Gut, danke.", "good, thanks."),
      P("Entschuldigung", "excuse me, sorry"),
      P("Es tut mir leid.", "I'm sorry."),
      P("Bis später!", "see you later!"),
      P("Bis morgen!", "see you tomorrow!"),
      P("Willkommen", "welcome"),
    ],
    notes: [
      {
        title: "Greetings by time of day",
        body: ["Germans greet according to the clock. You can't go wrong with Hallo, but these sound friendlier:"],
        table: {
          head: ["Say", "When"],
          rows: [
            ["Guten Morgen", "until about 11 am"],
            ["Guten Tag", "during the day (a bit formal)"],
            ["Guten Abend", "from about 6 pm"],
            ["Gute Nacht", "only when someone is going to bed"],
          ],
        },
        tip: "In Bavaria and Austria you'll hear Grüß Gott (hello) and Servus (hi and bye) all the time.",
      },
      {
        title: "du or Sie?",
        body: [
          "German has two words for \"you\". du is informal: friends, family, kids, and people your age in relaxed settings.",
          "Sie is formal and always capitalized: strangers, shop staff, doctors, your boss. When you're unsure, use Sie. Germans will offer du when they're ready.",
        ],
        table: {
          head: ["", "Informal (du)", "Formal (Sie)"],
          rows: [
            ["How are you?", "Wie geht's? / Wie geht es dir?", "Wie geht es Ihnen?"],
            ["Bye", "Tschüss!", "Auf Wiedersehen!"],
          ],
        },
      },
      {
        title: "Bitte does a lot of work",
        body: [
          "Bitte means please, but also you're welcome, here you go, and (with a question mark) pardon?",
          "Someone says Danke, you say Bitte. You hand someone their coffee: Bitte. You didn't hear them: Bitte?",
        ],
      },
    ],
    drills: [
      { t: "fill", de: "Guten ___! Wie geht's?", en: "Good morning! How's it going?", answer: "Morgen", options: ["Morgen", "Nacht", "Tschüss", "Bitte"] },
      { t: "fill", de: "___, danke.", en: "Good, thanks.", answer: "Gut", options: ["Gut", "Bitte", "Hallo", "Nein"] },
      { t: "build", de: "Guten Abend, wie geht es Ihnen?", en: "Good evening, how are you? (formal)" },
      { t: "build", de: "Danke, bis morgen!", en: "Thanks, see you tomorrow!" },
      { t: "choice", q: "A stranger thanks you. You reply:", answer: "Bitte.", options: ["Bitte.", "Danke.", "Tschüss.", "Gute Nacht."] },
      { t: "choice", q: "You meet a new coworker's manager. Which is the safer question?", answer: "Wie geht es Ihnen?", options: ["Wie geht es Ihnen?", "Wie geht's?", "Wie geht es dir?", "Tschüss?"], explain: "Use the formal Sie with people you don't know well." },
    ],
    prompts: [["Wie geht's?", "How's it going?"]],
  },

  // ───────────────────────────── 3
  {
    id: "intro",
    n: 3,
    title: "Introducing yourself",
    titleDe: "Ich heiße ...",
    blurb: "Your name, where you're from, where you live, and survival phrases.",
    words: [
      P("Wie heißt du?", "what's your name?", { alts: ["Wie heisst du"] }),
      P("Ich heiße ...", "my name is ...", { noType: true }),
      P("Ich bin ...", "I am ...", { noType: true }),
      P("Woher kommst du?", "where are you from?"),
      P("Ich komme aus ...", "I come from ...", { noType: true }),
      P("Wo wohnst du?", "where do you live?"),
      P("Ich wohne in ...", "I live in ...", { noType: true }),
      P("Freut mich!", "nice to meet you!"),
      P("Ich spreche Englisch.", "I speak English."),
      P("Ich lerne Deutsch.", "I'm learning German."),
      P("Sprichst du Englisch?", "do you speak English?"),
      P("Ich verstehe nicht.", "I don't understand."),
      P("Noch einmal, bitte.", "once more, please.", { alts: ["Nochmal, bitte", "Noch mal, bitte"] }),
      P("Langsam, bitte.", "slowly, please."),
      W("Deutschland", "Germany"),
      W("Amerika", "America"),
    ],
    notes: [
      {
        title: "Your first verb endings",
        body: [
          "German verbs change their ending depending on who's doing the action. Start with two: ich (I) takes -e, du (you) takes -st.",
        ],
        table: {
          head: ["Verb", "ich", "du"],
          rows: [
            ["kommen (to come)", "ich komme", "du kommst"],
            ["wohnen (to live)", "ich wohne", "du wohnst"],
            ["lernen (to learn)", "ich lerne", "du lernst"],
            ["heißen (to be called)", "ich heiße", "du heißt"],
            ["sprechen (to speak)", "ich spreche", "du sprichst"],
          ],
        },
        tip: "heißen already ends in ß, so du just adds a t: du heißt. sprechen changes its vowel for du: sprichst.",
      },
      {
        title: "Asking questions",
        body: [
          "Question word first, then the verb, then the person: Woher kommst du? Wo wohnst du?",
          "For a yes/no question, put the verb first: Sprichst du Englisch? Lernst du Deutsch?",
        ],
      },
      {
        title: "Saying where you're from",
        body: [
          "Most countries need no article: Ich komme aus Deutschland. Ich komme aus Amerika.",
          "A few come with one, and it changes after aus: Ich komme aus den USA. Ich komme aus der Schweiz (Switzerland).",
          "States and cities work the same way: Ich komme aus Kalifornien. Ich wohne in Berlin.",
        ],
      },
    ],
    drills: [
      { t: "fill", de: "Ich ___ Anna.", en: "My name is Anna.", answer: "heiße", options: ["heiße", "heißt", "heißen", "wohne"] },
      { t: "fill", de: "Woher ___ du?", en: "Where are you from?", answer: "kommst", options: ["kommst", "komme", "kommt", "kommen"] },
      { t: "fill", de: "Ich ___ in Berlin.", en: "I live in Berlin.", answer: "wohne", options: ["wohne", "wohnst", "wohnt", "wohnen"] },
      { t: "fill", de: "___ du Englisch?", en: "Do you speak English?", answer: "Sprichst", options: ["Sprichst", "Sprechst", "Spreche", "Spricht"] },
      { t: "build", de: "Ich komme aus den USA.", en: "I come from the USA." },
      { t: "build", de: "Freut mich, ich heiße Max.", en: "Nice to meet you, my name is Max." },
      { t: "build", de: "Langsam, bitte. Ich lerne Deutsch.", en: "Slowly, please. I'm learning German." },
    ],
    prompts: [
      ["Wie heißt du?", "What's your name?"],
      ["Woher kommst du?", "Where are you from?"],
      ["Wo wohnst du?", "Where do you live?"],
      ["Sprichst du Englisch?", "Do you speak English?"],
    ],
  },

  // ───────────────────────────── 4
  {
    id: "numbers",
    n: 4,
    title: "Numbers",
    titleDe: "Die Zahlen",
    blurb: "0 to 100, your age, and prices. Numbers are read backwards past 20.",
    words: [
      NUM("null", "zero (0)"),
      NUM("eins", "one (1)"),
      NUM("zwei", "two (2)"),
      NUM("drei", "three (3)"),
      NUM("vier", "four (4)"),
      NUM("fünf", "five (5)"),
      NUM("sechs", "six (6)"),
      NUM("sieben", "seven (7)"),
      NUM("acht", "eight (8)"),
      NUM("neun", "nine (9)"),
      NUM("zehn", "ten (10)"),
      NUM("elf", "eleven (11)"),
      NUM("zwölf", "twelve (12)"),
      NUM("zwanzig", "twenty (20)"),
      NUM("dreißig", "thirty (30)", { alts: ["dreissig"] }),
      NUM("hundert", "a hundred (100)", { alts: ["einhundert"] }),
      P("Wie alt bist du?", "how old are you?"),
      P("Ich bin ... Jahre alt.", "I am ... years old.", { noType: true }),
    ],
    notes: [
      {
        title: "13 to 19",
        body: ["Add zehn to the number: dreizehn (13), vierzehn (14), fünfzehn (15), achtzehn (18), neunzehn (19).", "Two shorten a little: sechzehn (16) drops the s, and siebzehn (17) drops the en."],
      },
      {
        title: "The tens",
        body: ["Most tens end in -zig. Thirty is the odd one with ßig."],
        table: {
          head: ["", "", ""],
          rows: [
            ["20 zwanzig", "50 fünfzig", "80 achtzig"],
            ["30 dreißig", "60 sechzig", "90 neunzig"],
            ["40 vierzig", "70 siebzig", "100 hundert"],
          ],
        },
      },
      {
        title: "Read them backwards",
        body: [
          "Past 20, German says the ones first, then \"and\", then the tens, all as one word.",
          "21 = einundzwanzig (one-and-twenty). 45 = fünfundvierzig. 99 = neunundneunzig.",
          "Notice eins loses its s when it's part of a bigger number: einundzwanzig.",
        ],
        tip: "Prices use a comma: 3,50 € is said drei Euro fünfzig.",
      },
    ],
    drills: [
      { t: "choice", q: "What is 45?", answer: "fünfundvierzig", options: ["fünfundvierzig", "vierundfünfzig", "vierzigfünf", "fünfvierzig"] },
      { t: "choice", q: "What is siebzehn?", answer: "17", options: ["17", "70", "7", "27"] },
      { t: "choice", q: "What is 32?", answer: "zweiunddreißig", options: ["zweiunddreißig", "dreiundzwanzig", "dreißigzwei", "zweidreißig"] },
      { t: "choice", q: "\"drei Euro fünfzig\" costs...", answer: "€3.50", options: ["€3.50", "€53.00", "€3.15", "€35.00"] },
      { t: "fill", de: "Ich bin dreißig Jahre ___.", en: "I am thirty years old.", answer: "alt", options: ["alt", "Jahr", "bin", "zehn"] },
      { t: "build", de: "Wie alt bist du?", en: "How old are you?" },
    ],
    prompts: [["Wie alt bist du?", "How old are you?"]],
  },

  // ───────────────────────────── 5
  {
    id: "sein",
    n: 5,
    title: "I am, you are",
    titleDe: "sein",
    blurb: "Personal pronouns and the most important verb in German.",
    words: [
      W("ich", "I"),
      W("du", "you (informal)"),
      W("er", "he"),
      W("sie", "she"),
      W("es", "it"),
      W("wir", "we"),
      W("ihr", "you all (informal)"),
      W("Sie", "you (formal)"),
      V("sein", "to be", ["Ich bin hier.", "I am here."]),
      A("müde", "tired", ["Ich bin so müde.", "I'm so tired."]),
      A("glücklich", "happy", ["Wir sind glücklich.", "We are happy."]),
      A("krank", "sick", ["Er ist krank.", "He is sick."]),
      A("nett", "nice, kind", ["Du bist nett.", "You're nice."]),
      W("hier", "here"),
      W("sehr", "very"),
      W("auch", "also, too", ["Ich bin auch müde.", "I'm tired too."]),
      W("und", "and"),
      W("aber", "but"),
    ],
    notes: [
      {
        title: "The verb sein (to be)",
        body: ["sein is irregular, so it's worth memorizing as a little song."],
        table: {
          head: ["", "sein", "English"],
          rows: [
            ["ich", "bin", "I am"],
            ["du", "bist", "you are"],
            ["er / sie / es", "ist", "he / she / it is"],
            ["wir", "sind", "we are"],
            ["ihr", "seid", "you all are"],
            ["sie / Sie", "sind", "they are / you (formal) are"],
          ],
        },
      },
      {
        title: "Three kinds of sie",
        body: [
          "sie + ist = she. Sie ist nett. (She is nice.)",
          "sie + sind = they. Sie sind nett. (They are nice.)",
          "Sie with a capital S + sind = formal you. Sind Sie müde? (Are you tired?)",
          "The verb ending tells you which one you're looking at.",
        ],
      },
      {
        title: "Building sentences",
        body: [
          "Adjectives after sein never change: Er ist müde. Sie ist müde. Wir sind müde.",
          "Stack them with und and aber: Ich bin müde, aber glücklich.",
        ],
        tip: "Don't mix up seid (you all are) and seit (since). Same sound, different word.",
      },
    ],
    drills: [
      { t: "fill", de: "Ich ___ müde.", en: "I am tired.", answer: "bin", options: ["bin", "bist", "ist", "sind"] },
      { t: "fill", de: "Wir ___ hier.", en: "We are here.", answer: "sind", options: ["sind", "seid", "ist", "bin"] },
      { t: "fill", de: "Er ___ krank.", en: "He is sick.", answer: "ist", options: ["ist", "bist", "sind", "seid"] },
      { t: "fill", de: "Ihr ___ sehr nett.", en: "You all are very nice.", answer: "seid", options: ["seid", "sind", "seit", "ist"] },
      { t: "fill", de: "Du ___ glücklich.", en: "You are happy.", answer: "bist", options: ["bist", "bin", "ist", "seid"] },
      { t: "build", de: "Ich bin müde, aber glücklich.", en: "I'm tired, but happy." },
      { t: "build", de: "Sie ist auch sehr nett.", en: "She is also very nice." },
    ],
    prompts: [["Bist du heute müde?", "Are you tired today?"]],
  },

  // ───────────────────────────── 6
  {
    id: "articles",
    n: 6,
    title: "der, die, das",
    titleDe: "Die Artikel",
    blurb: "Every noun has a gender. Everyday things, and patterns that make guessing easier.",
    words: [
      N("der Tisch", "table", "m", "die Tische"),
      N("der Stuhl", "chair", "m", "die Stühle"),
      N("die Lampe", "lamp", "f", "die Lampen"),
      N("das Fenster", "window", "n", "die Fenster"),
      N("der Schlüssel", "key", "m", "die Schlüssel", ["Wo ist der Schlüssel?", "Where is the key?"]),
      N("das Handy", "cell phone", "n", "die Handys", ["Mein Handy ist neu.", "My phone is new."]),
      N("die Tasche", "bag", "f", "die Taschen"),
      N("das Bett", "bed", "n", "die Betten"),
      N("der Hund", "dog", "m", "die Hunde", ["Der Hund ist müde.", "The dog is tired."]),
      N("die Katze", "cat", "f", "die Katzen", ["Die Katze ist schwarz.", "The cat is black."]),
      N("das Auto", "car", "n", "die Autos"),
      N("die Uhr", "clock, watch", "f", "die Uhren"),
      N("das Zimmer", "room", "n", "die Zimmer"),
      N("die Wohnung", "apartment", "f", "die Wohnungen", ["Die Wohnung ist schön.", "The apartment is nice."]),
      N("der Computer", "computer", "m", "die Computer"),
      N("das Bild", "picture", "n", "die Bilder"),
      P("Das ist ...", "this is ..., that is ...", { noType: true }),
    ],
    notes: [
      {
        title: "Every noun has a gender",
        body: [
          "German nouns are masculine (der), feminine (die) or neuter (das). It's about the word, not the thing: das Mädchen (the girl) is neuter.",
          "So learn every noun together with its article. Not \"Hund\", but \"der Hund\".",
          "In this app: blue is der, red is die, green is das, and gold is plural.",
        ],
      },
      {
        title: "Patterns that help you guess",
        body: ["Gender isn't random. Word endings give strong hints:"],
        table: {
          head: ["Ending", "Gender", "Example"],
          rows: [
            ["-ung, -heit, -keit", "always die", "die Wohnung"],
            ["-e", "usually die", "die Lampe, die Tasche"],
            ["-chen, -lein", "always das", "das Mädchen"],
            ["-er", "often der", "der Computer (but das Fenster)"],
          ],
        },
      },
      {
        title: "a / an",
        body: ["\"A\" is ein for der and das words, and eine for die words. Plurals always use die, and there's no plural of ein."],
        table: {
          head: ["", "the", "a"],
          rows: [
            ["masculine", "der Hund", "ein Hund"],
            ["feminine", "die Katze", "eine Katze"],
            ["neuter", "das Auto", "ein Auto"],
            ["plural", "die Hunde", "Hunde"],
          ],
        },
      },
    ],
    drills: [
      { t: "fill", de: "Das ist ___ Hund.", en: "That is a dog.", answer: "ein", options: ["ein", "eine", "einer", "eines"] },
      { t: "fill", de: "Das ist ___ Lampe.", en: "That is a lamp.", answer: "eine", options: ["eine", "ein", "einer", "eines"] },
      { t: "fill", de: "___ Katze ist müde.", en: "The cat is tired.", answer: "Die", options: ["Die", "Der", "Das", "Den"] },
      { t: "fill", de: "___ Zimmer ist sehr schön.", en: "The room is very nice.", answer: "Das", options: ["Das", "Der", "Die", "Den"] },
      { t: "choice", q: "Which ending is always das?", answer: "-chen", options: ["-chen", "-ung", "-e", "-er"] },
      { t: "build", de: "Der Hund ist müde.", en: "The dog is tired." },
      { t: "build", de: "Das ist eine Wohnung.", en: "That is an apartment." },
    ],
    prompts: [["Was ist in deinem Zimmer?", "What's in your room?"]],
  },

  // ───────────────────────────── 7
  {
    id: "family",
    n: 7,
    title: "Family",
    titleDe: "Die Familie",
    blurb: "Family words, the verb haben, and how to say \"my\".",
    words: [
      N("die Familie", "family", "f", "die Familien"),
      N("die Mutter", "mother", "f", "die Mütter"),
      N("der Vater", "father", "m", "die Väter"),
      N("die Eltern", "parents", "pl"),
      N("der Bruder", "brother", "m", "die Brüder", ["Ich habe einen Bruder.", "I have a brother."]),
      N("die Schwester", "sister", "f", "die Schwestern"),
      N("die Geschwister", "siblings", "pl", undefined, ["Hast du Geschwister?", "Do you have siblings?"]),
      N("der Sohn", "son", "m", "die Söhne"),
      N("die Tochter", "daughter", "f", "die Töchter"),
      N("das Kind", "child", "n", "die Kinder"),
      N("der Mann", "man, husband", "m", "die Männer"),
      N("die Frau", "woman, wife", "f", "die Frauen"),
      N("der Freund", "friend, boyfriend", "m", "die Freunde"),
      N("die Freundin", "friend (female), girlfriend", "f", "die Freundinnen"),
      N("die Oma", "grandma", "f", "die Omas"),
      N("der Opa", "grandpa", "m", "die Opas"),
      V("haben", "to have", ["Ich habe zwei Brüder.", "I have two brothers."]),
      W("mein", "my", ["Das ist mein Vater.", "This is my father."]),
    ],
    notes: [
      {
        title: "The verb haben (to have)",
        body: ["The second most important verb. Only du and er/sie/es are a little irregular."],
        table: {
          head: ["", "haben"],
          rows: [
            ["ich", "habe"],
            ["du", "hast"],
            ["er / sie / es", "hat"],
            ["wir", "haben"],
            ["ihr", "habt"],
            ["sie / Sie", "haben"],
          ],
        },
      },
      {
        title: "Saying \"my\"",
        body: ["mein goes with der and das words. meine goes with die words and plurals."],
        table: {
          head: ["", "my ..."],
          rows: [
            ["der Vater", "mein Vater"],
            ["das Kind", "mein Kind"],
            ["die Mutter", "meine Mutter"],
            ["die Eltern", "meine Eltern"],
          ],
        },
        tip: "dein (your) works exactly the same way: dein Bruder, deine Schwester.",
      },
      {
        title: "Having a brother",
        body: [
          "After haben, der words change ein to einen: Ich habe einen Bruder.",
          "die and das words stay the same: Ich habe eine Schwester. Ich habe ein Kind.",
          "You'll get the full story in unit 13. For now, just remember einen Bruder.",
        ],
        tip: "Freund can mean friend or boyfriend. \"Ein Freund von mir\" (a friend of mine) makes it clearly just a friend.",
      },
    ],
    drills: [
      { t: "fill", de: "Ich ___ zwei Schwestern.", en: "I have two sisters.", answer: "habe", options: ["habe", "hast", "hat", "haben"] },
      { t: "fill", de: "Er ___ ein Kind.", en: "He has a child.", answer: "hat", options: ["hat", "habt", "hast", "habe"] },
      { t: "fill", de: "Das ist ___ Mutter.", en: "This is my mother.", answer: "meine", options: ["meine", "mein", "meinen", "meiner"] },
      { t: "fill", de: "Das ist ___ Vater.", en: "This is my father.", answer: "mein", options: ["mein", "meine", "meinen", "meiner"] },
      { t: "fill", de: "Ich habe ___ Bruder.", en: "I have a brother.", answer: "einen", options: ["einen", "ein", "eine", "einer"] },
      { t: "build", de: "Hast du Geschwister?", en: "Do you have siblings?" },
      { t: "build", de: "Meine Schwester heißt Anna.", en: "My sister's name is Anna." },
    ],
    prompts: [
      ["Hast du Geschwister?", "Do you have siblings?"],
      ["Hast du einen Hund oder eine Katze?", "Do you have a dog or a cat?"],
    ],
  },

  // ───────────────────────────── 8
  {
    id: "verbs",
    n: 8,
    title: "Everyday verbs",
    titleDe: "Was machst du?",
    blurb: "Present tense endings, vowel-changing verbs, and gern for things you like doing.",
    words: [
      V("machen", "to do, to make", ["Was machst du?", "What are you doing?"]),
      V("lernen", "to learn"),
      V("spielen", "to play", ["Wir spielen Karten.", "We're playing cards."]),
      V("arbeiten", "to work", ["Er arbeitet viel.", "He works a lot."]),
      V("kaufen", "to buy"),
      V("trinken", "to drink", ["Ich trinke Kaffee.", "I drink coffee."]),
      V("essen", "to eat", ["Was isst du?", "What are you eating?"]),
      V("gehen", "to go (on foot)"),
      V("schlafen", "to sleep", ["Die Katze schläft.", "The cat is sleeping."]),
      V("lesen", "to read", ["Sie liest ein Buch.", "She's reading a book."]),
      V("schreiben", "to write"),
      V("hören", "to hear, to listen to", ["Ich höre Musik.", "I'm listening to music."]),
      V("sehen", "to see", ["Siehst du das?", "Do you see that?"]),
      V("kochen", "to cook"),
      V("fahren", "to drive, to ride", ["Er fährt nach Hause.", "He's driving home."]),
      V("sprechen", "to speak", ["Sprichst du Deutsch?", "Do you speak German?"]),
      W("gern", "gladly (with a verb: to like doing it)", ["Ich koche gern.", "I like to cook."], { alts: ["gerne"] }),
      P("Was machst du?", "what are you doing?"),
    ],
    notes: [
      {
        title: "Present tense endings",
        body: ["Take the infinitive, drop -en, and add these endings. This works for most verbs."],
        table: {
          head: ["", "machen", "lernen"],
          rows: [
            ["ich", "mache", "lerne"],
            ["du", "machst", "lernst"],
            ["er / sie / es", "macht", "lernt"],
            ["wir", "machen", "lernen"],
            ["ihr", "macht", "lernt"],
            ["sie / Sie", "machen", "lernen"],
          ],
        },
        tip: "wir and sie/Sie always look like the infinitive. That's two forms for free.",
      },
      {
        title: "Verbs that change their vowel",
        body: ["Some common verbs change their vowel, but only for du and er/sie/es. Everything else is regular."],
        table: {
          head: ["Verb", "du", "er / sie / es"],
          rows: [
            ["essen", "isst", "isst"],
            ["lesen", "liest", "liest"],
            ["sehen", "siehst", "sieht"],
            ["sprechen", "sprichst", "spricht"],
            ["schlafen", "schläfst", "schläft"],
            ["fahren", "fährst", "fährt"],
          ],
        },
      },
      {
        title: "An extra e",
        body: ["If the stem ends in t or d, add an e so it can be pronounced: arbeiten → du arbeitest, er arbeitet."],
      },
      {
        title: "gern: liking to do things",
        body: [
          "Put gern after the verb to say you like doing it: Ich koche gern. (I like cooking.)",
          "Add nicht for the opposite: Ich lese nicht gern. (I don't like reading.)",
          "One German present tense covers all of English: ich spiele = I play, I am playing, I do play.",
        ],
      },
    ],
    drills: [
      { t: "fill", de: "Wir ___ Deutsch.", en: "We are learning German.", answer: "lernen", options: ["lernen", "lernt", "lernst", "lerne"] },
      { t: "fill", de: "Er ___ Kaffee.", en: "He drinks coffee.", answer: "trinkt", options: ["trinkt", "trinkst", "trinken", "trinke"] },
      { t: "fill", de: "Du ___ ein Buch.", en: "You are reading a book.", answer: "liest", options: ["liest", "lest", "lesst", "lese"] },
      { t: "fill", de: "Sie ___ sehr gern.", en: "She really likes to cook.", answer: "kocht", options: ["kocht", "kochst", "kochen", "koche"] },
      { t: "fill", de: "Was ___ du?", en: "What are you doing?", answer: "machst", options: ["machst", "macht", "mache", "machen"] },
      { t: "build", de: "Ich spiele gern Videospiele.", en: "I like to play video games." },
      { t: "build", de: "Er arbeitet heute nicht.", en: "He isn't working today." },
    ],
    prompts: [
      ["Was machst du gern?", "What do you like to do?"],
      ["Was liest du gern?", "What do you like to read?"],
    ],
  },

  // ───────────────────────────── 9
  {
    id: "food",
    n: 9,
    title: "Food & drink",
    titleDe: "Essen und Trinken",
    blurb: "Ordering politely, being hungry, and paying the check.",
    words: [
      N("das Wasser", "water", "n"),
      N("der Kaffee", "coffee", "m", undefined, ["Einen Kaffee, bitte.", "A coffee, please."]),
      N("der Tee", "tea", "m"),
      N("die Milch", "milk", "f"),
      N("das Bier", "beer", "n", "die Biere"),
      N("das Brot", "bread", "n", "die Brote"),
      N("das Hähnchen", "chicken (food)", "n", "die Hähnchen", ["Das Hähnchen ist lecker.", "The chicken is delicious."]),
      N("der Reis", "rice", "m"),
      N("die Nudeln", "pasta, noodles", "pl"),
      N("die Kartoffel", "potato", "f", "die Kartoffeln"),
      N("der Apfel", "apple", "m", "die Äpfel"),
      N("der Kuchen", "cake", "m", "die Kuchen", ["Der Kuchen ist sehr lecker.", "The cake is very tasty."]),
      N("das Frühstück", "breakfast", "n"),
      N("das Mittagessen", "lunch", "n"),
      N("das Abendessen", "dinner", "n"),
      A("lecker", "delicious, tasty"),
      P("Ich möchte ...", "I would like ...", { noType: true }),
      P("Die Rechnung, bitte.", "the check, please."),
      P("Ich habe Hunger.", "I'm hungry."),
      P("Ich habe Durst.", "I'm thirsty."),
    ],
    notes: [
      {
        title: "möchte: the polite \"would like\"",
        body: ["This is how you order anything. It's softer than \"I want\"."],
        table: {
          head: ["", "möchten"],
          rows: [
            ["ich", "möchte"],
            ["du", "möchtest"],
            ["er / sie / es", "möchte"],
            ["wir", "möchten"],
            ["ihr", "möchtet"],
            ["sie / Sie", "möchten"],
          ],
        },
        tip: "You'll also hear Ich hätte gern ... (I'd like ...). Both are perfectly polite.",
      },
      {
        title: "Ordering one of something",
        body: ["When you order, der words change ein to einen. die and das words don't change."],
        table: {
          head: ["", "Ich möchte ..."],
          rows: [
            ["der Kaffee", "einen Kaffee"],
            ["die Cola", "eine Cola"],
            ["das Wasser", "ein Wasser"],
          ],
        },
      },
      {
        title: "Hunger and thirst",
        body: ["In German you have hunger and thirst: Ich habe Hunger. Ich habe Durst.", "\"Ich bin hungrig\" exists but sounds stiff."],
        tip: "In German restaurants the server won't bring the check until you ask: Die Rechnung, bitte. They may ask Zusammen oder getrennt? (together or separate?).",
      },
    ],
    drills: [
      { t: "fill", de: "Ich ___ einen Tee, bitte.", en: "I'd like a tea, please.", answer: "möchte", options: ["möchte", "möchtest", "möchten", "möchtet"] },
      { t: "fill", de: "Ich habe ___.", en: "I'm hungry.", answer: "Hunger", options: ["Hunger", "hungrig", "Essen", "lecker"] },
      { t: "fill", de: "Das Hähnchen ist sehr ___!", en: "The chicken is really tasty!", answer: "lecker", options: ["lecker", "Hunger", "müde", "Durst"] },
      { t: "fill", de: "Ich möchte ___ Kaffee.", en: "I'd like a coffee.", answer: "einen", options: ["einen", "eine", "ein", "einer"] },
      { t: "build", de: "Die Rechnung, bitte.", en: "The check, please." },
      { t: "build", de: "Ich esse gern Nudeln.", en: "I like eating pasta." },
      { t: "build", de: "Ich möchte ein Wasser, bitte.", en: "I'd like a water, please." },
    ],
    prompts: [
      ["Was isst du gern?", "What do you like to eat?"],
      ["Was trinkst du am Morgen?", "What do you drink in the morning?"],
      ["Hast du Hunger?", "Are you hungry?"],
    ],
  },

  // ───────────────────────────── 10
  {
    id: "time",
    n: 10,
    title: "Days & time",
    titleDe: "Die Zeit",
    blurb: "Days of the week, telling time (watch out for halb), and how often.",
    words: [
      N("der Montag", "Monday", "m"),
      N("der Dienstag", "Tuesday", "m"),
      N("der Mittwoch", "Wednesday", "m"),
      N("der Donnerstag", "Thursday", "m"),
      N("der Freitag", "Friday", "m"),
      N("der Samstag", "Saturday", "m"),
      N("der Sonntag", "Sunday", "m"),
      W("heute", "today", ["Heute ist Montag.", "Today is Monday."]),
      W("morgen", "tomorrow"),
      W("gestern", "yesterday"),
      N("das Wochenende", "weekend", "n", "die Wochenenden"),
      N("die Woche", "week", "f", "die Wochen"),
      N("der Tag", "day", "m", "die Tage"),
      N("das Jahr", "year", "n", "die Jahre"),
      P("Wie spät ist es?", "what time is it?"),
      P("Es ist drei Uhr.", "it's three o'clock."),
      W("jetzt", "now"),
      W("oft", "often"),
      W("manchmal", "sometimes"),
      W("immer", "always"),
      W("nie", "never"),
    ],
    notes: [
      {
        title: "Days of the week",
        body: [
          "All days are masculine. \"On Monday\" is am Montag. \"On the weekend\" is am Wochenende.",
          "Mittwoch literally means mid-week.",
        ],
      },
      {
        title: "Telling time",
        body: ["\"At\" a time is um: um acht Uhr (at eight o'clock).", "The big trap is halb: it looks ahead to the next hour."],
        table: {
          head: ["German", "Time"],
          rows: [
            ["Es ist drei Uhr.", "3:00"],
            ["Es ist Viertel nach drei.", "3:15"],
            ["Es ist halb vier.", "3:30 (half to four!)"],
            ["Es ist Viertel vor vier.", "3:45"],
          ],
        },
      },
      {
        title: "Months",
        body: ["All months are masculine. \"In October\" is im Oktober."],
        table: {
          head: ["", "", ""],
          rows: [
            ["Januar", "Mai", "September"],
            ["Februar", "Juni", "Oktober"],
            ["März", "Juli", "November"],
            ["April", "August", "Dezember"],
          ],
        },
      },
      {
        title: "Time words and word order",
        body: [
          "The verb always sits in second place. If you start with a time word, the subject moves behind the verb.",
          "Ich arbeite heute. → Heute arbeite ich.",
          "Am Wochenende schlafe ich lange. (On the weekend I sleep in.)",
        ],
      },
    ],
    drills: [
      { t: "fill", de: "Ich arbeite ___ Montag.", en: "I work on Monday.", answer: "am", options: ["am", "im", "um", "an"] },
      { t: "fill", de: "Der Film beginnt ___ acht Uhr.", en: "The movie starts at eight o'clock.", answer: "um", options: ["um", "am", "im", "an"] },
      { t: "fill", de: "Heute ___ ich.", en: "Today I'm working.", answer: "arbeite", options: ["arbeite", "arbeitest", "arbeitet", "arbeiten"] },
      { t: "choice", q: "\"halb vier\" means...", answer: "3:30", options: ["3:30", "4:30", "3:15", "4:15"], explain: "halb looks ahead: half (of the way) to four." },
      { t: "choice", q: "\"Viertel vor zehn\" is...", answer: "9:45", options: ["9:45", "10:15", "10:45", "9:15"] },
      { t: "build", de: "Heute ist Freitag.", en: "Today is Friday." },
      { t: "build", de: "Am Wochenende schlafe ich lange.", en: "On the weekend I sleep in." },
    ],
    prompts: [
      ["Was machst du am Wochenende?", "What do you do on the weekend?"],
      ["Wann arbeitest du?", "When do you work?"],
    ],
  },

  // ───────────────────────────── 11
  {
    id: "colors",
    n: 11,
    title: "Colors & describing",
    titleDe: "Farben",
    blurb: "Colors, opposites, and a first look at adjective endings.",
    words: [
      A("rot", "red"),
      A("blau", "blue"),
      A("grün", "green"),
      A("gelb", "yellow"),
      A("schwarz", "black"),
      A("weiß", "white", undefined, { alts: ["weiss"] }),
      A("grau", "gray"),
      A("braun", "brown"),
      A("rosa", "pink"),
      A("lila", "purple"),
      A("groß", "big, tall", ["Der Hund ist sehr groß.", "The dog is very big."], { alts: ["gross"] }),
      A("klein", "small, short"),
      A("alt", "old"),
      A("neu", "new"),
      A("jung", "young"),
      A("teuer", "expensive", ["Das ist zu teuer!", "That's too expensive!"]),
      A("billig", "cheap"),
      A("gut", "good"),
      A("schlecht", "bad"),
      P("Welche Farbe?", "which color?"),
    ],
    notes: [
      {
        title: "After sein: no change",
        body: ["When the adjective comes after the verb, it never changes.", "Das Auto ist rot. Die Katze ist schwarz. Die Häuser sind alt."],
      },
      {
        title: "Before a noun: endings appear",
        body: ["When the adjective sits right before the noun, it takes an ending. You don't need to master this yet, just notice it."],
        table: {
          head: ["", "a big ..."],
          rows: [
            ["der Hund", "ein großer Hund"],
            ["die Katze", "eine große Katze"],
            ["das Haus", "ein großes Haus"],
          ],
        },
        tip: "The ending echoes the article: der → -er, die → -e, das → -es.",
      },
      {
        title: "Opposites",
        body: ["alt pairs with both neu and jung, depending on whether it's a thing or a person."],
        table: {
          head: ["", ""],
          rows: [
            ["groß", "klein"],
            ["alt (things)", "neu"],
            ["alt (people)", "jung"],
            ["teuer", "billig"],
            ["gut", "schlecht"],
          ],
        },
      },
      {
        title: "Turning it up",
        body: ["sehr = very, zu = too, ziemlich = pretty / quite.", "Das ist zu teuer! Er ist ziemlich groß."],
      },
    ],
    drills: [
      { t: "fill", de: "Die Katze ist ___.", en: "The cat is black.", answer: "schwarz", options: ["schwarz", "weiß", "rot", "blau"] },
      { t: "fill", de: "Das ist zu ___!", en: "That's too expensive!", answer: "teuer", options: ["teuer", "billig", "neu", "jung"] },
      { t: "fill", de: "Mein Opa ist ___.", en: "My grandpa is old.", answer: "alt", options: ["alt", "jung", "neu", "klein"] },
      { t: "choice", q: "Which is the opposite of neu?", answer: "alt", options: ["alt", "jung", "klein", "billig"] },
      { t: "build", de: "Mein Auto ist alt, aber gut.", en: "My car is old, but good." },
      { t: "build", de: "Der Hund ist sehr groß.", en: "The dog is very big." },
    ],
    prompts: [
      ["Wie ist deine Wohnung?", "What's your apartment like?"],
      ["Welche Farbe magst du?", "Which color do you like?"],
    ],
  },

  // ───────────────────────────── 12
  {
    id: "questions",
    n: 12,
    title: "Asking questions",
    titleDe: "W-Fragen",
    blurb: "Who, what, where, when, why, how, and the false friends hiding in them.",
    words: [
      W("wer", "who"),
      W("was", "what"),
      W("wo", "where"),
      W("woher", "where from"),
      W("wohin", "where to"),
      W("wann", "when"),
      W("warum", "why"),
      W("wie", "how"),
      W("wie viel", "how much", undefined, { alts: ["wieviel"] }),
      P("Was ist das?", "what is that?"),
      P("Wie viel kostet das?", "how much does that cost?", { alts: ["Wieviel kostet das"] }),
      P("Wo ist die Toilette?", "where is the bathroom?"),
      P("Warum nicht?", "why not?"),
      P("Was ist los?", "what's up? what's wrong?"),
      W("weil", "because"),
    ],
    notes: [
      {
        title: "W-questions",
        body: ["Question word, then the verb, then the subject.", "Wo wohnst du? Wann kommst du? Was machst du?"],
      },
      {
        title: "Yes/no questions",
        body: ["No question word: the verb goes first.", "Kommst du? Hast du Zeit? Bist du müde?"],
      },
      {
        title: "Watch out for false friends",
        body: ["These look like English words but aren't:"],
        table: {
          head: ["German", "Means", "Not"],
          rows: [
            ["wer", "who", "where"],
            ["wo", "where", "who"],
            ["wie", "how", "who"],
            ["wann", "when", "want"],
            ["weil", "because", "while"],
          ],
        },
      },
      {
        title: "wo, woher, wohin",
        body: [
          "wo asks where something is: Wo bist du?",
          "woher asks where from: Woher kommst du?",
          "wohin asks where to: Wohin gehst du?",
        ],
      },
    ],
    drills: [
      { t: "fill", de: "___ wohnst du?", en: "Where do you live?", answer: "Wo", options: ["Wo", "Wer", "Woher", "Wann"] },
      { t: "fill", de: "___ kommst du?", en: "Where are you from?", answer: "Woher", options: ["Woher", "Wohin", "Wo", "Wer"] },
      { t: "fill", de: "___ heißt du?", en: "What's your name?", answer: "Wie", options: ["Wie", "Wer", "Was", "Wo"] },
      { t: "fill", de: "___ kostet das?", en: "How much does that cost?", answer: "Wie viel", options: ["Wie viel", "Was", "Wie", "Wann"] },
      { t: "fill", de: "___ gehst du?", en: "Where are you going?", answer: "Wohin", options: ["Wohin", "Woher", "Wo", "Wer"] },
      { t: "choice", q: "\"Wer ist das?\" means...", answer: "Who is that?", options: ["Who is that?", "Where is that?", "What is that?", "How is that?"] },
      { t: "build", de: "Wann kommst du nach Hause?", en: "When are you coming home?" },
    ],
    prompts: [["Was ist dein Lieblingsessen?", "What's your favorite food?"]],
  },

  // ───────────────────────────── 13
  {
    id: "accusative",
    n: 13,
    title: "Objects & den",
    titleDe: "Den, die, das",
    blurb: "The accusative case: why der turns into den, and me / you / him.",
    words: [
      V("brauchen", "to need", ["Ich brauche einen Mantel.", "I need a coat."]),
      V("nehmen", "to take", ["Ich nehme den Bus.", "I'm taking the bus."]),
      V("suchen", "to look for", ["Ich suche den Schlüssel.", "I'm looking for the key."]),
      V("finden", "to find"),
      V("mögen", "to like", ["Ich mag Kaffee.", "I like coffee."]),
      V("besuchen", "to visit"),
      V("lieben", "to love"),
      N("der Rucksack", "backpack", "m", "die Rucksäcke"),
      N("der Mantel", "coat", "m", "die Mäntel"),
      N("die Jacke", "jacket", "f", "die Jacken"),
      N("der Hut", "hat", "m", "die Hüte"),
      N("der Regenschirm", "umbrella", "m", "die Regenschirme"),
      N("das Geschenk", "gift, present", "n", "die Geschenke"),
      N("der Film", "movie, film", "m", "die Filme"),
      N("die Zeitung", "newspaper", "f", "die Zeitungen"),
      P("Ich liebe dich.", "I love you."),
      P("Ich mag dich.", "I like you."),
    ],
    notes: [
      {
        title: "Subject and object",
        body: [
          "The subject does the action. The object receives it. German marks the object (the accusative case) by changing the article, but only for der words.",
          "Der Hund sieht den Mann. (The dog sees the man.)",
        ],
        table: {
          head: ["", "subject", "object"],
          rows: [
            ["masculine", "der / ein", "den / einen"],
            ["feminine", "die / eine", "die / eine"],
            ["neuter", "das / ein", "das / ein"],
            ["plural", "die", "die"],
          ],
        },
        tip: "Only one change to learn: der → den, ein → einen. Everything else stays put.",
      },
      {
        title: "Verbs that take an object",
        body: [
          "haben, brauchen, möchten, suchen, finden, nehmen, mögen, kaufen, sehen and lots more.",
          "Ich suche den Schlüssel. Ich brauche einen Regenschirm. Ich kaufe eine Jacke.",
        ],
      },
      {
        title: "me, you, him",
        body: ["Pronouns change too:"],
        table: {
          head: ["subject", "object"],
          rows: [
            ["ich", "mich (me)"],
            ["du", "dich (you)"],
            ["er", "ihn (him)"],
            ["sie", "sie (her)"],
            ["es", "es (it)"],
            ["wir", "uns (us)"],
            ["ihr", "euch (you all)"],
            ["sie / Sie", "sie / Sie (them / you)"],
          ],
        },
      },
      {
        title: "mögen",
        body: ["ich mag, du magst, er/sie/es mag, wir mögen, ihr mögt, sie mögen.", "Ich mag dich is friendly. Ich liebe dich is serious love. Hab dich lieb is the warm in-between for family and friends."],
      },
    ],
    drills: [
      { t: "fill", de: "Ich brauche ___ Mantel.", en: "I need a coat.", answer: "einen", options: ["einen", "ein", "eine", "einem"] },
      { t: "fill", de: "Ich suche ___ Jacke.", en: "I'm looking for a jacket.", answer: "eine", options: ["eine", "einen", "ein", "einer"] },
      { t: "fill", de: "Er nimmt ___ Hut.", en: "He takes the hat.", answer: "den", options: ["den", "der", "das", "dem"] },
      { t: "fill", de: "Siehst du ___?", en: "Do you see him?", answer: "ihn", options: ["ihn", "er", "ihm", "ihr"] },
      { t: "fill", de: "Ich ___ dich.", en: "I love you.", answer: "liebe", options: ["liebe", "liebst", "liebt", "lieben"] },
      { t: "build", de: "Wir besuchen unsere Oma.", en: "We're visiting our grandma." },
      { t: "build", de: "Ich suche den Schlüssel.", en: "I'm looking for the key." },
    ],
    prompts: [["Was brauchst du heute?", "What do you need today?"]],
  },

  // ───────────────────────────── 14
  {
    id: "negation",
    n: 14,
    title: "No, not & doch",
    titleDe: "Nicht und kein",
    blurb: "Two ways to say no, where nicht goes, and the magic word doch.",
    words: [
      W("nicht", "not", ["Ich komme nicht.", "I'm not coming."]),
      W("kein", "no, not a", ["Ich habe kein Auto.", "I don't have a car."]),
      W("nichts", "nothing"),
      W("niemand", "nobody"),
      W("noch nicht", "not yet"),
      W("nicht mehr", "not anymore"),
      W("doch", "yes (to a negative question)"),
      W("vielleicht", "maybe"),
      W("natürlich", "of course"),
      W("leider", "unfortunately", ["Leider habe ich keine Zeit.", "Unfortunately I don't have time."]),
      W("wirklich", "really"),
      W("genau", "exactly"),
      P("Kein Problem!", "no problem!"),
      P("Keine Ahnung!", "no idea!"),
      P("Ich weiß nicht.", "I don't know.", { alts: ["Ich weiss nicht"] }),
    ],
    notes: [
      {
        title: "kein: \"not a\" or \"no\"",
        body: [
          "kein negates nouns that would have ein or no article at all.",
          "Ich habe ein Auto. → Ich habe kein Auto. Ich habe Zeit. → Ich habe keine Zeit.",
        ],
        table: {
          head: ["", "subject", "object"],
          rows: [
            ["masculine", "kein", "keinen"],
            ["feminine", "keine", "keine"],
            ["neuter", "kein", "kein"],
            ["plural", "keine", "keine"],
          ],
        },
      },
      {
        title: "nicht for everything else",
        body: ["Verbs, adjectives, names, and nouns with der/die/das all use nicht.", "Ich komme nicht. Das ist nicht teuer. Das ist nicht der Bus."],
      },
      {
        title: "Where nicht goes",
        body: [
          "In a simple sentence, nicht goes at the end: Ich verstehe das nicht.",
          "But it comes before adjectives, places, and a second verb: Er ist nicht müde. Ich wohne nicht in Berlin. Ich kann nicht schwimmen.",
        ],
      },
      {
        title: "doch",
        body: [
          "When someone asks a negative question and the answer is yes, say doch.",
          "Kommst du nicht? Doch! (Aren't you coming? Yes, I am!)",
          "Answering with ja here sounds confused. doch flips the negative.",
        ],
      },
    ],
    drills: [
      { t: "fill", de: "Ich habe ___ Zeit.", en: "I have no time.", answer: "keine", options: ["keine", "kein", "keinen", "nicht"] },
      { t: "fill", de: "Das ist ___ teuer.", en: "That's not expensive.", answer: "nicht", options: ["nicht", "kein", "keine", "nichts"] },
      { t: "fill", de: "Ich habe ___ Hund.", en: "I don't have a dog.", answer: "keinen", options: ["keinen", "kein", "keine", "nicht"] },
      { t: "fill", de: "Er kommt heute ___.", en: "He isn't coming today.", answer: "nicht", options: ["nicht", "kein", "nichts", "niemand"] },
      { t: "choice", q: "\"Hast du keinen Hunger?\" You ARE hungry. You say:", answer: "Doch!", options: ["Doch!", "Ja!", "Nein!", "Nicht!"], explain: "doch says yes to a negative question." },
      { t: "build", de: "Ich verstehe das nicht.", en: "I don't understand that." },
      { t: "build", de: "Das ist kein Problem.", en: "That's no problem." },
    ],
    prompts: [["Hast du heute keine Zeit?", "Don't you have time today?"]],
  },

  // ───────────────────────────── 15
  {
    id: "modals",
    n: 15,
    title: "Can, must, want",
    titleDe: "Modalverben",
    blurb: "können, müssen, wollen, dürfen, and the verb sandwich.",
    words: [
      V("können", "can, to be able to", ["Ich kann gut kochen.", "I can cook well."]),
      V("müssen", "must, to have to", ["Ich muss arbeiten.", "I have to work."]),
      V("wollen", "to want", ["Er will schlafen.", "He wants to sleep."]),
      V("dürfen", "may, to be allowed to"),
      V("sollen", "should, to be supposed to"),
      V("helfen", "to help"),
      V("schwimmen", "to swim"),
      V("tanzen", "to dance"),
      V("singen", "to sing"),
      V("warten", "to wait", ["Ich warte hier.", "I'll wait here."]),
      V("bleiben", "to stay"),
      P("Kannst du mir helfen?", "can you help me?"),
      P("Ich muss gehen.", "I have to go."),
      P("Darf ich?", "may I?"),
      P("Ich will nach Hause.", "I want to go home."),
    ],
    notes: [
      {
        title: "The modal verbs",
        body: ["These are irregular in the singular, and ich and er/sie/es are identical (no -t)."],
        table: {
          head: ["", "können", "müssen", "wollen", "dürfen"],
          rows: [
            ["ich", "kann", "muss", "will", "darf"],
            ["du", "kannst", "musst", "willst", "darfst"],
            ["er / sie / es", "kann", "muss", "will", "darf"],
            ["wir", "können", "müssen", "wollen", "dürfen"],
            ["ihr", "könnt", "müsst", "wollt", "dürft"],
            ["sie / Sie", "können", "müssen", "wollen", "dürfen"],
          ],
        },
      },
      {
        title: "The verb sandwich",
        body: [
          "The modal takes second place. The other verb goes to the very end, unchanged.",
          "Ich kann gut schwimmen. Wir müssen jetzt gehen. Kannst du morgen kommen?",
        ],
      },
      {
        title: "Two traps",
        body: [
          "ich will means I want, not I will.",
          "müssen nicht means don't have to. For must not, use dürfen nicht: Hier darf man nicht rauchen. (You're not allowed to smoke here.)",
        ],
        tip: "möchte is the polite way to want something. will sounds direct, like a kid in a toy store.",
      },
    ],
    drills: [
      { t: "fill", de: "Ich ___ heute arbeiten.", en: "I have to work today.", answer: "muss", options: ["muss", "musst", "müssen", "müsst"] },
      { t: "fill", de: "___ du tanzen?", en: "Can you dance?", answer: "Kannst", options: ["Kannst", "Kann", "Können", "Könnt"] },
      { t: "fill", de: "Er ___ nach Hause gehen.", en: "He wants to go home.", answer: "will", options: ["will", "willst", "wollen", "wollt"] },
      { t: "fill", de: "Hier ___ man nicht rauchen.", en: "You're not allowed to smoke here.", answer: "darf", options: ["darf", "darfst", "dürfen", "dürft"] },
      { t: "build", de: "Ich kann nicht schwimmen.", en: "I can't swim." },
      { t: "build", de: "Wir müssen jetzt gehen.", en: "We have to go now." },
      { t: "build", de: "Kannst du morgen kommen?", en: "Can you come tomorrow?" },
    ],
    prompts: [
      ["Was kannst du gut?", "What are you good at?"],
      ["Was musst du heute machen?", "What do you have to do today?"],
    ],
  },

  // ───────────────────────────── 16
  {
    id: "town",
    n: 16,
    title: "Around town",
    titleDe: "In der Stadt",
    blurb: "Places, asking for directions, zum vs. zur, and getting around.",
    words: [
      N("der Bahnhof", "train station", "m", "die Bahnhöfe"),
      N("der Supermarkt", "supermarket", "m", "die Supermärkte"),
      N("die Apotheke", "pharmacy", "f", "die Apotheken"),
      N("das Krankenhaus", "hospital", "n", "die Krankenhäuser"),
      N("die Bank", "bank", "f", "die Banken"),
      N("das Restaurant", "restaurant", "n", "die Restaurants"),
      N("die Bäckerei", "bakery", "f", "die Bäckereien"),
      N("der Park", "park", "m", "die Parks"),
      N("die Kirche", "church", "f", "die Kirchen"),
      N("die Haltestelle", "stop (bus, tram)", "f", "die Haltestellen"),
      N("die U-Bahn", "subway", "f", "die U-Bahnen", undefined, { alts: ["die UBahn"] }),
      N("der Zug", "train", "m", "die Züge"),
      N("der Bus", "bus", "m", "die Busse"),
      W("links", "left"),
      W("rechts", "right"),
      W("geradeaus", "straight ahead"),
      A("weit", "far"),
      W("in der Nähe", "nearby", undefined, { alts: ["in der Naehe"] }),
      P("Wie komme ich zum Bahnhof?", "how do I get to the train station?"),
    ],
    notes: [
      {
        title: "Asking the way",
        body: [
          "Start with Entschuldigung (excuse me), then ask: Wo ist die Apotheke? or Wie komme ich zum Bahnhof?",
          "Follow up with Ist das weit? (Is that far?)",
        ],
      },
      {
        title: "zum or zur",
        body: ["\"To the\" is zu + the article, squished together:"],
        table: {
          head: ["", "to the ..."],
          rows: [
            ["der Bahnhof", "zum Bahnhof"],
            ["das Restaurant", "zum Restaurant"],
            ["die Bank", "zur Bank"],
          ],
        },
        tip: "zum for der and das words, zur for die words.",
      },
      {
        title: "Getting around with mit",
        body: [
          "mit (with, by) changes the article: der and das become dem, die becomes der.",
          "mit dem Bus, mit dem Zug, mit dem Auto, mit der U-Bahn. On foot is zu Fuß.",
        ],
      },
      {
        title: "Directions",
        body: ["links (left), rechts (right), geradeaus (straight ahead).", "die erste Straße links = the first street on the left."],
      },
    ],
    drills: [
      { t: "fill", de: "Wie komme ich ___ Bahnhof?", en: "How do I get to the train station?", answer: "zum", options: ["zum", "zur", "zu", "zu der"] },
      { t: "fill", de: "Wie komme ich ___ Apotheke?", en: "How do I get to the pharmacy?", answer: "zur", options: ["zur", "zum", "zu", "zu dem"] },
      { t: "fill", de: "Ich fahre mit ___ Bus.", en: "I'm going by bus.", answer: "dem", options: ["dem", "den", "der", "das"] },
      { t: "fill", de: "Ich fahre mit ___ U-Bahn.", en: "I'm taking the subway.", answer: "der", options: ["der", "die", "dem", "den"] },
      { t: "build", de: "Gehen Sie geradeaus und dann links.", en: "Go straight ahead and then left." },
      { t: "build", de: "Ist das weit?", en: "Is that far?" },
    ],
    prompts: [["Wie kommst du zur Arbeit?", "How do you get to work?"]],
  },
];
