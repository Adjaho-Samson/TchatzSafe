'use strict';
document.addEventListener('DOMContentLoaded', () => {
  const e = App.escapeHtml,
    library = document.getElementById('library-view'),
    lessonView = document.getElementById('lesson-view'),
    grid = document.getElementById('lessons-grid'),
    state = { level: 'all', category: 'all', query: '' };
  const info = {
    débutant: {
      number: '01',
      title: 'Débutant',
      intro:
        'Les premiers réflexes : reconnaître les demandes suspectes et protéger les usages du quotidien.',
    },
    intermédiaire: {
      number: '02',
      title: 'Intermédiaire',
      intro: 'Allez plus loin pour protéger vos comptes, vos données et vos transactions.',
    },
    avancé: {
      number: '03',
      title: 'Avancé',
      intro:
        'Apprenez à vérifier les détails et à organiser une réponse après un incident. Toujours sans jargon inutile.',
    },
  };
  function render() {
    const query = App.normalize(state.query);
    const filtered = LESSONS.filter(
      (l) =>
        (state.level === 'all' || l.level === state.level) &&
        (state.category === 'all' || l.category === state.category) &&
        (!query || App.normalize(l.title + ' ' + l.description).includes(query))
    );
    document.getElementById('lesson-count').textContent =
      `${filtered.length} formation${filtered.length > 1 ? 's' : ''} disponible${filtered.length > 1 ? 's' : ''} · progression sur cet appareil`;
    if (!filtered.length) {
      grid.innerHTML =
        UI.empty('Aucune formation trouvée', 'Essayez un autre terme ou un niveau différent.') +
        '<div class="mt-4"><button class="btn btn-secondary" type="button" data-reset-filters>Réinitialiser les filtres</button></div>';
      grid.querySelector('[data-reset-filters]').addEventListener('click', () => {
        state.level = 'all';
        state.category = 'all';
        state.query = '';
        document.getElementById('lesson-search').value = '';
        update();
        render();
      });
      return;
    }
    grid.innerHTML = Object.entries(info)
      .map(([level, meta]) => {
        const list = filtered.filter((l) => l.level === level);
        return list.length
          ? `<section aria-labelledby="level-${meta.number}"><div class="level-heading"><h2 id="level-${meta.number}"><span class="tag tag-red">${meta.number}</span>${meta.title}</h2><p>${list.length} formation${list.length > 1 ? 's' : ''}</p></div><p class="level-intro">${meta.intro}</p><div class="cards-grid">${list.map((l) => UI.courseCard(l)).join('')}</div></section>`
          : '';
      })
      .join('');
  }
  function update() {
    document.querySelectorAll('[data-level]').forEach((b) => {
      const selected = b.dataset.level === state.level;
      b.setAttribute('aria-pressed', String(selected));
      b.classList.toggle('active', selected);
    });
    document.querySelectorAll('[data-category]').forEach((b) => {
      const selected = b.dataset.category === state.category;
      b.setAttribute('aria-pressed', String(selected));
      b.classList.toggle('active', selected);
    });
  }
  const id = new URLSearchParams(location.search).get('theme');
  if (!id) {
    document.querySelectorAll('[data-level]').forEach((b) =>
      b.addEventListener('click', () => {
        state.level = b.dataset.level;
        update();
        render();
      })
    );
    document.querySelectorAll('[data-category]').forEach((b) =>
      b.addEventListener('click', () => {
        state.category = b.dataset.category;
        update();
        render();
      })
    );
    document.getElementById('lesson-search').addEventListener('input', (event) => {
      state.query = event.target.value.trim();
      render();
    });
    render();
    return;
  }
  library.hidden = true;
  lessonView.hidden = false;
  const lesson = LESSONS.find((l) => l.id === id);
  if (!lesson) {
    App.setTitle('Formation introuvable');
    lessonView.innerHTML = `<div class="page-header"><div class="container"><p class="eyebrow">CENTRE D’APPRENTISSAGE</p><h1>Formation introuvable</h1><p>Cette adresse ne correspond pas à une formation disponible.</p></div></div><div class="page-content container">${UI.empty('Retrouvez votre parcours', 'Aucune progression n’a été modifiée.', 'apprendre.html', 'Voir les formations')}</div>`;
    return;
  }
  App.setTitle(lesson.title);
  const c = lesson.content,
    done = Progress.isLessonCompleted(id),
    best = Progress.getQuizBestScore(id),
    quiz = QUIZZES[id];
  lessonView.innerHTML = `<div class="page-header"><div class="container"><nav class="breadcrumb" aria-label="Fil d’Ariane"><a href="index.html">Accueil</a>${App.icon('chevron')}<a href="apprendre.html">Apprendre</a>${App.icon('chevron')}<span>${e(lesson.title)}</span></nav><p class="eyebrow">FORMATION / ${e(lesson.level)}</p><h1>${e(lesson.title)}</h1><p>${e(lesson.description)}</p><div class="pill-meta header-meta"><span>${App.icon('clock')}${e(lesson.duration)}</span><span>${App.icon('help')}${quiz.questions.length} questions de validation</span><span>${App.icon('lock')}Progression locale</span></div></div></div><div class="page-content container"><div class="lesson-layout"><article class="lesson-content"><section class="lesson-section" id="objectif"><h2>Votre objectif</h2><p>${e(lesson.objective)}</p></section><section class="lesson-section" id="exemple"><h2>Une situation du quotidien</h2><div class="example-message"><span class="tag tag-red">EXEMPLE FICTIF · À BUT PÉDAGOGIQUE</span><p>${e(c.situation)}</p></div><p class="mt-4"><strong>${e(c.question)}</strong></p></section><section class="lesson-section" id="comprendre"><h2>Comprendre, simplement</h2><p>${e(c.explanation)}</p></section><section class="lesson-section" id="alertes"><h2>Les signes d’alerte</h2><ul>${lesson.warningSigns.map((p) => `<li>${e(p)}</li>`).join('')}</ul><p class="mt-4">Un signe d’alerte appelle une vérification ; il ne prouve pas à lui seul une fraude.</p></section><section class="lesson-section" id="pratiques"><h2>Les bonnes pratiques</h2><ul>${c.points.map((p) => `<li>${e(p)}</li>`).join('')}</ul><div class="callout mt-4"><p class="callout-title">Le réflexe à adopter</p><p>${e(c.reflex)}</p></div></section><section class="lesson-section" id="resume"><h2>L’essentiel à retenir</h2><p>${e(lesson.summary)}</p></section><section class="lesson-section" id="validation"><h2>Transformez vos connaissances en réflexes</h2><p>Validez cette leçon avec ${quiz.questions.length} questions et des explications après chaque réponse. ${best !== null ? `Votre meilleur score local : ${best} %.` : 'Aucun quiz réalisé pour cette formation sur cet appareil.'}</p><div class="hero-actions"><a class="btn btn-primary" href="quiz.html?id=${e(id)}">Faire le quiz ${App.icon('arrow')}</a><button class="btn btn-secondary" type="button" id="complete-lesson" ${done ? 'disabled' : ''}>${App.icon(done ? 'check' : 'book')}${done ? 'Déjà étudié' : 'Marquer comme étudié'}</button></div><p id="lesson-saved" class="status-note mt-4" aria-live="polite">Une leçon étudiée n’est pas une certification de sécurité.</p></section><section class="lesson-section" id="sources"><h2>Sources de cette formation</h2><p>Les principes de prévention sont généraux. Les procédures et les recours dépendent du service et du pays.</p>${App.sourcesHtml(c.sources)}</section><a class="text-link" href="apprendre.html">${App.icon('arrow')} Retour aux formations</a></article><aside class="lesson-sidebar" aria-label="Sommaire de la formation"><h2>Dans cette formation</h2><nav><a href="#objectif">01 · Votre objectif</a><a href="#exemple">02 · L’exemple fictif</a><a href="#comprendre">03 · Comprendre</a><a href="#alertes">04 · Les signes d’alerte</a><a href="#pratiques">05 · Les bonnes pratiques</a><a href="#resume">06 · Le résumé</a><a href="#validation">07 · Le quiz de validation</a><a href="#sources">08 · Les sources</a></nav><a class="btn btn-primary btn-block" href="quiz.html?id=${e(id)}">Tester mes réflexes ${App.icon('arrow')}</a><p class="status-note">Sans compte. Sans synchronisation. Vos avancées restent sur cet appareil.</p></aside></div></div>`;
  const complete = document.getElementById('complete-lesson');
  if (!done)
    complete.addEventListener('click', () => {
      try {
        Progress.markLessonCompleted(id);
        complete.disabled = true;
        complete.innerHTML = App.icon('check') + ' Leçon étudiée';
        document.getElementById('lesson-saved').textContent = Progress.isPersistent
          ? 'Leçon enregistrée sur cet appareil. +10 XP pédagogiques.'
          : 'Leçon étudiée dans cette session uniquement. La sauvegarde persistante est indisponible.';
      } catch (_) {
        document.getElementById('lesson-saved').textContent =
          'La progression n’a pas pu être mise à jour. Vous pouvez continuer à apprendre.';
      }
    });
});
