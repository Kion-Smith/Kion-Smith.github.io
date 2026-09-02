import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDeck } from '../lib/useDeck';
import { buildStudyQueue } from '../lib/srs';
import { recordAnswer } from '../lib/storage';

export default function StudyFlashcards() {
  const { deckPath, deck, error } = useDeck();

  if (error) return <div className="banner error">Couldn't load this deck: {error}</div>;
  if (!deck) return <p className="hint">Loading deck…</p>;

  return <FlashcardSession deckPath={deckPath} deck={deck} />;
}

function FlashcardSession({ deckPath, deck }) {
  const queue = useMemo(() => buildStudyQueue(deck.cards, deckPath), [deck, deckPath]);
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [done, setDone] = useState({ known: 0, unknown: 0 });

  if (queue.length === 0) {
    return (
      <div className="empty-state">
        <h2>Nothing to study</h2>
        <p>Every card in this deck is currently mastered.</p>
        <Link to={`/deck/${encodeURIComponent(deckPath)}`} className="btn">
          Back to deck
        </Link>
      </div>
    );
  }

  if (index >= queue.length) {
    return (
      <div className="session-summary panel">
        <h2>Session complete</h2>
        <p className="hint">
          {done.known} known · {done.unknown} still tricky
        </p>
        <div className="btn-row" style={{ justifyContent: 'center', marginTop: '1rem' }}>
          <Link to={`/deck/${encodeURIComponent(deckPath)}`} className="btn primary">
            Back to deck
          </Link>
        </div>
      </div>
    );
  }

  const card = queue[index];

  const answer = (correct) => {
    recordAnswer(deckPath, card.id, correct);
    setDone((d) => ({
      known: d.known + (correct ? 1 : 0),
      unknown: d.unknown + (correct ? 0 : 1),
    }));
    setFlipped(false);
    setIndex((i) => i + 1);
  };

  return (
    <div className="flashcard-stage">
      <div className="progress-bar" style={{ width: '100%', maxWidth: 560 }}>
        <div className="fill" style={{ width: `${(index / queue.length) * 100}%` }} />
      </div>
      <div
        className={`flashcard ${flipped ? 'flipped' : ''}`}
        onClick={() => setFlipped((f) => !f)}
      >
        <div className="flashcard-inner">
          <div className="flashcard-face front">{card.question}</div>
          <div className="flashcard-face back">{card.answer}</div>
        </div>
      </div>
      <p className="hint">
        {index + 1} / {queue.length} — click card to flip
      </p>
      {flipped ? (
        <div className="btn-row">
          <button className="btn bad" onClick={() => answer(false)}>
            ✗ Didn't know it
          </button>
          <button className="btn good" onClick={() => answer(true)}>
            ✓ Knew it
          </button>
        </div>
      ) : (
        <div className="btn-row">
          <button className="btn" onClick={() => setFlipped(true)}>
            Show answer
          </button>
        </div>
      )}
    </div>
  );
}
