import { NextRequest, NextResponse } from "next/server";
import { isAuthed } from "@/lib/auth";
import { AiError, aiConfigured, chat, generate, grade } from "@/lib/ai";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function GET(req: NextRequest) {
  if (!isAuthed(req)) return NextResponse.json({ error: "Sign in first." }, { status: 401 });
  return NextResponse.json({ enabled: aiConfigured() });
}

export async function POST(req: NextRequest) {
  if (!isAuthed(req)) return NextResponse.json({ error: "Sign in first." }, { status: 401 });
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
  const lang = body.lang === "es" ? "es" : "de";
  const units = Array.isArray(body.units) ? (body.units as unknown[]).map(String).slice(0, 50) : [];

  try {
    switch (body.task) {
      case "grade": {
        const text = String(body.text ?? "").trim();
        if (!text) return NextResponse.json({ error: "Write something first." }, { status: 400 });
        const mode = body.mode === "answer" || body.mode === "journal" ? body.mode : "translate";
        const result = await grade({
          mode,
          prompt: body.prompt ? String(body.prompt) : undefined,
          promptEn: body.promptEn ? String(body.promptEn) : undefined,
          reference: body.reference ? String(body.reference) : undefined,
          text,
          units,
          lang,
        });
        return NextResponse.json(result);
      }
      case "chat": {
        const history = Array.isArray(body.history)
          ? (body.history as { role?: string; text?: string }[])
              .filter((m) => m && (m.role === "user" || m.role === "assistant"))
              .map((m) => ({ role: m.role as "user" | "assistant", text: String(m.text ?? "") }))
          : [];
        const result = await chat({ scenarioId: String(body.scenarioId ?? "free"), history, units, lang });
        return NextResponse.json(result);
      }
      case "generate": {
        const kind = body.kind === "question" ? "question" : "translate";
        const avoid = Array.isArray(body.avoid) ? (body.avoid as unknown[]).map(String) : [];
        const result = await generate({ kind, units, avoid, lang });
        return NextResponse.json(result);
      }
      default:
        return NextResponse.json({ error: "Unknown task." }, { status: 400 });
    }
  } catch (e) {
    if (e instanceof AiError) {
      return NextResponse.json({ error: e.message }, { status: e.status });
    }
    return NextResponse.json({ error: "Something went wrong reaching Claude. Try again." }, { status: 500 });
  }
}
