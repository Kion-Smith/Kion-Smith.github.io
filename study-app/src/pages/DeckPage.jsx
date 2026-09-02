import { Link } from 'react-router-dom';
import { useDeck } from '../lib/useDeck';
import { deckMasteryStats } from '../lib/srs';
import { hasUnsavedEdits } from '../lib/storage';

export default function DeckPage() {
  const { deckPath, deck, error } = useDeck();

  if (error) {
    return <div className="banner error">Couldn't load this deck: {error}</div>;
  }
  if (!deck) {
    return <p className="hint">Loading deck…</p>;
  }

  const stats = deckMasteryStats(deck.cards, deckPath);
  const unsaved = hasUnsavedEdits(deckPath);
  const hasMissed = stats.missedOften > 0;

  return (
    <div>
      <h1>{deck.title}</h1>
      {unsaved && (
        <div className="banner warn">
          You have local edits to this deck that aren't committed to the repo
          yet. <Link to={`/deck/${encodeURIComponent(deckPath)}/edit`}>Review &amp; export</Link>.
        </div>
      )}

      <div className="panel">
        <h3 style={{ marginBottom: '0.25rem' }}>Progress</h3>
        <MasteryBar stats={stats} />
        <div className="legend">
          <span><span className="dot mastered" />Mastered: {stats.mastered}</span>
          <span><span className="dot missed" />Frequently missed: {stats.missedOften}</span>
          <span><span className="dot unseen" />Unseen: {stats.unseen}</span>
          <span>Total: {stats.total}</span>
        </div>
      </div>

      <div className="mode-grid">
        <ModeCard
          to={`/deck/${encodeURIComponent(deckPath)}/flashcards`}
          title="Flashcards"
          desc="Flip through cards, mark what you know."
        />
        <ModeCard
          to={`/deck/${encodeURIComponent(deckPath)}/learn`}
          title="Learn"
          desc="Multiple choice and typed answers, mixes in your missed cards."
        />
        <ModeCard
          to={`/deck/${encodeURIComponent(deckPath)}/test`}
          title="Test"
          desc="Score yourself across the whole deck."
        />
        <ModeCard
          to={`/deck/${encodeURIComponent(deckPath)}/edit`}
          title="Edit deck"
          desc="Add/change cards, export to commit later."
        />
      </div>

      {hasMissed && (
        <p className="hint" style={{ marginTop: '1rem' }}>
          Tip: Learn and Test modes automatically prioritize the cards you
          miss most often.
        </p>
      )}
    </div>
  );
}

function MasteryBar({ stats }) {
  const { total, mastered, missedOften, unseen } = stats;
  if (total === 0) return null;
  const other = Math.max(total - mastered - unseen, 0);
  const pct = (n) => `${(n / total) * 100}%`;
  return (
    <div className="mastery-bar">
      <div className="seg mastered" style={{ width: pct(mastered) }} />
      <div className="seg other" style={{ width: pct(other) }} />
      <div className="seg unseen" style={{ width: pct(unseen) }} />
    </div>
  );
}

function ModeCard({ to, title, desc }) {
  return (
    <Link to={to} className="mode-card" style={{ textDecoration: 'none', color: 'inherit' }}>
      <h3>{title}</h3>
      <p>{desc}</p>
    </Link>
  );
}
