import type { Unit, Word, Gender } from "./types";

/* Lessons 17 to 24: the step from beginner basics toward A2. */

type Ex = [string, string];
type Opts = Partial<Word>;

const N = (de: string, en: string, gender: Gender, plural?: string, ex?: Ex, opts: Opts = {}): Word => ({
  de, en, type: "noun", gender, plural, ex, ...opts,
});
const V = (de: string, en: string, ex?: Ex, opts: Opts = {}): Word => ({ de, en, type: "verb", ex, ...opts });
const P = (de: string, en: string, opts: Opts = {}): Word => ({ de, en, type: "phrase", ...opts });
const A = (de: string, en: string, ex?: Ex, opts: Opts = {}): Word => ({ de, en, type: "adj", ex, ...opts });
const W = (de: string, en: string, ex?: Ex, opts: Opts = {}): Word => ({ de, en, type: "word", ex, ...opts });

export const UNITS_2: Unit[] = [
  // ───────────────────────────── 17
  {
    id: "separable",
    n: 17,
    title: "Daily routine",
    titleDe: "Mein Tag",
    blurb: "Separable verbs like aufstehen, where part of the verb jumps to the end.",
    words: [
      V("aufstehen", "to get up", ["Ich stehe um sieben Uhr auf.", "I get up at seven."]),
      V("aufwachen", "to wake up"),
      V("anrufen", "to call (on the phone)", ["Ich rufe dich morgen an.", "I'll call you tomorrow."]),
      V("einkaufen", "to go shopping", ["Wir kaufen am Samstag ein.", "We go shopping on Saturday."]),
      V("fernsehen", "to watch TV", ["Er sieht jeden Abend fern.", "He watches TV every evening."]),
      V("mitkommen", "to come along", ["Kommst du mit?", "Are you coming along?"]),
      V("ankommen", "to arrive"),
      V("abfahren", "to leave, to depart", ["Der Zug fährt um acht ab.", "The train leaves at eight."]),
      V("anfangen", "to start, to begin", ["Der Film fängt um neun an.", "The movie starts at nine."]),
      V("aufräumen", "to tidy up"),
      V("aufmachen", "to open"),
      V("zumachen", "to close"),
      V("ausgehen", "to go out"),
      V("duschen", "to shower", ["Ich dusche am Morgen.", "I shower in the morning."]),
      V("frühstücken", "to have breakfast"),
      N("der Morgen", "morning", "m", "die Morgen"),
      N("der Abend", "evening", "m", "die Abende"),
      W("früh", "early"),
      W("spät", "late"),
      W("zuerst", "first, at first"),
      W("dann", "then"),
      W("danach", "after that"),
      P("jeden Tag", "every day"),
    ],
    notes: [
      {
        title: "Verbs that split in two",
        body: [
          "Some verbs start with a small prefix like auf, an, ein, mit or fern. In a normal sentence the prefix breaks off and goes to the very end.",
          "The rest of the verb stays in second place and takes its usual ending.",
        ],
        table: {
          head: ["Verb", "In a sentence"],
          rows: [
            ["aufstehen (to get up)", "Ich stehe um sieben auf."],
            ["anrufen (to call)", "Ich rufe dich an."],
            ["einkaufen (to shop)", "Wir kaufen am Samstag ein."],
            ["fernsehen (to watch TV)", "Er sieht jeden Abend fern."],
            ["mitkommen (to come along)", "Kommst du mit?"],
          ],
        },
        tip: "Vowel changes still happen: fernsehen → du siehst fern, anfangen → er fängt an, abfahren → er fährt ab.",
      },
      {
        title: "With can, must and want",
        body: [
          "When a second verb goes to the end (unit 15), the separable verb stays in one piece there.",
          "Ich muss morgen früh aufstehen. Kannst du mich anrufen?",
        ],
      },
      {
        title: "Telling your day in order",
        body: [
          "zuerst (first), dann (then), danach (after that). Each one takes first place, so the verb comes right after it and the subject follows.",
          "Zuerst dusche ich, dann frühstücke ich. Danach fahre ich zur Arbeit.",
        ],
        tip: "In spoken German the stress lands on the prefix: AUFstehen, ANrufen, EINkaufen.",
      },
    ],
    drills: [
      { t: "fill", de: "Ich ___ um sieben Uhr auf.", en: "I get up at seven.", answer: "stehe", options: ["stehe", "stehst", "steht", "aufstehe"] },
      { t: "fill", de: "Kommst du ___?", en: "Are you coming along?", answer: "mit", options: ["mit", "an", "auf", "ein"] },
      { t: "fill", de: "Er sieht jeden Abend ___.", en: "He watches TV every evening.", answer: "fern", options: ["fern", "an", "aus", "mit"] },
      { t: "fill", de: "Der Film fängt um neun ___.", en: "The movie starts at nine.", answer: "an", options: ["an", "auf", "ab", "ein"] },
      { t: "fill", de: "Ich muss morgen früh ___.", en: "I have to get up early tomorrow.", answer: "aufstehen", options: ["aufstehen", "auf", "aufstehe", "steht auf"] },
      { t: "build", de: "Ich rufe dich morgen an.", en: "I'll call you tomorrow." },
      { t: "build", de: "Wir kaufen am Samstag ein.", en: "We go shopping on Saturday." },
      { t: "build", de: "Zuerst dusche ich, dann frühstücke ich.", en: "First I shower, then I have breakfast." },
      {
        t: "choice",
        q: "Where does the prefix of a separable verb usually go?",
        answer: "To the end of the sentence",
        options: ["To the end of the sentence", "Right after the subject", "Before the verb", "It disappears"],
      },
    ],
    prompts: [
      ["Wann stehst du auf?", "When do you get up?"],
      ["Was machst du am Abend?", "What do you do in the evening?"],
    ],
  },

  // ───────────────────────────── 18
  {
    id: "perfekt-haben",
    n: 18,
    title: "The past, part 1",
    titleDe: "Das Perfekt mit haben",
    blurb: "Talking about what you did, using haben and a past participle.",
    words: [
      V("gemacht", "done, made (machen)"),
      V("gekauft", "bought (kaufen)"),
      V("gelernt", "learned (lernen)"),
      V("gespielt", "played (spielen)"),
      V("gearbeitet", "worked (arbeiten)"),
      V("gekocht", "cooked (kochen)"),
      V("gehört", "heard, listened (hören)"),
      V("gegessen", "eaten (essen)", ["Ich habe Pizza gegessen.", "I ate pizza."]),
      V("getrunken", "drunk (trinken)"),
      V("gesehen", "seen (sehen)", ["Hast du den Film gesehen?", "Have you seen the movie?"]),
      V("gelesen", "read (lesen)"),
      V("geschrieben", "written (schreiben)"),
      V("geschlafen", "slept (schlafen)"),
      V("gesprochen", "spoken (sprechen)"),
      P("gestern Abend", "last night, yesterday evening"),
      P("letzte Woche", "last week"),
      W("schon", "already"),
      W("noch nie", "never (yet)", ["Ich habe noch nie Sushi gegessen.", "I've never eaten sushi."]),
      P("Was hast du gemacht?", "what did you do?"),
    ],
    notes: [
      {
        title: "How German talks about the past",
        body: [
          "In everyday speech, German uses the Perfekt for almost everything in the past: haben in second place, plus a past participle at the very end.",
          "Ich habe Pizza gegessen. (I ate pizza. / I have eaten pizza.)",
          "Wir haben gestern einen Film gesehen. (We watched a movie yesterday.)",
        ],
      },
      {
        title: "Making the past participle",
        body: ["Regular verbs: ge + stem + t. Irregular verbs: ge + (often changed) stem + en. The irregular ones are worth learning as you meet them."],
        table: {
          head: ["Verb", "Participle", "Pattern"],
          rows: [
            ["machen", "gemacht", "ge...t"],
            ["kaufen", "gekauft", "ge...t"],
            ["arbeiten", "gearbeitet", "ge...et (stem ends in t)"],
            ["essen", "gegessen", "ge...en"],
            ["sehen", "gesehen", "ge...en"],
            ["schreiben", "geschrieben", "ge...en, vowel changes"],
            ["trinken", "getrunken", "ge...en, vowel changes"],
          ],
        },
        tip: "Verbs that start with be- or end in -ieren skip the ge: besuchen → besucht, studieren → studiert.",
      },
      {
        title: "Word order",
        body: [
          "haben takes the normal verb spot (second place) and changes for the person. The participle never changes and waits at the end.",
          "Ich habe ... gemacht. Du hast ... gemacht. Er hat ... gemacht.",
        ],
      },
    ],
    drills: [
      { t: "fill", de: "Ich habe gestern Pizza ___.", en: "I ate pizza yesterday.", answer: "gegessen", options: ["gegessen", "geesst", "essen", "gegesst"] },
      { t: "fill", de: "Wir ___ einen Film gesehen.", en: "We watched a movie.", answer: "haben", options: ["haben", "sind", "hat", "habt"] },
      { t: "fill", de: "Hast du das Buch schon ___?", en: "Have you read the book yet?", answer: "gelesen", options: ["gelesen", "gelest", "lesen", "geliest"] },
      { t: "fill", de: "Er hat viel ___.", en: "He worked a lot.", answer: "gearbeitet", options: ["gearbeitet", "gearbeit", "arbeitet", "arbeiten"] },
      { t: "fill", de: "Was hast du am Wochenende ___?", en: "What did you do on the weekend?", answer: "gemacht", options: ["gemacht", "machen", "gemachen", "macht"] },
      { t: "build", de: "Ich habe Kaffee getrunken.", en: "I drank coffee." },
      { t: "build", de: "Sie hat einen Brief geschrieben.", en: "She wrote a letter." },
      { t: "build", de: "Was hast du gestern gemacht?", en: "What did you do yesterday?" },
      { t: "choice", q: "In the Perfekt, where does the past participle go?", answer: "At the end", options: ["At the end", "Right after haben", "At the start", "Before the subject"] },
    ],
    prompts: [
      ["Was hast du gestern gemacht?", "What did you do yesterday?"],
      ["Was hast du heute gegessen?", "What did you eat today?"],
    ],
  },

  // ───────────────────────────── 19
  {
    id: "perfekt-sein",
    n: 19,
    title: "The past, part 2",
    titleDe: "Das Perfekt mit sein",
    blurb: "Verbs of movement use sein in the past, plus war and hatte.",
    words: [
      V("gegangen", "gone, went (gehen)"),
      V("gefahren", "driven, went (fahren)"),
      V("gekommen", "come, came (kommen)"),
      V("geblieben", "stayed (bleiben)"),
      V("geflogen", "flown, flew (fliegen)"),
      V("gelaufen", "run, walked (laufen)"),
      V("aufgestanden", "got up (aufstehen)"),
      V("passiert", "happened (passieren)", ["Was ist passiert?", "What happened?"]),
      V("fliegen", "to fly"),
      V("laufen", "to run, to walk"),
      W("war", "was (sein)", ["Ich war sehr müde.", "I was very tired."]),
      W("hatte", "had (haben)", ["Ich hatte keine Zeit.", "I didn't have time."]),
      N("der Urlaub", "vacation", "m", "die Urlaube", ["Wir waren im Urlaub.", "We were on vacation."]),
      N("die Reise", "trip, journey", "f", "die Reisen"),
      N("der Flughafen", "airport", "m", "die Flughäfen"),
      P("letztes Jahr", "last year"),
      W("vorgestern", "the day before yesterday"),
    ],
    notes: [
      {
        title: "When the past uses sein",
        body: [
          "Most verbs use haben. Verbs of moving from one place to another use sein instead, along with bleiben and passieren.",
          "Ich bin nach Berlin gefahren. Wir sind ins Kino gegangen. Was ist passiert?",
        ],
        table: {
          head: ["Verb", "Past"],
          rows: [
            ["gehen", "ich bin gegangen"],
            ["fahren", "ich bin gefahren"],
            ["kommen", "ich bin gekommen"],
            ["fliegen", "ich bin geflogen"],
            ["laufen", "ich bin gelaufen"],
            ["bleiben", "ich bin geblieben"],
            ["aufstehen", "ich bin aufgestanden"],
          ],
        },
        tip: "Separable verbs put ge between the prefix and the stem: aufstehen → aufgestanden, einkaufen → eingekauft, anrufen → angerufen.",
      },
      {
        title: "was and had",
        body: ["For sein and haben themselves, Germans use a shorter past form instead of the Perfekt."],
        table: {
          head: ["", "sein (was)", "haben (had)"],
          rows: [
            ["ich", "war", "hatte"],
            ["du", "warst", "hattest"],
            ["er / sie / es", "war", "hatte"],
            ["wir", "waren", "hatten"],
            ["ihr", "wart", "hattet"],
            ["sie / Sie", "waren", "hatten"],
          ],
        },
      },
    ],
    drills: [
      { t: "fill", de: "Ich ___ nach Berlin gefahren.", en: "I went to Berlin.", answer: "bin", options: ["bin", "habe", "ist", "hat"] },
      { t: "fill", de: "Wir sind ins Kino ___.", en: "We went to the movies.", answer: "gegangen", options: ["gegangen", "gegeht", "gehen", "gangen"] },
      { t: "fill", de: "Was ist ___?", en: "What happened?", answer: "passiert", options: ["passiert", "gepassiert", "passieren", "passt"] },
      { t: "fill", de: "Gestern ___ ich krank.", en: "Yesterday I was sick.", answer: "war", options: ["war", "bin", "hatte", "habe"] },
      { t: "fill", de: "Er ___ keine Zeit.", en: "He didn't have time.", answer: "hatte", options: ["hatte", "war", "hattet", "habe"] },
      { t: "fill", de: "Ich bin um sechs Uhr ___.", en: "I got up at six.", answer: "aufgestanden", options: ["aufgestanden", "geaufstanden", "aufgesteht", "aufstehen"] },
      { t: "build", de: "Wir sind nach Deutschland geflogen.", en: "We flew to Germany." },
      { t: "build", de: "Ich war gestern sehr müde.", en: "I was very tired yesterday." },
      { t: "choice", q: "Which verb uses sein in the past?", answer: "fahren", options: ["fahren", "essen", "kaufen", "lesen"] },
    ],
    prompts: [
      ["Wo warst du letztes Wochenende?", "Where were you last weekend?"],
      ["Wohin bist du schon geflogen?", "Where have you flown to before?"],
    ],
  },

  // ───────────────────────────── 20
  {
    id: "dative",
    n: 20,
    title: "With, from & at",
    titleDe: "Der Dativ",
    blurb: "mit, bei, von, zu, nach, aus, seit, and why der turns into dem.",
    words: [
      W("mit", "with, by (bus, train)"),
      W("bei", "at (someone's place), near"),
      W("von", "from, of"),
      W("zu", "to"),
      W("nach", "to (cities, countries), after"),
      W("aus", "out of, from"),
      W("seit", "since, for (time)", ["Ich lerne seit drei Monaten Deutsch.", "I've been learning German for three months."]),
      N("der Arzt", "doctor (man)", "m", "die Ärzte"),
      N("die Ärztin", "doctor (woman)", "f", "die Ärztinnen"),
      N("der Kollege", "coworker (man)", "m", "die Kollegen"),
      N("die Kollegin", "coworker (woman)", "f", "die Kolleginnen"),
      N("die Arbeit", "work, job", "f"),
      N("die Schule", "school", "f", "die Schulen"),
      N("das Kino", "movie theater", "n", "die Kinos"),
      P("nach Hause", "home (going home)", { alts: ["nachhause"] }),
      P("zu Hause", "at home", { alts: ["zuhause"] }),
    ],
    notes: [
      {
        title: "Prepositions that always take the dative",
        body: ["After these seven words, the article changes to its dative form: aus, bei, mit, nach, seit, von, zu."],
        table: {
          head: ["", "the", "a"],
          rows: [
            ["der Bus", "mit dem Bus", "mit einem Bus"],
            ["die Freundin", "mit der Freundin", "mit einer Freundin"],
            ["das Auto", "mit dem Auto", "mit einem Auto"],
            ["die Freunde (plural)", "mit den Freunden", "mit Freunden"],
          ],
        },
        tip: "In the plural, the noun usually adds an -n too: den Freunden, den Kindern.",
      },
      {
        title: "Short forms",
        body: ["Some combinations melt together. You'll hear these all the time:"],
        table: {
          head: ["Long", "Short"],
          rows: [
            ["zu dem", "zum"],
            ["zu der", "zur"],
            ["bei dem", "beim"],
            ["von dem", "vom"],
          ],
        },
      },
      {
        title: "Home and time",
        body: [
          "nach Hause is going home: Ich gehe nach Hause. zu Hause is being home: Ich bin zu Hause.",
          "seit uses the present tense for something still going on: Ich wohne seit zwei Jahren hier. (I've lived here for two years.)",
        ],
      },
    ],
    drills: [
      { t: "fill", de: "Ich fahre mit ___ Auto.", en: "I'm going by car.", answer: "dem", options: ["dem", "den", "das", "der"] },
      { t: "fill", de: "Ich bin bei ___ Ärztin.", en: "I'm at the doctor's.", answer: "der", options: ["der", "die", "dem", "den"] },
      { t: "fill", de: "Ich gehe ___ Hause.", en: "I'm going home.", answer: "nach", options: ["nach", "zu", "bei", "aus"] },
      { t: "fill", de: "Wir sind heute ___ Hause.", en: "We're at home today.", answer: "zu", options: ["zu", "nach", "bei", "mit"] },
      { t: "fill", de: "Das Geschenk ist von ___ Kollegin.", en: "The gift is from a coworker.", answer: "einer", options: ["einer", "einen", "ein", "eine"] },
      { t: "fill", de: "Ich lerne ___ drei Monaten Deutsch.", en: "I've been learning German for three months.", answer: "seit", options: ["seit", "für", "vor", "mit"] },
      { t: "build", de: "Ich fahre mit dem Bus zur Arbeit.", en: "I take the bus to work." },
      { t: "build", de: "Er kommt aus der Schweiz.", en: "He comes from Switzerland." },
      { t: "choice", q: "After mit, der Bus becomes...", answer: "dem Bus", options: ["dem Bus", "den Bus", "der Bus", "des Bus"] },
    ],
    prompts: [
      ["Seit wann lernst du Deutsch?", "Since when have you been learning German?"],
      ["Mit wem wohnst du zusammen?", "Who do you live with?"],
    ],
  },

  // ───────────────────────────── 21
  {
    id: "dative-pronouns",
    n: 21,
    title: "To me, to you",
    titleDe: "Mir und dir",
    blurb: "mir, dir, ihm, and verbs like gefallen, helfen and schmecken.",
    words: [
      W("mir", "(to) me"),
      W("dir", "(to) you"),
      W("ihm", "(to) him"),
      W("uns", "(to) us"),
      V("gefallen", "to be liked by, to please", ["Das Kleid gefällt mir.", "I like the dress."]),
      V("schmecken", "to taste", ["Das schmeckt mir.", "I like how that tastes."]),
      V("gehören", "to belong to", ["Das gehört mir.", "That's mine."]),
      V("danken", "to thank"),
      V("antworten", "to answer"),
      V("passen", "to fit, to suit", ["Die Jacke passt mir nicht.", "The jacket doesn't fit me."]),
      N("das Kleid", "dress", "n", "die Kleider"),
      N("die Hose", "pants", "f", "die Hosen"),
      N("das Hemd", "shirt", "n", "die Hemden"),
      N("der Schuh", "shoe", "m", "die Schuhe"),
      P("Wie geht es dir?", "how are you?"),
      P("Das gefällt mir.", "I like that."),
      P("Mir ist kalt.", "I'm cold."),
      P("Mir ist langweilig.", "I'm bored."),
    ],
    notes: [
      {
        title: "Pronouns in the dative",
        body: ["When someone receives something or is helped, thanked or answered, the pronoun takes its dative form."],
        table: {
          head: ["subject", "accusative", "dative"],
          rows: [
            ["ich", "mich", "mir"],
            ["du", "dich", "dir"],
            ["er", "ihn", "ihm"],
            ["sie", "sie", "ihr"],
            ["es", "es", "ihm"],
            ["wir", "uns", "uns"],
            ["ihr", "euch", "euch"],
            ["sie / Sie", "sie / Sie", "ihnen / Ihnen"],
          ],
        },
      },
      {
        title: "Verbs that take the dative",
        body: [
          "A handful of common verbs always use the dative: helfen, danken, antworten, gehören, gefallen, schmecken, passen.",
          "Kann ich dir helfen? Ich danke dir. Das gehört mir.",
        ],
      },
      {
        title: "gefallen flips the sentence",
        body: [
          "German says the thing pleases you, so the thing is the subject: Der Film gefällt mir. (I like the movie.)",
          "More than one thing, so the verb is plural: Die Schuhe gefallen mir.",
          "Feelings work the same way: Mir ist kalt. Mir ist langweilig. (literally: to me it is cold.)",
        ],
        tip: "Don't say Ich bin kalt for feeling cold. It means your personality is cold.",
      },
    ],
    drills: [
      { t: "fill", de: "Kannst du ___ helfen?", en: "Can you help me?", answer: "mir", options: ["mir", "mich", "ich", "mein"] },
      { t: "fill", de: "Das Buch gehört ___.", en: "The book belongs to him.", answer: "ihm", options: ["ihm", "ihn", "er", "sein"] },
      { t: "fill", de: "Die Schuhe ___ mir.", en: "I like the shoes.", answer: "gefallen", options: ["gefallen", "gefällt", "gefalle", "gefallt"] },
      { t: "fill", de: "Wie geht es ___?", en: "How are you?", answer: "dir", options: ["dir", "dich", "du", "dein"] },
      { t: "fill", de: "___ ist kalt.", en: "I'm cold.", answer: "Mir", options: ["Mir", "Ich", "Mich", "Mein"] },
      { t: "build", de: "Das Essen schmeckt mir sehr gut.", en: "The food tastes really good to me." },
      { t: "build", de: "Die Hose passt mir nicht.", en: "The pants don't fit me." },
      {
        t: "choice",
        q: "\"Der Film gefällt mir\" means...",
        answer: "I like the movie.",
        options: ["I like the movie.", "The movie likes me.", "I watched the movie.", "The movie is mine."],
      },
    ],
    prompts: [
      ["Was gefällt dir an deiner Stadt?", "What do you like about your city?"],
      ["Was schmeckt dir gut?", "What tastes good to you?"],
    ],
  },

  // ───────────────────────────── 22
  {
    id: "at-home",
    n: 22,
    title: "Where things are",
    titleDe: "Zu Hause",
    blurb: "Rooms, furniture, and in, auf, unter for saying where something is.",
    words: [
      N("die Küche", "kitchen", "f", "die Küchen"),
      N("das Bad", "bathroom", "n", "die Bäder"),
      N("das Schlafzimmer", "bedroom", "n", "die Schlafzimmer"),
      N("das Wohnzimmer", "living room", "n", "die Wohnzimmer"),
      N("das Sofa", "couch", "n", "die Sofas"),
      N("der Schrank", "cabinet, closet", "m", "die Schränke"),
      N("das Regal", "shelf", "n", "die Regale"),
      N("der Kühlschrank", "fridge", "m", "die Kühlschränke"),
      N("der Boden", "floor", "m", "die Böden"),
      N("die Wand", "wall", "f", "die Wände"),
      N("der Spiegel", "mirror", "m", "die Spiegel"),
      W("in", "in"),
      W("auf", "on (top of)"),
      W("unter", "under"),
      W("neben", "next to"),
      W("hinter", "behind"),
      W("vor", "in front of"),
      W("zwischen", "between"),
      W("an", "on (a wall), at"),
      V("liegen", "to lie (flat)", ["Das Buch liegt auf dem Tisch.", "The book is on the table."]),
      V("stehen", "to stand", ["Die Lampe steht neben dem Bett.", "The lamp is next to the bed."]),
      V("hängen", "to hang", ["Das Bild hängt an der Wand.", "The picture is on the wall."]),
    ],
    notes: [
      {
        title: "Saying where something is",
        body: [
          "To say where something is, these prepositions use the dative: in, an, auf, unter, neben, hinter, vor, zwischen.",
          "Wo ist die Katze? Unter dem Tisch. Auf dem Sofa. Im Schrank.",
        ],
        table: {
          head: ["", "Where?"],
          rows: [
            ["der Tisch", "auf dem Tisch"],
            ["die Wand", "an der Wand"],
            ["das Bett", "neben dem Bett"],
            ["der Schrank", "im Schrank (in dem)"],
            ["die Küche", "in der Küche"],
          ],
        },
        tip: "in dem shortens to im, an dem to am.",
      },
      {
        title: "Lying, standing, hanging",
        body: [
          "German usually says how a thing is placed instead of just \"is\".",
          "Flat things lie: Das Handy liegt auf dem Tisch. Upright things stand: Die Flasche steht im Kühlschrank. Things on walls hang: Der Spiegel hängt im Bad.",
        ],
      },
      {
        title: "Coming later",
        body: [
          "When something moves somewhere (where to?), the same words take the accusative: Ich lege das Buch auf den Tisch. For now, focus on where things are.",
        ],
      },
    ],
    drills: [
      { t: "fill", de: "Die Katze schläft auf ___ Sofa.", en: "The cat is sleeping on the couch.", answer: "dem", options: ["dem", "das", "den", "der"] },
      { t: "fill", de: "Der Hund liegt unter ___ Tisch.", en: "The dog is lying under the table.", answer: "dem", options: ["dem", "den", "der", "das"] },
      { t: "fill", de: "Die Milch ist ___ Kühlschrank.", en: "The milk is in the fridge.", answer: "im", options: ["im", "in", "am", "auf"] },
      { t: "fill", de: "Das Bild hängt an ___ Wand.", en: "The picture is hanging on the wall.", answer: "der", options: ["der", "die", "dem", "den"] },
      { t: "fill", de: "Das Buch ___ auf dem Tisch.", en: "The book is lying on the table.", answer: "liegt", options: ["liegt", "hängt", "liegen", "lege"] },
      { t: "build", de: "Die Lampe steht neben dem Bett.", en: "The lamp is next to the bed." },
      { t: "build", de: "Mein Handy liegt in der Küche.", en: "My phone is in the kitchen." },
      { t: "choice", q: "\"Wo ist die Katze? ___ dem Sofa.\" (under)", answer: "Unter", options: ["Unter", "Auf", "Neben", "Hinter"] },
    ],
    prompts: [
      ["Was ist in deinem Wohnzimmer?", "What's in your living room?"],
      ["Wo ist dein Handy jetzt?", "Where is your phone right now?"],
    ],
  },

  // ───────────────────────────── 23
  {
    id: "because",
    n: 23,
    title: "Because & that",
    titleDe: "Weil und dass",
    blurb: "Joining sentences with weil, dass and wenn, and the verb that jumps to the end.",
    words: [
      W("dass", "that (joining two ideas)", ["Ich glaube, dass er kommt.", "I think that he's coming."]),
      W("wenn", "if, when(ever)", ["Wenn es regnet, bleibe ich zu Hause.", "If it rains, I stay home."]),
      W("oder", "or"),
      W("denn", "because (normal word order)"),
      W("deshalb", "that's why, so"),
      V("glauben", "to believe, to think"),
      V("denken", "to think"),
      V("hoffen", "to hope", ["Ich hoffe, dass du kommst.", "I hope you're coming."]),
      V("wissen", "to know (a fact)", ["Ich weiß, dass er krank ist.", "I know that he's sick."]),
      A("froh", "glad"),
      A("traurig", "sad"),
      A("nervös", "nervous"),
      A("wütend", "angry"),
      A("aufgeregt", "excited"),
      A("gestresst", "stressed"),
      P("Ich glaube schon.", "I think so."),
      P("Ich glaube nicht.", "I don't think so."),
    ],
    notes: [
      {
        title: "The verb jumps to the end",
        body: [
          "After weil (because), dass (that) and wenn (if, when), the conjugated verb moves to the very end of that part of the sentence.",
          "Always put a comma before these words.",
        ],
        table: {
          head: ["Two sentences", "Joined"],
          rows: [
            ["Ich bin müde. Ich habe viel gearbeitet.", "Ich bin müde, weil ich viel gearbeitet habe."],
            ["Ich glaube. Er kommt heute.", "Ich glaube, dass er heute kommt."],
            ["Es regnet. Ich bleibe zu Hause.", "Wenn es regnet, bleibe ich zu Hause."],
          ],
        },
        tip: "denn also means because but keeps normal order: Ich bin müde, denn ich habe viel gearbeitet.",
      },
      {
        title: "Starting with wenn",
        body: [
          "If the wenn part comes first, the main sentence starts with its verb: Wenn ich Zeit habe, lese ich.",
          "It looks like verb, comma, verb, and that rhythm is a good way to remember it.",
        ],
      },
      {
        title: "The verb wissen",
        body: ["wissen means knowing a fact and is irregular in the singular: ich weiß, du weißt, er weiß, wir wissen, ihr wisst, sie wissen."],
      },
    ],
    drills: [
      { t: "fill", de: "Ich lerne Deutsch, weil ich nach Deutschland ___.", en: "I'm learning German because I'm flying to Germany.", answer: "fliege", options: ["fliege", "fliegen", "fliegst", "geflogen"] },
      { t: "fill", de: "Ich glaube, dass er heute ___.", en: "I think he's coming today.", answer: "kommt", options: ["kommt", "kommen", "komme", "kommst"] },
      { t: "fill", de: "___ es regnet, bleibe ich zu Hause.", en: "If it rains, I stay home.", answer: "Wenn", options: ["Wenn", "Weil", "Dass", "Denn"] },
      { t: "fill", de: "Ich bin müde, ___ ich habe schlecht geschlafen.", en: "I'm tired, because I slept badly.", answer: "denn", options: ["denn", "weil", "dass", "wenn"] },
      { t: "fill", de: "Ich ___, dass du recht hast.", en: "I know you're right.", answer: "weiß", options: ["weiß", "wisse", "weißt", "wissen"] },
      { t: "build", de: "Ich bin froh, dass du hier bist.", en: "I'm glad you're here." },
      { t: "build", de: "Er ist traurig, weil sein Hund krank ist.", en: "He's sad because his dog is sick." },
      { t: "choice", q: "In \"..., weil ich müde bin\", where is the verb?", answer: "At the end", options: ["At the end", "In second place", "First", "Before weil"] },
    ],
    prompts: [
      ["Warum lernst du Deutsch?", "Why are you learning German?"],
      ["Was machst du, wenn du gestresst bist?", "What do you do when you're stressed?"],
    ],
  },

  // ───────────────────────────── 24
  {
    id: "weather",
    n: 24,
    title: "Weather & comparing",
    titleDe: "Das Wetter",
    blurb: "Weather, seasons, and saying something is bigger, better or your favorite.",
    words: [
      N("das Wetter", "weather", "n"),
      N("die Sonne", "sun", "f"),
      N("der Regen", "rain", "m"),
      N("der Schnee", "snow", "m"),
      N("der Wind", "wind", "m"),
      N("die Wolke", "cloud", "f", "die Wolken"),
      P("Es regnet.", "It's raining."),
      P("Es schneit.", "It's snowing."),
      P("Die Sonne scheint.", "The sun is shining."),
      A("warm", "warm"),
      A("kalt", "cold"),
      A("heiß", "hot", undefined, { alts: ["heiss"] }),
      A("kühl", "cool"),
      N("der Frühling", "spring", "m"),
      N("der Sommer", "summer", "m"),
      N("der Herbst", "fall, autumn", "m"),
      N("der Winter", "winter", "m"),
      W("besser", "better"),
      W("lieber", "rather, (like) more"),
      W("am liebsten", "most of all, favorite"),
      P("Wie ist das Wetter?", "what's the weather like?"),
    ],
    notes: [
      {
        title: "Weather uses es",
        body: [
          "Es regnet (it's raining), es schneit (it's snowing), es ist kalt (it's cold), es ist windig (it's windy).",
          "Seasons are all masculine and take im: im Sommer, im Winter.",
        ],
      },
      {
        title: "Comparing things",
        body: ["Add -er to compare, and use als for than. Short words often add an umlaut too."],
        table: {
          head: ["", "more", "most"],
          rows: [
            ["kalt", "kälter", "am kältesten"],
            ["warm", "wärmer", "am wärmsten"],
            ["groß", "größer", "am größten"],
            ["klein", "kleiner", "am kleinsten"],
            ["gut", "besser", "am besten"],
            ["gern", "lieber", "am liebsten"],
          ],
        },
        tip: "Berlin ist kälter als Kalifornien. (Berlin is colder than California.)",
      },
      {
        title: "Favorites with gern",
        body: [
          "Ich trinke gern Tee. Ich trinke lieber Kaffee. Am liebsten trinke ich Wasser.",
          "That's like, like more, and like most of all.",
        ],
      },
    ],
    drills: [
      { t: "fill", de: "Im Winter ___ es oft.", en: "It often snows in winter.", answer: "schneit", options: ["schneit", "schneien", "Schnee", "regen"] },
      { t: "fill", de: "Heute ist es ___ als gestern.", en: "Today it's colder than yesterday.", answer: "kälter", options: ["kälter", "kalter", "mehr kalt", "kalt"] },
      { t: "fill", de: "Im Sommer ist es ___.", en: "It's hot in summer.", answer: "heiß", options: ["heiß", "kalt", "Schnee", "kühl"] },
      { t: "fill", de: "Ich trinke ___ Kaffee als Tee.", en: "I'd rather drink coffee than tea.", answer: "lieber", options: ["lieber", "gerner", "mehr gern", "besser"] },
      { t: "fill", de: "Mein Hund ist ___ als deine Katze.", en: "My dog is bigger than your cat.", answer: "größer", options: ["größer", "großer", "mehr groß", "am größten"] },
      { t: "build", de: "Wie ist das Wetter heute?", en: "What's the weather like today?" },
      { t: "build", de: "Im Herbst regnet es viel.", en: "It rains a lot in the fall." },
      { t: "choice", q: "Which season is der Herbst?", answer: "Fall", options: ["Fall", "Spring", "Summer", "Winter"] },
    ],
    prompts: [
      ["Wie ist das Wetter heute?", "What's the weather like today?"],
      ["Welche Jahreszeit magst du am liebsten?", "Which season do you like best?"],
    ],
  },
];
