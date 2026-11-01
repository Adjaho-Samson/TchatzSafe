import { createHash } from 'node:crypto';
import { readdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
async function filesIn(folder) {
  const entries = await readdir(path.join(root, folder), { withFileTypes: true });
  const result = [];
  for (const entry of entries) {
    const name = path.posix.join(folder, entry.name);
    if (entry.isDirectory()) result.push(...(await filesIn(name)));
    else if (/\.(?:js|css|svg|png|jpe?g|webp|woff2)$/.test(name)) result.push(name);
  }
  return result;
}
const html = (await readdir(root)).filter((name) => name.endsWith('.html'));
const assets = [
  ...html,
  'manifest.webmanifest',
  ...(await filesIn('css')),
  ...(await filesIn('js')),
  ...(await filesIn('assets')),
].sort();
const template = await readFile(path.join(root, 'tools/sw-template.js'), 'utf8');
const hash = createHash('sha256').update(template);
for (const asset of assets) hash.update(asset).update(await readFile(path.join(root, asset)));
const version = 'tchatzsafe-shell-' + hash.digest('hex').slice(0, 16);
const result = template
  .replace('__CACHE_NAME__', JSON.stringify(version))
  .replace('__ASSETS__', JSON.stringify(assets));
await writeFile(path.join(root, 'sw.js'), result);
console.log(`Service worker généré : ${assets.length} ressources, version ${version}`);
