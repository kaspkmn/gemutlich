/** Short listening conversations between two speakers, each with comprehension questions. */

export interface DialogueLine {
  /** 0 = first speaker, 1 = second speaker */
  who: 0 | 1;
  de: string;
  en: string;
}

export interface Dialogue {
  id: string;
  title: string;
  /** unlocks after this lesson */
  after: string;
  setting: string;
  speakers: [string, string];
  lines: DialogueLine[];
  questions: { q: string; options: string[]; answer: string }[];
}

const L = (who: 0 | 1, de: string, en: string): DialogueLine => ({ who, de, en });

export const DIALOGUES: Dialogue[] = [
  {
    id: "neighbors",
    title: "Good morning",
    after: "greetings",
    setting: "Two neighbors run into each other in the morning.",
    speakers: ["Frau Weber", "Herr Klein"],
    lines: [
      L(0, "Guten Morgen, Herr Klein!", "Good morning, Mr. Klein!"),
      L(1, "Guten Morgen, Frau Weber. Wie geht es Ihnen?", "Good morning, Mrs. Weber. How are you?"),
      L(0, "Gut, danke. Und Ihnen?", "Good, thanks. And you?"),
      L(1, "Es geht. Ich bin ein bisschen müde.", "So-so. I'm a bit tired."),
      L(0, "Oh, das tut mir leid.", "Oh, I'm sorry."),
      L(1, "Kein Problem. Bis später!", "No problem. See you later!"),
      L(0, "Tschüss, Herr Klein!", "Bye, Mr. Klein!"),
    ],
    questions: [
      { q: "What time of day is it?", options: ["Morning", "Afternoon", "Evening", "Night"], answer: "Morning" },
      { q: "How is Herr Klein feeling?", options: ["A bit tired", "Great", "Sick", "Angry"], answer: "A bit tired" },
      { q: "Do they speak formally (Sie) or informally (du)?", options: ["Formally (Sie)", "Informally (du)"], answer: "Formally (Sie)" },
    ],
  },
  {
    id: "party",
    title: "At a party",
    after: "intro",
    setting: "Jonas meets Sara at a friend's party.",
    speakers: ["Jonas", "Sara"],
    lines: [
      L(0, "Hallo! Ich bin Jonas. Wie heißt du?", "Hi! I'm Jonas. What's your name?"),
      L(1, "Hallo Jonas, ich heiße Sara.", "Hi Jonas, my name is Sara."),
      L(0, "Woher kommst du, Sara?", "Where are you from, Sara?"),
      L(1, "Ich komme aus Spanien. Und du?", "I'm from Spain. And you?"),
      L(0, "Ich komme aus Hamburg, aber ich wohne in Berlin.", "I'm from Hamburg, but I live in Berlin."),
      L(1, "Ich wohne auch in Berlin! Ich lerne hier Deutsch.", "I live in Berlin too! I'm learning German here."),
      L(0, "Du sprichst sehr gut Deutsch!", "You speak German really well!"),
      L(1, "Danke! Freut mich, Jonas.", "Thanks! Nice to meet you, Jonas."),
    ],
    questions: [
      { q: "Where is Sara from?", options: ["Spain", "Hamburg", "Berlin", "Italy"], answer: "Spain" },
      { q: "Where does Jonas live?", options: ["Berlin", "Hamburg", "Munich", "Spain"], answer: "Berlin" },
      { q: "What is Sara doing in Berlin?", options: ["Learning German", "Working", "Visiting family", "On vacation"], answer: "Learning German" },
    ],
  },
  {
    id: "number",
    title: "Your number?",
    after: "numbers",
    setting: "Lukas and Mia swap ages and phone numbers.",
    speakers: ["Lukas", "Mia"],
    lines: [
      L(0, "Wie alt bist du, Mia?", "How old are you, Mia?"),
      L(1, "Ich bin zweiundzwanzig. Und du?", "I'm twenty-two. And you?"),
      L(0, "Ich bin dreißig.", "I'm thirty."),
      L(1, "Hast du eine Handynummer?", "Do you have a cell number?"),
      L(0, "Ja: null eins fünf sieben, drei acht, zwei vier.", "Yes: zero one five seven, three eight, two four."),
      L(1, "Noch einmal, bitte. Langsam!", "Once more, please. Slowly!"),
      L(0, "Null eins fünf sieben. Drei acht. Zwei vier.", "Zero one five seven. Three eight. Two four."),
      L(1, "Danke! Ich rufe dich an.", "Thanks! I'll call you."),
    ],
    questions: [
      { q: "How old is Mia?", options: ["22", "30", "32", "20"], answer: "22" },
      { q: "How old is Lukas?", options: ["30", "22", "13", "40"], answer: "30" },
      { q: "What are Lukas's last two digits?", options: ["2 4", "3 8", "5 7", "4 2"], answer: "2 4" },
    ],
  },
  {
    id: "order",
    title: "Ordering",
    after: "food",
    setting: "A customer orders at a café.",
    speakers: ["Kellner (server)", "Kundin (customer)"],
    lines: [
      L(0, "Guten Tag! Was möchten Sie?", "Hello! What would you like?"),
      L(1, "Ich möchte einen Tee, bitte.", "I'd like a tea, please."),
      L(0, "Mit Milch?", "With milk?"),
      L(1, "Nein, ohne Milch. Und ein Stück Kuchen, bitte.", "No, without milk. And a piece of cake, please."),
      L(0, "Apfelkuchen oder Schokoladenkuchen?", "Apple cake or chocolate cake?"),
      L(1, "Apfelkuchen, bitte.", "Apple cake, please."),
      L(0, "Gern. Das macht sieben Euro fünfzig.", "Sure. That's seven euros fifty."),
      L(1, "Hier, bitte. Stimmt so.", "Here you go. Keep the change."),
    ],
    questions: [
      { q: "What does she drink?", options: ["Tea without milk", "Tea with milk", "Coffee", "Water"], answer: "Tea without milk" },
      { q: "Which cake does she pick?", options: ["Apple cake", "Chocolate cake", "Cheesecake", "No cake"], answer: "Apple cake" },
      { q: "How much does it cost?", options: ["€7.50", "€5.70", "€17.50", "€7.15"], answer: "€7.50" },
    ],
  },
  {
    id: "plans",
    title: "Weekend plans",
    after: "time",
    setting: "Tim asks Lea to go to the movies.",
    speakers: ["Tim", "Lea"],
    lines: [
      L(0, "Hast du am Samstag Zeit?", "Are you free on Saturday?"),
      L(1, "Am Samstag? Nein, leider nicht. Ich arbeite.", "Saturday? No, unfortunately not. I'm working."),
      L(0, "Und am Sonntag?", "And on Sunday?"),
      L(1, "Am Sonntag habe ich Zeit. Was machen wir?", "I'm free on Sunday. What should we do?"),
      L(0, "Wir gehen ins Kino. Der Film beginnt um acht Uhr.", "Let's go to the movies. The movie starts at eight."),
      L(1, "Um acht? Das ist gut. Wo treffen wir uns?", "At eight? That works. Where should we meet?"),
      L(0, "Vor dem Kino, um Viertel vor acht.", "In front of the movie theater, at a quarter to eight."),
      L(1, "Super, bis Sonntag!", "Great, see you Sunday!"),
    ],
    questions: [
      { q: "Why can't Lea go on Saturday?", options: ["She's working", "She's sick", "She's traveling", "She has a date"], answer: "She's working" },
      { q: "What time does the movie start?", options: ["8:00", "7:45", "8:15", "7:30"], answer: "8:00" },
      { q: "When do they meet?", options: ["7:45", "8:00", "8:15", "7:30"], answer: "7:45" },
    ],
  },
  {
    id: "station",
    title: "Directions",
    after: "town",
    setting: "A tourist asks a man the way to the station.",
    speakers: ["Touristin", "Mann"],
    lines: [
      L(0, "Entschuldigung, wie komme ich zum Bahnhof?", "Excuse me, how do I get to the train station?"),
      L(1, "Zum Bahnhof? Gehen Sie hier geradeaus.", "To the station? Go straight ahead here."),
      L(1, "Dann die zweite Straße links.", "Then the second street on the left."),
      L(0, "Die zweite Straße links. Ist das weit?", "The second street on the left. Is it far?"),
      L(1, "Nein, nicht weit. Zehn Minuten zu Fuß.", "No, not far. Ten minutes on foot."),
      L(0, "Gibt es hier auch eine Apotheke?", "Is there a pharmacy around here too?"),
      L(1, "Ja, die Apotheke ist neben dem Bahnhof.", "Yes, the pharmacy is next to the station."),
      L(0, "Vielen Dank!", "Thanks a lot!"),
      L(1, "Bitte schön!", "You're welcome!"),
    ],
    questions: [
      { q: "Where does she want to go?", options: ["The train station", "The pharmacy", "A café", "The airport"], answer: "The train station" },
      { q: "How far is it?", options: ["Ten minutes on foot", "Two minutes", "Twenty minutes by bus", "Very far"], answer: "Ten minutes on foot" },
      { q: "Where is the pharmacy?", options: ["Next to the station", "Behind the station", "On the left", "There isn't one"], answer: "Next to the station" },
    ],
  },
  {
    id: "last-weekend",
    title: "How was your weekend?",
    after: "perfekt-sein",
    setting: "Two coworkers talk on Monday morning.",
    speakers: ["Max", "Julia"],
    lines: [
      L(0, "Na, wie war dein Wochenende?", "So, how was your weekend?"),
      L(1, "Super! Ich bin nach Köln gefahren.", "Great! I went to Cologne."),
      L(0, "Toll! Was hast du dort gemacht?", "Nice! What did you do there?"),
      L(1, "Ich habe meine Schwester besucht. Wir sind viel gelaufen und haben gut gegessen.", "I visited my sister. We walked a lot and ate well."),
      L(0, "Und wie war das Wetter?", "And how was the weather?"),
      L(1, "Am Samstag war es sonnig, aber am Sonntag hat es geregnet.", "On Saturday it was sunny, but on Sunday it rained."),
      L(0, "Ich bin zu Hause geblieben und habe viel geschlafen.", "I stayed home and slept a lot."),
      L(1, "Das klingt auch gut!", "That sounds good too!"),
    ],
    questions: [
      { q: "Where did Julia go?", options: ["Cologne", "Berlin", "Munich", "Hamburg"], answer: "Cologne" },
      { q: "Who did she visit?", options: ["Her sister", "Her brother", "Her parents", "A friend"], answer: "Her sister" },
      { q: "What did Max do?", options: ["Stayed home and slept", "Went to Cologne", "Worked", "Went to the movies"], answer: "Stayed home and slept" },
    ],
  },
  {
    id: "doctor",
    title: "At the doctor",
    after: "because",
    setting: "A patient explains what's wrong.",
    speakers: ["Ärztin (doctor)", "Patient"],
    lines: [
      L(0, "Guten Tag. Was fehlt Ihnen?", "Hello. What seems to be the problem?"),
      L(1, "Mir geht es nicht gut. Mein Kopf tut weh.", "I'm not feeling well. My head hurts."),
      L(0, "Seit wann haben Sie Kopfschmerzen?", "How long have you had a headache?"),
      L(1, "Seit zwei Tagen. Ich glaube, dass ich zu viel arbeite.", "For two days. I think I'm working too much."),
      L(0, "Schlafen Sie gut?", "Are you sleeping well?"),
      L(1, "Nein, ich schlafe schlecht, weil ich so gestresst bin.", "No, I'm sleeping badly because I'm so stressed."),
      L(0, "Sie brauchen Ruhe. Bleiben Sie drei Tage zu Hause.", "You need rest. Stay home for three days."),
      L(1, "Danke, Frau Doktor.", "Thank you, doctor."),
    ],
    questions: [
      { q: "What hurts?", options: ["The head", "The stomach", "The back", "The feet"], answer: "The head" },
      { q: "For how long?", options: ["Two days", "Two weeks", "Three days", "One day"], answer: "Two days" },
      { q: "What does the doctor tell him to do?", options: ["Stay home for three days", "Work less for a week", "Take a vacation", "Come back tomorrow"], answer: "Stay home for three days" },
    ],
  },
];
