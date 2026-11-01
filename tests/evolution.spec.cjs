const { test, expect } = require('@playwright/test');
const AxeBuilder = require('@axe-core/playwright').default;
const fs = require('node:fs');
const http = require('node:http');
const path = require('node:path');
const root = path.resolve(__dirname, '..');

async function startFixtureServer({ version = () => null, missing = null } = {}) {
  const mime = {
    '.html': 'text/html; charset=utf-8',
    '.js': 'text/javascript; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.svg': 'image/svg+xml',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.woff2': 'font/woff2',
    '.webmanifest': 'application/manifest+json',
  };
  const server = http.createServer((req, res) => {
    let pathname = new URL(req.url, 'http://localhost').pathname;
    if (pathname === '/') pathname = '/index.html';
    if (pathname === missing) {
      res.writeHead(404);
      return res.end('Ressource indisponible');
    }
    const number = version();
    if (pathname === '/sw.js' && number !== null) {
      const worker = fs
        .readFileSync(path.join(root, 'sw.js'), 'utf8')
        .replace(
          /const CACHE_NAME = "[^"]+";/,
          `const CACHE_NAME = "tchatzsafe-shell-test-${number}";`
        );
      res.writeHead(200, { 'Content-Type': 'text/javascript', 'Cache-Control': 'no-store' });
      return res.end(worker);
    }
    const file = path.resolve(root, '.' + pathname);
    if (!file.startsWith(root + path.sep) || !fs.existsSync(file) || !fs.statSync(file).isFile()) {
      res.writeHead(404);
      return res.end('Introuvable');
    }
    res.writeHead(200, {
      'Content-Type': mime[path.extname(file)] || 'application/octet-stream',
      'Cache-Control': 'no-store',
    });
    res.end(fs.readFileSync(file));
  });
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  return server;
}

async function waitForWorker(page) {
  await page.evaluate(() => navigator.serviceWorker.ready);
  await page.waitForFunction(() => Boolean(navigator.serviceWorker.controller));
}

async function finishQuiz(page, id) {
  const answers = await page.evaluate(
    (quizId) => QUIZZES[quizId].questions.map((q) => q.options[q.correct]),
    id
  );
  for (const answer of answers) {
    await page.locator('#quiz-root').getByRole('button', { name: answer, exact: true }).click();
    await page.locator('#quiz-root [data-next]').click();
  }
}

test('La reprise par chapitre, la navigation et l’historique des formations persistent', async ({
  page,
}) => {
  await page.goto('/apprendre.html?theme=mobile-money');
  await page.locator('.lesson-sidebar a[href="#pratiques"]').click();
  await expect
    .poll(() => page.evaluate(() => Progress.get().lessonPositions['mobile-money']?.section))
    .toBe('pratiques');
  await page.goto('/apprendre.html');
  await expect(page.locator('#resume-learning')).toContainText('mobile money', {
    ignoreCase: true,
  });
  await page.locator('#resume-learning a').click();
  await expect(page).toHaveURL(/theme=mobile-money#pratiques/);
  await expect(page.locator('#pratiques')).toBeInViewport();
  await page.goto('/apprendre.html?theme=mobile-money');
  await expect(page.locator('#pratiques')).toBeInViewport();
  await expect(page.locator('.lesson-pagination-link.next')).toBeVisible();
  await page.locator('#complete-lesson').click();
  await page.goto('/progression.html');
  await expect(page.locator('#lesson-history')).toContainText('Mobile Money');
  await expect(page.locator('#lesson-history')).toContainText('Étudiée le');
  await page.reload();
  await expect(page.locator('#lesson-history')).toContainText('Mobile Money');
});

test('Un fragment malformé ne bloque pas la formation ni la reprise', async ({ page }) => {
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto('/apprendre.html?theme=mobile-money#pratiques');
  await expect
    .poll(() => page.evaluate(() => Progress.get().lessonPositions['mobile-money']?.section))
    .toBe('pratiques');
  await page.goto('/apprendre.html?theme=mobile-money#%E0%A4%A');
  await expect(page.getByRole('heading', { name: 'Les bonnes pratiques' })).toBeInViewport();
  expect(errors).toEqual([]);
});

test('La position suit aussi le défilement manuel sur mobile', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/apprendre.html?theme=mobile-money');
  await page.waitForTimeout(400);
  await page.evaluate(() =>
    window.scrollTo({
      top: document.querySelector('#pratiques').getBoundingClientRect().top + window.scrollY - 110,
      behavior: 'instant',
    })
  );
  await expect
    .poll(() => page.evaluate(() => Progress.get().lessonPositions['mobile-money']?.section))
    .toBe('pratiques');
  await page.reload();
  await expect(page.locator('#pratiques')).toBeInViewport();
});

