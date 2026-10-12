'use strict';
document.addEventListener('DOMContentLoaded', () => {
  const e = App.escapeHtml,
    id = new URLSearchParams(location.search).get('categorie'),
    catalog = document.getElementById('threat-catalog'),
    detail = document.getElementById('threat-detail');
  if (id) {
    catalog.hidden = true;
    detail.hidden = false;
    const t = THREATS.find((t) => t.id === id);
    if (!t) {
      App.setTitle('Fiche introuvable');
      detail.innerHTML = `<div class="page-header"><div class="container"><h1>Fiche introuvable</h1><p>Cette catégorie n’existe pas dans la bibliothèque.</p></div></div><div class="page-content container">${UI.empty('Explorez les catégories', 'Aucune accusation ni fiche de réputation n’est publiée ici.', 'menaces.html', 'Voir les menaces')}</div>`;
      return;
    }
    App.setTitle(t.title);
    const list = (items) => '<ul>' + items.map((p) => '<li>' + e(p) + '</li>').join('') + '</ul>';
    detail.innerHTML = `<div class="page-header"><div class="container"><nav class="breadcrumb" aria-label="Fil d’Ariane"><a href="index.html">Accueil</a>${App.icon('chevron')}<a href="menaces.html">Menaces</a>${App.icon('chevron')}<span>${e(t.shortTitle)}</span></nav><p class="eyebrow">BIBLIOTHÈQUE / ${e(t.category)}</p><h1>${e(t.title)}</h1><p>${e(t.description)}</p></div></div><div class="page-content container"><div class="lesson-layout"><article class="lesson-content"><section class="lesson-section" id="mecanisme"><h2>Comment fonctionne la fraude ?</h2><p>${e(t.mechanism)}</p></section><section class="lesson-section" id="exemple"><h2>Un exemple pour comprendre</h2><div class="example-message"><span class="tag tag-red">EXEMPLE FICTIF · AUCUN CAS SIGNALÉ</span><p>${e(t.example)}</p></div></section><section class="lesson-section" id="alertes"><h2>Ce qui doit vous alerter</h2>${list(t.warnings)}<p class="mt-4">Ces indices appellent une vérification. Ils ne constituent pas une accusation contre une personne ou un service précis.</p></section><section class="lesson-section" id="precautions"><h2>Comment vous protéger</h2>${list(t.precautions)}</section><section class="lesson-section" id="reagir"><h2>Si vous êtes concerné</h2>${list(t.response)}<div class="notice neutral mt-4">${App.icon('info')}<div><strong>Vous n’êtes pas seul.</strong>Demandez de l’aide au service concerné et à l’autorité compétente de votre pays. Au Bénin, consultez le <a href="https://www.cnin.bj/" target="_blank" rel="noopener noreferrer">site officiel du CNIN<span class="sr-only"> (nouvel onglet)</span></a>. TchatzSafe n’est pas un service d’urgence.</div></div></section><section class="lesson-section" id="sources"><h2>Sources et limites</h2><p>Ces ressources décrivent des mécanismes généraux. Les services de plainte, numéros et procédures cités par une source étrangère ne s’appliquent pas automatiquement à votre pays.</p>${App.sourcesHtml(t.sources)}</section><div class="hero-actions"><a class="btn btn-primary" href="apprendre.html?theme=${e(t.lesson)}">Approfondir avec la formation ${App.icon('arrow')}</a><a class="btn btn-secondary" href="menaces.html">Toutes les fiches</a></div></article><aside class="lesson-sidebar"><h2>Les bons repères</h2><nav aria-label="Sommaire de la fiche"><a href="#mecanisme">01 · Le mécanisme</a><a href="#exemple">02 · L’exemple fictif</a><a href="#alertes">03 · Les signes d’alerte</a><a href="#precautions">04 · Les précautions</a><a href="#reagir">05 · Comment réagir</a><a href="#sources">06 · Les sources</a></nav><a class="btn btn-primary btn-block" href="analyser.html">Examiner des indices ${App.icon('scan')}</a><p class="status-note">L’analyseur est une démonstration locale. Il ne vérifie pas la réputation d’un lien ou d’un numéro.</p></aside></div></div>`;
    return;
  }
  let category = 'all',
    query = '';
  const grid = document.getElementById('threats-grid');
  function render() {
    const filtered = THREATS.filter(
      (t) =>
        (category === 'all' || t.id === category) &&
        (!query ||
          App.normalize(t.title + ' ' + t.description + ' ' + t.category).includes(
            App.normalize(query)
          ))
    );
    grid.innerHTML = filtered.length
      ? filtered.map(UI.threatCard).join('')
      : UI.empty(
          'Aucune fiche trouvée',
          'Essayez un autre terme ou sélectionnez toutes les catégories.'
        );
    document.getElementById('threat-count').textContent =
      `${filtered.length} fiche${filtered.length > 1 ? 's' : ''} pédagogique${filtered.length > 1 ? 's' : ''} · exemples fictifs, sources publiques`;
  }
  document.getElementById('threat-search').addEventListener('input', (event) => {
    query = event.target.value.trim();
    render();
  });
  document.querySelectorAll('[data-threat-filter]').forEach((button) =>
    button.addEventListener('click', () => {
      category = button.dataset.threatFilter;
      document
        .querySelectorAll('[data-threat-filter]')
        .forEach((b) => b.setAttribute('aria-pressed', String(b === button)));
      render();
    })
  );
  render();
});
