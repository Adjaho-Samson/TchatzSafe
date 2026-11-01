'use strict';
/** Progression V2, compatible avec la clé et les identifiants de la V1. Aucun compte / aucun envoi. */
(function (root) {
  const STORAGE_KEY = 'tchatzsafe_progress';
  const LEVELS = [
    { level: 1, name: 'Curieux', xp: 0 },
    { level: 2, name: 'Apprenti', xp: 30 },
    { level: 3, name: 'Explorateur numérique', xp: 80 },
    { level: 4, name: 'Vigilant', xp: 150 },
    { level: 5, name: 'Défenseur', xp: 250 },
    { level: 6, name: 'Expert du quotidien', xp: 400 },
  ];
  const BADGES_INFO = {
    'premiers-reflexes': {
      name: 'Premiers réflexes',
      description: 'Avoir étudié une leçon ou terminé un quiz.',
    },
    detective: { name: 'Détective', description: 'Terminer 5 quiz.' },
    'bon-reflexe': { name: 'Bon réflexe', description: 'Obtenir au moins 80 % à un quiz.' },
    curieux: { name: 'Curieux du numérique', description: 'Étudier 5 formations.' },
    assidu: { name: 'Assidu', description: 'Étudier 10 leçons.' },
    'expert-quiz': { name: 'Expert quiz', description: 'Terminer 8 quiz.' },
  };
  const CATEGORY_LABELS = {
    bases: 'Fondamentaux',
    comptes: 'Sécurité des comptes',
    messagerie: 'Messagerie',
    finance: 'Finance et Mobile Money',
    arnaques: 'Arnaques en ligne',
    appareils: 'Appareils',
    reseaux: 'Réseaux et Wi-Fi',
  };
  const fresh = () => ({
    version: 2,
    lessonsCompleted: [],
    lessonCompletionDates: {},
    lessonPositions: {},
    quizzesCompleted: {},
    quizHistory: [],
    bestScores: {},
    notionsLearned: [],
    badges: [],
    xp: 0,
    lastUpdated: null,
  });
  let repository = {
    load: () => root.Store.read(STORAGE_KEY, null),
    save: (value) => root.Store.write(STORAGE_KEY, value),
    remove: () => root.Store.remove(STORAGE_KEY),
  };
  const LESSON_SECTIONS = [
    'objectif',
    'exemple',
    'comprendre',
    'alertes',
    'pratiques',
    'resume',
    'validation',
    'sources',
  ];
  const safeId = (id) => typeof id === 'string' && /^[a-z0-9][a-z0-9-]{0,63}$/.test(id);
  const lessonExists = (id) =>
    safeId(id) && (!root.LESSONS || root.LESSONS.some((l) => l.id === id));
  const quizExists = (id) => safeId(id) && (!root.QUIZZES || Object.hasOwn(root.QUIZZES, id));
  const date = (value) =>
    typeof value === 'string' && Number.isFinite(Date.parse(value)) ? value : null;
  function compute(progress) {
    progress.xp =
      progress.lessonsCompleted.length * 10 +
      Object.keys(progress.quizzesCompleted).length * 15 +
      Object.values(progress.bestScores).filter((s) => s >= 80).length * 10;
    const badges = [];
    if (progress.lessonsCompleted.length || Object.keys(progress.quizzesCompleted).length)
      badges.push('premiers-reflexes');
    if (Object.keys(progress.quizzesCompleted).length >= 5) badges.push('detective');
    if (Object.values(progress.bestScores).some((s) => s >= 80)) badges.push('bon-reflexe');
    if (progress.lessonsCompleted.length >= 5) badges.push('curieux');
    if (progress.lessonsCompleted.length >= 10) badges.push('assidu');
    if (Object.keys(progress.quizzesCompleted).length >= 8) badges.push('expert-quiz');
    progress.badges = badges;
    return progress;
  }
  function normalize(raw, strict = false) {
    const p = fresh();
    if (raw === null || raw === undefined) {
      // En import strict, un fichier sans contenu de progression doit être refusé :
      // l’accepter remplacerait silencieusement les leçons et les scores de l’appareil.
      if (strict) throw new Error('Le fichier ne contient pas une progression valide.');
      return p;
    }
    if (typeof raw !== 'object' || Array.isArray(raw)) {
      if (strict) throw new Error('Le fichier ne contient pas une progression valide.');
      return p;
    }
    if (
      strict &&
      (!Array.isArray(raw.lessonsCompleted) ||
        !raw.quizzesCompleted ||
        typeof raw.quizzesCompleted !== 'object' ||
        Array.isArray(raw.quizzesCompleted))
    )
      throw new Error(
        'Le fichier doit contenir une liste de leçons et des résultats de quiz valides.'
      );
    if (Array.isArray(raw.lessonsCompleted))
      p.lessonsCompleted = [...new Set(raw.lessonsCompleted.filter(lessonExists))].slice(0, 200);
    // Champs facultatifs ajoutés sans changer la clé ni le format d’export historique.
    // Les dates inconnues des anciennes sauvegardes restent inconnues : on ne les invente pas.
    if (
      raw.lessonCompletionDates &&
      typeof raw.lessonCompletionDates === 'object' &&
      !Array.isArray(raw.lessonCompletionDates)
    ) {
      for (const [id, completedAt] of Object.entries(raw.lessonCompletionDates).slice(0, 200)) {
        if (p.lessonsCompleted.includes(id) && date(completedAt))
          p.lessonCompletionDates[id] = completedAt;
      }
    }
    if (
      raw.lessonPositions &&
      typeof raw.lessonPositions === 'object' &&
      !Array.isArray(raw.lessonPositions)
    ) {
      for (const [id, position] of Object.entries(raw.lessonPositions).slice(0, 200)) {
        if (
          lessonExists(id) &&
          position &&
          LESSON_SECTIONS.includes(position.section) &&
          date(position.updatedAt)
        ) {
          p.lessonPositions[id] = { section: position.section, updatedAt: position.updatedAt };
        }
      }
    }
    if (
      raw.quizzesCompleted &&
      typeof raw.quizzesCompleted === 'object' &&
      !Array.isArray(raw.quizzesCompleted)
    ) {
      for (const [id, q] of Object.entries(raw.quizzesCompleted).slice(0, 200)) {
        if (
          !quizExists(id) ||
          !q ||
          typeof q !== 'object' ||
          !Number.isInteger(q.score) ||
          !Number.isInteger(q.total) ||
          q.total < 1 ||
          q.total > 100 ||
          q.score < 0 ||
          q.score > q.total
        ) {
          if (strict) throw new Error('Un résultat de quiz ou son identifiant n’est pas valide.');
          continue;
        }
        const percent = Math.round((q.score / q.total) * 100);
        p.quizzesCompleted[id] = {
          score: q.score,
          total: q.total,
          percent,
          completedAt: date(q.completedAt),
        };
        const previous =
          raw.bestScores && Object.hasOwn(raw.bestScores, id) ? raw.bestScores[id] : null;
        p.bestScores[id] =
          typeof previous === 'number' &&
          Number.isFinite(previous) &&
          previous >= 0 &&
          previous <= 100
            ? Math.max(percent, Math.round(previous))
            : percent;
      }
    }
    // Les anciennes versions ne conservaient que le dernier résultat par quiz.
    const history = Array.isArray(raw.quizHistory)
      ? raw.quizHistory
      : Object.entries(p.quizzesCompleted).map(([id, result]) => ({ id, ...result }));
    for (const result of history) {
      if (
        !result ||
        !quizExists(result.id) ||
        !Number.isInteger(result.score) ||
        !Number.isInteger(result.total) ||
        result.total < 1 ||
        result.total > 100 ||
        result.score < 0 ||
        result.score > result.total ||
        (result.completedAt != null && !date(result.completedAt))
      ) {
        if (strict) throw new Error('Un élément de l’historique des quiz n’est pas valide.');
        continue;
      }
      p.quizHistory.push({
        id: result.id,
        score: result.score,
        total: result.total,
        percent: Math.round((result.score / result.total) * 100),
        completedAt: date(result.completedAt),
      });
    }
    if (strict && raw.lessonsCompleted.some((id) => !lessonExists(id)))
      throw new Error(
        'Le fichier contient une leçon inconnue. Import annulé pour protéger votre progression.'
      );
    if (Array.isArray(raw.notionsLearned))
      p.notionsLearned = [
        ...new Set(raw.notionsLearned.filter((s) => typeof s === 'string' && s.length <= 600)),
      ].slice(0, 200);
    p.lastUpdated = date(raw.lastUpdated);
    return compute(p);
  }
  function get() {
    return normalize(repository.load());
  }
  function save(value) {
    const p = normalize(value);
    p.lastUpdated = new Date().toISOString();
    return repository.save(p);
  }
  function markLessonCompleted(id) {
    if (!lessonExists(id)) throw new Error('Leçon inconnue.');
    const p = get();
    if (!p.lessonsCompleted.includes(id)) {
      p.lessonsCompleted.push(id);
      p.lessonCompletionDates[id] = new Date().toISOString();
      compute(p);
      save(p);
    }
    return get();
  }
  function saveLessonPosition(id, section) {
    if (!lessonExists(id) || !LESSON_SECTIONS.includes(section))
      throw new Error('Formation ou section inconnue.');
    const p = get();
    // Ne jamais écraser une sauvegarde illisible lors d’un simple défilement.
    if (root.Store.isCorrupt?.(STORAGE_KEY)) return false;
    p.lessonPositions[id] = { section, updatedAt: new Date().toISOString() };
    return save(p);
  }
  function getResumeLesson() {
    const p = get();
    const latest = Object.entries(p.lessonPositions)
      .filter(([id]) => !p.lessonsCompleted.includes(id))
      .sort((a, b) => Date.parse(b[1].updatedAt) - Date.parse(a[1].updatedAt))[0];
    if (!latest) return null;
    const lesson = (root.LESSONS || []).find((item) => item.id === latest[0]);
    return lesson ? { lesson, ...latest[1] } : null;
  }
  function saveQuizResult(id, score, total, notions = []) {
    if (
      !quizExists(id) ||
      !Number.isInteger(score) ||
      !Number.isInteger(total) ||
      total <= 0 ||
      total > 100 ||
      score < 0 ||
      score > total
    )
      throw new Error('Résultat de quiz invalide.');
    const p = get();
    const percent = Math.round((score / total) * 100);
    const completedAt = new Date().toISOString();
    p.quizzesCompleted[id] = { score, total, percent, completedAt };
    p.quizHistory.push({ id, score, total, percent, completedAt });
    p.bestScores[id] = Math.max(p.bestScores[id] ?? 0, percent);
    for (const notion of notions)
      if (typeof notion === 'string' && notion.length <= 600 && !p.notionsLearned.includes(notion))
        p.notionsLearned.push(notion);
    compute(p);
    save(p);
    return get();
  }
  function getLevelInfo(xp) {
    xp = Math.max(0, Number(xp) || 0);
    let i = 0;
    while (i < LEVELS.length - 1 && xp >= LEVELS[i + 1].xp) i++;
    const current = LEVELS[i],
      next = LEVELS[i + 1] || null;
    return {
      level: current.level,
      name: current.name,
      xp,
      xpInLevel: xp - current.xp,
      xpForNext: next ? next.xp - current.xp : 0,
      nextLevelXp: next ? next.xp : current.xp,
      percent: next
        ? Math.min(100, Math.round(((xp - current.xp) / (next.xp - current.xp)) * 100))
        : 100,
      isMax: !next,
    };
  }
  function getOverallProgress() {
    const p = get();
    const totalLessons = root.LESSONS?.length || 0,
      totalQuizzes = Object.keys(root.QUIZZES || {}).length;
    return Math.min(
      100,
      Math.round(
        (totalLessons ? (p.lessonsCompleted.length / totalLessons) * 50 : 0) +
          (totalQuizzes ? (Object.keys(p.quizzesCompleted).length / totalQuizzes) * 50 : 0)
      )
    );
  }
  function getNextLesson() {
    const p = get();
    return (
      getResumeLesson()?.lesson ||
      (root.LESSONS || []).find((l) => !p.lessonsCompleted.includes(l.id)) ||
      null
    );
  }
  function getPersonalizedAdvice() {
    const p = get();
    const resume = getResumeLesson();
    if (resume) return `Reprenez « ${resume.lesson.title} » au chapitre où vous vous êtes arrêté.`;
    if (!p.lessonsCompleted.length && !Object.keys(p.quizzesCompleted).length)
      return 'Commencez par le phishing : une courte leçon pour apprendre à vérifier un message avant de réagir.';
    if (p.lessonsCompleted.length && !Object.keys(p.quizzesCompleted).length)
      return 'Vous avez étudié des leçons. Un quiz vous aidera à transformer ces connaissances en bons réflexes.';
    const next = getNextLesson();
    return next
      ? `Prochaine étape : « ${next.title} ». Continuez à votre rythme et révisez les explications des quiz.`
      : 'Vous avez parcouru toutes les leçons. Rejouez les quiz pour entretenir vos réflexes : apprendre n’est pas une certification de sécurité.';
  }
  function exportData() {
    return {
      format: 'tchatzsafe-progress',
      version: 2,
      exportedAt: new Date().toISOString(),
      progress: get(),
    };
  }
  function importData(input) {
    if (input?.format === 'tchatzsafe-progress' && input.version !== 2)
      throw new Error('Version d’export incompatible.');
    if (input?.format && input.format !== 'tchatzsafe-progress')
      throw new Error('Ce fichier n’est pas un export TchatzSafe.');
    const raw = input?.format === 'tchatzsafe-progress' ? input.progress : input;
    const p = normalize(raw, true);
    return save(p);
  }
  function reset() {
    return repository.remove();
  }
  function setRepository(next) {
    if (!next || !['load', 'save', 'remove'].every((k) => typeof next[k] === 'function'))
      throw new Error('Adaptateur de progression invalide.');
    repository = next;
  }
  root.Progress = {
    get,
    save,
    markLessonCompleted,
    saveLessonPosition,
    getResumeLesson,
    LESSON_SECTIONS,
    saveQuizResult,
    getLevelInfo,
    getOverallProgress,
    getNextLesson,
    getPersonalizedAdvice,
    isLessonCompleted: (id) => get().lessonsCompleted.includes(id),
    getQuizBestScore: (id) => get().bestScores[id] ?? null,
    exportData,
    importData,
    reset,
    setRepository,
    normalize,
    BADGES_INFO,
    CATEGORY_LABELS,
    LEVELS,
    get isPersistent() {
      return root.Store.persistent;
    },
  };
  if (typeof module !== 'undefined' && module.exports) module.exports = root.Progress;
})(typeof window === 'undefined' ? globalThis : window);
