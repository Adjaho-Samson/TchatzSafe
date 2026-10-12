'use strict';
document.addEventListener('DOMContentLoaded', () => {
  const button = document.getElementById('clear-private-drafts'),
    dialog = document.getElementById('privacy-clear-dialog'),
    message = document.getElementById('privacy-message');
  button.addEventListener('click', () => dialog.showModal());
  dialog
    .querySelector('[data-cancel-private-clear]')
    .addEventListener('click', () => dialog.close());
  document.getElementById('confirm-private-clear').addEventListener('click', () => {
    const ok = ReportRepository.clear();
    dialog.close();
    message.textContent = ok
      ? 'Tous les brouillons ont été supprimés de ce navigateur. Votre progression n’a pas été modifiée.'
      : 'Les brouillons ont été retirés de cette session, mais la suppression persistante n’a pas pu être confirmée. Effacez les données du site dans les paramètres du navigateur.';
    message.classList.toggle('text-error', !ok);
  });
});
