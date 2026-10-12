'use strict';
/** Brouillons PRIVÉS sur cet appareil. Aucun serveur, publication ou preuve de fraude. */
(function (root) {
  const KEY = 'tchatzsafe_report_drafts_v1',
    TTL = 30 * 24 * 60 * 60 * 1000;
  const statuses = {
    draft: 'Brouillon local · non transmis',
    review: 'Revue simulée · non transmis',
    closed: 'Classé localement · non transmis',
  };
  const allowedStatus = (status) => Object.hasOwn(statuses, status);
  function valid(record) {
    return (
      record &&
      typeof record === 'object' &&
      typeof record.id === 'string' &&
      /^[a-z0-9-]{1,80}$/i.test(record.id) &&
      ['link', 'message', 'phone'].includes(record.kind) &&
      typeof record.value === 'string' &&
      record.value.length <= 4000 &&
      typeof record.description === 'string' &&
      record.description.length <= 1000 &&
      allowedStatus(record.status) &&
      Number.isFinite(Date.parse(record.createdAt)) &&
      Date.now() - Date.parse(record.createdAt) < TTL &&
      Date.parse(record.createdAt) <= Date.now() + 60000
    );
  }
  function list() {
    const raw = root.Store.read(KEY, []);
    const list = Array.isArray(raw) ? raw.filter(valid).slice(-20) : [];
    if (Array.isArray(raw) && list.length !== raw.length) root.Store.write(KEY, list);
    return list;
  }
  function add({ kind, value, description = '', proof = null, consent = false }) {
    if (!consent)
      throw new Error(
        'Votre accord est nécessaire pour enregistrer un brouillon sur cet appareil.'
      );
    const input = root.ThreatRules.validate(kind, value);
    if (!input.valid) throw new Error(input.error);
    if (typeof description !== 'string' || description.length > 1000)
      throw new Error('La description doit contenir au maximum 1 000 caractères.');
    const current = list();
    if (current.filter((r) => Date.now() - Date.parse(r.createdAt) < 60000).length >= 5)
      throw new Error(
        'Cinq brouillons ont déjà été créés cette minute. Attendez un instant avant d’en ajouter un autre. Cette limite est locale, pas une protection serveur.'
      );
    if (current.length >= 20)
      throw new Error(
        'La limite locale de 20 brouillons est atteinte. Supprimez un brouillon avant d’en ajouter un autre.'
      );
    const id = root.crypto?.randomUUID
      ? root.crypto.randomUUID()
      : `local-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
    const now = new Date().toISOString();
    const record = {
      id,
      kind,
      value: input.value,
      description: description.trim(),
      proof:
        proof &&
        ['image/png', 'image/jpeg', 'image/webp'].includes(proof.type) &&
        proof.size <= 5 * 1024 * 1024
          ? { type: proof.type, size: proof.size }
          : null,
      status: 'draft',
      createdAt: now,
      consentAt: now,
      expiresAt: new Date(Date.now() + TTL).toISOString(),
      note: '',
    };
    current.push(record);
    const persisted = root.Store.write(KEY, current);
    return { record, persisted };
  }
  function remove(id) {
    const items = list();
    if (!items.some((r) => r.id === id)) return false;
    return root.Store.write(
      KEY,
      items.filter((r) => r.id !== id)
    );
  }
  function setStatus(id, status, note = '') {
    if (!allowedStatus(status)) throw new Error('Statut local invalide.');
    if (typeof note !== 'string' || note.length > 500)
      throw new Error('La note est limitée à 500 caractères.');
    const items = list();
    const found = items.find((r) => r.id === id);
    if (!found) throw new Error('Le brouillon est introuvable ou a expiré.');
    found.status = status;
    found.note = note.trim();
    found.updatedAt = new Date().toISOString();
    return root.Store.write(KEY, items);
  }
  function clear() {
    return root.Store.remove(KEY);
  }
  root.ReportRepository = {
    list,
    add,
    remove,
    setStatus,
    clear,
    statuses,
    ttlDays: 30,
    get isPersistent() {
      return root.Store.persistent;
    },
  };
  if (typeof module !== 'undefined' && module.exports) module.exports = root.ReportRepository;
})(typeof window === 'undefined' ? globalThis : window);
