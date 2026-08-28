const fs = require("fs");
const path = require("path");
const ts = require("typescript");

const projectRoot = path.resolve(__dirname, "..");
const buildDirectory = path.join(projectRoot, "build");
const baseHtmlPath = path.join(buildDirectory, "index.html");

const transpileTypeScript = (module, filename) => {
  const source = fs.readFileSync(filename, "utf8");
  const { outputText } = ts.transpileModule(source, {
    compilerOptions: {
      allowJs: true,
      esModuleInterop: true,
      jsx: ts.JsxEmit.ReactJSX,
      module: ts.ModuleKind.CommonJS,
      moduleResolution: ts.ModuleResolutionKind.NodeJs,
      target: ts.ScriptTarget.ES2020,
    },
    fileName: filename,
  });
  module._compile(outputText, filename);
};

require.extensions[".ts"] = transpileTypeScript;
require.extensions[".tsx"] = transpileTypeScript;
require.extensions[".css"] = () => undefined;

const React = require("react");
const { renderToString } = require("react-dom/server");
const { StaticRouter } = require("react-router-dom/server");
const App = require(path.join(projectRoot, "src", "App.tsx")).default;
const TrainlyCaseStudy = require(path.join(projectRoot, "src", "pages", "TrainlyCaseStudy.tsx")).default;
const { LanguageProvider } = require(path.join(projectRoot, "src", "contexts", "LanguageContext.tsx"));
const { SITE_URL, getPagePath, getSeoMetadata, getStructuredData } = require(path.join(projectRoot, "src", "lib", "seo.ts"));

const routes = [
  { language: "es", page: "home", pathname: "/", output: "index.html", component: App },
  { language: "en", page: "home", pathname: "/en", output: "en/index.html", component: App },
  { language: "es", page: "trainly", pathname: "/trainly", output: "trainly/index.html", component: TrainlyCaseStudy },
  { language: "en", page: "trainly", pathname: "/en/trainly", output: "en/trainly/index.html", component: TrainlyCaseStudy },
];

const escapeHtml = (value) => String(value)
  .replaceAll("&", "&amp;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;")
  .replaceAll('"', "&quot;");

const renderSeoBlock = (metadata) => {
  const alternateSpanish = `${SITE_URL}${getPagePath(metadata.page, "es")}`;
  const alternateEnglish = `${SITE_URL}${getPagePath(metadata.page, "en")}`;
  const structuredData = JSON.stringify(getStructuredData(metadata)).replaceAll("<", "\\u003c");
  const imageTags = metadata.image
    ? `\n    <meta property="og:image" content="${escapeHtml(metadata.image)}" />\n    <meta name="twitter:image" content="${escapeHtml(metadata.image)}" />`
    : "";

  return `<meta name="seo-template-start" content="true" />
    <title>${escapeHtml(metadata.title)}</title>
    <meta name="description" content="${escapeHtml(metadata.description)}" />
    <meta name="author" content="Tomás Garbarino" />
    <meta name="robots" content="index, follow, max-image-preview:large" />
    <meta name="language" content="${metadata.language === "es" ? "Spanish (Argentina)" : "English"}" />
    <link rel="canonical" href="${escapeHtml(metadata.canonical)}" />
    <link rel="alternate" hreflang="es-AR" href="${escapeHtml(alternateSpanish)}" />
    <link rel="alternate" hreflang="en" href="${escapeHtml(alternateEnglish)}" />
    <link rel="alternate" hreflang="x-default" href="${escapeHtml(alternateSpanish)}" />
    <meta property="og:type" content="${metadata.type}" />
    <meta property="og:url" content="${escapeHtml(metadata.canonical)}" />
    <meta property="og:title" content="${escapeHtml(metadata.title)}" />
    <meta property="og:description" content="${escapeHtml(metadata.description)}" />
    <meta property="og:locale" content="${metadata.locale}" />
    <meta name="twitter:card" content="${metadata.image ? "summary_large_image" : "summary"}" />
    <meta name="twitter:title" content="${escapeHtml(metadata.title)}" />
    <meta name="twitter:description" content="${escapeHtml(metadata.description)}" />${imageTags}
    <script id="seo-structured-data" type="application/ld+json">${structuredData}</script>
    <meta name="seo-template-end" content="true" />`;
};

if (!fs.existsSync(baseHtmlPath)) {
  throw new Error("build/index.html is missing. Run react-scripts build before prerendering.");
}

const baseHtml = fs.readFileSync(baseHtmlPath, "utf8");
if (!baseHtml.includes('name="seo-template-start"') || !baseHtml.includes('name="seo-template-end"') || !baseHtml.includes('<div id="root"></div>')) {
  throw new Error("The production HTML template is missing the SEO markers or empty React root.");
}

for (const route of routes) {
  const metadata = getSeoMetadata(route.page, route.language);
  const application = React.createElement(
    React.StrictMode,
    null,
    React.createElement(
      LanguageProvider,
      { initialLanguage: route.language },
      React.createElement(
        StaticRouter,
        { location: route.pathname },
        React.createElement(route.component),
      ),
    ),
  );
  const renderedApp = renderToString(application);
  const htmlLanguage = route.language === "es" ? "es-AR" : "en";
  const outputHtml = baseHtml
    .replace(/<html lang="[^"]+">/, `<html lang="${htmlLanguage}">`)
    .replace(/<meta name="seo-template-start"[^>]*>[\s\S]*?<meta name="seo-template-end"[^>]*>/, renderSeoBlock(metadata))
    .replace('<div id="root"></div>', `<div id="root">${renderedApp}</div>`);

  const outputPath = path.join(buildDirectory, route.output);
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, outputHtml);
  console.log(`Prerendered ${route.pathname} -> ${route.output}`);
}

const sitemapPath = path.join(buildDirectory, "sitemap.xml");
if (fs.existsSync(sitemapPath)) {
  const currentDate = new Date().toISOString().slice(0, 10);
  const sitemap = fs.readFileSync(sitemapPath, "utf8").replace(/<lastmod>[^<]+<\/lastmod>/g, `<lastmod>${currentDate}</lastmod>`);
  fs.writeFileSync(sitemapPath, sitemap);
}
