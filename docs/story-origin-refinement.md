# Story origins and Computer Vision context

The owner requested two connected changes: move the existing Chromatic study frame into Batech, where its visual interaction supports the AI/Computer Vision context; introduce Minecraft with a lightweight file → pixel cursor → double click → Hello World sequence. The storyboard and palette are authorized in the request. This note evaluates integration before implementation.

## Integration and scope

- Use the existing sticky chapter canvas and career chronology. Story copy remains readable without waiting for animation.
- Keep Chromatic study as the existing interactive visual lens, now over Batech company footage. The source contains no separate Chromaty product case; do not invent its scope, results or model authorship.
- Keep the Batech responsibility map below the film. Measure its height so the film and lens fit desktop and the 300px mobile canvas. The film and lens remain separate drag frames.
- Build the Minecraft intro with local CSS/SVG, the existing mono/display type and paper/pink/lilac palette. Play a finite sequence once when the chapter is visible. Freeze when paused, offscreen or hidden. Reduced motion shows a readable still. Hello World is a visual metaphor, not a claim about the owner's actual first program.
- Defer existing Minecraft video playback until the intro finishes. Add no media downloads, library, API, database, environment or global cursor behavior.

## Implementation

`OriginStory.tsx` moves the lens and its guards into Batech, updates film targeting, and connects the intro to chapter visibility. `MinecraftOrigin.tsx` and `minecraft-origin.css` isolate the finite presentation. `origin-story.css` and `story-workbenches.css` preserve the frame design while allocating the Batech film/map space. Existing responsibility scroll behavior and whole-surface drag stay in place.

## Acceptance and validation

Inspect the approved reference and current chapter renders before edits. Verify file/cursor/double-click/type/crossfade order, one-time playback, pause/resume, reduced motion, hidden/offscreen behavior, fast scroll, desktop and 320/390px bounds. Verify Batech lens color/follow, manual drag/Home, and Build/Organize/Lead responding to scroll after interaction. Run lint, TypeScript and an optimized build. Revert these scoped source changes to roll back; no data changes are involved. Publication or main merge is outside this request.

## Delivered behavior and evidence

The existing lens now belongs to Batech and samples its company video. Its palette cycle and bounded mouse follow remain; explicit dragging uses separate offsets, and Home resets both. A ResizeObserver reserves the responsibility map's actual height. The lens and film share a height variable so the frame fits even in a short desktop canvas; resize clears stale follow offsets. The story copy connects the AI/Computer Vision product to the owner's frontend contribution and growth into leadership.

Minecraft uses a five-second CSS timeline with an inline SVG file and pixel cursor, two subtle click pulses, and stepped typing. The owner's follow-up keeps Hello World visible after the intro while the existing Minecraft media fades in behind it. A small pink dot pulses after completion; it has its own active/visible/motion flag so completion does not restart the intro or stop the dot. It pauses outside the chapter, when hidden or globally paused, and is static under reduced motion. The full pause inheritance chain reaches the typing animation. No per-frame React state, timer, new video, dependency, API or database change was added.

Native browser checks covered the initial file/cursor/terminal/type/media order; no Minecraft video source was attached before completion. During global Pause, five observations kept the partially typed width at 75px, then playback resumed from 75px to 165px without restarting. After the ending correction, the terminal remained fully opaque while the dot's opacity varied; reduced motion left text/dot static with video paused. Scrolling to Batech retained completed intro state while stopping the Minecraft video and dot. Batech mouse follow stayed inside the film, whole-surface drag produced independent 80px/25px manual offsets, Home restored zeros, and a clicked Build preview returned to automatic Organize on scroll.

Desktop, 390px and 320px Batech layouts kept the lens inside the film and the map below it; mobile controls remained 44px high. A 900×600 layout geometry check also kept the lens inside its shorter film. The final 320px Minecraft terminal had no horizontal overflow and a 35.8px gap above the Game files note. Captured browser console errors: zero. Full ESLint, TypeScript and final optimized build `NEAeVsSbdgdLl9Uw4pMlg` passed. Evidence is in `output/story-origin-refinement-2026-10-14/` in the development checkout. Initial post-reload samples with inactive artwork are diagnostics, not animation-completion proof. Physical touch hardware and hosted production were not exercised.
