# Tomás Garbarino — Product Engineering Portfolio

A portfolio that connects the products I've worked on with the decisions, interfaces, and engineering behind them. Explore my contribution to Agora, Trainly, and Batech, then inspect how this site is built.

**[Explore the portfolio](https://tomas-garbarino.vercel.app/) · [Download my CV](https://tomas-garbarino.vercel.app/documents/tomas-garbarino-cv-en.pdf) · [Get in touch](https://www.linkedin.com/in/tomas-garbarino/)**

## English and Spanish

Use the **EN / ES** switch on any page to keep reading in the other language, including case studies and the full research with translated vector labels. [Leer en español](https://tomas-garbarino.vercel.app/es). The original report and recorded source artifacts keep their original language. See [localization architecture and checks](docs/portfolio-languages.md).

## Writing & Research

**[Writing & Research](https://tomas-garbarino.vercel.app/writing)** is an independent catalogue, alongside Work. The [JEV research page](https://tomas-garbarino.vercel.app/writing/jev) renders the complete study directly as web text, with all 7 figures, 8 tables, 25 references and appendices. The original 17-page PDF remains available to download, alongside separate annotated reading notes. The study covers AI interview evaluation, CV decision thresholds and human review in Agora, authored by Tomás Garbarino. The homepage keeps a brief preview after the work.

## Product engineering profile

The [English profile](https://tomas-garbarino.vercel.app/product-engineering) and [perfil en español](https://tomas-garbarino.vercel.app/es/product-engineering) connect discovery, end-to-end implementation and AI integration to public evidence from Agora, Trainly and the JEV study. The pages identify contribution boundaries and give visitors a direct way to start a project conversation. See [discovery architecture and verification](docs/seo-geo-discoverability.md).

## Start with the work

| Case | Product problem | My contribution |
| --- | --- | --- |
| **[Agora](https://tomas-garbarino.vercel.app/en/agora)** | Bringing recruiting, candidate preparation, interviews, and AI-assisted matching into a usable workflow. | The case describes personal responsibilities, the candidate experience, and an anonymized matching decision, separating my work from team validation. |
| **[Trainly](https://tomas-garbarino.vercel.app/en/trainly)** | Connecting learning, an AI tutor, and competency validation in one product flow. | Product flow, frontend, and AI integration, with an implemented interface and architecture explained in the case. |
| **[Batech](https://tomas-garbarino.vercel.app/)** | Turning AI and computer vision capabilities into a SaaS interface. | Built the frontend foundation and grew into frontend leadership. The career story separates my contribution from company footage. |

Agora and Trainly are projects at **Flock I+D**, where I work as a Product Engineer. The full career story is **Minecraft experiments → digital menus offered to restaurants → Hogarth Worldwide → Batech → Flock I+D**.

[Orquestador de entregables](https://tomas-garbarino.vercel.app/en/orquestador) was built for an AI Day challenge at Flock I+D. Its dedicated case remains available as a challenge project, separate from the product work above.

For a quick overview, open **Quick profile** on the site. For the reasoning behind a product flow, open a case study.

## What this repository demonstrates

This is the source for the portfolio experience. It makes the frontend implementation and documentation available for inspection; the Agora, Trainly, and Batech applications are separate products.

- **Interaction design:** a continuous career story, case navigation, shared draggable artifacts, and hover, focus, and tap previews.
- **Frontend engineering:** Next.js App Router, React, TypeScript, shared components, and explicit motion state across pages.
- **Inclusive motion controls:** a global pause, reduced-motion behavior, keyboard controls, and offscreen/hidden-tab handling. Physical mobile selection behavior still needs device verification.
- **Delivery and verification:** lint, type checks, production builds, documented browser checks, and scripts for routes and interactions.
- **A small product detail:** missing URLs open an untimed packet-recovery game; the footer's `TG_` signature is another entry.

The visual direction combines ASCII video, pop collage, paper artifacts, and a continuous reading path. The case pages and Quick profile provide direct routes to the work and contact details.

## Run locally

Use **Node.js 24.x and npm**, as declared in `package.json`. No environment variables, accounts, or service credentials are required to run this portfolio.

```sh
git clone https://github.com/tomigarbarino/tomas-porfolio.git
cd tomas-porfolio
npm ci
npm run dev
```

Open **http://localhost:3000**. For a production preview:

```sh
npm run build
npm start
```

The project uses Next.js, React, TypeScript, Tailwind CSS, GSAP, and Lenis. The dev and build commands explicitly select Webpack. Vercel is configured for Next.js; legacy portfolio routes redirect to the current pages.

## Verify and explore the implementation

```sh
npm run lint
npm test
npm run typecheck
npm run build
```

Browser QA scripts use Python, Playwright, and an existing Chromium executable against an already-running local server:

```sh
python scripts/verify-arena-refinement.py --base-url http://localhost:3000
python scripts/verify-portfolio-routes.py --base-url http://localhost:3000
python scripts/verify-agora-story.py --app-root . --build-id YOUR_BUILD_ID
```

The interaction script accepts `--browser-path` to select Chromium. New reports and screenshots go under the ignored `output/` directory.

| Where to look | What it explains |
| --- | --- |
| [Documentation index](docs/README.md) | Current architecture, cases, interaction behavior, accessibility work, and historical documentation. |
| [Observatory implementation](docs/observatory-portfolio.md) | Site structure, motion, migration, and validation. |
| [Agora case and career story](docs/agora-case-and-story.md) | Case structure and contribution boundaries. |
| [Trainly case](docs/trainly-case-study.md) | Product flow, case presentation, and verification. |
| [Asset provenance](docs/observatory-assets.md) | Where the media comes from and what each reference establishes. |
| [404 game](docs/secret-404-game.md) | Keyboard controls, motion behavior, and HTTP verification. |

## How to read the evidence

Agora and Trainly are used by clients and growing, based on owner-reported product context. The portfolio does not independently establish adoption rates, revenue, model accuracy, or learning outcomes. The Agora decision distinguishes personal contribution from team validation.

Candidate references contain empty preparation designs rather than real candidate records. Product interfaces, local demos, concept images, and public company footage retain their own context; they are not interchangeable with production results. Minecraft and café footage are thematic references, not client work.

The downloadable English CV is served from `public/documents/tomas-garbarino-cv-en.pdf`.

## Working together

I build **web products, internal tools, and AI-assisted workflows**, with a background in frontend engineering and a focus on making the whole flow usable. I'm interested in Product Engineer and AI Product Engineer roles, and scoped projects where a repetitive manual process can become a working tool.

**[See the work and contact me](https://tomas-garbarino.vercel.app/)**
