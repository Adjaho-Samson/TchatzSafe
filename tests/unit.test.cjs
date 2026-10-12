const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { webcrypto } = require('node:crypto');
const root = path.resolve(__dirname, '..');
function fixture({ blocked = false, initial = {} } = {}) {
  const data = new Map(Object.entries(initial)),
    events = [];
  const window = {
    crypto: webcrypto,
    CustomEvent: class {
      constructor(name, options) {
        this.type = name;
        this.detail = options.detail;
      }
    },
    dispatchEvent: (event) => events.push(event),
    localStorage: {
      getItem: (key) => {
        if (blocked) throw new Error('blocked');
        return data.get(key) ?? null;
      },
      setItem: (key, value) => {
        if (blocked) throw new Error('blocked');
        data.set(key, String(value));
      },
      removeItem: (key) => {
        if (blocked) throw new Error('blocked');
        data.delete(key);
      },
    },
  };
  const context = vm.createContext({ window, console, URL, Date, setTimeout });
  const load = (file) =>
    vm.runInContext(fs.readFileSync(path.join(root, file), 'utf8'), context, { filename: file });
  for (const file of [
    'js/services/storage.js',
    'js/data/sources.js',
    'js/data/lessons.js',
    'js/data/quizzes.js',
    'js/data/curriculum.js',
    'js/data/threats.js',
    'js/progress.js',
    'js/services/threat-rules.js',
    'js/services/reports-repository.js',
  ])
    load(file);
  return { w: window, context, data, events };
}
const plain = (value) => JSON.parse(JSON.stringify(value));

