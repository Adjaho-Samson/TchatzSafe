'use strict';
document.addEventListener('DOMContentLoaded', () => {
  const descriptions = {
    shopping:
      'Reconnaître l’usurpation de l’identité d’un commerce et les faux sites de vente. Les recours cités concernent la France.',
    whatsapp:
      'Vérification en deux étapes du compte WhatsApp. Les pages d’aide peuvent limiter l’accès automatisé.',
    phishing:
      'Les mécanismes de l’hameçonnage, la prévention et les premières actions. Les recours cités concernent notamment la France.',
    account:
      'Prévention et réaction face à un compte compromis. Consultez aussi l’aide officielle du service concerné.',
    password: 'Recommandations et outils pour choisir des secrets robustes et uniques.',
    personal: 'Définir les données personnelles et comprendre pourquoi les protéger.',
    jobs: 'Signaux des faux emplois et recrutements. Les procédures juridiques citées concernent la France.',
    investments:
      'Promesses de rendement, pressions et méthodes des fraudes aux investissements. L’AMF est une autorité française : pour une démarche, contactez l’autorité de votre pays.',
    prizes:
      'Faux jeux concours et collecte frauduleuse de données : section 4 du dossier JOP 2024. Ce sont des conseils généraux, pas une actualité de l’événement.',
    momo: 'Conseils généraux d’un opérateur sur la confidentialité des codes secrets. Les codes de service et procédures sont propres au Cameroun et ne sont pas repris comme instructions pour le Bénin.',
    android:
      'Google Play Protect et précautions pour les applications Android. Les réglages peuvent varier selon l’appareil.',
    permissions: 'Comprendre et modifier les autorisations d’une application sur Android.',
    cnin: 'Site officiel du Centre National d’Investigations Numériques au Bénin. Consultez directement ce site pour une démarche réelle.',
    anssi: 'Ressources institutionnelles françaises sur la sécurité numérique.',
  };
  document.getElementById('source-directory').innerHTML = Object.entries(SOURCES)
    .map(
      ([id, source]) =>
        `<article class="card source-card"><span class="tag">${source.language === 'en' ? 'EN ANGLAIS' : 'EN FRANÇAIS'}</span><h2 class="mt-4">${App.escapeHtml(source.name)}</h2><p>${App.escapeHtml(descriptions[id] || source.title)}</p><a href="${App.escapeHtml(source.url)}" target="_blank" rel="noopener noreferrer" class="text-link">Consulter la référence ${App.icon('external')}<span class="sr-only"> (nouvel onglet)</span></a></article>`
    )
    .join('');
});
