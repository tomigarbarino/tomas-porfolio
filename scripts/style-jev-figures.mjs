/** Reproducible presentation variants. Scientific pixels stay embedded verbatim.
 * No tracing, interpolation, cropping, external resources or generated data.
 * Run: node scripts/style-jev-figures.mjs
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';

const root = new URL('../', import.meta.url);
const study = JSON.parse(readFileSync(new URL('src/content/jev-study.json', root)));
const titles = ['Sistema y política', 'Decisiones por estrato', 'Probabilidades y referencia humana', 'Revisión y riesgo de rechazo', 'Matrices de confusión', 'Sensibilidad a la referencia', 'Riesgo y cobertura'];
const hash = bytes => createHash('sha256').update(bytes).digest('hex');
const palette = { ink: '#080909', cream: '#f2efde', acid: '#f4ff54', violet: '#c6a7ff', pink: '#ff76b9' };
const rgb = color => color.match(/\w\w/g).map(value => parseInt(value, 16) / 255);
const bg = rgb(palette.ink.slice(1));
const fg = rgb(palette.cream.slice(1));
// Invert neutrals while retaining light-gray markers. Pure white is background.
const ramp = Array.from({ length: 101 }, (_, n) => n === 100 ? '0' : (1 - 0.6 * n / 100).toFixed(4)).join(' ');
const matrix = fg.map((channel, index) => `${(channel - bg[index]).toFixed(6)} 0 0 0 ${bg[index].toFixed(6)}`).join(' ') + ' 0 0 0 1 0';
const figures = study.sections.flatMap(section => section.blocks).filter(block => block.type === 'figure').map(figure => {
  const bytes = readFileSync(new URL(`public${figure.src}`, root));
  if (hash(bytes) !== figure.sha256) throw new Error(`Changed source figure ${figure.number}`);
  const { width, height, number } = figure;
  const outerWidth = width + 64;
  const outerHeight = height + 150;
  // Boxes and heatmap cells contain reversed labels. Keep their original
  // luminance direction so text remains readable against the filled cells.
  const paperPlot = number === 1 || number === 5;
  const intensity = paperPlot ? '0 1' : ramp;
  const accent = number === 5 ? '#563294' : palette.acid;
  const title = titles[number - 1];
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${outerWidth}" height="${outerHeight}" viewBox="0 0 ${outerWidth} ${outerHeight}" role="img" aria-labelledby="title description">
  <title id="title">Figura ${number} · ${title}</title>
  <desc id="description">Versión visual del portfolio. Figura científica original íntegra, con cambio de paleta y marco exterior. Sin cambios en datos, ejes, escalas, etiquetas ni geometría.</desc>
  <defs><filter id="palette" color-interpolation-filters="sRGB" x="0" y="0" width="100%" height="100%">
    <feColorMatrix in="SourceGraphic" type="saturate" values="0" result="gray"/>
    <feComponentTransfer in="gray" result="intensity"><feFuncR type="table" tableValues="${intensity}"/></feComponentTransfer>
    <feColorMatrix in="intensity" type="matrix" values="${matrix}" result="neutral"/>
    <feColorMatrix in="SourceGraphic" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  -2 1 1 0 0" result="cyan"/>
    <feFlood flood-color="${accent}" result="accent"/>
    <feComposite in="accent" in2="cyan" operator="in" result="highlight"/>
    <feMerge result="colored"><feMergeNode in="neutral"/><feMergeNode in="highlight"/></feMerge>
    <feComposite in="colored" in2="SourceGraphic" operator="in"/>
  </filter></defs>
  <path fill="${palette.violet}" d="M8 8H${outerWidth}V${outerHeight}H8Z"/>
  <path fill="${palette.ink}" stroke="${palette.cream}" stroke-width="2" d="M1 1H${outerWidth - 9}V${outerHeight - 9}H1Z"/>
  <path fill="${palette.violet}" d="M2 2H${outerWidth - 10}V54H2Z"/>
  <g font-family="monospace" fill="${palette.ink}"><text x="26" y="35" font-size="18" font-weight="bold">JEV / RESEARCH FILE 001</text><text x="${outerWidth - 40}" y="35" text-anchor="end" font-size="18">FIG. ${String(number).padStart(2, '0')}</text></g>
  <g fill="${palette.acid}"><path d="M24 72H32V80H24Z"/><text x="44" y="82" font-family="monospace" font-size="18">${title.toUpperCase()}</text></g>
  <image x="28" y="100" width="${width}" height="${height}" href="data:image/png;base64,${bytes.toString('base64')}" filter="url(#palette)"/>
  <path stroke="${palette.pink}" d="M28 ${outerHeight - 31}H${outerWidth - 36}"/>
</svg>
`;
  const src = `/media/research/jev/figure-${number}-portfolio.svg`;
  writeFileSync(new URL(`public${src}`, root), svg);
  return { number, src, width: outerWidth, height: outerHeight, sha256: hash(svg), sourceSha256: hash(bytes), mode: 'palette-only-with-exterior-frame' };
});
writeFileSync(new URL('src/content/jev-figure-style.json', root), JSON.stringify({ palette, figures }, null, 2) + '\n');
console.log(`Styled ${figures.length} figures; original PNG bytes embedded unchanged.`);
