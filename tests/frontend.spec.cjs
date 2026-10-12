const { test, expect } = require('@playwright/test');
const AxeBuilder = require('@axe-core/playwright').default;
const fs = require('node:fs/promises');
const routes = [
  'index.html',
  'menaces.html',
  'apprendre.html',
  'quiz.html',
  'conseils.html',
  'glossaire.html',
  'progression.html',
  'analyser.html',
  'signaler.html',
  'moderation.html',
  'a-propos.html',
  'sources.html',
  'confidentialite.html',
  '404.html',
];
const detailed = [
  'apprendre.html?theme=phishing',
  'menaces.html?categorie=mobile-money',
  'quiz.html?id=debutant',
];
async function go(page, url) {
  await page.goto('/' + url, { waitUntil: 'networkidle' });
  await expect(page.locator('main')).toBeVisible();
}
async function noOverflow(page) {
  expect(
    await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)
  ).toBeTruthy();
}
async function finishQuiz(page, id, correct = true, container = '#quiz-root') {
  const questions = await page.evaluate(
    (id) =>
      QUIZZES[id].questions.map((q) => ({
        right: q.options[q.correct],
        wrong: q.options.find((_, i) => i !== q.correct),
      })),
    id
  );
  for (const q of questions) {
    await page
      .locator(container)
      .getByRole('button', { name: correct ? q.right : q.wrong, exact: true })
      .click();
    await expect(page.locator(container + ' .quiz-feedback')).toBeVisible();
    await page.locator(container + ' [data-next]').click();
  }
}
async function createDraft(page, value = 'https://demonstration.example/connexion') {
  await page.locator('#report-value').fill(value);
  await page.locator('#report-description').fill('Exemple fictif pour vérifier le parcours local.');
  await page.locator('#report-consent').check();
  await page.locator('#save-report').click();
  await expect(page.locator('#local-drafts .draft-card')).toHaveCount(1);
}
async function axe(page) {
  const result = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
    .analyze();
  expect(result.violations.map((v) => ({ id: v.id, nodes: v.nodes.map((n) => n.target) }))).toEqual(
    []
  );
}

for (const route of routes)
  test(`Route fonctionnelle : ${route}`, async ({ page }) => {
    const errors = [],
      missing = [];
    page.on('pageerror', (e) => errors.push(e.message));
    page.on('response', (r) => {
      if (r.status() >= 400) missing.push(r.url());
    });
    await go(page, route);
    await expect(page.locator('main h1:visible')).toHaveCount(1);
    expect(errors).toEqual([]);
    expect(missing).toEqual([]);
  });
