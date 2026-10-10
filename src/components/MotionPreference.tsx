"use client";

import { useEffect, useSyncExternalStore, type ReactNode } from "react";

const key = "tg-motion";
const event = "tg-motion-change";
let fallback: string | null = null;

function snapshot() {
  let preference = fallback;
  try { preference = window.localStorage.getItem(key) ?? fallback; } catch { /* Storage is optional. */ }
  return `${window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 1 : 0}:${preference === "paused" ? 1 : 0}`;
}

function subscribe(callback: () => void) {
  const media = window.matchMedia("(prefers-reduced-motion: reduce)");
  media.addEventListener("change", callback);
  window.addEventListener("storage", callback);
  window.addEventListener(event, callback);
  return () => {
    media.removeEventListener("change", callback);
    window.removeEventListener("storage", callback);
    window.removeEventListener(event, callback);
  };
}

export function useMotionPreference() {
  const value = useSyncExternalStore(subscribe, snapshot, () => "0:1");
  const [system, preference] = value.split(":");
  const reducedMotion = system === "1";
  const paused = reducedMotion || preference === "1";
  function setPaused(next: boolean) {
    fallback = next ? "paused" : "playing";
    try { window.localStorage.setItem(key, fallback); } catch { /* Keep the in-memory preference. */ }
    window.dispatchEvent(new Event(event));
  }
  return { paused, setPaused, reducedMotion };
}

export function MotionPreference({ children }: { children: ReactNode }) {
  const { paused } = useMotionPreference();
  useEffect(() => { document.documentElement.dataset.motion = paused ? "paused" : "playing"; }, [paused]);
  return children;
}
