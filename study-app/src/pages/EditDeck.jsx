import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useDeck } from '../lib/useDeck';
import { downloadTextFile, serializeDeckForExport } from '../lib/deckLoader';
import {
  clearOverlay,
  deleteOverlayCard,
  hasUnsavedEdits,
  upsertOverlayCard,
} from '../lib/storage';
import { makeCardId } from '../lib/id';

export default function EditDeck() {
  const { deckPath, deck, error, reload } = useDeck();

  if (error) return <div className="banner error">Couldn't load this deck: {error}</div>;
  if (!deck) return <p className="hint">Loading deck…</p>;

  return <Editor deckPath={deckPath} deck={deck} reload={reload} />;
}

function Editor({ deckPath, deck, reload }) {
  const [newQ, setNewQ] = useState('');
  const [newA, setNewA] = useState('');
  const unsaved = hasUnsavedEdits(deckPath);
  const filename = deckPath.split('/').pop();

  const updateCard = (card, field, value) => {
    upsertOverlayCard(deckPath, { ...card, [field]: value });
    reload();
  };

  const removeCard = (cardId) => {
    deleteOverlayCard(deckPath, cardId);
    reload();
  };

  const addCard = () => {
    if (!newQ.trim() || !newA.trim()) return;
    upsertOverlayCard(deckPath, { id: makeCardId(), question: newQ.trim(), answer: newA.trim() });
    setNewQ('');
    setNewA('');
    reload();
  };

  const exportDeck = () => {
    const contents = serializeDeckForExport(deck);
    downloadTextFile(filename, contents);
  };

  const discardEdits = () => {
    if (!confirm('Discard all local edits to this deck? This cannot be undone.')) return;
    clearOverlay(deckPath);
    reload();
  };

  return (
    <div>
      <h1>Edit — {deck.title}</h1>
      <p className="hint">
        Changes here are saved to this browser only. When you're happy with
        them, export the deck and commit the file to <code>/decks/{deckPath}</code>{' '}
        to make the changes permanent.
      </p>

      {unsaved && (
        <div className="banner warn">
          <div className="btn-row">
            <button className="btn primary" onClick={exportDeck}>
              ⬇ Export deck JSON
            </button>
            <button className="btn bad" onClick={discardEdits}>
              Discard local edits
            </button>
          </div>
        </div>
      )}

      <div className="panel">
        <h3>Add a card</h3>
        <div className="editor-row">
          <textarea
            placeholder="Question"
            value={newQ}
            onChange={(e) => setNewQ(e.target.value)}
          />
          <textarea
            placeholder="Answer"
            value={newA}
            onChange={(e) => setNewA(e.target.value)}
          />
          <button className="btn primary" onClick={addCard}>
            Add
          </button>
        </div>
      </div>

      {deck.cards.map((card) => (
        <div key={card.id} className="editor-row panel">
          <textarea
            value={card.question}
            onChange={(e) => updateCard(card, 'question', e.target.value)}
          />
          <textarea
            value={card.answer}
            onChange={(e) => updateCard(card, 'answer', e.target.value)}
          />
          <button className="btn bad" onClick={() => removeCard(card.id)}>
            Delete
          </button>
        </div>
      ))}

      <div className="btn-row">
        <Link to={`/deck/${encodeURIComponent(deckPath)}`} className="btn">
          Done
        </Link>
      </div>
    </div>
  );
}
