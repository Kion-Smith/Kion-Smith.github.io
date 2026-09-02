import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchDeck } from './deckLoader';

/**
 * Loads the deck named by the :deckId route param (a URL-encoded deck path,
 * e.g. "biology/cell-structure.json"). Exposes a reload() so pages that edit
 * the deck (via localStorage overlay) can refresh the merged view.
 */
export function useDeck() {
  const { deckId } = useParams();
  const deckPath = decodeURIComponent(deckId);
  const [deck, setDeck] = useState(null);
  const [error, setError] = useState(null);
  const [version, setVersion] = useState(0);

  const reload = useCallback(() => setVersion((v) => v + 1), []);

  useEffect(() => {
    let cancelled = false;
    setDeck(null);
    setError(null);
    fetchDeck(deckPath)
      .then((data) => {
        if (!cancelled) setDeck(data);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message);
      });
    return () => {
      cancelled = true;
    };
  }, [deckPath, version]);

  return { deckPath, deck, error, reload };
}
