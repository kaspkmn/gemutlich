/**
 * Why each lesson question's answer is right, keyed by the question's German
 * sentence (fill and build) or its question text (choice).
 * Shown whenever you get one wrong.
 */
import { IS_ES } from "@/lib/lang";

const DE_WHY: Record<string, string> = {
  // ── 1. Sounds ──
  'Which word has the "ts" sound?': "German z is always pronounced ts, like the end of \"cats\". Zeit sounds like \"tsite\".",
  '"Wein" sounds most like...': "w is said like an English v, and ei sounds like \"eye\". Put together: \"vine\".",
  'Which pair sounds like "ee"?': "Say the second letter of the pair: ie sounds like \"ee\" (Liebe), ei sounds like \"eye\" (nein).",
  'Which word has the "oy" sound?': "eu (and äu) sound like \"oy\". Leute is said \"LOY-tuh\".",
  'In "Vogel", the v sounds like...': "In most German words v is said like f. Vogel sounds like \"FOH-gel\". (In some borrowed words, like Vase, it's a v.)",
  "If you can't type ß, you can write...": "ß is just a sharp double s, so ss is the accepted way to write it without the special key: Straße = Strasse.",

  // ── 2. Greetings ──
  "Guten ___! Wie geht's?": "Guten Morgen is \"good morning\". Gute Nacht is only for going to bed, and Tschüss and Bitte aren't greetings.",
  "___, danke.": "\"Good, thanks\" is Gut, danke. Gut answers \"how are you?\".",
  "Guten Abend, wie geht es Ihnen?": "The greeting comes first, then the question. In a question with a question word (wie), the verb (geht) comes right after it.",
  "Danke, bis morgen!": "Danke first, then bis morgen (until tomorrow), which is how you say \"see you tomorrow\".",
  "A stranger thanks you. You reply:": "Bitte means \"you're welcome\" when someone thanks you. Danke would be thanking them back.",
  "You meet a new coworker's manager. Which is the safer question?": "With people you don't know well, or someone senior, use the formal Sie. Its form of \"how are you\" is Wie geht es Ihnen?",

  // ── 3. Introducing yourself ──
  "Ich ___ Anna.": "\"My name is\" is ich heiße (literally \"I am called\"). With ich, verbs end in -e: heiße.",
  "Woher ___ du?": "With du, verbs end in -st: du kommst.",
  "Ich ___ in Berlin.": "With ich, verbs end in -e: ich wohne.",
  "___ du Englisch?": "sprechen changes its vowel e → i for du and er/sie/es: du sprichst. In a yes/no question the verb goes first.",
  "Ich komme aus den USA.": "The USA is plural in German (die USA), and after aus it becomes den USA. Statement order: subject, verb, then the rest.",
  "Freut mich, ich heiße Max.": "Freut mich (nice to meet you) is a fixed phrase. Then ich + verb + name.",
  "Langsam, bitte. Ich lerne Deutsch.": "Two short sentences. In the second, the verb (lerne) comes second, right after ich.",

  // ── 4. Numbers ──
  "What is 45?": "Past 20, German says the ones first: fünf-und-vierzig (five-and-forty), written as one word.",
  "What is siebzehn?": "siebzehn = sieben + zehn = 17. Numbers 13 to 19 end in -zehn. (70 is siebzig.)",
  "What is 32?": "Ones first, then tens: zwei-und-dreißig. Thirty is the odd one spelled with ß: dreißig.",
  '"drei Euro fünfzig" costs...': "Euros first, then cents: drei Euro fünfzig = €3.50. The word Cent is usually left out.",
  "Ich bin dreißig Jahre ___.": "Ages use alt: Ich bin dreißig Jahre alt, literally \"I am thirty years old\".",
  "Wie alt bist du?": "Question word (Wie alt), then the verb (bist), then the subject (du).",

  // ── 5. sein ──
  "Ich ___ müde.": "sein (to be) is irregular: ich bin, du bist, er ist, wir sind, ihr seid, sie sind.",
  "Wir ___ hier.": "wir always uses the same form as the infinitive's plural: wir sind.",
  "Er ___ krank.": "er, sie and es all take ist.",
  "Ihr ___ sehr nett.": "ihr (you all) takes seid. Don't mix it up with seit (since), which sounds the same.",
  "Du ___ glücklich.": "du takes bist. Most du forms end in -st, and bist does too.",
  "Ich bin müde, aber glücklich.": "Subject, verb, then the description. aber (but) joins the two adjectives and gets a comma before it.",
  "Sie ist auch sehr nett.": "Sie + ist means she is. auch (also) comes right after the verb, before what's being described.",

  // ── 6. der, die, das ──
  "Das ist ___ Hund.": "Hund is masculine (der Hund), and \"a\" for der and das words is ein.",
  "Das ist ___ Lampe.": "Lampe is feminine (die Lampe), and \"a\" for die words is eine.",
  "___ Katze ist müde.": "Katze ends in -e, and most nouns ending in -e are feminine: die Katze.",
  "___ Zimmer ist sehr schön.": "Zimmer is neuter: das Zimmer. It ends in -er, which is often der, so it's one to memorize.",
  "Which ending is always das?": "Nouns ending in -chen (and -lein) are always neuter, even das Mädchen (the girl).",
  "Der Hund ist müde.": "Article and noun go together at the start (Der Hund), then the verb second.",
  "Das ist eine Wohnung.": "Wohnung ends in -ung, which is always feminine, so \"a\" is eine.",

  // ── 7. Family ──
  "Ich ___ zwei Schwestern.": "haben (to have): ich habe, du hast, er hat, wir haben, ihr habt, sie haben.",
  "Er ___ ein Kind.": "With er/sie/es, haben becomes hat (not habt, which is for ihr).",
  "Das ist ___ Mutter.": "Mutter is feminine (die Mutter), so \"my\" takes an -e: meine Mutter.",
  "Das ist ___ Vater.": "Vater is masculine (der Vater). As the subject (after Das ist), \"my\" stays mein.",
  "Ich habe ___ Bruder.": "Bruder is masculine. After haben he's the object (accusative), and ein becomes einen.",
  "Hast du Geschwister?": "A yes/no question starts with the verb: Hast du ...?",
  "Meine Schwester heißt Anna.": "Schwester is feminine, so meine. Subject first, then the verb heißt second.",

  // ── 8. Everyday verbs ──
  "Wir ___ Deutsch.": "With wir, the verb looks just like the infinitive: wir lernen.",
  "Er ___ Kaffee.": "With er/sie/es, regular verbs end in -t: er trinkt.",
  "Du ___ ein Buch.": "lesen changes e → ie for du and er/sie/es: du liest. Because the stem ends in s, du only adds -t.",
  "Sie ___ sehr gern.": "At the start of a sentence Sie is capitalized, but here it means she, so the verb takes -t: sie kocht. gern after the verb means she likes doing it.",
  "Was ___ du?": "With du, verbs end in -st: du machst.",
  "Ich spiele gern Videospiele.": "Verb second (spiele), then gern right after it to say you like doing it, then what you play.",
  "Er arbeitet heute nicht.": "nicht goes at the end when it negates the whole sentence. The time word (heute) comes before it.",

  // ── 9. Food ──
  "Ich ___ einen Tee, bitte.": "To order politely use möchte (would like). With ich it's möchte, no ending added.",
  "Ich habe ___.": "German says you have hunger: Ich habe Hunger. (Hunger is a noun, so it's capitalized.)",
  "Das Hähnchen ist sehr ___!": "lecker means tasty. Hunger and Durst are nouns, not descriptions.",
  "Ich möchte ___ Kaffee.": "Kaffee is masculine (der Kaffee). When you order it, it's the object, so ein becomes einen.",
  "Die Rechnung, bitte.": "A fixed phrase: the thing you want, then bitte.",
  "Ich esse gern Nudeln.": "Verb second (esse), gern right after it, then the food.",
  "Ich möchte ein Wasser, bitte.": "Wasser is neuter (das Wasser), so ein stays ein even as the object.",

  // ── 10. Time ──
  "Ich arbeite ___ Montag.": "Days take am (an dem): am Montag. Clock times take um, months and seasons take im.",
  "Der Film beginnt ___ acht Uhr.": "Clock times take um: um acht Uhr. am is for days, im for months.",
  "Heute ___ ich.": "The verb must be second. When a time word starts the sentence, the verb comes next and the subject moves after it: Heute arbeite ich.",
  '"halb vier" means...': "halb looks ahead to the next hour: halb vier is half way to four, so 3:30.",
  '"Viertel vor zehn" is...': "Viertel vor zehn is a quarter before ten: 9:45. Viertel nach would be after the hour.",
  "Heute ist Freitag.": "Time word first, verb second, then the rest.",
  "Am Wochenende schlafe ich lange.": "Am Wochenende starts the sentence, so the verb (schlafe) comes next and ich moves after it.",

  // ── 11. Colors & describing ──
  "Die Katze ist ___.": "After ist, describing words never change: schwarz. The sentence means the cat is black.",
  "Das ist zu ___!": "zu means too, and teuer means expensive: \"That's too expensive!\"",
  "Mein Opa ist ___.": "For people, the opposite of jung (young) is alt (old). neu is for things.",
  "Which is the opposite of neu?": "neu (new) pairs with alt (old) for things. For people, alt pairs with jung.",
  "Mein Auto ist alt, aber gut.": "Subject (Mein Auto), verb (ist), then the descriptions joined with aber.",
  "Der Hund ist sehr groß.": "sehr (very) goes right before the word it strengthens.",

  // ── 12. Questions ──
  "___ wohnst du?": "wo asks where something or someone is. (wer means who, even though it looks like \"where\".)",
  "___ kommst du?": "woher asks where from. Woher kommst du? means \"Where are you from?\"",
  "___ heißt du?": "German asks \"how are you called\": Wie heißt du? Was would be \"what\".",
  "___ kostet das?": "wie viel means how much. (You'll also hear Was kostet das?, which means the same thing.)",
  "___ gehst du?": "wohin asks where to (movement). wo is for where something is, woher for where from.",
  '"Wer ist das?" means...': "wer means who. It's a false friend: it looks like \"where\", but where is wo.",
  "Wann kommst du nach Hause?": "Question word (Wann), verb (kommst), subject (du), then the rest.",

  // ── 13. Objects & den ──
  "Ich brauche ___ Mantel.": "Mantel is masculine. As the thing you need, it's the object, so ein becomes einen.",
  "Ich suche ___ Jacke.": "Jacke is feminine. Feminine words don't change as the object: eine stays eine.",
  "Er nimmt ___ Hut.": "Hut is masculine and it's the thing being taken (object), so der becomes den.",
  "Siehst du ___?": "As an object, er (he) becomes ihn (him).",
  "Ich ___ dich.": "With ich, verbs end in -e: ich liebe. dich is the object form of du.",
  "Wir besuchen unsere Oma.": "Verb second (besuchen). Oma is feminine, so \"our\" is unsere.",
  "Ich suche den Schlüssel.": "Schlüssel is masculine and it's the object, so it's den Schlüssel.",

  // ── 14. No, not & doch ──
  "Ich habe ___ Zeit.": "Use kein for nouns. Zeit is feminine, so keine.",
  "Das ist ___ teuer.": "teuer is a describing word, not a noun, so use nicht. kein only goes with nouns.",
  "Ich habe ___ Hund.": "Hund is a masculine noun and the object of habe, so kein gets the -en ending: keinen.",
  "Er kommt heute ___.": "To negate a verb or the whole sentence, use nicht, and put it at the end.",
  '"Hast du keinen Hunger?" You ARE hungry. You say:': "When a question is negative and your answer is yes, say doch. Ja would sound like you agree that you're not hungry.",
  "Ich verstehe das nicht.": "nicht goes after the object (das) at the end of the sentence.",
  "Das ist kein Problem.": "Problem is a noun, so it's kein, not nicht.",

  // ── 15. Can, must, want ──
  "Ich ___ heute arbeiten.": "müssen with ich is muss. Modal verbs don't add -e for ich.",
  "___ du tanzen?": "können with du is kannst. In a yes/no question it goes first.",
  "Er ___ nach Hause gehen.": "wollen with er is will (it means \"wants\", not \"will\"). ich and er forms are the same for modals.",
  "Hier ___ man nicht rauchen.": "dürfen nicht means \"not allowed to\". man works like er: man darf.",
  "Ich kann nicht schwimmen.": "The modal (kann) is second, the main verb (schwimmen) goes to the very end, and nicht comes before it.",
  "Wir müssen jetzt gehen.": "The modal (müssen) is second and the main verb (gehen) waits at the end.",
  "Kannst du morgen kommen?": "Yes/no question: the modal (Kannst) first, the main verb (kommen) last.",

  // ── 16. Around town ──
  "Wie komme ich ___ Bahnhof?": "Bahnhof is masculine. zu + dem shortens to zum.",
  "Wie komme ich ___ Apotheke?": "Apotheke is feminine. zu + der shortens to zur.",
  "Ich fahre mit ___ Bus.": "mit always takes the dative. Bus is masculine, so der becomes dem.",
  "Ich fahre mit ___ U-Bahn.": "mit takes the dative. U-Bahn is feminine, and feminine die becomes der in the dative.",
  "Gehen Sie geradeaus und dann links.": "Instructions with Sie start with the verb: Gehen Sie ...",
  "Ist das weit?": "A yes/no question starts with the verb.",

  // ── 17. Daily routine ──
  "Ich ___ um sieben Uhr auf.": "aufstehen is separable: the auf goes to the end, and the stehen part takes the ich ending: ich stehe ... auf.",
  "Kommst du ___?": "mitkommen (to come along) is separable. The mit part goes to the end.",
  "Er sieht jeden Abend ___.": "fernsehen (to watch TV) is separable. The fern part goes to the end.",
  "Der Film fängt um neun ___.": "anfangen (to start) is separable. The an part goes to the end.",
  "Ich muss morgen früh ___.": "With a modal (muss), the second verb goes to the end in one piece: aufstehen.",
  "Ich rufe dich morgen an.": "anrufen splits: rufe is second, an goes to the very end.",
  "Wir kaufen am Samstag ein.": "einkaufen splits: kaufen is second, ein goes to the very end.",
  "Zuerst dusche ich, dann frühstücke ich.": "Zuerst and dann each take first place, so the verb comes right after them and ich follows.",
  "Where does the prefix of a separable verb usually go?": "In a normal sentence the prefix (auf, an, ein, mit...) breaks off and goes to the end: Ich stehe um sieben auf.",

  // ── 18. The past with haben ──
  "Ich habe gestern Pizza ___.": "essen is irregular: its past participle is gegessen (ge + gess + en).",
  "Wir ___ einen Film gesehen.": "sehen uses haben in the past, and with wir that's haben.",
  "Hast du das Buch schon ___?": "lesen is irregular: gelesen (ge + les + en).",
  "Er hat viel ___.": "arbeiten is regular: ge + arbeit + et. The stem ends in t, so it adds -et: gearbeitet.",
  "Was hast du am Wochenende ___?": "machen is regular: ge + mach + t = gemacht.",
  "Ich habe Kaffee getrunken.": "haben is second, the participle (getrunken) goes to the end.",
  "Sie hat einen Brief geschrieben.": "hat is second, the object in the middle, the participle at the end.",
  "Was hast du gestern gemacht?": "Question word, then hast, then du, with the participle at the very end.",
  "In the Perfekt, where does the past participle go?": "haben or sein takes the normal verb spot, and the participle waits at the very end: Ich habe ... gegessen.",

  // ── 19. The past with sein ──
  "Ich ___ nach Berlin gefahren.": "fahren is movement from one place to another, so its past uses sein: ich bin gefahren.",
  "Wir sind ins Kino ___.": "gehen is irregular: gegangen.",
  "Was ist ___?": "passieren ends in -ieren, so its participle has no ge: passiert. It uses sein: Was ist passiert?",
  "Gestern ___ ich krank.": "For \"was\", German uses war rather than the Perfekt: ich war.",
  "Er ___ keine Zeit.": "For \"had\", German uses hatte: er hatte. war would mean \"was\".",
  "Ich bin um sechs Uhr ___.": "Separable verbs put ge between the prefix and the stem: auf-ge-standen.",
  "Wir sind nach Deutschland geflogen.": "fliegen is movement, so sind. The participle geflogen goes to the end.",
  "Ich war gestern sehr müde.": "war takes the verb spot, then the time, then the description.",
  "Which verb uses sein in the past?": "Verbs of moving from place to place use sein: ich bin gefahren. essen, kaufen and lesen all use haben.",

  // ── 20. Dative ──
  "Ich fahre mit ___ Auto.": "mit always takes the dative. Auto is neuter, and das becomes dem.",
  "Ich bin bei ___ Ärztin.": "bei takes the dative. Ärztin is feminine, and die becomes der.",
  "Ich gehe ___ Hause.": "Going home is nach Hause. zu Hause is for being at home.",
  "Wir sind heute ___ Hause.": "Being at home is zu Hause. nach Hause is for going home.",
  "Das Geschenk ist von ___ Kollegin.": "von takes the dative. Kollegin is feminine, and eine becomes einer.",
  "Ich lerne ___ drei Monaten Deutsch.": "seit says how long something has been going on, with the present tense. für would sound like a planned period.",
  "Ich fahre mit dem Bus zur Arbeit.": "mit dem Bus (dative after mit), then zur Arbeit (zu der, because Arbeit is feminine).",
  "Er kommt aus der Schweiz.": "Die Schweiz is one of the few countries with an article. After aus it becomes der Schweiz.",
  "After mit, der Bus becomes...": "mit always takes the dative, and masculine der becomes dem.",

  // ── 21. To me, to you ──
  "Kannst du ___ helfen?": "helfen always takes the dative, so me is mir (not mich).",
  "Das Buch gehört ___.": "gehören takes the dative. He becomes ihm in the dative.",
  "Die Schuhe ___ mir.": "With gefallen, the thing you like is the subject. Die Schuhe is plural, so the verb is plural: gefallen.",
  "Wie geht es ___?": "German asks \"how goes it to you\", so you is the dative dir.",
  "___ ist kalt.": "Feelings like being cold use the dative: Mir ist kalt. Ich bin kalt would describe your personality.",
  "Das Essen schmeckt mir sehr gut.": "schmecken takes the dative (mir). The food is the subject.",
  "Die Hose passt mir nicht.": "passen takes the dative (mir). nicht goes at the end.",
  '"Der Film gefällt mir" means...': "gefallen flips the sentence: literally \"the movie pleases me\", which is how German says \"I like the movie\".",

  // ── 22. Where things are ──
  "Die Katze schläft auf ___ Sofa.": "For where something is, auf takes the dative. Sofa is neuter, so das becomes dem.",
  "Der Hund liegt unter ___ Tisch.": "Where something is takes the dative. Tisch is masculine, so der becomes dem.",
  "Die Milch ist ___ Kühlschrank.": "in + dem shortens to im. Kühlschrank is masculine (der Schrank), and location takes the dative.",
  "Das Bild hängt an ___ Wand.": "Wand is feminine. For location, an takes the dative, and die becomes der.",
  "Das Buch ___ auf dem Tisch.": "Flat things lie: liegen. With das Buch (es) it's liegt.",
  "Die Lampe steht neben dem Bett.": "Upright things stand (steht). neben takes the dative for location: dem Bett.",
  "Mein Handy liegt in der Küche.": "Küche is feminine, and in takes the dative for location: in der Küche.",
  '"Wo ist die Katze? ___ dem Sofa." (under)': "unter means under. auf is on, neben next to, hinter behind.",

  // ── 23. Because & that ──
  "Ich lerne Deutsch, weil ich nach Deutschland ___.": "After weil, the conjugated verb goes to the end of that part: ..., weil ich nach Deutschland fliege.",
  "Ich glaube, dass er heute ___.": "After dass the verb goes to the end, and with er it's kommt.",
  "___ es regnet, bleibe ich zu Hause.": "wenn means if or when. The wenn part pushes its verb (regnet) to the end, and the main verb (bleibe) comes right after the comma.",
  "Ich bin müde, ___ ich habe schlecht geschlafen.": "The verb habe is in normal second place, so the word must be denn. weil would push the verb to the end.",
  "Ich ___, dass du recht hast.": "wissen is irregular: ich weiß, du weißt, er weiß.",
  "Ich bin froh, dass du hier bist.": "After dass, the verb (bist) goes to the end.",
  "Er ist traurig, weil sein Hund krank ist.": "After weil, the verb (ist) goes to the end.",
  'In "..., weil ich müde bin", where is the verb?': "weil, dass and wenn send the conjugated verb to the end of their part of the sentence.",

  // ── 24. Weather & comparing ──
  "Im Winter ___ es oft.": "Weather uses es with a verb: es schneit (it snows). Schnee is the noun.",
  "Heute ist es ___ als gestern.": "Comparing adds -er, and short words often add an umlaut: kalt → kälter. als means than.",
  "Im Sommer ist es ___.": "heiß means hot. kalt is cold, kühl is cool.",
  "Ich trinke ___ Kaffee als Tee.": "gern is irregular when comparing: gern → lieber → am liebsten. There is no \"gerner\".",
  "Mein Hund ist ___ als deine Katze.": "groß → größer (adds an umlaut). am größten would be \"the biggest\".",
  "Wie ist das Wetter heute?": "Question word, verb, subject, then the time.",
  "Im Herbst regnet es viel.": "Im Herbst takes first place, so the verb (regnet) comes next and es follows.",
  "Which season is der Herbst?": "der Herbst is fall. der Frühling is spring, der Sommer summer, der Winter winter.",
};

/** German reasons by question. Spanish lessons keep their reasons on each question instead. */
export const WHY: Record<string, string> = IS_ES ? {} : DE_WHY;
