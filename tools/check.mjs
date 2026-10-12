import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const files = fs.readdirSync(root).filter((f) => f.endsWith('.html'));
const problems = [];
let checked = 0;
const window = {};
const context = vm.createContext({ window, console });
for (const f of ['sources', 'lessons', 'quizzes', 'curriculum', 'threats', 'glossary'])
  vm.runInContext(fs.readFileSync(path.join(root, 'js/data/' + f + '.js'), 'utf8'), context);
const iconFile = fs.readFileSync(path.join(root, 'assets/icons.svg'), 'utf8');
// En-têtes de sécurité servis par l’hébergeur. `frame-ancestors` n’est ignoré que dans une
// méta CSP : il doit donc figurer dans l’en-tête HTTP et pas dans les pages.
const vercel = JSON.parse(fs.readFileSync(path.join(root, 'vercel.json'), 'utf8'));
const globalHeaders = (vercel.headers.find((h) => h.source === '/(.*)') || {}).headers || [];
const headerValue = (key) =>
  (globalHeaders.find((h) => h.key.toLowerCase() === key.toLowerCase()) || {}).value;
for (const key of [
  'X-Content-Type-Options',
  'Referrer-Policy',
  'Permissions-Policy',
  'X-Frame-Options',
  'Strict-Transport-Security',
  'Content-Security-Policy',
])
  if (!headerValue(key)) problems.push('vercel.json: en-tête de sécurité manquant ' + key);
const cspHeader = headerValue('Content-Security-Policy') || '';
if (!/frame-ancestors 'none'/.test(cspHeader))
  problems.push("vercel.json: frame-ancestors 'none' absent de la CSP servie");
const decodeEntities = (value) =>
  value.replaceAll('&#x27;', "'").replaceAll('&quot;', '"').replaceAll('&amp;', '&');
for (const file of files) {
  const html = fs.readFileSync(path.join(root, file), 'utf8');
  const meta = (html.match(/http-equiv="Content-Security-Policy"[^>]*content="([^"]+)"/) || [])[1];
  if (!meta) problems.push(file + ': méta CSP absente');
  else {
    const decoded = decodeEntities(meta);
    if (/frame-ancestors/.test(decoded))
      problems.push(file + ': frame-ancestors dans une méta CSP est ignoré par les navigateurs');
    if (cspHeader !== `${decoded}; frame-ancestors 'none'`)
      problems.push(file + ': CSP de la page différente de la CSP servie par l’hébergeur');
  }
  if (!html.includes('lang="fr"')) problems.push(file + ': langue absente');
  if ((html.match(/<main\b/g) || []).length !== 1)
    problems.push(file + ': nombre de main invalide');
  if (/<script(?![^>]*\bsrc=)[^>]*>\s*[^<\s]/.test(html))
    problems.push(file + ': script inline non autorisé');
  for (const [, value] of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
    if (!value || value.startsWith('#')) continue;
    const url = new URL(value.replaceAll('&amp;', '&'), 'http://internal/' + file);
    if (url.origin !== 'http://internal') continue;
    const dest = path.join(root, decodeURIComponent(url.pathname));
    checked++;
    if (!fs.existsSync(dest)) problems.push(`${file}: fichier manquant ${value}`);
    if (
      url.pathname === '/assets/icons.svg' &&
      url.hash &&
      !iconFile.includes(`id="${url.hash.slice(1)}"`)
    )
      problems.push(`${file}: icône manquante ${url.hash}`);
    if (
      url.pathname === '/apprendre.html' &&
      url.searchParams.has('theme') &&
      !window.LESSONS.some((l) => l.id === url.searchParams.get('theme'))
    )
      problems.push(file + ': cours introuvable ' + value);
    if (
      url.pathname === '/quiz.html' &&
      url.searchParams.has('id') &&
      !window.QUIZZES[url.searchParams.get('id')]
    )
      problems.push(file + ': quiz introuvable ' + value);
  }
}
for (const l of window.LESSONS) {
  if (!window.QUIZZES[l.id]) problems.push(l.id + ': quiz manquant');
  if (!l.warningSigns?.length || !l.objective || !l.summary)
    problems.push(l.id + ': données pédagogiques manquantes');
}
for (const source of Object.values(window.SOURCES)) {
  if (new URL(source.url).protocol !== 'https:')
    problems.push(source.name + ': protocole de source non HTTPS');
}
if (problems.length) {
  console.error(problems.join('\n'));
  process.exit(1);
}
console.log(
  `${files.length} pages, ${checked} références locales, ${window.LESSONS.length} cours, ${Object.keys(window.QUIZZES).length} quiz et ${window.THREATS.length} fiches : contrôle structurel OK.`
);
console.log(
  'Les liens externes ne sont pas interrogés par ce contrôle ; leur revue éditoriale est documentée séparément.'
);
