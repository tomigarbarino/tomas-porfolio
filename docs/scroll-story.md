# Scroll-led career story

## Summary

The home story is one chronological reading path with five complete articles. It replaces the three-chapter selector and separate career chronology. Scrolling changes the accompanying artwork; reading every stage does not require selecting a tab or clicking a control.

The sequence is confirmed by the owner. Agora and Trainly belong to Flock I+D; they are projects within the fifth stage, not additional employers. No employment dates are inferred.

## User experience

| Stage | Narrative scope | Optional anchor |
| --- | --- | --- |
| 01 / Minecraft | Changing game files before knowing it was programming. | `#story-files` |
| 02 / Digital menus | Taking a self-built idea to restaurants and starting conversations. | `#story-conversations` |
| 03 / Hogarth Worldwide | Frontend engineering for Apple-related projects. | `#story-hogarth` |
| 04 / Batech | Building the React and TypeScript frontend, organizing it by domain and growing into frontend leadership. | `#story-batech` |
| 05 / Flock I+D | Product engineering and AI R&D, with Agora and Trainly shown as nested projects. | `#story-interfaces` |

The Flock article identifies the personal scope of each project. Agora covers Product Owner responsibilities across discovery, priorities, architecture, hands-on AI implementation and candidate UX/UI. Trainly covers product flow, frontend and AI integration. Their links open `/en/agora` and `/en/trainly`. The Batech article links to the selected-work section at `#batech`, which is distinct from the career-stage anchor.

All narrative articles remain in the document and grow with their content. A sticky art area accompanies the current reading position. The native stage links are optional shortcuts, with `aria-current="step"` indicating the reading stage. The artwork and its media note may temporarily retain an earlier stage while someone uses a control or drags an artifact there.

## Technical overview

- `src/components/OriginStory.tsx` owns the five articles, optional anchor navigation, reading-stage selection and persistent artwork.
- `src/components/story-scroll.ts` shares the reading line between chapter selection and Hogarth/Batech/Flock steps. Mobile clears the actual sticky visual by 24px, capped 48px above the viewport bottom; non-sticky fallbacks retain ordinary reading geometry. A resize observer measures the visual for mobile anchor clearance.
- `src/components/origin-story.css` provides the sticky composition, responsive art area and normal-flow reading cards. Reduced motion and windows up to 600px high use a non-sticky art area and remove the article minimum height.
- `src/components/BatechVideo.tsx` accepts an active-stage flag and a caption ID. Playback also depends on visibility, the shared motion preference and document visibility.
- `src/components/StoryWorkbenches.tsx` provides the Hogarth interface study and Batech responsibility map; `FlockStoryStudio.tsx` connects product-brand exploration to the existing conceptual product flow.
- `src/components/SceneDiscoveries.tsx` and `src/components/PortfolioDialogs.tsx` link to the corresponding story article. The validated legacy `tg-story-chapter` event remains supported as an article jump.
- `src/components/MotionPreference.tsx` supplies the shared pause and reduced-motion state. The existing `ArtifactDrag` and ASCII video components retain their interaction and media responsibilities.

The reading stage and displayed artwork use separate state. A passive scroll listener schedules one animation-frame update, reads article positions and updates state only when the selected index changes. Intersection and resize observers handle visibility and content-size changes. Listeners, observers and scheduled frames are cleaned up on unmount.

All art stages stay mounted, preserving manual drag offsets. Inactive art is hidden from interaction and assistive technology; narrative articles are never hidden or made inert. Chapter selection does not programmatically focus or blur controls.

## Motion and interaction contracts

Normal page scrolling drives the experience. There is no wheel interception, scroll snapping requirement or replacement of native touch scrolling. Optional anchors retain native URL/hash navigation.

Genuine keyboard focus protects its surface during focus-induced scrolling, and active gestures protect the held artwork. Explicit native wheel/touch scrolling resumes chapter reading after keyboard exploration. Escape cancels a pointer drag without changing input modality; the held artwork catches up after pointer release. Pointer interaction clears keyboard modality even if the browser retains `:focus-visible` on an already-focused button. Mouse-click focus cannot pin an earlier visual chapter. Reading progress continues during a gesture hold. Existing draggable surfaces, keyboard grips, text-selection behavior and the RGB lens remain available.

The chapter number lives inside its artwork layer. Attribution notes stay mounted in one grid cell that reserves the tallest note's height. Number, artwork and note share the existing 520ms opacity easing, so the outgoing context fades with the incoming context without layout shifts. Global pause and reduced motion make the transitions immediate. Chapter fading does not transform or reset individual drag offsets.

Global pause and reduced motion stop decorative motion and silent autoplay without preventing access to any article or project link. Reading-stage tracking continues. Hidden documents and offscreen media pause playback; Batech playback additionally requires its story art to be active. A poster remains available if autoplay is unavailable.

## Chapter 03–05 interactions

