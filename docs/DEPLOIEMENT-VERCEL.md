# Déploiement et mesure d’audience Vercel

État au 1er novembre 2026. Le dépôt prépare l’intégration, mais **l’accès au compte Vercel et l’activation du service n’ont pas été disponibles pendant ce travail**. Aucune donnée de production n’a été observée et aucun chiffre n’est fabriqué.

## 1. Publier le site

1. Dans le dépôt, exécuter `npm ci`, `npm run generate`, `npm run check`, `npm test` et les tests navigateur. S’assurer que les pages générées, `assets/icons.svg` et `sw.js` sont à jour avant de publier.
2. Dans le projet Vercel connecté à ce dépôt, déployer la révision validée. Le projet est statique : le préréglage **Other** et la racine du dépôt conviennent ; les fichiers HTML générés sont déjà présents, aucune fonction serveur ni clé d’environnement n’est nécessaire. Si Vercel est configuré pour générer pendant le build, exécuter `npm run generate` après l’installation des dépendances et servir la racine du projet.
3. Vérifier le domaine HTTPS de production, `manifest.webmanifest`, les icônes et la réponse de `sw.js`. Le fichier `vercel.json` empêche la mise en cache longue du service worker et définit notamment la CSP de production. L’installation et le mode hors ligne requièrent HTTPS ou `localhost`.
4. Après un changement de fichiers précachés, régénérer `sw.js`. La nouvelle version attend l’action de l’utilisateur ; le bouton « Mettre à jour » l’active et recharge la page. Après un premier chargement en ligne réussi, vérifier la navigation hors connexion, puis le retour en ligne.

## 2. Activer la mesure d’audience facultative

1. Se connecter au tableau de bord Vercel avec un compte autorisé à administrer le projet, choisir le bon projet et ouvrir **Analytics / Web Analytics**.
2. Activer **Web Analytics** selon l’interface du compte. Vérifier les limites, la conservation et les éventuels coûts du plan utilisé, puis redéployer le projet comme indiqué par Vercel. Aucun jeton Vercel ne doit être placé dans le code ou dans le navigateur.
3. Depuis un navigateur ordinaire sur le domaine de production, sans GPC ni Do Not Track activé, ouvrir le site. Dans les outils réseau, vérifier qu’aucune requête `/_vercel/insights/` ne part avant le choix. Refuser : le script ne doit pas être chargé. Rouvrir « Préférences de confidentialité » dans le pied de page, puis accepter : `/_vercel/insights/script.js` et les requêtes de mesure fournies par Vercel doivent alors fonctionner. Vérifier les réponses réseau et le tableau de bord après le délai de traitement indiqué par Vercel.
4. Revenir aux préférences et refuser : les événements suivants doivent être bloqués. Vérifier aussi un navigateur avec GPC ou Do Not Track. Les bloqueurs, signaux de confidentialité, refus, pannes réseau et filtres anti-bots peuvent réduire les chiffres. Les tests automatisés en navigateur sans interface peuvent également être exclus par Vercel.
5. Si le script reste indisponible, contrôler l’activation, le redéploiement, le domaine, le plan et les bloqueurs réseau. Le serveur de développement local ne fournit pas `/_vercel/insights/script.js` : il est normal de ne pas y voir de collecte réelle.

Le script de Vercel est appelé par une route de la même origine. `js/analytics.js` enregistre `beforeSend` avant son chargement, n’autorise que les vues de pages connues et retire paramètres et fragments. Comme le collecteur lit aussi `document.referrer` indépendamment de `beforeSend`, le référent est réduit à son origine avant le chargement ; si cette réduction est impossible, la mesure reste inactive. Les événements personnalisés, identifications et traits ne sont pas envoyés par cette intégration. Une ancienne donnée `__va_attribution` détectée sur l’appareil bloque également la mesure, sans supprimer cette donnée. Aucun résultat de formulaire, lien analysé, brouillon ou progression n’est transmis.

**Point de confidentialité important :** selon Vercel, un identifiant technique haché dérivé de la requête est utilisé pour estimer les visiteurs et écarté après 24 heures. Ce n’est pas un suivi persistant intersites ajouté par TchatzSafe, mais cela reste une identification technique éphémère. Si la politique du projet exclut toute forme d’empreinte, même éphémère, ne pas activer Vercel Web Analytics ; il faudra choisir une autre méthode et réévaluer la possibilité de compter les visiteurs uniques. Faire valider la politique de confidentialité et les obligations applicables au Bénin et aux autres publics par le responsable du site.

## 3. Accès administrateur et lecture des métriques

L’espace de consultation est le **tableau de bord Vercel authentifié**, pas une page HTML du site. Limiter les membres et rôles du projet aux personnes autorisées, activer une authentification forte selon les options du compte et vérifier régulièrement les accès. Aucun tableau ou endpoint privé n’a été exposé publiquement. La page `moderation.html` reste une simulation locale de gestion de brouillons : elle n’est pas protégée par une authentification et ne doit jamais être utilisée comme tableau d’administration.

Dans Analytics, choisir la période et distinguer :

- **Visitors** : estimation des visiteurs distincts selon la méthode de Vercel ; le renouvellement quotidien de l’identifiant empêche de considérer la somme des visiteurs journaliers comme un nombre de personnes distinctes sur un mois.
- **Page Views** : nombre de pages vues, différent du nombre de visiteurs et d’un nombre de sessions. Le site ne calcule pas un compteur indépendant de « visites » ou de sessions.
- Pages, référents d’origine, pays/régions et types d’appareils disponibles selon l’interface et le plan ; les informations géographiques restent approximatives.

L’interface permet de sélectionner des périodes ; les détails de graphiques, regroupements, export et historique dépendent de la version et du plan Vercel. Pour obtenir des vues journalières, un administrateur peut aussi utiliser la CLI Vercel authentifiée, sans exposer de secret côté client :

```bash
vercel metrics schema vercel.analytics
vercel metrics vercel.analytics.page_view.count --since 7d --granularity 1d --project NOM_DU_PROJET --prod
```

Un total mensuel de pages vues peut être calculé à partir des jours du mois lorsque la période est disponible. Ne pas en déduire des visiteurs uniques mensuels en additionnant les visiteurs quotidiens. Les données antérieures à l’activation ne peuvent pas être reconstituées et le consentement rend l’échantillon incomplet.

## Références officielles

- [Activation et instrumentation](https://vercel.com/docs/analytics/quickstart)
- [Fonctionnement et indicateurs](https://vercel.com/docs/analytics)
- [Confidentialité et données](https://vercel.com/docs/analytics/privacy-policy)
- [Masquage des données sensibles](https://vercel.com/docs/analytics/redacting-sensitive-data)
- [Métriques par CLI](https://vercel.com/docs/analytics/accessing-metrics-with-vercel-cli)
- [Limites et tarification](https://vercel.com/docs/analytics/limits-and-pricing)
