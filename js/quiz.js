'use strict';
/** Le moteur V1 est conservé dans son principe : options mélangées, corrections et suivi local. */
(function () {
  function shuffleIndices(length) {
    const indices = Array.from({ length }, (_, i) => i);
    for (let i = length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [indices[i], indices[j]] = [indices[j], indices[i]];
    }
    return indices;
  }
  function prepareQuestion(q) {
    const order = shuffleIndices(q.options.length);
    return {
      ...q,
      options: order.map((i) => q.options[i]),
      correct: order.indexOf(q.correct),
      order,
    };
  }
  function init(id, containerId = 'quiz-root', compact = false) {
    const container = document.getElementById(containerId);
    if (!container) return;
    const quiz = QUIZZES[id];
    if (!quiz) {
      container.innerHTML =
        '<div class="empty-state"><h2>Quiz introuvable</h2><p>Ce quiz n’existe pas. Aucun résultat n’a été enregistré.</p><a class="btn btn-primary" href="quiz.html">Voir les quiz</a></div>';
      return;
    }
    const state = {
      quiz: { ...quiz, questions: quiz.questions.map(prepareQuestion) },
      currentIndex: 0,
      answers: [],
      score: 0,
      notions: [],
      answered: false,
      compact,
    };
    render(state, container, false);
  }
  function render(state, container, focus = true) {
    const e = App.escapeHtml,
      q = state.quiz.questions[state.currentIndex],
      total = state.quiz.questions.length;
    const pct = Math.round((state.currentIndex / total) * 100);
    container.innerHTML = `<div class="quiz-progress"><div class="progress-bar" role="progressbar" aria-label="Questions du quiz parcourues" aria-valuenow="${pct}" aria-valuemin="0" aria-valuemax="100"><div class="progress-bar-fill" style="width:${pct}%"></div></div><p class="quiz-progress-text">QUESTION ${String(state.currentIndex + 1).padStart(2, '0')} / ${String(total).padStart(2, '0')}</p></div><div class="quiz-question"><h2 tabindex="-1">${e(q.question)}</h2><div class="quiz-options" role="group" aria-label="Choisissez une réponse">${q.options.map((option, index) => `<button class="quiz-option" type="button" data-index="${index}"><span class="option-marker" aria-hidden="true">${String.fromCharCode(65 + index)}</span><span>${e(option)}</span></button>`).join('')}</div><div class="quiz-feedback" aria-live="polite" aria-atomic="true"></div><div class="quiz-actions"><button type="button" class="btn btn-primary" data-next disabled>${state.currentIndex === total - 1 ? 'Voir mon résultat' : 'Question suivante'} ${App.icon('arrow')}</button></div></div>`;
    if (focus) container.querySelector('h2').focus({ preventScroll: true });
    const buttons = container.querySelectorAll('.quiz-option'),
      feedback = container.querySelector('.quiz-feedback'),
      next = container.querySelector('[data-next]');
    buttons.forEach((button) =>
      button.addEventListener('click', () => {
        if (state.answered) return;
        state.answered = true;
        const selected = Number(button.dataset.index);
        state.answers.push(selected);
        const correct = selected === q.correct;
        if (correct) state.score++;
        if (q.notion) state.notions.push(q.notion);
        buttons.forEach((item, index) => {
          item.disabled = true;
          if (index === q.correct) item.classList.add('correct');
          else if (index === selected) item.classList.add('incorrect');
        });
        feedback.classList.add('is-visible', correct ? 'correct' : 'incorrect');
        feedback.innerHTML = `<p class="feedback-title">${correct ? 'Le bon réflexe.' : 'Un réflexe à améliorer.'}</p><div class="feedback-body"><p>${e(q.explanation)}</p>${q.notion && !state.compact ? `<p><strong>À retenir :</strong> ${e(q.notion)}</p>` : ''}</div>`;
        next.disabled = false;
        next.focus({ preventScroll: true });
      })
    );
    next.addEventListener('click', () => {
      if (!state.answered) return;
      state.currentIndex++;
      state.answered = false;
      if (state.currentIndex >= total) results(state, container);
      else render(state, container);
    });
  }
  function results(state, container) {
    const total = state.quiz.questions.length,
      percent = Math.round((state.score / total) * 100),
      e = App.escapeHtml;
    let persisted = true;
    try {
      Progress.saveQuizResult(state.quiz.id, state.score, total, state.notions);
      persisted = Progress.isPersistent;
    } catch (_) {
      persisted = false;
    }
    const message =
      percent >= 80
        ? 'Très bons réflexes. Continuez à vérifier les situations réelles : ce résultat n’est pas une certification de sécurité.'
        : percent >= 50
          ? 'Vous progressez. Les explications vous aideront à renforcer vos réflexes.'
          : 'L’important est d’apprendre. Relisez les explications et essayez à nouveau, à votre rythme.';
    container.innerHTML = `<div class="quiz-results"><p class="eyebrow">QUIZ TERMINÉ</p><h2 class="results-score" tabindex="-1">${percent} %</h2><p class="results-label">${state.score} bonne${state.score > 1 ? 's' : ''} réponse${state.score > 1 ? 's' : ''} sur ${total}</p><p class="results-message">${e(message)}</p><p class="status-note">${persisted ? 'Résultat enregistré uniquement sur cet appareil.' : 'Résultat conservé dans cette session uniquement : le stockage persistant est indisponible.'}</p><div class="results-details"><h3>Revoir les explications</h3><ol>${state.quiz.questions
      .map((q, i) => {
        const ok = state.answers[i] === q.correct;
        return `<li><p>${e(q.question)}</p><span class="${ok ? 'text-success' : 'text-error'}">${ok ? 'Bonne réponse' : 'Réponse à revoir'} · ${e(q.options[q.correct])}</span><p>${e(q.explanation)}</p></li>`;
      })
      .join(
        ''
      )}</ol></div><div class="hero-actions"><button type="button" class="btn btn-secondary" data-retry>${App.icon('refresh')} Réessayer</button><a class="btn btn-primary" href="${state.quiz.themeId ? 'apprendre.html?theme=' + e(state.quiz.themeId) : 'apprendre.html'}">${state.quiz.themeId ? 'Revoir la leçon' : 'Continuer à apprendre'} ${App.icon('arrow')}</a></div></div>`;
    container.querySelector('h2').focus({ preventScroll: true });
    container
      .querySelector('[data-retry]')
      .addEventListener('click', () => init(state.quiz.id, container.id, state.compact));
  }
  function getList() {
    return Object.values(QUIZZES).map((q) => ({
      id: q.id,
      title: q.title,
      description: q.description,
      level: q.level,
      questionCount: q.questions.length,
      themeId: q.themeId,
    }));
  }
  window.QuizEngine = { init, getList, shuffleIndices, prepareQuestion };
})();
