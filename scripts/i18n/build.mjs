/** Compile locale presentation modules; never modify identifiers or interaction logic. */
import ts from 'typescript';
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { createHash } from 'node:crypto';
import path from 'node:path';
import { candidate, sourceFiles, templateKey, human } from './catalog.mjs';

const read = file => JSON.parse(readFileSync(file, 'utf8'));
const write = (file, text) => { mkdirSync(path.dirname(file), { recursive: true }); writeFileSync(file, text); };
const catalogs = Object.fromEntries(['en', 'es'].map(locale => [locale, existsSync(`src/i18n/${locale}.json`) ? read(`src/i18n/${locale}.json`) : {}]));
const sources = sourceFiles().map(file => file.replaceAll('\\', '/'));
const english = ['src/components/JevStudy.tsx', 'src/components/JevFigureViewer.tsx', 'src/views/figure.tsx'];
const preserved = read('src/i18n/preserved.json');
const missing = [];
for (const file of sources) {
  const ast = ts.createSourceFile(file, readFileSync(file, 'utf8'), ts.ScriptTarget.Latest, true, file.endsWith('.tsx') ? ts.ScriptKind.TSX : ts.ScriptKind.TS);
  function inspect(node) {
    const value = candidate(node);
    if ((human(value) || (ts.isJsxText(node) && value && /\p{L}/u.test(value))) && !Object.hasOwn(catalogs.es, value) && !Object.hasOwn(preserved, value)) missing.push({ file, value });
    ts.forEachChild(node, inspect);
  }
  inspect(ast);
}
if (missing.length) throw new Error(`Review new Spanish messages before building:\n${JSON.stringify(missing, null, 2)}`);

