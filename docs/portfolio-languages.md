# English and Spanish portfolio

## User experience

EN / ES is available in the shared header and the research figure viewer. Switching opens the equivalent page and keeps the current section anchor. English keeps the established URLs; Spanish uses `/es`, `/es/agora`, `/es/trainly`, `/es/orquestador`, `/es/writing` and `/es/writing/jev`. Links within each language stay in that language. Both versions render their full text before JavaScript, including the complete research article.

JEV includes all 16 sections, 23 subheadings, 8 tables, 25 references, four appendices and seven native vector figures in both languages. English translates every scientific paragraph and caption. References retain their published titles. The original Spanish report, original scientific PNGs, product captures and recorded Orquestador source titles/export remain authentic artifacts. Its draft preview labels follow the selected language; original titles identify their own language and the download remains the recorded Spanish Markdown. The UI identifies the original language; it does not relabel the PDF or CV as translated.

## Implementation

`src/views/` is the authoritative page composition. `src/components/` retains the existing interactions and design system. `src/i18n/es.json` maps exact source text to reviewed Spanish; `en.json` contains the complete English research and chart-label translations. `preserved.json` explicitly records names, technical contracts and original text that should stay unchanged.

`npm run i18n:build` uses the TypeScript AST to compile presentation modules into ignored `src/localized/`. The generated output is never edited or committed. Imports resolve to matching locale provider instances; styles and source artifacts are shared. English JEV compiles from the immutable Spanish study. SVG localization changes only native text/title/description contents, preserving geometry, plotted marks and embedded Barlow Condensed / IBM Plex Mono fonts. Table decimals and thousands separators are localized without changing numerical values.

The step runs before dev, lint, tests, typecheck and production build. New display copy without a translation or reviewed preservation fails the build. No translation API, browser text replacement, runtime translation payload, database or new npm dependency is involved.

English and Spanish route groups provide separate root layouts with the correct server-rendered `html.lang`. The root layout, motion preference, preview provider and cursor remain aligned with each locale. Old English URLs are retained; the former `/es` and `/es/trainly` redirects are removed. Next.js’s global-not-found boundary renders the matching localized 404 game with a real 404 response. A request header set by `src/proxy.ts` carries the URL language to that boundary, which bypasses route layouts; the documented `experimental.globalNotFound` flag is enabled for the two root layouts. Ordinary content pages remain static. Metadata provides reciprocal EN/ES/x-default alternates and each page’s canonical; the sitemap contains all 12 indexable pages. Figure viewers remain noindex/follow with their own language equivalents.

## Validation and operations

- `npm test`: 18 tests, including translation coverage, placeholder preservation, route round trips, all scientific blocks and numerical values, immutable source assets, identical vector geometry and the original evidence gate.
- `npm run lint`, `npm run typecheck`, `npm run build`.
- `scripts/verify-portfolio-routes.py`: 12 page metadata responses, redirects, robots, sitemap and 404.
- `scripts/verify-jev-web.py --locale en|es`: every scientific paragraph, all 329 table cells, references, original/vector asset hashes, seven viewers per language and the unchanged PDF.
- Browser checks: section-preserving language links, desktop/mobile layouts, keyboard controls, catalogue, Trainly progression, Orquestador failure/restore and vector zoom/download. No physical-device testing is claimed.

Run the existing npm commands rather than invoking `next build` directly, so localization is compiled first. A fresh checkout requires `npm ci` and `npm run i18n:build` before editor-only type analysis. Revert the feature commit for rollback; no data migration or account change is involved.
