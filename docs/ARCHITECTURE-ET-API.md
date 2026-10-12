# Architecture et intégration backend

## État réel de la livraison

Cette version est un site statique HTML/CSS/JavaScript. Elle ne contient aucune fonction serveur ni API de réception, réputation, authentification ou synchronisation. Un appel à `/api/reports` n’est pas une API fonctionnelle. Les endpoints ci-dessous sont des **contrats proposés, non implémentés**.

## Organisation conservée et enrichie

- Pages historiques et liens `apprendre.html?theme=…`, `quiz.html?id=…` conservés.
- Données V1 : `js/data/lessons.js`, `quizzes.js`, `glossary.js`.
- Enrichissement : `curriculum.js` ajoute les objectifs, signes d’alerte, résumés, niveaux, quiz manquants et deux cours avancés. Aucun identifiant V1 n’est supprimé.
- Sources centralisées : `js/data/sources.js`.
- Six fiches : `js/data/threats.js`.
- Composants frontend : `js/components.js`; navigation et utilitaires : `js/main.js`.
- Logique de chaque page : `js/pages/`.
- Dépôts/adaptateurs : `js/services/storage.js`, `reports-repository.js`; `Progress.setRepository` permet de remplacer l’implémentation de stockage sans réécrire les composants.
- Styles centralisés dans les cinq fichiers CSS historiques ; couleurs et typographie définies par tokens.
- Templates statiques : `templates/pages/`, shell commun dans `tools/build-pages.py`. Le HTML généré est versionné : aucun build ou framework n’est nécessaire pour le servir.
- Node.js sert uniquement à l’outillage local, aux tests et au serveur statique de développement. Aucune dépendance JavaScript tierce n’est chargée par le navigateur.

## Migration de la progression

La clé `tchatzsafe_progress` et les identifiants sont conservés. Les données historiques valides sont normalisées à la lecture. Les XP et badges sont recalculés à partir des leçons, quiz et meilleurs scores : cela corrige notamment le bonus de 80 % après amélioration d’un score. Un score de zéro reste zéro.

L’ajout de formations/quiz change le dénominateur du parcours général ; une baisse de ce pourcentage n’efface pas les acquis historiques. Les XP sont pédagogiques, pas une certification.

Le stockage appartient à l’origine du site. Les données de `tchatzsafe.vercel.app` ne sont pas accessibles depuis l’aperçu de développement, qui utilise une autre origine. Une mise à jour sur le même domaine conserve les clés ; un changement de domaine nécessite un export/import manuel.

Une synchronisation future devra maintenir un cache local synchrone pour l’interface, avec une opération réseau asynchrone séparée et explicitement consentie. Le bouton de synchronisation n’existe pas dans cette livraison.

## Analyseur : invariants

`ThreatRules.validate(kind, value)` valide la syntaxe. `ThreatRules.analyze` retourne des observations explicables calculées localement et `risk: null`, `canDetermineSafety: false`, `mode: "local-demo"`.

- Aucun `fetch`, XHR, beacon, résolution DNS ou chargement de page soumise.
- Aucun score ni verdict de sûreté.
- Aucun enregistrement des saisies de l’analyseur.
- Les valeurs de paramètres sensibles ne sont pas réaffichées dans les résultats.
- Une adresse HTTP, un raccourcisseur ou un nom internationalisé peuvent être légitimes : les règles peuvent produire des faux positifs et faux négatifs.
- Un numéro ne permet qu’une vérification syntaxique. L’indicatif, l’attribution, le titulaire et la réputation ne sont pas vérifiés.

### Contrat envisagé : `POST /api/analysis`

À ajouter seulement après choix d’un moteur réel et d’un modèle de confidentialité. Exemple de requête de contrat, pas un appel effectué par cette version :

```json
{
  "kind": "link",
  "value": "contenu expurgé",
  "consent": { "externalLookup": false, "policyVersion": "à définir" }
}
```

La réponse devra inclure : moteur/version, date, provenance des observations, limites, résultat « inconnu » lorsque nécessaire. Un niveau de risque ne pourra être affiché que si des éléments documentés le justifient. Une absence de détection ne devra jamais être convertie en « sûr ».

Une URL reçue ne doit pas être visitée automatiquement par défaut. Toute future visite explicitement autorisée impose des défenses SSRF (réseaux internes, loopback, metadata cloud, DNS rebinding), une limitation des redirections et tailles, un environnement isolé et un consentement spécifique. L’appel à un fournisseur externe nécessite aussi un consentement explicite et une politique sur les URL contenant des secrets.

## Signalements : fonctionnement local actuel

