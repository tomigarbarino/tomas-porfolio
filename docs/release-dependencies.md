# Dependency correction before the first Observatory release

The Vercel build exposed production dependency advisories while preparing PR #1 for `main`. The production audit initially reported six affected packages, including critical Next.js advisories.

Next.js and eslint-config-next are pinned together at `16.3.8`; the existing PostCSS override is updated to `8.5.23`. The lockfile also resolves Sharp `0.35.5`, nanoid `3.3.20`, source-map-js `1.2.2` and baseline-browser-mapping `2.11.28`. This stays within the existing major versions and changes no application code, UI, data contract or environment configuration.

`npm audit --omit=dev` reports zero findings after the update. Full audit still reports five high findings in the development-only ESLint → fast-glob → micromatch → braces chain. The [braces advisory](https://github.com/advisories/GHSA-vfj7-8cjw-p6xm) lists no patched release. The portfolio does not accept visitor-supplied lint patterns, and this chain is absent from its production dependency audit. Review the lint-tool chain separately; do not apply the forced downgrade to eslint-config-next 14 suggested by audit.

Release gates are full lint, TypeScript, production build, hosted routes and metadata, real optimized-image responses, and browser navigation/preview checks on the exact new Git commit. A Ready deployment alone does not establish that these application checks passed.

Rollback is a scoped dependency revert before merging, or restoring the recorded previous Vercel production deployment if post-release verification fails. No database migration is involved.
