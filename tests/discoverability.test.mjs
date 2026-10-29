import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const ts = require('typescript');
const root = fileURLToPath(new URL('../', import.meta.url));
const read = file => readFileSync(path.join(root, file), 'utf8');
// Run the actual metadata functions, resolving the project's TypeScript aliases.
const cache = new Map();
function load(file) {
  if (cache.has(file)) return cache.get(file);
  const loadedModule = { exports: {} };
  cache.set(file, loadedModule.exports);
  const js = ts.transpileModule(read(file), { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText;
  const resolve = specifier => {
    const target = specifier.startsWith('@/') ? `src/${specifier.slice(2)}` : path.posix.join(path.posix.dirname(file), specifier);
    return load(`${target}.ts`);
  };
  new Function('require', 'module', 'exports', js)(resolve, loadedModule, loadedModule.exports);
  return loadedModule.exports;
}
const seo = load('src/lib/seo.ts');
const writing = load('src/lib/writing-seo.ts');
const pairs = [
  ['/', '/es'], ['/en/agora', '/es/agora'], ['/en/trainly', '/es/trainly'],
  ['/en/orquestador', '/es/orquestador'], ['/writing', '/es/writing'],
  ['/writing/jev', '/es/writing/jev'], ['/product-engineering', '/es/product-engineering'],
];
const absolute = pathname => `${seo.SITE_URL}${pathname}`;
const entries = [...read('public/sitemap.xml').matchAll(/<url>([\s\S]*?)<\/url>/g)].map(([, body]) => ({
  url: body.match(/<loc>([^<]+)<\/loc>/)?.[1],
  languages: Object.fromEntries([...body.matchAll(/<xhtml:link rel="alternate" hreflang="([^"]+)" href="([^"]+)"\s*\/>/g)].map(([, language, href]) => [language, href])),
}));

test('sitemap has only canonical page pairs, with reciprocal absolute language links', () => {
  assert.equal(entries.length, pairs.length * 2);
  assert.equal(new Set(entries.map(entry => entry.url)).size, entries.length);
  for (const [en, es] of pairs) for (const pathname of [en, es]) {
    const entry = entries.find(item => item.url === absolute(pathname));
    assert.ok(entry, pathname);
    assert.deepEqual(entry.languages, { en: absolute(en), es: absolute(es), 'x-default': absolute(en) });
  }
  assert.match(read('public/sitemap.xml'), /xmlns:xhtml="http:\/\/www.w3.org\/1999\/xhtml"/);
});

test('page metadata agrees with canonical sitemap entries and equivalent languages', () => {
  const metadata = [seo.caseStudyMetadata('agora'), seo.caseStudyMetadata('trainly'), seo.caseStudyMetadata('orquestador'), writing.writingMetadata(false), writing.writingMetadata(true)];
  for (const [en, es] of pairs.slice(-1)) for (const [pathname, language] of [[en, 'en'], [es, 'es']]) {
    const item = seo.contentPageMetadata({ path: pathname, title: 'Profile', description: 'Profile', language });
    assert.equal(item.openGraph.locale, language === 'es' ? 'es_AR' : 'en_US');
    metadata.push(item);
  }
  for (const item of metadata) {
    const canonical = item.alternates.canonical;
    const entry = entries.find(item => item.url === canonical);
    assert.ok(entry, canonical);
    assert.equal(item.openGraph.url, canonical);
    assert.deepEqual(Object.fromEntries(Object.entries(item.alternates.languages).map(([lang, pathname]) => [lang, absolute(pathname)])), entry.languages);
  }
});

test('professional entity and case narrative authorship stay distinct', () => {
  const graph = seo.profileStructuredData['@graph'];
  const person = graph.find(item => item['@type'] === 'Person');
  const profile = graph.find(item => item['@type'] === 'ProfilePage');
  assert.equal(profile['@id'], `${profile.url}#profile`);
  assert.equal(profile.mainEntity['@id'], person['@id']);
  assert.deepEqual(graph.find(item => item['@type'] === 'WebSite').inLanguage, ['en', 'es']);
  for (const key of ['agora', 'trainly', 'orquestador']) {
    const narrative = seo.caseStudyStructuredData(key)['@graph'].find(item => item['@type'] === 'CreativeWork');
    assert.equal(narrative.author['@id'], person['@id']);
    assert.ok(entries.some(entry => entry.url === narrative.url));
    assert.equal(narrative.mainEntityOfPage, narrative.url);
    assert.ok(!('aggregateRating' in narrative));
  }
  assert.match(seo.caseStudyMetadata('orquestador').title, /AI Day.*Flock/);
  assert.doesNotMatch(seo.caseStudyMetadata('orquestador').description, /original project/i);
});

test('research uses the shared website identity and keeps publication date on the original study', () => {
  const article = writing.writingStructuredData(true);
  assert.equal(article.isPartOf['@id'], seo.WEBSITE_ID);
  assert.equal(article.mainEntityOfPage, article.url);
  assert.equal(article.hasPart.datePublished, '2026-10-04');
  assert.equal(article.hasPart.inLanguage, 'es');
  assert.equal(article.encoding.contentUrl, article.hasPart.url);
  assert.equal(article.datePublished, undefined);
});

test('Spanish generated metadata keeps its own canonical and profile ID', t => {
  if (!existsSync(path.join(root, 'src/localized/es/lib/seo.ts'))) return t.skip('Run the existing i18n build before integration verification.');
  const spanish = load('src/localized/es/lib/seo.ts');
  const profile = spanish.profileStructuredData['@graph'].find(item => item['@type'] === 'ProfilePage');
  assert.equal(profile.url, absolute('/es'));
  assert.equal(profile['@id'], `${absolute('/es')}#profile`);
  assert.equal(profile.inLanguage, 'es');
  assert.equal(spanish.PERSON_ID, seo.PERSON_ID);
  for (const key of ['agora', 'trainly', 'orquestador']) {
    assert.equal(spanish.caseStudyMetadata(key).alternates.canonical, absolute(`/es/${key}`));
  }
});

test('robots preserves general crawling without adding a training-specific policy', () => {
  const robots = read('public/robots.txt');
  assert.match(robots, /User-agent: \*\s+Allow: \/\s/);
  assert.match(robots, /Sitemap: https:\/\/tomas-garbarino\.vercel\.app\/sitemap\.xml/);
  assert.doesNotMatch(robots, /GPTBot|OAI-SearchBot|ChatGPT-User/);
});