Hogarth has a draggable conceptual interface study. The chapter's native scroll progress advances Compact → Editorial → Wide and reverses when scrolling up. It uses the same reading band as the story, with three discrete state changes and no extra scroll space. Hover, activation or keyboard focus can temporarily preview a composition. Any actual scroll, including within the same band, returns to the automatic composition without blurring the control. Dragging, global pause, reduced motion and document hiding suspend automatic changes. Manual controls still work while paused. A bounded pointer halo interpolates at 150ms and stops at rest, pointer exit, drag, document hiding, pause or unmount. This study is not a Hogarth or Apple project screenshot.

An 88px Apple-themed laptop sticker overlaps the top-right of the Hogarth reading card. It reserves no additional row or empty scroll space. Its visible label says “VIA HOGARTH”; the adjacent career copy already explains the frontend contribution, so there is no repeated popup. Hover/focus peels the decal, activation pins the peel and Escape releases it. The whole face supports dragging, with the shared keyboard grip and Home restoration. It is a career annotation, not an Apple employment claim or a project artefact.

Batech has a draggable responsibility map. Native chapter scroll advances Build → Organize → Lead and reverses on upward scroll. Button selection, conceptual route and contribution explanation change together, without clicks or extra scroll height. It shares Hogarth's guarded scroll hook and manual-preview reset behavior. These are responsibilities, not a reconstructed production architecture. The original company video and its source/role caption remain separate and visible above the map.

Flock shows the real Agora and Trainly logos as two draggable product pieces. The owner requested that app screenshots be removed from this story artwork; only the logos remain inside these pieces, with contribution details in the narrative cards. Hover/focus connects each product to the conceptual flow accent; Click or Space pins a project and Escape clears it. The logos also identify the two narrative-card headings. Existing flow nodes remain independently explorable and draggable. No part of the career/project copy requires these interactions.

The Flock narrative explicitly identifies the Product Engineer role, feature discovery, requirements, prioritization, architecture, implementation and validation, with Agora and Trainly as the two current products. Its conceptual process advances through Problem & hypothesis → Research → Implementation → Validation → Insights in five native scroll bands, reversing on upward scroll. The current badge, node, connections and inline explanation all change together. Any actual scroll ends manual previews/pins, including within the same band, without moving DOM focus. Pause/reduced motion freezes automatic process changes; manual exploration remains available. Explanations reserve the tallest panel's space, so changing stages does not move the surrounding layout.

Controls are at least 44px tall; ArrowLeft/Right and Home/End move between workbench controls. Mobile artwork uses a fixed 300px canvas across every chapter, with source captions and flow controls in separate areas. The flow's keyboard grips appear on keyboard focus; pointer users can drag the surfaces themselves. The outer drag frame never receives a pointer-follow transform.

The work section starts with a compact “Selected work.” heading and the three case links. The redundant Trainly concept planes, image, caption and repeated introductory CTA were removed. The actual Trainly and Batech case articles, their media and case routes remain intact.

## Operational notes

This change introduces no backend, external service, account, environment variable or database migration. It uses the existing local media and shared motion preference. Minecraft and café loops remain thematic references; the Hogarth stage contains a conceptual interface study without Hogarth or Apple project imagery. Batech footage is company context, with the personal frontend contribution identified separately.

See [Agora case and career story](agora-case-and-story.md) for the wider case narrative, [Observatory portfolio](observatory-portfolio.md) for shared interactions and [asset provenance](observatory-assets.md) for media boundaries.

## Validation

Status recorded on 2026-10-11 for this scroll-story change:

| Check | Status |
| --- | --- |
| Native browser at 1440px: all five stages, scrolling forward and back | Verified by root |
| Batech autoplay after a clean page load | Verified by root |
| Initial HMR playback observation | Diagnostic only; not the final playback result |
| 390px native scroll and stable scene geometry after changing artwork | Passed; caption minimum height prevents reflow |
| 320px complete articles, project links and headline bounds | Passed; no horizontal overflow, Flock grows to fit both projects |
| Whole story-card drag and keyboard Home restoration | Passed with native mouse and keyboard input |
| Scroll while an artwork control holds focus | Passed; reading advances while the focused artwork remains available |
| Global pause and reduced-motion scroll progression | Passed; videos pause and reading continues |
| Short viewport 1280 × 540 | Passed; artwork returns to normal flow |
| Final clean development reload | Five scenes; no new browser errors or error overlay |
| Full lint, TypeScript and production build in curated PR checkout | Passed with Node 24.19.0 |
| Production HTTP routes, redirects and metadata | 12 / 12 passed |
| Updated standalone browser regression scripts | Python syntax checked; browser suites not executed this revision |

Evidence is recorded in `output/story-scroll-2026-10-11/browser-checks.json` and `production-routes.json`. The final native screenshot is `13-final-minecraft.png`. Browser checks used the in-app browser with native wheel, mouse and keyboard input, plus read-only DOM measurements. Temporary viewport and motion emulation were restored after verification.

