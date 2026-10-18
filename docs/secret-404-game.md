# Secret 404 / Lost + Found

## Summary

Missing routes now use the portfolio's designed retro 404 instead of Next.js's default error screen. Eight packet windows hide four matching signals; recovering them opens `curiosity.txt`, connecting the detour to the portfolio's theme of small experiments becoming real products.

The footer's `TG_` signature links to `/404` or `/es/404`. The global-not-found boundary selects the language root from a proxy-provided URL language header, so both receive the localized game and a real 404 response. The 404 uses the same `SiteHeader` as the case pages, with Case studies, Story, Contact, English CV download, the shared motion control and a return link to the portfolio top. Its header spans the page independently of the game's content gutters so the compact navigation fits on mobile.

## User experience

- Reveal two whole-tile buttons. Matches remain recovered; different signals stay visible until another sealed packet is selected. There is no timer, life counter or forced reading delay.
- The first selection shuffles a fresh board. Reset/replay shuffle again. Repeated, recovered and invalid selections are ignored.
- All controls work with native Tab, Enter and Space. Arrow/Home/End keys move between packets; 1–8 select them only while a packet has focus. Shortcuts never run on the rest of the page.
- Progress and a polite live message announce outcomes. Sealed controls expose no hidden signal identity. On completion, focus moves to the reward heading; replay returns it to the first packet. A return link is always available.
- The existing local ASCII image, fonts, palette and button style reproduce the Figma desktop/mobile/reward direction. Controls fit 320 px, with whole-tile targets at least 82 px tall. The header control uses the shared motion preference; reduced motion and global pause remove game transitions.

## Technical overview

`src/views/missing.tsx`, used by the global and route-group not-found boundaries, is a synchronous server shell with descriptive metadata, heading, explanation and return navigation. Installed Next.js 16.3.8 resolves the root not-found metadata export; built HTTP tests assert the title instead of assuming it. A trial explicit `/404` page calling `notFound()` omitted the useful server shell in its built response, so it was removed.

`PacketRecoveryLoader.tsx` dynamically imports the client game with SSR disabled. The normal portfolio does not download the game chunk, and its footer entry disables prefetch. The server 404 remains useful without JavaScript, including the shared navigation and CV download; the optional game shows a loading message and a noscript explanation. There is no video on this view.

`PacketRecoveryGame.tsx` renders semantic native controls, announcements, focus management and scoped shortcuts. `src/lib/packet-memory.ts` contains pure immutable transitions and a Fisher–Yates shuffle. The initial deck is null so server/client markup matches; randomness occurs only inside user event handlers. State stays in memory, with no persistence, backend, tracking or new dependency.

Scoped layout styles live in `secret-404.css`; game styles load with `packet-recovery-game.css`. Figma references: file `k4ubXD3U5cr9W9GbsvU44Q`, nodes `312:7`, `312:9`, `312:8`.

## Validation

Use Node.js 24 (declared by the repository):

```sh
node --test scripts/packet-memory.test.mjs
npm run lint
npm run typecheck
npm run build
python scripts/verify-secret-404.py --base-url http://127.0.0.1:3003
python scripts/verify-search-discovery.py --base-url http://127.0.0.1:3003
```

- Nine engine tests passed, including exhaustive reachable-state invariants, immutability, mismatches, reset, completion, no-op guards and 100 seeded shuffle multisets.
- TypeScript, lint and the final production build passed. The HTTP validator passed 18/18 checks across `/404`, a top-level missing route and a nested missing route: HTTP 404, noindex, one descriptive title, useful server shell/return link and no video.
- Existing portfolio discovery checks passed 34/34. Browser resource inspection confirmed no game chunk on untouched home.
- Browser keyboard play completed the game using only revealed clues; the reward, replay focus, outside-board shortcut guard and arrow navigation passed. Pause persisted across reload; reduced motion disabled the toggle and set transitions to zero.
- Final axe-core 4.14.0 scans reported zero violations on the initial board at desktop and 320 px; the reward scan also reported zero. Contrast-over-image incomplete checks remain manual review items. Visual checks at 1440×900, 390×844 and 320×844 confirmed the layout.

Local evidence is in `output/secret-404-implementation-2026-10-15/` in the task workspace, outside the public app. Release verification should run both HTTP scripts against the canonical production alias and smoke-test the playable game after deployment.

The shared-header correction additionally passed lint, TypeScript, production build and 24/24 HTTP checks across the three missing-route shapes, including the common navigation and CV link. Browser checks covered 1440 px, 390 px and 320 px without horizontal overflow or header/game overlap, shared pause/reduced-motion controls and keyboard packet selection. Its evidence is in `output/404-shared-navigation/`.

## Operations and limits

No migrations, environment variables, account connections or external assets are required. Revert this feature to restore the previous 404 and footer signature. Native buttons support touch, but real-device/Safari/Firefox and a full screen-reader reading session were not covered by the in-app browser. Automated results are not full WCAG certification.
