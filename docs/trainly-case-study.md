# Trainly portfolio case study

## Current implementation

The canonical case is `/en/trainly`, rendered by the Next.js App Router page at `src/app/(english)/en/trainly/page.tsx`, composing `src/views/trainly.tsx`. It uses the portfolio's typography, floating header, ASCII backdrop, draggable windows, stickers, cursor and shared motion preference. The aliases `/trainly` and `/trainyl` permanently redirect to the English route. `/es/trainly` now renders the complete Spanish case with a reciprocal EN/ES switch; see `portfolio-languages.md`.

The narrative follows company knowledge through a reviewable plan, learning, assessment and manager actions. The central product decision is visible: the AI proposes chapters with source references, and generation stops when conflicting material needs a human decision.

## Actual application captures

The approved October 13, 2026 capture package replaces the concept hero, learning illustration, format study and validation artwork. The older campus and manager images are also replaced. Four PNGs are copied byte-for-byte into `public/media/trainly/`; no image editing or remote image sources are introduced.

| File | Intrinsic dimensions | Use |
| --- | --- | --- |
| `trainly-02-plan-decision-bloqueante@2x.png` | 2880 × 1800 | Full-width plan review at `#learning-sequence`: source references, conflicting requirements and disabled generation pending a decision |
| `trainly-03-actividad-clase-narrada-tutor.png` | 1440 × 900 | Hero and `#trainly-campus`: narrated lesson with a slide-specific tutor |
| `trainly-04-cuestionario-feedback.png` | 1440 × 900 | Practice feedback: an incorrect answer is marked |
| `trainly-05-seguimiento-responsable.png` | 1440 × 900 | `#trainly-manager`: priority cases, follow-up actions and active study time |

These are actual Trainly interfaces rendered in a local demo on product `main` (`3985301`) with fictional data and a local backend. They demonstrate the interface and product flow. Counts, percentages, people and course progress inside the screenshots are fixtures, not client results. The page explains the demo provenance once in the contribution prose; each image has descriptive alt text. No image foot captions are added.

The quiz is presented separately from conversational assessment. It does not demonstrate a voice interview or establish competence. Its visible limitation becomes a product insight: the interface highlights the incorrect answer but does not explain the answer or show the correct one. No voice clips, adoption metrics or learning outcome claims are introduced.

## Participation

The team built the initial platform, document import, oral assessment, users/roles and branding. The case credits Tomás's work on source handling, the reviewable plan, narration and source context, learning progression, and the manager's action center. The approved package supports those contributions; the case does not attribute the entire product to one person.

The declared product status remains live with clients and growing. The portfolio has no independently verified usage totals or learning-outcome measurements to publish.

## Structure and interaction

The six case sections remain `#challenge`, `#loop`, `#experience`, `#validation`, `#system` and `#learnings`. Existing loop destinations `#learning-sequence`, `#trainly-campus`, `#evaluation-approach` and `#trainly-manager` are preserved.

- `TrainlyDossier.tsx` renders the case and reusable evidence frames.
- `trainly-dossier.css` keeps the colored window bars, offset shadows and responsive layout.
- `trainly-dossier.ts` supplies stage descriptions, formats and learnings. Structure now describes source traceability and approval; Improve describes concrete manager actions.
- `TrainlyLoopExplorer` keeps hover, focus and click previews with an accessible all-stages disclosure.
- `ArtifactDrag` still moves each window from its non-control surface, including the image. Native image dragging is disabled to avoid a competing ghost image.
- Every evidence frame has an `Open image` native link in the window bar, with a minimum 44 px target and a new-tab label. The image itself remains a drag surface. This lets visitors inspect dense interface text at its original resolution on small screens.
- Hero imagery uses priority loading; below-fold captures retain native lazy loading through `next/image` with explicit intrinsic sizes and responsive `sizes`.
- Shared pause/reduced-motion controls, scroll motion, stickers and the loop controller are unchanged. No dependencies, custom animation loops, APIs, database changes or environment changes are required.

## Verification

Full ESLint, TypeScript and optimized Next.js build `L9COYo1uqihApO_xxthcC` passed. All 12 route/metadata checks and seven local image/content checks passed; served PNG hashes match the approved sources.

Native browser verification covered desktop/320/390px framing, all five rendered image instances, the 44px original-image links, opening the full 2880×1800 plan by keyboard, dragging from the plan image while scrolling, native Tab-focused movement and Home reset, the updated Structure/Improve stages, the retained manager anchor, shared Pause and confirmed reduced motion. Four early reads are retained as verifier diagnostics: responsive-image loading/native scrollbar width, locator-assisted keyboard focus (two observations), and asynchronous media-query propagation. Corrected checks passed without an application patch. A broad locator also matched the five mounted stage links; the exact manager link passed.

Local evidence and desktop/mobile screenshots are in `output/real-product-captures-2026-10-13/` in the development workspace. The PR records exact-head Vercel preview verification separately. Historical product tests are background evidence; these checks validate the portfolio presentation, not the Trainly backend, AI output, physical touch hardware or learning outcomes.

## Follow-ups

Publish quantitative client outcomes only after measurement and permission. A future conversational assessment capture needs its own evidence; the quiz remains a practice example. Additional capture formats or clips should be chosen for a concrete narrative purpose rather than filling the page with more screenshots.
