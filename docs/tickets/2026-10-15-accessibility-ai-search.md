# Accessibility and AI search audit

User request: audit the whole public portfolio for accessibility and improve SEO for AI search. This authorizes bounded corrective implementation; preserve the approved ASCII/retro design. The secret 404 remains a Figma design and is outside this runtime change.

## Scope and baseline

- Base: origin/main bb21d7cd6372ea18153f0209201a5248fa5fc64d.
- Routes: `/`, `/en/agora`, `/en/trainly` and an unknown-route response.
- Target: WCAG 2.2 A/AA, with automated and manual checks reported separately. A passing automated scan does not certify conformance.
- SEO baseline: existing canonicals, public robots policy and three-route sitemap. Keep search crawling distinct from model-training permissions.
- No database, API, authentication or analytics changes. No invented career claims or outcomes.

## Proposed implementation

1. Capture current renders and audit keyboard/focus, dialog return, reduced motion/pause, drag alternatives, hover content, reflow, semantics, names and contrast. Record confirmed defects with WCAG references.
2. Correct confirmed defects in shared controls with minimal visual change. Initial code finding: dark focus treatment is needed on lime window chrome. Provide click/tap movement alternatives in addition to existing drag and keyboard movement.
3. Correct the home metadata's ambiguous Trainly/Batech attribution. Add server-rendered, accurate structured data for the profile and the two authored case narratives. Preserve visible content as the factual source. Do not invent special AI schemas or imply guaranteed indexing/citation.
4. Verify metadata/canonicals/robots/sitemap, HTML text available before hydration, valid graph relationships and real case/research links. Add a small regression check for these contracts.
5. Run typecheck, lint, production build, automated accessibility checks and targeted manual regression checks. Open a reviewable PR if changes pass; no production release in this request.

## Expected files

- `src/components/ArtifactDrag.tsx`, `artifact-drag.css`: single-pointer movement alternatives and focus management.
- `src/components/Window.tsx`, `src/app/globals.css`: retro window controls and visible focus.
- `src/app/layout.tsx`, `src/app/page.tsx`, `src/app/en/agora/page.tsx`, `src/app/en/trainly/page.tsx`: truthful metadata and server-rendered schema.
- A shared SEO module and validation script if needed, using the existing route and content conventions.
- Additional shared component fixes only for confirmed audit findings; record actual changes in the audit report.

## Acceptance

- Existing pointer drag, chapter scroll, window cascades and case navigation still work.
- Repositioning is available through keyboard and single click/tap controls; Escape closes popovers and returns focus.
- Focus remains visible on both dark and lime surfaces; dialogs close with Escape and restore focus.
- Pause/reduced-motion behavior works; no keyboard trap or horizontal page overflow at the tested sizes.
- Accurate profile/case metadata and schema appear in the server HTML, use stable canonical IDs and match visible evidence.
- Robots/sitemap remain crawlable; no unrelated training permission change.
- Findings, fixes, results and limitations are saved with screenshots. Do not label the site fully WCAG compliant from automated tests alone.

## Risks and rollback

Popover controls must not start a drag, steal scroll or block nested links. Schema must describe authorship of the case narrative, not sole authorship of the products. Revert this PR to restore the previous public behavior; there is no data migration or persistent-state change. Production remains unchanged until a separate release step.
