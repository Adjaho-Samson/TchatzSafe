# Audit correctif TchatzSafe V2 — inventaire, preuves et corrections

Date de l'audit : **12 octobre 2026**. Branche : `arena/88b99af4-tchatzsafe`, basée sur le commit
`aa5f20c` (« Initialisation du projet TchatzSafe »), seul commit de l'historique de ce dépôt.

Méthode : inspection du code réel avant toute modification, reproduction de chaque défaut par un
script ou un test, correction, puis rejeu des contrôles disponibles. Aucun résultat n'est rapporté
sans avoir été exécuté ici.

## Environnement réel de l'audit

| Outil    | Version constatée | Version annoncée par `docs/TESTS.md` (livraison précédente) |
| -------- | ----------------- | ----------------------------------------------------------- |
| Node.js  | **22.22.3**       | 20.20.2                                                     |
| npm      | 10.9.8            | —                                                           |
| Python   | **3.11.2**        | 3.13.16                                                     |
| Chromium | **absent**        | Playwright 1.64.0                                           |

`npx playwright install chromium` échoue dans cet environnement : l'hôte `cdn.playwright.dev`
renvoie `ECONNRESET` (réseau restreint) et aucun navigateur système n'est installé. `npm run
test:e2e` a tout de même été lancé pour mesurer l'étendue réelle du blocage : **1 test sur 92 s'est
exécuté et a réussi** — « Aucun backend n'est simulé par le serveur statique », le seul qui
n'utilise que le fixture HTTP (`POST /api/reports` → 404, `GET /.git/HEAD` → 404). Les 91 autres
échouent sur `browserType.launch: Executable doesn't exist`.

**Cette limite a été levée par la CI** : la suite complète a été exécutée par le workflow GitHub sur
la PR #1 (commit `1eccc4a`, run `38308129681`, job `115007021081`) et l'étape `npm run test:e2e`
s'est terminée en **success** en 1 min 25 s. Le nombre de tests a été vérifié sans navigateur par
`npx playwright test --list` → **Total: 92 tests in 1 file**. Playwright renvoyant un code non nul au
premier échec, les 92 tests ont réussi. Les journaux détaillés n'ont pas pu être lus depuis cet
environnement (`results-receiver.actions.githubusercontent.com` injoignable) : la conclusion provient
de l'API GitHub, pas de la lecture du journal.

C'est cette exécution CI qui a révélé la régression de libellé décrite en A13, invisible localement.

## Inventaire des problèmes confirmés

Gravité : **P0** fiabilité/confiance, **P1** données/tests/sécurité, **P2** qualité pédagogique.

### A1 — P0 · Raccourcisseurs d'URL non reconnus avec `www.`, en majuscules ou avec un point final

- Fichier : `js/services/threat-rules.js`
- Preuve reproduite avant correction (`ThreatRules.analyze('link', …)`) :

  | Adresse saisie              | Observations avant | Observations après |
  | --------------------------- | ------------------ | ------------------ |
  | `https://bit.ly/abc`        | `shortener`        | `shortener`        |
  | `https://www.bit.ly/abc`    | **aucune**         | `shortener`        |
  | `https://bit.ly./abc`       | **aucune**         | `shortener`        |
  | `https://WWW.TINYURL.COM/…` | **aucune**         | `shortener`        |
  | `https://www.t.co/abc`      | **aucune**         | `shortener`        |

- Cause : `SHORTENERS.has(url.hostname.toLowerCase())` comparait le nom d'hôte exact. `www.bit.ly`
  est pourtant une forme très courante de collage.
- Correction : fonction `comparableHost()` (minuscules, point final et préfixe `www.` retirés)
  utilisée uniquement pour la comparaison ; le nom lu dans l'adresse reste celui affiché.
- Effet de bord contrôlé : aucun faux positif sur `https://blog.bit.ly.example/abc` ni
  `https://notbit.ly/abc` (test de régression).
