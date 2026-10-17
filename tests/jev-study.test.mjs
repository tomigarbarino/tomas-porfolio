import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';

const study = JSON.parse(readFileSync(new URL('../src/content/jev-study.json', import.meta.url)));
const blocks = study.sections.flatMap(section => section.blocks);

test('complete web study includes methods, all results, limitations, disclosures, references and appendices', () => {
  assert.deepEqual(study.sections.map(section => section.id), ['resumen', 'aprendizajes', 'introduccion', 'trabajo-relacionado', 'sistema', 'diseno', 'resultados', 'discusion', 'conclusion', 'datos-y-codigo', 'intereses', 'referencias', 'apendice-a', 'apendice-b', 'apendice-c', 'apendice-d']);
  assert.equal(blocks.filter(block => block.type === 'heading').length, 23);
  assert.deepEqual(blocks.filter(block => block.type === 'reference').map(block => block.number), Array.from({ length: 25 }, (_, i) => i + 1));
  const text = blocks.map(block => block.text ?? '').join(' ');
  for (const passage of ['validación cruzada mitig', 'no reemplaza un conjunto reservado', 'Sin resultados de contratación', 'no audita equidad entre grupos', 'constituye un interés en los resultados', 'Los CVs, transcripciones y etiquetas por ítem no se comparten']) assert.ok(text.includes(passage), passage);
});

test('native tables retain denominators and distinguish in-sample threshold results from cross-validation', () => {
  assert.deepEqual(study.tables.map(table => table.rows.length), [9, 4, 3, 6, 3, 4, 13, 6]);
  for (const table of study.tables) for (const row of table.rows) assert.equal(row.length, table.columns.length);
  const decisions = study.tables.find(table => table.label === '2');
  assert.deepEqual(decisions.rows[0].slice(2), ['7/26', '12/26', '12/15', '2/19']);
  const retrospective = study.tables.find(table => table.label === '4');
  assert.deepEqual(retrospective.rows[1], ['JEV', '0,05', '136', '35', '0,0 % [0–0]', '28,8 % [0–53]']);
  const crossValidation = study.tables.find(table => table.label === '5');
  assert.deepEqual(crossValidation.rows[0], ['JEV', '0,05', '151', '791', '4,9 %', '0,005', '476', '26,4 %']);
  assert.deepEqual(blocks.filter(block => block.type === 'table').map(block => block.id), study.tables.map(table => table.id));
});

test('all seven original research figures retain their exact extracted bytes', () => {
  const figures = blocks.filter(block => block.type === 'figure');
  assert.deepEqual(figures.map(figure => figure.number), [1, 2, 3, 4, 5, 6, 7]);
  for (const figure of figures) {
    const bytes = readFileSync(new URL(`../public${figure.src}`, import.meta.url));
    assert.equal(createHash('sha256').update(bytes).digest('hex'), figure.sha256);
    assert.equal(bytes.readUInt32BE(16), figure.width);
    assert.equal(bytes.readUInt32BE(20), figure.height);
  }
});

test('all seven portfolio figures are genuine vectors with embedded house fonts and source provenance', () => {
  const style = JSON.parse(readFileSync(new URL('../src/content/jev-figure-style.json', import.meta.url)));
  const originals = blocks.filter(block => block.type === 'figure');
  assert.deepEqual(style.figures.map(figure => figure.number), [1, 2, 3, 4, 5, 6, 7]);
  for (const styled of style.figures) {
    const original = originals.find(figure => figure.number === styled.number);
    const svg = readFileSync(new URL(`../public${styled.src}`, import.meta.url), 'utf8');
    assert.equal(createHash('sha256').update(svg).digest('hex'), styled.sha256);
    assert.equal(styled.sourceSha256, original.sha256);
    assert.ok(svg.includes(`viewBox="0 0 ${styled.width} ${styled.height}"`));
    assert.match(svg, /font-family:Barlow;src:url\(data:font\/woff2;base64,/);
    assert.match(svg, /font-family:Plex;src:url\(data:font\/woff2;base64,/);
    assert.match(svg, /<text\b/);
    assert.match(svg, /<path\b/);
    assert.match(svg, /SIL OPEN FONT LICENSE/);
    assert.doesNotMatch(svg, /<(image|script|foreignObject|filter)\b|data:image|href="https?:/);
  }
  assert.equal(style.rasterEmbedded, false);
  assert.match(style.provenance, /Raw observations unavailable/);
  for (const trace of style.traces) {
    const source = originals[trace.figure - 1];
    const [left, top, right, bottom] = trace.bounds;
    assert.ok(left >= 0 && top >= 0 && right <= source.width && bottom <= source.height);
    assert.ok(trace.paths > 0);
    assert.match(trace.maskSha256, /^[a-f0-9]{64}$/);
    assert.ok(trace.sourceRecallWithin1px >= .99);
    assert.ok(trace.vectorPrecisionWithin1px >= .98);
  }
});

test('native confusion matrices retain every published count and denominator', () => {
  const style = JSON.parse(readFileSync(new URL('../src/content/jev-figure-style.json', import.meta.url)));
  const matrix = style.figures.find(figure => figure.number === 5);
  assert.deepEqual(matrix.matrices, [
    [[97,11,0],[27,77,1],[0,3,4]], [[104,4,0],[52,51,2],[0,1,6]],
    [[95,13,0],[57,45,3],[0,0,7]], [[103,5,0],[83,10,12],[1,0,6]],
  ]);
  for (const rows of matrix.matrices) assert.deepEqual(rows.map(row => row.reduce((a,b) => a+b, 0)), [108,105,7]);
});
