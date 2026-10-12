# TchatzSafe — audit et plan de refonte

Date : 12 octobre 2026. Base : `Adjaho-Samson/TchatzSafe`, commit `d07e2cf`, branche principale existante `master`.

## 1. Analyse de l’existant, avant modification

Le dépôt public a été retrouvé grâce à son nom et à sa référence au domaine `tchatzsafe.vercel.app`. Le fichier `index.html` du dépôt correspond au fichier servi sur Vercel.

### Architecture identifiée

- Site statique multipage, HTML, CSS et JavaScript natifs. Aucun framework, package runtime, serveur applicatif ou API.
- 7 pages : accueil, apprendre, quiz, conseils, glossaire, progression, à propos/confidentialité.
- 15 leçons, 12 quiz et 13 termes de glossaire.
- Les routes `apprendre.html?theme=…` et `quiz.html?id=…` ouvrent une leçon/un quiz.
- Progression sur l’appareil, clé `tchatzsafe_progress` : leçons, quiz, meilleurs scores, notions, badges, XP. Préférence de thème : `tchatzsafe_theme`.
- Palette noir/gris/rouge, mode clair/sombre, navigation mobile, lien d’évitement, quiz à réponses mélangées, explication après chaque réponse, conseils en accordéons et recherche du glossaire.

### Problèmes constatés dans les fichiers et sur le site

1. L’accueil explique la mission mais ne propose aucun outil d’analyse ou de signalement et ne structure pas les six familles de menaces demandées.
2. Les filtres de cours fonctionnent par catégorie uniquement. Les trois niveaux ne sont pas présentés comme des parcours. Il n’existe pas de cours avancé.
3. Cinq leçons n’ont pas de quiz associé : faux emplois, investissements, téléphone/applications, Wi-Fi public, emails suspects. Le lien de validation de ces cours mène à une erreur.
4. Les mises en situation inventées sont titrées « Situation réelle » : elles doivent être désignées comme exemples fictifs.
5. Certaines formulations sont trop absolues et plusieurs sources sont génériques ou ne correspondent plus à une page. Par exemple l’ancienne URL de la fiche phishing est inversée : la fiche fonctionnelle est `hameconnage-phishing`.
6. Dans `saveQuizResult`, le meilleur score est mis à jour avant de tester l’attribution du bonus : améliorer un résultat de moins de 80 % vers au moins 80 % n’accorde pas le bonus attendu. Le score de 0 % devient aussi `null` à l’affichage.
7. Le localStorage n’est pas validé strictement ; les indisponibilités de stockage ne sont pas expliquées dans l’interface. L’ancienne initialisation du thème peut interrompre une partie du code si le stockage est bloqué.
8. Les réponses du quiz utilisent un rôle `listbox/option` sans implémenter toutes les interactions clavier associées. Des boutons natifs sont plus adaptés.
9. HTML de navigation/pied de page répété et scripts inline volumineux : risque de divergences et de maintenance difficile.
10. Pas d’import/export de progression, pas d’architecture de dépôt de données, pas de tests automatisés, pas de documentation des futures API.
11. Copyright figé à 2025. Les états de contenu introuvable et les limites fonctionnelles doivent être clarifiés.

Le résultat des contrôles navigateur est consigné séparément dans `docs/TESTS.md` après exécution ; aucune validation non exécutée n’est présentée comme acquise.

## 2. Plan priorisé

### P0 — continuité et crédibilité

- Conserver l’architecture statique, les anciennes routes, les 15 cours, les 12 quiz, le glossaire, les conseils, les badges, XP et clés de stockage.
- Corriger le calcul des XP, la gestion du score nul, la validation des données et les erreurs de stockage.
- Identifier les exemples fictifs, corriger les conseils trop absolus et ajouter des sources précises.
- Interdire toute consultation automatique d’une URL saisie et toute transmission externe des formulaires.

### P1 — refonte et fonctionnalités frontend

- Design sombre par défaut, noir/rouge/gris, typographie locale, illustration SVG légère, contrastes vérifiés, thème clair conservé.
- Navigation partagée générée statiquement, menu mobile accessible, footer complet et styles centralisés.
- Accueil demandé : titre exact, deux CTA, six menaces, formations, quiz interactif, prévention, mission et sources.
- Analyseur explicitement en démonstration : lecture de règles locales explicables, validation et conseils, sans niveau de risque ni garantie de sûreté.
- Apprentissage par trois niveaux, recherche et filtres de catégories, détails complets de chaque cours, quiz manquants et deux cours avancés.
- Six fiches de menaces sourcées, recherches et liens profonds.
- Progression locale migrée, export/import validé, suppression confirmée et états vides.

### P2 — préparation backend et sécurité

- Signalement : formulaire validé, description/preuve facultatives, consentement au brouillon local, suppression et statut « non transmis ».
- Atelier de modération explicitement local, sans authentification réelle, sans publication ni accusation confirmée.
- Adaptateurs de données séparés de l’interface, politique de confidentialité, expiration des brouillons, contrat API, droits et anti-abus à implémenter côté serveur.
- Contrôles de routes, liens, formulaires, clavier, mobile/tablette/desktop et axe WCAG 2.1 AA ; tests unitaires et navigateur reproductibles.

## 3. Choix d’architecture

Aucune migration vers React, Next.js ou autre framework : elle n’est pas justifiée pour cette plateforme éducative statique. Les pages et dossiers historiques restent en place. Les scripts de pages sont extraits dans `js/pages/`, les composants et styles sont partagés, et de petites commandes de génération/test sont ajoutées comme outillage de développement seulement.

Le moteur local ne constitue pas un moteur de réputation ou un antivirus. Le module de signalement ne reçoit pas de plaintes réelles. Les mesures anti-abus du navigateur ne constituent pas une protection serveur. Ces distinctions figurent à la fois dans l’interface et la documentation.

## 4. Publication

Le dépôt utilise `master` comme branche principale. L’historique d’origine est conservé. Un push distant ne peut être effectué qu’avec un accès d’écriture authentifié. Le connecteur GitHub n’est pas proposé dans cet environnement et aucune authentification Git n’a été trouvée au début de la mission ; la publication ne sera pas annoncée comme faite sans confirmation du serveur GitHub.
