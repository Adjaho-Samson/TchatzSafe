'use strict';
(function () {
  const e = (value) => App.escapeHtml(value);
  function courseArt(id) {
    let name = 'message';
    if (['mobile-money', 'telephone-applications', 'whatsapp'].includes(id)) name = 'phone';
    else if (['mots-de-passe', 'vol-de-compte', 'reagir-incident'].includes(id)) name = 'lock';
    else if (['liens-suspects', 'verification-domaines'].includes(id)) name = 'link';
    else if (['wifi-public', 'reseaux-sociaux'].includes(id)) name = 'globe';
    return `<span class="course-art-icon">${App.icon(name)}</span>`;
  }
  function courseCard(lesson, options = {}) {
    const done = Progress.isLessonCompleted(lesson.id),
      count = QUIZZES[lesson.id]?.questions.length || 0;
    return `<a class="card card-link course-card" href="apprendre.html?theme=${e(lesson.id)}"><div class="course-art"><span class="tag">${e(lesson.level[0].toUpperCase() + lesson.level.slice(1))}</span>${courseArt(lesson.id)}${done ? `<span class="course-art-state">${App.icon('circlecheck')} Étudié</span>` : ''}</div><div class="course-body"><h3>${e(options.displayTitle || lesson.title)}</h3><p>${e(lesson.description)}</p><div class="course-footer"><div class="pill-meta"><span>${App.icon('clock')}${e(lesson.duration)}</span><span>${App.icon(done ? 'check' : 'help')}${done ? 'Étudié' : `${count} questions`}</span></div>${App.icon('arrow')}</div></div></a>`;
  }
  function threatCard(threat) {
    return `<a class="card card-link threat-card" href="menaces.html?categorie=${e(threat.id)}"><div class="threat-card-top"><span class="icon-box">${App.icon(threat.icon)}</span>${App.icon('arrow')}</div><h3>${e(threat.shortTitle)}</h3><p>${e(threat.description)}</p></a>`;
  }
  function empty(title, message, href, label) {
    return `<div class="empty-state">${App.icon('search')}<h2>${e(title)}</h2><p>${e(message)}</p>${href ? `<a class="btn btn-secondary" href="${e(href)}">${e(label)}</a>` : ''}</div>`;
  }
  window.UI = { courseArt, courseCard, threatCard, empty };
})();
