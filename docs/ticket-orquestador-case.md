# Orquestador: original-project case

Owner-approved scope: implement and verify the Orquestador guided flow, then add it as an original project in the portfolio.

Add a visible home section before professional product cases, a dedicated `/en/orquestador` case, and a direct guided-demo link. Preserve the current collage palette, typography, motion controls and career attribution. Describe the personal contribution, bounded AI selection, deterministic checks and measured run evidence. Do not invent clients, time saved or commercial results.

Files: new case/preview components and scoped CSS; `src/app/page.tsx`, `src/components/Observatory.tsx`, `src/components/PortfolioDialogs.tsx`, `src/lib/seo.ts`, sitemap and docs. Use server-rendered narrative and native links; no new dependency or client state is needed for the case.

Acceptance: home → case → guided demo works; case metadata/canonical and public sitemap resolve; keyboard and mobile navigation work; lint, typecheck, production build and the existing related route checks pass. Validate the Orquestador before publishing its measured claims here. No DB/API changes. Rollback: revert the scoped commit and promote the preceding deployment.
