'use strict';
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.tip-category').forEach((category, index) => {
    const cards = [...category.querySelectorAll('.tip-card')],
      button = category.querySelector('.tip-more');
    const grid = category.querySelector('.category-lessons');
    grid.id = 'tip-group-' + index;
    if (!button || cards.length <= 1) return;
    button.hidden = false;
    button.setAttribute('aria-controls', grid.id);
    button.setAttribute('aria-expanded', 'false');
    function toggle(expanded) {
      cards.slice(1).forEach((card) => (card.hidden = !expanded));
      button.dataset.expanded = String(expanded);
      button.setAttribute('aria-expanded', String(expanded));
      button.textContent = expanded ? 'Réduire' : `Voir plus (${cards.length - 1})`;
    }
    toggle(false);
    button.addEventListener('click', () => toggle(button.dataset.expanded !== 'true'));
    category.toggleTips = toggle;
  });
  function openHash() {
    let id;
    try {
      id = decodeURIComponent(location.hash.slice(1));
    } catch (_) {
      return;
    }
    const target = document.getElementById(id);
    if (!target || !target.classList.contains('tip-card')) return;
    const category = target.closest('.tip-category');
    if (category.toggleTips) category.toggleTips(true);
    target.open = true;
    target.scrollIntoView({ block: 'start', behavior: 'instant' });
  }
  openHash();
  window.addEventListener('hashchange', openHash);
});
