# Agora case and career story

## Summary

Agora has a dedicated case at `/en/agora`. Its short home preview leads into context, personal contribution, product flow, a real matching decision, candidate designs and the declared stack. The career story names five steps instead of compressing company experience into the third art chapter.

## User experience

The author confirmed this sequence: Minecraft experiments → offering digital menus → frontend at Hogarth Worldwide → frontend engineering and leadership at Batech → AI product engineering at Flock I+D. Agora and Trainly are projects within the Flock stage. No dates, clients or results were inferred from that sequence.

Five visible entries explain actions, roles and scope. The existing three art chapters remain available with stable geometry, chromatic lens and keyboard controls. The two Flock project cards link to their respective cases and can be moved from their surfaces.

The Agora dossier has a section rail and direct links to the incident decision. A search without structured skills had produced an automatic rejection; the case explains the separate education-catalog gap, alternatives considered, bounded human-review guardrail and team-reported replay/control check. Personal contribution stays distinct from reported team validation. The case does not claim overall model accuracy or business impact.

Candidate artifacts are existing empty Figma designs with source links. The diagram remains illustrative. Drag, notes, native disclosures, related-case links and the shared header work with mouse, keyboard and touch. Global pause and reduced motion extend to the new page and its silent ASCII environment.

## Technical overview

- `src/app/en/agora/page.tsx`: route metadata, canonical URL and Open Graph design image.
- `AgoraDossier.tsx` / `agora-dossier.css`: dedicated narrative, event-driven section rail, candidate frames and scoped visual system.
- `AgoraCase.tsx`: concise home preview with the existing `AgoraFlow` and full-case links.
- `OriginStory.tsx` / `origin-story.css`: explicit career sequence and the two Flock projects.
- `SiteHeader.tsx`: configurable native return target; Agora returns to `/#agora`, Trainly retains `/#trainly`.
- `ProductWork`, `TrainlyDossier`, sitemap and `/agora` alias: connected case navigation and discovery.

There are no new dependencies, APIs, database operations or environment variables. The section observer and motion components clean up listeners and observers. Mobile Flock project cards keep their reading width while an outer gutter reserves horizontal drag space. The Agora hero reserves room beneath its rotated frame so the sticker leaves its source link reachable. Dragged nodes keep the existing geometric connector logic; chapter artwork remains mounted.

## Validation

Validated with Node.js 24.19.0 and an existing Chromium 149.0.7827.55, using the curated PR checkout.

- Lint, TypeScript and the production build passed. The final build is `o5LjCKYCVrlICAP9zvgQe`; `/`, `/en/agora` and `/en/trainly` prerender successfully.
- Eighteen native browser checks passed at 1440, 390 and 320 px on build `7tIPuyU15ohNo1Rg2Gv18`: chronology, chapter geometry, dossier reading, flow dragging/connectors, notes, native selection/copying and navigation between all three pages with persisted pause and reduced motion.
- Six targeted checks passed on the final build after correcting the hero sticker clearance and the mobile career-card movement boundary. They include surface drag and keyboard restore, all six case anchors, native wheel section tracking, disclosures, loaded Figma images and an unobstructed source-link hit target.
- Twelve HTTP checks passed on the final build: six redirects, three pages with canonical/description/language/one H1, robots, the three-entry sitemap and a 404.
- Story stage height stayed identical across all three chapters: 760 / 1050.6875 / 1069.46875 px at those respective widths. The document position of selected work stayed unchanged.

The local reports are `output/portfolio-design-2027/agora-story-native-v2.json`, `agora-story-final-v2.json` and `agora-story-routes-final.json`. The earlier relative-output harness failure and the two reproduced UI issues remain in local evidence; corrected checks passed. Browser journeys observed no horizontal overflow, JavaScript errors or failed resources.

The scripts are `scripts/verify-agora-story.py` and `scripts/verify-portfolio-routes.py`; they require an already-running local preview and an existing Chromium for browser checks. Supply the serving checkout with `--app-root` and its `.next/BUILD_ID` with `--build-id`.

![Agora dossier entrance](screenshots/agora-hero.png)

## Risks and follow-ups

Real phone text-selection callouts and handles remain outside Chromium emulation coverage. Figma frames show design states rather than live candidate records. Reported production checks are a bounded incident account, not an independent model benchmark. The PR preview is separate from production rollout.
