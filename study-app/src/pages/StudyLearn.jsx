import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDeck } from '../lib/useDeck';
import { buildStudyQueue } from '../lib/srs';
import { recordAnswer } from '../lib/storage';

function normalize(text) {
  return text.trim().toLowerCase().replace(/\s+/g, ' ');
}

function pickDistractors(allCards, correctCard, count) {
  const others = allCards.filter((c) => c.id !== correctCard.id);
  const shuffled = [...others].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

export default function StudyLearn() {
  const { deckPath, deck, error } = useDeck();

  if (error) return <div className="banner error">Couldn't load this deck: {error}</div>;
  if (!deck) return <p className="hint">Loading deck…</p>;

  return <LearnSession deckPath={deckPath} deck={deck} />;
}

function LearnSession({ deckPath, deck }) {
  const queue = useMemo(() => buildStudyQueue(deck.cards, deckPath), [deck, deckPath]);
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState({ correct: 0, incorrect: 0 });
  const [revealed, setRevealed] = useState(null); // { correct: bool }
  const [typedValue, setTypedValue] = useState('');

  const canMultipleChoice = deck.cards.length >= 4;
  const card = queue[index];
  // Alternate style so it doesn't feel monotonous; falls back to typed if
  // the deck is too small for good distractors.
  const mode = canMultipleChoice && index % 2 === 0 ? 'choice' : 'typed';

  const choices = useMemo(() => {
    if (!card || mode !== 'choice') return [];
    const distractors = pickDistractors(deck.cards, card, 3);
    return [...distractors, card].sort(() => Math.random() - 0.5);
  }, [card, mode, deck.cards]);

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
    const total = score.correct + score.incorrect;
    return (
      <div className="session-summary panel">
        <h2>Session complete</h2>
        <div className="score">
          {score.correct}/{total}
        </div>
        <div className="btn-row" style={{ justifyContent: 'center', marginTop: '1rem' }}>
          <Link to={`/deck/${encodeURIComponent(deckPath)}`} className="btn primary">
            Back to deck
          </Link>
        </div>
      </div>
    );
  }

  const submitAnswer = (correct) => {
    recordAnswer(deckPath, card.id, correct);
    setScore((s) => ({
      correct: s.correct + (correct ? 1 : 0),
      incorrect: s.incorrect + (correct ? 0 : 1),
    }));
    setRevealed({ correct });
  };

  const next = () => {
    setRevealed(null);
    setTypedValue('');
    setIndex((i) => i + 1);
  };

  return (
    <div className="flashcard-stage">
      <div className="progress-bar" style={{ width: '100%', maxWidth: 560 }}>
        <div className="fill" style={{ width: `${(index / queue.length) * 100}%` }} />
      </div>
      <p className="hint">
        {index + 1} / {queue.length}
      </p>
      <div className="flashcard-face" style={{ position: 'static', minHeight: 'auto', width: '100%', maxWidth: 560 }}>
        {card.question}
      </div>

      {mode === 'choice' ? (
        <div className="choice-list">
          {choices.map((choice) => {
            let cls = 'choice';
            if (revealed) {
              if (choice.id === card.id) cls += ' correct';
              else if (revealed.picked === choice.id) cls += ' incorrect';
            }
            return (
              <button
                key={choice.id}
                className={cls}
                disabled={!!revealed}
                onClick={() => {
                  const correct = choice.id === card.id;
                  setRevealed({ correct, picked: choice.id });
                  recordAnswer(deckPath, card.id, correct);
                  setScore((s) => ({
                    correct: s.correct + (correct ? 1 : 0),
                    incorrect: s.incorrect + (correct ? 0 : 1),
                  }));
                }}
              >
                {choice.answer}
              </button>
            );
          })}
        </div>
      ) : (
        <>
          <input
            className="answer-input"
            value={typedValue}
            disabled={!!revealed}
            placeholder="Type your answer…"
            onChange={(e) => setTypedValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !revealed && typedValue.trim()) {
                submitAnswer(normalize(typedValue) === normalize(card.answer));
              }
            }}
          />
          {revealed && (
            <p className={revealed.correct ? 'hint' : 'banner error'}>
              {revealed.correct ? 'Correct!' : `Correct answer: ${card.answer}`}
            </p>
          )}
          {!revealed && (
            <div className="btn-row">
              <button
                className="btn primary"
                disabled={!typedValue.trim()}
                onClick={() => submitAnswer(normalize(typedValue) === normalize(card.answer))}
              >
                Check
              </button>
            </div>
          )}
        </>
      )}

      {revealed && (
        <div className="btn-row">
          <button className="btn primary" onClick={next}>
            Next
          </button>
        </div>
      )}
    </div>
  );
}
