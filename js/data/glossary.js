const GLOSSARY = [
  {
    term: "Arnaque",
    definition: "Technique visant à tromper une personne pour obtenir de l'argent, des biens ou des informations. Sur internet, les arnaques prennent souvent la forme de fausses offres, de faux supports techniques ou de promesses trop belles pour être vraies."
  },
  {
    term: "Authentification",
    definition: "Processus qui permet de vérifier que vous êtes bien la personne autorisée à accéder à un compte. Le mot de passe est une forme d'authentification. La double authentification en ajoute une seconde."
  },
  {
    term: "Chiffrement",
    definition: "Technique qui rend des données illisibles pour quiconque n'a pas la clé de déchiffrement. Lorsqu'un site utilise https, les données échangées entre votre navigateur et le site sont chiffrées."
  },
  {
    term: "Compte compromis",
    definition: "Compte auquel une personne non autorisée a réussi à accéder. Cela peut permettre d'envoyer des messages en votre nom, de voler des informations ou de bloquer votre accès."
  },
  {
    term: "Donnée personnelle",
    definition: "Toute information qui permet de vous identifier, directement ou indirectement : nom, prénom, numéro de téléphone, adresse email, photo, date de naissance, adresse IP, etc."
  },
  {
    term: "Double authentification",
    definition: "Méthode de sécurité qui demande deux preuves d'identité pour se connecter (par exemple un mot de passe et un code reçu sur le téléphone). On dit aussi 2FA ou authentification à deux facteurs."
  },
  {
    term: "Hameçonnage",
    definition: "Autre nom du phishing. Technique qui consiste à se faire passer pour un service de confiance afin d'obtenir des informations personnelles ou de faire cliquer sur un lien malveillant."
  },
  {
    term: "Lien malveillant",
    definition: "Lien qui mène vers un site dangereux : faux site de connexion, page qui installe un logiciel malveillant, ou formulaire destiné à voler vos identifiants."
  },
  {
    term: "Malware",
    definition: "Logiciel malveillant. Programme conçu pour nuire : voler des données, contrôler un appareil, afficher des publicités indésirables ou bloquer l'accès à vos fichiers (rançongiciel)."
  },
  {
    term: "Mot de passe",
    definition: "Secret qui permet de prouver votre identité pour accéder à un compte. Un bon mot de passe est long, unique et difficile à deviner."
  },
  {
    term: "Phishing",
    definition: "Technique d'attaque qui consiste à envoyer un message (email, SMS, message instantané) imitant un service de confiance pour vous pousser à révéler des informations ou à cliquer sur un lien dangereux."
  },
  {
    term: "VPN",
    definition: "Réseau privé virtuel. Service qui crée un tunnel chiffré entre votre appareil et un serveur distant. Il peut protéger vos données sur un réseau non fiable, mais ne rend pas anonyme à 100 % et ne protège pas contre tous les risques."
  },
  {
    term: "Wi-Fi public",
    definition: "Réseau sans fil accessible librement dans un lieu public (café, aéroport, gare…). Ces réseaux sont souvent moins sécurisés. Il est déconseillé d'y effectuer des opérations sensibles."
  }
];

if (typeof window !== 'undefined') {
  window.GLOSSARY = GLOSSARY;
}