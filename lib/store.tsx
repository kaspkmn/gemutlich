"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { AppState, CustomWord, Settings, TestRecord, WritingEntry, emptyState, hydrate, swapLanguage } from "./state";
import { LANG, rememberLang, type Lang } from "./lang";
import { Grade, newCard, review } from "./srs";
import { dayKey } from "./dates";
import { getUnit } from "@/content/course";
import type { Exercise } from "./exercises";
import { applyAnswer, bumpSkill, type Skill } from "./mistakes";

const LOCAL_KEY = "gemutlich-state-v1"; // kept so existing progress carries over
const DIRTY_KEY = "gemutlich-dirty";

export type SyncStatus = "loading" | "synced" | "saving" | "offline" | "signed-out";

interface Store {
  state: AppState;
  ready: boolean;
  sync: SyncStatus;
  addXp: (n: number) => void;
  /** practice answer: XP, stats, skill, and the mistake notebook */
  recordExercise: (correct: boolean, xp: number, ex?: Exercise, given?: string) => void;
  /** many answers at once (end of a test) */
  recordAnswers: (items: { ex: Exercise; correct: boolean; given?: string }[]) => void;
  /** a drill without an Exercise object (numbers, speaking) */
  recordSkill: (skill: Skill, correct: boolean, xp: number) => void;
  removeMistake: (key: string) => void;
  removeCustomWord: (id: string) => void;
  markRead: (id: string, xp: number) => void;
  completeUnit: (unitId: string, accuracy: number) => { added: number };
  reviewCard: (id: string, grade: Grade) => void;
  addCustomWord: (w: Omit<CustomWord, "added">) => boolean;
  addCards: (ids: string[]) => number;
  logWriting: (entry: Omit<WritingEntry, "at">, xp: number) => void;
  logTest: (rec: Omit<TestRecord, "at">, xp: number) => void;
  updateSettings: (patch: Partial<Settings>) => void;
  replaceState: (s: AppState) => void;
  resetAll: () => void;
  signOut: () => Promise<void>;
  refresh: () => Promise<void>;
  /** switch to studying another language (saves, then reloads the page) */
  switchLang: (to: Lang) => Promise<void>;
}

const Ctx = createContext<Store | null>(null);

function loadLocal(): AppState {
  try {
    const raw = localStorage.getItem(LOCAL_KEY);
    return raw ? hydrate(JSON.parse(raw)) : emptyState();
  } catch {
    return emptyState();
  }
}

function saveLocal(s: AppState, dirty: boolean) {
  try {
    localStorage.setItem(LOCAL_KEY, JSON.stringify(s));
    localStorage.setItem(DIRTY_KEY, dirty ? "1" : "0");
  } catch {
    /* storage full or blocked: the server copy still works */
  }
}

function isDirty() {
  try {
    return localStorage.getItem(DIRTY_KEY) === "1";
  } catch {
    return false;
  }
}

