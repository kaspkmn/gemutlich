# Gemütlich

Your own cozy corner for learning German, from total beginner up. Next.js on Vercel, Supabase for syncing progress between your phone and computer, and Claude for checking your writing.

## What's inside

- **Course**: 16 lessons (about 280 words) from pronunciation to finding your way around town. Each one has words with audio, short grammar notes, and a round of about 20 exercises.
- **Flashcards**: spaced repetition. Finishing a lesson adds its words to your deck, and cards come back right before you'd forget them.
- **Practice**: typing the German, dictation (hear it, type it), verb endings, sentence building, der/die/das drills, listening, and a "tricky words" round.
- **Write** (uses Claude): translate sentences, answer questions about your life, keep a short journal, or chat in a café, bakery, or anywhere. Your mistakes are corrected and explained, and you can add new words straight to your flashcards.
- **Progress**: daily goal (the coffee cup), streaks, a study calendar, and per-lesson progress.

Audio uses your browser's built-in German voice, so there's nothing extra to pay for. On iPhone you can download a nicer German voice in Settings > Accessibility > Spoken Content > Voices > German.

## Setup

### 1. Supabase

1. Create a new project (or use an existing one) at supabase.com.
2. Open **SQL Editor**, paste in `supabase/schema.sql`, and run it. This makes one table, `german_progress`, locked down so only your site's server can touch it.
3. From **Project Settings > API**, copy the **Project URL** and the **secret key** (starts with `sb_secret_`; the older `service_role` key works too).

### 2. Anthropic API key (for the Write section)

1. Go to console.anthropic.com, add a little credit, and create an API key.
2. This is billed separately from a Claude.ai subscription. The default model is Claude Haiku 5.5, which is very cheap: a whole evening of writing practice costs pennies.
3. Want more detailed feedback? Set `ANTHROPIC_MODEL=claude-sonnet-5-5` (costs more per check).

Everything else in the app works without this key; only the Write section needs it.

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
| `ANTHROPIC_API_KEY` | From step 2 |

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
