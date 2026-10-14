"use client";

import { useState, useSyncExternalStore, type AnimationEvent } from "react";
import { ArtifactDrag } from "./ArtifactDrag";
import { AsciiVideo } from "./AsciiVideo";
import "./minecraft-origin.css";

type Props = {
  src: string;
  poster: string;
  paused: boolean;
  reducedMotion: boolean;
  active: boolean;
};

function subscribeVisibility(callback: () => void) {
  document.addEventListener("visibilitychange", callback);
  return () => document.removeEventListener("visibilitychange", callback);
}

function visibilitySnapshot() { return !document.hidden; }
function serverVisibilitySnapshot() { return false; }

/** A visual metaphor for discovering code, rather than a recording of the first program. */
export function MinecraftOrigin({ src, poster, paused, reducedMotion, active }: Props) {
  const [finished, setFinished] = useState(false);
  const visible = useSyncExternalStore(subscribeVisibility, visibilitySnapshot, serverVisibilitySnapshot);
  const complete = finished || reducedMotion;
  const motion = active && visible && !paused && !reducedMotion;
  const playing = motion && !complete;

  function finish(event: AnimationEvent<HTMLDivElement>) {
    if (event.target === event.currentTarget && event.animationName === "minecraft-origin-finish") {
      setFinished(true);
    }
  }

  return <div className="minecraft-origin" data-complete={complete} data-playing={playing} data-motion={motion} data-static={reducedMotion} onAnimationEnd={finish}>
    <div className="origin-story__minecraft-image minecraft-origin__image" aria-hidden="true">
      <AsciiVideo src={src} poster={poster} paused={paused || !active || !complete} className="origin-story__video" />
    </div>

    <div className="minecraft-origin__intro" aria-hidden="true">
      <div className="minecraft-origin__file">
        <svg viewBox="0 0 64 80" width="64" height="80" fill="none" focusable="false" aria-hidden="true">
          <path d="M8 4H40V12H48V20H56V76H8V4Z" fill="currentColor" />
          <path d="M8 4H40V12H48V20H56V76H8V4ZM40 4V20H56" stroke="var(--story-ink)" strokeWidth="2" />
          <path d="M23 34H18V40H14V44H18V50H23M41 34H46V40H50V44H46V50H41M35 32L29 52" stroke="var(--story-ink)" strokeWidth="3" />
          <path d="M18 61H44M18 66H35" stroke="var(--story-ink)" strokeWidth="2" />
        </svg>
        <span>game files</span>
      </div>

      <div className="minecraft-origin__pixel-cursor">
        <svg viewBox="0 0 24 32" width="24" height="32" fill="none" focusable="false" aria-hidden="true" shapeRendering="crispEdges">
          <path d="M2 1H5V4H8V7H11V10H14V13H17V16H20V19H13V22H16V25H19V28H13V25H10V22H7V25H4V28H2V1Z" fill="var(--story-ink)" />
          <path d="M4 5H6V8H9V11H12V14H15V17H10V21H7V19H4V5ZM10 21H13V25H16V27H14V25H11V22H10V21Z" fill="currentColor" />
        </svg>
      </div>

      <div className="minecraft-origin__terminal">
        <div className="minecraft-origin__terminal-bar"><span>first steps</span><span>− □ ×</span></div>
        <div className="minecraft-origin__terminal-body"><span className="minecraft-origin__prompt">&gt;</span><span className="minecraft-origin__typed">Hello World</span><span className="minecraft-origin__dot" /></div>
      </div>
    </div>

    {complete ? <div className="origin-story__file-piece" data-drag-frame>
      <ArtifactDrag label="Move the game files note" />
      <span className="origin-story__file-fold" aria-hidden="true" />
      <p>Game files</p>
      <span className="origin-story__file-lines" aria-hidden="true"><i /><i /><i /></span>
    </div> : null}
  </div>;
}
