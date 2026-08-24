# Proof Console Portfolio Redesign

## Summary

The landing page now presents Tomas as a Product Engineer and AI Product Builder through concrete, inspectable work. The redesign turns the hero's abstract workflow graphic into a Proof Console, gives Trainly a more focused case-study treatment, and labels supporting work by its real status instead of implying unsupported outcomes. A scoped GSAP motion layer now extends beyond the hero with kinetic typography and a pinned horizontal project reel inspired by award-winning portfolio patterns.

## User Experience

- Visitors see Tomas's role, current focus, and strongest product evidence in the first viewport.
- The primary CTA moves directly to the Trainly case study.
- The Proof Console links to three selected builds and makes each status visible: current, prototype, exploration, or private build.
- Project cards explain what evidence exists and offer a truthful walkthrough request when the work is not public.
- Mobile visitors get a persistent Work, Experience, and Email navigation dock.
- The hero enters in readable layers, followed by a sequential Proof Console boot that makes the selected builds easier to scan.
- On desktop, the Proof Console responds with a small pointer-driven tilt and ambient glow drift; it does not hijack scrolling or pointer behavior.
- A full-width kinetic-type interlude moves in opposing directions as visitors transition from the hero into selected work.
- On desktop, the supporting projects pin in place and travel horizontally in response to normal vertical scrolling. A progress line, panel scaling, and a luminous travelling orb make the transition visible.
- Mobile and reduced-motion users receive the same projects as a normal vertical list without pinning or horizontal translation.
- Desktop and mobile navigation identify the section currently being viewed. The state is exposed through both styling and `aria-current="location"`.
- The personal identity now uses a reusable vector TG seal instead of a generic gradient app-style tile. The same mark appears in the header and footer.
- The desktop header is a floating glass navigation surface with a compact indexed navigation capsule, stronger active states, and a dedicated contact pill. Mobile keeps a reduced brand/contact header above the persistent dock.
- Reduced-motion preferences, visible keyboard focus, larger mobile copy, and responsive asset layouts improve accessibility and readability.

## Technical Overview

- `src/App.tsx` defines the Proof Console, evidence metadata, project status labels, walkthrough links, and mobile quick navigation.
- `src/App.tsx` also defines the inline `PersonalMark` vector component and the indexed primary navigation labels.
- `src/App.css` provides the sticky navigation, console states, proof treatments, responsive layouts, focus styles, and reduced-motion behavior.
- `src/hooks/usePortfolioMotion.ts` owns the GSAP timeline, ambient console motion, desktop pointer tilt, kinetic marquees, pinned horizontal reel, panel scaling, ScrollTrigger section tracking, and all teardown logic.
- `src/trainly-showcase.css` compacts the Trainly gallery on narrow screens.
- `src/index.css` applies the existing monospace design language to the new interface elements.
- `public/trainly-logo.svg` is now referenced through its correct public path.

There are no backend, database, permission, or environment-variable changes.

The motion system uses `gsap.matchMedia()` to keep desktop-only interaction and reduced-motion behavior scoped. All animations are limited to opacity and transforms. The horizontal mode is enabled through an enhancement class only after the matching GSAP context mounts, so the base layout remains readable if JavaScript, motion, or desktop conditions are unavailable. React Strict Mode and responsive media changes are handled through GSAP cleanup and event-listener teardown.

## Color System

The visual system now uses a warmer editorial palette grounded in award-winning dark portfolio references and adapted to the real Trainly product assets:

- Ink background `#09090c` and layered surfaces `#111016` / `#181620`
- Warm ivory text `#f5f0e8`
- Coral primary accent `#fa8b67` for calls to action, movement, and highlighted copy
- Mineral violet secondary accent `#8f86e8` for depth, project states, and technical diagrams
- Mint success state `#83d8b8`

The color roles are stored as reusable CSS custom properties with RGB companions for alpha compositing. Hero gradients, Proof Console states, the horizontal reel, travelling orb, project cards, contact panel, and mobile dock all reuse these roles. Trainly's existing orange product identity remains intact and now sits inside the same warm color family instead of competing with a generic blue palette.

Measured contrast against the main ink background is 17.53:1 for primary text, 8.17:1 for secondary text, 5.17:1 for tertiary text, 8.48:1 for coral, 6.39:1 for violet, and 11.82:1 for success green. Dark CTA text reaches 7.95:1 against coral.

## Operational Notes

- Public evidence links remain public.
- Private or non-public work uses pre-addressed email walkthrough requests rather than fabricated repository links or metrics.
- The production build remains a static Create React App bundle deployed through Vercel.

## Validation

- `npm run type-check`
- `npm run build`
- `npm test -- --watchAll=false --runInBand --passWithNoTests` (no test files are currently present)
- Desktop browser verification at 1440 x 900
- Mobile browser verification at 390 x 844
- Internal CTA, active-section navigation, and `aria-current` checks
- Reduced-motion verification at 1440 x 900
- Horizontal reel verification: track translation from approximately `0px` to `-900px` during the sampled scroll, complete final-panel visibility, and orb translation across the viewport
- Broken-image, horizontal-overflow, and browser-console checks at desktop and mobile widths
- Side-by-side visual comparison with the selected Lazyweb reference

## Risks And Follow-ups

- The repository currently has no automated test files; validation relies on type checking, the production build, and browser QA.
- The strongest supporting projects are private or exploratory, so their proof CTAs currently rely on direct walkthrough requests.
- No analytics event was added for Proof Console or walkthrough interactions.
- GSAP adds roughly 44 kB gzip to the main JavaScript bundle; a future performance pass can evaluate a smaller custom motion layer if this becomes material.
- The horizontal reel intentionally uses the existing verified project evidence rather than invented case-study media.
- Full-page WebGL remains excluded. It should be considered only for a contained project demo with real media and a poster/fallback path.
- Claims remain intentionally qualitative until verified outcome metrics are available.