- Vérification : test unitaire « Les raccourcisseurs restent reconnus avec www., en majuscules ou
  avec un point final ».

### A2 — P0 · Numéro au format `(+229) …` refusé par un message qui annonce l'inverse

- Fichier : `js/services/threat-rules.js`
- Preuve : `validate('phone', '(+229) 01 23 45 67 89')` renvoyait
  « Utilisez le format international avec + et l'indicatif du pays. **Seuls chiffres, espaces,
  tirets et parenthèses sont acceptés.** » alors que le rejet venait précisément de la parenthèse
  ouvrante placée avant le `+`. Le libellé contredisait le comportement.
- Correction : les parenthèses encadrant l'indicatif en tête sont retirées avant contrôle
  (`(+229) 01 23 45 67 89` → `+2290123456789`) ; le `+` reste obligatoire ; les deux messages
  d'erreur décrivent la règle réelle.
- Cas toujours refusés (vérifiés) : `(00229) 01 23 45 67`, `0123456789`, `+0 12345678`, `+229abc`.
- Vérification : test unitaire « Un numéro dont l'indicatif est entre parenthèses est accepté et
  normalisé ».

### A3 — P0 · Affirmation absolue sur le navigateur dans l'analyseur

- Fichiers : `js/pages/analyzer.js`, `templates/pages/analyser.html` (donc `analyser.html`)
- Preuve : « Le contenu reste dans cette page. Il n'est **ni enregistré dans le navigateur** ni
  envoyé à un serveur. » Or le navigateur lui-même peut restaurer la valeur d'un champ lors d'un
  retour arrière (cache de session/bfcache) : l'engagement ne porte pas sur le navigateur, il porte
  sur TchatzSafe.
- Correction : formulation attribuée à TchatzSafe (« n'écrit pas dans le stockage du navigateur et
  n'envoie à aucun serveur ») + recommandation d'effacer le champ. Même ajustement dans l'indice du
  champ de saisie.
- Aucune autre promesse de sécurité n'a été trouvée : `risk` reste `null`,
  `canDetermineSafety` reste `false`, aucun libellé « lien sûr » ni score n'existe (vérifié par test
  unitaire existant et par relecture des 14 pages).

### A4 — P1 · Un export tronqué effaçait silencieusement la progression

- Fichier : `js/progress.js`
- Preuve reproduite avant correction, avec une progression réelle (2 leçons, 1 quiz à 100 %, 45 XP) :

  | Entrée de `importData`                      | Avant correction                             | Après correction            |
  | ------------------------------------------- | -------------------------------------------- | --------------------------- |
  | `{format:'tchatzsafe-progress', version:2}` | **acceptée → progression effacée (0 leçon)** | refusée, données conservées |
  | `{…, version:2, progress:null}`             | **acceptée → progression effacée**           | refusée, données conservées |
  | `null` / `undefined`                        | **acceptée → progression effacée**           | refusée, données conservées |
  | `progress:[]` / `'texte'` / `42`            | déjà refusée                                 | refusée (inchangé)          |

- Cause : `normalize(raw, strict)` retournait une progression vierge pour `null`/`undefined` avant
  les contrôles stricts ; `importData` la sauvegardait ensuite.
- Correction : en mode strict, `null`/`undefined` lève « Le fichier ne contient pas une progression
  valide. ». Le chemin non strict (lecture du stockage) conserve son comportement tolérant.
- Vérification : test unitaire « Un export sans contenu de progression est refusé et n'efface pas les
  données de l'appareil ».

### A5 — P1 · En-têtes de sécurité incomplets (clickjacking, HSTS)

