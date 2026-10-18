import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import ts from 'typescript';
import { sourceFiles, candidate, human } from '../scripts/i18n/catalog.mjs';
import { languagePaths } from '../src/i18n/routes.ts';

const read = file => JSON.parse(readFileSync(new URL(`../${file}`, import.meta.url), 'utf8'));
const spanish = read('src/i18n/es.json');
const english = read('src/i18n/en.json');
const preserved = read('src/i18n/preserved.json');
const source = read('src/content/jev-study.json');
const translated = read('src/localized/en/content/jev-study.json');

function numbers(text, locale) {
  return (text.match(/\d+(?:[.,]\d+)*/g) ?? []).map(value => locale === 'es'
    ? value.replace(/\.(?=\d{3}(?:\D|$))/g, '').replaceAll(',', '.')
    : value.replace(/,(?=\d{3}(?:\D|$))/g, '')).sort();
}

test('language links round-trip all page families and figure URLs', () => {
  const pairs = [['/', '/es'], ['/en/agora', '/es/agora'], ['/en/trainly', '/es/trainly'], ['/en/orquestador', '/es/orquestador'], ['/writing', '/es/writing'], ['/writing/jev', '/es/writing/jev'], ['/writing/jev/figures/7', '/es/writing/jev/figures/7'], ['/404', '/es/404']];
  for (const [en, es] of pairs) {
    assert.deepEqual(languagePaths(en), { en, es });
    assert.deepEqual(languagePaths(es), { en, es });
  }
});

test('Spanish copy has explicit translations or reviewed preservation for every display message', () => {
  const missing = [];
  for (const file of sourceFiles()) {
    const ast = ts.createSourceFile(file, readFileSync(file, 'utf8'), ts.ScriptTarget.Latest, true, file.endsWith('.tsx') ? ts.ScriptKind.TSX : ts.ScriptKind.TS);
    function visit(node) {
      const value = candidate(node);
      if ((human(value) || (ts.isJsxText(node) && value && /\p{L}/u.test(value))) && !Object.hasOwn(spanish, value) && !Object.hasOwn(preserved, value)) missing.push({ file, value });
      ts.forEachChild(node, visit);
    }
    visit(ast);
  }
  assert.deepEqual(missing, []);
  for (const catalog of [spanish, english]) for (const [key, value] of Object.entries(catalog)) {
    if (!key.includes('\0')) continue;
    assert.deepEqual((value.match(/\{\d+\}/g) ?? []).sort(), [...key.matchAll(/\0(\d+)\0/g)].map(match => `{${match[1]}}`).sort(), key);
  }
});

test('English study translates every section and keeps every block, citation and numerical result', () => {
  assert.equal(source.sections.length, translated.sections.length);
  for (let i = 0; i < source.sections.length; i++) {
    const original = source.sections[i], result = translated.sections[i];
    assert.equal(original.id, result.id);
    assert.equal(result.title, english[original.title]);
    assert.equal(original.blocks.length, result.blocks.length);
    for (let j = 0; j < original.blocks.length; j++) {
      const before = original.blocks[j], after = result.blocks[j];
      assert.equal(before.type, after.type);
      for (const field of ['id', 'number', 'src', 'sha256', 'width', 'height']) assert.equal(after[field], before[field]);
      for (const field of ['text', 'caption']) if (before[field]) {
        if (before.type === 'reference') assert.equal(after[field], before[field]);
        else {
          assert.ok(english[before[field]], `Missing translation: ${before[field].slice(0, 90)}`);
          assert.equal(after[field], english[before[field]]);
          assert.deepEqual(numbers(before[field], 'es'), numbers(after[field], 'en'), `${original.id} block ${j}`);
        }
      }
    }
  }
  for (let i = 0; i < source.tables.length; i++) {
    const before = source.tables[i], after = translated.tables[i];
    assert.equal(before.id, after.id);
    assert.equal(before.rows.length, after.rows.length);
    assert.equal(before.columns.length, after.columns.length);
    for (let row = 0; row < before.rows.length; row++) for (let col = 0; col < before.rows[row].length; col++) assert.deepEqual(numbers(before.rows[row][col], 'es'), numbers(after.rows[row][col], 'en'), `${before.id} ${row}/${col}`);
  }
});

test('English figures change native labels only, preserving all geometry and embedded house fonts', () => {
  const figures = read('src/content/jev-figure-style.json').figures;
  const stripLabels = svg => svg.replace(/(<(?:text|title|desc)\b[^>]*>)[^<]*(<\/(?:text|title|desc)>)/g, '$1$2');
  for (const figure of figures) {
    const original = readFileSync(new URL(`../public${figure.src}`, import.meta.url), 'utf8');
    const localized = readFileSync(new URL(`../public${figure.src.replace('-portfolio.svg', '-portfolio-en.svg')}`, import.meta.url), 'utf8');
    assert.equal(stripLabels(localized), stripLabels(original));
    assert.ok(!localized.includes('<image'));
    assert.match(localized, /font-family:Barlow;/);
    assert.match(localized, /font-family:Plex;/);
    assert.match(localized, /Figure \d/);
  }
});
