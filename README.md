# TchatzSafe — refonte V2

**Les arnaques évoluent. Votre vigilance aussi.**

Plateforme de sensibilisation à la cybersécurité destinée au grand public, notamment aux utilisateurs de smartphones, messageries et Mobile Money en Afrique. Refonte du dépôt existant, pas remplacement par un framework générique.

## Ce qui fonctionne réellement

- Accueil responsive noir/rouge/gris, navigation clavier, menu mobile, thème clair/sombre conservé, animations réduites selon la préférence système.
- **17 formations** en trois niveaux : 10 débutant, 5 intermédiaire, 2 avancé. Objectifs, exemples fictifs, explications, alertes, bonnes pratiques, résumés, sources et quiz.
- **20 quiz** interactifs avec options mélangées, explications et sauvegarde locale. Les 12 quiz historiques sont conservés et les cours auparavant sans quiz disposent désormais d’une validation.
- **6 fiches de menaces** sourcées : Mobile Money, faux emplois, phishing, faux investissements, faux comptes, liens suspects.
- Progression sur l’appareil, XP/badges historiques, export/import JSON validé et suppression confirmée. Clé V1 et identifiants conservés. En cas de quota/blocage du stockage, l’alerte permet d’exporter directement la progression de la page avant de naviguer.
- Les 6 conseils en dépliants, leurs liens profonds et les 13 définitions du glossaire sont conservés.
- Sources, mission et politique de confidentialité accessibles.

Contrôles réellement exécutés le **12 octobre 2026** dans l’environnement d’audit (Node 22.22.3, Python 3.11.2) : **36/36 tests unitaires**, contrôle structurel (14 pages, 964 références locales, 17 cours, 20 quiz, 6 fiches), `npm audit` **0 vulnérabilité**, génération déterministe et conformité AA des contrastes vérifiée par calcul. Les **92 tests navigateur n’ont pas pu être rejoués** dans cet environnement (téléchargement de Chromium refusé, aucun navigateur système) : ils restent à relancer avant publication. Détails, conditions et limites dans `docs/TESTS.md` ; inventaire des défauts corrigés et preuves dans `docs/AUDIT-CORRECTIF-V2.md`. Aucun push ni déploiement n’a été effectué.

## Ce qui est une démonstration

| Module          | État exact                                                                                                                                        |
| --------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| Analyseur       | Lecture de règles **locales**, pas un moteur de sécurité. Ne visite aucun lien. Ne détermine aucun risque réel et ne déclare jamais une URL sûre. |
| Signalement     | Formulaire validé et **brouillons privés consentis** sur ce navigateur. Aucun envoi à TchatzSafe ni dépôt de plainte.                             |
| Preuves         | Prévisualisation locale, PNG/JPEG/WebP ≤ 5 Mo. Aucun fichier ni nom conservé ou envoyé.                                                           |
| Modération      | **Atelier local non authentifié**, affichant seulement les brouillons du navigateur. Statuts simulés, aucun fait vérifié ni publication.          |
| Synchronisation | **Non disponible** : pas de compte ni API. Un adaptateur et les contrats d’évolution sont documentés.                                             |

Les principes de confidentialité et les limites apparaissent également dans l’interface. Ne mettez pas les démonstrations en avant comme des services de réputation, de signalement réel ou d’administration sécurisée.

## Lancer et tester

Aucune dépendance n’est nécessaire pour servir le site déjà généré.

```bash
# Node.js 20+
npm run dev
# http://localhost:3000 — serveur lié à 0.0.0.0

# Alternative statique (Python 3)
python3 -m http.server 3000 --bind 0.0.0.0
```

Le serveur fourni avec `npm run dev` bloque `.git`, les outils, templates et tests. L’alternative Python est destinée au développement local et ne doit pas être exposée telle quelle comme serveur de production.

```bash
# Outillage de développement uniquement
npm ci
npm run generate   # Python 3 : shell partagé + icônes, puis formatage
npm run check      # pages, références locales, données et routes
npm test           # tests unitaires
npx playwright install --with-deps chromium
npm run test:e2e   # démarre un serveur de test temporaire
```

La suite navigateur peut utiliser un serveur déjà lancé :

```bash
TEST_BASE_URL=http://127.0.0.1:3000 npm run test:e2e
```

L’URL localhost est réservée à l’outillage de test dans la machine. Le frontend ne l’utilise jamais pour appeler un backend.

## Structure

