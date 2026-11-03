'use strict';
/* Mesure d’audience Vercel facultative : jamais de contenu de formulaire ni de paramètres d’URL. */
(function () {
  const KEY = 'tchatzsafe_analytics_choice';
  const allowedPaths = new Set([
    '/',
    '/index.html',
    '/menaces.html',
    '/apprendre.html',
    '/quiz.html',
    '/conseils.html',
    '/glossaire.html',
    '/progression.html',
    '/analyser.html',
    '/signaler.html',
    '/moderation.html',
    '/a-propos.html',
    '/sources.html',
    '/confidentialite.html',
    '/404.html',
    '/hors-ligne.html',
  ]);
  let started = false;
  function choice() {
    try {
      return localStorage.getItem(KEY);
    } catch (_) {
      return null;
    }
  }
  function privacySignal() {
    return navigator.globalPrivacyControl === true || navigator.doNotTrack === '1';
  }
  function hasVercelAttribution() {
    // Ne pas transmettre d’identifiant ou de traits laissés par une autre intégration.
    // On ne supprime pas cette ancienne donnée locale : en cas de doute, on s’abstient.
    try {
      return Boolean(localStorage.getItem('__va_attribution'));
    } catch (_) {
      return true;
    }
  }
  function sanitize(event) {
    if (
      choice() !== 'accepted' ||
      privacySignal() ||
      hasVercelAttribution() ||
      !event ||
      event.type !== 'pageview' ||
      typeof event.url !== 'string'
    )
      return null;
    try {
      const url = new URL(event.url, location.origin);
      if (url.origin !== location.origin || !allowedPaths.has(url.pathname)) return null;
      // Les paramètres, fragments et identifiants de routes inconnues ne sont jamais transmis.
      url.search = '';
      url.hash = '';
      return { type: 'pageview', url: url.toString() };
    } catch (_) {
      return null;
    }
  }
  function minimizeReferrer() {
    // Le script Vercel lit document.referrer séparément de beforeSend. Ne garder que
    // l’origine évite d’envoyer un chemin ou des paramètres provenant d’un autre site.
    try {
      if (!document.referrer) return true;
      const referrer = new URL(document.referrer);
      const origin = ['https:', 'http:'].includes(referrer.protocol) ? referrer.origin + '/' : '';
      Object.defineProperty(document, 'referrer', { value: origin, configurable: true });
      return document.referrer === origin;
    } catch (_) {
      // Si le navigateur interdit cette réduction, aucune mesure n’est chargée.
      return false;
    }
  }
  function start() {
    if (
      started ||
      choice() !== 'accepted' ||
      privacySignal() ||
      !navigator.onLine ||
      hasVercelAttribution() ||
      !minimizeReferrer()
    )
      return;
    started = true;
    // Le paquet @vercel/analytics (build générique embarqué dans js/vendor) initialise la
    // file window.va, enregistre le rappel beforeSend et injecte /_vercel/insights/script.js.
    import('./vendor/vercel-analytics.mjs')
      .then(({ inject }) => {
        inject({ beforeSend: sanitize });
        const script = document.head.querySelector('script[src="/_vercel/insights/script.js"]');
        if (!script) return;
        script.dataset.optional = 'analytics';
        // Cette route est fournie par Vercel après activation ; son absence ne bloque jamais le site.
        script.addEventListener('error', () => {
          started = false;
          script.remove();
        });
      })
      .catch(() => {
        started = false;
      });
  }
  document.addEventListener('DOMContentLoaded', () => {
    const banner = document.getElementById('analytics-consent');
    const status = document.getElementById('analytics-choice-status');
    const allow = banner.querySelector('[data-analytics-accept]');
    function update() {
      const current = choice();
      status.textContent = privacySignal()
        ? 'Votre navigateur demande de limiter le suivi : la mesure reste désactivée.'
        : hasVercelAttribution()
          ? 'Une ancienne donnée d’attribution est présente : la mesure reste désactivée pour préserver votre vie privée.'
          : current === 'accepted'
            ? 'Votre choix actuel : mesure d’audience autorisée.'
            : current === 'denied'
              ? 'Votre choix actuel : mesure d’audience refusée.'
              : 'Aucune mesure d’audience n’est chargée avant votre choix.';
      allow.disabled = privacySignal() || hasVercelAttribution();
    }
    function select(value) {
      try {
        localStorage.setItem(KEY, value);
      } catch (_) {
        status.textContent =
          'Votre choix ne peut pas être enregistré sur cet appareil. La mesure reste désactivée.';
        return;
      }
      update();
      banner.hidden = true;
      if (value === 'accepted') start();
      // Après un refus, beforeSend vérifie immédiatement le choix avant tout événement ultérieur.
    }
    banner
      .querySelector('[data-analytics-accept]')
      .addEventListener('click', () => select('accepted'));
    banner
      .querySelector('[data-analytics-decline]')
      .addEventListener('click', () => select('denied'));
    document.querySelectorAll('[data-analytics-settings]').forEach((button) =>
      button.addEventListener('click', () => {
        banner.hidden = false;
        update();
        banner.scrollIntoView({ behavior: 'smooth', block: 'start' });
        banner.querySelector('h2').focus({ preventScroll: true });
      })
    );
    update();
    banner.hidden = choice() === 'accepted' || choice() === 'denied';
    if (choice() === 'accepted') start();
    window.addEventListener('online', start);
  });
  // Exposé uniquement pour les vérifications locales, sans stocker ni transmettre de données.
  window.TchatzAnalytics = { sanitize };
})();
