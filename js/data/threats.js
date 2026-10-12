'use strict';
const THREATS = [
  {
    id: 'mobile-money',
    title: 'Fraudes Mobile Money',
    shortTitle: 'Fraudes Mobile Money',
    category: 'Paiements',
    icon: 'wallet',
    description:
      'Faux transferts, faux agents et demandes de codes secrets : protégez votre argent.',
    lesson: 'mobile-money',
    mechanism:
      'Un interlocuteur se présente comme un agent ou prétend avoir envoyé de l’argent par erreur. Il cherche à vous faire transmettre votre PIN ou effectuer un transfert avant que vous ne vérifiiez l’opération. Un SMS imitant un reçu ne prouve pas qu’un crédit a eu lieu.',
    example:
      '« Je suis du support. Un transfert a été envoyé par erreur. Communiquez votre PIN pour que je l’annule. »',
    warnings: [
      'Le code PIN ou un code d’authentification vous est demandé.',
      'Une pression vous empêche de vérifier le solde et l’historique officiels.',
      'Le remboursement doit être fait vers un numéro différent ou inconnu.',
    ],
    precautions: [
      'Vérifiez le solde et les transactions dans l’application ou le menu officiel de votre opérateur.',
      'Gardez votre PIN secret, y compris face à un prétendu agent.',
      'Contactez le support avec ses coordonnées officielles, trouvées indépendamment.',
    ],
    response: [
      'Arrêtez l’échange et ne faites pas de nouveau transfert.',
      'Si un code a été partagé ou de l’argent a été débité, contactez rapidement l’opérateur par son canal officiel.',
      'Conservez les messages et références de transaction en privé. Un remboursement ne peut pas être garanti.',
    ],
    sources: [SOURCES.momo, SOURCES.phishing],
  },
  {
    id: 'faux-emplois',
    title: 'Faux emplois et recrutements',
    shortTitle: 'Faux emplois',
    category: 'Recrutement',
    icon: 'briefcase',
    description: 'Une promesse d’emploi ne doit pas vous coûter votre argent ou votre identité.',
    lesson: 'fausses-offres-emploi',
    mechanism:
      'Une annonce reprend le nom d’une entreprise ou promet un salaire très attractif. Le faux recruteur réclame des frais, des documents personnels ou l’utilisation de votre compte pour déplacer de l’argent, sans emploi réel derrière la proposition.',
    example:
      '« Vous êtes retenu pour un poste à Cotonou. Payez 5 000 FCFA de frais de dossier aujourd’hui pour recevoir votre contrat. »',
    warnings: [
      'Des frais sont exigés pour participer à un entretien ou obtenir le poste.',
      'L’identité du recruteur et la présence de l’offre ne sont pas vérifiables sur le site officiel.',
      'Vous devez recevoir puis transférer de l’argent via votre compte personnel.',
    ],
    precautions: [
      'Vérifiez l’offre sur le site officiel de l’entreprise ou auprès de ses coordonnées indépendantes.',
      'Ne payez pas pour une promesse de recrutement.',
      'Ne transmettez pas une pièce d’identité complète à un interlocuteur non vérifié.',
    ],
    response: [
      'Interrompez les versements et conservez l’annonce, les échanges et les reçus.',
      'Prévenez l’entreprise dont le nom est utilisé avec des coordonnées trouvées ailleurs.',
      'Si vous avez perdu de l’argent ou transmis des documents, sollicitez le prestataire financier ou l’autorité compétente.',
    ],
    sources: [SOURCES.jobs, SOURCES.personal],
  },
  {
    id: 'phishing',
    title: 'Phishing par SMS et e-mail',
    shortTitle: 'Phishing SMS et e-mail',
    category: 'Messagerie',
    icon: 'message',
    description: 'Apprenez à repérer les messages qui imitent un service de confiance.',
    lesson: 'phishing',
    mechanism:
      'Un message se fait passer pour une banque, un transporteur, une administration ou une personne connue. Il vous pousse à ouvrir un lien, télécharger un fichier ou révéler des informations sensibles. Le nom de l’expéditeur et les logos peuvent être copiés.',
    example:
      '« Votre colis est suspendu. Réglez les frais dans 10 minutes : https://livraison-verification.example/colis »',
    warnings: [
      'Un message inattendu impose une urgence ou une menace.',
      'L’adresse ou le domaine ne correspond pas au canal habituel.',
      'Des informations sensibles, un paiement ou une pièce jointe inattendue sont demandés.',
    ],
    precautions: [
      'Retrouvez le service dans son application ou avec une adresse officielle saisie vous-même.',
      'Vérifiez par un autre canal, sans répondre au message suspect.',
      'Ne communiquez aucun code de connexion ni mot de passe à votre interlocuteur.',
    ],
    response: [
      'Si vous n’avez rien transmis, ne poursuivez pas l’échange.',
      'Si un mot de passe a été saisi, changez-le sur le service officiel ainsi que sur les comptes où il était réutilisé.',
      'Si des données de paiement ont été exposées, contactez le prestataire financier et conservez les preuves.',
    ],
    sources: [SOURCES.phishing, SOURCES.account],
  },
  {
    id: 'investissements',
    title: 'Faux investissements',
    shortTitle: 'Faux investissements',
    category: 'Finance',
    icon: 'chart',
    description:
      'Gains garantis, trading miracle ou placements sans risque : prenez le temps de vérifier.',
    lesson: 'investissements',
    mechanism:
      'Une plateforme ou un interlocuteur promet des rendements élevés avec peu ou pas de risque. Des tableaux de gains et des témoignages peuvent être fabriqués. Après votre dépôt, de nouveaux paiements sont parfois réclamés pour retirer l’argent.',
    example:
      '« Investissez 20 000 FCFA et doublez votre mise en une semaine. Gains garantis, aucun risque. Offre réservée aux premiers inscrits. »',
    warnings: [
      'Les rendements sont élevés, garantis et présentés comme sans risque.',
      'On vous presse d’investir ou de recruter d’autres personnes.',
      'Des frais supplémentaires empêchent le retrait des gains affichés.',
    ],
    precautions: [
      'Vérifiez l’existence et l’agrément du prestataire auprès de l’autorité financière compétente de votre pays.',
      'Ne vous fiez pas seulement aux captures, aux témoignages ou à un premier petit versement.',
      'Ne placez pas d’argent sous pression ou uniquement sur la base de messages privés.',
    ],
    response: [
      'Ne versez pas de nouvel argent pour « débloquer » les fonds.',
      'Conservez les documents, messages et références de paiement ; contactez le prestataire financier et l’autorité compétente.',
      'Méfiez-vous d’une seconde promesse de récupération de fonds contre des frais.',
    ],
    sources: [SOURCES.investments],
  },
  {
    id: 'faux-comptes',
    title: 'Faux comptes et usurpation',
    shortTitle: 'Faux comptes',
    category: 'Réseaux sociaux',
    icon: 'user',
    description:
      'Une photo familière n’est pas une preuve d’identité. Vérifiez avant de faire confiance.',
    lesson: 'reseaux-sociaux',
    mechanism:
      'Une personne copie le nom et la photo d’un proche, d’un commerce ou d’une personnalité. Un vrai compte peut aussi être compromis. Elle exploite la confiance pour demander de l’argent, un code ou des documents.',
    example:
      'Un nouveau profil utilisant la photo de votre cousin écrit : « Mon téléphone est en panne. Envoie 15 000 FCFA sur ce nouveau numéro, je te rembourse ce soir. »',
    warnings: [
      'La demande est inhabituelle et refuse une vérification par appel.',
      'Le profil ou le nom d’utilisateur diffère de celui que vous connaissez.',
      'Un code, un paiement urgent ou de nouveaux documents sont exigés.',
    ],
    precautions: [
      'Appelez votre proche avec un numéro déjà connu, pas celui fourni dans la nouvelle demande.',
      'Comparez le nom d’utilisateur et l’historique, sans considérer ces éléments comme une garantie.',
      'Limitez la visibilité de vos données personnelles et sécurisez vos propres comptes.',
    ],
    response: [
      'Signalez le profil à la plateforme en tant que profil suspect, sans publier une accusation non vérifiée.',
      'Alertez la personne dont l’identité semble utilisée par un canal indépendant.',
      'Si votre compte est compromis, utilisez la récupération officielle, déconnectez les sessions inconnues et prévenez vos contacts.',
    ],
    sources: [SOURCES.account, SOURCES.personal],
  },
  {
    id: 'liens-suspects',
    title: 'Liens suspects',
    shortTitle: 'Liens suspects',
    category: 'Navigation',
    icon: 'link',
    description: 'L’adresse mérite autant d’attention que le message qui l’accompagne.',
    lesson: 'liens-suspects',
    mechanism:
      'Une adresse peut inclure un nom rassurant, des caractères ressemblants ou un lien raccourci. Elle peut conduire à une fausse page de connexion ou à une autre destination après une redirection. Une lecture locale ne voit pas le contenu du site ni la réputation du domaine.',
    example:
      'https://banque.example@verification.example/connexion : le domaine de destination est verification.example, pas banque.example. Les deux domaines sont fictifs.',
    warnings: [
      'La destination est masquée par un raccourcisseur ou un affichage tronqué.',
      'Le nom officiel est placé dans le chemin, un sous-domaine ou avant @.',
      'Un message exige d’ouvrir le lien ou de se connecter immédiatement.',
    ],
    precautions: [
      'N’ouvrez pas le lien pour le tester. Utilisez l’application ou l’adresse officielle trouvée indépendamment.',
      'HTTPS chiffre la connexion, sans garantir l’honnêteté du site.',
      'Ne transmettez pas à un service externe une URL contenant un code, un jeton privé ou d’autres données personnelles.',
    ],
    response: [
      'Si vous avez seulement reçu le lien, ne le suivez pas et vérifiez le message autrement.',
      'Si des identifiants ont été saisis, sécurisez le compte sur le service officiel.',
      'L’absence d’indicateur dans un outil local n’est jamais une preuve de sûreté.',
    ],
    sources: [SOURCES.phishing],
  },
];
if (typeof window !== 'undefined') window.THREATS = THREATS;
