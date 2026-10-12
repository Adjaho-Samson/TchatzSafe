'use strict';
document.addEventListener('DOMContentLoaded', () => {
  const e = App.escapeHtml,
    moderation = Boolean(document.getElementById('moderation-count')),
    draftList = document.getElementById('local-drafts'),
    feedback = document.getElementById('report-feedback'),
    kinds = { link: 'Lien suspect', message: 'Message suspect', phone: 'Numéro suspect' };
  const say = (text, error = false) => {
    feedback.textContent = text;
    feedback.classList.toggle('text-error', error);
  };
  let deleteTarget = null;
  const deleteDialog = document.getElementById('delete-draft-dialog');
  deleteDialog
    .querySelector('[data-cancel-delete]')
    .addEventListener('click', () => deleteDialog.close());
  document.getElementById('confirm-delete-draft').addEventListener('click', async () => {
    if (!deleteTarget) return;
    const id = deleteTarget;
    deleteTarget = null;
    try {
      const persisted = await ReportRepository.remove(id);
      say(
        persisted
          ? 'Brouillon supprimé de cet appareil. Aucun contenu n’avait été transmis.'
          : 'Brouillon retiré de la session ; la suppression persistante n’a pas pu être confirmée.',
        !persisted
      );
      await render();
    } catch (_) {
      say(
        'La suppression locale a échoué. Réessayez ou effacez les données du site dans le navigateur.',
        true
      );
    } finally {
      deleteDialog.close();
    }
  });
  async function render() {
    try {
      const items = (await ReportRepository.list()).slice().reverse();
      if (moderation)
        document.getElementById('moderation-count').textContent =
          `${items.length} brouillon${items.length > 1 ? 's' : ''} de ce navigateur · aucun signalement reçu par un serveur`;
      if (!items.length) {
        draftList.innerHTML = `<div class="empty-state">${App.icon('file')}<h3>${moderation ? 'Aucun brouillon à examiner.' : 'Aucun brouillon enregistré.'}</h3><p>${moderation ? 'Cet atelier ne contient pas de faux signalements préchargés. Préparez votre propre brouillon pour tester le parcours local.' : 'Aucun signalement n’a été envoyé. Les brouillons que vous choisissez d’enregistrer apparaîtront uniquement sur cet appareil.'}</p>${moderation ? '<a href="signaler.html" class="btn btn-secondary">Préparer un brouillon</a>' : ''}</div>`;
        return;
      }
      draftList.innerHTML = items
        .map(
          (record) =>
            `<article class="draft-card"><div class="draft-card-header"><h3>${kinds[record.kind]}</h3><span class="tag tag-red">${e(ReportRepository.statuses[record.status])}</span></div><div class="draft-value">${e(record.value)}</div>${record.description ? `<p>${e(record.description)}</p>` : ''}<p>Créé le ${e(new Date(record.createdAt).toLocaleDateString('fr-FR'))}. Expiration au plus tard après 30 jours. ${record.proof ? 'Preuve sélectionnée : seuls le type et la taille sont mémorisés, le fichier n’est pas conservé.' : 'Aucun fichier de preuve conservé.'}</p><p>Déclaration non vérifiée. Aucun verdict sur une personne, un lien ou un numéro.</p>${moderation ? `<div class="input-group mt-4"><label for="note-${e(record.id)}">Note de revue simulée · facultative</label><textarea id="note-${e(record.id)}" rows="2" maxlength="500" placeholder="Une note privée, sans accusation établie.">${e(typeof record.note === 'string' ? record.note : '')}</textarea></div>` : record.note ? `<p>Note locale : ${e(record.note)}</p>` : ''}<div class="draft-actions">${
              moderation
                ? `<div><label for="status-${e(record.id)}">Statut de simulation locale</label><select id="status-${e(record.id)}">${Object.entries(
                    ReportRepository.statuses
                  )
                    .map(
                      ([key, label]) =>
                        `<option value="${key}" ${key === record.status ? 'selected' : ''}>${e(label)}</option>`
                    )
                    .join(
                      ''
                    )}</select></div><button class="btn btn-secondary btn-sm" type="button" data-save-status="${e(record.id)}">Enregistrer la simulation</button>`
                : '<span class="status-note">Privé · non transmis · non publié</span>'
            }<button class="btn btn-secondary btn-sm" type="button" data-delete-draft="${e(record.id)}">${App.icon('trash')}Supprimer<span class="sr-only"> le brouillon ${e(kinds[record.kind])}</span></button></div></article>`
        )
        .join('');
      draftList.querySelectorAll('[data-delete-draft]').forEach((button) =>
        button.addEventListener('click', () => {
          deleteTarget = button.dataset.deleteDraft;
          deleteDialog.showModal();
        })
      );
      draftList.querySelectorAll('[data-save-status]').forEach((button) =>
        button.addEventListener('click', async () => {
          const id = button.dataset.saveStatus,
            status = document.getElementById('status-' + id).value,
            note = document.getElementById('note-' + id).value;
          button.disabled = true;
          try {
            const persisted = await ReportRepository.setStatus(id, status, note);
            say(
              persisted
                ? 'Simulation enregistrée localement. Aucun fait vérifié, aucune publication et aucun envoi réel.'
                : 'Simulation conservée dans cette session uniquement.',
              !persisted
            );
            await render();
          } catch (error) {
            say(error.message, true);
            button.disabled = false;
          }
        })
      );
    } catch (_) {
      draftList.innerHTML =
        '<div class="empty-state"><h3>Brouillons indisponibles</h3><p>Les brouillons locaux n’ont pas pu être lus. Aucun résultat ni signalement serveur n’est présenté.</p></div>';
    }
  }
  render();
  const form = document.getElementById('report-form');
  if (!form) return;
  const kindSelect = document.getElementById('report-kind'),
    value = document.getElementById('report-value'),
    error = document.getElementById('report-error'),
    save = document.getElementById('save-report'),
    proofInput = document.getElementById('report-proof'),
    proofPreview = document.getElementById('proof-preview'),
    proofError = document.getElementById('proof-error');
  let proofValid = false,
    proofPending = false,
    proofUrl = null,
    proofVersion = 0;
  function resetProof() {
    proofVersion++;
    if (proofUrl) URL.revokeObjectURL(proofUrl);
    proofUrl = null;
    proofValid = false;
    proofPending = false;
    proofPreview.hidden = true;
    proofPreview.removeAttribute('src');
    proofError.textContent = '';
    proofInput.value = '';
    document.getElementById('remove-proof').hidden = true;
    save.disabled = false;
  }
  function updateKind() {
    const kind = kindSelect.value;
    document.getElementById('report-value-label').textContent =
      kind === 'link'
        ? 'Le lien concerné'
        : kind === 'phone'
          ? 'Le numéro concerné'
          : 'Le message concerné';
    value.maxLength = kind === 'message' ? 4000 : kind === 'phone' ? 35 : 2048;
    value.setAttribute('inputmode', kind === 'phone' ? 'tel' : kind === 'link' ? 'url' : 'text');
    value.placeholder =
      kind === 'link'
        ? 'https://exemple.example/…'
        : kind === 'phone'
          ? '+229 01 XX XX XX XX — remplacez les X par les chiffres'
          : 'Le message, sans codes ni informations personnelles inutiles.';
    error.textContent = '';
    value.removeAttribute('aria-invalid');
  }
  kindSelect.addEventListener('change', () => {
    value.value = '';
    updateKind();
  });
  form.addEventListener('input', (event) => {
    if (event.target !== proofInput) {
      error.textContent = '';
      value.removeAttribute('aria-invalid');
    }
  });
  proofInput.addEventListener('change', async () => {
    const version = ++proofVersion;
    const file = proofInput.files[0];
    document.getElementById('remove-proof').hidden = !file;
    if (proofUrl) URL.revokeObjectURL(proofUrl);
    proofUrl = null;
    proofValid = false;
    proofPreview.hidden = true;
    proofError.textContent = '';
    if (!file) return;
    proofPending = true;
    save.disabled = true;
    try {
      if (file.size > 5 * 1024 * 1024) throw new Error('La preuve dépasse la limite de 5 Mo.');
      if (!['image/png', 'image/jpeg', 'image/webp'].includes(file.type))
        throw new Error(
          'Choisissez une image PNG, JPEG ou WebP. Les SVG et autres formats sont refusés.'
        );
      const bytes = new Uint8Array(await file.slice(0, 32).arrayBuffer());
      if (version !== proofVersion) return;
      const png =
        bytes.length >= 8 && [137, 80, 78, 71, 13, 10, 26, 10].every((v, i) => bytes[i] === v);
      const jpeg = bytes.length >= 3 && bytes[0] === 255 && bytes[1] === 216 && bytes[2] === 255;
      const webp =
        bytes.length >= 12 &&
        String.fromCharCode(...bytes.slice(0, 4)) === 'RIFF' &&
        String.fromCharCode(...bytes.slice(8, 12)) === 'WEBP';
      if (!(
        (file.type === 'image/png' && png) ||
        (file.type === 'image/jpeg' && jpeg) ||
        (file.type === 'image/webp' && webp)
      ))
        throw new Error('La signature du fichier ne correspond pas à une image acceptée.');
      proofUrl = URL.createObjectURL(file);
      proofPreview.src = proofUrl;
      proofPreview.hidden = false;
      proofValid = true;
    } catch (err) {
      proofError.textContent = err.message;
    } finally {
      if (version === proofVersion) {
        proofPending = false;
        save.disabled = false;
      }
    }
  });
  document.getElementById('remove-proof').addEventListener('click', () => {
    resetProof();
    error.textContent = '';
  });
  proofPreview.addEventListener('error', () => {
    proofValid = false;
    proofPreview.hidden = true;
    proofError.textContent =
      'L’image ne peut pas être affichée. Choisissez une image valide ou retirez ce fichier.';
  });
  document.getElementById('clear-report-form').addEventListener('click', () => {
    form.reset();
    resetProof();
    updateKind();
    error.textContent = '';
    say('Formulaire effacé. Les brouillons déjà enregistrés ne sont pas modifiés.');
  });
  save.disabled = false;
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    error.textContent = '';
    if (document.getElementById('report-website').value) {
      error.textContent =
        'Le brouillon ne peut pas être enregistré. Le champ de contrôle doit rester vide.';
      return;
    }
    const checked = ThreatRules.validate(kindSelect.value, value.value);
    if (!checked.valid) {
      error.textContent = checked.error;
      value.setAttribute('aria-invalid', 'true');
      value.focus();
      return;
    }
    if (!document.getElementById('report-consent').checked) {
      error.textContent =
        'Votre accord est nécessaire pour conserver un brouillon sur cet appareil.';
      document.getElementById('report-consent').focus();
      return;
    }
    if (proofPending) {
      error.textContent = 'Attendez la fin de la vérification locale du fichier.';
      return;
    }
    if (proofInput.files.length && !proofValid) {
      error.textContent =
        'La preuve n’est pas valide. Remplacez-la ou retirez le fichier avant de réessayer.';
      proofInput.focus();
      return;
    }
    const old = save.innerHTML;
    save.disabled = true;
    save.textContent = 'Enregistrement local…';
    try {
      const result = await ReportRepository.add({
        kind: kindSelect.value,
        value: checked.value,
        description: document.getElementById('report-description').value,
        proof: proofValid ? proofInput.files[0] : null,
        consent: true,
      });
      form.reset();
      resetProof();
      updateKind();
      say(
        result.persisted
          ? 'Brouillon enregistré sur cet appareil. Aucun envoi réel, aucun fichier de preuve conservé et aucune publication.'
          : 'Brouillon conservé dans cette session seulement : la sauvegarde persistante a échoué. Aucun envoi réel.'
      );
      await render();
    } catch (err) {
      error.textContent = err.message;
    } finally {
      save.innerHTML = old;
      save.disabled = false;
    }
  });
  window.addEventListener('pagehide', () => {
    if (proofUrl) URL.revokeObjectURL(proofUrl);
  });
});
