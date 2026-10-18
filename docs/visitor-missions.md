# Portfolio exploration missions

## Experience

Side Quests are a small treasure hunt through the portfolio. Visitors explore existing objects, hidden notes, demos and research. The board offers five optional missions and clues that stay collapsed until requested. There are no quiz questions or answer choices.

| Mission | Discovery that counts |
| --- | --- |
| Something under the paper | Press the digital menu corner to pin its hidden note open. |
| A note behind the sticker | Press a developer sticker to pin its note open. |
| Break it. Bring it back. | Trigger Orquestador's unsupported-claim block, then restore the recorded selection. |
| Beyond the frame | Enlarge a JEV figure using the vector viewer's plus control. |
| Lost + Found | Enter through the footer signature, then recover a matching pair in the hidden packet game. |

Starting or tracking a mission, scrolling, previews on hover/focus, and opening a case do not award completion. Deliberate discoveries count even before a visitor chooses a mission. Ordered missions require their checkpoints in order. A duplicate discovery does not add progress.

Tracking a mission closes the board and takes visitors to the relevant area. A compact collapsible trail stays available across pages, including the hidden 404 game. It shows checkpoints, an optional clue and a route back to the board. Visitors can stop tracking without losing discoveries, or reset all exploration progress. Extra bottom space lets visitors scroll final controls above the collapsed tracker. The trail can be collapsed while exploring.

## Implementation

- `src/lib/visitor-missions.ts`: definitions, ordered event reducer, completion, saved state validation and session store.
- `VisitorMissions.tsx` and `portfolio-dialogs.css`: discovery board, optional clues, checkpoints and native close-then-navigate behavior.
- `MissionTrail.tsx` and `mission-trail.css`: global tracker mounted by `src/views/root.tsx`; same-page board events and cross-page `/#missions` entry.
- Existing interaction handlers in `DigitalMenusStory`, `PeelSticker`, `OrquestadorSequencer`, `JevFigureViewer` and `PacketRecoveryGame` record the discoveries. `SecretArcadeLink` records the deliberate footer entrance.
- Figure links keep the exploration in the same tab, and changing the tracked mission collapses its trail. The existing build generates the Spanish presentation and English research viewer; event IDs and checkpoint rules remain identical across locales.

There is no database, API, account, analytics or new dependency. The evidence gate, packet game engine, scientific data and original document remain unchanged.

## Persistence and compatibility

`tg-visitor-missions-v2` stores version 2, a small array of discovery IDs and an optional active mission. The previous quiz key is ignored: quiz completions cannot count as exploration. Progress and the tracked mission survive reload and same-tab route/language changes. Malformed, unknown, duplicate and out-of-order events are filtered. When session storage is unavailable, progress works in memory until the current page is left.

If challenge semantics change, version the key again. Restoring a demo or recovering a packet without its prerequisite discovery does not complete a mission; visitors can perform the action again after finding the prerequisite.

## Validation and operations

`tests/visitor-missions.test.mjs` covers all checkpoint flows, independent exploration, invalid/out-of-order events, old/corrupt saved data, locale rule parity, tracking without completion, deduplication, reset, notifications and blocked storage. The existing packet-engine and evidence-gate tests cover their original behavior.

Release checks: `npm test`, `node --test scripts/packet-memory.test.mjs`, `npm run lint`, `npm run build` and `npm run typecheck`. Browser QA exercises discoveries through the actual controls, tracker and clues, reload and language persistence, 404 entry, keyboard controls and narrow layouts. Route/404 verifiers check the unchanged route contracts.

Verified on 2026-10-18: all 24 portfolio tests and 9 packet-engine tests passed, along with lint, production build and typecheck. Local route checks passed 31/31, the native 404 checks passed 45/45, and both full JEV content verifiers passed. Chrome completed all five discoveries through their real controls, including a mobile tap on the menu fold and keyboard activation of a sticker and figure zoom. The trail preserved 5/5 across EN/ES, reload and route changes; stopping tracking retained discoveries, reset cleared them and restored board heading focus. At 320px the board, trail and enlarged figure retained local scrolling without document-wide horizontal overflow.

Rollback: revert the exploration release. The unused v2 session key can safely remain until that tab's session ends.