export function spanishPath(value) {
  if (value === '/') return '/es';
  if (value.startsWith('/#')) return `/es${value.slice(1)}`;
  if (/^\/en(?=\/)/.test(value)) return value.replace(/^\/en/, '/es');
  if (/^\/writing(?=\/|#|$)/.test(value) || value === '/404') return `/es${value}`;
  return value;
}

function compile(file, locale, mirrored) {
  const input = readFileSync(file, 'utf8');
  const source = ts.createSourceFile(file, input, ts.ScriptTarget.Latest, true, file.endsWith('.tsx') ? ts.ScriptKind.TSX : ts.ScriptKind.TS);
  const edits = [];
  const catalog = catalogs[locale];
  const target = `src/localized/${locale}/${file.slice(4)}`;
  const modulePath = value => {
    const resolved = value.startsWith('@/') ? `src/${value.slice(2)}` : value.startsWith('.') ? path.posix.normalize(path.posix.join(path.posix.dirname(file), value)) : null;
    if (!resolved) return value;
    if (locale === 'es' && resolved === 'src/localized/en/components/JevStudy') return '@/localized/es/components/JevStudy';
    if (resolved === 'src/content/jev-study.json' && locale === 'en') return '@/localized/en/content/jev-study.json';
    if (resolved === 'src/content/jev-figure-style.json' && locale === 'en') return '@/localized/en/content/jev-figure-style.json';
    if (mirrored.some(item => item === resolved || item === `${resolved}.ts` || item === `${resolved}.tsx`)) return `@/localized/${locale}/${resolved.slice(4)}`;
    return `@/${resolved.slice(4)}`;
  };
  const literal = node => {
    let value = node.text;
    if ((ts.isImportDeclaration(node.parent) || ts.isExportDeclaration(node.parent)) && node.parent.moduleSpecifier === node) return modulePath(value);
    if (file.endsWith('/root.tsx') && value.startsWith('../../public/fonts/')) return `../../../../public/fonts/${value.split('/').at(-1)}`;
    value = catalog[value] ?? value;
    if (locale === 'en' && ts.isJsxAttribute(node.parent) && node.parent.name.text === 'lang' && value === 'es') value = 'en';
    if (locale === 'es') {
      value = spanishPath(value);
      if ((ts.isJsxAttribute(node.parent) && node.parent.name.text === 'lang' && file.endsWith('/root.tsx')) || (ts.isPropertyAssignment(node.parent) && node.parent.name.getText(source) === 'inLanguage')) if (value === 'en') value = 'es';
    }
    return value;
  };
  function visit(node) {
    if (ts.isJsxText(node)) {
      const value = candidate(node);
      if (catalog[value] !== undefined) edits.push([node.getStart(source), node.end, `{${JSON.stringify(catalog[value])}}`]);
      return;
    }
    if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) {
      const value = literal(node);
      if (value !== node.text) edits.push([node.getStart(source), node.end, JSON.stringify(value)]);
      return;
    }
    if (ts.isTemplateExpression(node)) {
      const key = templateKey(node);
      if (catalog[key] !== undefined) {
        const translated = catalog[key];
        const pieces = translated.split(/(\{\d+\})/g).map(piece => /^\{\d+\}$/.test(piece) ? '${' + node.templateSpans[Number(piece.slice(1, -1))].expression.getText(source) + '}' : piece.replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\$\{/g, '\\${'));
        edits.push([node.getStart(source), node.end, '`' + pieces.join('') + '`']);
        return;
      }
      if (locale === 'es') {
        const head = spanishPath(node.head.text);
        if (head !== node.head.text) edits.push([node.head.getStart(source), node.head.end, '`' + head + '${']);
      }
      node.templateSpans.forEach(span => visit(span.expression));
      return;
    }
    ts.forEachChild(node, visit);
  }
  visit(source);
  let output = input;
  for (const [start, end, text] of edits.sort((a, b) => b[0] - a[0])) output = output.slice(0, start) + text + output.slice(end);
  write(target, `// Generated by scripts/i18n/build.mjs. Edit source + src/i18n/${locale}.json.\n${output}`);
}

for (const file of sources) compile(file, 'es', sources);
for (const file of english) compile(file, 'en', english);

function translateObject(value, catalog) {
  if (typeof value === 'string') return catalog[value] ?? value;
  if (Array.isArray(value)) return value.map(item => translateObject(item, catalog));
  if (value && typeof value === 'object') return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, translateObject(item, catalog)]));
  return value;
}
const originalStudy = read('src/content/jev-study.json');
for (const section of originalStudy.sections) for (const block of section.blocks) {
  if (block.type === 'reference') continue; // Published bibliography titles stay authentic.
  for (const field of ['text', 'caption']) if (block[field] && !Object.hasOwn(catalogs.en, block[field])) throw new Error(`Missing English research translation: ${block[field].slice(0, 100)}`);
}
const study = translateObject(originalStudy, catalogs.en);
for (const [index, table] of study.tables.entries()) table.rows = table.rows.map((row, r) => row.map((cell, c) => {
  if (Object.hasOwn(catalogs.en, originalStudy.tables[index].rows[r][c])) return cell;
  return cell.replace(/\d+(?:[.,]\d+)*/g, token => token.includes(',') ? token.replaceAll('.', '').replaceAll(',', '.') : /^\d{1,3}(?:\.\d{3})+$/.test(token) ? token.replaceAll('.', ',') : token);
}));
write('src/localized/en/content/jev-study.json', JSON.stringify(study, null, 2) + '\n');
const style = read('src/content/jev-figure-style.json');
for (const figure of style.figures) {
  const source = readFileSync(`public${figure.src}`, 'utf8');
  // Only native text/title/desc nodes change. All geometry and embedded fonts stay byte-identical.
  const output = source.replace(/(<(?:text|title|desc)\b[^>]*>)([^<]*)(<\/(?:text|title|desc)>)/g, (all, open, text, close) => {
    const plain = text.replaceAll('&amp;', '&').replaceAll('&lt;', '<').replaceAll('&gt;', '>');
    const translated = catalogs.en[plain];
    return translated === undefined ? all : open + translated.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;') + close;
  });
  figure.src = figure.src.replace('-portfolio.svg', '-portfolio-en.svg');
  figure.sha256 = createHash('sha256').update(output).digest('hex');
  write(`public${figure.src}`, output);
}
write('src/localized/en/content/jev-figure-style.json', JSON.stringify(style, null, 2) + '\n');
console.log(`Compiled ${sources.length} Spanish modules, English JEV study/viewer, and seven English vectors.`);
