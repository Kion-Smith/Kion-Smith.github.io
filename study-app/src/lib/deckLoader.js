// Fetches deck data from the static /decks files served at the repo root,
// and merges in any local (unsaved) edits from the overlay.

import { getOverlay } from './storage';

const MANIFEST_URL = '/decks/decks-manifest.json';

export async function fetchManifest() {
  const res = await fetch(MANIFEST_URL, { cache: 'no-store' });
  if (!res.ok) {
    throw new Error(`Could not load ${MANIFEST_URL} (${res.status})`);
  }
  return res.json();
}

export async function fetchDeck(deckPath) {
  const res = await fetch(`/decks/${deckPath}`, { cache: 'no-store' });
  if (!res.ok) {
    throw new Error(`Could not load deck ${deckPath} (${res.status})`);
  }
  const data = await res.json();
  return applyOverlay(deckPath, data);
}

function applyOverlay(deckId, deckData) {
  const overlay = getOverlay(deckId);
  const byId = new Map(deckData.cards.map((c) => [c.id, c]));

  for (const [cardId, value] of Object.entries(overlay.cards)) {
    if (value === null) {
      byId.delete(cardId);
    } else {
      byId.set(cardId, value);
    }
  }

  return {
    ...deckData,
    title: overlay.title || deckData.title,
    cards: Array.from(byId.values()),
  };
}

/** Builds the exact JSON file contents to hand back for re-committing. */
export function serializeDeckForExport(deckData) {
  return JSON.stringify({ title: deckData.title, cards: deckData.cards }, null, 2) + '\n';
}

export function downloadTextFile(filename, contents) {
  const blob = new Blob([contents], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
