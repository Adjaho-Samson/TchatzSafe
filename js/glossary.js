'use strict';
/** Recherche et classement V1 conservés, avec accents normalisés et état vide accessible. */
(function () {
  function initGlossary() {
    const list = document.getElementById('glossary-list'),
      search = document.getElementById('glossary-search'),
      count = document.getElementById('glossary-count');
    if (!list || typeof GLOSSARY === 'undefined') return;
    const terms = [...GLOSSARY].sort((a, b) =>
      a.term.localeCompare(b.term, 'fr', { sensitivity: 'base' })
    );
    function render(query = '') {
      const q = App.normalize(query),
        filtered = terms.filter(
          (t) => !q || App.normalize(t.term + ' ' + t.definition).includes(q)
        );
      count.textContent = `${filtered.length} définition${filtered.length > 1 ? 's' : ''}`;
      if (!filtered.length) {
        list.innerHTML =
          '<div class="empty-state"><h2>Aucun mot trouvé</h2><p>Essayez un terme plus court ou recherchez dans la définition.</p></div>';
        return;
      }
      let letter = '';
      list.innerHTML = filtered
        .map((t) => {
          const current = t.term[0].toUpperCase(),
            heading =
              current !== letter
                ? `<h2 class="glossary-letter" id="letter-${App.escapeHtml(current)}">${App.escapeHtml(current)}</h2>`
                : '';
          letter = current;
          return `${heading}<article class="glossary-item"><h3 class="glossary-term">${App.escapeHtml(t.term)}</h3><p class="glossary-definition">${App.escapeHtml(t.definition)}</p></article>`;
        })
        .join('');
    }
    render();
    search.addEventListener('input', (event) => render(event.target.value.trim()));
  }
  window.initGlossary = initGlossary;
  document.addEventListener('DOMContentLoaded', initGlossary);
})();
