# Revue des références de sécurité

Revue finale : **12 octobre 2026**. Les 14 références sont centralisées dans `js/data/sources.js` et réutilisées dans les cours, fiches et conseils. Les exemples de la plateforme sont fictifs ; les sources ne constituent ni un partenariat ni une approbation de TchatzSafe.

## Vérifications et portée

| Clé         | Référence                                            | Contrôle effectué                                       | Limite de portée                                                                                               |
| ----------- | ---------------------------------------------------- | ------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| phishing    | Cybermalveillance — Hameçonnage                      | Lecture du contenu + HTTP 200                           | Recours juridiques français, pas transposés automatiquement au Bénin                                           |
| shopping    | Cybermalveillance — Usurpation de site professionnel | Lecture du contenu + HTTP 200                           | Même distinction entre mécanisme et démarches françaises                                                       |
| whatsapp    | Aide WhatsApp — Vérification en deux étapes          | HTTP 200 après redirection, titre de l’article confirmé | Le lien peut rediriger vers l’anglais et limiter la lecture automatisée ; la langue affichée est anglais       |
| account     | Cybermalveillance — Piratage de compte               | Lecture du contenu + HTTP 200                           | Compléter avec l’aide officielle du service concerné                                                           |
| password    | CNIL — Mots de passe                                 | Lecture réussie via l’outil web                         | Le contrôle HTTP direct a expiré ; aucun statut 200 direct final n’est inventé                                 |
| personal    | CNIL — Donnée personnelle                            | Lecture réussie via l’outil web                         | Même limite du contrôle HTTP direct ; définition générale, pas avis juridique local                            |
| jobs        | Cybermalveillance — Fausse annonce d’emploi          | Lecture du contenu + HTTP 200                           | Usurpation/frais/collecte de données ; démarches de droit français non reprises comme démarches béninoises     |
| investments | AMF — Éviter les arnaques                            | Lecture du contenu + HTTP 200                           | L’AMF est française ; contacter l’autorité compétente de son pays pour une démarche                            |
| prizes      | Cybermalveillance — Dossier JOP 2024, section 4      | Lecture du contenu + HTTP 200                           | Seuls les mécanismes généraux de faux concours sont retenus ; l’événement 2024 n’est pas présenté comme actuel |
| momo        | MTN Cameroun — MoMo Account Management               | Lecture du contenu + HTTP 200                           | Conseils de confidentialité du PIN ; codes/procédures propres au Cameroun, pas mode d’emploi béninois          |
| android     | Google Play — Play Protect                           | HTTP 200 et titre confirmé                              | Réglages Android variables, aucune garantie qu’une application soit sûre                                       |
| permissions | Google — Autorisations Android                       | HTTP 200 et titre confirmé                              | Options dépendantes de la version et du fabricant                                                              |
| cnin        | CNIN Bénin — Site officiel                           | HTTP 200 et titre confirmé                              | Démarche réelle à effectuer directement sur le canal officiel ; aucun envoi depuis TchatzSafe                  |
| anssi       | Cyber.gouv.fr                                        | HTTP 200 et titre confirmé                              | Ressources institutionnelles, pas un moteur de réputation connecté                                             |

Les URL exactes sont dans le registre et dans la page `sources.html`. Le contrôle structurel local n’interroge pas ces sites externes. Une vérification ponctuelle ne garantit pas la disponibilité future d’une page.

## Liens remplacés pendant la revue

- Anciennes pages Google et WhatsApp absentes ou retournant un contenu « Page not found » : remplacement par des références pertinentes dont le titre a été vérifié.
- Anciennes URL FTC pour concours/achats : retirées.
- Les trois références FTC initialement consultées via l’outil web ont renvoyé 404 depuis le contrôleur HTTP final, **y compris la page d’accueil du domaine**. Cela ne permet pas d’affirmer que tous ces articles ont été supprimés : le contrôle passe par un serveur Akamai qui peut filtrer l’environnement. Elles ont néanmoins été remplacées par des références francophones lisibles et vérifiables ici (Cybermalveillance et AMF), plutôt que d’annoncer des liens externes validés sans preuve.

## Règles éditoriales maintenues

- Aucun indicateur isolé ne prouve une fraude.
- HTTPS chiffre une connexion mais ne garantit pas la légitimité du site.
- Le format d’un numéro ne valide ni son attribution ni son propriétaire.
- Un lien raccourci ou un nom internationalisé n’est pas automatiquement frauduleux.
- Un service externe d’analyse peut recevoir l’URL soumise ; ne pas lui transmettre une adresse contenant un secret ou une donnée privée sans comprendre ses conditions.
- Pas de statistiques d’arnaques inventées, de cas accusatoires préchargés ni de promesse de protection absolue.
- Pas de numéro d’urgence ni de procédure judiciaire étrangère présentés comme universels.
