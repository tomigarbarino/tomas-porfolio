# Digital menus and Flock / approved story interactions

Digital menus now moves through three scroll-selected beats: an idea beyond the screen, personally approaching restaurants, and starting conversations. The existing café ASCII video stays behind one movable paper. Its inner pose changes gently while `ArtifactDrag` owns the outer offset; scrolling never resets a manual drag. A 44px corner button reveals a small typographic detail on hover, focus or tap.

The career copy stays factual. An optional native disclosure in its reading card contains a small menu-edit example labeled **Concept / fictional menu**. Changing the dish or availability updates the preview immediately; controls are excluded from dragging. This demonstrates an idea, without inventing historical customer feedback, adoption or results.

Flock retains its logo-only draggable windows and existing career cards. Moving the mouse over a logo, focusing it or activating it reveals the corresponding contribution in the process panel, with an immediate link to the full case. The normal five-stage flow follows Trainly's source-conflict product rule: make conflicts visible, retain source context, expose the conflict in the plan, block approval/generation until resolved, and keep the decision with a person. The captured demo supports the visible rule, not measured customer outcomes.

Both chapter controllers use the shared reading band and continue selecting content when motion is paused or reduced. Decoration and media still respect those preferences and offscreen state. Real scroll clears temporary exploration without blurring controls or resetting offsets. Initial chapter synchronization also clears stale manual stage state; logo previews clear while inactive and require actual pointer movement rather than a new scene appearing beneath a stationary cursor.

No new libraries, media assets, backend, API, persistence or analytics were added. Existing sticky canvas dimensions and native scrolling are retained; short phones keep the prior nonsticky reading layout. Revert the implementation commit to roll back.

## Validation

- ESLint, TypeScript and production build passed.
- Browser checks covered all three menu beats and all five Flock stages, forward and reverse, with motion paused and reduced. Decorative transition durations were zero with reduced motion.
- Whole-paper and whole-logo drags, offset retention, Home reset, native keyboard exploration and subsequent scroll recovery passed. The menu example updates immediately and does not move the career card.
- Desktop, 390px and 320px layouts fit without horizontal overflow. At 320px, contribution notes fit the 116px panel and case links retain 44px targets. A 320×568 viewport uses the existing nonsticky visual layout.
- The in-app browser does not expose native touch dispatch. Touch handling relies on the existing `ArtifactDrag` implementation; real-device gestures and Safari were not verified in this iteration.

Local screenshots and scroll samples: `output/menus-flock-story/`. The approved proposal is `.lazyweb/design-improve/menus-flock-2026-10-15/report.html` in the original task workspace.
