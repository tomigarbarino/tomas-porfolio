"use client";

import dynamic from "next/dynamic";
import { useMotionPreference } from "./MotionPreference";

const PacketRecoveryGame = dynamic(() => import("./PacketRecoveryGame"), {
  ssr: false,
  loading: () => <div className="secret404__loading" role="status"><p>Lost + Found / Packet recovery</p><span>Preparing eight lost packets…</span></div>,
});

export function PacketRecoveryLoader() {
  return <PacketRecoveryGame />;
}

export function Secret404MotionToggle() {
  const { paused, reducedMotion, setPaused } = useMotionPreference();
  return <button type="button" disabled={reducedMotion} onClick={() => setPaused(!paused)}>{reducedMotion ? "Reduced motion" : paused ? "Play motion" : "Pause motion"}</button>;
}
