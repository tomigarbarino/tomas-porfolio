# Writing & Research

Authorized scope: add the approved Writing & Research section to the homepage and shared menu, starting with the published JEV paper and retaining the current visual identity.

## Implementation and content

- `lib/publications.ts` holds the public paper URL, original title, publication date and attribution. The existing Agora research component retains its exported URL through that shared source.
- `WritingResearch.tsx` renders a single publication card after the original-project section and before the career story. It uses the existing condensed display font, mono copy, acid accent and printed-paper treatment, with scoped styles.
- The card separates the research question, personal authorship and study takeaway. It links to the full publication and the related Agora case, retaining Flock Labs credit. The study is retrospective; its corpus is not an adoption metric, and hiring outcomes were not measured.
- `SiteHeader.tsx` links to `/#writing` on home and case pages. Responsive labels and header layout keep all existing destinations accessible at narrow widths.

No new route, dependency, tracking, data store, API, account connection or client state is needed. No empty news entries or future publication dates are invented. The original publication remains on its publisher's site.

## Acceptance and verification

Homepage contains a server-rendered section headed Writing & Research. The menu reaches it from home and all case routes. The JEV card shows its original title, October 4, 2026 publication date, authorship, summary and source link. Keyboard focus, visible focus indicators, mobile wrapping and absence of page overflow are checked in the browser. Existing case routes, motion controls, CV and original-project access remain available.

Run lint, TypeScript and production build; check rendered source, publication URL, desktop/mobile navigation, then verify the exact deployed commit and live path. Record final release evidence locally.

October 17, 2026: lint, TypeScript and production build passed. HTTP checks verified the section/date/source in the server-rendered homepage and the shared menu on all three case routes. Browser checks covered keyboard activation/focus on home, navigation from the Agora research case back to the section, the full paper opening on the publisher's site, and layouts at desktop, 800 px, 390 px and 320 px widths without page overflow. The publisher's page confirmed the title, author and October 4 date. No physical-device testing was performed.

Rollback: revert this scoped commit or promote the previous Vercel deployment. No migrations or external publication changes are involved.
