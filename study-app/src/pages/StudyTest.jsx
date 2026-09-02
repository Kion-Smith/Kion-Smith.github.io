import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDeck } from '../lib/useDeck';
import { recordAnswer } from '../lib/storage';

function normalize(text) {
  return text.trim().toLowerCase().replace(/\s+/g, ' ');
}

export default function StudyTest() {
  const { deckPath, deck, error } = useDeck();

  if (error) return <div className="banner error">Couldn't load this deck: {error}</div>;
  if (!deck) return <p className="hint">Loading deck…</p>;

  return <TestSession deckPath={deckPath} deck={deck} />;
}

function TestSession({ deckPath, deck }) {
  // Test mode covers the whole deck (not filtered to unmastered cards) since
  // its purpose is to measure where you stand right now, not to drill.
  const cards = useMemo(() => [...deck.cards].sort(() => Math.random() - 0.5), [deck]);
  const [answers, setAnswers] = useState({}); // cardId -> typed value
  const [submitted, setSubmitted] = useState(false);
  const [results, setResults] = useState(null);

  if (cards.length === 0) {
    return (
      <div className="empty-state">
        <h2>This deck has no cards yet</h2>
        <Link to={`/deck/${encodeURIComponent(deckPath)}`} className="btn">
          Back to deck
        </Link>
      </div>
    );
  }

  const submit = () => {
    let correctCount = 0;
    const perCard = cards.map((card) => {
      const typed = answers[card.id] || '';
      const correct = normalize(typed) === normalize(card.answer);
      recordAnswer(deckPath, card.id, correct);
      if (correct) correctCount++;
      return { card, typed, correct };
    });
    setResults({ perCard, correctCount });
    setSubmitted(true);
  };

  if (submitted && results) {
    return (
      <div>
        <div className="session-summary panel">
          <h2>Test results</h2>
          <div className="score">
            {results.correctCount}/{cards.length}
          </div>
        </div>
        {results.perCard
          .filter((r) => !r.correct)
          .map((r) => (
            <div key={r.card.id} className="panel">
              <strong>{r.card.question}</strong>
              <p className="hint">Your answer: {r.typed || '(blank)'}</p>
              <p className="hint">Correct answer: {r.card.answer}</p>
            </div>
          ))}
        <div className="btn-row" style={{ justifyContent: 'center', marginTop: '1rem' }}>
          <Link to={`/deck/${encodeURIComponent(deckPath)}`} className="btn primary">
            Back to deck
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1>{deck.title} — Test</h1>
      {cards.map((card, i) => (
        <div key={card.id} className="panel">
          <p>
            <strong>
              {i + 1}. {card.question}
            </strong>
          </p>
          <input
            className="answer-input"
            value={answers[card.id] || ''}
            onChange={(e) => setAnswers((a) => ({ ...a, [card.id]: e.target.value }))}
            placeholder="Your answer…"
          />
        </div>
      ))}
      <div className="btn-row">
        <button className="btn primary" onClick={submit}>
          Submit test
        </button>
      </div>
    </div>
  );
}
