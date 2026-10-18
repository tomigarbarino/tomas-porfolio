# Portfolio in English and Spanish

User authorization: add a switch across the whole portfolio (2026-10-17).

## Scope and acceptance

- Real English and Spanish pages for home, all three cases, writing, the complete JEV study and its seven figure viewers, and the optional 404 game.
- Preserve the current English URLs. Spanish lives under `/es`; switching retains the equivalent route and section anchor.
- Translate page content, navigation, accessible labels, metadata, research tables and vector labels. Preserve original product screenshots, source records, quotations and the Spanish PDF, with their language identified.
- Render translated content in HTML before JavaScript. Set the document language and reciprocal canonical/hreflang links. Preserve all scientific values, references, figure geometry, original assets and the evidence gate.
- Reuse the existing typography, motion and page-specific art direction. Test mobile navigation, keyboard access, switching, zoom and the deliverable failure/restore flow.

## Implementation

Keep one authoritative component/interaction source. A deterministic TypeScript AST localization step compiles Spanish presentation modules from a reviewed text catalog; generated modules are ignored, never hand-edited, and rebuilt before validation/build. Root route groups supply the correct document language and matching provider instances. English JEV uses a full translated study, with the immutable Spanish study retained for Spanish pages. SVG localization changes native text only.

## Risks and rollback

Missing translations and accidental changes to identifiers or evidence are the primary risks. Catalog coverage, numeric parity, asset hashes, unchanged gate tests, static HTTP checks and browser checks guard these boundaries. No database or new external service. Revert the feature commit to restore the previous routes and content.
