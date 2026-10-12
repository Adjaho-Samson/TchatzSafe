# Reprise et publication sur GitHub

## Dépôt de référence

- URL : `https://github.com/Adjaho-Samson/TchatzSafe`
- Branche principale constatée : **master**.
- Commit d’origine : `d07e2cf6757708276cd32cadb4a6845ab5c6f816`.

La refonte conserve cet historique. Aucun renommage de branche ni changement de branche par défaut n’est fait sans raison : « branche principale » correspond actuellement à `master` dans votre dépôt.

## Statut à ne pas surinterpréter

L’environnement de réalisation ne propose pas de connecteur GitHub et aucun accès Git d’écriture authentifié n’a été trouvé. Un clone public fonctionne en lecture, mais cela n’autorise pas un push.

La livraison fournit le source et une sauvegarde Git transportable. **Tant qu’un push n’est pas confirmé par GitHub, le dépôt distant et son site Vercel ne doivent pas être présentés comme mis à jour.** La tentative réelle de `git push origin master` a échoué, code 128 (`unable to get password from user`). Le résultat est consigné dans `TESTS.md`. Aucun push ni déploiement n’est confirmé.

Ne transmettez jamais de mot de passe ni de jeton personnel dans le chat. Utilisez l’authentification Git/GitHub habituelle de votre propre machine.

## Méthode 1 — reprendre le bundle avec historique

Le fichier `TchatzSafe-master.bundle` fourni à côté de l’archive contient l’historique et le commit de refonte. Il ne contient pas de credentials.

```bash
# Dans un dossier où le bundle a été téléchargé
git clone -b master TchatzSafe-master.bundle TchatzSafe-refonte
cd TchatzSafe-refonte

# Remplacer l’origine locale du bundle par votre dépôt GitHub
git remote set-url origin https://github.com/Adjaho-Samson/TchatzSafe.git

# Vérifier qu’aucun nouveau commit distant ne sera écrasé
git fetch origin
git log --oneline --graph --all -8

# Si la branche distante a avancé depuis l’audit, intégrer et retester ses changements.
# Ne pas utiliser --force.

git push origin master
```

En cas de changements concurrents, intégrer les commits distants avec votre workflow habituel, résoudre les conflits et relancer les vérifications avant publication. Le bundle a pour base le commit audité, pas une promesse que la branche distante est restée inchangée.

## Méthode 2 — source de l’archive

Clonez d’abord votre dépôt sur une machine authentifiée, puis recopiez les fichiers de l’archive dans ce clone, **sans remplacer son dossier `.git`**. L’archive de source n’inclut pas de dossier `.git` ni de dépendances installées.

```bash
git clone https://github.com/Adjaho-Samson/TchatzSafe.git
cd TchatzSafe
git switch master
# Copier les fichiers de TchatzSafe-refonte.zip ici, sans imbriquer un dossier supplémentaire.
npm ci
npm run generate
npm run check
npm test
npx playwright install --with-deps chromium
npm run test:e2e
git add .
git commit -m "feat: refonte majeure et pédagogique de TchatzSafe"
git push origin master
```

## Vercel

Si votre projet Vercel est déjà relié à `master`, un push autorisé peut déclencher son déploiement habituel. Vérifiez dans Vercel la branche de production, le preset « Other », la racine du projet et le résultat du déploiement. Les pages HTML générées sont incluses ; aucun backend n’est requis pour cette version.

Ne configurez pas de faux endpoint pour faire disparaître les mentions « démonstration ». Les fonctionnalités réseau devront être réellement implémentées, auditées et documentées avant activation.

## Contrôle après publication

1. Vérifier l’accueil, ses deux CTA et le menu mobile.
2. Ouvrir les anciennes URL de cours/quiz et contrôler une progression V1 valide.
3. Faire un quiz, recharger et vérifier son meilleur score.
4. Examiner un exemple dans l’analyseur : aucun score de risque ni déclaration de sûreté.
5. Préparer un brouillon : statut local, aucun envoi réel.
6. Vérifier les sources, confidentialité, liens et absence de requêtes tiers depuis les formulaires.
7. Confirmer que le déploiement affiche le bon commit, pas seulement que le push a réussi.
