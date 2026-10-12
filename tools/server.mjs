import http from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const index = process.argv.indexOf('--port');
const port = Number(index >= 0 ? process.argv[index + 1] : process.env.PORT || 3000);
const types = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.webp': 'image/webp',
  '.woff2': 'font/woff2',
  '.xml': 'application/xml',
  '.txt': 'text/plain; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
};
const server = http.createServer(async (req, res) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Referrer-Policy', 'no-referrer');
  try {
    let pathname = decodeURIComponent(new URL(req.url, 'http://static.local').pathname);
    if (
      pathname.includes('\0') ||
      pathname.split('/').some((p) => p.startsWith('.')) ||
      /^\/(?:node_modules|tools|templates|tests|docs)(?:\/|$)/.test(pathname)
    ) {
      res.writeHead(404);
      res.end('Introuvable');
      return;
    }
    if (pathname.endsWith('/')) pathname += 'index.html';
    if (!path.extname(pathname)) pathname += '.html';
    const file = path.resolve(root, '.' + pathname);
    if (!file.startsWith(root + path.sep)) {
      res.writeHead(403);
      res.end('Accès refusé');
      return;
    }
    const info = await stat(file);
    if (!info.isFile()) throw new Error('not a file');
    const data = await readFile(file);
    res.setHeader('Content-Type', types[path.extname(file)] || 'application/octet-stream');
    res.setHeader('Cache-Control', 'no-store');
    if (req.method === 'HEAD') {
      res.writeHead(200);
      res.end();
      return;
    }
    if (req.method !== 'GET') {
      res.writeHead(405);
      res.end('Aucune API disponible.');
      return;
    }
    res.writeHead(200);
    res.end(data);
  } catch (_) {
    res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
    try {
      res.end(await readFile(path.join(root, '404.html')));
    } catch (_) {
      res.end('Page introuvable');
    }
  }
});
server.listen(port, '0.0.0.0', () =>
  console.log(
    `TchatzSafe · serveur statique prêt sur le port ${port} (0.0.0.0). Aucun backend d’analyse ou de signalement.`
  )
);
