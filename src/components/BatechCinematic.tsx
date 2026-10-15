"use client";

import { BatechVideo } from "./BatechVideo";
import { useMotionPreference } from "./MotionPreference";
import "./batech-cinematic.css";

const stages = [
  { word: "BUILD.", phrase: "SIGNALS → INTERFACE" },
  { word: "ORGANIZE.", phrase: "INTERFACE → STRUCTURE" },
  { word: "LEAD.", phrase: "STRUCTURE → DELIVERY" },
] as const;

export function BatechCinematic({ stage, active }: { stage: number; active: boolean }) {
  const { paused } = useMotionPreference();
  const selected = Number.isFinite(stage) ? Math.min(2, Math.max(0, Math.round(stage))) : 0;

  return (
    <div
      className="batech-cinematic"
      data-stage={selected}
      data-active={active}
      data-motion={paused ? "paused" : "playing"}
      aria-hidden="true"
    >
      <div className="batech-cinematic__bar">
        <span>04 / SIGNAL → INTERFACE</span>
      </div>
      <div className="batech-cinematic__viewport">
        <div className="batech-cinematic__footage">
          <BatechVideo active={active} />
        </div>
        {stages.map(({ word, phrase }, index) => (
          <div className="batech-cinematic__stage" data-cinematic-stage={index} key={word}>
            <span className="batech-cinematic__word">{word}</span>
            <span className="batech-cinematic__phrase">{phrase}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
