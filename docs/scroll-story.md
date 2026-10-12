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
- `src/components/origin-story.css` provides the sticky composition, responsive art area and normal-flow reading cards. Reduced motion and windows up to 600px high use a non-sticky art area and remove the article minimum height.
- `src/components/BatechVideo.tsx` accepts an active-stage flag and a caption ID. Playback also depends on visibility, the shared motion preference and document visibility.
- `src/components/StoryWorkbenches.tsx` provides the Hogarth interface study and Batech responsibility map; `FlockStoryStudio.tsx` connects project-image exploration to the existing conceptual product flow.
- `src/components/SceneDiscoveries.tsx` and `src/components/PortfolioDialogs.tsx` link to the corresponding story article. The validated legacy `tg-story-chapter` event remains supported as an article jump.
- `src/components/MotionPreference.tsx` supplies the shared pause and reduced-motion state. The existing `ArtifactDrag` and ASCII video components retain their interaction and media responsibilities.

The reading stage and displayed artwork use separate state. A passive scroll listener schedules one animation-frame update, reads article positions and updates state only when the selected index changes. Intersection and resize observers handle visibility and content-size changes. Listeners, observers and scheduled frames are cleaned up on unmount.

All art stages stay mounted, preserving manual drag offsets. Inactive art is hidden from interaction and assistive technology; narrative articles are never hidden or made inert. Automatic stage changes do not move keyboard focus.

## Motion and interaction contracts

Normal page scrolling drives the experience. There is no wheel interception, scroll snapping requirement or replacement of native touch scrolling. Optional anchors retain native URL/hash navigation.

Artwork changes are held while its stage contains keyboard focus, a held pointer or an active artifact drag. Reading progress can continue during that hold. When the interaction ends, the artwork can catch up to the reading stage. Existing draggable surfaces, keyboard grips, text-selection behavior and the RGB lens remain available.

Global pause and reduced motion stop decorative motion and silent autoplay without preventing access to any article or project link. Reading-stage tracking continues. Hidden documents and offscreen media pause playback; Batech playback additionally requires its story art to be active. A poster remains available if autoplay is unavailable.

## Chapter 03–05 interactions

Hogarth has a draggable conceptual interface study. Hover, focus or activation of Compact, Editorial and Wide recomposes the same visual pieces and updates a reserved explanation. A bounded pointer halo interpolates at 150ms and stops at rest, pointer exit, drag, document hiding, pause or unmount. This study is not a Hogarth or Apple project screenshot.

Batech has a draggable responsibility map. Build, Organize and Lead highlight a different conceptual route and show the corresponding personal contribution. These are responsibilities, not a reconstructed production architecture. The original company video and its source/role caption remain separate and visible above the map.

Flock's Agora and Trainly images respond to hover and focus with a scope label, an interior color scan and a matching accent on the conceptual flow. Click or Space pins a project; Escape clears it. Frames retain their complete image ratio and whole-surface drag. The existing flow nodes remain independently explorable and draggable. Main career/project copy stays visible without any of these interactions.

Controls are at least 44px tall; ArrowLeft/Right and Home/End move between workbench controls. The workbench explanations reserve space across states. Mobile panels fit the existing 250px canvas, with source captions and flow controls in separate areas. The outer drag frame never receives a pointer-follow transform.

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

## Risks and follow-ups

Real mobile touch dragging and OS text-selection handles still require a device check. The responsive checks above used emulated dimensions and native mouse/wheel input, not physical touch hardware. No hiring or performance improvement is inferred from visual QA. The existing PR is updated for review; production promotion remains separate.
