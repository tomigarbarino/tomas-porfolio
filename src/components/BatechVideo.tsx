"use client";

import { useEffect, useRef, useState } from "react";
import { portfolioMedia } from "@/data/portfolio";
import { useMotionPreference } from "./MotionPreference";

export function BatechVideo({ active = true }: { active?: boolean }) {
  const video = useRef<HTMLVideoElement>(null);
  const [visible, setVisible] = useState(false);
  const { paused } = useMotionPreference();

  useEffect(() => {
    const node = video.current;
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
      if (paused || !active || !visible || document.hidden) { node.pause(); return; }
      void node.play().catch(() => { /* Keep the poster when autoplay is unavailable. */ });
    }
    sync();
    document.addEventListener("visibilitychange", sync);
    return () => { document.removeEventListener("visibilitychange", sync); node.pause(); };
  }, [paused, active, visible]);

  return (
    <video
      ref={video}
      autoPlay={active && visible && !paused}
      muted loop playsInline preload="none"
      poster={portfolioMedia.batech.src}
      width={portfolioMedia.batech.width}
      height={portfolioMedia.batech.height}
      aria-label="Batech product video"
    >
      <source src={portfolioMedia.batech.videoSrc} type="video/mp4" />
      <a href={portfolioMedia.batech.videoSrc}>Open the Batech product video</a>
    </video>
  );
}
