'use strict';
document.addEventListener('DOMContentLoaded', () => {
  const e = App.escapeHtml,
    message = document.getElementById('progress-message');
  const say = (text, error = false) => {
    message.textContent = text;
    message.classList.toggle('text-error', error);
  };
  function render() {
    const p = Progress.get(),
      level = Progress.getLevelInfo(p.xp),
      overall = Progress.getOverallProgress(),
      next = Progress.getNextLesson(),
      scores = Object.values(p.bestScores);
    document.getElementById('dashboard').innerHTML =
      `<div class="dash-grid"><div class="card dash-level"><div class="dash-level-header"><div><p class="dash-level-kicker">NIVEAU PÉDAGOGIQUE ${level.level}</p><h2 class="dash-level-name">${e(level.name)}</h2></div><p class="dash-level-xp">${level.isMax ? `${level.xp} XP` : `${level.xp} / ${level.nextLevelXp} XP`}</p></div><div class="progress-bar" role="progressbar" aria-label="Progression vers le prochain niveau pédagogique" aria-valuenow="${level.percent}" aria-valuemin="0" aria-valuemax="100"><div class="progress-bar-fill" style="width:${level.percent}%"></div></div><p class="dash-level-pct">${level.isMax ? 'Dernier niveau pédagogique atteint.' : `${level.percent} % vers le niveau suivant.`} Les XP encouragent l’apprentissage uniquement.</p></div><div class="card dash-advice"><p class="dash-advice-label">VOTRE PROCHAINE ÉTAPE</p><p class="dash-advice-text">${e(Progress.getPersonalizedAdvice())}</p><a class="btn btn-primary btn-sm" href="${next ? 'apprendre.html?theme=' + e(next.id) : 'quiz.html'}">${next ? 'Continuer avec ' + e(next.title) : 'Rejouer un quiz'}${App.icon('arrow')}</a></div></div><div class="progress-stats"><div class="stat-card"><p class="stat-value">${overall} %</p><p class="stat-label">Parcours général</p><div class="progress-bar" role="progressbar" aria-label="Parcours général étudié" aria-valuenow="${overall}" aria-valuemin="0" aria-valuemax="100"><div class="progress-bar-fill" style="width:${overall}%"></div></div></div><div class="stat-card"><p class="stat-value">${p.lessonsCompleted.length}<span class="text-muted"> / ${LESSONS.length}</span></p><p class="stat-label">Leçons étudiées</p></div><div class="stat-card"><p class="stat-value">${Object.keys(p.quizzesCompleted).length}<span class="text-muted"> / ${Object.keys(QUIZZES).length}</span></p><p class="stat-label">Quiz terminés</p></div><div class="stat-card"><p class="stat-value">${scores.length ? Math.max(...scores) + ' %' : '—'}</p><p class="stat-label">Meilleur score pédagogique</p></div></div>`;
    document.getElementById('badges').innerHTML = Object.entries(Progress.BADGES_INFO)
      .map(([id, badge]) => {
        const earned = p.badges.includes(id);
        return `<article class="badge-item ${earned ? 'earned' : 'locked'}"><div class="badge-icon">${App.icon(earned ? 'badge' : 'lock')}</div><div class="badge-info"><h3>${e(badge.name)}</h3><p>${e(badge.description)}</p><span class="badge-state">${earned ? 'OBTENU SUR CET APPAREIL' : 'À DÉCOUVRIR'}</span></div></article>`;
      })
      .join('');
    const history = Object.entries(p.quizzesCompleted).sort(
      (a, b) => (Date.parse(b[1].completedAt) || 0) - (Date.parse(a[1].completedAt) || 0)
    );
    document.getElementById('quiz-history').innerHTML = history.length
      ? `<div class="history-list">${history.map(([id, q]) => `<a href="quiz.html?id=${e(id)}" class="history-item"><div><h3>${e(QUIZZES[id]?.title || id)}</h3><p>${q.completedAt ? e(new Date(q.completedAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })) : 'Date non disponible'} · ${q.score} / ${q.total} bonnes réponses</p></div><span>${q.percent} % ${App.icon('arrow')}</span></a>`).join('')}</div>`
      : `<div class="empty-state">${App.icon('help')}<h3>Votre premier quiz vous attend.</h3><p>Aucun quiz n’a encore été terminé sur cet appareil. Commencez avec cinq questions sur les bases.</p><a class="btn btn-secondary" href="quiz.html?id=debutant">Faire le quiz débutant ${App.icon('arrow')}</a></div>`;
  }
  render();
  document.getElementById('export-progress').addEventListener('click', () => {
    App.downloadJson(
      `tchatzsafe-progression-${new Date().toISOString().slice(0, 10)}.json`,
      Progress.exportData()
    );
    say(
      'Une copie de votre progression a été préparée pour le téléchargement. Elle ne contient pas vos brouillons de signalement.'
    );
  });
  const resetDialog = document.getElementById('reset-dialog');
  document
    .getElementById('reset-progress')
    .addEventListener('click', () => resetDialog.showModal());
  resetDialog
    .querySelector('[data-cancel-reset]')
    .addEventListener('click', () => resetDialog.close());
  document.getElementById('confirm-reset').addEventListener('click', () => {
    const persistent = Progress.reset();
    resetDialog.close();
    render();
    say(
      persistent
        ? 'Votre progression a été réinitialisée sur cet appareil. Les brouillons n’ont pas été modifiés.'
        : 'La session a été réinitialisée, mais la suppression dans le stockage du navigateur n’a pas pu être confirmée.',
      !persistent
    );
  });
  const fileInput = document.getElementById('import-progress'),
    importDialog = document.getElementById('import-dialog');
  let pending = null;
  document.getElementById('choose-import').addEventListener('click', () => fileInput.click());
  fileInput.addEventListener('change', async () => {
    const file = fileInput.files[0];
    if (!file) return;
    try {
      if (file.size > 250000) throw new Error('Le fichier est trop volumineux : 250 Ko maximum.');
      if (!file.name.toLowerCase().endsWith('.json'))
        throw new Error('Choisissez un export JSON de progression.');
      const data = JSON.parse(await file.text());
      if (data?.format && data.format !== 'tchatzsafe-progress')
        throw new Error('Ce fichier n’est pas un export TchatzSafe.');
      if (data?.format === 'tchatzsafe-progress' && data.version !== 2)
        throw new Error('La version de cet export n’est pas compatible.');
      const checked = Progress.normalize(
        data?.format === 'tchatzsafe-progress' ? data.progress : data,
        true
      );
      pending = data;
      document.getElementById('import-summary').textContent =
        `Le fichier contient ${checked.lessonsCompleted.length} leçon(s) étudiée(s) et ${Object.keys(checked.quizzesCompleted).length} quiz terminé(s). Il remplacera votre progression actuelle. Aucun contenu ne sera envoyé à un serveur.`;
      importDialog.showModal();
    } catch (error) {
      say(
        error instanceof SyntaxError
          ? 'Le fichier JSON est illisible. Votre progression n’a pas été modifiée.'
          : error.message,
        true
      );
      pending = null;
    } finally {
      fileInput.value = '';
    }
  });
  importDialog.querySelector('[data-cancel-import]').addEventListener('click', () => {
    pending = null;
    importDialog.close();
  });
  document.getElementById('confirm-import').addEventListener('click', () => {
    if (!pending) return;
    try {
      const persisted = Progress.importData(pending);
      render();
      say(
        persisted
          ? 'Progression importée sur cet appareil. Aucun envoi réseau.'
          : 'Progression importée pour cette session uniquement ; la sauvegarde persistante a échoué.',
        !persisted
      );
    } catch (error) {
      say(error.message, true);
    }
    pending = null;
    importDialog.close();
  });
  window.addEventListener('storage', (event) => {
    if (event.key === 'tchatzsafe_progress') render();
  });
});
