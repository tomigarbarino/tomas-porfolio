const fs = require("fs");
const path = require("path");

const buildDirectory = path.resolve(__dirname, "..", "build");
const routes = [
  { file: "index.html", lang: "es-AR", canonical: "https://tomas-garbarino.vercel.app/", schema: "ProfilePage", phrase: "Procesos complejos." },
  { file: "en/index.html", lang: "en", canonical: "https://tomas-garbarino.vercel.app/en", schema: "ProfilePage", phrase: "Complex workflows." },
  { file: "trainly/index.html", lang: "es-AR", canonical: "https://tomas-garbarino.vercel.app/trainly", schema: "WebPage", phrase: "De documentos dispersos" },
  { file: "en/trainly/index.html", lang: "en", canonical: "https://tomas-garbarino.vercel.app/en/trainly", schema: "WebPage", phrase: "From scattered documents" },
];

const read = (relativePath) => fs.readFileSync(path.join(buildDirectory, relativePath), "utf8");

for (const route of routes) {
  const html = read(route.file);
  const canonical = html.match(/<link rel="canonical" href="([^"]+)"/i)?.[1];
  const language = html.match(/<html lang="([^"]+)"/i)?.[1];
  const structuredDataText = html.match(/<script id="seo-structured-data" type="application\/ld\+json">([\s\S]*?)<\/script>/i)?.[1];
  const structuredData = structuredDataText ? JSON.parse(structuredDataText) : null;
  const visibleText = html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  if (canonical !== route.canonical) throw new Error(`${route.file}: expected canonical ${route.canonical}, received ${canonical}`);
  if (language !== route.lang) throw new Error(`${route.file}: expected lang ${route.lang}, received ${language}`);
  if (structuredData?.["@type"] !== route.schema) throw new Error(`${route.file}: expected ${route.schema} structured data`);
  if (!visibleText.includes(route.phrase)) throw new Error(`${route.file}: prerendered page copy is missing`);
  if (visibleText.length < 1_000) throw new Error(`${route.file}: only ${visibleText.length} visible characters were prerendered`);
  if (!html.includes('hreflang="es-AR"') || !html.includes('hreflang="en"') || !html.includes('hreflang="x-default"')) {
    throw new Error(`${route.file}: language alternates are incomplete`);
  }

  console.log(`${route.file}: ${visibleText.length} visible chars, ${route.schema}, ${route.canonical}`);
}

const robots = read("robots.txt");
if (!robots.includes("User-agent: OAI-SearchBot") || !robots.includes("Sitemap: https://tomas-garbarino.vercel.app/sitemap.xml")) {
  throw new Error("robots.txt is missing OAI-SearchBot access or the sitemap reference");
}

const sitemap = read("sitemap.xml");
for (const route of routes) {
  if (!sitemap.includes(`<loc>${route.canonical}</loc>`)) throw new Error(`sitemap.xml is missing ${route.canonical}`);
}

console.log("SEO build verification passed.");
