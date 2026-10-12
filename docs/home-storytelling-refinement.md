# Homepage storytelling refinement

The approved audit is `output/home-story-audit-2026-10-12/report.html`. The user asked to apply its recommendations on 2026-10-12.

## Result

The homepage follows one reading path: identity, the complete career story, Agora, Trainly, contact. Minecraft → digital menus → Hogarth Worldwide → Batech → Flock I+D remain five visible chapters driven by native scroll. Agora and Trainly remain products within Flock.

- The shared header replaces Work with an acid-colored Case studies link to `/#work`. On small screens the visible and accessible label is Cases. Story, Contact and the motion preference remain available on home and both dossiers.
- The hero retains its ASCII background, paper objects and draggable project window. The featured window now introduces Agora's human-review guardrail. Its close, minimize, restore and keyboard behavior are unchanged; project names are supplied as a prop.
- Batech is told once, in its career chapter. Its SaaS context and growth from sole frontend engineer to frontend leadership complement the Build / Organize / Lead workbench. React/TypeScript, domain organization and continuing feature delivery remain in the automatic workbench steps. Company footage is attributed as context. `#batech` remains a legacy alias inside `#story-batech`.
- Flock explains the broader responsibility for a complete feature, then distinguishes Agora product ownership/AI/candidate UX from Trainly's learning experience. Both logos and all five scroll-driven process steps remain. Short visual verbs Implement / Validate preserve the full accessible and explanatory names Implementation / Validation. At 360px and below, Problem preserves Problem & hypothesis in its accessible name and full inline explanation.
- `#work` contains a two-case directory and both summaries in the same order: Agora 01, Trainly 02. Both dossier labels match that numbering.
- Agora's homepage summary makes the problem, individual contribution and team-reported scoped check visible without a modal or dossier click. The detailed alternatives, replay, product flow, candidate designs and architecture remain in `/en/agora`.
- Trainly's summary shows the problem, contribution and client-use / growing state confirmed by the owner on 2026-10-12. This case does not report quantified learning outcomes; demo values remain illustrative. Repeated tags and the redundant loop disclosure were removed; detail remains in `/en/trainly`.
- Quick profile provides a compact alternate reading route. Side quests keep the learning-loop game and link directly to chapters instead of retelling the biography. The hero's paper discoveries use short hints instead of repeated paragraphs.
- Dialog chapter links close the modal before fragment scrolling and keyboard focus transfer. Repeated links to the current fragment still scroll to their destination; modified clicks keep normal link behavior.
- Contact states the opportunity sought and gives direct contact/profile links, without another capabilities paragraph or Where I fit disclosure.

## Scope and compatibility

No database, API, authentication, external integration or runtime dependency changes. Existing drag, scroll, motion preference and pointer/focus coordination remain the same. The new case cards use the existing ArtifactDrag boundary contract. The Agora product flow remains interactive in the dedicated dossier.

`SiteHeader`, `Window`, `Observatory`, `OriginStory`, `StoryWorkbenches`, `ConceptualProductFlow`, `ProductWork`, `AgoraCase`, both dossier labels, discovery/dialog components and their scoped styles implement the change. The homepage remains a server component; no new animation library or per-frame React update was introduced.

Historical browser scripts that assert three home work entries, a second Batech case, Trainly hero window labels or biography subviews in Side quests describe the previous design. Their results cannot be used as current evidence. The route/metadata verifier remains applicable. Native current browser checks and captures are recorded in `output/home-story-implementation-2026-10-12/`.

## Validation

Full ESLint, TypeScript and production build `rIY6T4bTSQ_tMFZHhPcy9` passed in the curated checkout using Node 24.19.0. The dev checkout stayed running on port 3000; the production build used the separate curated checkout. The stdlib route/metadata verifier passed all 12 checks against that local production preview: home, both case routes, six redirects, robots, sitemap and unknown-route handling.

24 accepted native browser checks are documented in the evidence folder: story and case order, shared header/case navigation, case returns and numbering, Batech video context, scroll resuming after manual selection and drag, whole-surface dragging, compact profile/Escape focus restoration, Side quests and the completed game, direct quest navigation/focus, the legacy Batech link, and 320/390px header and compact process/card bounds. The original 320px label overflow was corrected and retested. Direct CDP pointer input confirmed URL/focus behavior where high-level browser link/goto samples were inconsistent. Diagnostic samples are retained separately and are not counted as passing checks.

Temporary viewport overrides and test offsets were restored. No standalone Playwright browser suite, physical touch device or hiring-conversion study was run. Team-reported Agora checks remain attributed and are not a new production audit.

## Rollback

Revert the scoped refinement commit. No data migration or external-state rollback is needed. Preserve preexisting local `next-env.d.ts` changes and unrelated research outputs.
