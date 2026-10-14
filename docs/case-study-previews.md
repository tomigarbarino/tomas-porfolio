# Cursor previews for the case directory

## Scope and acceptance

The user requested an animated logo + product screenshot preview when hovering Agora or Trainly in the homepage Case studies directory. This directly authorizes this scoped implementation.

- Keep both dossier links and their visible story summaries available without JavaScript, hover or extra clicks.
- Add an isolated client directory component; keep ProductWork and the rest of the homepage server-rendered.
- Show the appropriate existing brand and product image in a portfolio-style floating window. Follow mouse movement smoothly, stay inside the viewport, and let pointer events reach the underlying links.
- Keyboard focus shows a stationary preview. Escape, leaving the directory, scrolling and window blur dismiss it. Touch links navigate on the first tap.
- Global pause and system reduced motion disable cursor following and decorative animation; the preview remains available as a still.
- Use an event-driven, settling requestAnimationFrame loop with refs, not React updates per pointer movement or a permanent animation loop.

## Files and assets

`ProductWork.tsx` delegates its two-link directory to `CaseStudyDirectory.tsx`; `case-study-directory.css` owns the floating window. Existing directory styles, story scroll, draggable artifacts, cursor and dossiers remain unchanged. Agora uses `/media/agora/agora-03-evidencia-por-requisito.png` (1440 × 900) and `/media/agora-logo.svg`. Trainly uses `/media/trainly/trainly-02-plan-decision-bloqueante@2x.png` (2880 × 1800) and `/media/trainly/trainly-logo.svg`. These publication-approved captures show actual application interfaces rendered locally with fictional data. See [Agora capture provenance](agora-case-and-story.md#complete-recruiter-review-capture--2026-10-13) and [Trainly capture provenance](trainly-case-study.md#actual-application-captures). Visitor captions describe the experience instead of the asset source. No new dependencies, API or database changes.

## Verification and rollback

Verify real hover, cursor following, switching products, edge bounds, leave/scroll/Escape dismissal, keyboard focus/navigation, pause/reduced motion, mobile links, and image loading. Run lint, TypeScript and the production build in the curated PR checkout. Revert this scoped change to restore the plain directory; no data or external-state rollback is required.

## Initial preview behavior and evidence — 2026-10-12

The two links now open a pink Agora or violet Trainly window with the original logo, optimized image and an experience caption. The window follows the mouse with a settling, time-based interpolation and reserves image geometry before loading. It uses a body portal with pointer events disabled, so the original links stay clickable. Keyboard previews fit above or below their link and reduce the image height to keep the focus outline visible; exceptionally little space preserves the unobstructed link instead of showing the decoration. Switching back to mouse restores full size. Pause/reduced motion keeps a still preview.

Full ESLint and TypeScript passed; the final scoped lint and production build `HZhOOFWl9RhCEQ5UjOCYv` passed with Node 24.19.0. Twenty accepted native browser checks are recorded in `output/case-previews-2026-10-12/browser-checks.json`, including cursor following, product/image switching, Escape, scroll dismissal, mixed keyboard/mouse state, visible focus, direct Trainly navigation after the route settled, pause/reduced motion, 320px link/preview bounds, low viewport bounds and captured console errors. The screenshot is loaded eagerly only once the preview mounts, avoiding lazy-loading delay after hover. An early navigation sample is retained as a diagnostic, not a passing check. Physical touch was not tested; the browser does not support synthetic touch dispatch. Temporary viewport/media/touch overrides were reset. No production promotion is included.

## Scattered retro window cascade — 2026-10-14

Following the user's correction, mouse hover reveals five windows distributed across the viewport, with different sizes and positions, rather than a uniform diagonal stack. A full-viewport body portal contains the stage. Each product has a stable layout with normalized viewport coordinates; rendering does not generate random positions. CSS bounds the echoes to the viewport and scales their widths down below 600 px. The main window, with the product logo and primary capture, follows the cursor independently through `floatingRef` and retains its own viewport clamp.

Every echo contains an approved actual application capture. Agora combines candidate entry, interview readiness and criterion-level evidence; Trainly combines the reviewable plan, narrated lesson, practice feedback and manager follow-up. Repeated views reuse the same optimized image URLs. The beveled chrome uses Agora pink or Trainly violet. Echoes reveal over 260 ms with a 30 ms stagger; the main window starts after 120 ms and reveals over 240 ms.

Leaving the link collapses the stage with a 140 ms Web Animations transition. Entering another product or restoring keyboard focus cancels the pending exit. Clicking dismisses the decoration and lets the native, prefetched `Link` navigate immediately; it never waits for an animation or timeout. The portal remains decorative, hidden from assistive technology and transparent to pointer events. Escape, scroll, resize, window blur and page hiding dismiss it immediately.

Keyboard focus, global Pause and system reduced motion show a single stationary front window without echoes. Enabling Pause or reduced motion during an exit finishes dismissal; unmount cancels the pending animation. The existing settling animation frame loop and event listeners retain their cleanup. No dependencies, APIs, database operations or environment variables are added.

Full ESLint, TypeScript and optimized build `n8ls3Hzhs0IAH1ihGrfjW` passed for this correction. Native browser checks verified the distinct desktop positions and loaded real views for both products, complete exit, one static keyboard/reduced-motion preview, and individual window bounds at 800 × 320 and 320 × 740. Evidence and screenshots are in `output/retro-preview-scatter-2026-10-14/` in the development workspace. The earlier build and browser checks below apply to the superseded first cascade iteration. Exact-head hosted verification is recorded in PR #8; this change does not promote production.

## Earlier cascade evidence — 2026-10-14

Full ESLint, TypeScript and optimized build `KLpcowzEOhi569ThGo_hW` passed for the initial diagonal cascade. Its native browser checks verified both primary assets, rapid product switching and leaving, Escape/scroll dismissal, a single static keyboard preview clear of its focus outline, global Pause, reduced-motion stills, changing reduced motion during an exit, and the then-current full-stack bounds at 800 × 320 and 320 × 740. Clicks to both dossiers were dispatched while the front window still had zero opacity in that optimized local build; both routes opened without waiting for the cascade and left no portal behind. No captured browser errors were observed. Early samples taken before state/scroll settled are retained as diagnostics, followed by stable checks.

Evidence is in `output/retro-preview-cascade-2026-10-14/` in the development workspace. Temporary viewport and media emulation were reset and the shared motion control was restored to playing. These checks validate the portfolio presentation; physical touch hardware and hosted production have not been tested for this iteration. This change does not promote production.
