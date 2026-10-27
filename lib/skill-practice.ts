import { ALL_SENTENCES, ALL_WORDS, UNITS } from "@/content/course";
import type { CourseWord } from "@/content/types";
import {
  Exercise,
  buildExercise,
  cloneExercise,
  conjExercise,
  dictationExercise,
  drillExercises,
  genderExercise,
  genderable,
  listenExercise,
  mcExercise,
  practiceExercises,
  sample,
  shuffle,
  typeEnExercise,
  typeExercise,
  typeable,
} from "./exercises";
import { VERBS } from "@/content/verbs";
import { pickMistakes, skillOf, type MistakeEntry, type Skill } from "./mistakes";
import { tokens } from "./answers";

/** A short round aimed at one skill, using lessons you've finished. Numbers and speaking have their own pages. */
export function practiceForSkill(
  skill: Skill,
  deck: CourseWord[],
  doneUnits: string[],
  mistakes: Record<string, MistakeEntry>,
  size = 10
): Exercise[] {
  const units = UNITS.filter((u) => doneUnits.includes(u.id));
  const pool = deck.length >= 4 ? deck : ALL_WORDS.filter((w) => doneUnits.includes(w.unitId));
  // start with up to 3 notebook items for this skill
  const fromNotebook = pickMistakes(mistakes, 3, skill).map((m) => cloneExercise(m.ex));
  const n = size - fromNotebook.length;
  let fresh: Exercise[] = [];

  switch (skill) {
    case "vocab":
      fresh = sample(pool, n).map((w, i) => (i % 3 === 2 ? typeEnExercise(w) : mcExercise(w, i % 2 ? "en-de" : "de-en", pool)));
      break;
    case "spelling":
      fresh = sample(pool.filter(typeable), n).map(typeExercise);
      break;
    case "gender":
      fresh = sample(pool.filter(genderable), n).map(genderExercise);
      break;
    case "verbs": {
      const verbs = VERBS.filter((v) => doneUnits.includes(v.unitId));
      const drills = units.flatMap((u) => drillExercises(u, Math.random() < 0.5)).filter((e) => skillOf(e) === "verbs");
      fresh = shuffle([...sample(drills, Math.ceil(n / 2)), ...Array.from({ length: n }, () => conjExercise(sample(verbs.length ? verbs : VERBS.slice(0, 5), 1)[0]))]).slice(0, n);
      break;
    }
    case "cases": {
      const drills = units.flatMap((u) => [...drillExercises(u), ...drillExercises(u, true)]).filter((e) => skillOf(e) === "cases");
      fresh = sample(drills, n);
      break;
    }
    case "wordorder": {
      const sentences = ALL_SENTENCES.filter((s) => doneUnits.includes(s.unitId) && tokens(s.de).length >= 3 && tokens(s.de).length <= 9);
      const all = sentences.map((s) => s.de);
      fresh = sample(sentences, n).map((s) => buildExercise(s.de, s.en, all.filter((x) => x !== s.de)));
      break;
    }
    case "listening": {
      const sentences = ALL_SENTENCES.filter((s) => doneUnits.includes(s.unitId) && tokens(s.de).length <= 7);
      fresh = shuffle([
        ...sample(pool, Math.ceil(n / 2)).map((w) => listenExercise(w, pool)),
        ...sample(sentences, Math.floor(n / 2)).map((s) => dictationExercise(s.de, s.en)),
      ]);
      break;
    }
    default:
      fresh = practiceExercises("mixed", pool, doneUnits, n);
  }
  const out = [...fromNotebook, ...fresh];
  return out.length ? out : practiceExercises("mixed", pool, doneUnits, size);
}
