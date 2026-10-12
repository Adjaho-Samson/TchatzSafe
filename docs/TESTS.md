# Vérifications exécutées et limites

## Re-vérification du 12 octobre 2026 — audit correctif

Cette section distingue ce qui a été **réellement rejoué** pendant l’audit correctif de ce qui
provient de la livraison précédente et n’a pas pu l’être. L’inventaire des défauts trouvés, leurs
preuves et leurs corrections figure dans `AUDIT-CORRECTIF-V2.md`.

Environnement de l’audit : Node.js **22.22.3**, npm **10.9.8**, Python **3.11.2**, aucun navigateur
installé. Le dépôt ne contient qu’un commit (`aa5f20c`) : le commit de base `d07e2cf` mentionné plus
bas n’existe pas dans cet historique et n’a pas pu être vérifié.

| Contrôle                                 | Statut pendant l’audit                                                              |
| ---------------------------------------- | ----------------------------------------------------------------------------------- |
| `npm ci`                                 | **exécuté, réussi** — lockfile complet, 3 dépendances de développement              |
| `npm run check`                          | **exécuté, réussi** — 14 pages, 964 références locales, 17 cours, 20 quiz, 6 fiches |
| `npm test`                               | **exécuté, réussi** — 36/36 (31 historiques + 5 tests de régression de l’audit)     |
| `npm run generate` ×2                    | **exécuté, réussi** — aucune différence à la seconde exécution : génération stable  |
| `npm audit`                              | **exécuté** — `found 0 vulnerabilities`                                             |
| Contraste WCAG                           | **vérifié par calcul** sur les paires texte/fond des deux thèmes — aucun échec AA   |
| `npm run test:e2e` (92 tests navigateur) | **1/92 exécuté, 91 bloqués** — `npx playwright install chromium` échoue             |
|                                          | (`cdn.playwright.dev` injoignable, `ECONNRESET`) et aucun navigateur système n’est  |
|                                          | présent : 91 tests échouent sur `browserType.launch: Executable doesn’t exist`.     |
|                                          | Le seul test passé est « Aucun backend n’est simulé par le serveur statique », qui  |
|                                          | n’utilise que le fixture HTTP : `POST /api/reports` → **404** et `GET /.git/HEAD` → |
|                                          | **404**, vérifiés réellement contre `tools/server.mjs`                              |
| Mesures de performance / captures        | **non rejouées** — elles dépendent d’un navigateur                                  |
| axe-core WCAG 2.1 AA                     | **non rejoué** — dépend de Chromium ; le contrôle statique ne le remplace pas       |
| Disponibilité des 14 URLs externes       | **non revérifiée** — hôtes externes non autorisés dans cet environnement            |

Les 92 tests navigateur et les mesures présentés ci-dessous proviennent donc de l’exécution
antérieure et **ne doivent pas être cités comme vérifiés à la date de l’audit**. Ils restent à
relancer avant toute publication.

---

Dernière exécution complète : **12 octobre 2026**. Il s’agit de résultats locaux réellement exécutés, pas d’une promesse de conformité ou d’une CI GitHub déjà exécutée.

## Environnement

- Node.js **20.20.2**, Python **3.13.16**.
- Playwright **1.64.0**, Chromium ; axe-core **4.13.0**.
- Serveur statique fourni sur `0.0.0.0:3000`, pas de backend.
- Tests fonctionnels avec la CSP normale. Seul le groupe axe utilise `bypassCSP` pour injecter l’outil d’audit ; aucun formulaire ou quiz ne dépend de ce contournement.

## Résultats finaux

| Contrôle                                               | Résultat                                                                      |
| ------------------------------------------------------ | ----------------------------------------------------------------------------- |
| `npm run check`                                        | 14 pages, 960 références locales, 17 cours, 20 quiz et 6 fiches : OK          |
| `npm test`                                             | **31/31 tests unitaires réussis**, aucun ignoré                               |
| `TEST_BASE_URL=http://127.0.0.1:3000 npm run test:e2e` | **92/92 tests navigateur réussis**, aucun ignoré ; environ 1 min 30 s         |
| Régénération des HTML/sitemap/robots/sprite            | Hashes identiques avant/après : génération déterministe                       |
| `npm audit`                                            | 0 vulnérabilité connue rapportée pour les dépendances installées à cette date |
| Unicode des pages/données                              | Aucun emoji/pictogramme Unicode détecté ; les icônes sont des SVG             |

Le lancement automatique du serveur Playwright sur le port 4173 a également été vérifié : les deux tests ciblés « menu mobile » et « quota/export » réussissent sans `TEST_BASE_URL`. Le workflow GitHub est configuré, mais n’a pas été exécuté sur GitHub dans cet environnement.

Logs complets : `preuves/tests-unitaires.txt` et `preuves/tests-navigateur.txt`. Mesure : `preuves/performance.json`. Les vulnérabilités non connues et celles de l’hébergement ne sont pas couvertes par `npm audit`.

## Ce qui a été contrôlé

### Navigation, interface et responsive

- 14 pages racines et anciennes URL profondes maintenues ; absence d’erreur JavaScript et de ressource locale manquante dans les parcours normaux.
- 17 routes/états à **320, 390, 768, 1024 et 1440 px** : pas de débordement horizontal détecté.
- Menu mobile : ouverture, focus initial, boucle Tab/Shift+Tab, Escape et restauration du focus.
- Thème clair/sombre, préférence persistante, hamburger masqué sur desktop.
- Ancres, filtres, recherche sans accents, états vides et identifiants inconnus.
- Préférence de réduction des animations.
- Avertissement explicite si un script nécessaire ne se charge pas.

### Apprentissage et progression

