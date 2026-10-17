# Writing & Research

## Summary

Work and Writing & Research are independent destinations. The homepage now reads introduction → career story → original work → professional cases → brief writing preview → contact. The Work anchor includes Orquestador first. Agora and Trainly remain professional projects at Flock I+D.

## User experience

`/writing` is a card catalogue. Open the JEV card to find the complete study, reading notes and local PDF download. `/writing/jev` renders the complete Spanish study directly as native HTML: 16 sections, 23 subsections, 7 figures, 8 semantic tables, 25 references and all four appendices. The original 17-page report remains available as a PDF download. The owner explicitly clarified that an embedded PDF does not satisfy reading the investigation on the page. The full scientific text is selectable, searchable and available without a PDF viewer; English reading notes remain a distinct section below.

The source PDF is preserved byte-for-byte, including all methods, results, figures, references and appendices. This is the existing report authored by Tomás Garbarino, not a newly generated or translated report. The owner clarified that the portal should be its primary home without external publication links or publisher promotion. The pages emphasize personal authorship and retain the October 4, 2026 date. The document itself remains intact; its source metadata is retained for file provenance. The reading notes distinguish retrospective agreement from hiring outcomes and deployed policy. No private candidate records are included.

## Page signatures

- Home preserves the explorable desktop and five-stage career story.
- Agora preserves the evidence dossier and before/after guardrail comparison; research is now a related-reading link, with product implementation evidence retained in the case.
- Trainly wraps its five-stage explorer in a learning console with previous/next controls and module indicators.
- Orquestador has a manual four-step evidence sequencer. A deliberate unsupported deployment claim blocks all output; restoration re-enables the original draft.
- Writing uses an expandable catalogue card; JEV uses a full printed-study reading surface, a section index and separate margin annotations.

All controls are available without dragging or autoplay. Native disclosures support keyboard and touch. Card motion follows the existing pause and reduced-motion settings. Existing typography, acid, violet, pink, retro windows, cursor and artifact interactions are retained.

## Technical overview

`SiteHeader.tsx` links to `/writing` independently of `/#work`, sets category-aware `aria-current`, and supplies accurate back links. Home fragment state uses `useSyncExternalStore` with a stable server snapshot. The old `/#writing` and Agora `#research` anchors remain valid. Writing pages are server-rendered; native disclosures need no client JavaScript.

`JevStudy.tsx` renders the complete study from reviewed `src/content/jev-study.json` as a Server Component. The section index is sticky on desktop and a native disclosure on mobile. Numbered citations link to the bibliography. Tables use captions, scoped headers and focusable horizontal scroll regions; only the table scrolls on narrow screens. The seven figures now use portfolio presentation variants: retro laboratory frames, violet headers, acid accents, cream and ink. Plots use a dark surface; the workflow and confusion matrices retain a cream surface for reversed-label contrast. Full captions, alt text, enlargement links and original comparison links remain available. Figure 3 explicitly explains that its original black median bar appears in cream in this visual version. There is no iframe, object, embed or new client bundle for the study.

`scripts/style-jev-figures.mjs` generates self-contained SVGs and `src/content/jev-figure-style.json`. Each SVG embeds the exact original PNG bytes at native width/height, applies a color-only SVG filter and adds a frame outside the original image bounds. No data are retraced, cropped, smoothed or generated; axes, scales, positions and source labels retain their geometry. The original PNGs, reviewed scientific JSON and PDF remain unchanged. A separate manifest records source and variant hashes. This is a presentation treatment, not a new analysis. Run `node scripts/style-jev-figures.mjs` after deliberately reimporting and reviewing source figures.

`writing-seo.ts` supplies distinct canonicals, social metadata and collection/article structured data, including a local PDF encoding and a local reference to the complete report. The sitemap includes both routes. `src/content/jev-report.json` records the original public PDF source, page count, size and SHA-256; `public/documents/jev-agora-research.pdf` is the unchanged report.

`OrquestadorSequencer.tsx` uses the saved public source packet and original model selection. The gate is a byte-for-byte copy of the original demo module, documented under `src/lib/orquestador/README.md`; no inference or external write occurs. Tests verify original source-byte integrity, contract rejection, absence of partial drafts and successful restoration. No API, database, dependency, tracking, authentication or migration was added.

## Operational notes

Start the Next production preview after `npm run build`. The complete original PDF is served from the same site and is downloaded only when a reader chooses it; it is no longer automatically embedded. Presentation figures are local SVGs with lazy image loading and no external resources; original PNGs are available through comparison links. No new model/provider cost occurs.

Offline authoring: `python scripts/import-jev-study.py` reads only the locked original public PDF, extracts prose and figures and combines them with manually reviewed table cells. It requires pdfplumber, pypdf and Pillow in the authoring environment, with no new runtime dependencies. `python scripts/verify-jev-content.py` independently compares 469 source prose/caption lines and every numerical value in all eight table bodies. The source hash prevents accidentally importing a different report without review. PDF running headers, repeated page furniture and the affiliation footnote are not duplicated in the web reading body; the scientific prose, declarations and bibliography are retained.

## Validation

`npm run lint`, `npm test` (13 cases), `npm run typecheck` and `npm run build`. Earlier page-signature checks covered desktop, 800 px tablet, 390 px and 320 px layouts; no page overflow in the tested views. Keyboard catalogue expansion and annotations, independent active navigation, home sequence and original-work entry, Agora guardrail comparison, Trainly progression, Orquestador valid/failure/restore states and inline full-report rendering were checked. The pause-specific card rule was strengthened after QA found a specificity conflict. The native-study update adds browser checks at desktop, 390 px and 320 px: section navigation, citation-to-reference targeting, mobile index expansion, keyboard table scrolling and no document-wide horizontal overflow. `python scripts/verify-jev-web.py --base-url URL --output report.json` checks that all prose, 16 sections, 8 tables with all 329 data cells, 7 original and 7 styled figure assets and 25 bibliography entries are server-rendered; it also verifies PDF integrity and absence of embeds. Final deployment evidence is recorded separately. PDF verification checks 17 pages, original source hash, readable first/last pages and preserved report code FLOCK-AGO-JEV-001. No physical-device testing is claimed.

## Risks and rollback

The web study can be read without browser PDF support. Wide tables retain local horizontal scrolling; figures can be enlarged in a new tab. These findings do not establish hiring quality, fairness or a production threshold rollout. Revert the scoped release or promote the previous Vercel deployment to roll back; no data migration is involved.
