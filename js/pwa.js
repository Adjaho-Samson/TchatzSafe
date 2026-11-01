'use strict';
(function () {
  let installPrompt = null;
  let installed = false;
  let refreshing = false;
  const displayMode = matchMedia('(display-mode: standalone)');
  const isInstalled = () => installed || displayMode.matches || navigator.standalone === true;

  function updateInstallButtons() {
    document.querySelectorAll('[data-install-app]').forEach((button) => {
      const active = isInstalled();
      button.disabled = active;
      button.innerHTML =
        App.icon(active ? 'circlecheck' : 'install') +
        (active ? ' TchatzSafe est installée' : ' Installer TchatzSafe');
    });
  }
  window.addEventListener('beforeinstallprompt', (event) => {
    event.preventDefault();
    installPrompt = event;
    updateInstallButtons();
  });
  window.addEventListener('appinstalled', () => {
    installed = true;
    installPrompt = null;
    updateInstallButtons();
  });
  displayMode.addEventListener?.('change', updateInstallButtons);

  document.addEventListener('DOMContentLoaded', () => {
    updateInstallButtons();
    const dialog = document.getElementById('install-dialog');
    const instructions = document.getElementById('install-instructions');
    function showInstructions() {
      const agent = navigator.userAgent || '';
      const apple =
        /iPad|iPhone|iPod/.test(agent) ||
        (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
      const android = /Android/i.test(agent);
      instructions.textContent = apple
        ? 'Sur iPhone ou iPad, ouvrez ce site dans Safari, touchez le bouton Partager, puis choisissez « Sur l’écran d’accueil ». La disponibilité dépend de votre version d’iOS.'
        : android
          ? 'Sur Android, ouvrez le menu de votre navigateur et choisissez « Installer l’application » ou « Ajouter à l’écran d’accueil », si cette option est proposée.'
          : 'Sur ordinateur, ouvrez le menu de Chrome ou de Microsoft Edge et recherchez « Installer l’application » ou « Installer ce site comme application ». Certains navigateurs ne proposent pas l’installation.';
      dialog.showModal();
    }
    document.querySelectorAll('[data-install-app]').forEach((button) =>
      button.addEventListener('click', async () => {
        if (isInstalled()) return;
        if (!installPrompt) return showInstructions();
        const prompt = installPrompt;
        installPrompt = null;
        try {
          await prompt.prompt();
          await prompt.userChoice;
        } catch (_) {
          showInstructions();
        }
        updateInstallButtons();
      })
    );
    dialog.querySelector('[data-close-install]').addEventListener('click', () => dialog.close());
    document
      .querySelector('[data-reload-offline]')
      ?.addEventListener('click', () => location.reload());

    const offline = document.getElementById('offline-status');
    const updateNetwork = () => {
      offline.hidden = navigator.onLine;
    };
    updateNetwork();
    window.addEventListener('online', updateNetwork);
    window.addEventListener('offline', updateNetwork);
  });

  if ('serviceWorker' in navigator && window.isSecureContext) {
    window.addEventListener('load', async () => {
      try {
        const registration = await navigator.serviceWorker.register('sw.js');
        const banner = document.getElementById('update-status');
        const showUpdate = () => {
          if (registration.waiting && navigator.serviceWorker.controller) banner.hidden = false;
        };
        showUpdate();
        const observed = new WeakSet();
        const observe = (worker) => {
          if (!worker || observed.has(worker)) return;
          observed.add(worker);
          const updateState = () => {
            if (worker.state === 'installed') showUpdate();
            if (worker.state === 'redundant' && !navigator.serviceWorker.controller)
              document.getElementById('pwa-error').hidden = false;
            if (worker.state === 'activated') document.getElementById('pwa-error').hidden = true;
          };
          worker.addEventListener('statechange', updateState);
          updateState();
        };
        registration.addEventListener('updatefound', () => observe(registration.installing));
        // updatefound peut avoir eu lieu avant la résolution de register().
        observe(registration.installing);
        document.querySelector('[data-update-app]').addEventListener('click', () => {
          if (!registration.waiting) return;
          refreshing = true;
          registration.waiting.postMessage({ type: 'SKIP_WAITING' });
        });
        navigator.serviceWorker.addEventListener('controllerchange', () => {
          if (refreshing) location.reload();
        });
        window.addEventListener('online', () => registration.update().catch(() => {}));
      } catch (_) {
        // Le site en ligne reste utilisable ; le cache hors connexion n’est alors pas garanti.
        const status = document.getElementById('pwa-error');
        if (status) status.hidden = false;
      }
    });
  }
})();