- Fichier : `vercel.json`
- Preuve : les en-têtes servis étaient `X-Content-Type-Options`, `Referrer-Policy`,
  `Permissions-Policy`, `Content-Security-Policy` et `Cache-Control`. Ni `frame-ancestors`, ni
  `X-Frame-Options`, ni `Strict-Transport-Security` : le site pouvait être intégré dans un cadre
  invisible, ce qui permet de faire cliquer l'utilisateur sur les cases à cocher (consentement,
  réinitialisation) à son insu.
- Correction : `frame-ancestors 'none'` ajouté à la CSP **servie par en-tête**, `X-Frame-Options:
DENY` pour les navigateurs anciens, `Strict-Transport-Security: max-age=31536000;
includeSubDomains`.
- Point technique vérifié : `frame-ancestors` est **ignoré** dans une balise `<meta>` ; il n'a donc
  volontairement pas été ajouté aux pages, et `tools/check.mjs` l'interdit désormais.
- Choix assumé : `tools/server.mjs` (serveur de développement) n'applique pas `X-Frame-Options`,
  afin de ne pas casser l'aperçu en iframe ; il ne sert aucune donnée sensible et n'est pas
  destiné à la production.
- `preload` n'est pas activé : l'inscription HSTS preload est irréversible et relève d'une décision
  d'exploitation, pas d'un audit.

### A6 — P1 · Aucun contrôle automatisé des en-têtes ni de la cohérence des deux CSP

- Fichier : `tools/check.mjs`
- Preuve : la CSP existait à deux endroits (`vercel.json` et `tools/build-pages.py`, donc dans les
  14 pages) sans aucune vérification de cohérence ; une divergence serait passée en CI. Les deux
  valeurs étaient identiques au moment de l'audit (vérifié), mais rien ne le garantissait.
- Correction : `npm run check` vérifie désormais la présence des 6 en-têtes de sécurité, la présence
  de `frame-ancestors 'none'` dans la CSP servie, l'égalité
  `CSP servie == CSP de la page + "; frame-ancestors 'none'"` pour les 14 pages, et l'absence de
  `frame-ancestors` dans les méta CSP.
- Vérification : `npm run check` → « 14 pages, 964 références locales, 17 cours, 20 quiz et 6
  fiches : contrôle structurel OK. » + test unitaire dédié.

### A7 — P1 · La CI ne détectait pas un fichier généré non commité

- Fichier : `.github/workflows/quality.yml`
- Preuve : l'étape `git diff --exit-code -- '*.html' …` ne compare que des fichiers **suivis**. Si
  `templates/pages/x.html` était ajouté sans que le `x.html` généré soit commité, la CI passait au
  vert alors que la page manquait sur le site déployé (le HTML généré est versionné et servi tel
  quel, sans build côté Vercel).
- Correction : `git add -A` sur les artefacts générés, puis `git diff --cached --exit-code`, plus un
  contrôle `git status --porcelain --untracked-files=all` sur ces mêmes chemins. Ajout de
  `npm audit --audit-level=high` en étape **non bloquante** (`continue-on-error: true`) pour
  signaler sans casser la chaîne.
- Vérification : le dépôt est propre après `npm run generate` exécuté deux fois de suite (aucune
  différence supplémentaire) ; `npm audit` → `found 0 vulnerabilities`.

### A8 — P1 · `Store.write` pouvait lever ou écrire une donnée illisible

- Fichier : `js/services/storage.js`
- Preuve : `JSON.stringify(value)` n'était pas protégé. Une valeur circulaire levait une exception
  non interceptée hors du repli mémoire ; `JSON.stringify(Symbol())`/valeur non sérialisable
  renvoyait `undefined`, écrit tel quel puis illisible au prochain `JSON.parse` (« données locales
  illisibles »).
- Correction : sérialisation protégée, garde `typeof raw !== 'string'`, avertissement utilisateur
  explicite et retour `false` sans toucher au stockage ni au cache mémoire.
- Vérification : test unitaire « Une valeur non sérialisable n'est pas écrite et ne corrompt pas la
  donnée précédente » (la valeur précédente reste lisible, `persistent` reste `true`).

