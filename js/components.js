'use strict';
(function () {
  const e = (value) => App.escapeHtml(value);
  function courseArt(id) {
    const common =
      '<g stroke="#4b4b54" stroke-width=".8"><path d="m10 106 69-40 73 40-73 39-69-39Z"/><path d="m31 118 69-39m-46 52 69-40M53 81l70 40m-94-26 70 40"/></g>';
    let drawing;
    if (['mobile-money', 'telephone-applications', 'whatsapp'].includes(id))
      drawing =
        '<g transform="rotate(-12 80 65)"><rect x="53" y="13" width="56" height="103" rx="9" fill="#27252b" stroke="#c5525c" stroke-width="1.5"/><rect x="58" y="22" width="46" height="81" rx="3" fill="#18191d" stroke="#55505a"/><path d="M72 18h17M77 109h8" stroke="#d85b63" stroke-width="2" stroke-linecap="round"/><rect x="65" y="39" width="32" height="26" rx="5" fill="#3d232c" stroke="#a74853"/><path d="m73 51 5 5 10-11" stroke="#f37b81" stroke-width="2"/><path d="M66 77h29m-29 7h20m-20 7h25" stroke="#68616c" stroke-width="2" stroke-linecap="round"/></g>';
    else if (['mots-de-passe', 'vol-de-compte', 'reagir-incident'].includes(id))
      drawing =
        '<path d="M62 57V40a20 20 0 0 1 40 0v17" stroke="#ce5b64" stroke-width="8"/><path d="M61 57V40a21 21 0 0 1 42 0" stroke="#fd9499" stroke-width="1"/><path d="m48 57 57-5 9 60-58 5-8-60Z" fill="#242329" stroke="#b5525e" stroke-width="1.5"/><path d="m105 52 9 5 9 59-9-4-9-60Z" fill="#3b2730"/><circle cx="82" cy="77" r="7" fill="#e27680"/><path d="M82 83v12" stroke="#e27680" stroke-width="5" stroke-linecap="round"/>';
    else if (['liens-suspects', 'verification-domaines'].includes(id))
      drawing =
        '<g stroke="#df6871" stroke-width="7" stroke-linecap="round"><path d="m72 48 10-10a19 19 0 0 1 27 27L97 77m-9 15L76 104a19 19 0 0 1-27-27l11-11M66 87l29-32"/></g><path d="m117 18 5 10m16 21-10-1M33 97l-9 4m43 23-3 10" stroke="#6a4a55" stroke-width="1.2"/>';
    else
      drawing =
        '<path d="M25 26h82a7 7 0 0 1 7 7v52H58L43 98V85H25V26Z" fill="#26242b" stroke="#75404a" stroke-width="1.3"/><path d="M50 51h82a7 7 0 0 1 7 7v53h-16l-16 14v-14H50V51Z" fill="#1c1c22" stroke="#c35a65" stroke-width="1.5"/><path d="M64 69h59m-59 12h42m-42 12h51" stroke="#70636f" stroke-width="2.5" stroke-linecap="round"/><circle cx="119" cy="39" r="12" fill="#3e252e" stroke="#ce626c"/><path d="M119 33v7m0 4h.01" stroke="#fd9ba0" stroke-width="2"/>';
    return `<svg viewBox="0 0 160 150" fill="none" aria-hidden="true">${common}${drawing}</svg>`;
  }
  function courseCard(lesson, options = {}) {
    const done = Progress.isLessonCompleted(lesson.id),
      count = QUIZZES[lesson.id]?.questions.length || 0;
    return `<a class="card card-link course-card" href="apprendre.html?theme=${e(lesson.id)}"><div class="course-art"><span class="tag">${e(lesson.level[0].toUpperCase() + lesson.level.slice(1))}</span>${courseArt(lesson.id)}<span class="course-art-number" aria-hidden="true">${done ? 'OK' : '+'}</span></div><div class="course-body"><h3>${e(options.displayTitle || lesson.title)}</h3><p>${e(lesson.description)}</p><div class="course-footer"><div class="pill-meta"><span>${App.icon('clock')}${e(lesson.duration)}</span><span>${App.icon(done ? 'check' : 'help')}${done ? 'Étudié' : `${count} questions`}</span></div>${App.icon('arrow')}</div></div></a>`;
  }
  function threatCard(threat) {
    return `<a class="card card-link threat-card" href="menaces.html?categorie=${e(threat.id)}"><div class="threat-card-top"><span class="icon-box">${App.icon(threat.icon)}</span>${App.icon('arrow')}</div><h3>${e(threat.shortTitle)}</h3><p>${e(threat.description)}</p></a>`;
  }
  function empty(title, message, href, label) {
    return `<div class="empty-state">${App.icon('search')}<h2>${e(title)}</h2><p>${e(message)}</p>${href ? `<a class="btn btn-secondary" href="${e(href)}">${e(label)}</a>` : ''}</div>`;
  }
  window.UI = { courseArt, courseCard, threatCard, empty };
})();
