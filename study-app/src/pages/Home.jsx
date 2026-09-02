import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchManifest } from '../lib/deckLoader';

export default function Home() {
  const [manifest, setManifest] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchManifest()
      .then(setManifest)
      .catch((err) => setError(err.message));
  }, []);

  if (error) {
    return (
      <div className="banner error">
        Couldn't load the deck list: {error}. If you just added decks, the
        manifest may not have regenerated yet.
      </div>
    );
  }

  if (!manifest) {
    return <p className="hint">Loading decks…</p>;
  }

  if (!manifest.decks || manifest.decks.length === 0) {
    return (
      <div className="empty-state">
        <h2>No decks yet</h2>
        <p>Add a JSON deck file under /decks to get started.</p>
      </div>
    );
  }

  const bySubject = groupBy(manifest.decks, (d) => d.subject || 'General');

  return (
    <div>
      {Object.entries(bySubject).map(([subject, decks]) => (
        <div key={subject}>
          <div className="subject-heading">{subject}</div>
          <div className="deck-grid">
            {decks.map((deck) => (
              <Link
                key={deck.path}
                to={`/deck/${encodeURIComponent(deck.path)}`}
                className="deck-tile"
              >
                <h3>{deck.title}</h3>
                <div className="meta">{deck.cardCount} cards</div>
              </Link>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function groupBy(items, keyFn) {
  const out = {};
  for (const item of items) {
    const key = keyFn(item);
    (out[key] ||= []).push(item);
  }
  return out;
}