for (const width of [320, 390, 768, 1024, 1440])
  test(`Responsive : toutes les pages à ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    for (const route of [...routes, ...detailed]) {
      await go(page, route);
      await noOverflow(page);
    }
  });

test('Les deux CTA demandés et les six catégories sont présents', async ({ page }) => {
  await go(page, 'index.html');
  await expect(page.locator('#hero-title')).toContainText('Les arnaques');
  await expect(page.locator('#hero-title')).toContainText('Votre vigilance aussi.');
  await expect(page.locator('.hero-actions a').first()).toHaveAttribute('href', 'analyser.html');
  await expect(page.locator('.hero-actions a').nth(1)).toHaveAttribute('href', 'apprendre.html');
  await expect(page.locator('#home-threats .threat-card')).toHaveCount(6);
  await expect(page.locator('#home-courses .course-card')).toHaveCount(3);
});
test('Le menu desktop n’affiche pas le bouton mobile', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await go(page, 'index.html');
  await expect(page.getByRole('button', { name: 'Ouvrir le menu' })).toBeHidden();
  await expect(page.locator('.nav-desktop')).toBeVisible();
});
test('Menu mobile : ouverture, focus piégé, fermeture Escape et retour au bouton', async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await go(page, 'index.html');
  const button = page.getByRole('button', { name: 'Ouvrir le menu' });
  await button.click();
  await expect(page.locator('#mobile-menu')).toBeVisible();
  await expect(button).toHaveAttribute('aria-expanded', 'true');
  for (let i = 0; i < 12; i++) {
    await page.keyboard.press('Tab');
    expect(
      await page.evaluate(() => Boolean(document.activeElement.closest('#mobile-menu')))
    ).toBeTruthy();
  }
  await page.keyboard.press('Escape');
  await expect(page.locator('#mobile-menu')).toBeHidden();
  await expect(button).toBeFocused();
  await expect(button).toHaveAttribute('aria-expanded', 'false');
});
test('Navigation clavier et lien d’évitement', async ({ page }) => {
  await go(page, 'index.html');
  await page.keyboard.press('Tab');
  await expect(page.locator('.skip-link')).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/#main$/);
});
test('Le thème clair/sombre historique reste fonctionnel et persistant', async ({ page }) => {
  await go(page, 'index.html');
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await page.locator('[data-theme-toggle]').click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  await page.reload({ waitUntil: 'networkidle' });
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  await page.locator('[data-theme-toggle]').click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
});
test('Les parcours et filtres de catégorie fonctionnent ensemble', async ({ page }) => {
  await go(page, 'apprendre.html');
  await page.locator('[data-level="avancé"]').click();
  await expect(page.locator('.course-card')).toHaveCount(2);
  await page.locator('[data-category="comptes"]').click();
  await expect(page.locator('.course-card')).toHaveCount(1);
  await expect(page.locator('.course-card')).toContainText('Réagir après une fraude');
  await page.locator('#lesson-search').fill('aucun-sujet-possible');
  await expect(page.locator('#lessons-grid')).toContainText('Aucune formation trouvée');
  await page.getByRole('button', { name: 'Réinitialiser les filtres' }).click();
  await expect(page.locator('.course-card')).toHaveCount(17);
  await page.locator('#lesson-search').fill('verification');
  await expect(page.locator('.course-card')).toHaveCount(0);
  await page.locator('#lesson-search').fill('adresse');
  await expect(page.locator('.course-card')).toHaveCount(1);
});
test('Étudier une leçon conserve la progression après rechargement', async ({ page }) => {
  await go(page, 'apprendre.html?theme=phishing');
  await expect(page.locator('#exemple')).toContainText('EXEMPLE FICTIF');
  await page.locator('#complete-lesson').click();
  await expect(page.locator('#lesson-saved')).toContainText('+10 XP');
  await page.reload({ waitUntil: 'networkidle' });
  await expect(page.locator('#complete-lesson')).toBeDisabled();
  await go(page, 'progression.html');
  await expect(page.locator('.dash-level-xp')).toContainText('10 / 30 XP');
  await expect(page.locator('.badge-item.earned')).toHaveCount(1);
});
for (const id of [
  'fausses-offres-emploi',
  'investissements',
  'telephone-applications',
  'wifi-public',
  'emails-suspects',
])
  test(`Le quiz auparavant absent fonctionne : ${id}`, async ({ page }) => {
    await go(page, 'apprendre.html?theme=' + id);
    await page
      .locator('#validation')
      .getByRole('link', { name: 'Faire le quiz', exact: true })
      .click();
    await expect(page).toHaveURL(new RegExp('quiz.html\\?id=' + id));
    await expect(page.locator('.quiz-option')).toHaveCount(3);
  });
test('Quiz complet : correction, score, sauvegarde et meilleur score', async ({ page }) => {
  await go(page, 'quiz.html?id=debutant');
  await finishQuiz(page, 'debutant');
  await expect(page.locator('.results-score')).toHaveText('100 %');
  expect(await page.evaluate(() => Progress.get().xp)).toBe(25);
  await page.reload({ waitUntil: 'networkidle' });
  await finishQuiz(page, 'debutant', false);
  await expect(page.locator('.results-score')).toHaveText('0 %');
  expect(await page.evaluate(() => Progress.getQuizBestScore('debutant'))).toBe(100);
  expect(await page.evaluate(() => Progress.get().xp)).toBe(25);
});
test('Le quiz de démonstration de l’accueil est vraiment interactif', async ({ page }) => {
  await go(page, 'index.html');
  await finishQuiz(page, 'demo', true, '#home-quiz-root');
  await expect(page.locator('#home-quiz-root .results-score')).toHaveText('100 %');
  expect(await page.evaluate(() => Progress.get().quizzesCompleted.demo.total)).toBe(3);
});
test('Les identifiants de cours et quiz inconnus produisent un état explicite', async ({
  page,
}) => {
  await go(page, 'apprendre.html?theme=<script>');
  await expect(page.locator('main h1:visible')).toHaveText('Formation introuvable');
  await go(page, 'quiz.html?id=introuvable');
  await expect(page.locator('main')).toContainText('Quiz introuvable');
  await go(page, 'menaces.html?categorie=introuvable');
  await expect(page.locator('main h1:visible')).toHaveText('Fiche introuvable');
});
test('Les six fiches sont complètes et restent accessibles en lien profond', async ({ page }) => {
  for (const id of [
    'mobile-money',
    'faux-emplois',
    'phishing',
    'investissements',
    'faux-comptes',
    'liens-suspects',
  ]) {
    await go(page, 'menaces.html?categorie=' + id);
    for (const section of ['mecanisme', 'exemple', 'alertes', 'precautions', 'reagir', 'sources'])
      await expect(page.locator('#' + section)).toBeVisible();
    await expect(page.locator('#exemple')).toContainText('EXEMPLE FICTIF');
  }
});
test('Recherche de menaces et état vide', async ({ page }) => {
  await go(page, 'menaces.html');
  await page.locator('#threat-search').fill('emploi');
  await expect(page.locator('.threat-card')).toHaveCount(1);
  await page.locator('#threat-search').fill('inconnu-à-tout');
  await expect(page.locator('#threats-grid')).toContainText('Aucune fiche trouvée');
  await page.locator('#threat-search').fill('');
  await page.locator('[data-threat-filter="mobile-money"]').click();
  await expect(page.locator('.threat-card')).toHaveCount(1);
});
test('L’analyseur valide, calcule des indices et n’ouvre aucune URL saisie', async ({ page }) => {
  const external = [];
  page.on('request', (r) => {
    if (/^https?:/.test(r.url()) && !r.url().includes('127.0.0.1:')) external.push(r.url());
  });
  await go(page, 'analyser.html');
  await page.locator('#analyzer-submit').click();
  await expect(page.locator('#analyzer-error')).toContainText('Renseignez');
  await page.locator('#suspect-input').fill('javascript:alert(1)');
  await page.locator('#analyzer-submit').click();
  await expect(page.locator('#analyzer-error')).toContainText('adresse complète');
  await page
    .locator('#suspect-input')
    .fill('http://banque.example@verification.example/connexion?token=secret-prive');
  await page.locator('#analyzer-submit').click();
  await expect(page.locator('#analysis-result .indicator')).toHaveCount(3);
  await expect(page.locator('#analysis-result')).toContainText('Risque réel non déterminable');
  await expect(page.locator('#analysis-result')).not.toContainText('secret-prive');
  expect(external).toEqual([]);
  expect(await page.evaluate(() => JSON.stringify({ ...localStorage }))).not.toContain(
    'secret-prive'
  );
  await page.locator('#clear-analysis').click();
  await expect(page.locator('#suspect-input')).toHaveValue('');
  await expect(page.locator('#analysis-result')).toBeHidden();
});
test('Aucun indice ne signifie jamais « lien sûr »', async ({ page }) => {
  await go(page, 'analyser.html');
  await page.locator('#suspect-input').fill('https://example.org');
  await page.locator('#analyzer-submit').click();
  await expect(page.locator('#analysis-result')).toContainText(
    'Aucun indicateur de ces règles détecté'
  );
  await expect(page.locator('#analysis-result')).toContainText('jamais une garantie de sûreté');
  await expect(page.locator('#analysis-result .indicator')).toHaveCount(0);
});
test('Messages et numéros : explications adaptées, aucun risque inventé', async ({ page }) => {
  await go(page, 'analyser.html');
  await page.locator('[data-analysis-kind="message"]').click();
  await page.locator('#load-example').click();
  await page.locator('#analyzer-submit').click();
  await expect(page.locator('#analysis-result')).toContainText('Demande de code');
  await page.locator('[data-analysis-kind="phone"]').click();
  await page.locator('#suspect-input').fill('numéro invalide');
  await page.locator('#analyzer-submit').click();
  await expect(page.locator('#analyzer-error')).toContainText('format international');
  await page.locator('#load-example').click();
  await page.locator('#analyzer-submit').click();
  await expect(page.locator('#analysis-result')).toContainText('réputation inconnue');
  await expect(page.locator('#analysis-result .indicator')).toHaveCount(0);
});
test('Un hôte très long ne casse pas l’affichage mobile du résultat', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 900 });
  await go(page, 'analyser.html');
  await page
    .locator('#suspect-input')
    .fill('https://' + ('a'.repeat(60) + '.').repeat(3) + 'example.org/path');
  await page.locator('#analyzer-submit').click();
  await expect(page.locator('#analysis-result')).toBeVisible();
  await noOverflow(page);
});
test('Signalement : validation et consentement requis, aucun envoi réseau', async ({ page }) => {
  const external = [];
  page.on('request', (r) => {
    if (/^https?:/.test(r.url()) && !r.url().includes('127.0.0.1:')) external.push(r.url());
  });
  await go(page, 'signaler.html');
  await page.locator('#save-report').click();
  await expect(page.locator('#report-error')).toContainText('Renseignez');
  await page.locator('#report-value').fill('https://demonstration.example');
  await page.locator('#save-report').click();
  await expect(page.locator('#report-error')).toContainText('accord');
  expect(await page.evaluate(() => ReportRepository.list().length)).toBe(0);
  await createDraft(page);
  await expect(page.locator('#report-feedback')).toContainText('Aucun envoi réel');
  await expect(page.locator('.draft-card')).toContainText('non transmis');
  expect(external).toEqual([]);
});
test('Un message HTML malveillant reste du texte, jamais un script', async ({ page }) => {
  await go(page, 'signaler.html');
  await page.locator('#report-kind').selectOption('message');
  await page
    .locator('#report-value')
    .fill('<img src=x onerror="window.__injected=true"> Message fictif');
  await page.locator('#report-consent').check();
  await page.locator('#save-report').click();
  await expect(page.locator('.draft-value')).toContainText('<img src=x');
  expect(await page.evaluate(() => window.__injected)).toBeUndefined();
  await expect(page.locator('.draft-value img')).toHaveCount(0);
});
test('Preuves SVG, fausses images et trop grands fichiers sont rejetés', async ({ page }) => {
  await go(page, 'signaler.html');
  await page.locator('#report-proof').setInputFiles({
    name: 'preuve.svg',
    mimeType: 'image/svg+xml',
    buffer: Buffer.from('<svg xmlns="http://www.w3.org/2000/svg"/>'),
  });
  await expect(page.locator('#proof-error')).toContainText('PNG, JPEG ou WebP');
  await page
    .locator('#report-proof')
    .setInputFiles({ name: 'faux.png', mimeType: 'image/png', buffer: Buffer.from('not-a-png') });
  await expect(page.locator('#proof-error')).toContainText('signature');
  await page.locator('#report-proof').setInputFiles({
    name: 'grand.png',
    mimeType: 'image/png',
    buffer: Buffer.alloc(5 * 1024 * 1024 + 1),
  });
  await expect(page.locator('#proof-error')).toContainText('5 Mo');
  await expect(page.locator('#proof-preview')).toBeHidden();
});
test('La preuve valide est prévisualisée mais seuls type et taille sont conservés', async ({
  page,
}) => {
  await go(page, 'signaler.html');
  await page.locator('#report-proof').setInputFiles('tests/fixtures/preuve-demo.png');
  await expect(page.locator('#proof-preview')).toBeVisible();
  await createDraft(page);
  const proof = await page.evaluate(() => ReportRepository.list()[0].proof);
  expect(proof.type).toBe('image/png');
  expect(Object.keys(proof).sort()).toEqual(['size', 'type']);
  await expect(page.locator('#proof-preview')).toBeHidden();
});
test('La simulation de modération n’affiche que les brouillons de cet appareil', async ({
  page,
}) => {
  await go(page, 'moderation.html');
  await expect(page.locator('#local-drafts')).toContainText('Aucun brouillon');
  await go(page, 'signaler.html');
  await createDraft(page);
  await go(page, 'moderation.html');
  await expect(page.locator('#moderation-count')).toContainText('1 brouillon');
  await page.locator('.draft-actions select').selectOption('review');
  await page.locator('[data-save-status]').click();
  await expect(page.locator('.draft-card .tag')).toContainText('Revue simulée');
  await expect(page.locator('#report-feedback')).toContainText('Aucun fait vérifié');
  await page.locator('[data-delete-draft]').click();
  await expect(page.locator('#delete-draft-dialog')).toBeVisible();
  await page.locator('#confirm-delete-draft').click();
  await expect(page.locator('#local-drafts')).toContainText('Aucun brouillon');
});
test('Les contrôles anti-abus locaux bloquent le champ piège', async ({ page }) => {
  await go(page, 'signaler.html');
  await page.locator('#report-value').fill('https://example.org');
  await page.locator('#report-consent').check();
  await page.evaluate(() => (document.getElementById('report-website').value = 'bot'));
  await page.locator('#save-report').click();
  await expect(page.locator('#report-error')).toContainText('champ de contrôle');
  expect(await page.evaluate(() => ReportRepository.list().length)).toBe(0);
});
test('Suppression des brouillons depuis la confidentialité sans perdre la progression', async ({
  page,
}) => {
  await go(page, 'apprendre.html?theme=phishing');
  await page.locator('#complete-lesson').click();
  await go(page, 'signaler.html');
  await createDraft(page);
  await go(page, 'confidentialite.html');
  await page.locator('#clear-private-drafts').click();
  await page.locator('#confirm-private-clear').click();
  await expect(page.locator('#privacy-message')).toContainText('supprimés');
  await go(page, 'progression.html');
  await expect(page.locator('.dash-level-xp')).toContainText('10 / 30 XP');
});
test('Export de progression réel et import validé avec confirmation', async ({ page }) => {
  await go(page, 'progression.html');
  const downloadPromise = page.waitForEvent('download');
  await page.locator('#export-progress').click();
  const download = await downloadPromise;
  const data = JSON.parse(await fs.readFile(await download.path(), 'utf8'));
  expect(data.format).toBe('tchatzsafe-progress');
  expect(data.version).toBe(2);
  const imported = {
    format: 'tchatzsafe-progress',
    version: 2,
    progress: { lessonsCompleted: ['phishing'], quizzesCompleted: {}, bestScores: {} },
  };
  await page.locator('#import-progress').setInputFiles({
    name: 'progression.json',
    mimeType: 'application/json',
    buffer: Buffer.from(JSON.stringify(imported)),
  });
  await expect(page.locator('#import-dialog')).toBeVisible();
  expect(await page.evaluate(() => Progress.get().xp)).toBe(0);
  await page.locator('#confirm-import').click();
  await expect(page.locator('.dash-level-xp')).toContainText('10 / 30 XP');
  await expect(page.locator('#progress-message')).toContainText('importée');
});
test('Un import invalide ne détruit pas la progression', async ({ page }) => {
  await go(page, 'apprendre.html?theme=phishing');
  await page.locator('#complete-lesson').click();
  await go(page, 'progression.html');
  await page.locator('#import-progress').setInputFiles({
    name: 'corrompu.json',
    mimeType: 'application/json',
    buffer: Buffer.from('{invalid-json'),
  });
  await expect(page.locator('#progress-message')).toContainText('illisible');
  await expect(page.locator('.dash-level-xp')).toContainText('10 / 30 XP');
});
test('Réinitialisation confirmée et annulable', async ({ page }) => {
  await go(page, 'apprendre.html?theme=phishing');
  await page.locator('#complete-lesson').click();
  await go(page, 'progression.html');
  await page.locator('#reset-progress').click();
  await page.keyboard.press('Escape');
  await expect(page.locator('.dash-level-xp')).toContainText('10 / 30 XP');
  await page.locator('#reset-progress').click();
  await page.locator('#confirm-reset').click();
  await expect(page.locator('.dash-level-xp')).toContainText('0 / 30 XP');
});
test('Le stockage bloqué est géré sans crash et expliqué visiblement', async ({ page }) => {
  await page.addInitScript(() => {
    Storage.prototype.getItem = function () {
      throw new Error('blocked');
    };
    Storage.prototype.setItem = function () {
      throw new Error('blocked');
    };
  });
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await go(page, 'apprendre.html?theme=phishing');
  await expect(page.locator('#storage-banner')).toBeVisible();
  await page.locator('#complete-lesson').click();
  await expect(page.locator('#lesson-saved')).toContainText('session');
  expect(errors).toEqual([]);
});
test('Glossaire : recherche avec accents et état vide', async ({ page }) => {
  await go(page, 'glossaire.html');
  await expect(page.locator('.glossary-item')).toHaveCount(13);
  await page.locator('#glossary-search').fill('donnee');
  await expect(page.locator('.glossary-item')).not.toHaveCount(0);
  await page.locator('#glossary-search').fill('terme-impossible');
  await expect(page.locator('#glossary-list')).toContainText('Aucun mot trouvé');
});
test('Les conseils historiques conservent les dépliants et les liens profonds', async ({
  page,
}) => {
  await go(page, 'conseils.html');
  await expect(page.locator('.tip-card')).toHaveCount(6);
  await page.locator('.tip-more').first().click();
  await expect(page.locator('#infos')).toBeVisible();
  await page.locator('#infos summary').click();
  await expect(page.locator('#infos')).toHaveAttribute('open', '');
  await go(page, 'conseils.html#infos');
  await expect(page.locator('#infos')).toBeVisible();
  await expect(page.locator('#infos')).toHaveAttribute('open', '');
});
test('La réduction des animations est respectée', async ({ browser }) => {
  const context = await browser.newContext({ reducedMotion: 'reduce' });
  const page = await context.newPage();
  await page.goto(
    (test.info().project.use.baseURL || process.env.TEST_BASE_URL || 'http://127.0.0.1:4173') +
      '/index.html',
    { waitUntil: 'networkidle' }
  );
  expect(await page.locator('html').evaluate((el) => getComputedStyle(el).scrollBehavior)).toBe(
    'auto'
  );
  expect(
    await page
      .locator('.card-link')
      .first()
      .evaluate((el) => getComputedStyle(el).transitionDuration)
  ).toBe('0s');
  await context.close();
});
test('Aucun backend n’est simulé par le serveur statique', async ({ request }) => {
  const response = await request.post('/api/reports', { data: { test: 'fixture' } });
  expect(response.status()).toBe(404);
  const hidden = await request.get('/.git/HEAD');
  expect(hidden.status()).toBe(404);
});

test.describe('Accessibilité automatisée WCAG 2.1 AA', () => {
  test.use({ bypassCSP: true });
  for (const theme of ['dark', 'light'])
    for (const route of [...routes.filter((r) => r !== '404.html'), ...detailed])
      test(`${theme} : ${route}`, async ({ page }) => {
        await page.addInitScript((theme) => {
          try {
            localStorage.setItem('tchatzsafe_theme', theme);
          } catch (_) {}
        }, theme);
        await go(page, route);
        await axe(page);
      });
  test('Mobile : menu, analyse avec résultat et modération avec brouillon', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await go(page, 'index.html');
    await page.getByRole('button', { name: 'Ouvrir le menu' }).click();
    await axe(page);
    await page.keyboard.press('Escape');
    await go(page, 'analyser.html');
    await page.locator('#load-example').click();
    await page.locator('#analyzer-submit').click();
    await axe(page);
    await go(page, 'signaler.html');
    await createDraft(page);
    await go(page, 'moderation.html');
    await axe(page);
    await noOverflow(page);
  });
  test('Les états réponse, résultat du quiz et modal d’import sont accessibles', async ({
    page,
  }) => {
    await go(page, 'quiz.html?id=debutant');
    await finishQuiz(page, 'debutant');
    await axe(page);
    await go(page, 'progression.html');
    await page.locator('#reset-progress').click();
    await axe(page);
  });
});

test('Une preuve peut être retirée sans perdre le texte du formulaire', async ({ page }) => {
  await go(page, 'signaler.html');
  await page.locator('#report-value').fill('https://example.org');
  await page.locator('#report-description').fill('Description conservée.');
  await page
    .locator('#report-proof')
    .setInputFiles({ name: 'faux.png', mimeType: 'image/png', buffer: Buffer.from('not-a-png') });
  await expect(page.locator('#proof-error')).toContainText('signature');
  await page.locator('#remove-proof').click();
  await expect(page.locator('#report-value')).toHaveValue('https://example.org');
  await expect(page.locator('#report-description')).toHaveValue('Description conservée.');
  await expect(page.locator('#proof-error')).toHaveText('');
});

test('Le chargement partiel d’un script produit un avertissement explicite', async ({ page }) => {
  await page.route('**/js/data/curriculum.js', (route) => route.abort());
  await go(page, 'apprendre.html');
  await expect(page.locator('#app-error-banner')).toBeVisible();
  await expect(page.locator('#app-error-banner')).toContainText('n’a pas pu être chargé');
});

test('Quota de stockage : la progression récente est exportable directement depuis le cours', async ({
  page,
}) => {
  await page.addInitScript(() => {
    const set = Storage.prototype.setItem;
    Storage.prototype.setItem = function (key, value) {
      if (key === 'tchatzsafe_progress') throw new DOMException('quota', 'QuotaExceededError');
      return set.call(this, key, value);
    };
  });
  await go(page, 'apprendre.html?theme=phishing');
  await page.locator('#complete-lesson').click();
  await expect(page.locator('#storage-banner')).toContainText('seront perdues');
  const downloadEvent = page.waitForEvent('download');
  await page.locator('[data-export-session]').click();
  const download = await downloadEvent;
  const value = JSON.parse(await fs.readFile(await download.path(), 'utf8'));
  expect(value.progress.lessonsCompleted).toContain('phishing');
  expect(value.progress.xp).toBe(10);
  expect(value).not.toHaveProperty('reports');
});
