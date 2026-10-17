import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { controlarSeleccion, salidaConFallo } from '../src/lib/orquestador/caso-guiado.mjs';

const read = name => readFileSync(new URL(`../src/content/${name}`, import.meta.url));
const bytes = read('orquestador-sources.json');
const packet = JSON.parse(bytes);
const selection = JSON.parse(read('orquestador-selection.json'));
const metrics = JSON.parse(read('orquestador-run.json'));

test('replay uses the original source bytes tied to the recorded run', () => {
  assert.equal(createHash('sha256').update(bytes).digest('hex'), metrics.sourceHash);
  const result = controlarSeleccion(packet, selection);
  assert.equal(result.ok, true);
  assert.equal(result.registros.length, 3);
  for (const source of packet.fuentes) assert.ok(result.borrador.includes(source.url));
});

for (const [name, input] of [
  ['unsupported deployment mixed with valid records', salidaConFallo(JSON.stringify(selection))],
  ['unknown source', { items: [{ id: 'C99', estado: 'en_main' }] }],
  ['duplicate source', { items: [selection.items[0], selection.items[0]] }],
  ['free text', { items: [{ ...selection.items[0], claim: 'deployed' }] }],
  ['empty selection', { items: [] }],
  ['invalid JSON', '{'],
]) test(`blocks ${name} without a partial draft`, () => {
  const result = controlarSeleccion(packet, input);
  assert.equal(result.ok, false);
  assert.equal(result.borrador, null);
  assert.deepEqual(result.registros, []);
});

test('restoring the original selection restores the reviewable draft', () => {
  assert.equal(controlarSeleccion(packet, salidaConFallo(JSON.stringify(selection))).borrador, null);
  assert.equal(controlarSeleccion(packet, selection).ok, true);
});
