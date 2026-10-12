'use strict';
/** Enrichissement des données V1 : tous les identifiants historiques sont conservés. */
(function () {
  const intermediate = new Set([
    'vol-de-compte',
    'donnees-personnelles',
    'reseaux-sociaux',
    'telephone-applications',
    'investissements',
  ]);
  const warnings = {
    phishing: [
      'Un message inattendu insiste sur l’urgence ou menace de bloquer votre compte.',
      'Le lien ne correspond pas à l’adresse officielle de l’organisme.',
      'On vous demande un code, un mot de passe ou un paiement non prévu.',
    ],
    'liens-suspects': [
      'L’adresse de destination est masquée par un lien raccourci.',
      'Le nom de l’organisme apparaît dans l’adresse, mais pas dans le vrai domaine.',
      'Un message vous incite à ouvrir le lien avant de pouvoir vérifier.',
    ],
    'mots-de-passe': [
      'Le même mot de passe est réutilisé sur plusieurs comptes.',
      'Le secret contient des informations faciles à deviner.',
      'Une personne vous demande de transmettre votre mot de passe.',
    ],
    'vol-de-compte': [
      'Une connexion ou une modification de récupération n’est pas de vous.',
      'Vos proches reçoivent des messages que vous n’avez pas envoyés.',
      'Le service vous annonce un changement de mot de passe non demandé.',
    ],
    whatsapp: [
      'Un contact vous demande le code d’inscription ou de connexion à votre compte.',
      'Un appareil lié est inconnu dans les réglages.',
      'Une demande d’argent inhabituelle arrive d’un proche sans vérification par appel.',
    ],
    'mobile-money': [
      'Un prétendu agent demande votre PIN de connexion ou de transaction.',
      'On vous presse de rembourser un transfert sans vérifier votre solde officiel.',
      'Le bénéficiaire affiché ne correspond pas à celui que vous attendiez.',
    ],
    'reseaux-sociaux': [
      'Un profil emprunte la photo d’une connaissance et réclame de l’argent.',
      'Le nom d’utilisateur diffère du compte habituel.',
      'Une publication vous invite à donner un code ou à installer une application.',
    ],
    'donnees-personnelles': [
      'Un formulaire recueille plus de données que le service ne semble nécessiter.',
      'Aucune explication n’est donnée sur le traitement ou la conservation.',
      'Une pièce d’identité est demandée par un interlocuteur non vérifié.',
    ],
    'arnaques-en-ligne': [
      'Une offre promet un bénéfice disproportionné et immédiat.',
      'Une pression vous empêche de comparer ou de vérifier.',
      'Un paiement préalable est exigé auprès d’un interlocuteur inconnu.',
    ],
    'faux-concours': [
      'Un gain est annoncé alors que vous n’avez pas participé.',
      'Des frais ou des codes secrets sont exigés pour obtenir le lot.',
      'Le compte qui vous contacte n’est pas celui de l’organisateur vérifié.',
    ],
    'fausses-offres-emploi': [
      'Des frais sont exigés avant l’entretien ou le contrat.',
      'On vous demande d’utiliser votre compte pour transférer de l’argent.',
      'Le recruteur refuse une vérification indépendante de l’entreprise.',
    ],
    investissements: [
      'Un rendement élevé est présenté comme garanti et sans risque.',
      'Il faut payer davantage pour retirer des « gains ».',
      'Les seules preuves sont des captures d’écran ou des témoignages invérifiables.',
    ],
    'telephone-applications': [
      'Une application inconnue réclame un accès aux SMS ou aux fonctions d’accessibilité.',
      'On vous demande de désactiver les protections de votre téléphone.',
      'Un message vous envoie un fichier d’installation hors du magasin officiel.',
    ],
    'wifi-public': [
      'Le nom du réseau imite celui du lieu, sans confirmation par le personnel.',
      'Une page exige des informations sensibles sans explication.',
      'Le navigateur affiche un avertissement de certificat.',
    ],
    'emails-suspects': [
      'Le nom affiché semble officiel mais l’adresse d’envoi est inhabituelle.',
      'Une pièce jointe inattendue vous demande d’activer une fonction.',
      'Le message exige une réponse urgente ou des informations confidentielles.',
    ],
  };
  const references = {
    phishing: ['phishing'],
    'liens-suspects': ['phishing'],
    'mots-de-passe': ['password', 'account'],
    'vol-de-compte': ['account'],
    whatsapp: ['whatsapp', 'account'],
    'mobile-money': ['momo', 'phishing'],
    'reseaux-sociaux': ['account', 'personal'],
    'donnees-personnelles': ['personal'],
    'arnaques-en-ligne': ['phishing', 'jobs', 'investments'],
    'faux-concours': ['prizes'],
    'fausses-offres-emploi': ['jobs'],
    investissements: ['investments'],
    'telephone-applications': ['android', 'permissions', 'account'],
    'wifi-public': ['account'],
    'emails-suspects': ['phishing'],
  };
  LESSONS.forEach((lesson) => {
    if (intermediate.has(lesson.id)) lesson.level = 'intermédiaire';
    lesson.objective = lesson.objective || lesson.description;
    lesson.warningSigns = warnings[lesson.id] || lesson.warningSigns || [];
    lesson.summary = lesson.summary || lesson.content.notion;
    if (references[lesson.id])
      lesson.content.sources = references[lesson.id].map((key) => SOURCES[key]);
    if (QUIZZES[lesson.id]) QUIZZES[lesson.id].level = lesson.level;
  });
  const byId = (id) => LESSONS.find((lesson) => lesson.id === id);
  byId('mots-de-passe').content.situation =
    'Vous utilisez le même mot de passe — votre date de naissance et le nom de votre enfant — pour Facebook, votre email et votre compte sur une boutique en ligne.';
  byId('liens-suspects').content.reflex =
    'Retrouvez le service dans son application ou saisissez son adresse officielle. Si vous choisissez un service externe d’analyse d’URL, vérifiez ses conditions et ne transmettez aucune adresse contenant une donnée privée ou un code.';
  byId('phishing').content.points[3] =
    'Un lien raccourci masque sa destination : cela ne prouve pas une fraude, mais justifie une vérification par un autre canal.';
  byId('phishing').content.situation =
    'Vous recevez un SMS : « Votre colis est bloqué. Vérifiez vos informations sur https://livraison-verification.example/colis ». Le message semble provenir d’un service que vous utilisez parfois.';
  byId('arnaques-en-ligne').content.points[1] =
    'Méfiez-vous des paiements difficiles à récupérer : transfert vers un inconnu ou cartes cadeaux. Une transaction Mobile Money laisse des traces, mais un remboursement n’est pas garanti.';
  byId('faux-concours').content.points[3] =
    'Vérifiez un gain inattendu auprès de l’organisateur par des coordonnées trouvées indépendamment.';
  byId('faux-concours').content.points[0] =
    'Une demande de paiement ou de code secret pour débloquer un lot est un signal d’alerte majeur : vérifiez avant de poursuivre.';
  byId('fausses-offres-emploi').content.points[3] =
    'N’envoyez pas de pièce d’identité complète à un recruteur dont vous n’avez pas vérifié l’identité et le besoin légitime.';
  byId('fausses-offres-emploi').content.points[4] =
    'Un échange uniquement par messagerie ne suffit pas à établir la légitimité d’un recruteur. Vérifiez l’entreprise et les coordonnées par un autre canal.';
  byId('telephone-applications').content.points[0] =
    'Préférez les magasins officiels et vérifiez l’éditeur. Ils réduisent certains risques, sans garantir l’absence de toute application malveillante.';
  const advanced = [
    {
      id: 'reagir-incident',
      title: 'Réagir après une fraude',
      description:
        'Organiser une réponse calme : sécuriser les comptes, préserver les preuves et demander de l’aide.',
      category: 'comptes',
      duration: '12 min',
      level: 'avancé',
      objective:
        'Être capable de prioriser les actions après un partage de code, une perte d’argent ou un compte compromis.',
      warningSigns: [
        'Une transaction n’est pas de vous.',
        'Les informations de récupération ont été modifiées.',
        'Une personne demande de nouveaux frais pour récupérer l’argent perdu.',
      ],
      content: {
        situation:
          'Après avoir envoyé un code à un prétendu support, Awa découvre une connexion inconnue et ses contacts reçoivent des demandes d’argent en son nom.',
        question: 'Quelles actions doivent passer avant la recherche d’un coupable ?',
        explanation:
          'La priorité est de limiter le dommage. Utilisez un appareil de confiance et les procédures officielles du service. Préservez les messages et les références de transaction avant de supprimer ou de bloquer des éléments. Aucun intermédiaire ne peut garantir la récupération de fonds.',
        points: [
          'Contactez sans attendre l’opérateur Mobile Money ou la banque par son canal officiel si de l’argent est en jeu.',
          'Changez les mots de passe exposés, vérifiez la récupération et déconnectez les sessions inconnues.',
          'Activez une seconde preuve de connexion lorsque le service le propose.',
          'Conservez les messages, dates, références de transaction et captures, sans les publier avec des données personnelles.',
          'Prévenez vos proches et contactez l’autorité compétente de votre pays si vous souhaitez déposer plainte. Au Bénin, consultez le site officiel du CNIN.',
        ],
        reflex:
          'D’abord contenir l’incident, ensuite préserver les preuves et solliciter le service ou l’autorité compétente.',
        notion:
          'Une réponse ordonnée réduit le dommage. Ne payez pas un « récupérateur » qui promet de récupérer des fonds contre de nouveaux frais.',
        sources: [SOURCES.account, SOURCES.phishing, SOURCES.cnin],
      },
    },
    {
      id: 'verification-domaines',
      title: 'Lire une adresse sans l’ouvrir',
      description:
        'Comprendre le domaine réel, les sous-domaines et les caractères trompeurs, sans visiter le lien.',
      category: 'bases',
      duration: '11 min',
      level: 'avancé',
      objective:
        'Distinguer le domaine de destination du reste d’une adresse et connaître les limites d’une inspection visuelle.',
      warningSigns: [
        'Le nom d’une marque apparaît avant le signe @ ou au début d’un sous-domaine.',
        'Un domaine utilise des caractères ressemblants ou l’encodage xn--.',
        'Le lien court masque la destination finale.',
      ],
      content: {
        situation:
          'Un message affiche https://banque.example@verification.example/connexion. Le mot « banque » semble rassurant mais le domaine de destination est verification.example. Ces domaines sont fictifs.',
        question: 'Quelle partie de l’adresse indique réellement la destination ?',
        explanation:
          'Une adresse comprend le protocole, éventuellement un identifiant avant @, le nom d’hôte, puis le chemin et les paramètres. Dans cet exemple, la destination est après @ et avant la barre oblique suivante. Les sous-domaines peuvent aussi inclure des mots rassurants. L’analyse visuelle est un indice, jamais une preuve de sûreté.',
        points: [
          'Regardez l’hôte complet : les mots dans le chemin ou avant @ ne prouvent pas l’identité du service.',
          'Ne déduisez pas toujours le domaine enregistrable des deux derniers morceaux : certaines extensions en utilisent davantage, comme co.uk.',
          'Le préfixe https chiffre la connexion ; il ne garantit pas l’honnêteté du site.',
          'Les liens raccourcis et redirections ne peuvent pas être résolus par une simple lecture locale.',
          'Retrouvez le service par son application officielle plutôt que de tester une adresse douteuse.',
        ],
        reflex:
          'Comparez avec l’adresse officielle trouvée indépendamment. Ne visitez pas le lien simplement pour lever le doute.',
        notion:
          'L’apparence d’un lien peut tromper. Aucun indicateur visuel absent ne suffit à déclarer un lien sûr.',
        sources: [SOURCES.phishing],
      },
    },
  ];
  advanced.forEach((lesson) => {
    lesson.summary = lesson.summary || lesson.content.notion;
    LESSONS.push(lesson);
  });
  const extraQuestions = {
    'fausses-offres-emploi': [
      [
        'Un recruteur demande des frais de dossier par Mobile Money avant l’entretien. Quel réflexe adopter ?',
        [
          'Payer pour réserver la place',
          'Vérifier l’entreprise indépendamment et ne pas payer',
          'Envoyer sa pièce d’identité en plus',
        ],
        1,
        'Les frais de recrutement réclamés au candidat et la pression sont des signes d’alerte. Contactez l’entreprise avec des coordonnées trouvées ailleurs.',
      ],
      [
        'On vous embauche pour recevoir et retransférer de l’argent sur votre compte personnel. Que faire ?',
        [
          'Accepter si la commission est bonne',
          'Transférer un petit montant pour tester',
          'Refuser et vérifier : vous pourriez participer à une fraude',
        ],
        2,
        'Ce rôle peut servir à déplacer des fonds frauduleux. N’utilisez pas votre compte pour des transferts inexpliqués.',
      ],
      [
        'Une offre utilise le logo d’une entreprise connue. Est-ce une preuve ?',
        [
          'Oui, un logo ne peut pas être copié',
          'Non, vérifiez le poste sur le site officiel de l’entreprise',
          'Oui, si le salaire paraît réaliste',
        ],
        1,
        'Un logo peut être copié. Vérifiez l’offre et l’identité du recruteur de façon indépendante.',
      ],
    ],
    investissements: [
      [
        'On vous promet 20 % de gain mensuel sans aucun risque. Que faire ?',
        [
          'Vérifier l’agrément et ne pas investir sous pression',
          'Investir vite avant que l’offre ferme',
          'Croire les captures de gains',
        ],
        0,
        'Un rendement élevé présenté comme garanti et sans risque est un signal d’alerte majeur.',
      ],
      [
        'Une plateforme exige de nouveaux frais pour retirer des gains affichés. Quelle réaction ?',
        [
          'Verser les frais automatiquement',
          'Inviter des proches pour les payer',
          'Arrêter les versements et demander conseil à un organisme compétent',
        ],
        2,
        'De nouveaux versements pour débloquer des gains peuvent prolonger une fraude. Ne payez pas sans vérification indépendante.',
      ],
      [
        'Un proche a reçu un premier paiement. Cela suffit-il à prouver la légitimité ?',
        [
          'Non, un premier versement ne valide pas tout le dispositif',
          'Oui, cela prouve que tous les gains seront versés',
          'Oui, si son témoignage est sincère',
        ],
        0,
        'Un système frauduleux peut verser de petites sommes au début. Vérifiez l’organisme et les conditions.',
      ],
    ],
    'telephone-applications': [
      [
        'Une application de lampe torche demande de lire tous vos SMS. Que faire ?',
        [
          'Accepter pour qu’elle fonctionne mieux',
          'Vérifier la nécessité et refuser cet accès injustifié',
          'Désactiver les protections du téléphone',
        ],
        1,
        'Les autorisations doivent correspondre à la fonction. La lecture des SMS peut exposer des codes.',
      ],
      [
        'Une application vient d’un magasin officiel. Est-elle garantie sans risque ?',
        [
          'Non, vérifiez aussi l’éditeur et les autorisations',
          'Oui, toujours',
          'Oui, si elle est gratuite',
        ],
        0,
        'Un magasin officiel réduit certains risques, sans les supprimer tous.',
      ],
      [
        'Pourquoi installer les mises à jour officielles ?',
        [
          'Uniquement pour changer les couleurs',
          'Pour corriger notamment des failles de sécurité',
          'Pour rendre le téléphone plus lourd',
        ],
        1,
        'Les mises à jour du système et des applications peuvent corriger des vulnérabilités.',
      ],
    ],
    'wifi-public': [
      [
        'Deux réseaux portent le nom du café. Comment choisir ?',
        [
          'Prendre le signal le plus fort',
          'Demander au personnel le nom exact du réseau officiel',
          'Se connecter aux deux pour comparer',
        ],
        1,
        'Le nom d’un réseau peut être imité. Le personnel peut confirmer celui du lieu.',
      ],
      [
        'Le navigateur affiche un avertissement de certificat. Que faire ?',
        [
          'L’ignorer sur un Wi-Fi gratuit',
          'Saisir vite son mot de passe',
          'Ne pas poursuivre et vérifier par un autre réseau',
        ],
        2,
        'Ne contournez pas un avertissement de sécurité pour saisir des informations sensibles.',
      ],
      [
        'Un VPN protège-t-il de tous les messages frauduleux ?',
        [
          'Oui, totalement',
          'Non, il ne vérifie pas l’honnêteté des interlocuteurs',
          'Oui, si le Wi-Fi est public',
        ],
        1,
        'Un VPN ne remplace ni la vérification d’un message ni les bons réflexes.',
      ],
    ],
    'emails-suspects': [
      [
        'Le nom affiché est celui de votre banque. Quelle vérification faire ?',
        [
          'Regarder l’adresse réelle et contacter la banque indépendamment',
          'Faire confiance au nom seul',
          'Répondre avec son code pour confirmer',
        ],
        0,
        'Le nom de l’expéditeur peut être choisi librement. Une adresse plausible ne constitue pas non plus une garantie.',
      ],
      [
        'Une pièce jointe inattendue demande d’activer une fonction pour lire la facture. Que faire ?',
        [
          'Activer sans attendre',
          'Transférer le fichier à tous ses collègues',
          'Ne pas l’ouvrir et vérifier avec l’expéditeur par un canal connu',
        ],
        2,
        'Une pièce jointe inattendue doit être vérifiée indépendamment, même si elle semble venir d’un contact.',
      ],
      [
        'Un email ne contient aucune faute. Est-il forcément légitime ?',
        [
          'Non, un message frauduleux peut être très bien rédigé',
          'Oui, les fraudeurs font toujours des fautes',
          'Oui, si le logo est net',
        ],
        0,
        'La qualité de rédaction ne prouve pas la légitimité d’un message.',
      ],
    ],
    'reagir-incident': [
      [
        'Vous avez envoyé un code de connexion à un inconnu. Quelle priorité ?',
        [
          'Publier son numéro pour l’accuser',
          'Sécuriser le compte via le service officiel',
          'Attendre un nouveau message',
        ],
        1,
        'La priorité est de limiter le dommage avec le support et les procédures officielles.',
      ],
      [
        'Que conserver avant de supprimer un échange suspect ?',
        [
          'Seulement la photo du profil',
          'Les messages, dates et références de transaction',
          'Rien, supprimer est toujours suffisant',
        ],
        1,
        'Des preuves conservées en privé peuvent aider le service concerné ou l’autorité compétente.',
      ],
      [
        'Une personne promet de récupérer l’argent perdu contre de nouveaux frais. Quel réflexe ?',
        [
          'Payer pour accélérer',
          'Donner un accès distant au téléphone',
          'Ne pas payer et vérifier auprès d’un organisme compétent',
        ],
        2,
        'Les victimes peuvent être ciblées par une seconde fraude à la récupération. Aucune récupération ne doit être considérée comme garantie.',
      ],
    ],
    'verification-domaines': [
      [
        'Dans https://banque.example@verification.example/connexion, quel est l’hôte ?',
        ['banque.example', 'verification.example', 'connexion'],
        1,
        'Le texte avant @ est un identifiant. L’hôte de destination est verification.example. Les domaines sont fictifs.',
      ],
      [
        'Que prouve le préfixe HTTPS ?',
        [
          'Que la connexion est chiffrée, pas que le site est honnête',
          'Que le site est approuvé par votre banque',
          'Qu’il est impossible de se faire arnaquer',
        ],
        0,
        'HTTPS protège le transport des données. Il ne certifie pas l’identité ou les intentions du propriétaire.',
      ],
      [
        'Aucun indicateur suspect n’apparaît dans un outil local. Peut-on déclarer le lien sûr ?',
        [
          'Oui',
          'Oui, si le domaine est court',
          'Non, les règles locales ne détectent pas tous les risques',
        ],
        2,
        'L’absence d’indicateur ne constitue jamais une garantie de sûreté.',
      ],
    ],
  };
  Object.entries(extraQuestions).forEach(([id, items]) => {
    const lesson = byId(id);
    QUIZZES[id] = {
      id,
      title: `Quiz : ${lesson.title}`,
      description: `Validez les bons réflexes de la leçon « ${lesson.title} ».`,
      themeId: id,
      level: lesson.level,
      questions: items.map((q, index) => ({
        id: `${id}-${index + 1}`,
        question: q[0],
        options: q[1],
        correct: q[2],
        explanation: q[3],
        notion: lesson.summary,
      })),
    };
  });
  QUIZZES.demo = {
    id: 'demo',
    title: 'Le défi des bons réflexes',
    description: 'Trois situations fictives pour découvrir les bons réflexes.',
    themeId: null,
    level: 'débutant',
    questions: [
      {
        id: 'demo-1',
        question:
          'Un « agent Mobile Money » vous demande votre code PIN pour annuler un transfert. Que faites-vous ?',
        options: [
          'Je lui donne mon PIN pour régler le problème.',
          'Je contacte le support officiel sans partager mon PIN.',
          'Je renvoie l’argent immédiatement.',
        ],
        correct: 1,
        explanation:
          'Votre PIN est un secret. Vérifiez le transfert dans votre application et contactez l’opérateur par un canal officiel, jamais avec les coordonnées fournies par cet interlocuteur.',
        notion: 'Un code PIN ne se partage pas, même avec un prétendu agent.',
      },
      {
        id: 'demo-2',
        question:
          'Un message annonce un emploi, mais exige 5 000 FCFA de frais avant l’entretien. Votre réflexe ?',
        options: [
          'Je paie pour réserver le poste.',
          'J’envoie aussi ma pièce d’identité.',
          'Je vérifie l’entreprise indépendamment et je ne paie pas.',
        ],
        correct: 2,
        explanation:
          'Des frais exigés pour accéder à un emploi sont un signal d’alerte. Recherchez l’offre et les coordonnées sur le site officiel de l’entreprise.',
        notion: 'Vérifier avant de payer protège votre argent et votre identité.',
      },
      {
        id: 'demo-3',
        question: 'Un site affiche un cadenas HTTPS. Cela signifie-t-il qu’il est honnête ?',
        options: [
          'Oui, le cadenas garantit tout.',
          'Non, le cadenas indique le chiffrement de la connexion.',
          'Oui, si le site affiche un logo connu.',
        ],
        correct: 1,
        explanation:
          'HTTPS chiffre la connexion. Un site frauduleux peut aussi utiliser HTTPS et copier un logo.',
        notion: 'Le cadenas ne garantit pas l’honnêteté du site.',
      },
    ],
  };
})();
