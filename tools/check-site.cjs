const fs = require('node:fs');
const path = require('node:path');
const site = require('../src/_data/site.json');
const root = path.resolve(__dirname, '../_site');
const base = (process.env.SITE_BASE_PATH || site.basePath).replace(/\/$/, '');
function walk(dir) { return fs.readdirSync(dir, { withFileTypes: true }).flatMap(entry => entry.isDirectory() ? walk(path.join(dir, entry.name)) : [path.join(dir, entry.name)]); }
const files = walk(root);
const failures = [];
let checked = 0;
for (const file of files.filter(file => file.endsWith('.html'))) {
  const html = fs.readFileSync(file, 'utf8');
  if ((html.match(/<h1(?:\s|>)/g) || []).length !== 1) failures.push(`${file}: expected one h1`);
  // Standalone tools may legitimately use JavaScript's undefined value.
  const markup = html.replace(/<(script|style)\b[^>]*>[\s\S]*?<\/\1\s*>/gi, '');
  if (markup.includes('undefined') || markup.includes('[object Object]')) failures.push(`${file}: unresolved template value`);
  for (const [, raw] of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
    if (/^(?:https?:|data:|mailto:|tel:)/.test(raw)) continue;
    let href = raw.split(/[?#]/)[0];
    const fragment = raw.includes('#') ? decodeURIComponent(raw.split('#')[1]) : '';
    if (!href) {
      if (fragment && !html.includes(`id="${fragment}"`)) failures.push(`${file}: missing fragment ${raw}`);
      continue;
    }
    href = decodeURIComponent(href);
    let target;
    if (href.startsWith('/')) {
      if (base && !href.startsWith(base + '/')) { failures.push(`${file}: path prefix missing: ${href}`); continue; }
      target = path.join(root, href.slice(base.length));
    } else target = path.resolve(path.dirname(file), href);
    if (href.endsWith('/')) target = path.join(target, 'index.html');
    if (!fs.existsSync(target)) failures.push(`${file}: missing ${raw}`);
    else if (fragment && target.endsWith('.html') && !fs.readFileSync(target, 'utf8').includes(`id="${fragment}"`)) failures.push(`${file}: missing target fragment ${raw}`);
    checked++;
  }
}
const approvedDocuments = new Set();
for (const file of files) {
  const relative = path.relative(root, file).replaceAll('\\', '/');
  if ((/\.(?:md|pdf|env|cjs)$/.test(file) && !approvedDocuments.has(relative)) ||
      (relative.startsWith('assets/documents/') && !approvedDocuments.has(relative)) ||
      /[\\/]drafts[\\/]/.test(file)) failures.push(`Unexpected published source: ${file}`);
}
if (failures.length) { console.error(failures.join('\n')); process.exit(1); }
console.log(`Verified ${files.filter(file => file.endsWith('.html')).length} HTML pages and ${checked} local links/assets.`);
