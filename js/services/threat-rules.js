'use strict';
/**
 * Démonstration pédagogique : observations syntaxiques uniquement.
 * Aucune navigation, API, réputation, IA distante, persistance ou score de risque.
 */
(function (root) {
  const SHORTENERS = new Set([
    'bit.ly',
    't.co',
    'tinyurl.com',
    'goo.gl',
    'ow.ly',
    'cutt.ly',
    'is.gd',
    'rb.gy',
    'shorturl.at',
  ]);
  const strip = (value) =>
    String(value)
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase();
  function validate(kind, value) {
    const text = String(value || '').trim();
    if (!text) return { valid: false, error: 'Renseignez le contenu à examiner.' };
    if (kind === 'link') {
      if (text.length > 2048)
        return { valid: false, error: 'Le lien ne doit pas dépasser 2 048 caractères.' };
      if (!/^https?:\/\//i.test(text))
        return {
          valid: false,
          error: 'Indiquez une adresse complète commençant par https:// ou http://.',
        };
      if (/[\s<>"\u0000-\u001f\u007f\\]/.test(text))
        return {
          valid: false,
          error:
            'Le lien contient un espace ou un caractère non valide. Copiez uniquement l’adresse complète.',
        };
      try {
        const url = new URL(text);
        if (
          !['http:', 'https:'].includes(url.protocol) ||
          !url.hostname ||
          (!url.hostname.startsWith('[') &&
            (url.hostname.startsWith('.') || url.hostname.includes('..')))
        )
          throw new Error('format');
        return { valid: true, value: text, url };
      } catch (_) {
        return {
          valid: false,
          error: 'Cette adresse n’est pas valide. Vérifiez son format sans l’ouvrir.',
        };
      }
    }
    if (kind === 'phone') {
      if (!/^\+[\d\s().-]+$/.test(text))
        return {
          valid: false,
          error:
            'Utilisez le format international avec + et l’indicatif du pays. Seuls chiffres, espaces, tirets et parenthèses sont acceptés.',
        };
      const normalized = text.replace(/[\s().-]/g, '');
      if (!/^\+[1-9]\d{6,14}$/.test(normalized))
        return {
          valid: false,
          error:
            'Le format international doit contenir entre 7 et 15 chiffres après le +, sans commencer par 0.',
        };
      return { valid: true, value: normalized };
    }
    if (kind === 'message') {
      if (text.length < 10)
        return {
          valid: false,
          error: 'Le message doit contenir au moins 10 caractères pour être lisible.',
        };
      if (text.length > 4000)
        return {
          valid: false,
          error: 'Limitez le message à 4 000 caractères et retirez les informations personnelles.',
        };
      return { valid: true, value: text };
    }
    return { valid: false, error: 'Choisissez un lien, un message ou un numéro.' };
  }
  function urlObservations(url) {
    const items = [];
    const add = (id, title, reason, evidence) => items.push({ id, title, reason, evidence });
    if (url.protocol === 'http:')
      add(
        'http',
        'Adresse en HTTP, sans HTTPS',
        'Le protocole saisi est HTTP, qui ne chiffre pas les échanges. Une éventuelle redirection ou mise à niveau vers HTTPS n’a pas été vérifiée. HTTPS ne prouve pas non plus qu’un site est honnête.',
        'http://'
      );
    if (url.username || url.password)
      add(
        'userinfo',
        'Identifiant placé avant le domaine',
        'Le texte avant le signe @ n’est pas le domaine de destination. Cette structure peut induire en erreur. Le domaine réel est indiqué ci-dessous.',
        url.hostname
      );
    if (SHORTENERS.has(url.hostname.toLowerCase()))
      add(
        'shortener',
        'Destination masquée par un raccourcisseur',
        'Ce service raccourcit des adresses. Sans consulter la redirection — ce que cet outil ne fait pas — la destination finale est inconnue.',
        url.hostname
      );
    if (/(^|\.)xn--/.test(url.hostname))
      add(
        'punycode',
        'Nom de domaine internationalisé',
        'Ce nom utilise l’encodage « xn-- » pour des caractères non ASCII. C’est un format légitime, mais des caractères visuellement proches peuvent être trompeurs.',
        url.hostname
      );
    if (/^(?:\d{1,3}\.){3}\d{1,3}$/.test(url.hostname) || url.hostname.startsWith('['))
      add(
        'ip',
        'Adresse IP plutôt qu’un nom de domaine',
        'L’adresse utilise directement une IP. Ce n’est pas une preuve de fraude, mais elle n’identifie pas à elle seule un organisme.',
        url.hostname
      );
    if (url.port && !['80', '443'].includes(url.port))
      add(
        'port',
        'Port non habituel',
        'L’adresse précise un port autre que les ports web habituels. Cela peut correspondre à un service légitime ; vérifiez-le indépendamment.',
        `Port ${url.port}`
      );
    if (
      [...url.searchParams.keys()].some((k) =>
        /^(?:password|passwd|token|access_token|otp|pin|secret|code)$/i.test(k)
      )
    )
      add(
        'sensitive-query',
        'Paramètre potentiellement sensible',
        'L’adresse contient un nom de paramètre associé à un code ou un secret. Ne partagez pas cette adresse avec un service externe. Sa valeur n’est pas affichée.'
      );
    return items;
  }
  function analyze(kind, value) {
    const input = validate(kind, value);
    if (!input.valid) throw new Error(input.error);
    let observations = [];
    const tips = [
      'N’ouvrez pas un lien douteux pour le « tester ». Retrouvez le service dans son application ou en saisissant son adresse officielle.',
      'Vérifiez la demande par un autre canal : un appel à un numéro connu ou le support officiel, pas les coordonnées contenues dans le message.',
    ];
    if (kind === 'link') observations = urlObservations(input.url);
    if (kind === 'message') {
      const text = strip(input.value);
      const add = (id, title, reason) => observations.push({ id, title, reason });
      if (
        /urgent|immediatement|dans\s+\d+\s*minutes?|derniere\s+chance|sera\s+(?:bloque|suspendu)/.test(
          text
        )
      )
        add(
          'urgency',
          'Pression ou urgence dans le texte',
          'Le message contient une expression d’urgence. Les fraudeurs peuvent chercher à empêcher la vérification, mais ce mot seul ne permet pas de conclure.'
        );
      const secretRequest =
        /(?:envoyez|donnez|communiquez|transmettez|partagez|confirmez|saisissez)[\s\S]{0,65}?(?:code\s*(?:pin|otp|de verification)|mot de passe|code secret)/g;
      let match;
      while ((match = secretRequest.exec(text))) {
        const before = text.slice(Math.max(0, match.index - 18), match.index);
        if (/(?:ne\s+|n['’])$/.test(before) || /\b(?:jamais|pas)\b/.test(match[0])) continue;
        add(
          'secret',
          'Demande de code ou de mot de passe',
          'Une demande de transmettre un code PIN, de connexion ou un mot de passe est présente. Un code d’authentification est un secret : ne l’envoyez pas à votre interlocuteur.'
        );
        tips.push(
          'Ne communiquez aucun code PIN ni code d’authentification. Si vous l’avez déjà fait, contactez le support officiel et sécurisez le compte.'
        );
        break;
      }
      if (
        /(?:rendement|gains?|profit)[\s\S]{0,50}(?:garanti|sans risque)|(?:doublez|triplez)[\s\S]{0,30}(?:argent|mise)|\d+\s*%\s*(?:par|chaque)\s*(?:jour|semaine)/.test(
          text
        )
      )
        add(
          'returns',
          'Promesse de rendement à vérifier',
          'Le texte rapproche un gain d’une garantie ou d’un rendement rapide. Vérifiez l’agrément de l’organisme et le risque réel du placement auprès de l’autorité financière compétente.'
        );
      if (
        /(?:frais de dossier|frais de recrutement|payer[\s\S]{0,30}(?:entretien|emploi|lot)|frais[\s\S]{0,30}(?:debloquer|liberer|gain))/.test(
          text
        )
      )
        add(
          'advance-fee',
          'Paiement préalable mentionné',
          'Le texte mentionne des frais pour obtenir une opportunité ou un gain. Vérifiez la demande indépendamment avant tout versement.'
        );
      const urls = (input.value.match(/https?:\/\/[^\s<>"']+/gi) || []).slice(0, 20);
      for (const raw of urls) {
        const parsed = validate('link', raw.replace(/[),.;!?]+$/, ''));
        if (parsed.valid) observations.push(...urlObservations(parsed.url));
      }
    }
    if (kind === 'phone') {
      tips.splice(
        0,
        tips.length,
        'Un format de numéro valide ne révèle ni son titulaire ni sa réputation. Les règles locales ne peuvent pas vérifier ces informations.',
        'L’identité affichée lors d’un appel peut être usurpée. Rappelez l’organisme avec un numéro trouvé dans son application ou sur son site officiel.',
        'Ne partagez aucun code d’authentification et ne payez pas sous la pression d’un appel.'
      );
    }
    const dedup = [...new Map(observations.map((o) => [o.id + (o.evidence || ''), o])).values()];
    return {
      mode: 'local-demo',
      kind,
      observations: dedup,
      tips: [...new Set(tips)],
      risk: null,
      canDetermineSafety: false,
      host: kind === 'link' ? input.url.hostname : null,
      limitations:
        'Aucune URL n’a été ouverte. Aucune réputation, redirection, pièce jointe, identité ou présence de logiciel malveillant n’a été vérifiée.',
    };
  }
  root.ThreatRules = { validate, analyze, urlObservations };
  if (typeof module !== 'undefined' && module.exports) module.exports = root.ThreatRules;
})(typeof window === 'undefined' ? globalThis : window);