test('L’historique affiche chaque tentative de quiz, pas seulement le meilleur score', async ({
  page,
}) => {
  async function finish(correct) {
    await page.goto('/quiz.html?id=demo');
    const answers = await page.evaluate(
      (correct) =>
        QUIZZES.demo.questions.map((q) =>
          correct ? q.options[q.correct] : q.options.find((_, i) => i !== q.correct)
        ),
      correct
    );
    for (const answer of answers) {
      await page.locator('#quiz-root').getByRole('button', { name: answer, exact: true }).click();
      await page.locator('#quiz-root [data-next]').click();
    }
  }
  await finish(true);
  await finish(false);
  await page.goto('/progression.html');
  await expect(page.locator('#quiz-history .history-item')).toHaveCount(2);
  await expect(page.locator('#quiz-history')).toContainText('100 %');
  await expect(page.locator('#quiz-history')).toContainText('0 %');
  await expect(page.locator('.progress-stats')).toContainText('100 %');
});

test('Les signaux de confidentialité bloquent le chargement Analytics, même après un ancien accord', async ({
  browser,
}) => {
  for (const setting of ['globalPrivacyControl', 'doNotTrack']) {
    const context = await browser.newContext();
    await context.addInitScript((setting) => {
      localStorage.setItem('tchatzsafe_analytics_choice', 'accepted');
      Object.defineProperty(navigator, setting, {
        get: () => (setting === 'globalPrivacyControl' ? true : '1'),
        configurable: true,
      });
    }, setting);
    const page = await context.newPage();
    const requests = [];
    page.on('request', (request) => {
      if (request.url().includes('/_vercel/insights/')) requests.push(request.url());
    });
    await page.goto('/index.html');
    await page.locator('.footer-settings').click();
    await expect(page.locator('[data-analytics-accept]')).toBeDisabled();
    await expect(page.locator('#analytics-choice-status')).toContainText('désactivée');
    expect(requests).toEqual([]);
    await context.close();
  }
});

test('Manifest et installation : vrai prompt si disponible, instructions sinon, état installé', async ({
  page,
  request,
}) => {
  const response = await request.get('/manifest.webmanifest');
  expect(response.ok()).toBeTruthy();
  expect(response.headers()['content-type']).toContain('application/manifest+json');
  const manifest = await response.json();
  expect(manifest.name).toBe('TchatzSafe');
  expect(manifest.short_name).toBe('TchatzSafe');
  expect(manifest.display).toBe('standalone');
  expect(manifest.icons.map((icon) => icon.sizes)).toEqual(
    expect.arrayContaining(['192x192', '512x512'])
  );
  expect(manifest.icons.some((icon) => icon.purpose === 'maskable')).toBeTruthy();
  for (const icon of manifest.icons) expect((await request.get('/' + icon.src)).ok()).toBeTruthy();

  await page.goto('/index.html');
  await page.evaluate(() => {
    window.__promptCount = 0;
    const event = new Event('beforeinstallprompt', { cancelable: true });
    event.prompt = async () => {
      window.__promptCount += 1;
    };
    event.userChoice = Promise.resolve({ outcome: 'dismissed', platform: 'web' });
    window.dispatchEvent(event);
  });
  await page.locator('.footer-install').click();
  expect(await page.evaluate(() => window.__promptCount)).toBe(1);
  await page.locator('.footer-install').click();
  await expect(page.locator('#install-dialog')).toBeVisible();
  await expect(page.locator('#install-instructions')).toContainText('navigateur');
  await page.locator('[data-close-install]').click();
  await page.evaluate(() => window.dispatchEvent(new Event('appinstalled')));
  await expect(page.locator('.footer-install')).toBeDisabled();
  await expect(page.locator('.footer-install')).toContainText('installée');
});

