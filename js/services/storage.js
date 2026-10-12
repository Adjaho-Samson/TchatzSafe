'use strict';
/** Adaptateur local. Aucune requête réseau. Repli en mémoire si le stockage est bloqué. */
(function (root) {
  const memory = new Map();
  const pending = new Set();
  let persistent = true;
  let warning = '';
  function notify(message) {
    warning = message;
    if (typeof root.dispatchEvent === 'function' && typeof root.CustomEvent === 'function')
      root.dispatchEvent(
        new root.CustomEvent('tchatzsafe:storage-warning', { detail: { message } })
      );
  }
  const Store = {
    read(key, fallback = null) {
      if (pending.has(key)) return memory.has(key) ? JSON.parse(memory.get(key)) : fallback;
      let raw;
      try {
        raw = root.localStorage.getItem(key);
      } catch (_) {
        persistent = false;
        notify(
          'Le stockage de ce navigateur est indisponible. Vos avancées et brouillons restent uniquement dans cette session et seront perdus au changement de page, à la fermeture ou au rechargement.'
        );
        return memory.has(key) ? JSON.parse(memory.get(key)) : fallback;
      }
      if (raw === null) return fallback;
      try {
        return JSON.parse(raw);
      } catch (_) {
        notify(
          'Certaines données locales sont illisibles. Elles n’ont pas été effacées. La plateforme reste utilisable ; vous pouvez réinitialiser la progression depuis « Ma progression ».'
        );
        return fallback;
      }
    },
    write(key, value) {
      let raw;
      try {
        raw = JSON.stringify(value);
      } catch (_) {
        raw = undefined;
      }
      if (typeof raw !== 'string') {
        // Une valeur non sérialisable ne doit jamais être écrite telle quelle :
        // elle produirait ensuite une donnée locale illisible.
        notify(
          'Cette donnée n’a pas pu être préparée pour la sauvegarde locale. Elle reste utilisable dans cette page, mais ne sera pas conservée.'
        );
        return false;
      }
      memory.set(key, raw);
      try {
        root.localStorage.setItem(key, raw);
        pending.delete(key);
        return true;
      } catch (_) {
        pending.add(key);
        persistent = false;
        notify(
          'La sauvegarde sur cet appareil a échoué. Ces données restent uniquement dans la session de cette page et seront perdues si vous changez de page ou la rechargez. Exportez votre progression ici avant de continuer.'
        );
        return false;
      }
    },
    remove(key) {
      memory.delete(key);
      try {
        root.localStorage.removeItem(key);
        pending.delete(key);
        return true;
      } catch (_) {
        pending.add(key);
        persistent = false;
        notify(
          'Le stockage est bloqué : la suppression persistante n’a pas pu être confirmée. Effacez aussi les données du site dans les paramètres du navigateur.'
        );
        return false;
      }
    },
    get persistent() {
      return persistent;
    },
    get warning() {
      return warning;
    },
    warn: notify,
  };
  root.Store = Store;
  if (typeof module !== 'undefined' && module.exports) module.exports = Store;
})(typeof window === 'undefined' ? globalThis : window);
