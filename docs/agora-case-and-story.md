# Agora case and career story

## Summary

Agora has a dedicated case at `/en/agora`. Its short home preview leads into personal contribution, a real matching decision, product flow, candidate designs and the declared stack. The career story names five steps instead of compressing company experience into the third art chapter.

## User experience

The author confirmed this sequence: Minecraft experiments → offering digital menus → frontend at Hogarth Worldwide → frontend engineering and leadership at Batech → AI product engineering at Flock I+D. Agora and Trainly are projects within the Flock stage. No dates, clients or results were inferred from that sequence.

The career story now uses five complete scenes that advance with the reading position, replacing the earlier three-chapter summary plus separate chronology. Its chromatic lens and keyboard controls remain available. The two Flock project cards stay inside that stage, link to their respective cases and can be moved from their surfaces.

The Agora dossier has a section rail and direct links to the incident decision. A search without structured skills had produced an automatic rejection; the case explains the separate education-catalog gap, alternatives considered, bounded human-review guardrail and team-reported replay/control check. Personal contribution stays distinct from reported team validation. The case does not claim overall model accuracy or business impact.

Candidate artifacts are existing empty Figma designs with source links. The diagram remains illustrative. Drag, notes, native disclosures, related-case links and the shared header use the portfolio's shared interaction components. Global pause and reduced motion extend to the page and its silent ASCII environment. The coverage below distinguishes desktop input and mobile viewport checks from real-device touch verification.

## Technical overview

- `src/app/en/agora/page.tsx`: route metadata, canonical URL and Open Graph design image.
- `AgoraDossier.tsx` / `agora-dossier.css`: dedicated narrative, event-driven section rail, candidate frames and scoped visual system.
- `AgoraDecisionReplay.tsx` / `agora-decision-replay.css`: fixed before/after rule states with independent hover, focus and pinned selection; no live evaluation.
- `AgoraCase.tsx`: concise home preview with the existing `AgoraFlow` and full-case links.
- `OriginStory.tsx` / `origin-story.css`: explicit career sequence and the two Flock projects.
- `SiteHeader.tsx`: configurable native return target; Agora returns to `/#agora`, Trainly retains `/#trainly`.
- `ProductWork`, `TrainlyDossier`, sitemap and `/agora` alias: connected case navigation and discovery.

There are no new dependencies, APIs, database operations or environment variables. The section observer and motion components clean up listeners and observers. Mobile Flock project cards keep their reading width while an outer gutter reserves horizontal drag space. The Agora hero reserves room beneath its rotated frame so the sticker leaves its source link reachable. Dragged nodes keep the existing geometric connector logic; chapter artwork remains mounted.

## End-to-end refinement — 2026-10-11

The reading order is now **role → decision → flow → candidate experience → system → next**. The hero names the Product Owner role at Flock I+D and its five areas of responsibility. Four contribution cards link those responsibilities to supporting parts of the case, replacing a generic product setup that delayed the author's involvement.

The incident starts with the talent team's report of a student rejected for a trainee search. Two separate causes follow: the search had no structured skills, and the education catalog missed English aliases. The author's contribution remains “I helped define a bounded fix”; release checks are explicitly team-reported. The case explains why an immediate guardrail and the longer search-creation work had different scopes. Its concrete result heading is “One decision changed. Scores stayed the same.”

The yellow decision frame includes a replay of the reported rule. Hover or keyboard focus previews a state, click or Enter pins it, and Escape restores “With guardrail”. Hover and focus are independent, so clearing one does not discard the other. Both states retain the same footprint. The replay is labeled illustrative and does not run a candidate calculation.

The page shares the home and Trainly ASCII world, pink cursor, paper surfaces, peel stickers, surface dragging and scroll depth. Its world now consumes the shared scroll field, including reduced motion. Two additional stickers connect candidate experience and bounded validation to the visual language. Local mobile gutters provide actual horizontal travel inside drag boundaries. An opened hero sticker's note now sits beside the sticker, leaving its Figma source link reachable. The section rail resets correctly when returning to the hero.

