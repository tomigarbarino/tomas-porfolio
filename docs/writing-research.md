# Writing & Research

## Summary

Work and Writing & Research are independent destinations. The homepage now reads introduction → career story → original work → professional cases → brief writing preview → contact. The Work anchor includes Orquestador first. Agora and Trainly remain professional projects at Flock I+D.

## User experience

`/writing` is a card catalogue. Open the JEV card to find the complete study, reading notes and local PDF download. `/writing/jev` hosts the original 17-page Spanish report, an embedded PDF reader, full-view and download links, followed by English reading notes with expandable margin annotations. The owner explicitly requested the complete research and original document on the portfolio, rather than only an outbound summary.

The source PDF is preserved byte-for-byte, including all methods, results, figures, references and appendices. This is the existing report authored by Tomás Garbarino, not a newly generated or translated report. The owner clarified that the portal should be its primary home without external publication links or publisher promotion. The pages emphasize personal authorship and retain the October 4, 2026 date. The document itself remains intact; its source metadata is retained for file provenance. The reading notes distinguish retrospective agreement from hiring outcomes and deployed policy. No private candidate records are included.

## Page signatures

- Home preserves the explorable desktop and five-stage career story.
- Agora preserves the evidence dossier and before/after guardrail comparison; research is now a related-reading link, with product implementation evidence retained in the case.
- Trainly wraps its five-stage explorer in a learning console with previous/next controls and module indicators.
- Orquestador has a manual four-step evidence sequencer. A deliberate unsupported deployment claim blocks all output; restoration re-enables the original draft.
- Writing uses an expandable catalogue card; JEV uses a document reader and annotated printout.

All controls are available without dragging or autoplay. Native disclosures support keyboard and touch. Card motion follows the existing pause and reduced-motion settings. Existing typography, acid, violet, pink, retro windows, cursor and artifact interactions are retained.

## Technical overview

`SiteHeader.tsx` links to `/writing` independently of `/#work`, sets category-aware `aria-current`, and supplies accurate back links. Home fragment state uses `useSyncExternalStore` with a stable server snapshot. The old `/#writing` and Agora `#research` anchors remain valid. Writing pages are server-rendered; native disclosures need no client JavaScript.

`writing-seo.ts` supplies distinct canonicals, social metadata and collection/article structured data, including a local PDF encoding and a local reference to the complete report. The sitemap includes both routes. `src/content/jev-report.json` records the original public PDF source, page count, size and SHA-256; `public/documents/jev-agora-research.pdf` is the unchanged report.

`OrquestadorSequencer.tsx` uses the saved public source packet and original model selection. The gate is a byte-for-byte copy of the original demo module, documented under `src/lib/orquestador/README.md`; no inference or external write occurs. Tests verify original source-byte integrity, contract rejection, absence of partial drafts and successful restoration. No API, database, dependency, tracking, authentication or migration was added.

## Operational notes

Start the Next production preview after `npm run build`. The PDF is served from the same site; browser-native embedding varies, so open/download links remain visible on every viewport. The reader adds an 806 KB document, loaded lazily. No new model/provider cost occurs.

## Validation

`npm run lint`, `npm test` (9 cases), `npm run typecheck` and `npm run build`. Browser checks covered desktop, 800 px tablet, 390 px and 320 px layouts; no page overflow in the tested views. Keyboard catalogue expansion and annotations, independent active navigation, home sequence and original-work entry, Agora guardrail comparison, Trainly progression, Orquestador valid/failure/restore states and inline full-report rendering were checked. The pause-specific card rule was strengthened after QA found a specificity conflict. Final deployment evidence is recorded separately. PDF verification checks 17 pages, original source hash, readable first/last pages and preserved report code FLOCK-AGO-JEV-001. No physical-device testing is claimed.

## Risks and rollback

Browser PDF support differs; local open/download links provide an alternative. These findings do not establish hiring quality, fairness or a production threshold rollout. Revert the scoped release or promote the previous Vercel deployment to roll back; no data migration is involved.
