/* Généré par tools/build-sw.mjs. Ne met jamais en cache les formulaires ou les statistiques. */
const CACHE_NAME = __CACHE_NAME__;
const ASSETS = __ASSETS__;
const ROOT = new URL(self.registration.scope);
const URLS = new Set(ASSETS.map((asset) => new URL(asset, ROOT).href));
const OFFLINE = new URL('hors-ligne.html', ROOT).href;

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll([...URLS])));
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      const names = await caches.keys();
      await Promise.all(
        names
          .filter((name) => name.startsWith('tchatzsafe-shell-') && name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
      await self.clients.claim();
    })()
  );
});

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') self.skipWaiting();
});

async function networkWithTimeout(request) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 5000);
  try {
    return await fetch(request, { signal: controller.signal });
  } finally {
    clearTimeout(timeout);
  }
}

self.addEventListener('fetch', (event) => {
  const request = event.request;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  // Ni service extérieur, ni mesures d’audience, ni API dans le cache.
  if (
    url.origin !== ROOT.origin ||
    !url.pathname.startsWith(ROOT.pathname) ||
    url.pathname.includes('/_vercel/') ||
    url.pathname.includes('/api/')
  )
    return;
  const key = new URL(url.pathname, ROOT.origin);
  if (key.pathname === ROOT.pathname) key.pathname += 'index.html';
  const allowed = URLS.has(key.href);
  if (!allowed && request.mode !== 'navigate') return;
  event.respondWith(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      try {
        const response = await networkWithTimeout(request);
        if (allowed && response.ok && response.type === 'basic') {
          // La clé ne contient jamais la recherche, le fragment ou le contenu d’un formulaire.
          await cache.put(key.href, response.clone()).catch(() => {});
        }
        return response;
      } catch (_) {
        const saved = allowed && (await cache.match(key.href));
        if (saved) return saved;
        if (request.mode === 'navigate') return (await cache.match(OFFLINE)) || Response.error();
        return new Response('Ressource indisponible hors connexion.', {
          status: 503,
          headers: { 'Content-Type': 'text/plain; charset=utf-8' },
        });
      }
    })()
  );
});
