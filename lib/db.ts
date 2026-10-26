import "server-only";
import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { promises as fs } from "fs";
import path from "path";

const TABLE = "german_progress";
const ROW_ID = "me";

let client: SupabaseClient | null = null;

function supabase(): SupabaseClient | null {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  if (!client) client = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
  return client;
}

// Without Supabase configured (local development only), progress is kept in a JSON file.
const LOCAL_FILE = path.join(process.cwd(), ".data", "progress.json");

function assertConfigured() {
  if (process.env.NODE_ENV === "production" && !supabase()) {
    throw new Error("SUPABASE_URL and SUPABASE_SECRET_KEY must be set.");
  }
}

export async function loadProgress(): Promise<{ data: unknown | null; updatedAt: string | null }> {
  assertConfigured();
  const sb = supabase();
  if (!sb) {
    try {
      const raw = await fs.readFile(LOCAL_FILE, "utf8");
      const parsed = JSON.parse(raw);
      return { data: parsed.data ?? null, updatedAt: parsed.updatedAt ?? null };
    } catch {
      return { data: null, updatedAt: null };
    }
  }
  const { data, error } = await sb.from(TABLE).select("data, updated_at").eq("id", ROW_ID).maybeSingle();
  if (error) throw new Error(error.message);
  return { data: data?.data ?? null, updatedAt: data?.updated_at ?? null };
}

export async function saveProgress(payload: unknown): Promise<void> {
  assertConfigured();
  const sb = supabase();
  const updatedAt = new Date().toISOString();
  if (!sb) {
    await fs.mkdir(path.dirname(LOCAL_FILE), { recursive: true });
    await fs.writeFile(LOCAL_FILE, JSON.stringify({ data: payload, updatedAt }));
    return;
  }
  const { error } = await sb.from(TABLE).upsert({ id: ROW_ID, data: payload, updated_at: updatedAt });
  if (error) throw new Error(error.message);
}
