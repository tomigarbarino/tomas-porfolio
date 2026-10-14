"use client";

import { useEffect, useRef, useState } from "react";
import { useMotionPreference } from "./MotionPreference";

export function BatechVideo({ active = true }: { active?: boolean }) {
  const surface = useRef<HTMLSpanElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const failed = useRef(false);
  const playbackAllowed = useRef(false);
  const [visible, setVisible] = useState(false);
  const { paused } = useMotionPreference();

  useEffect(() => {
    const node = surface.current;
    if (!node) return;
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: 0.02 });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const node = video.current;
    if (!node) return;
    function sync() {
      if (!node) return;
      playbackAllowed.current = !paused && active && visible && !document.hidden && !failed.current;
      if (!playbackAllowed.current) { node.pause(); return; }
      if (!node.getAttribute("src")) node.src = "/media/hero-ascii.mp4";
      void node.play().then(() => {
        if (!playbackAllowed.current) node.pause();
      }).catch(() => { /* The persistent poster covers unavailable autoplay. */ });
    }
    sync();
    document.addEventListener("visibilitychange", sync);
    return () => { playbackAllowed.current = false; document.removeEventListener("visibilitychange", sync); node.pause(); };
  }, [paused, active, visible]);

  return (
    <span ref={surface} className="batech-video" aria-hidden="true">
      <video
        ref={video}
        muted loop playsInline preload="none"
        poster="/media/hero-ascii.png"
        width={1280}
        height={720}
        onPlaying={(event) => { event.currentTarget.dataset.playback = "ready"; }}
        onError={(event) => {
          failed.current = true;
          playbackAllowed.current = false;
          event.currentTarget.dataset.playback = "error";
          event.currentTarget.pause();
        }}
      />
    </span>
  );
}
