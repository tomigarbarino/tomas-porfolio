import ts from 'typescript';
import { readFileSync, readdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';

export function filesAt(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap(entry => entry.isDirectory() ? filesAt(path.join(dir, entry.name)) : [path.join(dir, entry.name)]);
}

// React's JSX whitespace rules: indentation/newlines are not literal spaces.
export function jsxText(value) {
  const lines = value.replace(/\r/g, '').split('\n');
  let last = 0;
  lines.forEach((line, index) => { if (/[^ \t]/.test(line)) last = index; });
  return lines.map((line, index) => {
    let text = line.replace(/\t/g, ' ');
    if (index !== 0) text = text.replace(/^ +/, '');
    if (index !== lines.length - 1) text = text.replace(/ +$/, '');
    return text && index !== last ? `${text} ` : text;
  }).join('').replace(/&amp;/g, '&').replace(/&gt;/g, '>').replace(/&lt;/g, '<').replace(/&quot;/g, '"').replace(/&#39;/g, "'");
}

export function templateKey(node) {
  return node.head.text + node.templateSpans.map((span, index) => `\u0000${index}\u0000${span.literal.text}`).join('');
}

export function candidate(node) {
  if (ts.isJsxText(node)) return jsxText(node.text);
  if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) {
    if (ts.isImportDeclaration(node.parent) || ts.isExportDeclaration(node.parent) || ts.isImportTypeNode(node.parent)) return null;
    if (ts.isJsxAttribute(node.parent) && /^(className|id|href|src|style|type|role|target|rel|key|sizes|download|dateTime|lang|data-.*|aria-(current|hidden|live|atomic|pressed|expanded|controls|labelledby|describedby))$/.test(node.parent.name.text)) return null;
    return node.text;
  }
  if (ts.isTemplateExpression(node)) return templateKey(node);
  return null;
}

export function human(value) {
  return value && /[\p{L}]/u.test(value) && !/^(use client|use server|@|https?:|mailto:|data:|\.|\/|#|\[|\(|<svg)/.test(value) &&
    !/(?:\{|\}|=>|querySelector|data-|:has\(|:not\(|:is\(|min-width|linear-gradient|translate|rotate\(|--|px\b|\bvar\()/.test(value) &&
    (/\s/.test(value) || /^[A-ZÁÉÍÓÚÑ][\p{L}]+[.!?]?$/u.test(value));
}

export function sourceFiles() {
  return ['src/components', 'src/data', 'src/lib', 'src/views'].flatMap(dir => filesAt(dir)).filter(file => /(?<!\.d)\.(ts|tsx)$/.test(file) && !file.includes('LanguageSwitch'));
}

if (process.argv.includes('--extract')) {
  const entries = new Map();
  for (const file of sourceFiles()) {
    const source = ts.createSourceFile(file, readFileSync(file, 'utf8'), ts.ScriptTarget.Latest, true, file.endsWith('.tsx') ? ts.ScriptKind.TSX : ts.ScriptKind.TS);
    const visit = node => {
      const value = candidate(node);
      if (human(value)) {
        const locations = entries.get(value) ?? [];
        if (!locations.includes(file.replaceAll('\\', '/'))) locations.push(file.replaceAll('\\', '/'));
        entries.set(value, locations);
      }
      ts.forEachChild(node, visit);
    };
    visit(source);
  }
  writeFileSync('src/i18n/candidates.json', JSON.stringify([...entries].map(([text, files]) => ({ text, files })), null, 2) + '\n');
  console.log(`Extracted ${entries.size} candidate messages.`);
}
