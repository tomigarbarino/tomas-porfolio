"use client";

import { useState, type PointerEvent } from "react";
import Image from "next/image";
import { ArtifactDrag } from "@/components/ArtifactDrag";
import { ConceptualProductFlow } from "@/components/ConceptualProductFlow";
import "./flock-story-studio.css";

type Product = "agora" | "trainly";

export function FlockStoryStudio({ active, paused }: { active: boolean; paused: boolean }) {
  const [hovered, setHovered] = useState<Product | null>(null);
  const [focused, setFocused] = useState<Product | null>(null);
  const [pinned, setPinned] = useState<Product | null>(null);
  const selected = hovered ?? focused ?? pinned;

  function preview(product: Product) {
    return {
      onPointerEnter: (event: PointerEvent<HTMLElement>) => {
        if (event.pointerType === "mouse") setHovered(product);
      },
      onPointerLeave: () => setHovered(current => current === product ? null : current),
      onFocusCapture: () => { setHovered(null); setFocused(product); },
    };
  }

  return (
    <div className="flock-story-studio" data-product={selected ?? "none"} data-animated={active && !paused} onKeyDown={event => {
      if (event.key !== "Escape" || event.defaultPrevented || selected === null) return;
      setPinned(null); setHovered(null); setFocused(null);
      event.preventDefault(); event.stopPropagation();
    }}>
      <figure className="flock-story-studio__product flock-story-studio__product--agora" aria-label="Agora / project at Flock I+D" data-drag-frame data-product="agora" data-preview={selected === "agora"} {...preview("agora")} onBlurCapture={event => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setFocused(current => current === "agora" ? null : current);
      }}>
        <ArtifactDrag label="Move the Agora product logo" />
        <button
          type="button"
          className="flock-story-studio__surface"
          data-drag-enabled
          aria-label="Explore my Agora contribution"
          aria-pressed={pinned === "agora"}
          onClick={() => setPinned(current => current === "agora" ? null : "agora")}
        >
          <Image className="flock-story-studio__logo" src="/media/agora-logo.svg" alt="Agora" width={126} height={37} draggable={false} />
        </button>
      </figure>
      <figure className="flock-story-studio__product flock-story-studio__product--trainly" aria-label="Trainly / project at Flock I+D" data-drag-frame data-product="trainly" data-preview={selected === "trainly"} {...preview("trainly")} onBlurCapture={event => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setFocused(current => current === "trainly" ? null : current);
      }}>
        <ArtifactDrag label="Move the Trainly product logo" />
        <button
          type="button"
          className="flock-story-studio__surface"
          data-drag-enabled
          aria-label="Explore my Trainly contribution"
          aria-pressed={pinned === "trainly"}
          onClick={() => setPinned(current => current === "trainly" ? null : "trainly")}
        >
          <Image className="flock-story-studio__logo" src="/media/trainly/trainly-logo.svg" alt="Trainly" width={328} height={80} draggable={false} />
        </button>
      </figure>
      <ConceptualProductFlow active={active} paused={paused} />
    </div>
  );
}
