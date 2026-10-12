/* Le thème sombre est le défaut de la refonte. La préférence historique est conservée. */
(function () {
  var theme = 'dark';
  try {
    var stored = localStorage.getItem('tchatzsafe_theme');
    if (stored === 'light' || stored === 'dark') theme = stored;
  } catch (_) {}
  document.documentElement.setAttribute('data-theme', theme);
})();