test('La page hors ligne et la fenêtre d’installation passent les contrôles d’accessibilité automatisés', async ({
  page,
}) => {
  await page.goto('/hors-ligne.html');
  await expect(
    page.getByRole('heading', { name: /Cette page n’est pas disponible hors connexion/ })
  ).toBeVisible();
  const check = async () => {
    const result = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
      .analyze();
    expect(result.violations.map((v) => v.id)).toEqual([]);
  };
  await check();
  await page.locator('[data-install-app]').first().click();
  await expect(page.locator('#install-dialog')).toBeVisible();
  await check();
});

test('Le cache hors ligne sert les cours, quiz et la page de secours sans stocker les paramètres', async ({
  page,
  context,
}) => {
  await page.goto('/index.html');
  await waitForWorker(page);
  await page.goto('/apprendre.html?theme=mobile-money&secret=NE-PAS-CACHER');
  await expect(page.locator('#objectif')).toBeVisible();
  const cacheKeys = await page.evaluate(async () => {
    const all = await caches.keys();
    const names = await Promise.all(
      all.map(async (name) =>
        (await (await caches.open(name)).keys()).map((request) => request.url)
      )
    );
    return names.flat();
  });
  expect(cacheKeys.some((key) => key.includes('NE-PAS-CACHER') || key.includes('?'))).toBeFalsy();
  await context.setOffline(true);
  await page.goto('/apprendre.html?theme=mobile-money');
  await expect(page.locator('#offline-status')).toBeVisible();
  await expect(page.locator('#objectif')).toBeVisible();
  await page.locator('#complete-lesson').click();
  await page.goto('/quiz.html?id=debutant');
  await finishQuiz(page, 'debutant');
  await expect(page.locator('.results-score')).toHaveText('100 %');
  await page.goto('/progression.html');
  await expect(page.locator('#lesson-history')).toContainText('Mobile Money');
  await expect(page.locator('#quiz-history')).toContainText('100 %');
  await page.goto('/chemin/inexistant');
  await expect(page.locator('main h1')).toContainText('hors connexion');
  expect(
    await page.locator('link[href="css/refresh.css"]').evaluate((node) => Boolean(node.sheet))
  ).toBeTruthy();
  await context.setOffline(false);
});

