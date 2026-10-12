'use strict';
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('analyzer-form'),
    input = document.getElementById('suspect-input'),
    error = document.getElementById('analyzer-error'),
    result = document.getElementById('analysis-result'),
    empty = document.getElementById('analysis-empty'),
    submit = document.getElementById('analyzer-submit');
  let kind = 'link',
    revision = 0;
  const labels = {
    link: {
      label: 'Le lien à examiner',
      placeholder: 'https://exemple.example/connexion',
      max: 2048,
      mode: 'url',
    },
    message: {
      label: 'Le message à examiner',
      placeholder: 'Collez le message en retirant les noms, codes et informations personnelles.',
      max: 4000,
      mode: 'text',
    },
    phone: {
      label: 'Le numéro à examiner',
      placeholder: '+229 01 XX XX XX XX — remplacez les X par les chiffres',
      max: 35,
      mode: 'tel',
    },
  };
  const samples = {
    link: 'http://banque.example@verification.example/connexion?code=exemple',
    message:
      'URGENT : votre compte sera bloqué dans 10 minutes. Envoyez votre code PIN pour annuler le transfert.',
    phone: '+999 123 456 789',
  };
  function resetOutput() {
    revision++;
    error.textContent = '';
    input.removeAttribute('aria-invalid');
    result.innerHTML = '';
    result.hidden = true;
    empty.hidden = false;
  }
  document.querySelectorAll('[data-analysis-kind]').forEach((button) =>
    button.addEventListener('click', () => {
      kind = button.dataset.analysisKind;
      document.querySelectorAll('[data-analysis-kind]').forEach((b) => {
        b.classList.toggle('active', b === button);
        b.setAttribute('aria-pressed', String(b === button));
      });
      input.value = '';
      input.placeholder = labels[kind].placeholder;
      input.maxLength = labels[kind].max;
      input.setAttribute('inputmode', labels[kind].mode);
      input.rows = kind === 'message' ? 6 : 3;
      document.getElementById('suspect-label').textContent = labels[kind].label;
      document.getElementById('sample-note').textContent =
        kind === 'phone'
          ? 'L’exemple utilise un indicatif fictif (+999). Seul le format sera examiné.'
          : 'Les exemples sont inventés ; les domaines .example ne désignent pas des services réels.';
      resetOutput();
    })
  );
  input.addEventListener('input', resetOutput);
  document.getElementById('load-example').addEventListener('click', () => {
    input.value = samples[kind];
    resetOutput();
    input.focus();
  });
  document.getElementById('clear-analysis').addEventListener('click', () => {
    form.reset();
    resetOutput();
    input.focus();
  });
  submit.disabled = false;
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    resetOutput();
    const validated = ThreatRules.validate(kind, input.value);
    if (!validated.valid) {
      error.textContent = validated.error;
      input.setAttribute('aria-invalid', 'true');
      input.focus();
      return;
    }
    const requestRevision = revision,
      requestKind = kind,
      requestValue = input.value;
    const old = submit.innerHTML;
    submit.disabled = true;
    submit.textContent = 'Lecture locale en cours…';
    submit.setAttribute('aria-busy', 'true');
    try {
      await new Promise((resolve) => requestAnimationFrame(resolve));
      if (requestRevision !== revision) return;
      const data = ThreatRules.analyze(requestKind, requestValue),
        e = App.escapeHtml;
      const count = data.observations.length;
      result.innerHTML = `<p class="eyebrow">LECTURE LOCALE · DÉMONSTRATION</p><h2 tabindex="-1">${kind === 'phone' ? 'Format examiné, réputation inconnue' : count ? `${count} observation${count > 1 ? 's' : ''} à vérifier` : 'Aucun indicateur de ces règles détecté'}</h2><p>${kind === 'phone' ? 'Le format est compatible avec une écriture internationale. Cela ne vérifie ni l’indicatif, ni l’attribution, ni le titulaire, ni la réputation du numéro.' : count ? 'Ces observations ont été calculées à partir du texte saisi, sans consulter de service externe. Elles ne prouvent pas à elles seules une fraude.' : 'Les règles locales n’ont rien relevé. Elles sont limitées : le contenu peut malgré tout être malveillant.'}</p>${data.host ? `<p>Domaine lu dans l’adresse : <code>${e(data.host)}</code>. Ce domaine n’a pas été visité.</p>` : ''}<div class="notice">${App.icon('alert')}<div><strong>Risque réel non déterminable</strong>Aucun score ni niveau de risque n’est attribué : aucun moteur de sécurité ou service de réputation n’est connecté. L’absence d’indicateur n’est jamais une garantie de sûreté.</div></div>${count ? `<div class="indicator-list">${data.observations.map((item) => `<article class="indicator"><h3>${e(item.title)}</h3><p>${e(item.reason)}</p>${item.evidence ? `<code>${e(item.evidence)}</code>` : ''}</article>`).join('')}</div>` : ''}<h3 class="mt-8">Les bons réflexes maintenant</h3><ul class="check-list">${data.tips.map((tip) => `<li>${App.icon('check')}<span>${e(tip)}</span></li>`).join('')}</ul><details class="rule-details"><summary>Comprendre les règles et les limites</summary><p>${e(data.limitations)}</p><p>Les règles observent HTTP, la présence d’un identifiant avant @, certains raccourcisseurs connus (comparaison faite sans le préfixe « www. » ni le point final), l’encodage xn--, les adresses IP, les ports et les noms de paramètres potentiellement sensibles. Pour les messages, elles cherchent des expressions de pression, de demande de secret, de rendement ou de paiement préalable. Le contexte peut produire des faux positifs et de nombreuses menaces ne sont pas détectées.</p><p>Le contenu reste dans cette page : TchatzSafe ne l’écrit pas dans le stockage du navigateur et ne l’envoie à aucun serveur. Le texte saisi peut toutefois réapparaître dans ce champ si vous revenez en arrière dans cet onglet : effacez-le avant de passer à autre chose.</p></details><a class="text-link mt-4" href="menaces.html">Comprendre les mécanismes ${App.icon('arrow')}</a>`;
      result.hidden = false;
      empty.hidden = true;
      result.querySelector('h2').focus({ preventScroll: true });
    } catch (_) {
      error.textContent =
        'La lecture locale a échoué. Aucun résultat de sécurité n’a été produit. Vérifiez le format et réessayez.';
    } finally {
      submit.disabled = false;
      submit.innerHTML = old;
      submit.removeAttribute('aria-busy');
    }
  });
});
