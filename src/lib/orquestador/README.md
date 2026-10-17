# Recorded replay provenance

`caso-guiado.mjs` is a byte-for-byte copy of the pure browser/CLI gate from `tomigarbarino/orquestador-entregables` at commit `cc948a4e287f1c31af7cb2988c8eb45d3a830c54`, path `lib/caso-guiado.mjs`. Its Spanish messages and draft are preserved. The adjacent declaration supplies types without changing behavior.

`src/content/orquestador-sources.json` preserves the original source bytes. `orquestador-selection.json` contains the parsed original `raw.response` from `ejemplo/caso-publico/corrida.json`. The existing `orquestador-run.json` stores measurements and the original source SHA-256. Regression tests verify the source hash and fail-closed behavior. No model runs in the portfolio. If the upstream contract changes, update the module, declarations, fixtures and tests together; do not silently represent a new run as this capture.
