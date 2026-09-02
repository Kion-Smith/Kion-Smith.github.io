// All persistence is client-side localStorage. There is no backend, so this
// data is per-browser. Two kinds of state are kept, both namespaced by deck id:
//
//  1. "overlay"  - local edits (added/changed/deleted cards) layered on top of
//                  the repo's JSON for a deck, until you export + commit them.
//  2. "stats"    - per-card study stats (times seen/missed, box level) used to
//                  prioritize what you get quizzed on.

const OVERLAY_PREFIX = 'studyapp:overlay:';
const STATS_PREFIX = 'studyapp:stats:';

function readJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function writeJSON(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // localStorage unavailable (private mode, quota, etc). Fail silently -
    // the app still works, it just won't persist across reloads.
  }
}

// ---- Overlay (local edits to a deck's cards) ----------------------------

/**
 * @returns {{cards: Record<string, object|null>, title?: string} }
 * cards maps cardId -> edited card object, or null if the card was deleted
 * locally. New cards (not present in the repo file) are just extra entries.
 */
export function getOverlay(deckId) {
  return readJSON(OVERLAY_PREFIX + deckId, { cards: {} });
}

export function saveOverlay(deckId, overlay) {
  writeJSON(OVERLAY_PREFIX + deckId, overlay);
}

export function upsertOverlayCard(deckId, card) {
  const overlay = getOverlay(deckId);
  overlay.cards[card.id] = card;
  saveOverlay(deckId, overlay);
  return overlay;
}

export function deleteOverlayCard(deckId, cardId) {
  const overlay = getOverlay(deckId);
  overlay.cards[cardId] = null;
  saveOverlay(deckId, overlay);
  return overlay;
}

export function clearOverlay(deckId) {
  localStorage.removeItem(OVERLAY_PREFIX + deckId);
}

export function hasUnsavedEdits(deckId) {
  const overlay = getOverlay(deckId);
  return Object.keys(overlay.cards).length > 0;
}

// ---- Stats (per-card study history) --------------------------------------

/** @returns {Record<string, {seen: number, missed: number, box: number, lastSeen: number|null}>} */
export function getDeckStats(deckId) {
  return readJSON(STATS_PREFIX + deckId, {});
}

export function saveDeckStats(deckId, stats) {
  writeJSON(STATS_PREFIX + deckId, stats);
}

export function getCardStat(deckId, cardId) {
  const stats = getDeckStats(deckId);
  return stats[cardId] || { seen: 0, missed: 0, box: 0, lastSeen: null };
}

export function recordAnswer(deckId, cardId, correct) {
  const stats = getDeckStats(deckId);
  const current = stats[cardId] || { seen: 0, missed: 0, box: 0, lastSeen: null };
  const next = {
    seen: current.seen + 1,
    missed: current.missed + (correct ? 0 : 1),
    // Leitner-style: correct answers move a card up a box (studied less
    // often), a miss drops it back to box 0 (studied most often).
    box: correct ? Math.min(current.box + 1, 5) : 0,
    lastSeen: Date.now(),
  };
  stats[cardId] = next;
  saveDeckStats(deckId, stats);
  return next;
}

export function resetDeckStats(deckId) {
  localStorage.removeItem(STATS_PREFIX + deckId);
}
