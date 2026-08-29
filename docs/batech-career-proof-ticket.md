# Batech career proof

## Summary

Add a bilingual Batech evidence chapter as the second major proof inside selected work, directly after Trainly and before the supporting experiments. It should show Tomás's progression from foundational frontend work to frontend leadership, explain the product context during his tenure, and link to public company evidence without attributing present-day Batech claims or metrics to him.

The chapter may use one short public Batech product clip and its poster to make the product category tangible. The media must be locally cached for stability, visibly attributed to Batech, and presented as company material rather than personal authorship.

## Assumptions

- The existing portfolio statements are the source for Tomás's role and contribution: he joined as the only frontend engineer, built SaaS frontend foundations with React and TypeScript, introduced domain-oriented architecture, shipped product features, and later assumed frontend leadership.
- Public sources are used only to contextualize Batech's product and recognition during 2024, which overlaps Tomás's 2023–2025 tenure.
- Historical percentage claims previously present in the repository remain excluded because no attributable source was found.

## Current state

- `src/App.tsx` renders Trainly as the main selected-work case, supporting experiments after it, and professional history later as compact rows.
- `src/i18n/content.ts` contains only one short Batech paragraph in Spanish and English.
- `src/App.css` defines the established warm-dark evidence language and responsive breakpoints.
- The portfolio already distinguishes personal evidence from company or project evidence in the Trainly case study.

## Files to modify

- `src/i18n/content.ts` — add bilingual Batech contribution, company context, source labels, and transparency note. Risk: medium because claims must remain attributable.
- `src/App.tsx` — render one structured Batech proof chapter after Trainly and before the supporting project reel. Risk: low.
- `src/App.css` — extend the existing evidence visual language and responsive behavior. Risk: low.
- `public/batech/batech-product-21s.jpg` and `public/batech/batech-product-21s.mp4` — locally cache the selected public company media with a clear source boundary. Risk: medium because the assets remain Batech-owned.
- `docs/design-system.md` and `docs/README.md` — document the source boundary and index this ticket. Risk: low.

## Out of scope

- A standalone Batech route or case study.
- Batech's current client logos, current agent architecture, or post-2025 product claims.
- Quantitative retention, conversion, productivity, or customer-impact claims attributed to Tomás.
- Client logos, private product screenshots, source code, private data, or internal material.
- More than one video or multiple decorative media blocks that would turn the portfolio into a mirror of Batech's website.

## Implementation

1. Move Batech from a late resume appendix to the selected-work sequence: Trainly → Batech → supporting experiments.
2. Add a narrative block titled around the transition from foundational frontend work to leadership.
3. Separate `MY CONTRIBUTION` from `PUBLIC COMPANY CONTEXT` visually and semantically.
4. Show the public 21-second company product clip as a silent autoplay loop without the native video HUD, using `muted`, `loop`, `playsInline`, and conservative preloading.
5. Attribute the clip and poster to Batech next to the media; do not imply that Tomás produced the audiovisual material.
6. Link to Batech, Forbes México, Bloomberg Línea, and ENTER.CO as external context.
7. Add a plain-language note explaining that company sources contextualize the product and do not attribute current metrics to Tomás.
8. Preserve the existing hero density, Trainly proof, navigation, and motion system.

## Acceptance criteria

- The block makes Tomás's role, product context, and progression understandable without invented metrics.
- Batech reads as the second major proof after Trainly, not as a resume footnote.
- The selected video and poster render from local project assets, remain usable if the external site changes, and include visible attribution.
- The video autoplays silently, loops, shows no native controls, and remains inline on mobile.
- The two desktop columns occupy the same card height without an empty lower region; the contribution list expands into three readable rows.
- Content-bearing text inside the proof card uses a practical minimum of 9 px for labels and links, with body and contribution copy at 12 px or larger.
- Spanish and English convey equivalent meaning.
- Every external source opens safely in a new tab.
- Company facts and personal contributions are presented in separate labeled areas.
- Desktop and responsive layouts reuse the current design system.
- TypeScript, production build, SEO verification, and diff checks pass.

## Database and API impact

None.

## Risks and rollback

- **Attribution ambiguity:** mitigate with explicit labels and a transparency note.
- **Excessive landing length:** keep the block compact, use one media module, and avoid a standalone route.
- **Asset ownership ambiguity:** label the media as public Batech material and keep it separate from the personal-contribution copy.
- **Media weight:** keep the selected clip below 1 MB, use a lightweight poster, and preload metadata only.
- **Autoplay blocking:** keep `muted` and `playsInline` set so modern browsers can start the loop without sound or fullscreen takeover.
- **External link drift:** keep copy meaningful without requiring the links to render the experience.
- Rollback removes the proof block and the two files under `public/batech`; there are no migrations or external services.

## Definition of done

The portfolio presents Batech as the second credible proof chapter after Trainly, includes one clearly attributed public product clip, supports company context with public sources, states Tomás's contribution without unsupported quantitative claims, and passes the existing validation suite.
