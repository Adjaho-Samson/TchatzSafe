/* Généré par tools/build-sw.mjs. Ne met jamais en cache les formulaires ou les statistiques. */
const CACHE_NAME = "tchatzsafe-shell-7ead34285bb0cb8b";
const ASSETS = ["404.html","a-propos.html","analyser.html","apprendre.html","assets/favicon/favicon.svg","assets/fonts/ibm-plex-mono.woff2","assets/fonts/manrope.woff2","assets/icons.svg","assets/illustrations/hero-vigilance.jpg","assets/illustrations/vigilance.svg","assets/pwa/apple-touch-icon.png","assets/pwa/icon-192.png","assets/pwa/icon-512.png","assets/pwa/icon-maskable-512.png","assets/pwa/maskable-source.svg","confidentialite.html","conseils.html","css/components.css","css/refresh.css","css/reset.css","css/responsive.css","css/style.css","css/variables.css","glossaire.html","hors-ligne.html","index.html","js/analytics.js","js/components.js","js/data/curriculum.js","js/data/glossary.js","js/data/lessons.js","js/data/quizzes.js","js/data/sources.js","js/data/threats.js","js/glossary.js","js/main.js","js/pages/advice.js","js/pages/analyzer.js","js/pages/home.js","js/pages/learning.js","js/pages/privacy.js","js/pages/progression.js","js/pages/quizzes.js","js/pages/reports.js","js/pages/sources.js","js/pages/threats.js","js/progress.js","js/pwa.js","js/quiz.js","js/services/reports-repository.js","js/services/storage.js","js/services/threat-rules.js","js/theme-init.js","manifest.webmanifest","menaces.html","moderation.html","progression.html","quiz.html","signaler.html","sources.html"];
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