### A9 — P2 · Règles d'XP et de badges absentes de l'interface, libellé d'un badge inexact

- Fichiers : `js/progress.js`, `templates/pages/progression.html`
- Preuve : le code attribue `10 XP` par leçon, `15 XP` par quiz terminé et `10 XP` de bonus par quiz
  dont le meilleur score atteint 80 %, avec 6 niveaux de 0 à 400 XP. L'interface n'expliquait
  nulle part ce calcul (les XP n'apparaissaient que dans le texte de réinitialisation). Par
  ailleurs le badge `curieux` était décrit « Étudier 5 **thèmes** » alors que le code compte 5
  **formations** (`lessonsCompleted.length >= 5`).
- Correction : section « Comment sont calculés vos XP et vos badges » avec les valeurs réelles,
  rappel que ce ne sont pas des indicateurs de sécurité, et description du badge alignée sur le
  code (« Étudier 5 formations. »).
- Aucun barème, badge ou niveau n'a été supprimé ni modifié dans le calcul.

### A10 — P2 · Champ fichier d'import sans nom accessible

- Fichier : `templates/pages/progression.html`
- Preuve : `<input id="import-progress" type="file" … hidden>` sans `<label for>` ni `aria-label`.
  L'attribut `hidden` le retire de l'arbre d'accessibilité (aucune violation axe), mais le contrôle
  restait sans nom si l'attribut était retiré.
- Correction : `aria-label="Choisir un fichier JSON de progression à importer"`.

### A11 — Documentation · Résultats présentés sans distinguer ce qui a été rejoué

- Fichiers : `README.md`, `docs/TESTS.md`, `docs/AUDIT-ET-PLAN.md`
- Preuve : `README.md` annonçait « Vérification finale : 31 tests unitaires et 92 tests navigateur
  réussis » ; `docs/TESTS.md` déclarait Node 20.20.2 / Python 3.13.16 et
  `docs/AUDIT-ET-PLAN.md` un commit de base `d07e2cf`. Dans ce dépôt, l'historique ne contient que
  `aa5f20c` et l'environnement réel est Node 22.22.3 / Python 3.11.2 ; les 92 tests navigateur ne
  sont pas rejouables ici.
- Correction : les documents historiques sont conservés, mais une section datée de re-vérification
  indique précisément ce qui a été exécuté dans cet environnement, ce qui n'a pas pu l'être et
  pourquoi. Le présent fichier tient lieu d'inventaire.

### A12 — P1 · Runtime des actions GitHub déprécié et Node.js 20 en fin de vie

- Fichier : `.github/workflows/quality.yml`
- Preuve : l'exécution réelle de la CI sur la PR #1 (`run 38307127132`) a produit l'avertissement
  « Node.js 20 is deprecated. The following actions target Node.js 20 but are being forced to run on
  Node.js 24 : actions/checkout@v4, actions/setup-node@v4, actions/upload-artifact@v4 ». Par
  ailleurs le job utilisait `node-version: '20'`, dont la maintenance LTS s'est arrêtée en avril 2026.
- Vérification préalable : `actions/checkout@v7`, `actions/setup-node@v7` et
  `actions/upload-artifact@v7` sont les releases stables courantes (juillet-octobre 2026),
  déclarent `using: node24`, et conservent les entrées utilisées ici (`node-version`, `cache`,
  `name`, `path`, `retention-days`) — contrôlé via l'API GitHub avant modification.
- Correction : les trois actions passent en `@v7` et `node-version` passe à `'22'`, la version sur
  laquelle les 36 tests unitaires ont réellement été exécutés pendant cet audit.

### A13 — Régression introduite par l'audit, détectée par la CI puis corrigée

À signaler parce qu'elle illustre l'utilité du contrôle navigateur : la reformulation du message
d'erreur de `validate('phone', …)` (A2) avait supprimé la mention « format international » du premier
message. Or `tests/frontend.spec.cjs` saisit `numéro invalide` et attend ce texte :

```
await page.locator('#suspect-input').fill('numéro invalide');
await expect(page.locator('#analyzer-error')).toContainText('format international');
```

Ce test n'était pas exécutable localement (A : environnement sans navigateur) ; c'est l'exécution CI
de la PR #1 qui a révélé l'échec (étape 13, `npm run test:e2e`). Le message redevient « Le numéro
doit commencer par le signe + **du format international**, suivi de l'indicatif du pays, par exemple
+229… », et une garde unitaire vérifie désormais que **tout** refus de numéro contient cette mention,
pour protéger ce contrat d'interface même sans navigateur.

## Points contrôlés et jugés conformes (aucune correction nécessaire)

Ces vérifications sont rapportées parce qu'elles font partie du périmètre demandé, pas pour gonfler
le bilan :

- **Contraste** : calcul WCAG 2.1 sur les 17 paires texte/fond critiques des deux thèmes et sur
  toutes les règles CSS déclarant `color` **et** `background` → aucun échec AA. Le bouton primaire
  (blanc sur `#d63742`, couleur codée en dur) donne 4.68:1 ; les libellés 10 px `.eyebrow`/`.tag-red`
  donnent 5.04 à 6.40:1. `--color-gray-400` en thème clair vaut 4.38:1 mais cette variable n'est
  utilisée nulle part dans les feuilles de style.
- **Double `<h1>` dans `quiz.html`** : les conteneurs `#quiz-catalog` et `#quiz-player` sont
  mutuellement exclusifs via `hidden` ; un seul `<h1>` est exposé à la fois.
- **Identifiants DOM manquants** relevés par croisement statique (`apprendre.html`, `signaler.html`,
  `moderation.html`) : tous couverts par des gardes existantes (`if (!form) return;`,
  `Boolean(getElementById(…))`) ou par des éléments créés dynamiquement.
- **Fuite de données sans JavaScript** : les deux formulaires (`analyser.html`, `signaler.html`) ont
  un bouton de soumission `disabled` par défaut, activé par le script, et `preventDefault()` en
  première instruction. Aucune soumission native ne peut placer une URL saisie dans l'historique.
- **Icônes** : les 16 noms demandés par le JS et le HTML existent tous dans `assets/icons.svg`
  (35 symboles) ; `check.mjs` valide déjà les références statiques.
- **Liens profonds générés en JS** : les 17 formations, 20 quiz et 6 fiches sont cohérents
  (`theme=`, `id=`, `categorie=`, `quiz.html?id=debutant`), chaque leçon a un quiz, chaque
  `themeId` et chaque `lesson` de fiche existe, toutes les sources sont en HTTPS.
- **Ordre de chargement** : `js/data/curriculum.js` exige `SOURCES` ; les 4 pages concernées
  chargent bien `sources.js` avant. `check.mjs` charge dans le même ordre.
- **Génération déterministe** : `npm run generate` (Python + Prettier) reproduit les HTML à
  l'identique. Attention : `build-pages.py` **seul** produit un HTML non formaté très différent du
  HTML versionné — la comparaison de la CI n'a de sens qu'après Prettier, ce que fait bien le script.
- **Aucune API fictive ni exposition du dépôt** : vérifié réellement par le seul test e2e exécutable
  ici — `POST /api/reports` renvoie **404** (« Aucune API disponible. ») et `GET /.git/HEAD` renvoie
  **404**, contre `tools/server.mjs`. Le serveur bloque aussi `/docs`, `/tools`, `/templates`,
  `/tests`, `/node_modules` et tout segment commençant par un point (contrôlé par `curl` :
  `/docs/TESTS.md` → 404, `/.git/config` → 404, `/templates/pages/index.html` → 404).
- **Dépendances** : 3 dépendances de développement uniquement, aucune dépendance runtime ajoutée par
  cet audit ; `package-lock.json` complet et `npm ci` fonctionnel ; `npm audit` → 0 vulnérabilité.

## Risques résiduels

- **Couverture navigateur** : les 92 tests fonctionnels et axe-core sont désormais validés par la CI
  sur **Chromium** (Node 22). Restent non couverts : **Safari, Firefox, les lecteurs d'écran, le zoom
  200 à 400 % et les appareils physiques**. Les mesures de performance de
  `docs/preuves/performance.json` (FCP/LCP/CLS, réseau et CPU simulés) n'ont **pas été refaites**
  pendant cet audit : elles ne font pas partie de la suite automatisée et restent des valeurs
  ponctuelles de la livraison précédente.
- **API récentes** : `Object.hasOwn` (Chrome 93+, Safari 15.4+) et `dialog.showModal()` (Firefox
  98+, Safari 15.4+). Sur un navigateur plus ancien, une bannière d'erreur explicite s'affiche, mais
  les interactions concernées deviennent indisponibles. Non testé ici.
- **`style-src 'unsafe-inline'`** : maintenu, car les barres de progression utilisent des attributs
  `style="width:…"` générés. Une suppression exigerait de passer par des variables CSS.
- **Liste de raccourcisseurs** : 9 services, comparaison exacte après normalisation. Les
  sous-domaines tiers et les services non listés ne sont pas détectés — c'est cohérent avec le statut
  de démonstration locale, affiché dans l'interface.
- **`.icon-button` à 40 px** : conforme WCAG 2.2 AA (24 px minimum) mais sous les 44 px
  recommandés en AAA ; pertinent pour un public majoritairement mobile.
- **URLs externes** : les 14 références n'ont pas pu être interrogées depuis cet environnement
  (hôtes non autorisés). Leur revue éditoriale antérieure reste documentée dans
  `docs/REVUE-SOURCES.md` et n'a pas été revalidée ici.

## Opérations qui restent manuelles

1. Les tests navigateur sont exécutés automatiquement par le workflow `Qualité TchatzSafe` à chaque
   push et PR vers `master`/`main` : consulter la conclusion du job `frontend` avant fusion. Un
   rejeu local (`npx playwright install --with-deps chromium && npm run test:e2e`) n'est nécessaire
   que pour diagnostiquer un échec.
2. Compléter sur d'autres moteurs, non couverts par la CI : Safari, Firefox, lecteur d'écran, zoom
   200 à 400 % et smartphones physiques. Refaire une mesure de performance si les chiffres de
   `docs/preuves/performance.json` doivent être cités à jour.
3. Après déploiement, vérifier les en-têtes réellement servis :
   `curl -sI https://tchatzsafe.vercel.app/ | grep -iE 'content-security|x-frame|strict-transport'`.
   Non fait pendant l'audit : l'hôte `vercel.app` n'est pas joignable depuis cet environnement, alors
   que l'aperçu Vercel de la PR était bien en `pass`.
4. Contrôle ponctuel de la disponibilité des 14 URLs de `js/data/sources.js`.
5. Décision d'exploitation sur HSTS `preload` et sur l'éventuelle suppression de `'unsafe-inline'`.
6. Publication — état réel au 12 octobre 2026 : la branche `arena/88b99af4-tchatzsafe` a été
   **poussée** sur `github.com/Adjaho-Samson/TchatzSafe` et la **pull request #1** vers `master` a
   été ouverte, après accord explicite du demandeur. Vercel a produit un **aperçu** de la PR
   (statut `pass`). En revanche, la PR **n'est pas fusionnée** : `master` et le déploiement de
   production Vercel ne contiennent donc **aucune** de ces corrections tant que la fusion n'est pas
   effectuée. Les en-têtes de sécurité ajoutés dans `vercel.json` ne s'appliqueront qu'après cette
   fusion et le redéploiement.