### Current validation

- Node.js 24.19.0: lint, TypeScript and production build passed in the curated PR checkout. Final build: `WMpEIhMlsktMLcCo2mytn`; all three pages prerender successfully.
- **20 accepted checks passed in the Codex in-app browser** against the main workspace development server at 1440, 390 and 320 px. This browser's version was not exposed. Coverage includes contribution surface drag/reset, five mobile frame families' keyboard travel/reset, all six section anchors, reading-band tracking, open/closed sticker source hit targets, replay preview/pin/Escape and stable height, flow connector movement, keyboard details and cross-page navigation with persisted pause.
- Silent autoplay was observed with time advancing, muted audio, looping enabled and controls hidden. The shared scroll field moved the Agora world; global pause froze video and field. Emulated reduced motion stopped decorative movement while replay controls remained usable.
- **12 HTTP checks passed against that production build**: six redirects, metadata for all three pages, robots, the three-entry sitemap and a 404. Browser interaction checks used the development server; they are not attributed to the production build ID.
- `verify-agora-story.py` was extended for the new reading order, contribution links, replay behavior, open-note source clearance and mobile movement. Python syntax was checked. Its Playwright suite was **not executed in this audit**; the actual interaction checks used the selected in-app browser.

Current local evidence: `output/agora-review-2026-10-11/AUDIT.md`, `browser-checks.json` and `routes-production.json`. Diagnostic input/capture attempts remain recorded separately from accepted checks. No dependencies, APIs, database operations or environment variables were added.

![Personal responsibilities and their supporting sections](screenshots/agora-role.png)

![Illustrative replay of the bounded product decision](screenshots/agora-decision.png)

## Initial dossier milestone validation — historical

Validated with Node.js 24.19.0 and an existing Chromium 149.0.7827.55, using the curated PR checkout.

- Lint, TypeScript and the production build passed. The final build is `o5LjCKYCVrlICAP9zvgQe`; `/`, `/en/agora` and `/en/trainly` prerender successfully.
- Eighteen native browser checks passed at 1440, 390 and 320 px on build `7tIPuyU15ohNo1Rg2Gv18`: chronology, chapter geometry, dossier reading, flow dragging/connectors, notes, native selection/copying and navigation between all three pages with persisted pause and reduced motion.
- Six targeted checks passed on the final build after correcting the hero sticker clearance and the mobile career-card movement boundary. They include surface drag and keyboard restore, all six case anchors, native wheel section tracking, disclosures, loaded Figma images and an unobstructed source-link hit target.
- Twelve HTTP checks passed on the final build: six redirects, three pages with canonical/description/language/one H1, robots, the three-entry sitemap and a 404.
- Story stage height stayed identical across all three chapters: 760 / 1050.6875 / 1069.46875 px at those respective widths. The document position of selected work stayed unchanged.

Those milestone reports are `output/portfolio-design-2027/agora-story-native-v2.json`, `agora-story-final-v2.json` and `agora-story-routes-final.json`. They were not rerun in the 2026-10-11 audit. The earlier relative-output harness failure and the two reproduced UI issues remain in local evidence; corrected checks passed at that milestone. Those browser journeys observed no horizontal overflow, JavaScript errors or failed resources.

The scripts are `scripts/verify-agora-story.py` and `scripts/verify-portfolio-routes.py`; they require an already-running local preview and an existing Chromium for browser checks. Supply the serving checkout with `--app-root` and its `.next/BUILD_ID` with `--build-id`.

![Agora dossier entrance](screenshots/agora-hero.png)

## Risks and follow-ups

Real phone touch dragging, text-selection callouts and OS handles were not certified by the current in-app audit. Mobile geometry and keyboard travel were verified; the in-app CDP endpoint did not support touch dispatch. Figma frames show design states rather than live candidate records. Reported production checks are a bounded incident account, not an independent model benchmark. No FPS, other-browser or hiring-conversion result is claimed. The PR preview is separate from production rollout.
