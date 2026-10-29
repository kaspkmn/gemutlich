/*
 * Noun gender rules for the language being studied.
 * German (der/die/das) lives in gender-rules-de.ts, Spanish (el/la) in gender-rules-es.ts.
 */

import { IS_ES } from "./lang";
import * as DE from "./gender-rules-de";
import * as ES from "./gender-rules-es";
import type { G3 } from "./gender-rules-de";

export type { G3, GenderAnalysis, GenderGuess, GenderGuide, GenderRule, GuideItem, Reliability } from "./gender-rules-de";

const M = IS_ES ? ES : DE;

export const RULES = M.RULES;
export const ARTICLE = M.ARTICLE;
export const GENDER_NAME = M.GENDER_NAME;
export const GUIDE = M.GUIDE;
export const guessGender = M.guessGender;
export const analyzeNoun = M.analyzeNoun;
export const matchedEnding = M.matchedEnding;
/** well-known exceptions to the rules (Spanish), for the gender checker */
export const EXCEPTIONS: Record<string, G3> = IS_ES ? ES.EXCEPTIONS : {};