```text
index.html, apprendre.html, quiz.html, conseils.html,
glossaire.html, progression.html, a-propos.html  # routes V1 conservées
menaces.html, analyser.html, signaler.html,
moderation.html, sources.html, confidentialite.html, 404.html
css/                 # fichiers historiques, tokens et composants centralisés
js/data/             # cours/quiz/glossaire V1, enrichissement et sources
js/pages/            # interactions par page
js/services/         # stockage, règles locales et brouillons
js/components.js     # cartes et illustrations partagées
js/main.js           # navigation, thème, utilitaires
assets/              # SVG et polices locales avec licences
templates/pages/     # contenu statique maintenable
tools/build-pages.py # header/footer partagés ; HTML généré versionné
tests/               # unitaires + Playwright + axe
.github/workflows/   # contrôle qualité prévu sur push/PR
```

### Modifier le projet

- Contenu d’une page : `templates/pages/<page>.html`, puis `npm run generate`.
- Navigation/footer : `tools/build-pages.py`.
- Design : `css/variables.css`, puis composants/style/responsive.
- Les identifiants historiques sont dans `lessons.js` et `quizzes.js`. Leur enrichissement est dans `curriculum.js` ; les changements pédagogiques ne suppriment pas les contenus V1.
- Références : `js/data/sources.js`. Vérifier les liens à chaque revue ; les exemples n’établissent jamais un cas de fraude réelle.

## Déploiement et GitHub

Le dépôt public audité est `https://github.com/Adjaho-Samson/TchatzSafe`. Sa branche principale existante est **master**. L’historique initial est conservé.

Servir les pages à la racine, sans backend. Vercel : preset « Other », pas de build obligatoire, output `.`. Les pages générées sont déjà incluses. Ne pas activer une API de collecte sans satisfaire les préconditions documentées.

Les en-têtes de sécurité sont définis dans `vercel.json` : `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`, `X-Frame-Options: DENY`, `Strict-Transport-Security` et une CSP incluant `frame-ancestors 'none'`. Cette dernière directive est **ignorée par les navigateurs dans une balise `<meta>`** : elle ne figure donc que dans l’en-tête HTTP, et les pages portent la même CSP sans `frame-ancestors`. `npm run check` vérifie cette cohérence pour les 14 pages. Après déploiement, contrôlez les en-têtes réellement servis (`curl -sI https://tchatzsafe.vercel.app/`). Le serveur de développement `tools/server.mjs` n’applique volontairement pas `X-Frame-Options`, pour rester affichable dans un aperçu intégré.

**Une copie locale/une archive/une préparation de commit ne constitue pas un push GitHub.** La publication distante nécessite un accès d’écriture authentifié. Aucun mot de passe ou jeton ne doit être envoyé dans le chat.

La procédure de reprise et publication se trouve dans [docs/PUBLICATION.md](docs/PUBLICATION.md). Le statut réel de la livraison et des vérifications se trouve dans [docs/TESTS.md](docs/TESTS.md).

## Documentation

- [Audit initial et plan priorisé](docs/AUDIT-ET-PLAN.md)
- [Audit correctif : inventaire, preuves et corrections](docs/AUDIT-CORRECTIF-V2.md)
- [Architecture, contrats API et préconditions backend](docs/ARCHITECTURE-ET-API.md)
- [Fonctionnalités opérationnelles et limites](docs/ETAT-FONCTIONNEL.md)
- [Vérifications exécutées](docs/TESTS.md)
- [Publication](docs/PUBLICATION.md)

## Précautions

Le localStorage n’est pas un coffre chiffré. Une personne ayant accès au même profil de navigateur peut lire les brouillons. Ils expirent après 30 jours lors de la prochaine lecture ; la suppression ne peut pas s’effectuer lorsque le navigateur est fermé.

Les données de progression sont liées à l’origine du site. Un aperçu de développement ne voit pas les données de votre domaine Vercel. Utilisez l’export/import si vous changez de domaine.

TchatzSafe est éducatif. Les résultats de quiz et les badges ne sont pas une certification. Les références étrangères expliquent des principes généraux : leurs lois, contacts et procédures ne s’appliquent pas automatiquement au Bénin ou à un autre pays.

## Licences

Les fichiers de polices sont distribués avec leurs licences OFL dans `assets/fonts/`. Les illustrations et icônes de la refonte sont des SVG produits pour ce projet. Le dépôt V1 ne déclarait pas de licence logicielle explicite : cette refonte n’en attribue pas arbitrairement une. Vérifiez les droits applicables avant redistribution.
