# Tomás Garbarino — Observatory

Personal portfolio built with Next.js and React. The experience connects a cinematic ASCII environment, a five-step career story and selected work at Agora, Trainly and Batech. Agora and Trainly have dedicated case pages. Content is in English.

## Run

Node.js 24.x and npm. The Node major is declared in `package.json` for local and Vercel builds. No environment variables, accounts or service credentials are required.

```sh
npm ci
npm run dev
```

For a production preview:

```sh
npm run build
npm start
```

Open http://localhost:3000. The build uses Webpack explicitly. Vercel is configured for Next.js; legacy `/en`, `/es`, `/trainly`, `/es/trainly` and `/trainyl` and `/agora` entry points redirect to the current pages.

## Experience

- A continuous ASCII video scene, original pop collage, pink cursor and layered paper artifacts connect the home and case pages.
- One scroll-led story connects five complete stages: Minecraft, digital menus, Hogarth Worldwide, Batech and Flock I+D. The artwork changes with the reading position; every stage stays in the document without requiring clicks. Agora and Trainly are projects within Flock. Discovery objects preview on hover or keyboard focus and can be pinned on tap.
- Artifacts can be moved from their surface, with keyboard controls on their focusable grips. Native double-click selection and Alt-drag allow copying text. Interactive controls retain their own actions; touch keeps vertical scrolling.
- A case index and shared Quick profile dialog provide a short route through roles, contributions and contact.
- The shared header and home contact section offer a direct English CV download. The existing one-page PDF is served from `public/documents/tomas-garbarino-cv-en.pdf`; replace that file to update it without changing the links.
- Agora has its own dossier at `/en/agora`: personal responsibilities, an anonymized decision with a hover/focus before-and-after replay, product flow, candidate-experience Figma designs and the declared stack. The home preserves an interactive preview. Trainly has a separate dossier with artifact links; both cases connect to each other. Batech distinguishes frontend contribution from company footage.
- Global pause persists across pages. Reduced motion, hidden-tab and offscreen handling stop decorative motion and silent autoplay. Native video controls remain hidden.
- Missing URLs, including `/404`, open an untimed packet-recovery mini-game. The footer's `TG_` signature is its secret entry. See [the game documentation](docs/secret-404-game.md) for keyboard, motion and HTTP verification.

## Content boundaries

Agora capabilities and the matching decision are owner-reported. The decision distinguishes personal contribution from team validation; this portfolio does not independently verify production outcomes or claim overall model accuracy. Candidate designs contain empty preparation states, without real candidate records.

Agora and Trainly are used by clients and growing, as confirmed by the owner. Public demo values and concept images do not establish learning outcomes. Batech footage is company context. Minecraft and café loops are thematic references rather than personal artifacts or client evidence.

## Verification and documentation

```sh
npm run lint
npm run typecheck
npm run build
```

Native interaction QA uses Python, Playwright and an existing Chromium executable, against an already-running local server:

```sh
python scripts/verify-arena-refinement.py --base-url http://localhost:3000
python scripts/verify-portfolio-routes.py --base-url http://localhost:3000
python scripts/verify-agora-story.py --app-root . --build-id YOUR_BUILD_ID
```

The interaction script reuses an installed Chromium; `--browser-path` selects a specific executable. Reports and screenshots are written under the ignored `output/` directory. Real mobile OS selection handles need device verification beyond touch emulation.

See [Agora case and career story](docs/agora-case-and-story.md), [implementation and validation](docs/observatory-portfolio.md), [asset provenance](docs/observatory-assets.md), and the [documentation index](docs/README.md).
