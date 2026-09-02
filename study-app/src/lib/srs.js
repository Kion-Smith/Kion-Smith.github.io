// Card selection logic: turns a deck's cards + this browser's stats into an
// ordered study queue, weighted toward cards you frequently miss and away
// from cards you've mastered.

import { getDeckStats } from './storage';

// How many correct-in-a-row (box level) counts as "mastered" and can be
// excluded from a normal study session.
export const MASTERED_BOX = 4;

/**
 * @param {Array} cards
 * @param {string} deckId
 * @param {{includeMastered?: boolean, onlyMissed?: boolean}} options
 */
export function buildStudyQueue(cards, deckId, options = {}) {
  const { includeMastered = false, onlyMissed = false } = options;
  const stats = getDeckStats(deckId);

  const withStats = cards.map((card) => ({
    card,
    stat: stats[card.id] || { seen: 0, missed: 0, box: 0, lastSeen: null },
  }));

  let pool = withStats;
  if (!includeMastered) {
    pool = pool.filter(({ stat }) => stat.box < MASTERED_BOX);
  }
  if (onlyMissed) {
    pool = pool.filter(({ stat }) => stat.missed > 0);
  }

  // Weight = higher for never-seen and frequently-missed cards, lower for
  // cards sitting in a high box. This is a soft priority (via repeated
  // shuffled passes), not a strict sort, so a session doesn't feel like a
  // predictable drill.
  const weighted = pool.map(({ card, stat }) => {
    const missWeight = 1 + stat.missed * 2;
    const boxWeight = 1 / (stat.box + 1);
    const neverSeenBoost = stat.seen === 0 ? 1.5 : 1;
    return { card, weight: missWeight * boxWeight * neverSeenBoost };
  });

  return weightedShuffle(weighted).map((w) => w.card);
}

function weightedShuffle(weighted) {
  const items = [...weighted];
  const result = [];
  while (items.length) {
    const total = items.reduce((sum, i) => sum + i.weight, 0);
    let r = Math.random() * total;
    let idx = 0;
    for (; idx < items.length; idx++) {
      r -= items[idx].weight;
      if (r <= 0) break;
    }
    result.push(items.splice(Math.min(idx, items.length - 1), 1)[0]);
  }
  return result;
}

export function deckMasteryStats(cards, deckId) {
  const stats = getDeckStats(deckId);
  let mastered = 0;
  let missedOften = 0;
  let unseen = 0;
  for (const card of cards) {
    const stat = stats[card.id];
    if (!stat || stat.seen === 0) unseen++;
    else if (stat.box >= MASTERED_BOX) mastered++;
    if (stat && stat.missed >= 2) missedOften++;
  }
  return { total: cards.length, mastered, missedOften, unseen };
}
