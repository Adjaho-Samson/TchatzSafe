const QUIZZES = {
  // Quiz par thème - 5 questions chacun
  phishing: {
    id: "phishing",
    title: "Quiz : Phishing",
    description: "Testez votre capacité à reconnaître les tentatives d'hameçonnage.",
    themeId: "phishing",
    level: "débutant",
    questions: [
      {
        id: "ph1",
        question: "Vous recevez un SMS vous indiquant que votre colis est bloqué et vous demandant de cliquer sur un lien pour le libérer. Quelle est la meilleure réaction ?",
        options: [
          "Cliquer immédiatement pour ne pas perdre le colis",
          "Ignorer le message ou vérifier sur le site officiel du transporteur",
          "Répondre au SMS pour demander plus d'informations",
          "Transférer le lien à un ami pour qu'il vérifie"
        ],
        correct: 1,
        explanation: "Les vrais transporteurs ne demandent pas de « libérer » un colis via un lien reçu par SMS. En cliquant, vous risquez d'atterrir sur un faux site qui vole vos identifiants ou vos moyens de paiement.",
        notion: "L'urgence est un outil classique du phishing. Prenez toujours le temps de vérifier par un autre canal."
      },
      {
        id: "ph2",
        question: "Quel élément doit le plus vous alerter dans un email ?",
        options: [
          "La présence d'un logo d'entreprise connue",
          "Une adresse d'expéditeur légèrement différente de l'adresse officielle",
          "Un message écrit en français correct",
          "L'absence de fautes d'orthographe"
        ],
        correct: 1,
        explanation: "Les attaquants imitent souvent le nom affiché mais utilisent une adresse email différente (par exemple support@entreprise-secure.com au lieu de support@entreprise.com). C'est l'un des indices les plus fiables.",
        notion: "Vérifiez toujours l'adresse email complète, pas seulement le nom affiché."
      },
      {
        id: "ph3",
        question: "Un message WhatsApp d'un « ami » vous demande de cliquer sur un lien pour voir une vidéo de vous. Que faire ?",
        options: [
          "Cliquer car c'est un ami",
          "Contacter cet ami par un autre moyen pour vérifier",
          "Télécharger la vidéo sans cliquer sur le lien",
          "Partager le lien avec d'autres personnes"
        ],
        correct: 1,
        explanation: "Le compte de votre ami a peut-être été piraté. Un simple appel ou SMS permet de vérifier si le message vient bien de lui avant de prendre le moindre risque.",
        notion: "Même les messages provenant de contacts connus peuvent être dangereux si le compte a été compromis."
      },
      {
        id: "ph4",
        question: "Le protocole https (cadenas dans le navigateur) garantit-il qu'un site est sûr ?",
        options: [
          "Oui, totalement",
          "Non, il garantit seulement que la connexion est chiffrée",
          "Oui, s'il y a aussi un logo officiel",
          "Oui, si le site charge rapidement"
        ],
        correct: 1,
        explanation: "https protège les données en transit entre votre navigateur et le serveur. Cela n'empêche pas un site malveillant d'exister et d'utiliser https. Le nom de domaine reste l'élément à vérifier en priorité.",
        notion: "https ≠ site honnête. Cela signifie seulement « connexion chiffrée »."
      },
      {
        id: "ph5",
        question: "Quelle est la meilleure habitude face à un message urgent demandant une action immédiate ?",
        options: [
          "Agir vite pour éviter les conséquences annoncées",
          "Prendre le temps de vérifier l'information par un canal officiel",
          "Demander conseil uniquement dans les commentaires du message",
          "Transférer le message à tous ses contacts"
        ],
        correct: 1,
        explanation: "Les attaquants créent un sentiment d'urgence pour court-circuiter votre réflexion. Quelques minutes de vérification suffisent souvent à déjouer la tentative.",
        notion: "L'urgence est un signal d'alerte, pas une raison d'agir sans réfléchir."
      }
    ]
  },
  "liens-suspects": {
    id: "liens-suspects",
    title: "Quiz : Liens suspects",
    description: "Apprenez à identifier un lien dangereux avant de cliquer.",
    themeId: "liens-suspects",
    level: "débutant",
    questions: [
      {
        id: "ls1",
        question: "Avant de cliquer sur un lien reçu par message, que devez-vous faire en priorité ?",
        options: [
          "Vérifier que le message contient un emoji",
          "Regarder l'URL réelle (en survolant ou en appuyant longuement)",
          "Compter le nombre de caractères du lien",
          "Vérifier l'heure d'envoi du message"
        ],
        correct: 1,
        explanation: "L'URL affichée n'est pas toujours l'URL réelle. Sur mobile comme sur ordinateur, il est possible d'afficher la destination complète avant de cliquer.",
        notion: "Toujours inspecter le vrai lien avant de l'ouvrir."
      },
      {
        id: "ls2",
        question: "Parmi ces domaines, lequel est le plus suspect pour un site de banque ?",
        options: [
          "banque.com",
          "banque-securite-client.com",
          "www.banque.com",
          "banque.fr"
        ],
        correct: 1,
        explanation: "Les attaquants ajoutent souvent des mots rassurants (securite, client, login) pour créer de faux domaines. Le domaine officiel est généralement simple et stable.",
        notion: "Un domaine trop long ou trop « rassurant » doit éveiller la méfiance."
      },
      {
        id: "ls3",
        question: "Les liens raccourcis (bit.ly, tinyurl…) sont-ils toujours dangereux ?",
        options: [
          "Oui, toujours",
          "Non, mais ils masquent la destination réelle, donc prudence",
          "Non, ils sont plus sûrs que les liens longs",
          "Oui, sauf s'ils viennent d'un ami"
        ],
        correct: 1,
        explanation: "Un lien raccourci peut pointer vers un site légitime ou malveillant. Le problème est que vous ne voyez pas la destination. Utilisez-les avec prudence, surtout s'ils viennent d'inconnus.",
        notion: "Un lien court cache la destination : c'est le principal risque."
      },
      {
        id: "ls4",
        question: "Vous voulez vérifier un lien suspect. Quel outil peut vous aider ?",
        options: [
          "Un moteur de recherche quelconque",
          "VirusTotal (analyse d'URL)",
          "Un simple traducteur",
          "Le correcteur d'orthographe"
        ],
        correct: 1,
        explanation: "VirusTotal permet de soumettre une URL et d'obtenir l'avis de plusieurs moteurs antivirus. C'est un outil utile, mais il ne remplace pas la prudence : ne soumettez jamais d'informations personnelles.",
        notion: "Des outils d'analyse existent, mais la première ligne de défense reste votre vigilance."
      },
      {
        id: "ls5",
        question: "Un lien commence par https et affiche un cadenas. Cela signifie-t-il que vous pouvez cliquer sans risque ?",
        options: [
          "Oui",
          "Non",
          "Oui si le site est rapide",
          "Oui si le design est professionnel"
        ],
        correct: 1,
        explanation: "https indique que la connexion est chiffrée. Un site de phishing peut parfaitement utiliser https. Ce n'est pas une preuve de légitimité.",
        notion: "Le cadenas ne garantit pas que le site est honnête."
      }
    ]
  },
  "mots-de-passe": {
    id: "mots-de-passe",
    title: "Quiz : Mots de passe",
    description: "Vérifiez vos connaissances sur les bons mots de passe.",
    themeId: "mots-de-passe",
    level: "débutant",
    questions: [
      {
        id: "mdp1",
        question: "Quelle caractéristique est la plus importante pour un mot de passe solide ?",
        options: [
          "Contenir uniquement des symboles",
          "Être long (au moins 12 caractères) et unique",
          "Être facile à retenir comme une date de naissance",
          "Être le même sur tous les comptes pour ne pas l'oublier"
        ],
        correct: 1,
        explanation: "La longueur et l'unicité sont les critères les plus importants. Un mot de passe long est beaucoup plus difficile à casser par force brute.",
        notion: "Longueur + unicité > complexité artificielle."
      },
      {
        id: "mdp2",
        question: "Pourquoi est-il dangereux de réutiliser le même mot de passe sur plusieurs sites ?",
        options: [
          "Parce que c'est interdit par la loi",
          "Parce que si un site est piraté, les autres comptes deviennent vulnérables",
          "Parce que les sites le détectent automatiquement",
          "Parce que cela ralentit la connexion"
        ],
        correct: 1,
        explanation: "Si un service est compromis et que votre mot de passe fuit, les attaquants testent automatiquement ce couple email/mot de passe sur d'autres sites populaires.",
        notion: "Un mot de passe unique par compte limite les dégâts en cas de fuite."
      },
      {
        id: "mdp3",
        question: "Quelle est une bonne pratique pour gérer de nombreux mots de passe ?",
        options: [
          "Les écrire tous sur un papier collé à l'écran",
          "Utiliser un gestionnaire de mots de passe",
          "Les stocker dans les notes non verrouillées du téléphone",
          "Utiliser le même avec une variante facile (123, 456…)"
        ],
        correct: 1,
        explanation: "Un gestionnaire de mots de passe permet de générer et de stocker des mots de passe uniques et complexes. Vous n'avez à retenir que le mot de passe maître.",
        notion: "Les gestionnaires de mots de passe sont recommandés par les experts en sécurité."
      },
      {
        id: "mdp4",
        question: "La double authentification (2FA) sert à :",
        options: [
          "Remplacer complètement le mot de passe",
          "Ajouter une seconde vérification en plus du mot de passe",
          "Accélérer la connexion",
          "Partager l'accès avec un proche"
        ],
        correct: 1,
        explanation: "Même si quelqu'un connaît votre mot de passe, il lui manque le second facteur (code SMS, application d'authentification, clé physique) pour se connecter.",
        notion: "La 2FA bloque la majorité des attaques basées uniquement sur le vol de mot de passe."
      },
      {
        id: "mdp5",
        question: "Parmi ces mots de passe, lequel est le plus faible ?",
        options: [
          "Tr0p!c@l2024Soleil",
          "Jean1990",
          "xK9#mP2$vL8@nQ4",
          "Ma phrase secrete de jardin 2024"
        ],
        correct: 1,
        explanation: "Jean1990 combine un prénom et une année, des éléments souvent devinables ou trouvables sur les réseaux sociaux. Les autres options sont plus longues ou plus aléatoires.",
        notion: "Évitez les informations personnelles dans vos mots de passe."
      }
    ]
  },
  "vol-de-compte": {
    id: "vol-de-compte",
    title: "Quiz : Vol de compte",
    description: "Que faire face à un compte compromis ?",
    themeId: "vol-de-compte",
    level: "débutant",
    questions: [
      {
        id: "vc1",
        question: "Vous suspectez que votre compte Facebook a été piraté. Quelle est la première action prioritaire ?",
        options: [
          "Publier un message pour prévenir vos amis",
          "Changer le mot de passe et déconnecter les autres sessions",
          "Créer un nouveau compte immédiatement",
          "Attendre de voir si le problème se résout seul"
        ],
        correct: 1,
        explanation: "Changer le mot de passe et terminer les sessions actives permet de reprendre le contrôle rapidement. Ensuite seulement, prévenez vos contacts.",
        notion: "Agir vite sur le mot de passe et les sessions limite les dégâts."
      },
      {
        id: "vc2",
        question: "Un proche vous dit avoir reçu des messages étranges de votre part. Que devez-vous faire ?",
        options: [
          "Ignorer, ce n'est probablement rien",
          "Vérifier immédiatement l'activité de votre compte et sécuriser l'accès",
          "Lui demander de répondre aux messages",
          "Supprimer votre compte"
        ],
        correct: 1,
        explanation: "Des messages inhabituels envoyés en votre nom sont un signe classique de compte compromis. Vérifiez et sécurisez sans attendre.",
        notion: "Les retours de vos contacts sont souvent le premier signal d'alerte."
      },
      {
        id: "vc3",
        question: "Après avoir récupéré l'accès à un compte piraté, que faut-il aussi vérifier ?",
        options: [
          "Uniquement le mot de passe",
          "Les appareils connectés, les applications liées et l'adresse email de récupération",
          "Seulement les publications récentes",
          "Rien d'autre"
        ],
        correct: 1,
        explanation: "Un attaquant peut avoir ajouté un appareil, une application ou modifié l'email de récupération pour conserver un accès. Tout doit être contrôlé.",
        notion: "Sécuriser un compte ne se limite pas au changement de mot de passe."
      },
      {
        id: "vc4",
        question: "Pourquoi activer la double authentification réduit-il le risque de vol de compte ?",
        options: [
          "Parce que le mot de passe devient inutile",
          "Parce que l'attaquant a besoin d'un second élément qu'il ne possède généralement pas",
          "Parce que cela rend le compte invisible",
          "Parce que cela change automatiquement le mot de passe"
        ],
        correct: 1,
        explanation: "Même avec le bon mot de passe, sans le second facteur (code, notification, clé), la connexion est refusée dans la plupart des cas.",
        notion: "La 2FA est l'une des mesures les plus efficaces contre le vol de compte."
      },
      {
        id: "vc5",
        question: "Quelqu'un vous contacte en se présentant comme le support technique et vous demande votre mot de passe pour « vérifier votre compte ». Que faire ?",
        options: [
          "Le donner car c'est le support",
          "Refuser et ne jamais communiquer son mot de passe",
          "Le donner uniquement par téléphone",
          "Lui demander d'abord son numéro d'employé"
        ],
        correct: 1,
        explanation: "Aucun support légitime ne demande votre mot de passe. C'est une technique d'ingénierie sociale classique.",
        notion: "Votre mot de passe ne se communique jamais, à personne."
      }
    ]
  },
  whatsapp: {
    id: "whatsapp",
    title: "Quiz : WhatsApp",
    description: "Sécurisez votre compte et reconnaissez les arnaques WhatsApp.",
    themeId: "whatsapp",
    level: "débutant",
    questions: [
      {
        id: "wa1",
        question: "Quelqu'un vous demande le code à 6 chiffres que WhatsApp vient de vous envoyer par SMS. Que faire ?",
        options: [
          "Le lui donner pour l'aider",
          "Ne jamais le communiquer",
          "Le donner uniquement s'il prétend être un proche",
          "Le donner s'il s'agit du support WhatsApp"
        ],
        correct: 1,
        explanation: "Ce code permet de prendre le contrôle de votre compte WhatsApp. WhatsApp ne vous le demandera jamais par message. Toute personne qui le demande cherche à usurper votre identité.",
        notion: "Le code SMS WhatsApp est strictement personnel et ne se partage jamais."
      },
      {
        id: "wa2",
        question: "Où active-t-on la vérification en deux étapes sur WhatsApp ?",
        options: [
          "Dans les paramètres de conversation",
          "Dans Paramètres > Compte > Vérification en deux étapes",
          "Uniquement sur le site web de WhatsApp",
          "Cela s'active automatiquement"
        ],
        correct: 1,
        explanation: "La vérification en deux étapes ajoute un code PIN personnel. Même si quelqu'un obtient le SMS de vérification, il ne pourra pas finaliser l'accès sans ce PIN.",
        notion: "Activez la vérification en deux étapes dès que possible."
      },
      {
        id: "wa3",
        question: "Un message vous propose d'installer une application pour « sécuriser votre WhatsApp ». Quelle est la bonne attitude ?",
        options: [
          "L'installer immédiatement",
          "Ignorer et n'installer des applications que depuis les stores officiels",
          "La partager avec vos contacts",
          "L'installer uniquement si le message vient d'un ami"
        ],
        correct: 1,
        explanation: "WhatsApp n'a pas besoin d'application tierce pour être sécurisé. Ces propositions cachent souvent des logiciels malveillants.",
        notion: "WhatsApp se suffit à lui-même. Méfiez-vous des applications « de sécurité » non officielles."
      },
      {
        id: "wa4",
        question: "Votre compte WhatsApp a été pris par quelqu'un d'autre. Que faire en priorité ?",
        options: [
          "Attendre 24 heures",
          "Réinstaller WhatsApp sur votre téléphone et suivre la procédure de récupération",
          "Créer un compte avec un autre numéro uniquement",
          "Envoyer un email à tous vos contacts"
        ],
        correct: 1,
        explanation: "En réinstallant WhatsApp et en demandant un nouveau code de vérification, vous pouvez parfois récupérer le compte. Activez ensuite la vérification en deux étapes.",
        notion: "Agissez vite et utilisez les procédures officielles de récupération."
      },
      {
        id: "wa5",
        question: "Pourquoi la vérification en deux étapes de WhatsApp est-elle importante ?",
        options: [
          "Elle change votre numéro automatiquement",
          "Elle empêche la prise de contrôle même si quelqu'un reçoit le SMS de vérification",
          "Elle crypte vos messages davantage",
          "Elle est obligatoire pour utiliser les appels vidéo"
        ],
        correct: 1,
        explanation: "Sans le PIN de la vérification en deux étapes, un attaquant qui a intercepté le SMS ne peut pas terminer l'inscription de votre numéro sur un autre appareil.",
        notion: "Le PIN WhatsApp est une barrière supplémentaire essentielle."
      }
    ]
  },
  "mobile-money": {
    id: "mobile-money",
    title: "Quiz : Mobile Money",
    description: "Protégez vos transactions et votre argent mobile.",
    themeId: "mobile-money",
    level: "débutant",
    questions: [
      {
        id: "mm1",
        question: "Un prétendu agent vous appelle et vous demande votre code PIN Mobile Money pour « vérifier votre compte ». Que faire ?",
        options: [
          "Le donner car c'est un agent",
          "Raccrocher et ne jamais communiquer votre code",
          "Le donner uniquement les 2 premiers chiffres",
          "Lui demander de rappeler plus tard"
        ],
        correct: 1,
        explanation: "Aucun opérateur légitime ne demande votre code PIN par téléphone. C'est une arnaque très répandue visant à vider votre compte.",
        notion: "Votre code PIN Mobile Money ne se communique jamais."
      },
      {
        id: "mm2",
        question: "On vous annonce que vous avez gagné un concours et qu'il faut envoyer de l'argent pour « frais de retrait ». Quelle est la bonne réaction ?",
        options: [
          "Envoyer la somme demandée pour récupérer le gain",
          "Ignorer : on ne paie jamais pour recevoir un lot",
          "Négocier le montant des frais",
          "Demander à un proche d'envoyer l'argent à votre place"
        ],
        correct: 1,
        explanation: "C'est un schéma classique d'arnaque. Les frais demandés ne mènent jamais au gain annoncé.",
        notion: "Un vrai gain ne demande pas de paiement préalable."
      },
      {
        id: "mm3",
        question: "Avant de valider un transfert Mobile Money, que devez-vous absolument vérifier ?",
        options: [
          "La couleur de l'interface",
          "Le numéro et le nom du destinataire",
          "La météo",
          "Le solde de l'opérateur"
        ],
        correct: 1,
        explanation: "Une erreur de numéro ou un destinataire mal intentionné peut rendre l'argent irrécupérable. Prenez toujours le temps de vérifier.",
        notion: "Vérifiez deux fois le destinataire avant de confirmer."
      },
      {
        id: "mm4",
        question: "Quelqu'un vous dicte un code USSD à composer pour « activer une promotion ». Que faire ?",
        options: [
          "Composer le code immédiatement",
          "Refuser : ne composez jamais un code dicté par un inconnu",
          "Le composer sur le téléphone d'un ami",
          "Le noter pour plus tard"
        ],
        correct: 1,
        explanation: "Certains codes USSD peuvent autoriser des prélèvements ou des transferts. Ne composez jamais un code fourni par une personne non vérifiée.",
        notion: "Les codes USSD dictés par téléphone sont un vecteur d'arnaque connu."
      },
      {
        id: "mm5",
        question: "Quelle habitude réduit les risques liés au Mobile Money ?",
        options: [
          "Partager son code avec un membre de la famille de confiance",
          "Activer les notifications de transaction et vérifier régulièrement son solde",
          "Utiliser le même code PIN que pour son téléphone",
          "Noter son code dans les contacts du téléphone"
        ],
        correct: 1,
        explanation: "Les notifications permettent de détecter rapidement une transaction non autorisée. Un contrôle régulier du solde complète cette vigilance.",
        notion: "La détection rapide d'une anomalie limite les pertes."
      }
    ]
  },
  "reseaux-sociaux": {
    id: "reseaux-sociaux",
    title: "Quiz : Réseaux sociaux",
    description: "Limitez les risques sur Facebook et les autres plateformes.",
    themeId: "reseaux-sociaux",
    level: "débutant",
    questions: [
      {
        id: "rs1",
        question: "Un message privé d'un « ami » contient uniquement un lien étrange. Que faire ?",
        options: [
          "Cliquer pour voir de quoi il s'agit",
          "Contacter l'ami par un autre canal pour vérifier",
          "Partager le lien dans un groupe pour demander avis",
          "Répondre au message avec vos informations"
        ],
        correct: 1,
        explanation: "Le compte a pu être piraté. Une vérification par appel ou SMS évite de tomber dans un piège.",
        notion: "Un message inhabituel d'un proche mérite une vérification hors de la plateforme."
      },
      {
        id: "rs2",
        question: "Pourquoi limiter les informations visibles sur votre profil public ?",
        options: [
          "Pour rendre le profil plus esthétique",
          "Pour réduire les données exploitables par des arnaqueurs ou usurpateurs",
          "Parce que les plateformes l'exigent",
          "Pour augmenter le nombre d'amis"
        ],
        correct: 1,
        explanation: "Date de naissance, numéro de téléphone, adresse ou photos de documents peuvent servir à l'usurpation d'identité ou à des attaques ciblées.",
        notion: "Moins d'informations publiques = moins de surface d'attaque."
      },
      {
        id: "rs3",
        question: "Un concours sur Facebook demande de partager la publication, de taguer des amis et d'envoyer un message privé avec vos données. Que suspecter ?",
        options: [
          "Un concours parfaitement légitime",
          "Une possible collecte de données ou une arnaque",
          "Une obligation de la plateforme",
          "Une promotion officielle de Facebook"
        ],
        correct: 1,
        explanation: "Les vrais concours ont des règles claires et ne demandent généralement pas d'envoyer des données personnelles en message privé.",
        notion: "Les concours trop demandants en partages et données sont souvent suspects."
      },
      {
        id: "rs4",
        question: "Quelle mesure renforce fortement la sécurité d'un compte de réseau social ?",
        options: [
          "Changer de photo de profil chaque semaine",
          "Activer la double authentification",
          "Accepter toutes les demandes d'amis",
          "Publier tous les jours"
        ],
        correct: 1,
        explanation: "La double authentification empêche la connexion même si le mot de passe est connu de l'attaquant.",
        notion: "Activez la 2FA sur tous les comptes importants."
      },
      {
        id: "rs5",
        question: "Vous recevez une notification de connexion depuis un pays que vous n'avez pas visité. Que faire ?",
        options: [
          "L'ignorer",
          "Changer immédiatement le mot de passe et vérifier les sessions actives",
          "Attendre une deuxième notification",
          "Répondre à la notification par email"
        ],
        correct: 1,
        explanation: "Une connexion inhabituelle est un signal d'alerte fort. Sécurisez le compte sans délai.",
        notion: "Les alertes de connexion doivent être prises au sérieux."
      }
    ]
  },
  "donnees-personnelles": {
    id: "donnees-personnelles",
    title: "Quiz : Données personnelles",
    description: "Comprenez ce qu'il faut protéger et pourquoi.",
    themeId: "donnees-personnelles",
    level: "débutant",
    questions: [
      {
        id: "dp1",
        question: "Parmi ces éléments, lequel est une donnée personnelle ?",
        options: [
          "La météo d'aujourd'hui",
          "Votre numéro de téléphone",
          "Le prix d'un produit",
          "Un article de presse public"
        ],
        correct: 1,
        explanation: "Une donnée personnelle est toute information qui permet de vous identifier directement ou indirectement. Le numéro de téléphone en fait partie.",
        notion: "Nom, téléphone, email, photo, adresse… sont des données personnelles."
      },
      {
        id: "dp2",
        question: "Un site de concours demande une photo de votre pièce d'identité pour « valider votre participation ». Que faire ?",
        options: [
          "Envoyer la photo",
          "Refuser : une pièce d'identité ne se partage pas ainsi",
          "Envoyer seulement le numéro de la pièce",
          "Flouter une partie et envoyer"
        ],
        correct: 1,
        explanation: "Une copie de pièce d'identité est une donnée très sensible. Les services légitimes n'en ont généralement pas besoin pour un simple concours.",
        notion: "Ne transmettez jamais de pièce d'identité à un service non officiel."
      },
      {
        id: "dp3",
        question: "Pourquoi faut-il se méfier des formulaires qui demandent beaucoup d'informations ?",
        options: [
          "Parce que c'est illégal de demander des informations",
          "Parce que plus on donne de données, plus le risque d'usage détourné augmente",
          "Parce que les formulaires longs sont toujours faux",
          "Parce que cela ralentit la connexion"
        ],
        correct: 1,
        explanation: "Chaque information fournie peut être stockée, revendue ou utilisée à d'autres fins. Le principe de minimisation consiste à ne donner que le strict nécessaire.",
        notion: "Donnez le minimum d'informations nécessaires."
      },
      {
        id: "dp4",
        question: "Sur les réseaux sociaux, quelle information est particulièrement risquée à rendre publique ?",
        options: [
          "Vos centres d'intérêt généraux",
          "Votre date de naissance complète et votre numéro de téléphone",
          "Le nom de votre ville",
          "Vos films préférés"
        ],
        correct: 1,
        explanation: "La date de naissance et le numéro de téléphone sont souvent utilisés pour la récupération de comptes ou l'usurpation d'identité.",
        notion: "Limitez la visibilité des données qui permettent de vous identifier précisément."
      },
      {
        id: "dp5",
        question: "Un service légitime qui collecte des données devrait :",
        options: [
          "Ne rien expliquer",
          "Expliquer pourquoi il en a besoin et comment elles sont protégées",
          "Demander le maximum d'informations possibles",
          "Les revendre sans le dire"
        ],
        correct: 1,
        explanation: "La transparence sur l'usage des données est un indicateur de sérieux. Les services respectueux de la vie privée l'expliquent clairement.",
        notion: "La transparence est un critère de confiance."
      }
    ]
  },
  "arnaques-en-ligne": {
    id: "arnaques-en-ligne",
    title: "Quiz : Arnaques en ligne",
    description: "Reconnaissez les schémas d'arnaque les plus fréquents.",
    themeId: "arnaques-en-ligne",
    level: "débutant",
    questions: [
      {
        id: "ae1",
        question: "Quelle phrase devrait immédiatement vous mettre en alerte ?",
        options: [
          "« Livraison sous 5 jours ouvrés »",
          "« Gains garantis de 30 % par mois sans aucun risque »",
          "« Paiement sécurisé par carte »",
          "« Service client disponible du lundi au vendredi »"
        ],
        correct: 1,
        explanation: "Les gains élevés garantis et sans risque n'existent pas dans les investissements légitimes. C'est un signal d'alerte majeur.",
        notion: "Trop beau pour être vrai = très probablement une arnaque."
      },
      {
        id: "ae2",
        question: "Un vendeur en ligne insiste pour un paiement uniquement par transfert Mobile Money vers un particulier. Que faire ?",
        options: [
          "Payer car c'est plus simple",
          "Être très prudent : ce mode de paiement offre peu de recours",
          "Payer une avance seulement",
          "Demander une réduction"
        ],
        correct: 1,
        explanation: "Les paiements vers des particuliers sont difficiles à récupérer en cas de problème. Les plateformes sérieuses proposent des moyens de paiement avec protection.",
        notion: "Privilégiez les moyens de paiement traçables et protégés."
      },
      {
        id: "ae3",
        question: "Face à une offre très avantageuse avec une forte pression pour décider « maintenant », quelle attitude adopter ?",
        options: [
          "Céder à la pression pour ne pas rater l'occasion",
          "Prendre le temps de vérifier indépendamment",
          "Demander à l'offre de baisser encore le prix",
          "Partager immédiatement l'offre à ses amis"
        ],
        correct: 1,
        explanation: "La pression de l'urgence est une technique classique pour empêcher la vérification. Un vendeur honnête laisse le temps de réfléchir.",
        notion: "L'urgence artificielle est un signal d'alerte."
      },
      {
        id: "ae4",
        question: "Comment vérifier rapidement si une offre est signalée comme arnaque ?",
        options: [
          "Demander uniquement à l'expéditeur",
          "Rechercher le nom de l'offre ou de l'entreprise suivi du mot « arnaque »",
          "Se fier uniquement aux commentaires sous la publicité",
          "Compter le nombre de likes"
        ],
        correct: 1,
        explanation: "Une recherche simple permet souvent de trouver des témoignages de victimes ou des alertes officielles.",
        notion: "Quelques minutes de recherche peuvent éviter une arnaque."
      },
      {
        id: "ae5",
        question: "Les témoignages et captures d'écran de gains sur une plateforme d'investissement sont-ils une preuve de sérieux ?",
        options: [
          "Oui, toujours",
          "Non, ils peuvent être fabriqués",
          "Oui s'ils sont nombreux",
          "Oui s'ils incluent des photos"
        ],
        correct: 1,
        explanation: "Les captures d'écran et témoignages sont faciles à inventer. Ils ne constituent pas une preuve fiable.",
        notion: "Ne vous fiez pas uniquement aux témoignages fournis par la plateforme elle-même."
      }
    ]
  },
  "faux-concours": {
    id: "faux-concours",
    title: "Quiz : Faux concours",
    description: "Identifiez les tirages au sort frauduleux.",
    themeId: "faux-concours",
    level: "débutant",
    questions: [
      {
        id: "fc1",
        question: "Vous recevez un message : « Félicitations, vous avez gagné ! Cliquez pour réclamer. » Vous n'avez jamais participé. Que conclure ?",
        options: [
          "C'est probablement légitime",
          "C'est très probablement une arnaque",
          "Il faut cliquer pour confirmer",
          "Il faut envoyer ses données pour vérifier"
        ],
        correct: 1,
        explanation: "Si vous n'avez pas participé, vous ne pouvez pas avoir gagné. C'est un schéma classique de phishing ou de collecte de données.",
        notion: "Pas de participation = pas de gain possible."
      },
      {
        id: "fc2",
        question: "Un concours vous demande de payer des « frais de livraison » pour recevoir votre lot. Que faire ?",
        options: [
          "Payer les frais",
          "Refuser : on ne paie pas pour un lot gagné",
          "Négocier les frais",
          "Payer une partie seulement"
        ],
        correct: 1,
        explanation: "Les frais de livraison demandés avant l'envoi d'un lot « gagné » sont une technique d'extorsion classique. L'argent part et le lot n'arrive jamais.",
        notion: "Un vrai organisateur assume les frais ou les déduit clairement du lot."
      },
      {
        id: "fc3",
        question: "Quel élément rend un concours particulièrement suspect ?",
        options: [
          "Des règles claires et une date de fin",
          "La demande de partager massivement et de fournir des données personnelles en privé",
          "La présence d'un règlement",
          "Un compte organisateur ancien et actif"
        ],
        correct: 1,
        explanation: "Les vrais concours n'ont pas besoin de collecter des données en message privé ni d'exiger des partages massifs pour fonctionner.",
        notion: "Partages forcés + données en privé = signal d'alerte."
      },
      {
        id: "fc4",
        question: "Comment vérifier un organisateur de concours ?",
        options: [
          "Se fier uniquement au nombre de likes",
          "Vérifier le compte (ancienneté, cohérence, présence ailleurs) et chercher des avis indépendants",
          "Regarder uniquement les commentaires positifs sous la publication",
          "Demander à l'organisateur s'il est honnête"
        ],
        correct: 1,
        explanation: "Un compte récent, peu actif ou incohérent, associé à une offre trop belle, est un mauvais signe. Les avis indépendants comptent plus que les commentaires sous la publication.",
        notion: "Vérifiez l'organisateur en dehors de la publication elle-même."
      },
      {
        id: "fc5",
        question: "Un service officiel (opérateur, banque, administration) vous contacte de façon inattendue pour vous annoncer un gain. Que faire ?",
        options: [
          "Suivre les instructions du message",
          "Rester méfiant et vérifier par un canal officiel connu",
          "Fournir immédiatement vos coordonnées",
          "Transférer le message à votre famille"
        ],
        correct: 1,
        explanation: "Les services officiels ne contactent généralement pas les gens de façon inattendue pour annoncer des gains. En cas de doute, contactez-les vous-même via leurs canaux officiels.",
        notion: "Les annonces de gains inattendus sont rarement légitimes."
      }
    ]
  },
  // Quiz débutant général (5 questions)
  debutant: {
    id: "debutant",
    title: "Quiz débutant",
    description: "Les bases de la cybersécurité en 5 questions.",
    themeId: null,
    level: "débutant",
    questions: [
      {
        id: "deb1",
        question: "Quel est le principal risque à utiliser le même mot de passe partout ?",
        options: [
          "Il devient plus difficile à retenir",
          "Si un site est piraté, les autres comptes sont en danger",
          "Les sites le refusent automatiquement",
          "Cela ralentit la navigation"
        ],
        correct: 1,
        explanation: "Une fuite sur un seul service expose tous les comptes qui partagent le même mot de passe.",
        notion: "Un mot de passe unique par compte est une règle fondamentale."
      },
      {
        id: "deb2",
        question: "Avant de cliquer sur un lien reçu par message, que faire ?",
        options: [
          "Cliquer rapidement",
          "Vérifier l'expéditeur et l'URL réelle",
          "Le partager d'abord",
          "Le traduire"
        ],
        correct: 1,
        explanation: "Vérifier qui envoie le message et où mène vraiment le lien permet d'éviter la majorité des pièges.",
        notion: "Deux secondes de vérification valent mieux qu'une compromission."
      },
      {
        id: "deb3",
        question: "Votre code PIN Mobile Money peut-il être demandé par téléphone par un agent ?",
        options: [
          "Oui, pour vérifier votre identité",
          "Non, jamais",
          "Oui, si l'appel vient d'un numéro officiel",
          "Oui, uniquement le matin"
        ],
        correct: 1,
        explanation: "Aucun opérateur ne demande votre code secret par téléphone. Toute personne qui le fait est un arnaqueur.",
        notion: "Code PIN = ne se communique jamais."
      },
      {
        id: "deb4",
        question: "Que signifie le cadenas (https) dans la barre d'adresse ?",
        options: [
          "Que le site est forcément honnête",
          "Que la connexion entre vous et le site est chiffrée",
          "Que le site est certifié par le gouvernement",
          "Que le site n'a pas de publicité"
        ],
        correct: 1,
        explanation: "https protège le transport des données. Cela n'indique pas si le site est légitime ou malveillant.",
        notion: "https protège le trajet, pas forcément la destination."
      },
      {
        id: "deb5",
        question: "La double authentification sert principalement à :",
        options: [
          "Remplacer le mot de passe",
          "Ajouter une barrière supplémentaire en cas de vol de mot de passe",
          "Accélérer les connexions",
          "Partager un compte en toute sécurité"
        ],
        correct: 1,
        explanation: "Même avec le mot de passe, l'attaquant a besoin du second facteur. C'est une protection très efficace.",
        notion: "Activez la 2FA partout où c'est possible."
      }
    ]
  },
  // Quiz rapide
  rapide: {
    id: "rapide",
    title: "Quiz rapide",
    description: "5 questions pour tester vos réflexes.",
    themeId: null,
    level: "débutant",
    questions: [
      {
        id: "rap1",
        question: "On vous demande votre code de vérification WhatsApp par message. Que faire ?",
        options: [
          "Le donner",
          "Ne jamais le donner"
        ],
        correct: 1,
        explanation: "Ce code permet de prendre le contrôle de votre compte. Ne le communiquez à personne.",
        notion: "Code WhatsApp = strictement personnel."
      },
      {
        id: "rap2",
        question: "Un email urgent demande de « mettre à jour vos informations » via un lien. Réflexe ?",
        options: [
          "Cliquer sur le lien",
          "Aller sur le site officiel sans passer par l'email"
        ],
        correct: 1,
        explanation: "Ne passez jamais par un lien reçu pour une action sensible. Tapez l'adresse officielle vous-même.",
        notion: "Canal officiel = vous le choisissez, pas l'email."
      },
      {
        id: "rap3",
        question: "Faut-il réutiliser le même mot de passe sur plusieurs sites importants ?",
        options: [
          "Oui, c'est plus simple",
          "Non"
        ],
        correct: 1,
        explanation: "La réutilisation expose tous vos comptes en cas de fuite sur un seul d'entre eux.",
        notion: "Un compte = un mot de passe unique."
      },
      {
        id: "rap4",
        question: "Un Wi-Fi public est-il adapté pour consulter son compte bancaire ?",
        options: [
          "Oui, sans problème",
          "Non, préférez les données mobiles"
        ],
        correct: 1,
        explanation: "Les réseaux publics sont moins contrôlés. Pour les opérations sensibles, les données mobiles sont préférables.",
        notion: "Opérations sensibles = connexion de confiance."
      },
      {
        id: "rap5",
        question: "Une offre promet des gains élevés garantis sans risque. Que penser ?",
        options: [
          "C'est une belle opportunité",
          "C'est très probablement une arnaque"
        ],
        correct: 1,
        explanation: "Les gains élevés sans risque n'existent pas dans le monde réel des investissements.",
        notion: "Trop beau pour être vrai = danger."
      }
    ]
  }
};

if (typeof window !== 'undefined') {
  window.QUIZZES = QUIZZES;
}