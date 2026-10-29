"use client";

import { L } from "@/lib/lang";
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/lib/store";

const LENGTH = 4;

export default function LoginPage() {
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const router = useRouter();
  const { refresh } = useStore();

  const submit = useCallback(
    async (value: string) => {
      setBusy(true);
      setError("");
      try {
        const res = await fetch("/api/login", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ pin: value }),
        });
        if (res.ok) {
          await refresh();
          router.replace("/");
          return;
        }
        const body = await res.json().catch(() => ({}));
        setError(body.error ?? "That PIN isn't right.");
        setPin("");
      } catch {
        setError("Can't reach the server. Check your connection.");
      } finally {
        setBusy(false);
      }
    },
    [refresh, router]
  );

  const press = useCallback(
    (d: string) => {
      if (busy || pin.length >= LENGTH) return;
      setError("");
      const next = pin + d;
      setPin(next);
      if (next.length === LENGTH) submit(next);
    },
    [busy, pin, submit]
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (/^\d$/.test(e.key)) press(e.key);
      if (e.key === "Backspace") setPin((p) => p.slice(0, -1));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [press]);

  return (
    <main className="login">
      <div className="login-card">
        <span className="brand-mark" aria-hidden>
          D
        </span>
        <h1>{L.native}</h1>
        <p className="muted">Enter your PIN</p>
        <div className="pin-dots" aria-label={`${pin.length} of ${LENGTH} digits entered`}>
          {Array.from({ length: LENGTH }, (_, i) => (
            <i key={i} className={i < pin.length ? "on" : ""} />
          ))}
        </div>
        <p role="alert" style={{ minHeight: 24, color: "var(--bad)" }}>
          {busy ? <span className="muted">Checking...</span> : error}
        </p>
        <div className="keypad">
          {["1", "2", "3", "4", "5", "6", "7", "8", "9"].map((d) => (
            <button key={d} onClick={() => press(d)} disabled={busy}>
              {d}
            </button>
          ))}
          <span />
          <button onClick={() => press("0")} disabled={busy}>
            0
          </button>
          <button className="plain" onClick={() => setPin((p) => p.slice(0, -1))} disabled={busy} aria-label="Delete last digit">
            Delete
          </button>
        </div>
      </div>
    </main>
  );
}
