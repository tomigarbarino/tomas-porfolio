# Accessibility and AI search — October 15, 2026

## Summary

Audited the public home, Agora and Trainly pages against WCAG 2.2 A/AA, with separate automated and manual checks. Corrected confirmed interaction, naming, hierarchy and contrast problems while preserving the ASCII background, retro windows and scroll storytelling. Added accurate server-rendered metadata and structured data so crawlers can understand the author and case narratives.

This is a reviewable implementation, not a WCAG certification or a guarantee of indexing or AI citations. The secret 404 is still a Figma design and is outside this runtime release.

## User experience

- Existing move grips now open a compact direction/reset panel. Objects can move by clicks as well as whole-surface dragging and keyboard arrows. Controls are at least 44 px, fit narrow viewports, and work inside the native profile dialog. Escape restores focus.
- Lime window chrome and dialog chrome have dark focus outlines; the window title remains readable on hover.
- Project preview windows stop following when the pointer leaves the source link. A 300 ms bridge allows reaching the main window; it stays open while inspected. The main window opens the case immediately. Decorative cascade windows retain their positions and sequential exit.
- Agora flow nodes and explanations share a hover area. Escape dismisses explanations even while keyboard focus remains outside the figure.
- Accessible names follow visible text in discovery cards, the CV link, Trainly image links and process steps. Agora flow headings no longer skip a level; decision/research groups have explicit semantics. Trainly's mobile stage number retains its readable purple color.
- Trainly explicitly attributes the product work to Flock I+D and states the author's product flow, frontend and AI contribution.

## Technical overview

`MoveControls.tsx` uses native auto popovers beside their triggers in the DOM, including inside modal dialogs. The top layer avoids clipping by artwork containers. It adds scroll/resize placement listeners only while open. A grip becomes a drag after movement intent; a stationary click opens position controls. Existing clamping, reset, selection, touch-scroll guards and nested-link handling remain.

`CaseStudyDirectory.tsx` owns the preview through navigation. Its main preview is a real Next link in a named complementary landmark. Exiting content becomes inert immediately; six windows fade for 200 ms each at delays of 0–1000 ms. Closing does not delay the route change. `AgoraFlow.tsx` preserves a hovered explanation while traversing the figure and implements dismissible hover content.

`src/lib/seo.ts` defines stable canonical Person and WebSite identities, a home ProfilePage, and CreativeWork graphs for the authored case narratives. Product authorship is not attributed solely to the portfolio owner. The Agora graph cites the existing JEV paper. `StructuredData.tsx` renders native JSON-LD on the server and escapes `<`. No client SEO library, new runtime dependency, database, API, authentication or tracking was added.

The existing robots policy already permits search crawlers, including OAI-SearchBot. It was preserved; search crawling and model-training preferences are distinct. No `llms.txt`, hidden keywords, invented dates, ratings, clients or results were added. Google documents that its AI search features do not require special AI files or schema; the work here strengthens ordinary crawlability, textual evidence, identity and accurate metadata.

## Validation

Base: `origin/main` at `bb21d7c`. All tests below use current-run evidence. Final local production build uses Next.js 16.3.8.

| Step | Surface | General health after fixes |
| --- | --- | --- |
| 1 | Home, career story, profile and case directory | Zero automated violations at 1440×1000 and 320×844. Keyboard skip link reaches the case directory; next Tab starts there. Profile opens by keyboard, page controls remain outside modal traversal, and Escape restores the trigger. Movement, hover and motion checks passed. |
| 2 | Agora case | Zero automated violations at both sizes. Heading hierarchy and named groups corrected. Hover-to-detail traversal and Escape with focus outside the figure passed. Real role, scope and JEV evidence remain in initial HTML. |
| 3 | Trainly case | Zero automated violations at both sizes after correcting image-link names and mobile stage-number contrast. Flock attribution and personal scope are explicit. |

- axe-core 4.14.0 from the official npm package; tags: `wcag2a`, `wcag2aa`, `wcag21a`, `wcag21aa`, `wcag22aa`, `best-practice`. No rules disabled. The scan library is a temporary browser audit tool and is not in the site bundle.
- `npm run lint`, `npm run typecheck`, production `npm run build`, and `git diff --check` passed. Later targeted lint and production builds covered subsequent fixes.
- `python scripts/verify-search-discovery.py --base-url http://127.0.0.1:3002`: 34/34 HTTP checks passed, including schema graphs, canonical/social metadata, initial textual evidence, images, crawl files and true HTTP 404.
- All three pages have no horizontal page overflow at 320 CSS px. Reduced motion pauses the background videos; the global pause independently paused all four home videos, then its original setting was restored. Forced-colors focus treatment was inspected.
- Click movement changes the window by 40 px, Reset restores its authored position, and Escape returns focus. Whole-window drag remains functional. A move popover inside a modal remains interactive and closes separately from its parent.
- Hover inspection persists; preview navigation was observed while the exit animation was still active. This is a local cached observation, not a navigation-speed SLA.

Local screenshots and JSON reports are in the task's `output/accessibility-ai-search-2026-10-15/` evidence folder. They are not served by the portfolio.

## Limits and follow-ups

Automated results still include incomplete checks. Contrast over imagery cannot be proved for every moving frame by axe. Native hidden popovers generate ID-reference review items; their targets exist and their open/close/focus behavior was checked. Icon-only close/minimize names were manually inspected. Do not convert incomplete checks into passes.

Remaining manual coverage: a complete NVDA/VoiceOver reading session, real touch hardware and Safari/Firefox, actual browser zoom/text resizing, every video frame's contrast and flash characteristics, and PDF tagging/reading order for the downloaded CV. The in-app browser does not support raw touch-event dispatch, so the narrow-layout movement test used pointer clicks with coarse-pointer emulation. These gaps prevent a full conformance claim.

Native popovers require a browser that supports the Popover API. The optional 404 game should keep keyboard shortcuts scoped to its focused board, avoid timers, provide explicit return/replay controls and implement reduced motion before release.

Indexing and AI recommendations remain external outcomes. Search Console coverage and real referrals should be checked after deployment when authorized; no new account connection or analytics was activated.

## Operations and rollback

Run the HTTP validator against a local production server or an authorized preview. It needs only Python's standard library. Roll back by reverting this change; there is no migration or persistent-data change. Review and deployment remain separate.

Primary references: [WCAG 2.2](https://www.w3.org/TR/WCAG22/), [Google AI features](https://developers.google.com/search/docs/appearance/ai-features), [OpenAI crawlers](https://developers.openai.com/api/docs/bots), and the installed Next.js metadata/JSON-LD/accessibility guides.
