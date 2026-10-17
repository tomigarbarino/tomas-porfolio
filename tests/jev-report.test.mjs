import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';

test('hosted JEV report preserves the complete original PDF bytes', () => {
  const report = JSON.parse(readFileSync(new URL('../src/content/jev-report.json', import.meta.url)));
  const pdf = readFileSync(new URL(`../public${report.localPath}`, import.meta.url));
  assert.equal(pdf.subarray(0, 5).toString(), '%PDF-');
  assert.equal(pdf.length, report.bytes);
  assert.equal(createHash('sha256').update(pdf).digest('hex'), report.sha256);
  assert.equal(report.pages, 17);
});
