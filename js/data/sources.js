'use strict';
/** Références publiques, consultées pour la refonte le 12 octobre 2026. Aucun partenariat implicite. */
const SOURCES = {
  phishing: {
    name: 'Cybermalveillance.gouv.fr',
    title: 'Que faire en cas de phishing ou hameçonnage ?',
    url: 'https://www.cybermalveillance.gouv.fr/tous-nos-contenus/fiches-reflexes/hameconnage-phishing',
    language: 'fr',
  },
  shopping: {
    name: 'Cybermalveillance.gouv.fr',
    title: 'Usurpation de site Internet professionnel et faux sites de vente',
    url: 'https://www.cybermalveillance.gouv.fr/tous-nos-contenus/fiches-reflexes/usurpation-site-internet-professionnel',
    language: 'fr',
  },
  whatsapp: {
    name: 'WhatsApp — Pages d’aide',
    title: 'À propos de la vérification en deux étapes',
    url: 'https://faq.whatsapp.com/2976081889094372/?locale=fr_FR',
    language: 'en',
  },
  account: {
    name: 'Cybermalveillance.gouv.fr',
    title: 'Le piratage de compte',
    url: 'https://www.cybermalveillance.gouv.fr/tous-nos-contenus/fiches-reflexes/piratage-de-compte',
    language: 'fr',
  },
  password: {
    name: 'CNIL',
    title: 'Mots de passe : recommandations et outils',
    url: 'https://www.cnil.fr/fr/mots-de-passe',
    language: 'fr',
  },
  personal: {
    name: 'CNIL',
    title: 'Qu’est-ce qu’une donnée personnelle ?',
    url: 'https://www.cnil.fr/fr/definition/donnee-personnelle',
    language: 'fr',
  },
  jobs: {
    name: 'Cybermalveillance.gouv.fr',
    title: 'Fausse annonce d’emploi, que faire ?',
    url: 'https://www.cybermalveillance.gouv.fr/tous-nos-contenus/fiches-reflexes/fausses-offres-demploi-creees-par-des-fraudeurs',
    language: 'fr',
  },
  investments: {
    name: 'AMF — France',
    title: 'Éviter les arnaques aux placements financiers',
    url: 'https://www.amf-france.org/fr/espace-epargnants/proteger-son-epargne/eviter-les-arnaques',
    language: 'fr',
  },
  prizes: {
    name: 'Cybermalveillance.gouv.fr',
    title: 'Faux jeux concours : conseils du dossier JOP 2024, section 4',
    url: 'https://www.cybermalveillance.gouv.fr/tous-nos-contenus/actualites/jop-2024-cybersecurite-particuliers',
    language: 'fr',
  },
  momo: {
    name: 'MTN Cameroun',
    title: 'Sécuriser son compte MoMo — conseils généraux sur les codes secrets',
    url: 'https://mtn.cm/helppersonal/momo-account/',
    language: 'en',
  },
  android: {
    name: 'Google — Aide Google Play',
    title: 'Utiliser Google Play Protect pour protéger vos applications',
    url: 'https://support.google.com/googleplay/answer/2812853?hl=fr',
    language: 'fr',
  },
  permissions: {
    name: 'Google — Aide Android',
    title: 'Modifier les autorisations des applications',
    url: 'https://support.google.com/android/answer/9431959?hl=fr',
    language: 'fr',
  },
  cnin: {
    name: 'CNIN — Bénin',
    title: 'Centre National d’Investigations Numériques : site officiel',
    url: 'https://www.cnin.bj/',
    language: 'fr',
  },
  anssi: {
    name: 'ANSSI',
    title: 'Cyber.gouv.fr — ressources de l’agence',
    url: 'https://cyber.gouv.fr/',
    language: 'fr',
  },
};
if (typeof window !== 'undefined') window.SOURCES = SOURCES;