`ReportRepository` expose `list`, `add`, `remove`, `setStatus`, `clear`. Les traitements UI sont prévus pour pouvoir attendre une future implémentation asynchrone.

- Consentement requis avant la création d’un brouillon local.
- 20 brouillons maximum ; 5 créations/minute dans le navigateur. Ces contrôles sont contournables et **ne constituent pas une protection serveur**.
- Description facultative : 1 000 caractères.
- Preuve facultative : PNG/JPEG/WebP, maximum 5 Mo, type/signature vérifiés avant prévisualisation. Ce contrôle local n’est pas une analyse antivirus.
- Les octets et le nom du fichier ne sont ni envoyés ni conservés. Seuls type/taille peuvent être mémorisés.
- Expiration 30 jours après création ; purge lors de la prochaine lecture, pas lorsque le navigateur est fermé.
- Stockage privé au navigateur, non chiffré séparément. Toute personne ayant accès au même profil peut le lire.
- Statuts disponibles : brouillon local, revue simulée, classement local. Tous restent « non transmis ».
- Aucun signalement public, aucune liste de numéros, aucune fraude confirmée, aucune authentification de modération réelle.

### Contrats envisagés (non disponibles)

| Endpoint                            | Rôle futur                                                 |
| ----------------------------------- | ---------------------------------------------------------- |
| `POST /api/reports`                 | Réception privée après consentement et contrôles serveur   |
| `GET /api/reports/:id`              | Suivi par le déclarant autorisé ; identifiant imprévisible |
| `DELETE /api/reports/:id`           | Suppression selon politique et obligations applicables     |
| `POST /api/reports/:id/evidence`    | Upload autorisé, isolé, limité, traité en quarantaine      |
| `GET /api/moderation/reports`       | File privée accessible uniquement aux personnes habilitées |
| `PATCH /api/moderation/reports/:id` | Décision motivée, droits contrôlés, journal d’audit        |
| `GET/PUT /api/me/progress`          | Synchronisation d’un compte authentifié, opt-in explicite  |

### Préconditions avant activation

1. Responsable de traitement et contact identifiés ; politique légale adaptée aux pays visés.
2. TLS, sessions sécurisées, authentification, RBAC, contrôle d’accès par objet, CSRF si cookies utilisés.
3. Validation serveur indépendante du client ; limites de tailles, fréquences et quotas ; détection de spam et mécanisme anti-robot proportionné.
4. Preuves stockées hors du site public, contrôle de signature/MIME et scan, métadonnées retirées si nécessaire, URL temporaires autorisées.
5. Réception privée et modération humaine ; distinguer « signalé », « suspect » et « établi ». Prévoir corrections, contestations et traçabilité.
6. Pas de publication automatique d’une accusation. Les données personnelles ne doivent pas devenir une liste publique par défaut.
7. Journaux minimisés et accès restreints ; ne pas écrire les messages, codes, URL privées ou preuves dans des logs publics.
8. Rétention, sauvegardes, suppression et exports définis ; examen des risques avant mise en production.
9. Réviser la CSP : `connect-src 'none'` empêche actuellement les appels API. Autoriser uniquement les destinations nécessaires après activation explicite et consentement.
10. Retirer ou protéger l’atelier statique de modération lors de l’introduction d’un véritable espace d’administration. L’atelier ne doit jamais être confondu avec une authentification.

## Durcissement et performance actuels

Polices auto-hébergées avec licences, illustration SVG légère et sans animation, pas de CDN, pas de bibliothèque frontend, pas de tracker. Les formulaires n’utilisent pas de paramètres `name` et leurs boutons d’enregistrement sont inactifs avant JavaScript : pas de fuite de saisie via un envoi HTML par défaut.

La CSP interdit les connexions API, les objets et les scripts tiers. `style-src 'unsafe-inline'` est nécessaire aux pourcentages des barres de progression rendues actuellement. Cela ne remplace pas l’échappement des données, les contrôles serveur ni un audit de sécurité complet. Aucun `X-Frame-Options: DENY` n’est ajouté afin de permettre l’aperçu intégré ; une politique d’intégration de production pourra être définie selon les besoins réels.

## Hébergement

Servir les fichiers statiques à la racine. Sur Vercel : preset « Other », pas de commande de build obligatoire, output directory `.`. Le fichier `vercel.json` conserve les routes `.html` et ajoute des en-têtes de base. Les templates, outils et tests n’ont pas besoin d’être servis publiquement ; le serveur de développement les bloque.

La livraison a été testée sur le serveur statique local. Elle n’a pas été annoncée comme déjà déployée sur votre Vercel, ni comme dotée d’un backend opérationnel.
