import { NextRequest, NextResponse } from "next/server";
import { COOKIE, COOKIE_MAX_AGE, makeSession, pinMatches } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  let pin = "";
  try {
    const body = await req.json();
    pin = String(body?.pin ?? "").slice(0, 32);
  } catch {
    return NextResponse.json({ error: "Send the PIN as JSON." }, { status: 400 });
  }

  let ok = false;
  try {
    ok = pinMatches(pin);
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }

  if (!ok) {
    // A short pause makes guessing PINs slow.
    await new Promise((r) => setTimeout(r, 700));
    return NextResponse.json({ error: "That PIN isn't right." }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set(COOKIE, makeSession(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: COOKIE_MAX_AGE,
  });
  return res;
}
