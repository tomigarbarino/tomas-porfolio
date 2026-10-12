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

`ProductWork.tsx` delegates its two-link directory to `CaseStudyDirectory.tsx`; `case-study-directory.css` owns the floating window. Existing directory styles, story scroll, draggable artifacts, cursor and dossiers remain unchanged. Agora uses `/media/agora-interview-ready.png` (owner-supplied Figma design) and `/media/agora-logo.svg`. Trainly uses `/media/trainly/campus-ai.png` (published demo) and `/media/trainly/trainly-logo.svg`. Captions distinguish the two sources. No new dependencies, API or database changes.

## Verification and rollback

Verify real hover, cursor following, switching products, edge bounds, leave/scroll/Escape dismissal, keyboard focus/navigation, pause/reduced motion, mobile links, and image loading. Run lint, TypeScript and the production build in the curated PR checkout. Revert this scoped change to restore the plain directory; no data or external-state rollback is required.

## Delivered behavior and evidence

The two links now open a pink Agora or violet Trainly window with the original logo, optimized screenshot and a source caption. The window follows the mouse with a settling, time-based interpolation and reserves image geometry before loading. It uses a body portal with pointer events disabled, so the original links stay clickable. Keyboard previews fit above or below their link and reduce the image height to keep the focus outline visible; exceptionally little space preserves the unobstructed link instead of showing the decoration. Switching back to mouse restores full size. Pause/reduced motion keeps a still preview.

Full ESLint and TypeScript passed; the final scoped lint and production build `HZhOOFWl9RhCEQ5UjOCYv` passed with Node 24.19.0. Twenty accepted native browser checks are recorded in `output/case-previews-2026-10-12/browser-checks.json`, including cursor following, product/image switching, Escape, scroll dismissal, mixed keyboard/mouse state, visible focus, direct Trainly navigation after the route settled, pause/reduced motion, 320px link/preview bounds, low viewport bounds and captured console errors. The screenshot is loaded eagerly only once the preview mounts, avoiding lazy-loading delay after hover. An early navigation sample is retained as a diagnostic, not a passing check. Physical touch was not tested; the browser does not support synthetic touch dispatch. Temporary viewport/media/touch overrides were reset. No production promotion is included.
