import { NextRequest, NextResponse } from "next/server";
import { isAuthed } from "@/lib/auth";
import { loadProgress, saveProgress } from "@/lib/db";

export const dynamic = "force-dynamic";

const MAX_BYTES = 2_000_000;

export async function GET(req: NextRequest) {
  if (!isAuthed(req)) return NextResponse.json({ error: "Sign in first." }, { status: 401 });
  try {
    return NextResponse.json(await loadProgress(), { headers: { "cache-control": "no-store" } });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  if (!isAuthed(req)) return NextResponse.json({ error: "Sign in first." }, { status: 401 });
  const text = await req.text();
  if (text.length > MAX_BYTES) return NextResponse.json({ error: "Progress data is too large." }, { status: 413 });
  let body: { data?: unknown };
  try {
    body = JSON.parse(text);
  } catch {
    return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
  }
  if (!body.data || typeof body.data !== "object") {
    return NextResponse.json({ error: "Missing progress data." }, { status: 400 });
  }
  try {
    await saveProgress(body.data);
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}
