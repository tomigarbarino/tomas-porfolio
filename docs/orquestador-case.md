# Orquestador: original project case

The homepage introduces Orquestador before the professional product cases, with a real application capture and direct links to `/en/orquestador` and the guided demo. The existing career story and Flock I+D attribution remain in place. The hero and Quick profile also provide a direct route to the own-project case.

The October 17 follow-up leads with the outcome: “Your next progress update. With the evidence attached.” The hero explains who the project is for and links directly to the embedded working example. An input/output/review strip establishes the contract. The example starts on the deliverable, before the longer engineering narrative; the standalone application capture is available through an optional disclosure. Homepage copy and case share metadata use the same outcome-first positioning.

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

## Delivery desk replay

`OrquestadorSequencer.tsx` opens on a readable Spanish progress draft, with source IDs, original source titles, short commit hashes and evidence links. A cream paper surface inside a violet/acid delivery console follows the existing design system. Source inspection and the selected states have readable cards; original JSON and Markdown are optional disclosures. The four steps and failure control remain accessible above the output. Recorded measurements and the original gate/source bytes are unchanged.

Readers can download the exact validated `borrador` as a local Markdown file. A deliberately unsupported “deployed” claim unmounts the draft and all export links; opening Deliverable while blocked shows no partial output. Restoring the original selection returns directly to the complete draft. A person still reviews relevance and wording. This flow does not send or publish the draft, call a model or connect an account.

The standalone application was intentionally left unchanged in this iteration: the owner delegated scope, and the portfolio needed a clearer output and a shorter path to trying the example. It remains directly linked for the broader demo.

## Validation and rollback

Run lint, TypeScript and the production build. Verify home → original case → guided demo, case metadata/sitemap, existing case routes, keyboard activation, focus, desktop and mobile layouts. Browser coverage and release evidence are recorded in the release closeout; do not infer device testing or measured business outcomes from a successful build.

Rollback is a commit revert or promotion of the preceding Vercel deployment. There are no data migrations.

The delivery-desk update adds desktop/mobile and keyboard checks for every step, original JSON inspection, blocked export removal, restoration, and actual Markdown download. The browser-downloaded file matched the gate's UTF-8 output byte-for-byte: 973 bytes, SHA-256 `39e8ce19a1250d252aabd7292de0656d96855e870d4d8ec48389a7356b961a6c`. A successful saved file was verified directly; the browser automation download event timed out for the data URI, which was not a failed download. Existing replay tests continue to verify gate/source integrity and no partial drafts.
