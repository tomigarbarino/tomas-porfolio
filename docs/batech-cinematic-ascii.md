# Batech cinematic ASCII release

## Approved scope

The owner approved Figma cinematic option B (file `k4ubXD3U5cr9W9GbsvU44Q`, Build `301:600`, Organize `301:722`, Lead `301:844`) and explicitly requested production release together with the pending retro-window previews in PR #8. This ticket precedes implementation. Existing story-origin changes at `0869ffe` are the base, including the Minecraft intro and moved Batech chromatic lens.

## Implementation plan

- Reuse `/media/hero-ascii.mp4` and its existing poster, the exact imagery underlying the approved design. Preserve one video clock: the chromatic lens samples the same rendered film through its existing SVG backdrop filter.
- Add a small cinematic frame component with the approved pink chrome, multiply grade, large Build/Organize/Lead words and stage phrase. Use the existing CSS variables/fonts. No dependencies, heavy new video, API or DB change.
- Lift Batech's existing scroll-derived selection to its artwork parent. The film word, phase, controls and contribution detail share the same state. Manual preview ends on the next actual scroll; drag never takes over the scroll position.
- Keep the lens's bounded pointer follow, whole-surface drag and keyboard Home/Escape. Apply smooth changes to its default stage composition without duplicating or seeking a second video.
- Keep video lazy/visible/active/hidden-aware and honor global Pause and reduced motion. Content steps remain readable as the visitor scrolls; decorative animation stops.
- Keep the native sticky scene visible on short desktops and normal reduced-motion layouts. Very short phone viewports keep ordinary document flow to preserve reading room. This corrects the inherited rule that otherwise moved the new Batech scene far above its narrative.
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

## Delivered behavior and local verification

`BatechCinematic` composes the approved window chrome, existing ASCII footage, a grade applied only to the footage, and three persistent 550ms crossfade layers. `BatechVideo` attaches its existing source only when playback is eligible and keeps its poster behind unavailable or failed playback. `StoryArt` owns one Batech chapter selection and passes it to both the film and responsibility controls. The existing SVG backdrop lens samples that single video without a second decode/clock.

Native browser checks observed Build, Organize and Lead in both scroll directions, manual pointer selection returning to reading on the next wheel input, bounded lens follow, a 60px/20px lens drag, a 20px/6px film drag, Home reset and continued scroll selection afterward. Video time advanced with one video element; no HUD was exposed. At 320px and 390px, the film, lens and 44px controls fit. The mobile lens label now sits below the frame so it does not cover Organize. At 900×600 the scene stays visible; reduced motion leaves that same scene visible, pauses video, removes CSS transitions and still allows content steps to advance.

Full ESLint and TypeScript passed. The final optimized Next.js build `qxaIs7D6iNp3Tmk3ENHJv` passed. Local samples and screenshots are in the development workspace's `output/batech-cinematic-release-2026-10-14/`. Hosted preview and production verification are release gates recorded on PR #9 and in the release closeout, rather than implied by these local checks. Physical touch hardware is not included in these observations.
