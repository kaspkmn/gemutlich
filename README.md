# Deutsch Quest

Your own German course, from total beginner up. Next.js on Vercel, with Supabase syncing your progress between your phone and computer.

## What it costs

Everything is free except the Write tab. GitHub, Vercel and Supabase all work on their free plans. The Write tab uses Claude to correct your writing, which needs an Anthropic API key with paid credit. That's optional, and the rest of the site works fully without it.

## What's inside

- **Course**: 16 lessons (about 280 words) from pronunciation to finding your way around town. Each one has words with audio, short grammar notes, and a round of about 20 exercises.
- **Flashcards**: spaced repetition. Finishing a lesson adds its words to your deck, and cards come back right before you'd forget them.
- **Practice**: typing the German, dictation, verb endings, sentence building, der/die/das drills, listening, and a "tricky words" round.
- **Tests**: graded tests with no hints. Multiple choice, written answers, listening and sentence building, with a rank (S, A, B, C, D) and a full answer review at the end. There's a test for every lesson, a boss test after every 4 lessons, a final exam, and a custom test builder. 70% to pass.
- **Write** (optional, needs an API key): translate sentences, answer questions, keep a journal, or chat, with every mistake explained.
- **Progress**: levels and XP, a daily quest, streaks, a study calendar, and test results.

Audio uses your browser's built-in German voice, so there's nothing to pay for. On iPhone you can download a nicer German voice in Settings > Accessibility > Spoken Content > Voices > German.

## Setup

### 1. Supabase

1. Create a new project (or use an existing one) at supabase.com.
2. Open **SQL Editor**, paste in `supabase/schema.sql`, and run it. This makes one table, `german_progress`, locked down so only your site's server can touch it.
3. From **Project Settings > API**, copy the **Project URL** and the **secret key** (starts with `sb_secret_`; the older `service_role` key works too).

### 2. Anthropic API key (optional, costs money)

Only the Write tab needs this. Skip it and everything else works.

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

- `content/units.ts`: every lesson, word, grammar note and drill. Add words or fix anything here.
- `content/verbs.ts`: verb conjugations used by the verb-endings practice.
- `content/course.ts`: chat scenarios for the Write section.
- `lib/ai.ts`: the instructions Claude follows when grading and chatting.
- `app/globals.css`: colors and styles. Gender colors are `--der`, `--die`, `--das` and `--pl`.

Your progress is one JSON document. Settings > Download a backup saves a copy anytime.
