'use strict';
document.addEventListener('DOMContentLoaded', () => {
  const threats = document.getElementById('home-threats');
  if (threats) threats.innerHTML = THREATS.map(UI.threatCard).join('');
  const ids = [
    ['phishing', 'Déjouer le phishing'],
    ['mobile-money', 'Protéger son Mobile Money'],
    ['mots-de-passe', 'Des comptes mieux protégés'],
  ];
  const courses = document.getElementById('home-courses');
  if (courses)
    courses.innerHTML = ids
      .map(([id, title]) =>
        UI.courseCard(
          LESSONS.find((l) => l.id === id),
          { displayTitle: title }
        )
      )
      .join('');
  document
    .querySelectorAll('[data-course-count]')
    .forEach((el) => (el.textContent = LESSONS.length));
  QuizEngine.init('demo', 'home-quiz-root', true);
});