test('Les 15 formations et 12 quiz historiques sont conservés', () => {
  const { w } = fixture();
  const lessonIds = [
    'phishing',
    'liens-suspects',
    'mots-de-passe',
    'vol-de-compte',
    'whatsapp',
    'mobile-money',
    'reseaux-sociaux',
    'donnees-personnelles',
    'arnaques-en-ligne',
    'faux-concours',
    'fausses-offres-emploi',
    'investissements',
    'telephone-applications',
    'wifi-public',
    'emails-suspects',
  ];
  lessonIds.forEach((id) =>
    assert(
      w.LESSONS.some((l) => l.id === id),
      id
    )
  );
  const quizzes = [
    'phishing',
    'liens-suspects',
    'mots-de-passe',
    'vol-de-compte',
    'whatsapp',
    'mobile-money',
    'reseaux-sociaux',
    'donnees-personnelles',
    'arnaques-en-ligne',
    'faux-concours',
    'debutant',
    'rapide',
  ];
  quizzes.forEach((id) => assert(w.QUIZZES[id], id));
  assert.equal(w.LESSONS.length, 17);
  assert.equal(Object.keys(w.QUIZZES).length, 20);
  assert.equal(w.THREATS.length, 6);
});
test('Tous les cours ont objectif, exemple, alertes, pratiques, résumé, sources et quiz', () => {
  const { w } = fixture();
  for (const l of w.LESSONS) {
    assert(l.objective.length > 10);
    assert(l.content.situation.length > 10);
    assert(l.content.explanation.length > 10);
    assert(l.warningSigns.length >= 3);
    assert(l.content.points.length >= 3);
    assert(l.summary.length > 10);
    assert(l.content.sources.length >= 1);
    assert(w.QUIZZES[l.id]);
    assert.equal(w.QUIZZES[l.id].level, l.level);
    l.content.sources.forEach((s) => assert(s.url.startsWith('https://')));
  }
  assert.deepEqual(
    [...new Set(w.LESSONS.map((l) => l.level))].sort(),
    ['avancé', 'débutant', 'intermédiaire'].sort()
  );
});
test('Tous les quiz contiennent des réponses et corrections cohérentes', () => {
  const { w } = fixture();
  for (const quiz of Object.values(w.QUIZZES)) {
    assert(quiz.questions.length >= 3);
    for (const q of quiz.questions) {
      assert(q.options.length >= 2);
      assert(Number.isInteger(q.correct) && q.correct >= 0 && q.correct < q.options.length);
      assert(q.explanation.length > 10);
    }
  }
});
test('Les six fiches sont pédagogiques et sourcées', () => {
  const { w } = fixture();
  for (const t of w.THREATS) {
    assert(
      t.mechanism &&
        t.example &&
        t.warnings.length &&
        t.precautions.length &&
        t.response.length &&
        t.sources.length
    );
    assert(w.LESSONS.some((l) => l.id === t.lesson));
    assert(!Object.hasOwn(t, 'reputation'));
  }
});
test('Les URL dangereuses pour le navigateur et mal formées sont rejetées', () => {
  const { w } = fixture();
  for (const value of [
    '',
    'javascript:alert(1)',
    'data:text/html,test',
    'file:///etc/passwd',
    'example.org',
    'https://ex ample.org',
    'https://<script>.example',
    'https://a..example',
    'https://example.org/' + 'a'.repeat(2048),
  ])
    assert.equal(w.ThreatRules.validate('link', value).valid, false, value);
  assert(w.ThreatRules.validate('link', 'https://example.org').valid);
});
test('Un lien sans observation n’est jamais déclaré sûr et ne reçoit aucun risque', () => {
  const { w } = fixture();
  const result = w.ThreatRules.analyze('link', 'https://example.org');
  assert.equal(result.observations.length, 0);
  assert.equal(result.risk, null);
  assert.equal(result.canDetermineSafety, false);
  assert.equal(result.mode, 'local-demo');
});
test('Les observations sont calculées depuis la syntaxe réelle sans exposer les secrets', () => {
  const { w } = fixture();
  const result = w.ThreatRules.analyze(
    'link',
    'http://banque.example@verification.example/connexion?token=private-secret-123'
  );
  assert.equal(result.host, 'verification.example');
  assert.deepEqual(Array.from(result.observations.map((o) => o.id)), [
    'http',
    'userinfo',
    'sensitive-query',
  ]);
  assert(!JSON.stringify(result).includes('private-secret-123'));
});
test('Raccourcisseurs, punycode, IP et ports sont décrits sans verdict', () => {
  const { w } = fixture();
  for (const [url, id] of [
    ['https://bit.ly/abc', 'shortener'],
    ['https://xn--pple-43d.example/', 'punycode'],
    ['http://192.0.2.1:8080/', 'ip'],
    ['http://192.0.2.1:8080/', 'port'],
  ]) {
    const r = w.ThreatRules.analyze('link', url);
    assert(r.observations.some((o) => o.id === id));
    assert.equal(r.risk, null);
  }
});
test('Messages : urgence, demande de PIN et frais sont des observations explicables', () => {
  const { w } = fixture();
  const r = w.ThreatRules.analyze(
    'message',
    'URGENT : envoyez votre code PIN pour éviter le blocage. Payez les frais de dossier.'
  );
  for (const id of ['urgency', 'secret', 'advance-fee'])
    assert(r.observations.some((o) => o.id === id));
  assert.equal(r.risk, null);
});
test('Une consigne de ne pas partager son code n’est pas classée comme une demande de secret', () => {
  const { w } = fixture();
  const r = w.ThreatRules.analyze(
    'message',
    'Ne partagez jamais votre code PIN avec un interlocuteur.'
  );
  assert(!r.observations.some((o) => o.id === 'secret'));
});
test('La longueur d’un message est validée', () => {
  const { w } = fixture();
  assert.equal(w.ThreatRules.validate('message', 'court').valid, false);
  assert.equal(w.ThreatRules.validate('message', 'a'.repeat(4001)).valid, false);
  assert.equal(w.ThreatRules.validate('message', 'Bonjour, un message fictif.').valid, true);
});
test('Les numéros internationaux sont normalisés, jamais attribués à un titulaire', () => {
  const { w } = fixture();
  assert.equal(w.ThreatRules.validate('phone', '+229 01 00 00 00 00').value, '+2290100000000');
  for (const p of ['0100000000', '+0 12345678', '+229abc', '+999123', '+1234567890123456'])
    assert.equal(w.ThreatRules.validate('phone', p).valid, false, p);
  const r = w.ThreatRules.analyze('phone', '+999 123 456 789');
  assert.equal(r.observations.length, 0);
  assert.equal(r.risk, null);
  assert(!Object.hasOwn(r, 'owner'));
});
test('Aucun fetch, XMLHttpRequest ou sendBeacon n’existe dans les règles locales', () => {
  const content = fs.readFileSync(path.join(root, 'js/services/threat-rules.js'), 'utf8');
  assert(!/\bfetch\s*\(|XMLHttpRequest|sendBeacon/.test(content));
});
test('Migration des données V1 : résultats, meilleur score nul et leçons conservés', () => {
  const legacy = {
    lessonsCompleted: ['phishing'],
    quizzesCompleted: {
      debutant: { score: 0, total: 5, percent: 0, completedAt: '2026-10-01T12:00:00.000Z' },
    },
    bestScores: { debutant: 0 },
    badges: ['premiers-reflexes'],
    xp: 25,
    notionsLearned: ['Vérifier avant de cliquer'],
    lastUpdated: '2026-10-01T12:00:00.000Z',
  };
  const { w } = fixture({ initial: { tchatzsafe_progress: JSON.stringify(legacy) } });
  const p = w.Progress.get();
  assert.deepEqual(Array.from(p.lessonsCompleted), ['phishing']);
  assert.equal(w.Progress.getQuizBestScore('debutant'), 0);
  assert.equal(p.quizzesCompleted.debutant.score, 0);
  assert.equal(p.xp, 25);
  assert(p.badges.includes('premiers-reflexes'));
});
test('Le bonus de 80 % est attribué une seule fois après amélioration du score', () => {
  const { w } = fixture();
  w.Progress.saveQuizResult('debutant', 0, 5, []);
  assert.equal(w.Progress.get().xp, 15);
  w.Progress.saveQuizResult('debutant', 4, 5, []);
  assert.equal(w.Progress.get().xp, 25);
  w.Progress.saveQuizResult('debutant', 5, 5, []);
  assert.equal(w.Progress.get().xp, 25);
  w.Progress.saveQuizResult('debutant', 1, 5, []);
  assert.equal(w.Progress.get().xp, 25);
  assert.equal(w.Progress.getQuizBestScore('debutant'), 100);
});
test('Étudier deux fois la même leçon ne cumule pas les XP', () => {
  const { w } = fixture();
  w.Progress.markLessonCompleted('phishing');
  w.Progress.markLessonCompleted('phishing');
  assert.equal(w.Progress.get().xp, 10);
  assert.equal(w.Progress.get().lessonsCompleted.length, 1);
  assert.throws(() => w.Progress.markLessonCompleted('inconnu'));
});
test('La progression générale est bornée à 100 %', () => {
  const { w } = fixture();
  w.LESSONS.forEach((l) => w.Progress.markLessonCompleted(l.id));
  Object.values(w.QUIZZES).forEach((q) =>
    w.Progress.saveQuizResult(q.id, q.questions.length, q.questions.length, [])
  );
  assert.equal(w.Progress.getOverallProgress(), 100);
  assert.equal(w.Progress.getNextLesson(), null);
  assert.equal(w.Progress.get().badges.length, 6);
});
test('Un export valide se réimporte et ne contient aucun brouillon privé', () => {
  const { w } = fixture();
  w.Progress.markLessonCompleted('mobile-money');
  const exported = w.Progress.exportData();
  assert.equal(exported.format, 'tchatzsafe-progress');
  assert.equal(exported.version, 2);
  assert(!Object.hasOwn(exported, 'reports'));
  w.Progress.reset();
  assert.equal(w.Progress.get().xp, 0);
  w.Progress.importData(exported);
  assert(w.Progress.isLessonCompleted('mobile-money'));
});
test('Les imports invalides et les résultats incohérents sont refusés sans effacer la progression', () => {
  const { w } = fixture();
  w.Progress.markLessonCompleted('phishing');
  const before = JSON.stringify(w.Progress.get());
  const invalid = [
    [],
    { format: 'autre', progress: {} },
    { format: 'tchatzsafe-progress', version: 3, progress: {} },
    { lessonsCompleted: ['inconnu'], quizzesCompleted: {} },
    { lessonsCompleted: [], quizzesCompleted: { debutant: { score: 6, total: 5 } } },
    { lessonsCompleted: [], quizzesCompleted: { constructor: { score: 1, total: 1 } } },
  ];
  invalid.forEach((value) => assert.throws(() => w.Progress.importData(value)));
  assert.equal(JSON.stringify(w.Progress.get()), before);
});
test('Le stockage corrompu ne plante pas le site et n’est pas supprimé silencieusement', () => {
  const { w, data, events } = fixture({ initial: { tchatzsafe_progress: '{broken' } });
  assert.equal(w.Progress.get().xp, 0);
  assert.equal(data.get('tchatzsafe_progress'), '{broken');
  assert(events.length > 0);
});
test('En stockage bloqué, le repli en mémoire est explicite et fonctionne dans la session', () => {
  const { w, events } = fixture({ blocked: true });
  w.Progress.markLessonCompleted('phishing');
  assert.equal(w.Progress.get().xp, 10);
  assert.equal(w.Progress.isPersistent, false);
  assert(events.length > 0);
  assert(w.Store.warning.includes('session'));
});
test('L’adaptateur de progression est remplaçable sans changer les composants', () => {
  const { w } = fixture();
  let saved = null;
  w.Progress.setRepository({
    load: () => saved,
    save: (p) => {
      saved = p;
      return true;
    },
    remove: () => {
      saved = null;
      return true;
    },
  });
  w.Progress.markLessonCompleted('phishing');
  assert.equal(saved.xp, 10);
  w.Progress.reset();
  assert.equal(w.Progress.get().xp, 0);
  assert.throws(() => w.Progress.setRepository({}));
});
test('Un brouillon nécessite un consentement et une entrée valide', () => {
  const { w } = fixture();
  assert.throws(() =>
    w.ReportRepository.add({ kind: 'link', value: 'https://example.org', consent: false })
  );
  assert.throws(() =>
    w.ReportRepository.add({ kind: 'link', value: 'javascript:alert(1)', consent: true })
  );
  assert.equal(w.ReportRepository.list().length, 0);
});
test('Les brouillons sont privés, non transmis et ne conservent ni fichier ni nom de preuve', () => {
  const { w } = fixture();
  const { record, persisted } = w.ReportRepository.add({
    kind: 'message',
    value: 'Un message fictif de démonstration.',
    description: 'Texte personnel non publié',
    consent: true,
    proof: { type: 'image/png', size: 128, name: 'identite-privee.png', bytes: 'private-data' },
  });
  assert.equal(persisted, true);
  assert.equal(record.status, 'draft');
  assert.equal(record.proof.type, 'image/png');
  assert.equal(record.proof.name, undefined);
  assert.equal(record.proof.bytes, undefined);
  assert.equal(record.sentAt, undefined);
  assert.equal(w.ReportRepository.list().length, 1);
});
test('La modération ne propose aucun statut de fraude confirmée', () => {
  const { w } = fixture();
  const { record } = w.ReportRepository.add({
    kind: 'link',
    value: 'https://example.org',
    consent: true,
  });
  assert.throws(() => w.ReportRepository.setStatus(record.id, 'confirmed'));
  w.ReportRepository.setStatus(record.id, 'review', 'À vérifier indépendamment');
  assert.equal(w.ReportRepository.list()[0].status, 'review');
  assert(w.ReportRepository.statuses.review.includes('simulée'));
  assert(w.ReportRepository.statuses.review.includes('non transmis'));
});
test('Les brouillons expirés sont purgés lors de la lecture après 30 jours', () => {
  const { w, data } = fixture();
  const { record } = w.ReportRepository.add({
    kind: 'message',
    value: 'Un exemple fictif pour tester.',
    consent: true,
  });
  record.createdAt = new Date(Date.now() - 31 * 24 * 60 * 60 * 1000).toISOString();
  w.Store.write('tchatzsafe_report_drafts_v1', [record]);
  assert.equal(w.ReportRepository.list().length, 0);
  assert.equal(JSON.parse(data.get('tchatzsafe_report_drafts_v1')).length, 0);
});
test('La limitation de fréquence locale rejette le sixième brouillon de la minute', () => {
  const { w } = fixture();
  for (let i = 0; i < 5; i++)
    w.ReportRepository.add({ kind: 'link', value: 'https://example.org/' + i, consent: true });
  assert.throws(
    () => w.ReportRepository.add({ kind: 'link', value: 'https://example.org/6', consent: true }),
    /Cinq/
  );
  assert.equal(w.ReportRepository.list().length, 5);
});
test('Supprimer un brouillon ne modifie pas la progression', () => {
  const { w } = fixture();
  w.Progress.markLessonCompleted('phishing');
  const { record } = w.ReportRepository.add({
    kind: 'link',
    value: 'https://example.org',
    consent: true,
  });
  w.ReportRepository.remove(record.id);
  assert.equal(w.ReportRepository.list().length, 0);
  assert.equal(w.Progress.get().xp, 10);
});

test('Après un quota dépassé, la lecture et l’export utilisent le nouvel état en mémoire, pas l’ancienne sauvegarde', () => {
  const { w, data } = fixture();
  w.Progress.markLessonCompleted('phishing');
  const saved = data.get('tchatzsafe_progress');
  w.localStorage.setItem = () => {
    throw new Error('QuotaExceededError');
  };
  w.Progress.markLessonCompleted('mobile-money');
  assert.equal(w.Progress.get().xp, 20);
  assert(w.Progress.exportData().progress.lessonsCompleted.includes('mobile-money'));
  assert.equal(data.get('tchatzsafe_progress'), saved);
  assert.equal(w.Store.persistent, false);
});

test('Une suppression refusée masque l’ancienne valeur dans la session et avertit sur la suppression persistante', () => {
  const { w } = fixture();
  w.Store.write('key', { old: true });
  w.localStorage.removeItem = () => {
    throw new Error('blocked');
  };
  assert.equal(w.Store.remove('key'), false);
  assert.equal(w.Store.read('key', null), null);
  assert(w.Store.warning.includes('suppression persistante'));
});

test('Une valeur réellement supprimée ailleurs n’est pas ressuscitée depuis le cache mémoire', () => {
  const { w, data } = fixture();
  w.Store.write('key', { old: true });
  data.delete('key');
  assert.equal(w.Store.read('key', null), null);
});

/* ------------------------------------------------------------------ *
 * Régression — audit correctif du 12 octobre 2026.
 * Chaque test correspond à un défaut reproduit avant correction.
 * ------------------------------------------------------------------ */

test('Un export sans contenu de progression est refusé et n’efface pas les données de l’appareil', () => {
  const { w } = fixture();
  w.Progress.markLessonCompleted('phishing');
  w.Progress.markLessonCompleted('mots-de-passe');
  w.Progress.saveQuizResult('debutant', 5, 5, []);
  const before = JSON.stringify(w.Progress.get());
  assert(before.includes('phishing'), 'précondition : progression réelle présente');
  const invalid = [
    null,
    undefined,
    { format: 'tchatzsafe-progress', version: 2 },
    { format: 'tchatzsafe-progress', version: 2, progress: null },
  ];
  for (const value of invalid)
    assert.throws(
      () => w.Progress.importData(value),
      /progression valide/,
      String(JSON.stringify(value))
    );
  assert.equal(JSON.stringify(w.Progress.get()), before);
  assert.equal(w.Progress.get().xp, 45);
});

test('Les raccourcisseurs restent reconnus avec www., en majuscules ou avec un point final', () => {
  const { w } = fixture();
  for (const url of [
    'https://bit.ly/abc',
    'https://www.bit.ly/abc',
    'https://WWW.TINYURL.COM/abc',
    'https://bit.ly./abc',
    'https://www.t.co/abc',
  ]) {
    const r = w.ThreatRules.analyze('link', url);
    assert(
      r.observations.some((o) => o.id === 'shortener'),
      url
    );
    assert.equal(r.risk, null, url);
    assert.equal(r.canDetermineSafety, false, url);
  }
  // Aucun faux positif : un autre domaine contenant le nom d’un raccourcisseur.
  for (const url of ['https://blog.bit.ly.example/abc', 'https://notbit.ly/abc']) {
    const r = w.ThreatRules.analyze('link', url);
    assert(!r.observations.some((o) => o.id === 'shortener'), url);
  }
});

test('Un numéro dont l’indicatif est entre parenthèses est accepté et normalisé', () => {
  const { w } = fixture();
  for (const input of ['(+229) 01 23 45 67 89', '(+229)0123456789', '+229 (01) 23 45 67 89'])
    assert.equal(w.ThreatRules.validate('phone', input).value, '+2290123456789', input);
  for (const input of ['(00229) 01 23 45 67', '0123456789', '+0 12345678', '+229abc'])
    assert.equal(w.ThreatRules.validate('phone', input).valid, false, input);
  const r = w.ThreatRules.analyze('phone', '(+999) 123 456 789');
  assert.equal(r.observations.length, 0);
  assert.equal(r.risk, null);
  assert(!Object.hasOwn(r, 'owner'));
});

test('Une valeur non sérialisable n’est pas écrite et ne corrompt pas la donnée précédente', () => {
  const { w, data, events } = fixture();
  w.Store.write('key', { ok: true });
  const before = data.get('key');
  const circular = {};
  circular.self = circular;
  assert.equal(w.Store.write('key', circular), false);
  assert.equal(w.Store.write('key', { big: 10n }), false);
  assert.equal(data.get('key'), before);
  assert(w.Store.warning.length > 0);
  assert(events.length > 0);
  assert.deepEqual(plain(w.Store.read('key', null)), { ok: true });
  assert.equal(w.Store.persistent, true);
});

test('La CSP servie ajoute frame-ancestors sans le duplicer dans les pages', () => {
  const vercel = JSON.parse(fs.readFileSync(path.join(root, 'vercel.json'), 'utf8'));
  const headers = vercel.headers.find((h) => h.source === '/(.*)').headers;
  const csp = headers.find((h) => h.key === 'Content-Security-Policy').value;
  assert(csp.includes("frame-ancestors 'none'"));
  assert(headers.some((h) => h.key === 'X-Frame-Options'));
  assert(headers.some((h) => h.key === 'Strict-Transport-Security'));
  for (const file of fs.readdirSync(root).filter((f) => f.endsWith('.html'))) {
    const html = fs.readFileSync(path.join(root, file), 'utf8');
    const meta = html.match(/http-equiv="Content-Security-Policy"[^>]*content="([^"]+)"/);
    assert(meta, file);
    assert(
      !meta[1].includes('frame-ancestors'),
      file + ' : frame-ancestors est ignoré dans une méta CSP'
    );
  }
});