function withXp(s: AppState, n: number): AppState {
  if (n <= 0) return s;
  const k = dayKey();
  return { ...s, xp: s.xp + n, days: { ...s.days, [k]: (s.days[k] ?? 0) + n } };
}

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AppState>(emptyState);
  const [ready, setReady] = useState(false);
  const [sync, setSync] = useState<SyncStatus>("loading");
  const router = useRouter();
  const pathname = usePathname();
  const pushTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const latest = useRef(state);
  latest.current = state;

  const push = useCallback(async (s: AppState, keepalive = false) => {
    setSync("saving");
    try {
      const res = await fetch("/api/progress", {
        method: "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ data: s }),
        keepalive,
      });
      if (res.status === 401) {
        setSync("signed-out");
        return;
      }
      if (!res.ok) throw new Error(String(res.status));
      if (latest.current.updatedAt === s.updatedAt) saveLocal(s, false);
      setSync("synced");
    } catch {
      setSync("offline");
    }
  }, []);

  const pull = useCallback(async () => {
    const local = loadLocal();
    try {
      const res = await fetch("/api/progress", { cache: "no-store" });
      if (res.status === 401) {
        setSync("signed-out");
        return;
      }
      if (!res.ok) throw new Error(String(res.status));
      const body = (await res.json()) as { data: unknown | null };
      const server = body.data ? hydrate(body.data) : null;
      if (!server || (isDirty() && local.updatedAt > server.updatedAt)) {
        setState(local);
        if (local.updatedAt > 0) push(local);
        else setSync("synced");
      } else {
        setState(server);
        saveLocal(server, false);
        setSync("synced");
      }
    } catch {
      setSync("offline");
    }
  }, [push]);

  // First load: show the local copy instantly, then reconcile with the server.
  useEffect(() => {
    setState(loadLocal());
    setReady(true);
    pull();
  }, [pull]);

  // Progress says another language (switched on another device): reload in that language.
  useEffect(() => {
    if (!ready || state.updatedAt === 0 || pathname === "/login") return;
    if (state.lang === LANG) {
      try {
        sessionStorage.removeItem("lang-reload");
      } catch {}
      return;
    }
    try {
      if (sessionStorage.getItem("lang-reload") === state.lang) return;
      sessionStorage.setItem("lang-reload", state.lang);
    } catch {
      return;
    }
    rememberLang(state.lang);
    window.location.reload();
  }, [ready, state.lang, state.updatedAt, pathname]);

  // Send anyone who isn't signed in to the PIN screen.
  useEffect(() => {
    if (sync === "signed-out" && pathname !== "/login") router.replace("/login");
  }, [sync, pathname, router]);

  // Save on tab hide so nothing is lost when the phone locks.
  useEffect(() => {
    const onHide = () => {
      if (document.visibilityState === "hidden" && isDirty()) push(latest.current, true);
      if (document.visibilityState === "visible") pull();
    };
    document.addEventListener("visibilitychange", onHide);
    return () => document.removeEventListener("visibilitychange", onHide);
  }, [push, pull]);

  const update = useCallback(
    (fn: (s: AppState) => AppState) => {
      setState((prev) => {
        const next = { ...fn(prev), updatedAt: Date.now() };
        saveLocal(next, true);
        if (pushTimer.current) clearTimeout(pushTimer.current);
        pushTimer.current = setTimeout(() => push(next), 1200);
        return next;
      });
    },
    [push]
  );

  const store = useMemo<Store>(() => {
    const addCardsTo = (s: AppState, ids: string[]) => {
      const cards = { ...s.cards };
      let added = 0;
      for (const id of ids) {
        if (!cards[id]) {
          cards[id] = newCard();
          added++;
        }
      }
      return { next: { ...s, cards }, added };
    };

    return {
      state,
      ready,
      sync,
      addXp: (n) => update((s) => withXp(s, n)),
      recordExercise: (correct, xp, ex, given) =>
        update((s) => {
          let next: AppState = {
            ...s,
            stats: { ...s.stats, exercises: s.stats.exercises + 1, correct: s.stats.correct + (correct ? 1 : 0) },
          };
          if (ex) {
            const t = applyAnswer({ mistakes: s.mistakes, skills: s.skills, mastered: s.stats.mastered }, ex, correct, given);
            next = { ...next, mistakes: t.mistakes, skills: t.skills, stats: { ...next.stats, mastered: t.mastered } };
          }
          return withXp(next, xp);
        }),
      recordAnswers: (items) =>
        update((s) => {
          let t = { mistakes: s.mistakes, skills: s.skills, mastered: s.stats.mastered };
          for (const { ex, correct, given } of items) t = applyAnswer(t, ex, correct, given);
          return { ...s, mistakes: t.mistakes, skills: t.skills, stats: { ...s.stats, mastered: t.mastered } };
        }),
      recordSkill: (skill, correct, xp) =>
        update((s) =>
          withXp(
            {
              ...s,
              skills: bumpSkill(s.skills, skill, correct),
              stats: { ...s.stats, spoken: s.stats.spoken + (skill === "speaking" ? 1 : 0) },
            },
            xp
          )
        ),
      removeMistake: (key) =>
        update((s) => {
          const mistakes = { ...s.mistakes };
          delete mistakes[key];
          return { ...s, mistakes };
        }),
      removeCustomWord: (id) =>
        update((s) => {
          const custom = { ...s.custom };
          const cards = { ...s.cards };
          delete custom[id];
          delete cards[id];
          return { ...s, custom, cards };
        }),
      markRead: (id, xp) => update((s) => withXp({ ...s, read: { ...s.read, [id]: Date.now() } }, s.read[id] ? Math.ceil(xp / 2) : xp)),
      completeUnit: (unitId, accuracy) => {
        const unit = getUnit(unitId);
        if (!unit) return { added: 0 };
        const ids = unit.words.map((w) => w.de);
        const before = latest.current.cards;
        const added = ids.filter((id) => !before[id]).length;
        update((s) => {
          const prev = s.units[unitId];
          const units = {
            ...s.units,
            [unitId]: {
              completed: true,
              best: Math.max(prev?.best ?? 0, accuracy),
              times: (prev?.times ?? 0) + 1,
              last: Date.now(),
            },
          };
          const { next } = addCardsTo({ ...s, units }, ids);
          return withXp(next, prev?.completed ? 10 : 20);
        });
        return { added };
      },
      reviewCard: (id, grade) =>
        update((s) => {
          const c = s.cards[id];
          if (!c) return s;
          const next = { ...s, cards: { ...s.cards, [id]: review(c, grade) }, stats: { ...s.stats, reviews: s.stats.reviews + 1 } };
          return withXp(next, grade === "again" ? 1 : 2);
        }),
      addCustomWord: (w) => {
        if (latest.current.cards[w.de]) return false;
        update((s) => {
          const custom = { ...s.custom, [w.de]: { ...w, added: dayKey() } };
          return addCardsTo({ ...s, custom }, [w.de]).next;
        });
        return true;
      },
      addCards: (ids) => {
        const added = ids.filter((id) => !latest.current.cards[id]).length;
        if (added) update((s) => addCardsTo(s, ids).next);
        return added;
      },
      logWriting: (entry, xp) =>
        update((s) =>
          withXp(
            {
              ...s,
              writing: [{ ...entry, at: Date.now() }, ...s.writing].slice(0, 150),
              stats: { ...s.stats, written: s.stats.written + 1 },
            },
            xp
          )
        ),
      logTest: (rec, xp) =>
        update((s) => withXp({ ...s, tests: [{ ...rec, at: Date.now() }, ...s.tests].slice(0, 300) }, xp)),
      updateSettings: (patch) => update((s) => ({ ...s, settings: { ...s.settings, ...patch } })),
      replaceState: (s) => update(() => hydrate(s)),
      resetAll: () => update(() => ({ ...emptyState(), lang: latest.current.lang, settings: latest.current.settings })),
      signOut: async () => {
        if (isDirty()) await push(latest.current);
        await fetch("/api/logout", { method: "POST" });
        try {
          localStorage.removeItem(LOCAL_KEY);
          localStorage.removeItem(DIRTY_KEY);
        } catch {}
        setState(emptyState());
        setSync("signed-out");
      },
      refresh: pull,
      switchLang: async (to) => {
        if (to === latest.current.lang && to === LANG) return;
        const next = { ...swapLanguage(latest.current, to), updatedAt: Date.now() };
        if (pushTimer.current) clearTimeout(pushTimer.current);
        setState(next);
        saveLocal(next, true);
        rememberLang(to);
        await push(next);
        window.location.assign("/");
      },
    };
  }, [state, ready, sync, update, push, pull]);

  return <Ctx.Provider value={store}>{children}</Ctx.Provider>;
}

export function useStore(): Store {
  const s = useContext(Ctx);
  if (!s) throw new Error("useStore must be used inside StoreProvider");
  return s;
}
