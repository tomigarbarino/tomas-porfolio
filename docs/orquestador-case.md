# Orquestador: original project case

The homepage introduces Orquestador before the professional product cases, with a real application capture and direct links to `/en/orquestador` and the guided demo. The existing career story and Flock I+D attribution remain in place. The hero and Quick profile also provide a direct route to the own-project case.

## Story and evidence

The case explains a recurring reporting problem, a four-step working slice, the engineering trade-offs, one deliberate failure and what a future pilot should measure. It distinguishes three things: a public commit snapshot, an actual recorded local AI run and a deterministic browser replay. It makes no client adoption, revenue or hours-saved claim.

The capture is the actual Orquestador interface. `src/content/orquestador-run.json` copies only measured, public run metadata from `orquestador-entregables/ejemplo/caso-publico/corrida.json`, including its source hash. The recorded wall time is 13,211 ms with 716 input / 85 output tokens. No human review effort or total operating cost was measured. If the recording changes, update this copy and the case together.

## Implementation

- `OriginalWork.tsx`: server-rendered homepage section with native navigation and a real application screenshot.
- `/en/orquestador`: server-rendered case; shared header and motion preference, scoped CSS, direct demo/source/contact links.
- `seo.ts` and `public/sitemap.xml`: canonical, Open Graph, Twitter and structured case metadata.
- Client projects are described as professional work. Orquestador is identified as an original personal project; it is not a hiring challenge.
- Contact paths cover both a scoped workflow project and a product engineering role.

No new dependency, database, form submission, account connection or third-party runtime is introduced. The external demo opens separately; its interface is in Spanish.

## Validation and rollback

Run lint, TypeScript and the production build. Verify home → original case → guided demo, case metadata/sitemap, existing case routes, keyboard activation, focus, desktop and mobile layouts. Browser coverage and release evidence are recorded in the release closeout; do not infer device testing or measured business outcomes from a successful build.

Rollback is a commit revert or promotion of the preceding Vercel deployment. There are no data migrations.