- Les 15 identifiants de cours et les 12 quiz V1 sont présents.
- Les 17 cours ont objectif, explication, exemple, alertes, bonnes pratiques, résumé, sources et quiz.
- Les données de chaque quiz sont cohérentes ; les cinq cours auparavant sans quiz ouvrent un exercice fonctionnel.
- Quiz complet, corrections, score à 100 %/0 %, réessai, meilleurs scores et persistance après rechargement.
- Quiz de l’accueil réellement interactif et sauvegardé localement.
- XP de leçon attribués une seule fois ; bonus de quiz à 80 % récupéré après amélioration, sans cumul au réessai.
- Conservation des meilleurs scores nuls et des clés historiques ; migration d’une progression V1 valide.
- Export réel JSON, import confirmé et validé, import invalide non destructif, réinitialisation confirmée.
- Stockage bloqué/corrompu : fonctionnement sans crash, pas d’effacement silencieux.
- Quota dépassé : le nouvel état en mémoire prend le dessus sur l’ancienne sauvegarde ; export directement depuis la page du cours avant navigation.
- Suppression persistante refusée : avertissement explicite ; une valeur réellement supprimée ailleurs n’est pas ressuscitée depuis le cache.

### Analyseur et confidentialité

- Rejet des liens mal formés et protocoles non admis, des messages trop courts/longs et des formats de numéros incohérents.
- Observations réellement calculées : HTTP, présence avant `@`, paramètres potentiellement sensibles, raccourcisseurs, IP, port, encodage de domaine et expressions de message.
- Aucun score/niveau de risque, aucune déclaration de sûreté, même sans indicateur.
- Aucune requête externe ni visite du lien saisi, aucune persistance de ce formulaire.
- Une valeur de paramètre secret n’est pas réaffichée dans le résultat.
- Les numéros ne reçoivent ni titulaire, ni localisation, ni réputation inventée.

### Brouillons, preuves et atelier

- Consentement obligatoire pour conserver un brouillon ; validation du contenu et de la description facultative.
- Aucun envoi réel, aucun cas fictif préchargé, aucune publication.
- Entrées HTML traitées comme du texte, pas de script exécuté dans les brouillons.
- Preuves : PNG/JPEG/WebP, maximum 5 Mo, vérification MIME/signature, rejet du SVG et du faux PNG ; aperçu d’une vraie image fictive.
- Retrait de la preuve sans perdre les autres champs ; fichier/nom non conservés, seules les métadonnées admises sont mémorisées.
- Expiration locale à 30 jours lors de la prochaine lecture, limite 20 brouillons et cadence locale de 5 créations/minute.
- Statuts, note de modération simulée, suppression et effacement depuis confidentialité.
- Effacer les brouillons ne supprime pas la progression.
- Les endpoints API inexistants et `.git` restent inaccessibles via le serveur fourni.

## Accessibilité automatisée

**32 contrôles axe** : 16 routes/états en sombre et clair, plus **2 scénarios d’états interactifs** (menu mobile/résultat/analyse/modération, quiz et import). Aucune violation des règles WCAG 2.1 AA couvertes par axe n’a été détectée.

Les problèmes de contraste et de focus du menu identifiés pendant la refonte ont été corrigés et retestés.

**Ce n’est pas une certification d’accessibilité.** Une revue manuelle avec lecteurs d’écran, zoom, appareils et besoins réels reste nécessaire. Safari, Firefox et des téléphones physiques n’ont pas été testés ici.

## Chargement indicatif de l’accueil mobile

Mesure ponctuelle dans Chromium : viewport 390×844, cache désactivé, débit simulé **1,6 Mbit/s**, latence **150 ms**, CPU ralenti **×4**, serveur local sans gzip.

| Mesure                                   | Valeur observée                     |
| ---------------------------------------- | ----------------------------------- |
| First Contentful Paint                   | **1,18 s**                          |
| Largest Contentful Paint                 | **1,18 s**                          |
| Cumulative Layout Shift                  | **0**                               |
| Ressources chargées                      | **22**                              |
| Corps des ressources, hors document HTML | **254 861 octets**, environ 249 Kio |
| Ressource tierce au chargement           | **0**                               |

Ce n’est ni un score Lighthouse, ni une mesure en réseau réel au Bénin, ni une garantie de performance sur tous les appareils. Les captures finales sont dans `captures/`.

## Sources externes et limites

La revue éditoriale est documentée dans `REVUE-SOURCES.md`. Les références finales privilégient des pages lisibles et vérifiables ; les deux contrôles HTTP directs CNIL ont expiré mais leur contenu a été consulté via l’outil web. Une disponibilité future n’est pas garantie.

Aucun test ne démontre une détection réelle de fraude, une authentification de modérateur, un envoi de signalement, une protection anti-abus serveur ou une conformité juridique : **ces services n’existent pas encore**. Les contrôles actuels servent une version frontend transparente, pas un service de sécurité certifié.

## GitHub / Vercel

La branche distante `master` était toujours au commit initial `d07e2cf6757708276cd32cadb4a6845ab5c6f816` lors du contrôle final en lecture. Aucun accès d’écriture authentifié n’a été trouvé. La tentative réelle `git push origin master` a échoué avec le code de sortie **128** : `fatal: unable to get password from user`. Aucun mot de passe/jeton n’a été demandé dans le chat ni inséré dans le dépôt.

**La refonte n’est pas publiée sur GitHub ou Vercel par cette livraison.** Elle est commitée localement sur `master`, avec son historique initial conservé, et fournie en archive/bundle/patch. Une machine authentifiée avec les droits d’écriture est nécessaire pour le push. Aucun `--force` n’a été utilisé.
