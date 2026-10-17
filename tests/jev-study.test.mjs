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

test('portfolio variants embed exact source pixels at native size without changing plot geometry', () => {
  const style = JSON.parse(readFileSync(new URL('../src/content/jev-figure-style.json', import.meta.url)));
  const originals = blocks.filter(block => block.type === 'figure');
  assert.deepEqual(style.figures.map(figure => figure.number), [1, 2, 3, 4, 5, 6, 7]);
  for (const styled of style.figures) {
    const original = originals.find(figure => figure.number === styled.number);
    const svg = readFileSync(new URL(`../public${styled.src}`, import.meta.url), 'utf8');
    const embedded = Buffer.from(svg.match(/href="data:image\/png;base64,([^"]+)"/)[1], 'base64');
    assert.equal(createHash('sha256').update(svg).digest('hex'), styled.sha256);
    assert.equal(createHash('sha256').update(embedded).digest('hex'), original.sha256);
    assert.equal(styled.sourceSha256, original.sha256);
    assert.ok(svg.includes(`<image x="28" y="100" width="${original.width}" height="${original.height}"`));
    assert.equal(styled.width, original.width + 64);
    assert.equal(styled.height, original.height + 150);
    assert.doesNotMatch(svg, /<(script|foreignObject)\b|href="https?:|<fe(GaussianBlur|DisplacementMap|Morphology|ConvolveMatrix)\b/);
  }
});
