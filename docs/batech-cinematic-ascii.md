# Batech cinematic ASCII release

## Approved scope

The owner approved Figma cinematic option B (file `k4ubXD3U5cr9W9GbsvU44Q`, Build `301:600`, Organize `301:722`, Lead `301:844`) and explicitly requested production release together with the pending retro-window previews in PR #8. This ticket precedes implementation. Existing story-origin changes at `0869ffe` are the base, including the Minecraft intro and moved Batech chromatic lens.

## Implementation plan

- Reuse `/media/hero-ascii.mp4` and its existing poster, the exact imagery underlying the approved design. Preserve one video clock: the chromatic lens samples the same rendered film through its existing SVG backdrop filter.
- Add a small cinematic frame component with the approved pink chrome, multiply grade, large Build/Organize/Lead words and stage phrase. Use the existing CSS variables/fonts. No dependencies, heavy new video, API or DB change.
- Lift Batech's existing scroll-derived selection to its artwork parent. The film word, phase, controls and contribution detail share the same state. Manual preview ends on the next actual scroll; drag never takes over the scroll position.
- Keep the lens's bounded pointer follow, whole-surface drag and keyboard Home/Escape. Apply smooth changes to its default stage composition without duplicating or seeking a second video.
- Keep video lazy/visible/active/hidden-aware and honor global Pause and reduced motion. Content steps remain readable as the visitor scrolls; decorative animation stops.
- Preserve chronology and attribution. The image remains company context, while text describes frontend contribution and hands-on leadership. Preserve unrelated work and generated artifacts.

## Acceptance and release gates

- Match the approved Batech frame's hierarchy, palette, big stage word and lens; adapt it to the existing sticky story layout without redesigning unrelated sections.
- Confirm video time advances in active Batech; stops while paused, hidden/offscreen or reduced motion; no video HUD. Poster covers playback failure.
- Verify all three scroll stages in both directions after button hover/click/focus and lens/window dragging. All labels/details agree with the visual word. No sticky manual override.
- Verify 1440/1280 desktop, 900×600 short desktop and 390/320 mobile bounds; controls at least 44px; lens stays inside the film.
- Verify the retro project windows on the combined preview: scattered positions and keyword panels; sequential exit on leaving/scroll; no last-window flash; no navigation delay; exit persists across a case navigation.
- Full lint, TypeScript and optimized build on the release commit. Inspect Vercel preview and deployment health for that exact head, then merge PR #8 and the Batech/story PR under the user's release authorization. Verify the stable production alias and interaction samples.

## Risks and rollback

Medium UI/state risk: duplicate scroll controllers could drift, or changing film dimensions could break lens bounds. Mitigate with one shared selection and current measured-map geometry. Reuse one playing video with backdrop sampling, avoiding decode/clock drift. No data migration or environment change. Roll back by reverting the scoped cinematic/story release or restoring the previous successful Vercel production deployment; window PR can be reverted independently.
