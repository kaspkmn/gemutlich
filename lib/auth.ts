import "server-only";
import { createHash, createHmac, timingSafeEqual } from "crypto";
import type { NextRequest } from "next/server";

export const COOKIE = "gm_session";
export const COOKIE_MAX_AGE = 60 * 60 * 24 * 365; // one year

function secret(): string {
  const s = process.env.AUTH_SECRET;
  if (!s || s.length < 16) throw new Error("AUTH_SECRET is missing or too short (use 32+ random characters).");
  return s;
}

function sign(payload: string): string {
  return createHmac("sha256", secret()).update(payload).digest("base64url");
}

function safeEqual(a: string, b: string): boolean {
  const ha = createHash("sha256").update(a).digest();
  const hb = createHash("sha256").update(b).digest();
  return timingSafeEqual(ha, hb);
}

export function pinMatches(pin: string): boolean {
  const expected = process.env.APP_PIN;
  if (!expected) throw new Error("APP_PIN is not set.");
  return safeEqual(pin, expected);
}

export function makeSession(): string {
  const payload = `v1.${Date.now()}`;
  return `${payload}.${sign(payload)}`;
}

export function isAuthed(req: NextRequest): boolean {
  const raw = req.cookies.get(COOKIE)?.value;
  if (!raw) return false;
  const i = raw.lastIndexOf(".");
  if (i < 0) return false;
  const payload = raw.slice(0, i);
  const sig = raw.slice(i + 1);
  try {
    return safeEqual(sig, sign(payload));
  } catch {
    return false;
  }
}
