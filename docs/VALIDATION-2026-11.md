# Compte rendu de mise à niveau — novembre 2026

Le détail des constats avant intervention est conservé dans [l’audit initial](AUDIT-2026-11.md). Ce document décrit l’état livré et les limites ; le [guide Vercel](DEPLOIEMENT-VERCEL.md) donne les étapes de mise en service.

## Problèmes constatés et corrections

- Le site initial était déjà riche (formations, quiz, analyseur et stockage local), mais les scripts Google Analytics présents dans les HTML générés étaient bloqués par la CSP. Ils ont été retirés lors de la génération ; une mesure Vercel facultative et soumise à consentement est préparée à la place.
- L’iconographie mélangeait plusieurs styles et certains symboles. Elle utilise maintenant un sprite Font Awesome Free 7.3.1 hébergé localement, en conservant les identifiants internes utiles ; la licence est fournie.
- L’accueil et les pages ont été harmonisés : palette noire et rouge, hiérarchie typographique, image éditoriale, cartes, navigation et états responsives. Le thème clair existant reste disponible. Les textes, conseils et exemples ont été clarifiés, avec des adresses fictives et des formulations évitant les garanties excessives.
- La reprise conserve désormais un chapitre et sa date, y compris après défilement manuel, retour et rechargement. Le double décalage des ancres a été corrigé. L’historique distingue les formations étudiées, leurs dates disponibles et chaque nouvelle tentative de quiz ; les scores et les données historiques sont conservés. Aucun changement de schéma n’efface une sauvegarde illisible automatiquement.
- Le manifest, les icônes PWA et le service worker apportent une installation proposée selon les capacités du navigateur, un cache versionné, un repli hors ligne et une mise à jour explicitement acceptée. Les paramètres d’URL ne sont pas utilisés comme clés de cache ; aucune API ou requête Analytics n’y est enregistrée.
- La mesure facultative filtre les routes, les paramètres, fragments et référents, ne suit pas les formulaires et respecte les choix GPC/DNT. Les statistiques ne sont pas inventées ni rendues publiques : l’administration se fait dans Vercel après activation par le propriétaire.

## Fonctionnalités préservées et limites

- Les 15 formations et 12 quiz historiques restent accessibles avec leurs identifiants ; le catalogue contient au total 17 formations et 20 quiz. Les six fiches de menaces, les filtres, les recherches, le glossaire, les conseils et les liens profonds restent présents.
- Le score, les explications, les meilleurs résultats et les points pédagogiques sont réels mais ne constituent pas une certification. L’historique des anciens essais n’existait pas : seul l’ancien dernier résultat disponible peut être repris, sans date inventée.
- L’analyseur examine des indices localement. Il ne consulte pas de base de réputation, ne visite pas les liens et ne fournit pas de verdict de sûreté ni d’identité de titulaire.
- Le signalement produit un brouillon sur cet appareil seulement. Il n’y a ni transmission, ni équipe de réception, ni publication, ni authentification de modération. Une solution future de traitement réel nécessitera backend, contrôle d’accès, protection anti-abus côté serveur et cadre juridique.
- La PWA dépend du navigateur et d’un premier chargement en ligne réussi. L’invite native ne peut pas être forcée ; des instructions adaptées sont affichées lorsqu’elle n’est pas disponible. Le cache peut être supprimé par l’utilisateur ou le navigateur.
- Les statistiques réelles requièrent l’activation Vercel et des visites consenties. Le tableau Vercel est l’espace privé proposé ; aucun tableau d’administration personnalisé n’a été déployé. Les visiteurs, pages vues et sessions ne sont pas synonymes. Vercel utilise un identifiant de requête haché éphémère ; si toute empreinte technique est interdite par la politique du site, ne pas activer cette solution.
- Aucun test automatique ne prouve l’accessibilité complète, la sûreté des contenus ou la conformité juridique. Les liens externes peuvent changer après leur vérification ponctuelle.

## Fichiers et dépendances

Les sources principales sont `templates/pages/`, `tools/build-pages.py`, `js/data/`, `js/progress.js`, `js/pages/`, `css/refresh.css`, `js/pwa.js`, `js/analytics.js`, `manifest.webmanifest`, `tools/sw-template.js` et les outils de génération. Les HTML racine, `assets/icons.svg` et `sw.js` sont générés et versionnés. Les icônes PWA sont dans `assets/pwa/` et l’illustration de l’accueil dans `assets/illustrations/hero-vigilance.jpg`.

La seule nouvelle dépendance de développement est `@fortawesome/free-solid-svg-icons` 7.3.1, utilisée pour générer le sprite local. Playwright, axe et Prettier étaient déjà employés pour la qualité. Aucun paquet Analytics et aucune clé privée ne sont ajoutés au navigateur.

## Vérifications

Après une installation propre avec `npm ci`, les vérifications finales donnent :

- `npm run generate` : 15 pages et un service worker versionné contenant 60 ressources ; une seconde génération à contenu identique produit les mêmes empreintes SHA-256 pour les fichiers générés.
- `npm run check` : 15 pages, 1 191 références locales, 17 cours, 20 quiz et 6 fiches vérifiés.
- `npm test` : **39 tests unitaires réussis sur 39**.
- `npm run test:e2e` : **104 tests Playwright réussis sur 104**, en Chromium 153. Les scénarios comprennent cinq largeurs (320, 390, 768, 1 024 et 1 440 px), la navigation clavier, des contrôles automatisés axe WCAG 2.1 AA en thèmes clair et sombre, la reprise mobile, le fragment malformé, plusieurs tentatives de quiz, l’invite d’installation simulée, le cache réellement utilisé hors ligne, un échec de précache, les signaux de confidentialité, le retrait du consentement et l’activation d’une nouvelle version du service worker.
- `npm audit --audit-level=moderate` : **aucune vulnérabilité signalée** pour le verrouillage npm au moment du contrôle.
- `git diff --check` : aucune erreur d’espaces signalée.

Le téléchargement du navigateur Playwright depuis son CDN n’étant pas accessible dans cet environnement, les tests ont utilisé un binaire Chromium local avec `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH` et les bibliothèques système nécessaires. L’invite native d’installation a été simulée ; l’installation effective sur iOS, Android, Firefox, Safari et Chrome sur appareil physique reste à vérifier. Les contrôles axe automatisés ne remplacent pas une revue d’accessibilité humaine.

Une vérification complémentaire en local a servi une copie datée du 29 octobre 2026 du collecteur Vercel, publiée dans un dépôt tiers, avec les requêtes interceptées : l’événement observé ne contenait ni paramètres ni fragment et son référent était réduit à l’origine ; aucun événement supplémentaire n’a été émis après retrait. Ce contrôle, utile pour l’intégration, **ne remplace pas un essai du collecteur actuel sur le vrai projet Vercel**.

Les pages d’accueil de quatre organismes ont été consultées lors de la revue de sources ; le contrôle de structure n’interroge pas les sites externes. Voir [REVUE-SOURCES.md](REVUE-SOURCES.md).
