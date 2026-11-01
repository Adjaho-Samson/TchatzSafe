# TchatzSafe

Plateforme francophone de sensibilisation à la cybersécurité, pensée notamment pour le Bénin et l’Afrique francophone. Le site existant reste une application statique HTML, CSS et JavaScript : aucun compte ni serveur applicatif n’est nécessaire à l’apprentissage.

## Ce qui fonctionne

- 17 formations, 20 quiz, six fiches de menaces, recherche, filtres et sources ; les anciens identifiants et liens restent utilisables.
- Progression et badges pédagogiques sur l’appareil, reprise par chapitre, historique des formations et de chaque nouveau quiz, export/import et réinitialisation explicites. Une ancienne progression reste lisible ; les dates historiques inconnues ne sont pas inventées.
- Analyseur syntaxique et heuristique local : il explique des indices, n’ouvre pas les liens soumis et ne peut pas prouver qu’un contenu est sûr ou frauduleux.
- Signalement sous forme de **brouillon local consenti** : aucun envoi à une équipe, aucune base publique et aucune modération centralisée. `moderation.html` est un atelier local, pas un espace d’administration protégé.
- Application web installable : manifest, icônes, service worker, cache des pages et ressources essentielles, page de secours et mise à jour proposée à l’utilisateur. Un premier accès en ligne réussi est nécessaire pour constituer le cache.
- Mesure d’audience Vercel **facultative**, chargée uniquement après accord. Les métriques sont consultées dans le tableau de bord Vercel authentifié, non dans une page publique du site. Leur activation réelle nécessite l’accès au projet Vercel ; voir [Déploiement et statistiques](docs/DEPLOIEMENT-VERCEL.md).

L’application ne promet ni protection absolue ni assistance d’urgence. Les procédures et recours varient selon le service et le pays ; au Bénin, consulter les canaux officiels, notamment le [CNIN](https://www.cnin.bj/).

## Développer et vérifier

Prérequis : Node.js 22, npm et Python 3. Les dépendances npm sont destinées au développement, à la génération et aux tests ; le site n’utilise pas de bibliothèque JavaScript distante obligatoire à l’exécution.

```bash
npm ci
npm run generate      # pages, sprite Font Awesome et service worker versionné
npm run check         # structure et références locales
npm test              # tests unitaires
npx playwright install --with-deps chromium
npm run test:e2e      # parcours navigateur, responsive et accessibilité automatisée
npm run dev           # http://localhost:3000
```

Le serveur local écoute sur `0.0.0.0:3000`. Il sert uniquement des fichiers statiques : il ne reproduit ni le collecteur Analytics ni les en-têtes de production Vercel. Les tests Playwright peuvent utiliser un Chromium existant via `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH` ; sans cette variable ils utilisent celui installé par Playwright.

Après toute modification du contenu, des styles, des scripts, du manifest ou des assets, exécuter `npm run generate` puis versionner les fichiers générés. Ne pas modifier seulement les HTML racine ou `sw.js` : leurs sources sont les templates et outils ci-dessous. Le workflow CI vérifie leur cohérence.

## Organisation

| Chemin                                                | Rôle                                                                                              |
| ----------------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| `templates/pages/`, `tools/build-pages.py`            | Contenus et génération des pages HTML, du shell, de la navigation et des métadonnées.             |
| `js/data/`                                            | Formations, quiz, fiches, sources et enrichissement du parcours, avec les identifiants existants. |
| `js/progress.js`, `js/pages/`, `js/services/`         | Progression locale, interfaces, stockage et règles de l’analyseur.                                |
| `manifest.webmanifest`, `assets/pwa/`, `js/pwa.js`    | Installation, indications par appareil et état de connexion.                                      |
| `tools/sw-template.js`, `tools/build-sw.mjs`, `sw.js` | Génération du service worker, cache versionné et mises à jour.                                    |
| `js/analytics.js`                                     | Consentement et réduction des données de Vercel Web Analytics.                                    |
| `tools/build-icons.cjs`, `assets/icons.svg`           | Sprite d’icônes Font Awesome Free ; licence dans `assets/FONT-AWESOME-LICENSE.txt`.               |
| `css/refresh.css`                                     | Refonte visuelle noire et rouge, composants et adaptation mobile.                                 |
| `tests/`, `tools/check.mjs`                           | Tests unitaires, Playwright et vérifications structurelles.                                       |

## Confidentialité et stockage

La progression et les brouillons restent dans le stockage du navigateur, sans synchronisation entre appareils. La suppression des données du navigateur peut les effacer ; exporter la progression si nécessaire. Les brouillons ne figurent pas dans cet export. Si le stockage est refusé ou saturé, une alerte explique le repli en mémoire pour la session. Une sauvegarde illisible n’est pas remplacée automatiquement par le suivi de lecture.

Analytics ne charge pas son script avant consentement, respecte GPC et Do Not Track, ne transmet pas les paramètres/fragments de l’URL et réduit le référent à son origine. Il n’envoie aucun contenu de formulaire ni événement personnalisé. Vercel utilise toutefois un identifiant haché éphémère dérivé des requêtes pour estimer les visiteurs ; ce mécanisme et les obligations locales de confidentialité doivent être évalués avant activation. Voir la [politique du site](templates/pages/confidentialite.html) et le [guide Vercel](docs/DEPLOIEMENT-VERCEL.md).

## Documentation

- [Audit avant intervention](docs/AUDIT-2026-11.md)
- [Déploiement Vercel et accès administrateur](docs/DEPLOIEMENT-VERCEL.md)
- [Compte rendu et validation](docs/VALIDATION-2026-11.md)
- [Revue des sources pédagogiques](docs/REVUE-SOURCES.md)

Les documents plus anciens restent conservés comme historique ; en cas de divergence, se référer aux documents de novembre 2026.
