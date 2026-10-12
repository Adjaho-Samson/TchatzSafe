const LESSONS = [
  {
    id: "phishing",
    title: "Phishing",
    description: "Reconnaître et se protéger des tentatives d'hameçonnage par email, SMS ou message.",
    category: "bases",
    duration: "8 min",
    level: "débutant",
    content: {
      situation: "Vous recevez un SMS : « Votre colis est bloqué. Cliquez ici pour le libérer : bit.ly/colis-urgent ». Le message semble provenir d'un service de livraison que vous utilisez parfois.",
      question: "Que devez-vous faire en premier ?",
      explanation: "Le phishing (ou hameçonnage) consiste à se faire passer pour une organisation de confiance afin de vous pousser à cliquer sur un lien, ouvrir une pièce jointe ou communiquer des informations personnelles. Les messages urgents, les fautes d'orthographe, les expéditeurs suspects et les liens raccourcis sont des signes fréquents.",
      points: [
        "Ne cliquez jamais sur un lien reçu par SMS ou email sans vérifier l'expéditeur.",
        "Contactez le service concerné par un canal officiel (application, site web que vous tapez vous-même).",
        "Méfiez-vous de toute demande urgente de paiement ou de connexion.",
        "Les vrais services de livraison n'envoient généralement pas de liens courts non traçables."
      ],
      reflex: "Avant de cliquer, posez-vous la question : « Est-ce que j'attendais vraiment ce message ? » Si la réponse est non, ignorez-le ou vérifiez autrement.",
      notion: "Le phishing exploite l'urgence et la confiance. Prendre quelques secondes pour vérifier peut éviter la compromission d'un compte ou le vol d'argent.",
      sources: [
        {
          name: "Cybermalveillance.gouv.fr",
          title: "Le phishing ou hameçonnage",
          url: "https://www.cybermalveillance.gouv.fr/tous-nos-contenus/fiches-reflexes/phishing-hameconnage"
        },
        {
          name: "ANSSI",
          title: "Reconnaître et se protéger du phishing",
          url: "https://www.ssi.gouv.fr/"
        }
      ]
    }
  },
  {
    id: "liens-suspects",
    title: "Liens suspects",
    description: "Identifier un lien dangereux avant de cliquer, même s'il semble légitime.",
    category: "bases",
    duration: "7 min",
    level: "débutant",
    content: {
      situation: "Un ami vous envoie sur WhatsApp : « Regarde cette vidéo de toi, c'est trop drôle ! » suivi d'un lien qui commence par https://mais qui ne ressemble pas à un site connu.",
      question: "Comment vérifier si un lien est sûr ?",
      explanation: "Un lien peut être dangereux même s'il commence par https. Les attaquants créent des pages qui imitent parfaitement des sites connus. Sur mobile, le vrai domaine est parfois masqué. Avant de cliquer, regardez attentivement l'adresse complète.",
      points: [
        "Survolez le lien (ou appuyez longuement) pour voir l'URL réelle.",
        "Vérifiez le nom de domaine : facebook.com n'est pas facebook-secure.com.",
        "Méfiez-vous des liens raccourcis (bit.ly, tinyurl) si vous ne connaissez pas l'expéditeur.",
        "Ne vous fiez pas uniquement au cadenas (https) : cela prouve seulement que la connexion est chiffrée, pas que le site est honnête."
      ],
      reflex: "Si un lien vous intrigue, copiez-le et analysez-le sur un outil comme VirusTotal avant d'ouvrir la page.",
      notion: "https protège le transport des données, mais ne garantit pas que le site est légitime. Le nom de domaine est l'élément le plus important à vérifier.",
      sources: [
        {
          name: "VirusTotal",
          title: "Analyser une URL",
          url: "https://www.virustotal.com/gui/home/url"
        },
        {
          name: "Cybermalveillance.gouv.fr",
          title: "Liens et pièces jointes malveillants",
          url: "https://www.cybermalveillance.gouv.fr/tous-nos-contenus/actualites/liens-pieces-jointes-malveillants"
        }
      ]
    }
  },
  {
    id: "mots-de-passe",
    title: "Mots de passe",
    description: "Créer et gérer des mots de passe solides sans se compliquer la vie.",
    category: "bases",
    duration: "10 min",
    level: "débutant",
    content: {
      situation: "Vous utilisez le même mot de passe (votre date de naissance + le nom de votre enfant) pour WhatsApp, Facebook, votre email et votre compte Mobile Money.",
      question: "Pourquoi est-ce dangereux ?",
      explanation: "Si un seul de ces services est piraté, l'attaquant peut essayer le même mot de passe partout. C'est ce qu'on appelle le credential stuffing. Un mot de passe unique et long par compte limite considérablement les dégâts.",
      points: [
        "Un bon mot de passe fait au moins 12 caractères et mélange lettres, chiffres et symboles.",
        "N'utilisez jamais d'informations personnelles faciles à deviner (noms, dates, numéros de téléphone).",
        "Un gestionnaire de mots de passe (intégré au navigateur ou application dédiée) permet de ne retenir qu'un seul mot de passe maître.",
        "Activez la double authentification dès que c'est possible."
      ],
      reflex: "Changez immédiatement les mots de passe réutilisés. Commencez par l'email et les comptes financiers.",
      notion: "La longueur d'un mot de passe est plus importante que sa complexité. Une phrase longue et personnelle est souvent plus sûre qu'un mot court avec des symboles.",
      sources: [
        {
          name: "CNIL",
          title: "Les conseils de la CNIL pour un bon mot de passe",
          url: "https://www.cnil.fr/fr/les-conseils-de-la-cnil-pour-un-bon-mot-de-passe"
        },
        {
          name: "Cybermalveillance.gouv.fr",
          title: "Mots de passe",
          url: "https://www.cybermalveillance.gouv.fr/tous-nos-contenus/fiches-reflexes/mots-de-passe"
        }
      ]
    }
  },
  {
    id: "vol-de-compte",
    title: "Vol de compte",
    description: "Comprendre comment un compte se fait pirater et comment réagir.",
    category: "comptes",
    duration: "9 min",
    level: "débutant",
    content: {
      situation: "Vous recevez un email vous informant qu'une connexion a eu lieu depuis un autre pays. Ou pire : vos amis vous disent avoir reçu des messages étranges de votre part.",
      question: "Que faire si vous suspectez que votre compte a été compromis ?",
      explanation: "Un compte compromis peut servir à arnaquer vos contacts, à récupérer d'autres accès ou à publier du contenu à votre place. Agir rapidement limite les dégâts.",
      points: [
        "Changez immédiatement le mot de passe depuis un appareil de confiance.",
        "Déconnectez toutes les sessions actives (option souvent disponible dans les paramètres de sécurité).",
        "Activez la double authentification si ce n'est pas déjà fait.",
        "Prévenez vos contacts proches pour qu'ils ignorent les messages suspects provenant de vous.",
        "Vérifiez les appareils et applications connectés à votre compte."
      ],
      reflex: "Si vous n'arrivez plus à vous connecter, utilisez la procédure de récupération officielle du service. Ne cliquez pas sur des liens reçus par message prétendant vous aider.",
      notion: "La plupart des vols de compte passent par un mot de passe récupéré ailleurs ou par une technique d'ingénierie sociale. La double authentification bloque la majorité des attaques automatisées.",
      sources: [
        {
          name: "Meta Security",
          title: "Sécuriser votre compte Facebook",
          url: "https://www.facebook.com/help/148233965247823"
        },
        {
          name: "Google Safety Center",
          title: "Protéger votre compte Google",
          url: "https://safety.google/security-tips/"
        }
      ]
    }
  },
  {
    id: "whatsapp",
    title: "WhatsApp",
    description: "Sécuriser son compte WhatsApp et reconnaître les arnaques courantes.",
    category: "messagerie",
    duration: "8 min",
    level: "débutant",
    content: {
      situation: "Quelqu'un vous contacte en prétendant être un proche. Il vous demande un code à 6 chiffres qu'il aurait reçu par SMS, ou vous propose d'activer une « vérification en deux étapes » pour vous.",
      question: "Pourquoi ne faut-il jamais communiquer un code reçu par SMS ?",
      explanation: "WhatsApp envoie un code de vérification uniquement lors de l'inscription ou de la reconnexion sur un nouvel appareil. Si quelqu'un vous demande ce code, c'est qu'il essaie de prendre le contrôle de votre compte.",
      points: [
        "Activez la vérification en deux étapes dans les paramètres WhatsApp (paramètres > Compte > Vérification en deux étapes).",
        "Ne partagez jamais le code reçu par SMS, même avec quelqu'un qui se présente comme un proche ou un support technique.",
        "Méfiez-vous des messages qui vous demandent d'installer une application ou de cliquer sur un lien pour « vérifier votre compte ».",
        "Si votre compte est pris, contactez rapidement WhatsApp via l'application sur un autre téléphone ou le centre d'aide."
      ],
      reflex: "Le support officiel de WhatsApp ne vous demandera jamais votre code de vérification par message.",
      notion: "La vérification en deux étapes de WhatsApp ajoute un code PIN personnel. Même si quelqu'un obtient votre SMS, il ne pourra pas finaliser la prise de contrôle sans ce PIN.",
      sources: [
        {
          name: "WhatsApp Help Center",
          title: "À propos de la vérification en deux étapes",
          url: "https://faq.whatsapp.com/1079266226655111"
        },
        {
          name: "Cybermalveillance.gouv.fr",
          title: "Usurpation d'identité sur les réseaux sociaux et messageries",
          url: "https://www.cybermalveillance.gouv.fr/tous-nos-contenus/fiches-reflexes/usurpation-identite-reseaux-sociaux-messageries"
        }
      ]
    }
  },
  {
    id: "mobile-money",
    title: "Mobile Money",
    description: "Protéger ses transactions et reconnaître les arnaques liées à l'argent mobile.",
    category: "finance",
    duration: "10 min",
    level: "débutant",
    content: {
      situation: "Vous recevez un appel ou un SMS : « Votre compte Mobile Money a un problème. Donnez-nous votre code secret pour le débloquer. » Ou encore : « Vous avez gagné un concours, envoyez 500 F pour les frais de retrait. »",
      question: "Quels sont les réflexes essentiels avec le Mobile Money ?",
      explanation: "Les arnaques liées au Mobile Money sont très répandues. Les opérateurs ne demandent jamais votre code secret par téléphone, SMS ou message. Toute personne qui le demande cherche à vider votre compte.",
      points: [
        "Ne communiquez jamais votre code PIN ou code secret, même à un agent qui se présente comme employé de l'opérateur.",
        "Méfiez-vous des demandes d'argent pour « valider un gain », « débloquer un compte » ou « confirmer une transaction ».",
        "Vérifiez toujours le destinataire avant de valider un transfert.",
        "Activez les notifications de transaction et consultez régulièrement votre solde.",
        "En cas de doute, raccrochez et composez vous-même le numéro officiel du service client."
      ],
      reflex: "Aucun service légitime ne vous demandera de composer un code USSD dicté par téléphone ou de valider une transaction dont vous n'êtes pas à l'origine.",
      notion: "Le code PIN Mobile Money est l'équivalent de votre signature. Celui qui le possède peut déplacer votre argent. Traitez-le avec la même prudence qu'une clé de coffre.",
      sources: [
        {
          name: "Cybermalveillance.gouv.fr",
          title: "Arnaques aux faux supports techniques",
          url: "https://www.cybermalveillance.gouv.fr/tous-nos-contenus/fiches-reflexes/arnaques-faux-support-technique"
        }
      ]
    }
  },
  {
    id: "reseaux-sociaux",
    title: "Réseaux sociaux",
    description: "Limiter les risques sur Facebook, Instagram et les autres plateformes.",
    category: "comptes",
    duration: "8 min",
    level: "débutant",
    content: {
      situation: "Un compte qui ressemble à celui d'un ami vous envoie un message privé avec un lien « pour voir une photo de vous ». Ou vous voyez une publication promettant un iPhone gratuit si vous commentez et partagez.",
      question: "Comment réduire les risques sur les réseaux sociaux ?",
      explanation: "Les réseaux sociaux sont des cibles privilégiées pour le phishing, l'usurpation d'identité et les arnaques. Les paramètres de confidentialité et quelques réflexes simples diminuent fortement l'exposition.",
      points: [
        "Vérifiez régulièrement les paramètres de confidentialité de vos comptes.",
        "Limitez les informations visibles par le public (numéro de téléphone, adresse, date de naissance complète).",
        "Méfiez-vous des messages privés contenant des liens, même s'ils semblent provenir d'amis.",
        "Ne participez pas aux « concours » qui demandent de partager massivement ou d'envoyer de l'argent.",
        "Activez les alertes de connexion et la double authentification."
      ],
      reflex: "Si un ami vous envoie un message inhabituel avec un lien, contactez-le par un autre moyen (appel, SMS) pour vérifier.",
      notion: "Un compte piraté peut servir à arnaquer tout le cercle d'amis de la victime. Protéger son propre compte, c'est aussi protéger ses proches.",
      sources: [
        {
          name: "Meta Security",
          title: "Centre de sécurité",
          url: "https://www.facebook.com/security"
        },
        {
          name: "Cybermalveillance.gouv.fr",
          title: "Usurpation d'identité",
          url: "https://www.cybermalveillance.gouv.fr/tous-nos-contenus/fiches-reflexes/usurpation-identite-reseaux-sociaux-messageries"
        }
      ]
    }
  },
  {
    id: "donnees-personnelles",
    title: "Données personnelles",
    description: "Comprendre ce que sont les données personnelles et pourquoi les protéger.",
    category: "bases",
    duration: "7 min",
    level: "débutant",
    content: {
      situation: "Un site ou une application vous demande votre nom complet, votre date de naissance, votre numéro de téléphone, votre adresse et une photo de votre pièce d'identité pour « valider votre inscription » à un concours.",
      question: "Quelles informations faut-il vraiment partager ?",
      explanation: "Les données personnelles permettent de vous identifier. Entre de mauvaises mains, elles servent à l'usurpation d'identité, au harcèlement ou à des fraudes. Plus vous en donnez, plus le risque augmente.",
      points: [
        "Ne fournissez jamais de copie de pièce d'identité à un site ou une personne non officielle.",
        "Méfiez-vous des formulaires qui demandent plus d'informations que nécessaire.",
        "Vérifiez qui est derrière le service avant de créer un compte.",
        "Sur les réseaux sociaux, limitez la visibilité de vos informations personnelles.",
        "Un service légitime explique pourquoi il a besoin d'une donnée et comment elle est protégée."
      ],
      reflex: "Avant de remplir un formulaire, demandez-vous : « Est-ce vraiment indispensable pour ce service ? »",
      notion: "Une donnée personnelle n'est pas seulement votre nom. Votre numéro de téléphone, votre adresse email, votre photo, votre voix ou même votre adresse IP peuvent permettre de vous identifier.",
      sources: [
        {
          name: "CNIL",
          title: "Qu'est-ce qu'une donnée personnelle ?",
          url: "https://www.cnil.fr/fr/definition/donnee-personnelle"
        },
        {
          name: "CNIL",
          title: "Les droits sur vos données",
          url: "https://www.cnil.fr/fr/les-droits-pour-maitriser-vos-donnees-personnelles"
        }
      ]
    }
  },
  {
    id: "arnaques-en-ligne",
    title: "Arnaques en ligne",
    description: "Reconnaître les schémas d'arnaque les plus courants sur internet.",
    category: "arnaques",
    duration: "9 min",
    level: "débutant",
    content: {
      situation: "Vous voyez une publicité pour un produit à prix imbattable. Le site a l'air professionnel. Ou quelqu'un vous contacte pour une « opportunité d'investissement » avec des gains garantis.",
      question: "Quels sont les signaux d'alerte d'une arnaque ?",
      explanation: "Les arnaques en ligne suivent souvent les mêmes schémas : promesse trop belle, urgence, pression émotionnelle, demande d'argent ou d'informations avant toute livraison.",
      points: [
        "Si une offre semble trop belle pour être vraie, elle l'est probablement.",
        "Méfiez-vous des paiements demandés par des moyens non traçables (transfert Mobile Money vers un particulier, cartes cadeaux).",
        "Vérifiez l'existence réelle de l'entreprise (site web officiel, avis indépendants, présence physique).",
        "Ne cédez pas à la pression de l'urgence : un vendeur honnête laisse le temps de réfléchir.",
        "Recherchez le nom de l'offre ou de l'entreprise suivi du mot « arnaque »."
      ],
      reflex: "Prenez toujours le temps de vérifier avant d'envoyer de l'argent. Un vrai vendeur ou investisseur n'a pas besoin de vous presser.",
      notion: "Les arnaqueurs exploitent la confiance, la cupidité ou la peur. Reconnaître le schéma émotionnel est aussi important que reconnaître les indices techniques.",
      sources: [
        {
          name: "Cybermalveillance.gouv.fr",
          title: "Arnaques en ligne",
          url: "https://www.cybermalveillance.gouv.fr/tous-nos-contenus/fiches-reflexes"
        },
        {
          name: "FTC",
          title: "Consumer Advice – Scams",
          url: "https://consumer.ftc.gov/scams"
        }
      ]
    }
  },
  {
    id: "faux-concours",
    title: "Faux concours",
    description: "Identifier les faux tirages au sort et concours frauduleux.",
    category: "arnaques",
    duration: "6 min",
    level: "débutant",
    content: {
      situation: "Vous recevez un message : « Félicitations, vous avez gagné un smartphone ! Cliquez ici pour réclamer votre lot. » Ou une publication Facebook vous annonce un gain après avoir commenté.",
      question: "Comment reconnaître un faux concours ?",
      explanation: "Les faux concours servent à collecter des données personnelles, à installer des logiciels malveillants ou à demander des « frais de livraison » qui ne mènent à aucun lot.",
      points: [
        "Un vrai organisateur de concours ne demande pas d'argent pour « libérer » un lot.",
        "Vérifiez le compte qui publie : nombre d'abonnés, historique, cohérence.",
        "Méfiez-vous des concours qui demandent de partager massivement ou de taguer des amis.",
        "Aucun service officiel ne vous contacte de façon inattendue pour vous annoncer un gain.",
        "Si vous n'avez jamais participé, vous ne pouvez pas avoir gagné."
      ],
      reflex: "Ignorez les annonces de gains inattendus. Si le doute persiste, contactez l'organisateur par un canal officiel vérifié.",
      notion: "Les faux concours reposent sur l'espoir d'un gain facile. La règle simple : on ne paie jamais pour recevoir un lot gagné.",
      sources: [
        {
          name: "Cybermalveillance.gouv.fr",
          title: "Arnaques aux faux concours et lots",
          url: "https://www.cybermalveillance.gouv.fr/tous-nos-contenus/fiches-reflexes"
        }
      ]
    }
  },
  {
    id: "fausses-offres-emploi",
    title: "Fausses offres d'emploi",
    description: "Repérer les offres d'emploi frauduleuses et éviter les pièges.",
    category: "arnaques",
    duration: "8 min",
    level: "débutant",
    content: {
      situation: "Vous trouvez une offre d'emploi très bien payée, avec peu d'exigences. On vous demande d'envoyer une copie de pièce d'identité, de payer des « frais de dossier » ou d'acheter du matériel avant de commencer.",
      question: "Quels sont les signes d'une fausse offre d'emploi ?",
      explanation: "Les fausses offres d'emploi visent à collecter des données personnelles, à extorquer de l'argent ou à recruter pour des activités illégales (mule financière).",
      points: [
        "Un employeur sérieux ne demande pas d'argent pour un entretien ou un recrutement.",
        "Méfiez-vous des offres trop avantageuses avec très peu d'exigences.",
        "Vérifiez l'existence de l'entreprise (site web, réseaux sociaux professionnels, adresse physique).",
        "Ne envoyez jamais de pièce d'identité complète à un recruteur non vérifié.",
        "Les entretiens se déroulent généralement par visioconférence ou en présentiel, pas uniquement par messagerie instantanée."
      ],
      reflex: "Avant d'envoyer le moindre document ou argent, vérifiez l'entreprise de façon indépendante.",
      notion: "Les arnaques à l'emploi exploitent le besoin de travailler. Prendre le temps de vérifier protège à la fois votre argent et votre identité.",
      sources: [
        {
          name: "Cybermalveillance.gouv.fr",
          title: "Arnaques aux fausses offres d'emploi",
          url: "https://www.cybermalveillance.gouv.fr/tous-nos-contenus/fiches-reflexes"
        }
      ]
    }
  },
  {
    id: "investissements",
    title: "Fausses opportunités d'investissement",
    description: "Reconnaître les arnaques aux placements et aux cryptomonnaies.",
    category: "arnaques",
    duration: "8 min",
    level: "intermédiaire",
    content: {
      situation: "Quelqu'un vous contacte sur WhatsApp ou Facebook pour vous proposer un investissement avec des gains mensuels garantis de 20 % ou plus. Ou une publicité vante une plateforme de trading « sans risque ».",
      question: "Pourquoi les gains garantis élevés sont-ils un signal d'alerte ?",
      explanation: "Tout investissement comporte un risque. Les promesses de gains élevés et garantis sont typiques des arnaques pyramidales ou des plateformes frauduleuses. Une fois l'argent envoyé, il est souvent impossible de le récupérer.",
      points: [
        "Aucun investissement légitime ne garantit des rendements élevés sans risque.",
        "Méfiez-vous des contacts non sollicités proposant des placements.",
        "Vérifiez si la plateforme est autorisée par les autorités financières de votre pays.",
        "Ne confiez jamais d'argent à quelqu'un uniquement sur la base d'échanges par messagerie.",
        "Les témoignages et captures d'écran de gains peuvent être fabriqués."
      ],
      reflex: "Avant tout investissement, renseignez-vous auprès d'organismes officiels et méfiez-vous de la pression à « investir maintenant ».",
      notion: "Si les gains étaient vraiment aussi élevés et sans risque, l'offre ne serait pas proposée à des inconnus sur les réseaux sociaux.",
      sources: [
        {
          name: "Cybermalveillance.gouv.fr",
          title: "Arnaques aux investissements",
          url: "https://www.cybermalveillance.gouv.fr/tous-nos-contenus/fiches-reflexes"
        },
        {
          name: "FTC",
          title: "Investment Scams",
          url: "https://consumer.ftc.gov/articles/investment-scams"
        }
      ]
    }
  },
  {
    id: "telephone-applications",
    title: "Téléphone et applications",
    description: "Sécuriser son smartphone et les applications installées.",
    category: "appareils",
    duration: "8 min",
    level: "débutant",
    content: {
      situation: "Vous voyez une application gratuite qui promet de « booster » votre téléphone ou de vous donner des crédits de communication. Elle n'est pas disponible sur le store officiel.",
      question: "Comment installer des applications en toute sécurité ?",
      explanation: "Les applications hors des stores officiels (Google Play, App Store) peuvent contenir des logiciels malveillants capables de voler vos codes, lire vos messages ou contrôler votre téléphone à distance.",
      points: [
        "Installez les applications uniquement depuis les stores officiels.",
        "Vérifiez les avis, le nombre de téléchargements et les permissions demandées.",
        "Refusez les permissions inutiles (accès aux contacts, SMS, appareil photo si l'application n'en a pas besoin).",
        "Maintenez votre système et vos applications à jour.",
        "Verrouillez votre téléphone avec un code, une empreinte ou la reconnaissance faciale."
      ],
      reflex: "Si une application demande des permissions qui n'ont aucun rapport avec sa fonction, ne l'installez pas.",
      notion: "Un téléphone non verrouillé et rempli d'applications provenant de sources inconnues est une porte ouverte sur vos comptes et votre argent.",
      sources: [
        {
          name: "Google Safety Center",
          title: "Sécurité sur Android",
          url: "https://safety.google/android/"
        },
        {
          name: "Cybermalveillance.gouv.fr",
          title: "Sécuriser son smartphone",
          url: "https://www.cybermalveillance.gouv.fr/tous-nos-contenus/fiches-reflexes"
        }
      ]
    }
  },
  {
    id: "wifi-public",
    title: "Wi-Fi public",
    description: "Utiliser les réseaux Wi-Fi publics sans exposer ses données.",
    category: "reseaux",
    duration: "6 min",
    level: "débutant",
    content: {
      situation: "Vous êtes dans un café, un aéroport ou une gare. Un réseau Wi-Fi libre s'affiche. Vous devez consulter votre compte bancaire ou valider un paiement Mobile Money.",
      question: "Quels risques comporte un Wi-Fi public ?",
      explanation: "Sur un réseau Wi-Fi ouvert, d'autres personnes connectées peuvent parfois intercepter le trafic non chiffré. De plus, un attaquant peut créer un faux réseau au nom d'un établissement pour intercepter les connexions.",
      points: [
        "Évitez les opérations sensibles (banque, Mobile Money, mots de passe) sur un Wi-Fi public.",
        "Préférez les données mobiles pour les actions importantes.",
        "Vérifiez le nom exact du réseau auprès du personnel de l'établissement.",
        "Désactivez le partage de fichiers et la connexion automatique aux réseaux ouverts.",
        "Un VPN de confiance peut ajouter une couche de protection, mais n'est pas une solution magique."
      ],
      reflex: "Pour toute opération financière, utilisez votre connexion mobile plutôt qu'un Wi-Fi public.",
      notion: "Un réseau Wi-Fi « gratuit » n'est pas forcément sûr. La gratuité ne dit rien sur la sécurité du réseau ni sur l'identité de celui qui le gère.",
      sources: [
        {
          name: "Cybermalveillance.gouv.fr",
          title: "Réseaux Wi-Fi publics",
          url: "https://www.cybermalveillance.gouv.fr/tous-nos-contenus/fiches-reflexes"
        },
        {
          name: "CISA",
          title: "Securing Wireless Networks",
          url: "https://www.cisa.gov/news-events/news/securing-wireless-networks"
        }
      ]
    }
  },
  {
    id: "emails-suspects",
    title: "Emails suspects",
    description: "Analyser un email avant d'ouvrir une pièce jointe ou de cliquer.",
    category: "bases",
    duration: "7 min",
    level: "débutant",
    content: {
      situation: "Vous recevez un email intitulé « Facture impayée – Action requise » ou « Votre colis est en attente ». L'expéditeur semble être une entreprise connue, mais l'adresse email est légèrement différente.",
      question: "Comment vérifier un email suspect ?",
      explanation: "Les emails de phishing imitent le style des messages officiels. L'adresse de l'expéditeur, le ton urgent et les liens sont les premiers éléments à contrôler.",
      points: [
        "Regardez l'adresse email complète de l'expéditeur, pas seulement le nom affiché.",
        "Méfiez-vous des fautes d'orthographe et de grammaire inhabituelles.",
        "Ne téléchargez pas de pièce jointe inattendue.",
        "Survolez les liens pour voir la vraie destination avant de cliquer.",
        "En cas de doute, connectez-vous directement au site officiel sans passer par l'email."
      ],
      reflex: "Un service légitime vous laisse le temps de vérifier. L'urgence est souvent un outil de manipulation.",
      notion: "L'adresse d'expédition peut être falsifiée. En cas de doute, ne répondez pas à l'email et utilisez un autre canal pour contacter l'organisation.",
      sources: [
        {
          name: "Cybermalveillance.gouv.fr",
          title: "Phishing et emails frauduleux",
          url: "https://www.cybermalveillance.gouv.fr/tous-nos-contenus/fiches-reflexes/phishing-hameconnage"
        },
        {
          name: "CISA",
          title: "Phishing Guidance",
          url: "https://www.cisa.gov/stopransomware/phishing-guidance"
        }
      ]
    }
  }
];

// Export for use in modules or global
if (typeof window !== 'undefined') {
  window.LESSONS = LESSONS;
}