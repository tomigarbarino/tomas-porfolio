# Case navigation responsiveness

The user reported a multi-second delay after selecting Agora or Trainly and requested faster navigation. Inspection found explicit `prefetch={false}` on the directory, hero, case summaries and related/return links. The career product cards also used native anchors for cross-page navigation. Both case routes are static and have no blocking application API request.

## Scoped change

Enable full Next Link prefetch for the two case routes and dossier return links. Convert the Flock product links and the case header's links back to home to Next Link; keep native same-page chapter/hash navigation on home and its established scroll behavior. A small shared `/en/loading.tsx` supplies a readable, motion-aware status when a destination is not yet ready. Full `prefetch={true}` prepares the whole static case despite the loading boundary. No route-content, pointer-preview, dependency, database or API change.

## Acceptance and validation

Check case RSC requests occur before the click in production, navigation uses the prepared route without a new document reload, both dossiers render, keyboard/return links work, and directory previews remain usable. Compare the existing optimized baseline with the new optimized build. Native browser event records distinguish a route fetch from later images/video. The initial baseline had no case request before the click and requested Agora RSC after the click.

Next automatic Link prefetch runs in production; the first development click may still compile a route. Verify performance with `next start`, and do not describe dev compile time or browser-tool round-trip time as a production click benchmark. Sources: [Next prefetching](https://nextjs.org/docs/app/guides/prefetching) and the installed Next 16.2.9 Link implementation. Revert this scoped change for rollback; no data rollback is necessary.

## Verified result

Full lint and TypeScript passed. The final scoped lint and production build `n4dJtKtirPJvuo1gMptGZ` passed with Node 24.19.0. All 12 route/metadata checks passed against that build. The loading message uses paragraph/status semantics so streamed fallback markup does not introduce a second H1 alongside the case.

Native browser network records on the final build confirmed both case RSC payloads and JavaScript chunks completed before clicking. Neither case click requested its route again or reloaded the document; the case header also returned to home without a document reload. Agora's visible header may separately prefetch the home return route. The Flock link's client navigation was also checked in development. Keyboard entry, the existing directory preview and captured runtime logs were checked. Local evidence: `output/case-navigation-2026-10-12/`; intermediate build results and the initially failing fallback-heading check are kept separately from final checks. No precise click-latency, throttled-network or physical-device benchmark was run. The optimized local preview runs on port 3001; development stays on 3000. No production promotion is included.
