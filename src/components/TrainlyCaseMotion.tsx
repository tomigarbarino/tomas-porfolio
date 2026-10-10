"use client";

import { AsciiVideo } from "./AsciiVideo";
import { useMotionPreference } from "./MotionPreference";

export function TrainlyCaseMotion({ control = false }: { control?: boolean }) {
  const { paused, setPaused, reducedMotion } = useMotionPreference();
  if (control) {
    return <button className="td-motion" type="button" disabled={reducedMotion} onClick={() => setPaused(!paused)}>{reducedMotion ? "Reduced motion" : paused ? "Play motion" : "Pause motion"}</button>;
  }
  return <div className="td-world" aria-hidden="true"><AsciiVideo src="/media/hero-ascii.mp4" poster="/media/hero-ascii.png" paused={paused} /></div>;
}
