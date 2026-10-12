'use strict';
document.addEventListener('DOMContentLoaded', () => {
  const id = new URLSearchParams(location.search).get('id'),
    e = App.escapeHtml;
  if (id) {
    document.getElementById('quiz-catalog').hidden = true;
    document.getElementById('quiz-player').hidden = false;
    const q = QUIZZES[id];
    App.setTitle(q ? q.title : 'Quiz introuvable');
    document.getElementById('quiz-heading').textContent = q ? q.title : 'Quiz introuvable';
    document.getElementById('quiz-description').textContent = q
      ? `${q.questions.length} questions · ${q.level} · exemples fictifs. Une explication vous accompagne après chaque réponse.`
      : 'Ce quiz n’existe pas. Retrouvez les exercices disponibles dans le catalogue.';
    QuizEngine.init(id);
    return;
  }
  let level = 'all',
    query = '';
  function render() {
    const list = QuizEngine.getList().filter(
      (q) =>
        (level === 'all' || q.level === level) &&
        (!query || App.normalize(q.title + ' ' + q.description).includes(App.normalize(query)))
    );
    document.getElementById('quiz-count').textContent =
      `${list.length} quiz disponible${list.length > 1 ? 's' : ''} · explications incluses`;
    document.getElementById('quiz-grid').innerHTML = list.length
      ? list
          .map((q) => {
            const best = Progress.getQuizBestScore(q.id);
            return `<a class="card card-link" href="quiz.html?id=${e(q.id)}"><span class="tag ${best !== null ? 'tag-red' : ''}">${best !== null ? `Meilleur score : ${best} %` : e(q.level)}</span><h3 class="mt-4">${e(q.title)}</h3><p>${e(q.description)}</p><div class="card-meta"><span>${q.questionCount} questions</span><span>${best !== null ? 'Rejouer' : 'Commencer'} ${App.icon('arrow')}</span></div></a>`;
          })
          .join('')
      : UI.empty('Aucun quiz trouvé', 'Essayez un autre terme ou un autre niveau.');
  }
  document.querySelectorAll('[data-quiz-level]').forEach((button) =>
    button.addEventListener('click', () => {
      level = button.dataset.quizLevel;
      document
        .querySelectorAll('[data-quiz-level]')
        .forEach((b) => b.setAttribute('aria-pressed', String(b === button)));
      render();
    })
  );
  document.getElementById('quiz-search').addEventListener('input', (event) => {
    query = event.target.value.trim();
    render();
  });
  render();
});