The chapter 03–05 refinement has separate native evidence in `output/story-interactions-2026-10-11/browser-checks.json`: 17 accepted checks, no unresolved failures. Desktop hover without clicks, halo response, frame drag/Home, workbench arrow navigation, Flock pin/Escape, native reading progression, 390/320px bounds/targets, caption separation, pause and reduced motion were checked. Mobile Flock spacing and the Batech caption were tightened after initial geometry findings and retested. Full lint/typecheck and production build `BmHm9K9uCBXWJckh91xj5` passed with Node 24.19.0; 12 production HTTP checks passed. No physical touch hardware test or standalone Playwright suite was run for this refinement.

The earlier Hogarth follow-up is recorded in `output/hogarth-scroll-2026-10-11/browser-checks.json`. Its sticker row and popup checks describe the earlier design, superseded by the overlap and no-popup correction above. Native forward/reverse Hogarth compositions remain in place. Current Flock/process, decal placement and compact work-entry verification is recorded separately in `output/flock-brand-2026-10-11/browser-checks.json`. Browser checks use mouse/wheel and keyboard input with emulated mobile dimensions; no physical touch test was run.

The Flock follow-up passed 24 native browser checks: all five process stages forward and backward, inline explanations with stable height, manual preview returning to scroll without losing focus, keyboard Home/End/Escape, pause/reduced motion, 320/390px targets and logo separation, Apple overlap/peel/drag/restoration, independent logo/node dragging, and the compact work entry. No browser console errors were observed after the final reload. Full lint, TypeScript and production build `Zlhv0ZVYJUOSwFRDiUG4E` passed in the curated PR checkout. Seven HTTP/content checks against that build passed; see `output/flock-brand-2026-10-11/production-routes.json`. The legacy three-node standalone flow suites were not run for this five-step revision. The evidence captures the local implementation, not a production release or hiring outcome.

The 2026-10-12 Batech and interaction-reset follow-up passed 19 native browser checks, recorded in `output/batech-scroll-2026-10-12/browser-checks.json`. Build → Organize → Lead and Hogarth's three compositions were checked forward and backward. Clicked and hovered previews in Hogarth/Batech and a pinned Flock step returned to the native state on a small scroll within the same band. A real keyboard-then-mouse-click focus lock was reproduced, corrected with input-modality tracking, and retested across Batech → Flock. DOM focus remains intact. Whole-surface map drag, keyboard Home, held-gesture freeze/release catch-up, global pause/manual keyboard controls, reduced-motion automatic freeze, continuing reading, and 320/390px bounds/targets/caption separation passed. No browser console errors were captured. Full lint, targeted final-source lint, TypeScript and production build `ORUCxnCbPI60vefqcDGI9` passed with Node 24.19.0. Home, Agora and Trainly returned HTTP 200 with titles against that build; the home response included the story and Batech controls. Temporary viewport/media emulation was restored and the separate production-check server was stopped. Physical touch hardware and standalone browser suites were not exercised. Reduced-motion manual-click attempts on offscreen artwork were diagnostic only; the accepted reduced-motion check covers automatic freeze and chapter reading, while manual controls were verified under global pause.

## Risks and follow-ups

The 2026-10-12 approved narrative refinement is documented in `docs/home-storytelling-refinement.md`. Batech now appears once in the career story; Agora 01 and Trainly 02 are the two home cases. Existing scroll, drag and focus coordination is preserved. Historical checks that require the second Batech block, a Trainly hero window or biography subviews in Side quests are superseded by this structure. Current evidence lives in `output/home-story-implementation-2026-10-12/`.

The subsequent chapter-transition review on 2026-10-12 passed 26 native checks in `output/chapter-transitions-2026-10-12/browser-checks.json`: all five chapters forward/reverse, a measured matching art/caption opacity crossfade, stable caption height, five artwork drag/return cases, Escape during/after drag, clicked state and genuine keyboard exploration followed by native scroll, rapid boundary reversal, 320/390px reading bands and visible anchor headlines, all mobile internal steps, pause/reduced motion, sticker/narrative-card exploration and inactive accessibility state. The Escape drag regression was reproduced before the correction and passed after it. Full lint, TypeScript and production build `9Pqzn1Ib58pBGdeVh0hbz` passed in the curated checkout; the development checkout's lint encountered an unrelated untracked Arena CJS scratch file. Home and both case routes returned 200 with titles against the build. No captured browser console errors after the final clean reload. Temporary viewport/media changes and test drag offsets were restored; the separate production-check server was stopped. No physical touch, browser zoom/text scaling or standalone browser suite was exercised. Local and PR evidence does not establish a production release.

Real mobile touch dragging and OS text-selection handles still require a device check. The responsive checks above used emulated dimensions and native mouse/wheel input, not physical touch hardware. No hiring or performance improvement is inferred from visual QA. The existing PR is updated for review; production promotion remains separate.
