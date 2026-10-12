'use strict';
(function () {
  const escapeHtml = (value) =>
    String(value == null ? '' : value).replace(
      /[&<>"']/g,
      (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[ch]
    );
  const normalize = (value) =>
    String(value)
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase();
  function icon(name, className = '') {
    const safeName = /^[a-z-]+$/.test(name) ? name : 'info';
    return `<svg class="icon ${escapeHtml(className)}" aria-hidden="true" focusable="false"><use href="assets/icons.svg#${safeName}"></use></svg>`;
  }
  function sourcesHtml(sources) {
    return sources
      .map((source) => {
        let url;
        try {
          url = new URL(source.url);
          if (url.protocol !== 'https:') return '';
        } catch (_) {
          return '';
        }
        return `<div class="source-item"><div><p class="source-name">${escapeHtml(source.name)}</p><p class="source-title">${escapeHtml(source.title)}${source.language === 'en' ? ' · en anglais' : ''}</p></div><a class="btn btn-secondary btn-sm" href="${escapeHtml(url.href)}" target="_blank" rel="noopener noreferrer">Consulter ${icon('external')}<span class="sr-only"> (nouvel onglet)</span></a></div>`;
      })
      .join('');
  }
  function downloadJson(filename, data) {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.append(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  function setTitle(title) {
    document.title = `${title} — TchatzSafe`;
  }
  window.App = { escapeHtml, normalize, icon, sourcesHtml, downloadJson, setTitle };
  const showAppError = () => {
    const banner = document.getElementById('app-error-banner');
    if (banner) banner.hidden = false;
  };
  window.addEventListener(
    'error',
    (event) => {
      if (event.target === window || ['SCRIPT', 'LINK'].includes(event.target?.tagName))
        showAppError();
    },
    true
  );
  window.addEventListener('unhandledrejection', showAppError);
  window.getUrlParam = (name) => new URLSearchParams(location.search).get(name);
  window.addEventListener('tchatzsafe:storage-warning', (event) => {
    const banner = document.getElementById('storage-banner');
    if (banner) {
      banner.hidden = false;
      banner.querySelector('p').textContent = event.detail.message;
      const exporter = banner.querySelector('[data-export-session]');
      if (exporter) exporter.hidden = !window.Progress;
    }
  });
  document.addEventListener('DOMContentLoaded', () => {
    document
      .querySelector('[data-reload-page]')
      ?.addEventListener('click', () => location.reload());
    document.querySelector('[data-export-session]')?.addEventListener('click', () => {
      try {
        downloadJson('tchatzsafe-progression-session.json', Progress.exportData());
      } catch (_) {
        Store.warn(
          'L’export n’a pas pu être préparé. Gardez cette page ouverte et réessayez après avoir rétabli le chargement des scripts.'
        );
      }
    });
    const themeButton = document.querySelector('[data-theme-toggle]');
    const updateThemeButton = () => {
      if (!themeButton) return;
      const dark = document.documentElement.getAttribute('data-theme') !== 'light';
      themeButton.innerHTML = icon(dark ? 'sun' : 'moon');
      themeButton.setAttribute(
        'aria-label',
        dark ? 'Activer le thème clair' : 'Activer le thème sombre'
      );
      themeButton.setAttribute('title', dark ? 'Thème clair' : 'Thème sombre');
    };
    updateThemeButton();
    if (themeButton)
      themeButton.addEventListener('click', () => {
        const theme =
          document.documentElement.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', theme);
        try {
          localStorage.setItem('tchatzsafe_theme', theme);
        } catch (_) {}
        updateThemeButton();
      });
    const toggle = document.querySelector('.menu-toggle');
    const menu = document.getElementById('mobile-menu');
    if (toggle && menu) {
      let previousOverflow = '';
      toggle.addEventListener('click', () => {
        previousOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        menu.showModal();
        toggle.setAttribute('aria-expanded', 'true');
        menu.querySelector('[data-close-menu]').focus();
      });
      menu.querySelector('[data-close-menu]').addEventListener('click', () => menu.close());
      menu.addEventListener('close', () => {
        document.body.style.overflow = previousOverflow;
        toggle.setAttribute('aria-expanded', 'false');
        toggle.focus();
      });
      menu.addEventListener('keydown', (event) => {
        if (event.key !== 'Tab') return;
        const focusable = [
          ...menu.querySelectorAll(
            'a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])'
          ),
        ].filter((el) => el.getClientRects().length);
        const first = focusable[0],
          last = focusable[focusable.length - 1];
        if (!first) return;
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      });
      menu.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => menu.close()));
      menu.addEventListener('click', (e) => {
        const r = menu.getBoundingClientRect();
        if (e.target === menu && (e.clientX < r.left || e.clientX > r.right)) menu.close();
      });
      matchMedia('(min-width:1001px)').addEventListener('change', (e) => {
        if (e.matches && menu.open) menu.close();
      });
    }
    document.querySelectorAll('[data-icon]').forEach((el) => {
      el.innerHTML = icon(el.dataset.icon);
    });
    if (window.Store && Store.warning) {
      const banner = document.getElementById('storage-banner');
      if (banner) {
        banner.hidden = false;
        banner.querySelector('p').textContent = Store.warning;
        const exporter = banner.querySelector('[data-export-session]');
        if (exporter) exporter.hidden = !window.Progress;
      }
    }
    document.querySelectorAll('[data-year]').forEach((el) => {
      el.textContent = new Date().getFullYear();
    });
  });
})();