test('Mesure d’audience : consentement, suppression des paramètres et retrait', async ({
  page,
}) => {
  let scripts = 0;
  await page.route('**/_vercel/insights/script.js', async (route) => {
    scripts++;
    // Double de test : vérifie la configuration beforeSend, sans envoyer d’événement à Vercel.
    await route.fulfill({
      contentType: 'application/javascript',
      body: "window.__beforeSend = [...(window.vaq || [])].find(x => x[0] === 'beforeSend')[1]; window.__pageEvent = window.__beforeSend({type:'pageview',url:location.href}); window.__referrer = document.referrer;",
    });
  });
  await page.goto('/analyser.html?secret=NE-PAS-TRANSMETTRE#token', {
    referer: 'https://provenance.example/chemin-prive?secret=REFERRER',
  });
  await expect(page.locator('#analytics-consent')).toBeVisible();
  expect(scripts).toBe(0);
  await page.locator('#suspect-input').fill('https://example.org/?token=CONTENU-PRIVE');
  await page.locator('[data-analytics-decline]').click();
  await page.reload();
  expect(scripts).toBe(0);
  await page.locator('.footer-settings').click();
  await page.locator('[data-analytics-accept]').click();
  await expect.poll(() => scripts).toBe(1);
  await page.waitForFunction(() => Boolean(window.__pageEvent));
  const event = await page.evaluate(() => window.__pageEvent);
  expect(event.url).toMatch(/\/analyser\.html$/);
  expect(JSON.stringify(event)).not.toContain('NE-PAS-TRANSMETTRE');
  expect(JSON.stringify(event)).not.toContain('CONTENU-PRIVE');
  expect(await page.evaluate(() => window.__referrer)).toBe('https://provenance.example/');
  expect(
    await page.evaluate(() =>
      TchatzAnalytics.sanitize({
        type: 'event',
        url: location.href,
        payload: { secret: 'PRIVATE' },
      })
    )
  ).toBeNull();
  await page.evaluate(() =>
    localStorage.setItem('__va_attribution', JSON.stringify({ userId: 'PRIVATE' }))
  );
  expect(
    await page.evaluate(() => TchatzAnalytics.sanitize({ type: 'pageview', url: location.href }))
  ).toBeNull();
  await page.evaluate(() => localStorage.removeItem('__va_attribution'));
  expect(
    await page.evaluate(() =>
      window.__beforeSend({ type: 'pageview', url: location.origin + '/inconnu/identifiant' })
    )
  ).toBeNull();
  await page.locator('.footer-settings').click();
  await page.locator('[data-analytics-decline]').click();
  expect(
    await page.evaluate(() => window.__beforeSend({ type: 'pageview', url: location.href }))
  ).toBeNull();
  await page.goto('/index.html');
  expect(scripts).toBe(1);
});

test('Aucun tableau ou endpoint de statistiques privé n’est exposé par le site statique', async ({
  page,
  request,
}) => {
  expect((await request.get('/api/stats')).status()).toBe(404);
  expect((await request.get('/admin.html')).status()).toBe(404);
  await page.goto('/index.html');
  await expect(page.getByRole('link', { name: /Statistiques · accès Vercel/ })).toHaveAttribute(
    'href',
    'https://vercel.com/dashboard'
  );
});

test('Un échec du précache avertit sans empêcher l’utilisation en ligne', async ({ browser }) => {
  const server = await startFixtureServer({ missing: '/assets/pwa/icon-512.png' });
  const context = await browser.newContext();
  try {
    const page = await context.newPage();
    await page.goto(`http://127.0.0.1:${server.address().port}/index.html`);
    await expect(page.locator('#pwa-error')).toBeVisible();
    await expect(page.locator('#hero-title')).toBeVisible();
    expect(await page.evaluate(() => Boolean(navigator.serviceWorker.controller))).toBe(false);
  } finally {
    await context.close();
    await new Promise((resolve) => server.close(resolve));
  }
});

test('Une nouvelle version du service worker attend une action avant son activation', async ({
  browser,
}) => {
  let version = 1;
  const server = await startFixtureServer({ version: () => version });
  const context = await browser.newContext();
  try {
    const page = await context.newPage();
    await page.goto(`http://127.0.0.1:${server.address().port}/index.html`);
    await waitForWorker(page);
    version = 2;
    await page.evaluate(async () => (await navigator.serviceWorker.ready).update());
    await expect(page.locator('#update-status')).toBeVisible();
    expect(
      await page.evaluate(async () => (await caches.keys()).some((name) => name.endsWith('test-1')))
    ).toBeTruthy();
    const loaded = page.waitForEvent('load');
    await page.locator('[data-update-app]').click();
    await loaded;
    await expect
      .poll(() =>
        page.evaluate(async () => (await caches.keys()).some((name) => name.endsWith('test-2')))
      )
      .toBeTruthy();
    await expect(page.locator('#update-status')).toBeHidden();
  } finally {
    await context.close();
    await new Promise((resolve) => server.close(resolve));
  }
});
