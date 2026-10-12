# État fonctionnel — version prête à tester

## Opérationnel, sans backend

| Fonction        | Implémentation                                                                                                                                                                                                 |
| --------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Accueil         | Titre et sous-titre demandés, deux CTA, six catégories, trois formations, quiz réel de démonstration, prévention, mission, footer et sources                                                                   |
| Interface       | Noir/rouge/gris, SVG légers, polices locales, thème clair/sombre conservé, menu mobile, navigation clavier, réduction des animations                                                                           |
| Apprentissage   | 17 formations : 10 débutant, 5 intermédiaire, 2 avancé ; contenu pédagogique complet et quiz associé pour chaque cours                                                                                         |
| Quiz            | 20 exercices, réponses mélangées, explications, résultats et meilleurs scores locaux                                                                                                                           |
| Progression     | Conservation de la clé V1, migration des données valides, XP/badges corrigés, export/import JSON, réinitialisation confirmée, avertissement et export sur la page courante si stockage bloqué ou quota dépassé |
| Menaces         | 6 fiches : mécanisme, exemple fictif, signes d’alerte, précautions, conduite à tenir, sources                                                                                                                  |
| Conseils        | 6 cartes historiques, dépliants, « Voir plus » et liens profonds conservés/améliorés                                                                                                                           |
| Glossaire       | 13 termes historiques, recherche insensible aux accents, classement et état vide                                                                                                                               |
| Confidentialité | Informations sur le stockage local, les preuves, l’hébergement et les limites ; suppression des brouillons                                                                                                     |
| Routes          | Les 7 pages V1 et leurs paramètres restent utilisables ; nouveaux modules et états explicites pour les identifiants inconnus                                                                                   |

## Démonstrations identifiées dans l’interface

### Analyseur

Lecture locale de règles syntaxiques. Les observations sont réellement calculées à partir de la saisie et expliquées. Elles ne sont pas des résultats d’un antivirus, d’une base de réputation ou d’une visite du site.

**Jamais un score de risque, jamais « lien sûr ».** Aucun indicateur absent ne garantit la sûreté. Un numéro n’apporte qu’un format, pas une identité ou une réputation. Aucune URL soumise n’est visitée. Aucun contenu de ce formulaire n’est transmis ni enregistré.

### Signalement

Le formulaire fonctionne pour préparer un **brouillon privé local**, avec consentement explicite. Il valide le contenu, la description et l’image facultative. Le fichier n’est pas conservé. Les brouillons ont un statut « non transmis » et peuvent être supprimés ; expiration à 30 jours lors de la prochaine lecture.

**L’envoi réel est indisponible.** Rien n’est présenté comme reçu par une équipe ou transmis aux autorités. Un lien vers le site officiel du CNIN est proposé pour une démarche réelle au Bénin, à l’initiative de l’utilisateur.

### Modération

Un atelier montre les brouillons de ce navigateur uniquement, sans faux signalements préchargés. Les notes et changements de statut sont des simulations locales. Il ne constitue pas un espace d’administration sécurisé, ne confirme aucune fraude et ne publie rien.

## Nécessite encore un backend et des décisions produit

- Moteur réel d’analyse, critères et preuves pour toute éventuelle qualification du risque.
- Consentement spécifique avant un appel externe ou une visite de lien ; protections SSRF et isolation si ces opérations sont un jour retenues.
- API privée de réception, suivi réel, stockage protégé et traitement des preuves.
- Authentification, droits de modération, journal d’audit et équipe habilitée.
- Mesures anti-abus côté serveur. Les limites locales ne constituent pas une protection serveur.
- Comptes et synchronisation opt-in de la progression.
- Responsable de traitement/contact et politique adaptée aux pays avant collecte serveur.

Le détail des contrats et préconditions figure dans `ARCHITECTURE-ET-API.md`.

## Préservé plutôt que supprimé

Les 15 cours, 12 quiz, 13 définitions et 6 conseils V1 restent présents. Le thème clair/sombre, les URL profondes, la progression, les meilleurs scores, les XP, les six badges et les filtres de catégories sont conservés. Le regroupement des cours par niveaux remplace la présentation uniquement par catégories ; les filtres de catégories restent disponibles.

Les scripts de pages ont été extraits du HTML ; le shell est partagé et généré statiquement. Il s’agit d’une évolution de l’architecture native, pas d’une migration vers un autre framework. Les anciens exemples « Situation réelle » sont explicitement identifiés comme fictifs. Certaines formulations trop absolues et références périmées ont été corrigées, sans retirer les sujets.

## Ne pas confondre livraison et publication

L’aperçu et les fichiers sont testables. Cela ne signifie ni qu’un backend existe ni que le code a déjà été poussé sur GitHub/déployé sur votre Vercel. La publication distante nécessite un accès d’écriture confirmé ; voir `PUBLICATION.md`.
