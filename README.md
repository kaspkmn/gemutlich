# Deutsch · Español

Your own German and Spanish courses, from beginner toward A2. Next.js on Vercel, with Supabase syncing your progress between your phone and computer.

Switch languages with the DE / ES buttons at the top, or in Settings. Each language keeps its own lessons, flashcards, tests and mistake notebook. Your streak, XP and daily goal are shared. The Spanish course is Mexican Spanish (ustedes, el carro, Mexican voices).

## What it costs

Nothing. GitHub, Vercel and Supabase all work on their free plans, and every feature works without paying for anything.

The Write tab gets its feedback by opening claude.ai with your writing and tutor instructions filled in, which is covered by a Claude subscription. If you ever add an Anthropic API key (billed separately), feedback shows right inside the site instead. That's optional.

## What's inside

- **Today's session**: one button that builds a 10 to 15 minute session from due flashcards, your mistake notebook, your weakest area, and a little speaking.
- **Lessons**: 24 lessons per language (about 400 words each). German goes from pronunciation to the past tense, the dative and weil/dass. Spanish goes from pronunciation to ser vs. estar, gustar, stem-changing verbs, the preterite and object pronouns. Each has words with audio, short grammar notes and about 20 exercises.
- **Stories**: 10 short stories at your level. Tap any word for its meaning and add it to your flashcards. A new one opens as you finish lessons.
- **Listening**: 8 short conversations read aloud by two voices, with a slow mode, a transcript and questions.
- **Grammar**: every table from the lessons in one searchable page.
- **Genders**: a guide to der, die and das (or el and la): the endings and meanings that predict gender, how compounds work, a checker for any noun, and which of your nouns are exceptions.
- **Why it's wrong**: every wrong answer comes with the reason. Each lesson question has a written explanation, and the site also looks at what you actually answered (wrong gender, a missing umlaut, the du form instead of the er form, the verb in the wrong place) and explains that. Also in test results and the mistake notebook.
- **Flashcards**: spaced repetition. Lesson words go in automatically, plus anything you add yourself.
- **Mistake notebook**: everything you get wrong anywhere is saved. Get it right 3 times in a row and it's cleared.
- **Weak spots**: your recent accuracy in 9 areas (genders, verb forms, cases, listening...) with practice for each.
- **Speaking**: say words and sentences out loud and the site checks what it heard, using the speech recognition built into Chrome, Edge and Safari. There's also a shadowing mode.
- **Numbers & time**: hear or read prices, clock times (including halb vier) and phone numbers, and type the digits.
- **Practice drills**: typing, dictation, verb endings, sentences, der/die/das, listening.
- **Tests**: a test for every lesson, a review test after every 4 lessons, a final exam, and a custom test builder. No hints until the end, then every answer is shown.
- **Write**: translate sentences, answer questions, journal, or role-play a conversation.
- **Words & phrases**: search every word, and add your own phrases to your flashcards.

Audio uses your browser's built-in German voice. On iPhone you can download a nicer one in Settings > Accessibility > Spoken Content > Voices > German. Speech checking on iPhone works in Safari itself (not from the home screen icon).

## Setup

### 1. Supabase

1. Create a new project (or use an existing one) at supabase.com.
2. Open **SQL Editor**, paste in `supabase/schema.sql`, and run it. This makes one table, `german_progress`, locked down so only your site's server can touch it.
3. From **Project Settings > API**, copy the **Project URL** and the **secret key** (starts with `sb_secret_`; the older `service_role` key works too).

### 2. Anthropic API key (optional, costs money)

Skip this. Without it, the Write tab sends you to claude.ai for feedback for free. A key only moves that feedback inside the site.

1. Go to console.anthropic.com, add credit, and create an API key. This is billed separately from a Claude.ai subscription.
2. The default model is Claude Haiku 5.5, which is cheap per check.

### 3. GitHub and Vercel

1. Make a new GitHub repo and upload everything in this folder.
2. In Vercel, **Add New > Project**, import the repo.
3. Under **Environment Variables** add:

| Name | Value |
| --- | --- |
| `APP_PIN` | Your 4-digit PIN |
| `AUTH_SECRET` | Any long random string, 32+ characters |
| `SUPABASE_URL` | From step 1 |
| `SUPABASE_SECRET_KEY` | From step 1 |
| `ANTHROPIC_API_KEY` | From step 2 (optional) |

4. Deploy. Open the site, enter your PIN, and you're in. On your phone, use **Share > Add to Home Screen** and it opens like an app.

Changing an environment variable later? Redeploy in Vercel so it takes effect.

## Running it on your computer

```bash
npm install
cp .env.example .env.local   # then fill in APP_PIN and AUTH_SECRET at least
npm run dev
```

Without Supabase settings, local progress is saved to `.data/progress.json` so you can try it out right away.

## Where things live

- `content/units.ts` and `content/units2.ts`: every German lesson, word, grammar note and drill.
- `content/es/`: the Spanish lessons, verbs, stories, conversations and chat scenarios.
- `lib/lang.ts`: the language switch and everything that differs per language (letters, articles, voices).
- `content/stories.ts` and `content/dialogues.ts`: the reading stories and listening conversations.
- `content/verbs.ts`: verb conjugations used by the verb-endings practice.
- `content/why.ts`: the written reason behind every lesson question.
- `lib/explain.ts` and `lib/gender-rules.ts`: the rules that explain mistakes and noun genders.
- `content/course.ts`: chat scenarios for the Write section.
- `lib/ai.ts`: the instructions Claude follows when grading and chatting.
- `app/globals.css`: colors and styles. Gender colors are `--der`, `--die`, `--das` and `--pl`.

Your progress is one JSON document. Settings > Download a backup saves a copy anytime.
