"use client";

import { useEffect, useRef, useState } from "react";

type Props = { src: string; poster: string; paused: boolean; className?: string };

export function AsciiVideo({ src, poster, paused, className = "" }: Props) {
  const container = useRef<HTMLDivElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const [visible, setVisible] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [readySource, setReadySource] = useState("");

  useEffect(() => {
    const node = container.current;
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
      if (paused || !visible || document.hidden) { node.pause(); return; }
      if (!node.getAttribute("src")) { setLoaded(true); return; }
      void node.play().catch(() => { /* Poster remains usable when autoplay is unavailable. */ });
    }
    sync();
    document.addEventListener("visibilitychange", sync);
    return () => { document.removeEventListener("visibilitychange", sync); node.pause(); };
  }, [paused, visible, loaded, src]);

  return (
    <div ref={container} className={`ascii-video ${className}`} aria-hidden="true">
      {/* A decorative image keeps the scene visible before video loads or when playback fails. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={poster} alt="" width="1152" height="648" decoding="async" className="ascii-poster" />
      <video
        ref={video}
        src={loaded ? src : undefined}
        poster={poster}
        muted loop playsInline preload="none" tabIndex={-1}
        className={readySource === src ? "is-ready" : ""}
        onPlaying={() => setReadySource(src)}
        onError={() => setReadySource("")}
      />
    </div>
  );
}
