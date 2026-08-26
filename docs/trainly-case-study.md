# Trainly portfolio case study

## Summary

Trainly now has a first-party case study at `/trainly`. The portfolio no longer sends visitors to the external Flocklabs article to understand the product, and the Trainly showcase no longer fetches imagery from raw GitHub URLs.

The page presents the product as an evidence-based case study: the problem, hypothesis, multi-agent learning loop, conversational validation, manager experience, architecture, learnings, and next areas of validation. It deliberately avoids unverified outcome metrics.

## UX

- A product-branded hero introduces the core premise: completion is not competence.
- A sticky desktop table of contents supports a long-form reading experience.
- The narrative moves through six chapters: challenge, product loop, experience, validation, system, and learnings.
- Large product images make the implemented experience visible throughout the story.
- The final evidence note separates implemented/demo-ready work from outcomes that still require quantitative validation.
- `/trainyl` redirects to the canonical `/trainly` path to tolerate the original misspelling.

## Technical overview

- React Router exposes `/trainly` as an independent page and preserves the existing portfolio at `/`.
- `vercel.json` rewrites direct route requests to the React entry point.
- All case-study images live under `public/trainly/` and are served from the portfolio origin.
- The original landing-page Trainly card now links internally to `/trainly`.
- Existing hidden raw GitHub image references were removed from the Trainly showcase markup.

## Flow

```text
Portfolio Trainly card
        ↓
      /trainly
        ↓
Challenge → Product loop → Learning experience
        ↓
Conversational validation → Manager system → Learnings / next
```

## Operational notes

- Canonical route: `/trainly`
- Compatibility alias: `/trainyl`
- Main source images: `public/trainly/case-study/`
- Page component: `src/pages/TrainlyCaseStudy.tsx`
- Page styles: `src/trainly-case-study.css`

## Validation

- TypeScript: `npm run type-check`
- Production bundle: `npm run build`
- Test suite: `npm test -- --watchAll=false --runInBand --passWithNoTests`
- Browser QA covers direct route loading, navigation from the landing page, desktop/mobile layouts, console errors, horizontal overflow, broken images, and same-origin image sources.

## Risks and follow-ups

- Quantitative learning outcomes must only be added after they are measured and attributable.
- The source PNGs are intentionally high-resolution; a later performance pass can produce AVIF/WebP variants without changing the page structure.
- The current architecture description reflects the public product case and should be updated if the production stack changes materially.
