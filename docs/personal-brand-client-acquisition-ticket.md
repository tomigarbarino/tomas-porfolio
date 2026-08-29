# Personal brand and client acquisition

## Summary

Reposition the portfolio as the home of Tomás Garbarino's personal brand, with client acquisition as its primary commercial outcome. The site should make his point of view and way of building recognizable while helping a potential client understand what problem he solves, inspect evidence, and start a useful conversation.

## Assumption

The primary audience is a founder, product lead, or operations team with an ambiguous product idea, a manual workflow, or an AI initiative that needs to become a usable and testable product. Job opportunities remain a possible secondary outcome, but they must not compete with the client path in the hero or closing call to action.

## Current state

- `src/App.tsx` presents the landing, Proof Console, selected work, capabilities, experience, and contact flow.
- `src/i18n/content.ts` owns the complete Spanish and English message. The current copy mixes professional positioning, job opportunities, and selected projects.
- `src/App.css` and `src/hooks/usePortfolioMotion.ts` implement the established warm-dark visual system and cinematic motion layer.
- `src/lib/seo.ts`, `public/index.html`, and the prerender scripts own runtime and static discovery metadata.
- Trainly is the strongest public evidence and must remain truthful and visually prominent.
- The supporting-work section still spends attention on three secondary builds after Trainly and Batech. Even with a simpler grid, it competes with the commercial goal and duplicates the three engagement paths shown immediately afterward.

## Scope and files

### Modify

- `src/i18n/content.ts` — define the client-facing promise, three concrete ways to engage, qualified contact copy, and equivalent Spanish and English metadata. Risk: medium because wording affects positioning.
- `src/App.tsx` — route the hero and header to one project inquiry path, preserve Trainly and Batech as proof, replace secondary project cards with sellable solution cards, and remove the duplicated capability block. Risk: medium because it affects the primary journey.
- `src/App.css` — replace project-specific card styling with a direct solution-offer layout without changing the established visual language. Risk: low.
- `src/hooks/usePortfolioMotion.ts` — remove only the horizontal-reel pinning and control logic after the section becomes a static responsive grid. Preserve every other motion sequence. Risk: medium because ScrollTrigger cleanup must remain intact.
- `src/lib/seo.ts` — add truthful service offers to the existing Person structured data and use the branded home social image. Risk: low.
- `public/index.html` — align the initial Spanish metadata and social preview with the prerendered experience. Risk: low.
- `docs/design-system.md` — document the personal-brand and conversion hierarchy. Risk: low.

### Do not modify

- Hero and Trainly motion sequences — the commercial simplification must not change their behavior.
- Batech claims, sources, autoplay policy, and evidence hierarchy — motion may enhance their entrance but must not change or obscure the content.
- Trainly case-study claims, architecture, screenshots, and validation status — they remain the source of public proof.
- Backend, database, authentication, analytics providers, or external lead services — none are needed for this first version.

## Implementation plan

1. Make the first viewport state the audience problem, Tomás's promise, and one clear project CTA.
2. Reframe the existing capability section as three concrete ways a client can start working with Tomás.
3. Qualify the email path with a localized subject and short brief while preserving LinkedIn as an alternate channel.
4. Align SEO, structured data, and the home social card with the same brand promise.
5. Preserve all case-study evidence, professional experience, language behavior, responsiveness, and reduced-motion behavior.
6. Remove the secondary-project section entirely and replace it in the same visual position with three sellable solutions: a testable AI prototype, an operational AI workflow, and an end-to-end web product.
7. Merge the existing capability content into those solution cards so the page has one commercial offer, one technology row, and no repeated “three / one way” rhetoric.
8. Give each solution a concrete fit statement, initial deliverable, and localized inquiry link that identifies the selected solution in the email subject.

## Acceptance criteria

- The first viewport says what Tomás turns into a product, how he works, and what the visitor should do next.
- Client acquisition is the primary path; professional history remains supporting proof.
- The personal brand is recognizable through a consistent promise, point of view, evidence language, and visual system.
- Spanish and English have equivalent meaning and natural voice.
- Every primary project CTA opens the same localized, pre-addressed inquiry path.
- No metric, client result, delivery time, or availability claim is invented.
- Existing routes, internal navigation, language switching, keyboard focus, responsive behavior, and reduced motion continue working.
- No secondary project card remains after Batech; product proof is concentrated in Trainly and professional evidence.
- The commercial section presents three solutions a potential client can understand without interpreting prior experiments.
- Every solution states when it is useful, what the client initially receives, and opens the qualified inquiry path with that solution preselected.
- The separate capability section is removed to avoid repeating the same offer.
- Batech enters with the same motion quality as the preceding portfolio sections: staged content reveal and restrained video parallax, with a static reduced-motion fallback.
- `npm run type-check`, `npm run build`, and `npm run seo:verify` pass.

## Risks and mitigations

- **Positioning becomes too broad:** keep the promise anchored to complex workflows, usable AI products, and verifiable evidence.
- **The site feels like an agency landing page:** retain first-person voice, experiments, career history, and explicit building principles.
- **Commercial copy weakens proof:** keep Trainly and Batech evidence unchanged and place the offer immediately after those proofs, not instead of them.
- **Removing project visuals makes the page feel flatter:** retain the existing full-bleed surface, typographic scale, icon system, card hover states, and surrounding page motion while making the commercial cards more direct.
- **Contact still has friction:** use a short prefilled email brief now; defer forms or scheduling tools until there is a real provider and measurement plan.

## Database and API impact

None.

## Observability

Add stable `data-cta` labels to the main links so a future analytics provider can measure intent without changing the current experience. No tracking is introduced in this ticket.

## Rollback

Revert the single implementation commit. There are no migrations, external resources, or persisted user data.

## Definition of done

The bilingual landing presents one coherent personal brand, keeps Trainly and Batech as its strongest proof, sells three understandable solutions without duplicate sections, leads each one to a qualified contact action, preserves current motion, includes a branded social preview, and passes the existing production validations.
